"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Trash2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useQuote } from "@/lib/quote-store";
import { useHydrated } from "@/lib/use-hydrated";
import { getProduct, segments, products } from "@/lib/content";
import { quoteRequestSchema, UFS, UNITS } from "@/lib/schemas";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Errors = Record<string, string>;

const FIELD_LABEL = "mb-1.5 block text-sm font-semibold";
const FIELD_BOX =
  "w-full rounded-md border-2 border-[var(--gama-linha)] bg-white px-3.5 py-2.5 text-[0.95rem] focus:border-[var(--gama-verde)]";

export function QuoteForm() {
  const router = useRouter();
  const items = useQuote((s) => s.items);
  const remove = useQuote((s) => s.remove);
  const update = useQuote((s) => s.update);
  const clear = useQuote((s) => s.clear);
  const storedSegment = useQuote((s) => s.segment);

  const mounted = useHydrated();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [needsGuidance, setNeedsGuidance] = useState(false);
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [segmentOverride, setSegmentOverride] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // A escolha feita na navegação vale até o visitante alterar no formulário.
  const segment = segmentOverride ?? storedSegment ?? "";

  // Chave de idempotência: uma por tentativa de envio.
  const [idemKey, setIdemKey] = useState<string>(() => crypto.randomUUID());
  const regenKey = () => setIdemKey(crypto.randomUUID());

  useEffect(() => {
    if (mounted) track("start_quote", { items_count: items.length, position: "orcamento" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const itemRows = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        product: getProduct(item.productSlug),
      })),
    [items],
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      name: String(fd.get("name") ?? ""),
      businessName: String(fd.get("businessName") ?? ""),
      preferredChannel: channel,
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      city: String(fd.get("city") ?? ""),
      uf: String(fd.get("uf") ?? ""),
      segment,
      purchaseType: (String(fd.get("purchaseType") ?? "") || null) as
        | "recorrente"
        | "eventual"
        | "nao_sei"
        | null,
      notes: String(fd.get("notes") ?? ""),
      items: items.map((i) => ({
        productSlug: i.productSlug,
        variantLabel: i.variantLabel ?? null,
        quantity: i.quantity ?? null,
        unit: i.unit ?? null,
        unknownSpec: i.unknownSpec,
      })),
      needsGuidance,
      marketingOptIn: fd.get("marketingOptIn") === "on",
      sourcePage: typeof window !== "undefined" ? window.location.pathname : "",
      idempotencyKey: idemKey,
    };

    const parsed = quoteRequestSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setFormError("Confira os campos destacados.");
      track("submit_quote_error", { error_type: "validation" });
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    setErrors({});
    setFormError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setFormError(
          data.error ??
            "Não conseguimos enviar agora. Seus dados continuam preenchidos. Tente novamente ou utilize nosso canal de contato.",
        );
        track("submit_quote_error", { error_type: `http_${res.status}` });
        regenKey();
        setSubmitting(false);
        requestAnimationFrame(() => errorRef.current?.focus());
        return;
      }

      const data = (await res.json()) as { protocol: string };
      track("submit_quote_success", {
        items_count: items.length,
        segment: segment || undefined,
      });
      // Só limpamos a lista APÓS confirmação de gravação.
      clear();
      router.push(`/orcamento/enviado?p=${encodeURIComponent(data.protocol)}`);
    } catch {
      setFormError(
        "Não conseguimos enviar agora. Seus dados continuam preenchidos. Tente novamente ou utilize nosso canal de contato.",
      );
      track("submit_quote_error", { error_type: "network" });
      regenKey();
      setSubmitting(false);
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  if (!mounted) {
    return <p className="text-[var(--gama-suave)]">Carregando sua cotação…</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-10 lg:grid-cols-[1fr_22rem]">
      <div className="order-2 lg:order-1">
        {formError && (
          <div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="mb-6 flex gap-3 rounded-md border-2 border-red-300 bg-red-50 p-4"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" aria-hidden />
            <p className="text-sm font-medium text-red-800">{formError}</p>
          </div>
        )}

        <fieldset className="mb-8">
          <legend className="mb-4 text-xl font-extrabold">Seus dados</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome" name="name" required error={errors.name} />
            <Field
              label="Empresa ou nome do negócio"
              name="businessName"
              required
              error={errors.businessName}
            />
          </div>
        </fieldset>

        <fieldset className="mb-8">
          <legend className="mb-4 text-xl font-extrabold">Como prefere ser contatado</legend>
          <div className="mb-4 flex gap-3">
            {(["whatsapp", "email"] as const).map((c) => (
              <label
                key={c}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md border-2 px-4 py-2.5 font-semibold",
                  channel === c
                    ? "border-[var(--gama-verde)] bg-[var(--gama-verde-claro)]"
                    : "border-[var(--gama-linha)]",
                )}
              >
                <input
                  type="radio"
                  name="preferredChannel"
                  value={c}
                  checked={channel === c}
                  onChange={() => setChannel(c)}
                  className="accent-[var(--gama-verde)]"
                />
                {c === "whatsapp" ? "WhatsApp" : "E-mail"}
              </label>
            ))}
          </div>

          {channel === "whatsapp" ? (
            <Field
              label="WhatsApp com DDD"
              name="phone"
              type="tel"
              required
              placeholder="(11) 90000-0000"
              error={errors.phone}
            />
          ) : (
            <Field
              label="E-mail"
              name="email"
              type="email"
              required
              placeholder="voce@empresa.com.br"
              error={errors.email}
            />
          )}
        </fieldset>

        <fieldset className="mb-8">
          <legend className="mb-4 text-xl font-extrabold">Onde fica seu negócio</legend>
          <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
            <Field label="Cidade" name="city" required error={errors.city} />
            <div>
              <label htmlFor="uf" className={FIELD_LABEL}>
                UF <span className="text-red-600">*</span>
              </label>
              <select id="uf" name="uf" required className={FIELD_BOX} defaultValue="">
                <option value="" disabled>
                  —
                </option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
              {errors.uf && <FieldError id="uf">{errors.uf}</FieldError>}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="segment" className={FIELD_LABEL}>
                Segmento <span className="font-normal text-[var(--gama-suave)]">(opcional)</span>
              </label>
              <select
                id="segment"
                name="segment"
                className={FIELD_BOX}
                value={segment}
                onChange={(e) => setSegmentOverride(e.target.value)}
              >
                <option value="">Não informar</option>
                {segments.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
                <option value="outro">Outro</option>
              </select>
            </div>
            <div>
              <label htmlFor="purchaseType" className={FIELD_LABEL}>
                Compra{" "}
                <span className="font-normal text-[var(--gama-suave)]">(opcional)</span>
              </label>
              <select id="purchaseType" name="purchaseType" className={FIELD_BOX} defaultValue="">
                <option value="">Não informar</option>
                <option value="recorrente">Recorrente</option>
                <option value="eventual">Eventual</option>
                <option value="nao_sei">Ainda não sei</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="mb-8">
          <legend className="mb-4 text-xl font-extrabold">Observações</legend>
          <label htmlFor="notes" className={FIELD_LABEL}>
            Descreva sua necessidade{" "}
            <span className="font-normal text-[var(--gama-suave)]">(opcional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            maxLength={2000}
            className={FIELD_BOX}
            placeholder="Ex.: uso no balcão do açougue, compro hoje de outro fornecedor, preciso de entrega quinzenal…"
          />
          <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm">
            <input
              type="checkbox"
              name="marketingOptIn"
              className="mt-0.5 h-4 w-4 accent-[var(--gama-verde)]"
            />
            <span className="text-[var(--gama-suave)]">
              Quero receber novidades e campanhas da GAMA por e-mail ou WhatsApp. O retorno
              sobre esta cotação acontece de qualquer forma.
            </span>
          </label>
        </fieldset>

        <div className="rounded-lg border border-[var(--gama-linha)] bg-[var(--gama-filme)] p-5">
          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? "Enviando…" : "Enviar solicitação"}
          </Button>
          <p className="mt-3 text-sm text-[var(--gama-suave)]">
            Ao enviar, seus dados são usados para responder a esta solicitação. Veja a{" "}
            <Link href="/privacidade" className="underline">
              política de privacidade
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Lista de itens */}
      <aside className="order-1 lg:order-2">
        <div className="sticky top-24 rounded-lg border-2 border-[var(--gama-linha)] bg-white p-5">
          <h2 className="text-lg font-extrabold">
            Sua cotação{" "}
            <span className="tabular-nums text-[var(--gama-verde-escuro)]">
              ({items.length})
            </span>
          </h2>

          {errors.items && (
            <p className="mt-2 text-sm font-medium text-red-700">{errors.items}</p>
          )}

          {itemRows.length === 0 ? (
            <div className="mt-4">
              <p className="text-sm text-[var(--gama-suave)]">
                Nenhum produto selecionado ainda.
              </p>
              <ButtonLink href="/produtos" variant="outline" size="sm" className="mt-3 w-full">
                Escolher produtos
              </ButtonLink>
            </div>
          ) : (
            <ul className="mt-4 space-y-4">
              {itemRows.map((row) => (
                <li
                  key={`${row.productSlug}-${row.variantLabel ?? ""}`}
                  className="rounded-md border border-[var(--gama-linha)] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{row.product?.name ?? row.productSlug}</p>
                      {row.variantLabel && (
                        <p className="text-xs text-[var(--gama-suave)]">{row.variantLabel}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(row.productSlug, row.variantLabel)}
                      className="rounded p-1 text-[var(--gama-suave)] hover:text-red-600"
                      aria-label={`Remover ${row.product?.name ?? row.productSlug} da cotação`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-[1fr_7rem] gap-2">
                    <div>
                      <label
                        htmlFor={`qtd-${row.productSlug}`}
                        className="mb-1 block text-xs font-semibold"
                      >
                        Quantidade
                      </label>
                      <input
                        id={`qtd-${row.productSlug}`}
                        type="number"
                        min={1}
                        inputMode="numeric"
                        disabled={row.unknownSpec}
                        value={row.quantity ?? ""}
                        onChange={(e) =>
                          update(
                            row.productSlug,
                            { quantity: e.target.value ? Number(e.target.value) : null },
                            row.variantLabel,
                          )
                        }
                        className="w-full rounded border-2 border-[var(--gama-linha)] px-2 py-1.5 text-sm disabled:bg-[var(--gama-filme)]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`un-${row.productSlug}`}
                        className="mb-1 block text-xs font-semibold"
                      >
                        Unidade
                      </label>
                      <select
                        id={`un-${row.productSlug}`}
                        disabled={row.unknownSpec}
                        value={row.unit ?? ""}
                        onChange={(e) =>
                          update(
                            row.productSlug,
                            {
                              unit: (e.target.value || null) as (typeof UNITS)[number] | null,
                            },
                            row.variantLabel,
                          )
                        }
                        className="w-full rounded border-2 border-[var(--gama-linha)] px-2 py-1.5 text-sm disabled:bg-[var(--gama-filme)]"
                      >
                        <option value="">—</option>
                        {UNITS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label className="mt-2.5 flex cursor-pointer items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={row.unknownSpec}
                      onChange={(e) =>
                        update(
                          row.productSlug,
                          {
                            unknownSpec: e.target.checked,
                            ...(e.target.checked ? { quantity: null, unit: null } : {}),
                          },
                          row.variantLabel,
                        )
                      }
                      className="h-4 w-4 accent-[var(--gama-verde)]"
                    />
                    Não sei informar
                  </label>
                </li>
              ))}
            </ul>
          )}

          <label className="mt-5 flex cursor-pointer items-start gap-2.5 rounded-md bg-[var(--gama-filme)] p-3 text-sm">
            <input
              type="checkbox"
              checked={needsGuidance}
              onChange={(e) => setNeedsGuidance(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[var(--gama-verde)]"
            />
            <span>
              <strong className="block">Preciso de orientação</strong>
              <span className="text-[var(--gama-suave)]">
                Ainda não sei qual produto atende minha necessidade.
              </span>
            </span>
          </label>

          {itemRows.length > 0 && itemRows.length < products.length && (
            <ButtonLink href="/produtos" variant="ghost" size="sm" className="mt-3 w-full">
              Adicionar mais produtos
            </ButtonLink>
          )}
        </div>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={FIELD_LABEL}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-erro` : undefined}
        className={cn(FIELD_BOX, error && "border-red-400")}
      />
      {error && <FieldError id={name}>{error}</FieldError>}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={`${id}-erro`} className="mt-1.5 text-sm font-medium text-red-700">
      {children}
    </p>
  );
}
