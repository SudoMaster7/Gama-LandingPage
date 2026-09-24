# Manual de conteúdo — site da GAMA

Como adicionar fotos e produtos sem depender de programação.

Só duas pastas importam:

```
content/products/     ← as fichas dos produtos (um arquivo por produto)
public/produtos/      ← as fotos
```

---

## 1. Trocar as ilustrações pelas fotos reais

Hoje cada produto aparece com um desenho vetorial da marca. Assim que a foto
real entrar, o desenho some sozinho. Não é preciso apagar nada.

### Passo 1 — preparar a foto

| Item | Recomendado |
|---|---|
| Formato | `.jpg` (ou `.webp`, que é mais leve) |
| Tamanho | 1200 × 900 px (proporção 4:3) |
| Peso | até 300 KB — foto pesada deixa o site lento |
| Fundo | branco ou bem claro, produto centralizado |
| Nome do arquivo | igual ao slug do produto: `filme-stretch.jpg` |

Dica de foto: luz natural perto de uma janela, produto sobre superfície branca,
sem sombra dura. Celular resolve — não precisa de estúdio.

### Passo 2 — colocar o arquivo na pasta

```
public/produtos/filme-stretch.jpg
```

Se a pasta `produtos` não existir dentro de `public`, crie.

### Passo 3 — apontar a foto na ficha

Abra `content/products/filme-stretch.json` e troque o `src`:

```json
"images": [
  {
    "src": "/produtos/filme-stretch.jpg",
    "alt": "Rolo de filme stretch transparente"
  }
]
```

Repare no caminho: começa com `/produtos/`, **sem** o `public`.

O `alt` é a descrição para quem não enxerga a imagem e para o Google. Descreva
o que se vê, sem repetir o nome do produto duas vezes.

### Passo 4 — conferir

```
npm run dev
```

Abra o catálogo. A foto entrou no lugar do desenho.

### Mais de uma foto

Pode listar várias — a primeira é a que aparece no card do catálogo:

```json
"images": [
  { "src": "/produtos/filme-stretch.jpg", "alt": "Rolo de filme stretch" },
  { "src": "/produtos/filme-stretch-uso.jpg", "alt": "Palete envolvido com filme stretch" }
]
```

### Se quiser voltar ao desenho

Basta devolver `"src": null`. A ilustração volta.

---

## 2. Adicionar um produto novo

O produto entra sozinho no catálogo, nos filtros por segmento, no formulário de
orçamento e ganha página própria. Nenhum código precisa ser alterado.

### Passo 1 — copiar uma ficha existente

Copie um JSON parecido de `content/products/` e renomeie.

**O nome do arquivo tem que ser igual ao slug**, senão o sistema avisa e não
publica:

```
content/products/saco-lixo.json   →   "slug": "saco-lixo"
```

Regras do slug: tudo minúsculo, sem acento, espaço vira hífen.
"Saco para lixo" → `saco-lixo`.

### Passo 2 — preencher

```json
{
  "slug": "saco-lixo",
  "name": "Saco para lixo",
  "family": "Sacos e bobinas",
  "short": "Frase curta que aparece no card do catálogo.",
  "seoTitle": "Saco para lixo para empresas | GAMA Embalagens",
  "seoDescription": "Frase que aparece no resultado do Google, até 160 caracteres.",
  "description": "Parágrafo de abertura da página do produto.",
  "segments": ["supermercados", "alimentacao"],
  "images": [{ "src": null, "alt": "Fardo de sacos para lixo" }],
  "variants": [],
  "specSchema": [
    { "key": "capacidade_litros", "label": "Capacidade", "unit": "L" },
    { "key": "unidades_por_fardo", "label": "Unidades por fardo", "unit": null }
  ],
  "supplyUnit": null,
  "material": null,
  "applications": [],
  "limitations": [],
  "quoteQuestions": [
    "Qual capacidade em litros você utiliza?",
    "Quantos fardos por pedido?"
  ],
  "faq": [],
  "related": ["sacolas"]
}
```

### O que é cada campo

