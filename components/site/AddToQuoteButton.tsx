"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useQuote } from "@/lib/quote-store";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function AddToQuoteButton({
  productSlug,
  variantLabel,
  position = "card",
  className,
  size = "md",
}: {
  productSlug: string;
  variantLabel?: string | null;
  position?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const add = useQuote((s) => s.add);
  const items = useQuote((s) => s.items);
  const inQuote = items.some((i) => i.productSlug === productSlug);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    add({ productSlug, variantLabel: variantLabel ?? null, unknownSpec: false });
    track("add_to_quote", { product_slug: productSlug, position });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2200);
  }

  const done = inQuote || justAdded;

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={inQuote}
      aria-live="polite"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors",
        size === "sm" ? "h-9 px-3.5 text-sm" : "h-11 px-5 text-[0.95rem]",
        done
          ? "cursor-default border-2 border-[var(--gama-verde)] bg-[var(--gama-verde-claro)] text-[var(--gama-verde-escuro)]"
          : "bg-[var(--gama-verde)] text-white hover:bg-[var(--gama-verde-escuro)]",
        className,
      )}
    >
      {done ? (
        <>
          <Check className="h-4 w-4" aria-hidden />
          Na sua cotação
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" aria-hidden />
          Adicionar à cotação
        </>
      )}
    </button>
  );
}
