/**
 * Eventos de análise. Nunca recebem nome, telefone, e-mail ou texto livre
 * (requisito de LGPD do briefing, seção 13/14).
 */
type EventName =
  | "view_product"
  | "select_segment"
  | "add_to_quote"
  | "start_quote"
  | "submit_quote_success"
  | "submit_quote_error"
  | "click_whatsapp";

type Props = Record<string, string | number | boolean | undefined>;

const PII_KEYS = /nome|name|phone|telefone|email|mail|cpf|cnpj|notes|obs/i;

declare global {
  interface Window {
    dataLayer?: unknown[];
    plausible?: (event: string, opts?: { props?: Props }) => void;
  }
}

export function track(event: EventName, props: Props = {}) {
  if (typeof window === "undefined") return;

  const safe: Props = {};
  for (const [k, v] of Object.entries(props)) {
    if (PII_KEYS.test(k)) continue;
    if (typeof v === "string" && v.length > 60) continue;
    if (v !== undefined) safe[k] = v;
  }

  if (typeof window.plausible === "function") {
    window.plausible(event, { props: safe });
    return;
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...safe });
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, safe);
  }
}
