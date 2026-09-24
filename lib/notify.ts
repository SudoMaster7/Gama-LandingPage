import "server-only";
import type { QuoteRequest } from "@/lib/schemas";
import { getProduct } from "@/lib/content";

/**
 * Notificação ao responsável comercial.
 * Usa Resend quando RESEND_API_KEY e LEADS_NOTIFY_TO estiverem definidos;
 * caso contrário, apenas registra no log (sem dados pessoais desnecessários).
 *
 * Uma falha aqui nunca desfaz o lead já gravado.
 */
export async function notifyNewLead(protocol: string, data: QuoteRequest): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_NOTIFY_TO;
  const from = process.env.LEADS_NOTIFY_FROM ?? "GAMA Site <onboarding@resend.dev>";

  const items =
    data.items.length > 0
      ? data.items
          .map((i) => {
            const name = getProduct(i.productSlug)?.name ?? i.productSlug;
            const qty = i.unknownSpec
              ? "não sabe informar"
              : [i.quantity, i.unit].filter(Boolean).join(" ") || "quantidade não informada";
            return `- ${name}${i.variantLabel ? ` (${i.variantLabel})` : ""}: ${qty}`;
          })
          .join("\n")
      : "- Nenhum produto selecionado";

  const contato =
    data.preferredChannel === "whatsapp" ? `WhatsApp: ${data.phone}` : `E-mail: ${data.email}`;

  const text = [
    `Nova solicitação de orçamento — ${protocol}`,
    "",
    `Nome: ${data.name}`,
    `Empresa: ${data.businessName}`,
    `Canal preferido: ${data.preferredChannel}`,
    contato,
    `Cidade/UF: ${data.city}/${data.uf}`,
    data.segment ? `Segmento: ${data.segment}` : null,
    data.purchaseType ? `Tipo de compra: ${data.purchaseType}` : null,
    data.needsGuidance ? "Marcou: precisa de orientação" : null,
    "",
    "Itens:",
    items,
    "",
    data.notes ? `Observações: ${data.notes}` : null,
    "",
    `Origem: ${data.sourcePage || "não informada"}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (!apiKey || !to) {
    console.info(
      `[quote] lead ${protocol} gravado (${data.items.length} item(ns)). ` +
        "Notificação por e-mail não configurada: defina RESEND_API_KEY e LEADS_NOTIFY_TO.",
    );
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      subject: `Nova cotação ${protocol} — ${data.businessName} (${data.city}/${data.uf})`,
      text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend respondeu ${res.status}: ${await res.text()}`);
  }
}
