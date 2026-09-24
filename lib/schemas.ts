import { z } from "zod";

export const UNITS = ["unidade", "rolo", "caixa", "fardo", "kg", "milheiro", "bobina"] as const;
export type Unit = (typeof UNITS)[number];

export const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR",
  "PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
] as const;

export const quoteItemSchema = z.object({
  productSlug: z.string().min(1),
  variantLabel: z.string().max(120).optional().nullable(),
  quantity: z.number().positive().max(1_000_000).optional().nullable(),
  unit: z.enum(UNITS).optional().nullable(),
  unknownSpec: z.boolean().default(false),
});

export type QuoteItemInput = z.input<typeof quoteItemSchema>;

const onlyDigits = (s: string) => s.replace(/\D/g, "");

export const quoteRequestSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome").max(120),
    businessName: z.string().trim().min(2, "Informe o nome do seu negócio").max(160),
    preferredChannel: z.enum(["whatsapp", "email"], {
      message: "Escolha como prefere ser contatado",
    }),
    phone: z.string().trim().max(20).optional().or(z.literal("")),
    email: z.string().trim().email("E-mail inválido").max(160).optional().or(z.literal("")),
    city: z.string().trim().min(2, "Informe sua cidade").max(120),
    uf: z.enum(UFS, { message: "Selecione o estado" }),
    segment: z.string().max(60).optional().or(z.literal("")),
    purchaseType: z.enum(["recorrente", "eventual", "nao_sei"]).optional().nullable(),
    notes: z.string().trim().max(2000).optional().or(z.literal("")),
    items: z.array(quoteItemSchema).max(30).default([]),
    needsGuidance: z.boolean().default(false),
    marketingOptIn: z.boolean().default(false),
    sourcePage: z.string().max(300).optional().or(z.literal("")),
    utmSource: z.string().max(120).optional().or(z.literal("")),
    utmMedium: z.string().max(120).optional().or(z.literal("")),
    utmCampaign: z.string().max(120).optional().or(z.literal("")),
    idempotencyKey: z.string().uuid("Chave de envio inválida"),
    turnstileToken: z.string().max(4000).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    // Exigir apenas o contato do canal escolhido (regra do briefing, seção 8).
    if (data.preferredChannel === "whatsapp") {
      const digits = onlyDigits(data.phone ?? "");
      if (digits.length < 10 || digits.length > 13) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: "Informe um WhatsApp com DDD",
        });
      }
    }
    if (data.preferredChannel === "email" && !data.email) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Informe seu e-mail",
      });
    }
    // Precisa haver ao menos um item OU o pedido explícito de orientação.
    if (data.items.length === 0 && !data.needsGuidance) {
      ctx.addIssue({
        code: "custom",
        path: ["items"],
        message: "Selecione ao menos um produto ou marque \"Preciso de orientação\"",
      });
    }
  });

export type QuoteRequestInput = z.input<typeof quoteRequestSchema>;
export type QuoteRequest = z.output<typeof quoteRequestSchema>;
