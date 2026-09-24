import { contact, getProduct, getSegment } from "@/lib/content";

/**
 * Monta o link oficial de WhatsApp.
 *
 * Regra do briefing: um único número oficial, e a URL leva apenas contexto
 * escolhido na tela (produto, segmento, cidade). Nome, telefone e qualquer
 * dado pessoal NUNCA entram na URL.
 *
 * Retorna null enquanto o número oficial não estiver confirmado — assim o
 * botão simplesmente não é renderizado, em vez de apontar para um número falso.
 */
export function whatsappUrl(opts: {
  productSlug?: string | null;
  segmentSlug?: string | null;
  city?: string | null;
} = {}): string | null {
  const number = contact.whatsapp;
  if (!number) return null;

  const digits = String(number).replace(/\D/g, "");
  if (digits.length < 12) return null; // exige 55 + DDD + número

  const product = opts.productSlug ? getProduct(opts.productSlug) : undefined;
  const segment = getSegment(opts.segmentSlug);

  let text = "Olá! Vim pelo site da GAMA Embalagens e gostaria de solicitar uma cotação";
  if (product) text += ` de ${product.name}`;
  text += ".";
  if (segment) text += ` Meu negócio é do segmento ${segment.name}.`;
  if (opts.city) text += ` Estamos em ${opts.city}.`;

  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
