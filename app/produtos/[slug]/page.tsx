import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, HelpCircle, Info } from "lucide-react";
import { ProductImage } from "@/components/site/ProductImage";
import { ProductCard } from "@/components/site/ProductCard";
import { AddToQuoteButton } from "@/components/site/AddToQuoteButton";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { FAQ } from "@/components/site/FAQ";
import { ButtonLink } from "@/components/ui/Button";
import {
  getProduct,
  products,
  publishableSpecs,
  publishableVariants,
  pub,
  pubList,
} from "@/lib/content";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.seoTitle.replace(" | GAMA Embalagens", ""),
    description: product.seoDescription,
    alternates: { canonical: `/produtos/${product.slug}` },
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const variants = publishableVariants(product);
  const applications = pubList(product.applications);
  const limitations = pubList(product.limitations);
  const questions = pubList(product.quoteQuestions);
  const supplyUnit = pub(product.supplyUnit);
  const material = pub(product.material);
  const related = product.related
    .map((s) => getProduct(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // JSON-LD sem offers/price/aggregateRating — não inventamos oferta.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.family,
    brand: { "@type": "Brand", name: "GAMA Embalagens" },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Trilha" className="mb-6 text-sm">
        <Link
          href="/produtos"
          className="inline-flex items-center gap-1.5 text-[var(--gama-verde-escuro)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Voltar ao catálogo
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductImage
          product={product}
          className="h-72 w-full rounded-lg border border-[var(--gama-linha)] lg:h-96"
          priority
        />

        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-[var(--gama-verde-escuro)] uppercase">
            {product.family}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-balance">{product.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--gama-suave)]">
            {product.description}
          </p>

          {(material || supplyUnit) && (
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {material && (
                <div className="rounded-lg border border-[var(--gama-linha)] p-4">
                  <dt className="text-xs font-semibold tracking-wide text-[var(--gama-suave)] uppercase">
                    Material
                  </dt>
                  <dd className="mt-1 font-semibold">{material}</dd>
                </div>
              )}
              {supplyUnit && (
                <div className="rounded-lg border border-[var(--gama-linha)] p-4">
                  <dt className="text-xs font-semibold tracking-wide text-[var(--gama-suave)] uppercase">
                    Unidade de fornecimento
                  </dt>
                  <dd className="mt-1 font-semibold">{supplyUnit}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <AddToQuoteButton productSlug={product.slug} position="pdp_topo" />
            <WhatsAppButton productSlug={product.slug} position="pdp_topo" />
          </div>
          <p className="mt-3 text-sm text-[var(--gama-suave)]">
            Adicionar à cotação não confirma compra, preço ou reserva de estoque.
          </p>
        </div>
      </div>

      {/* Especificações — só aparecem quando a GAMA confirmar as fichas */}
      {variants.length > 0 ? (
        <section className="mt-16" aria-labelledby="h-specs">
          <h2 id="h-specs" className="text-2xl font-extrabold">
            Especificações e variações
          </h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <caption className="sr-only">
                Variações disponíveis de {product.name}
              </caption>
              <thead>
                <tr className="bg-[var(--gama-filme)] text-left">
                  <th scope="col" className="border border-[var(--gama-linha)] p-3">
                    Variação
                  </th>
                  {product.specSchema.map((f) => (
                    <th
                      key={f.key}
                      scope="col"
                      className="border border-[var(--gama-linha)] p-3"
                    >
                      {f.label}
                    </th>
                  ))}
                  <th scope="col" className="border border-[var(--gama-linha)] p-3">
                    Cotar
                  </th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v) => {
                  const specs = publishableSpecs(product, v);
                  return (
                    <tr key={String(v.label)}>
                      <th
                        scope="row"
                        className="border border-[var(--gama-linha)] p-3 text-left font-semibold"
                      >
                        {v.label}
                      </th>
                      {product.specSchema.map((f) => {
                        const row = specs.find((s) => s.label === f.label);
                        return (
                          <td key={f.key} className="border border-[var(--gama-linha)] p-3">
                            {row ? row.value : "—"}
                          </td>
                        );
                      })}
                      <td className="border border-[var(--gama-linha)] p-3">
                        <AddToQuoteButton
                          productSlug={product.slug}
                          variantLabel={v.label}
                          position="pdp_tabela"
                          size="sm"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="mt-16 rounded-lg border border-[var(--gama-linha)] bg-[var(--gama-filme)] p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Info className="h-5 w-5 text-[var(--gama-verde)]" aria-hidden />
            Especificações sob consulta
          </h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-[var(--gama-suave)]">
            Informe a medida e a quantidade que sua operação utiliza. A equipe confirma as
            opções disponíveis para {product.name.toLowerCase()} e as condições de
            atendimento.
          </p>
        </section>
      )}

      {(applications.length > 0 || limitations.length > 0) && (
        <section className="mt-14 grid gap-8 lg:grid-cols-2">
          {applications.length > 0 && (
            <div>
              <h2 className="text-2xl font-extrabold">Aplicações</h2>
              <ul className="mt-4 space-y-2">
                {applications.map((a) => (
                  <li key={a} className="flex gap-2 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gama-verde)]" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {limitations.length > 0 && (
            <div>
              <h2 className="text-2xl font-extrabold">Observações de uso</h2>
              <ul className="mt-4 space-y-2">
                {limitations.map((l) => (
                  <li key={l} className="flex gap-2 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gama-linha)]" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {questions.length > 0 && (
        <section className="mt-14 rounded-lg border-2 border-[var(--gama-verde)] bg-[var(--gama-verde-claro)] p-6 lg:p-8">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold">
            <HelpCircle className="h-6 w-6 text-[var(--gama-verde-escuro)]" aria-hidden />
            Para cotar {product.name.toLowerCase()}, informe:
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {questions.map((q) => (
              <li
                key={q}
                className="rounded-md bg-white p-4 text-[0.95rem] leading-relaxed font-medium"
              >
                {q}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <AddToQuoteButton productSlug={product.slug} position="pdp_cta" />
            <ButtonLink href="/orcamento" variant="outline">
              Ir para o orçamento
            </ButtonLink>
          </div>
        </section>
      )}

      {product.faq.length > 0 && (
        <section className="mt-16" aria-labelledby="h-faq-produto">
          <h2 id="h-faq-produto" className="mb-6 text-2xl font-extrabold">
            Perguntas sobre {product.name.toLowerCase()}
          </h2>
          <FAQ items={product.faq} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="h-relacionados">
          <h2 id="h-relacionados" className="mb-6 text-2xl font-extrabold">
            Produtos relacionados
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} position="pdp_relacionados" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
