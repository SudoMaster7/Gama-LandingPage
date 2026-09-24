"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { products, segments, getSegment } from "@/lib/content";
import { useQuote } from "@/lib/quote-store";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function CatalogClient() {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("negocio");
  const setSegment = useQuote((s) => s.setSegment);

  // Mantém a escolha de segmento coerente entre URL e store.
  useEffect(() => {
    if (active && getSegment(active)) setSegment(active);
  }, [active, setSegment]);

  const visible = active ? products.filter((p) => p.segments.includes(active)) : products;
  const activeSegment = getSegment(active);

  function choose(slug: string | null) {
    if (slug) {
      track("select_segment", { segment: slug });
      router.push(`/produtos?negocio=${slug}`, { scroll: false });
    } else {
      setSegment(null);
      router.push("/produtos", { scroll: false });
    }
  }

  return (
    <>
      <nav aria-label="Filtrar por tipo de negócio" className="mb-8">
        <ul className="flex flex-wrap gap-2">
          <li>
            <button
              type="button"
              onClick={() => choose(null)}
              aria-pressed={!active}
              className={cn(
                "rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
                !active
                  ? "border-[var(--gama-verde)] bg-[var(--gama-verde)] text-white"
                  : "border-[var(--gama-linha)] bg-white hover:border-[var(--gama-verde)]",
              )}
            >
              Todos os produtos
            </button>
          </li>
          {segments.map((seg) => (
            <li key={seg.slug}>
              <button
                type="button"
                onClick={() => choose(seg.slug)}
                aria-pressed={active === seg.slug}
                className={cn(
                  "rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
                  active === seg.slug
                    ? "border-[var(--gama-verde)] bg-[var(--gama-verde)] text-white"
                    : "border-[var(--gama-linha)] bg-white hover:border-[var(--gama-verde)]",
                )}
              >
                {seg.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <p aria-live="polite" className="mb-5 text-sm text-[var(--gama-suave)]">
        {activeSegment
          ? `${visible.length} produto(s) sugerido(s) para ${activeSegment.name}.`
          : `${visible.length} produto(s) no catálogo.`}
      </p>

      {visible.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.slug} product={p} position="catalogo" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--gama-linha)] bg-[var(--gama-filme)] p-8 text-center">
          <p className="font-semibold">
            Ainda não publicamos sugestões para este tipo de negócio.
          </p>
          <p className="mt-2 text-sm text-[var(--gama-suave)]">
            Descreva sua necessidade no orçamento que a equipe verifica as opções
            disponíveis.
          </p>
        </div>
      )}
    </>
  );
}
