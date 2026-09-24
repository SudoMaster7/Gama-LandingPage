"use client";

import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Botão de WhatsApp. Não renderiza nada enquanto o número oficial não for
 * confirmado em content/company.json — nunca aponta para um número inventado.
 */
export function WhatsAppButton({
  productSlug,
  segmentSlug,
  position = "floating",
  className,
  children,
}: {
  productSlug?: string | null;
  segmentSlug?: string | null;
  position?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const url = whatsappUrl({ productSlug, segmentSlug });
  if (!url) return null;

  const floating = position === "floating";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("click_whatsapp", { position, product_slug: productSlug ?? undefined })}
      className={cn(
        floating
          ? "fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg hover:brightness-95"
          : "inline-flex items-center gap-2 rounded-md border-2 border-[var(--gama-verde)] px-5 py-2.5 font-semibold text-[var(--gama-verde-escuro)] hover:bg-[var(--gama-verde-claro)]",
        className,
      )}
      aria-label="Falar no WhatsApp com a GAMA Embalagens"
    >
      <MessageCircle className={floating ? "h-7 w-7 text-white" : "h-5 w-5"} aria-hidden />
      {!floating && (children ?? "Falar no WhatsApp")}
    </a>
  );
}
