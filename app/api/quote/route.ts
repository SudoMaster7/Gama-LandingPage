import { NextResponse } from "next/server";
import { quoteRequestSchema, type QuoteRequest } from "@/lib/schemas";
import { generateProtocol } from "@/lib/protocol";
import { checkRateLimit, pruneRateLimit, verifyTurnstile } from "@/lib/security";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase-server";
import { saveLeadToFile } from "@/lib/lead-fallback";
import { notifyNewLead } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "desconhecido";
}

export async function POST(req: Request) {
  pruneRateLimit();
  const ip = clientIp(req);

  // 1. Limite de abuso
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
      { status: 429, headers: { "retry-after": String(rate.retryAfter) } },
    );
  }

  // 2. Corpo
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  // 3. Validação no servidor (mesmo schema do cliente)
  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Confira os dados informados.", issues: parsed.error.issues.length },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // 4. Turnstile (só bloqueia quando configurado)
  const human = await verifyTurnstile(data.turnstileToken || undefined, ip);
  if (!human) {
    return NextResponse.json(
      { error: "Não foi possível validar o envio. Recarregue a página e tente novamente." },
      { status: 403 },
    );
  }

  try {
    const result = isSupabaseConfigured()
      ? await persistToSupabase(data)
      : await saveLeadToFile(data, generateProtocol);

    // 5. Notificação — falha no e-mail NÃO desfaz o lead.
    await notifyNewLead(result.protocol, data).catch((err) => {
      console.error("[quote] falha ao notificar responsável:", err);
    });

    return NextResponse.json(
      { protocol: result.protocol },
      { status: result.duplicated ? 200 : 201 },
    );
  } catch (err) {
    console.error("[quote] falha ao gravar solicitação:", err);
    return NextResponse.json(
      {
        error:
          "Não conseguimos enviar agora. Seus dados continuam preenchidos. Tente novamente ou utilize nosso canal de contato.",
      },
      { status: 500 },
    );
  }
}

async function persistToSupabase(
  data: QuoteRequest,
): Promise<{ protocol: string; duplicated: boolean }> {
  const db = supabaseAdmin();

  // Idempotência: mesma tentativa devolve o protocolo já gravado.
  const { data: existing } = await db
    .from("quote_requests")
    .select("protocol")
    .eq("idempotency_key", data.idempotencyKey)
    .maybeSingle();

  if (existing?.protocol) {
    return { protocol: existing.protocol as string, duplicated: true };
  }

  const protocol = generateProtocol();

  const { data: inserted, error } = await db
    .from("quote_requests")
    .insert({
      protocol,
      idempotency_key: data.idempotencyKey,
      name: data.name,
      business_name: data.businessName,
      preferred_channel: data.preferredChannel,
      phone: data.phone || null,
      email: data.email || null,
      city: data.city,
      uf: data.uf,
      segment: data.segment || null,
      purchase_type: data.purchaseType ?? null,
      notes: data.notes || null,
      needs_guidance: data.needsGuidance,
      source_page: data.sourcePage || null,
      utm_source: data.utmSource || null,
      utm_medium: data.utmMedium || null,
      utm_campaign: data.utmCampaign || null,
      marketing_opt_in: data.marketingOptIn,
    })
    .select("id, protocol")
    .single();

  if (error) throw error;

  if (data.items.length > 0) {
    const { error: itemsError } = await db.from("quote_items").insert(
      data.items.map((i) => ({
        request_id: inserted.id,
        product_slug: i.productSlug,
        variant_label: i.variantLabel ?? null,
        quantity: i.quantity ?? null,
        unit: i.unit ?? null,
        unknown_spec: i.unknownSpec,
      })),
    );
    if (itemsError) throw itemsError;
  }

  await db.from("stage_history").insert({
    request_id: inserted.id,
    from_stage: null,
    to_stage: "recebido",
    note: "Solicitação recebida pelo site.",
  });

  return { protocol: inserted.protocol as string, duplicated: false };
}
