/**
 * Regra central do projeto, sem dependências:
 *
 *   Campo null, string vazia ou marcador provisório ("a validar", "[ALGO]")
 *   NÃO renderiza. A seção correspondente desaparece da página.
 *
 * Garante o critério de aceite do briefing: nenhum texto provisório pode
 * aparecer no site publicado.
 */
const PLACEHOLDER = /^(a validar|a definir|tbd|todo)$/i;
const MARKER = /\[[A-ZÀ-Ú_ ]{3,}\]/;

/** true quando o valor é publicável (não é placeholder nem vazio). */
export function isPublishable(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") {
    const v = value.trim();
    if (v === "") return false;
    if (PLACEHOLDER.test(v)) return false;
    if (MARKER.test(v)) return false;
    return true;
  }
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.values(value as object).some(isPublishable);
  return true;
}

/** Retorna o valor se for publicável, senão null. */
export function pub<T>(value: T): T | null {
  return isPublishable(value) ? value : null;
}

/** Filtra uma lista mantendo só itens publicáveis. */
export function pubList<T>(list: T[] | null | undefined): T[] {
  if (!Array.isArray(list)) return [];
  return list.filter(isPublishable);
}
