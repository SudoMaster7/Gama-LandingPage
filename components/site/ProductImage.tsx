"use client";

import { Package } from "lucide-react";
import type { Product } from "@/lib/content";
import { isPublishable } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Imagem do produto. Enquanto a GAMA não enviar as fotos reais, exibe um
 * espaço neutro identificado — nunca uma foto de banco de imagens que sugira
 * produto ou estrutura que a empresa não possui.
 */
export function ProductImage({
  product,
  className,
  priority: _priority = false,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
}) {
  const image = product.images?.[0];
  const hasReal = image && isPublishable(image.src);

  if (!hasReal) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-[var(--gama-filme)] text-[var(--gama-suave)]",
          className,
        )}
        role="img"
        aria-label={`Foto de ${product.name} ainda não disponível`}
      >
        <Package className="h-10 w-10 opacity-40" aria-hidden />
        <span className="px-3 text-center text-xs font-medium">{product.name}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image!.src as string}
      alt={image!.alt}
      className={cn("object-cover", className)}
      loading={_priority ? "eager" : "lazy"}
    />
  );
}
