# Checklist — o que pedir à GAMA

Cada item destravado libera uma parte do site. Enquanto não vier, a seção
correspondente simplesmente não aparece (nenhum texto provisório vai ao ar).

## Bloqueia o go-live

- [ ] **Logo em vetor** (SVG/AI/PDF) e cores oficiais
      → hoje o símbolo é uma reconstrução a partir do manual; substituir em
      `components/site/Logo.tsx`
- [ ] **Razão social, CNPJ e endereço publicável**
      → `content/company.json`: `legalName`, `cnpj`, `address`
- [ ] **A GAMA fabrica, distribui ou os dois?**
      → o material de marca diz "Comércio de embalagens"; confirmar.
      Muda o texto institucional inteiro. Nunca chamar de fabricante sem confirmar.
- [ ] **WhatsApp oficial (UM número), e-mail comercial e horário**
      → `content/company.json`: `whatsapp` (formato `5511999999999`),
      `whatsappDisplay`, `email`, `openingHours`.
      Enquanto vazio, o botão de WhatsApp não é renderizado.
      Atenção: os telefones que aparecem no mockup do caminhão e do cartão de
      visita são ilustrativos — não usar.
- [ ] **Cidades/regiões atendidas** → `coverage`
- [ ] **Responsável pelo recebimento dos leads** e rotina de resposta
      → sem isso o formulário vira caixa preta
- [ ] **Domínio** (existe? quem administra?) → atualizar `siteUrl`

## Libera as páginas de produto

- [ ] **Ficha de cada variação** dos 4 produtos
      (medida, espessura, unidade de fornecimento, unidades por embalagem)
      → `content/products/*.json`, campo `variants`.
      Hoje a tabela de especificações não aparece; no lugar fica
      "Especificações sob consulta". **É aqui que a GAMA ganha da Ultrax**,
      que não publica especificação nenhuma.
- [ ] **Fotos dos produtos** (ou autorização para sessão de fotos)
      → `public/img/` + `images[].src`.
      Hoje os cards mostram um espaço neutro identificado.
- [ ] **Aplicações validadas** por produto → `applications`
- [ ] **Restrições de uso** (ex.: contato com alimento, temperatura) → `limitations`

## Libera os segmentos de expansão

- [ ] Quais segmentos a GAMA **já atende** além de supermercados?
      → `content/segments.json`: mudar `status` para `"validado"`.
      Em produção só aparecem os validados. Hoje apenas `supermercados` está
      liberado; os outros cinco aparecem só em desenvolvimento.

## Melhora a conversão (não bloqueia)

- [ ] Pedido mínimo e condições que podem ser publicadas
- [ ] Texto institucional aprovado → `company.about.lead` e `about.body`
- [ ] Depoimentos autorizados e casos reais
- [ ] Fotos da equipe e da estrutura
- [ ] Dúvidas recorrentes que o comercial já recebe → viram FAQ
- [ ] Catálogo complementar (bandejas e demais itens)

## Infraestrutura (SUDO)

- [ ] Projeto Supabase criado + migração `0001_site_schema.sql` aplicada
- [ ] Chave Resend + e-mail de destino dos leads
- [ ] Cloudflare Turnstile (site key + secret)
- [ ] Login da equipe em `/interno/leads` (Supabase Auth)