| Campo | Para que serve |
|---|---|
| `slug` | Endereço da página: `/produtos/saco-lixo` |
| `name` | Nome exibido |
| `family` | Agrupamento no catálogo (ver seção 3) |
| `short` | Frase do card — uma linha, direta |
| `seoTitle` / `seoDescription` | O que o Google mostra |
| `description` | Abertura da página do produto |
| `segments` | Em quais filtros de negócio ele aparece |
| `images` | Fotos (`src: null` enquanto não houver) |
| `specSchema` | As **colunas** da tabela de medidas |
| `variants` | As **linhas** da tabela: cada medida vendida |
| `supplyUnit` | Como é fornecido: fardo, caixa, rolo |
| `applications` | Onde se usa |
| `limitations` | O que ele **não** faz — evita devolução |
| `quoteQuestions` | Perguntas que ajudam o comprador a se explicar |
| `related` | Produtos sugeridos no rodapé da página |

Campo sem informação confirmada fica `null` ou `[]`. **Ele não aparece no site**
— a seção inteira some. Nunca escreva "a validar" ou "em breve": isso vai ao ar.

### Passo 3 — a tabela de medidas

`specSchema` define as colunas. `variants` são as linhas:

```json
"specSchema": [
  { "key": "capacidade_litros", "label": "Capacidade", "unit": "L" },
  { "key": "unidades_por_fardo", "label": "Unidades por fardo", "unit": null }
],
"variants": [
  { "label": "60 litros", "specs": { "capacidade_litros": 60, "unidades_por_fardo": 100 } },
  { "label": "100 litros", "specs": { "capacidade_litros": 100, "unidades_por_fardo": 100 } }
]
```

As chaves usadas em `specs` **precisam existir** no `specSchema`. Se inventar
uma chave, o sistema avisa e não publica — é a proteção contra medida que
nunca apareceria na tela.

Sem medidas confirmadas ainda? Deixe `"variants": []`. A página funciona, só
não mostra a tabela.

### Passo 4 — segmentos

Os valores de `segments` têm que existir em `content/segments.json`. Os atuais:

```
supermercados · hortifruti · alimentacao · lojas · industria-logistica · distribuidores
```

### Passo 5 — publicar

```
npm run dev
```

Se aparecer erro, ele diz exatamente o que corrigir. Exemplos reais:

```
saco-lixo.json: campo "name" é obrigatório e deve ser texto preenchido
saco-lixo.json: "related" aponta para "sacola-kraft", que não existe
saco-lixo.json: variação 1 usa a especificação "peso_kg", que não existe no specSchema
```

Corrija e rode de novo. Enquanto houver erro, o site não publica — é proposital.

---

## 3. Criar uma família nova

Família é o agrupamento do catálogo. Hoje existem "Sacos e bobinas" e "Filmes".

Para incluir "Descartáveis", por exemplo, abra `content/families.json`:

```json
[
  { "name": "Sacos e bobinas", "short": "Bobinas, sacolas e sacos para embalar e transportar." },
  { "name": "Filmes",          "short": "Filmes para proteger, conservar e unitizar cargas." },
  { "name": "Descartáveis",    "short": "Copos, talheres e embalagens para viagem." }
]
```

A ordem do arquivo é a ordem que aparece no site. Depois é só usar
`"family": "Descartáveis"` nas fichas.

---

## 4. Ilustração de produto novo

Produto sem foto ganha um desenho automaticamente, escolhido pelo nome:

| Se o nome contém | Desenho |
|---|---|
| stretch, palete | palete envolvido |
| bobina, picotada | bobina picotada |
| sacola, alça, camiseta | sacola |
| filme, pvc, bopp, shrink | rolo |
| saco, lixo, resíduo | saco |
| *(nenhum acima)* | genérico da família |

Ou seja: "Saco para lixo reforçado" já pega o desenho de saco sozinho.
Nunca fica um card vazio.

Quer um desenho exclusivo para algum produto? Peça à SUDO — é rápido.

---

## 5. Checklist antes de publicar

- [ ] Nome do arquivo igual ao `slug`
- [ ] `short` com uma frase clara, sem promessa sem prova
- [ ] `segments` existentes em `segments.json`
- [ ] Chaves de `specs` existentes no `specSchema`
- [ ] `related` apontando para produtos que existem
- [ ] Fotos em `public/produtos/`, até 300 KB
- [ ] `npm run dev` rodou sem erro

---

## 6. Regra que vale para tudo

> Informação não confirmada não vai ao ar.

Campo `null` ou lista vazia faz a seção desaparecer. Isso é proteção: melhor
uma página com menos informação do que uma página com informação errada.

Nunca publique medida "aproximada", prazo "mais ou menos" ou telefone de
exemplo. Se não foi confirmado pela GAMA, deixe `null`.
