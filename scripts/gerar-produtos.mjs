/**
 * Gera o índice de produtos a partir de content/products/*.json.
 *
 * Por que existe: o catálogo da GAMA vai crescer. Sem este script, cada novo
 * produto exigiria editar lib/content.ts (um import e mais um item no array).
 * Com ele, o fluxo é: criar o JSON na pasta e pronto — o produto entra no
 * catálogo, no sitemap, nos filtros por segmento e ganha página própria.
 *
 * Além de gerar o índice, valida cada ficha e aborta o build com uma mensagem
 * clara se algo estiver errado. É melhor quebrar aqui do que publicar uma
 * página de produto quebrada.
 *
 * Executado automaticamente por `npm run dev` e `npm run build`.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const pastaProdutos = join(raiz, "content", "products");
const saida = join(raiz, "content", "products.generated.ts");

const erros = [];
const avisos = [];

function erro(arquivo, msg) {
  erros.push(`  ${arquivo}: ${msg}`);
}

/** Campos que toda ficha precisa ter para render uma página utilizável. */
const TEXTOS_OBRIGATORIOS = [
  "slug",
  "name",
  "family",
  "short",
  "seoTitle",
  "seoDescription",
  "description",
];

const LISTAS_OBRIGATORIAS = [
  "segments",
  "images",
  "variants",
  "specSchema",
  "applications",
  "limitations",
  "quoteQuestions",
  "faq",
  "related",
];

// ---------------------------------------------------------------- leitura
const arquivos = readdirSync(pastaProdutos)
  .filter((f) => f.endsWith(".json"))
  .sort();

if (arquivos.length === 0) {
  console.error("\n[produtos] Nenhuma ficha encontrada em content/products/.\n");
  process.exit(1);
}

const produtos = [];

for (const arquivo of arquivos) {
  const caminho = join(pastaProdutos, arquivo);
  let dados;

  try {
    dados = JSON.parse(readFileSync(caminho, "utf8"));
  } catch (e) {
    erro(arquivo, `JSON inválido — ${e.message}`);
    continue;
  }

  const slugEsperado = basename(arquivo, ".json");

  for (const campo of TEXTOS_OBRIGATORIOS) {
    const v = dados[campo];
    if (typeof v !== "string" || v.trim() === "") {
      erro(arquivo, `campo "${campo}" é obrigatório e deve ser texto preenchido`);
    }
  }

  for (const campo of LISTAS_OBRIGATORIAS) {
    if (!Array.isArray(dados[campo])) {
      erro(arquivo, `campo "${campo}" deve ser uma lista (use [] se ainda não houver dados)`);
    }
  }

  if (dados.slug && dados.slug !== slugEsperado) {
    erro(
      arquivo,
      `o slug "${dados.slug}" não bate com o nome do arquivo — renomeie o arquivo para ${dados.slug}.json`,
    );
  }

  // As chaves usadas nas variações precisam existir no specSchema, senão a
  // especificação nunca aparece na tabela da página do produto.
  if (Array.isArray(dados.specSchema) && Array.isArray(dados.variants)) {
    const chaves = new Set(dados.specSchema.map((c) => c?.key));
    for (const [i, v] of dados.variants.entries()) {
      for (const chave of Object.keys(v?.specs ?? {})) {
        if (!chaves.has(chave)) {
          erro(
            arquivo,
            `variação ${i + 1} usa a especificação "${chave}", que não existe no specSchema`,
          );
        }
      }
    }
  }

  produtos.push({ arquivo, dados });
}

// ---------------------------------------------------------------- referências cruzadas
const slugs = new Set(produtos.map((p) => p.dados.slug));

let segmentosValidos = new Set();
try {
  const segs = JSON.parse(readFileSync(join(raiz, "content", "segments.json"), "utf8"));
  segmentosValidos = new Set(segs.map((s) => s.slug));
} catch {
  erro("segments.json", "não foi possível ler os segmentos");
}

for (const { arquivo, dados } of produtos) {
  for (const rel of dados.related ?? []) {
    if (!slugs.has(rel)) {
      erro(arquivo, `"related" aponta para "${rel}", que não existe em content/products/`);
    }
    if (rel === dados.slug) {
      erro(arquivo, `"related" não pode apontar para o próprio produto`);
    }
  }
  for (const seg of dados.segments ?? []) {
    if (!segmentosValidos.has(seg)) {
      erro(arquivo, `"segments" cita "${seg}", que não existe em content/segments.json`);
    }
  }
  if ((dados.segments ?? []).length === 0) {
    avisos.push(`  ${arquivo}: sem segmento — o produto só aparece em "Todos os produtos"`);
  }
}

// Segmento que promete um produto inexistente quebra a navegação.
try {
  const segs = JSON.parse(readFileSync(join(raiz, "content", "segments.json"), "utf8"));
  for (const s of segs) {
    for (const entrada of s.entryProducts ?? []) {
      if (!slugs.has(entrada)) {
        erro(
          "segments.json",
          `o segmento "${s.slug}" sugere "${entrada}", que não existe em content/products/`,
        );
      }
    }
  }
} catch {
  /* erro já registrado acima */
}

// ---------------------------------------------------------------- resultado
if (erros.length > 0) {
  console.error("\n[produtos] Corrija as fichas antes de continuar:\n");
  console.error(erros.join("\n"));
  console.error("");
  process.exit(1);
}

if (avisos.length > 0) {
  console.warn("\n[produtos] Avisos:\n" + avisos.join("\n") + "\n");
}

// Ordem estável: por família e depois por nome, para o catálogo não dançar
// a cada build. A ordem final na tela é decidida em lib/content.ts.
produtos.sort((a, b) => {
  const fam = a.dados.family.localeCompare(b.dados.family, "pt-BR");
  return fam !== 0 ? fam : a.dados.name.localeCompare(b.dados.name, "pt-BR");
});

const linhas = [
  "// ARQUIVO GERADO AUTOMATICAMENTE — NÃO EDITE À MÃO.",
  "// Gerado por scripts/gerar-produtos.mjs a partir de content/products/*.json.",
  "// Para adicionar um produto, crie o JSON na pasta e rode `npm run dev`.",
  "",
  ...produtos.map(
    (p, i) => `import p${i} from "@/content/products/${basename(p.arquivo, ".json")}.json";`,
  ),
  "",
  "export const produtosBrutos = [",
  ...produtos.map((_, i) => `  p${i},`),
  "];",
  "",
];

writeFileSync(saida, linhas.join("\n"), "utf8");

const familias = [...new Set(produtos.map((p) => p.dados.family))];
console.log(
  `[produtos] ${produtos.length} ficha(s) validada(s) em ${familias.length} família(s): ${familias.join(", ")}`,
);
