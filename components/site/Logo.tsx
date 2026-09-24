import { cn } from "@/lib/utils";

/**
 * Símbolo da marca GAMA: caixa isométrica com "G" em contraforma.
 * Reconstrução vetorial a partir do manual de marca fornecido.
 * SUBSTITUIR pelo SVG oficial assim que a GAMA enviar o arquivo vetorial.
 */
export function GamaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="GAMA Embalagens"
      className={cn("h-9 w-9", className)}
    >
      {/* face direita (verde claro) */}
      <path d="M32 16.5 56 9v34.5L32 55z" fill="#4aa85c" />
      {/* topo da caixa */}
      <path d="M8 9 32 1l24 8-24 7.5z" fill="#2e8b40" />
      {/* face esquerda escura com o G em contraforma */}
      <path
        d="M8 9v34.5L32 55V16.5L8 9zm18.5 12.8v5.4h-9.3v11.2h4.6v-4.1h-3v-3.4h7.7v11.2h-14V21.8h14z"
        fill="#0d0f0e"
      />
      {/* aba lateral */}
      <path d="M40 12.4 47 10v8.6l-3.5-2-3.5 2z" fill="#1f6a2d" />
    </svg>
  );
}

/** Assinatura completa: símbolo + logotipo. */
export function GamaLogo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const word = variant === "light" ? "#ffffff" : "#0d0f0e";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <GamaMark className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className="text-[1.35rem] font-extrabold tracking-[0.02em]"
          style={{ color: word }}
        >
          GA<span style={{ color: "#2e8b40" }}>M</span>A
        </span>
        <span
          className="text-[0.6rem] font-semibold tracking-[0.34em]"
          style={{ color: variant === "light" ? "#d7dfd9" : "#55605a" }}
        >
          EMBALAGENS
        </span>
      </span>
    </span>
  );
}
