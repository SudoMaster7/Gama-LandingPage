"use client";

import { useSearchParams } from "next/navigation";
import { GamaMark } from "@/components/site/Logo";

/** Carimbo do protocolo — usa o símbolo da marca, conforme direção visual. */
export function ProtocolBadge() {
  const protocol = useSearchParams().get("p");
  if (!protocol) return null;

  return (
    <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-lg border-2 border-dashed border-[var(--gama-verde)] bg-[var(--gama-verde-claro)] px-6 py-4">
      <GamaMark className="h-8 w-8" />
      <div className="text-left">
        <p className="text-xs font-bold tracking-wide text-[var(--gama-verde-escuro)] uppercase">
          Protocolo
        </p>
        <p className="font-mono text-lg font-bold tracking-wider">{protocol}</p>
      </div>
    </div>
  );
}
