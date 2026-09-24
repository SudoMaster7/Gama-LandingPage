/**
 * Carregamento do conteúdo aprovado (/content) com a regra central do projeto:
 *
 *   Campo null, string vazia ou marcador provisório ("a validar", "[ALGO]")
 *   NÃO renderiza. A seção correspondente desaparece da página.
 *
 * Isso garante o critério de aceite do briefing: nenhum texto provisório
 * pode aparecer no site publicado.
 */
import companyRaw from "@/content/company.json";
import segmentsRaw from "@/content/segments.json";
import faqRaw from "@/content/faq.json";
import bobina from "@/content/products/bobina-fundo-estrela.json";
import sacolas from "@/content/products/sacolas.json";
import filmePvc from "@/content/products/filme-pvc.json";
import filmeStretch from "@/content/products/filme-stretch.json";
import { isPublishable, pub, pubList } from "@/lib/publishable";

export { isPublishable, pub, pubList };


export type SpecField = { key: string; label: string; unit: string | null };

export type ProductVariant = {
  sku?: string | null;
  label?: string | null;
  specs?: Record<string, string | number | null>;
};

export type ProductImage = { src: string | null; alt: string };

export type Product = {
  slug: string;
  name: string;
  family: string;
  short: string;
  seoTitle: string;
  seoDescription: string;
  description: string;
  segments: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  specSchema: SpecField[];
  supplyUnit: string | null;
  material: string | null;
  applications: string[];
  limitations: string[];
  quoteQuestions: string[];
  faq: { q: string; a: string }[];
  related: string[];
};

export type Segment = {
  slug: string;
  name: string;
  short: string;
  entryProducts: string[];
  status: "validado" | "a validar";
};

export type Company = typeof companyRaw;

export const company = companyRaw as Company;

export const products: Product[] = [bobina, sacolas, filmePvc, filmeStretch] as unknown as Product[];

export const allSegments = segmentsRaw as Segment[];

/**
 * Em produção mostramos apenas segmentos validados pela GAMA.
 * Em desenvolvimento todos aparecem, para revisão interna.
 */
export const segments: Segment[] =
  process.env.NODE_ENV === "production"
    ? allSegments.filter((s) => s.status === "validado")
    : allSegments;

export const faq = faqRaw as { q: string; a: string }[];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productsBySegment(segmentSlug: string | null): Product[] {
  if (!segmentSlug) return products;
  return products.filter((p) => p.segments.includes(segmentSlug));
}

export function getSegment(slug: string | null | undefined): Segment | undefined {
  if (!slug) return undefined;
  return allSegments.find((s) => s.slug === slug);
}

/** Linhas de especificação publicáveis de uma variação. */
export function publishableSpecs(
  product: Product,
  variant: ProductVariant,
): { label: string; value: string }[] {
  const specs = variant.specs ?? {};
  return product.specSchema
    .map((field) => {
      const raw = specs[field.key];
      if (!isPublishable(raw)) return null;
      const unit = field.unit ? ` ${field.unit}` : "";
      return { label: field.label, value: `${raw}${unit}` };
    })
    .filter((row): row is { label: string; value: string } => row !== null);
}

/** Variações que têm ao menos um dado publicável. */
export function publishableVariants(product: Product): ProductVariant[] {
  return (product.variants ?? []).filter(
    (v) => isPublishable(v.label) && publishableSpecs(product, v).length > 0,
  );
}

/** Contatos oficiais — cada um só aparece se confirmado. */
export const contact = {
  whatsapp: pub(company.whatsapp),
  whatsappDisplay: pub(company.whatsappDisplay),
  email: pub(company.email),
  phone: pub(company.phone),
  address: pub(company.address),
  openingHours: pub(company.openingHours),
  cnpj: pub(company.cnpj),
  legalName: pub(company.legalName),
  coverage: pub(company.coverage),
};
