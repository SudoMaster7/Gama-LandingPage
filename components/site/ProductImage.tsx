"use client";

import type { Product } from "@/lib/content";
import { isPublishable } from "@/lib/content";
import { ProductIllustration } from "@/components/site/ProductIllustration";
import { cn } from "@/lib/utils";

/**
 * Imagem do produto, em três estados:
 *
 *   1. Foto real cadastrada  -> mostra a foto.
 *   2. Sem foto              -> ilustração vetorial da marca (ProductIllustration).
 *   3. (nenhum outro)        -> a ilustração sempre tem um fallback genérico.
 *
 * Nunca usa foto de banco de imagens: seria sugerir produto ou estrutura que a
 * GAMA pode não possuir. A ilustração é claramente um desenho, não engana
 * ninguém, e sai de cena sozinha quando a foto real chega ao JSON do produto.
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
          "flex items-center justify-center bg-[var(--gama-filme)] p-3",
          className,
        )}
        role="img"
        aria-label={`Ilustração de ${product.name}. Foto real ainda não disponível.`}
        title={product.name}
      >
        <ProductIllustration
          slug={product.slug}
          name={product.name}
          family={product.family}
          className="h-full w-full"
        />
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
