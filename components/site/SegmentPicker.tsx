"use client";

import { useRouter } from "next/navigation";
import { useQuote } from "@/lib/quote-store";
import { segments } from "@/lib/content";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Entrada por tipo de negócio. A escolha é guardada no store e viaja até o
 * formulário de orçamento (o visitante pode alterar depois).
 * Segmento não é dado pessoal — pode ir na URL.
 */
export function SegmentPicker() {
  const router = useRouter();
  const current = useQuote((s) => s.segment);
  const setSegment = useQuote((s) => s.setSegment);

  function choose(slug: string) {
    const next = current === slug ? null : slug;
    setSegment(next);
    if (next) {
      track("select_segment", { segment: next });
      router.push(`/produtos?negocio=${next}`);
    }
  }

  if (segments.length === 0) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {segments.map((seg) => {
        const active = current === seg.slug;
        return (
          <li key={seg.slug}>
            <button
              type="button"
              onClick={() => choose(seg.slug)}
              aria-pressed={active}
              className={cn(
                "flex h-full w-full flex-col gap-1.5 rounded-lg border-2 p-5 text-left transition-colors",
                active
                  ? "border-[var(--gama-verde)] bg-[var(--gama-verde-claro)]"
                  : "border-[var(--gama-linha)] bg-white hover:border-[var(--gama-verde)]",
              )}
            >
              <span className="font-bold">{seg.name}</span>
              <span className="text-sm leading-relaxed text-[var(--gama-suave)]">
                {seg.short}
              </span>
              {process.env.NODE_ENV !== "production" && seg.status !== "validado" && (
                <span className="mt-1 w-fit rounded bg-amber-100 px-1.5 py-0.5 text-[0.65rem] font-bold text-amber-800">
                  INTERNO: segmento a validar
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
