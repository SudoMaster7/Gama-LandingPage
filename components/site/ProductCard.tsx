import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/content";
import { ProductImage } from "@/components/site/ProductImage";
import { AddToQuoteButton } from "@/components/site/AddToQuoteButton";

export function ProductCard({
  product,
  position = "card",
  priority = false,
}: {
  product: Product;
  position?: string;
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-[var(--gama-linha)] bg-white transition-shadow hover:shadow-md">
      <Link
        href={`/produtos/${product.slug}`}
        className="block"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage product={product} className="h-44 w-full" priority={priority} />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[var(--gama-verde-escuro)] uppercase">
            {product.family}
          </p>
          <h3 className="mt-1 text-lg font-bold">
            <Link
              href={`/produtos/${product.slug}`}
              className="hover:text-[var(--gama-verde-escuro)]"
            >
              {product.name}
            </Link>
          </h3>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-[var(--gama-suave)]">
          {product.short}
        </p>

        <div className="mt-1 flex flex-col gap-2">
          <AddToQuoteButton productSlug={product.slug} position={position} size="sm" />
          <Link
            href={`/produtos/${product.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--gama-verde-escuro)] hover:underline"
          >
            Ver especificações
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
