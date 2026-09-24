import { test } from "node:test";
import assert from "node:assert/strict";
import { quoteRequestSchema } from "../lib/schemas.ts";
import { generateProtocol } from "../lib/protocol.ts";
import { isPublishable, pub, pubList } from "../lib/publishable.ts";

const base = {
  name: "Leonardo",
  businessName: "Mercado Teste",
  preferredChannel: "whatsapp" as const,
  phone: "(11) 98888-7777",
  email: "",
  city: "São Paulo",
  uf: "SP" as const,
  segment: "supermercados",
  purchaseType: "recorrente" as const,
  notes: "",
  items: [{ productSlug: "filme-stretch", quantity: 10, unit: "rolo" as const, unknownSpec: false }],
  needsGuidance: false,
  marketingOptIn: false,
  idempotencyKey: "3f2504e0-4f89-11d3-9a0c-0305e82c3301",
};

test("aceita solicitação válida por WhatsApp", () => {
  const r = quoteRequestSchema.safeParse(base);
  assert.equal(r.success, true);
});

test("exige telefone quando o canal é WhatsApp", () => {
  const r = quoteRequestSchema.safeParse({ ...base, phone: "" });
  assert.equal(r.success, false);
  assert.ok(r.error.issues.some((i) => i.path[0] === "phone"));
});

test("exige e-mail quando o canal é e-mail — e NÃO exige telefone", () => {
  const semTelefone = { ...base, preferredChannel: "email" as const, phone: "", email: "" };
  const r1 = quoteRequestSchema.safeParse(semTelefone);
  assert.equal(r1.success, false);
  assert.ok(r1.error.issues.some((i) => i.path[0] === "email"));

  const r2 = quoteRequestSchema.safeParse({ ...semTelefone, email: "leo@teste.com.br" });
  assert.equal(r2.success, true, "canal e-mail não deve exigir telefone");
});

test("recusa solicitação sem itens e sem pedido de orientação", () => {
  const r = quoteRequestSchema.safeParse({ ...base, items: [], needsGuidance: false });
  assert.equal(r.success, false);
  assert.ok(r.error.issues.some((i) => i.path[0] === "items"));
});

test("aceita solicitação sem itens quando o visitante pede orientação", () => {
  const r = quoteRequestSchema.safeParse({ ...base, items: [], needsGuidance: true });
  assert.equal(r.success, true);
});

test("recusa UF inválida e idempotencyKey que não é uuid", () => {
  assert.equal(quoteRequestSchema.safeParse({ ...base, uf: "XX" }).success, false);
  assert.equal(quoteRequestSchema.safeParse({ ...base, idempotencyKey: "abc" }).success, false);
});

test("marketingOptIn nunca vem marcado por padrão", () => {
  const semCampo = { ...base } as Record<string, unknown>;
  delete semCampo.marketingOptIn;
  const r = quoteRequestSchema.safeParse(semCampo);
  assert.equal(r.success, true);
  assert.equal(r.data.marketingOptIn, false);
});

test("limita observações a 2000 caracteres", () => {
  const r = quoteRequestSchema.safeParse({ ...base, notes: "x".repeat(2001) });
  assert.equal(r.success, false);
});

test("protocolo segue o formato GAMA-AAMMDD-XXXX e é único", () => {
  const p = generateProtocol(new Date("2026-09-23T12:00:00"));
  assert.match(p, /^GAMA-260923-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/);

  const gerados = new Set(Array.from({ length: 500 }, () => generateProtocol()));
  assert.ok(gerados.size > 490, "protocolos devem ser praticamente únicos");
});

test("conteúdo provisório não é publicável", () => {
  assert.equal(isPublishable(null), false);
  assert.equal(isPublishable(""), false);
  assert.equal(isPublishable("   "), false);
  assert.equal(isPublishable("a validar"), false);
  assert.equal(isPublishable("A VALIDAR"), false);
  assert.equal(isPublishable("[REGIÃO CONFIRMADA]"), false);
  assert.equal(isPublishable("[PROTOCOLO]"), false);
  assert.equal(isPublishable([]), false);

  assert.equal(isPublishable("Filme stretch 500mm"), true);
  assert.equal(isPublishable(20), true);
  assert.equal(isPublishable(["a"]), true);
});

test("pub e pubList removem valores provisórios", () => {
  assert.equal(pub("a validar"), null);
  assert.equal(pub("Bobina 30x40"), "Bobina 30x40");
  assert.deepEqual(pubList(["ok", "", "a validar", "bom"]), ["ok", "bom"]);
  assert.deepEqual(pubList(null), []);
});
