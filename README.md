# GAMA Embalagens — site institucional

Site comercial da GAMA Embalagens: catálogo dos produtos e captação de
solicitações de orçamento (cotação multi-item).

Construído a partir de `BRIEFING-SITE-INSTITUCIONAL-GAMA.md` e
`GAMA-MVP-SITE-E-ESTRUTURA-COMERCIAL.md`.

## Stack

Next.js 16 (App Router) · TypeScript estrito · Tailwind v4 · Supabase (Postgres) · Vercel

## Rodar localmente

```bash
npm install
cp .env.local.example .env.local   # preencha o que já tiver
npm run dev                        # http://localhost:3000
```

Sem as variáveis do Supabase, os leads são gravados em `.leads/` (somente
desenvolvimento) para permitir testar o fluxo de ponta a ponta.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (inclui typecheck) |
| `npm run lint` | ESLint |
| `npm test` | Testes de schema, protocolo e regra de publicação |

## Regra central do conteúdo

Todo o conteúdo publicável vive em `/content` (JSON versionado).

**Campo `null`, vazio ou com marcador provisório (`"a validar"`, `[ALGO]`)
não renderiza — a seção some da página.** Isso garante que nenhum texto
provisório chegue ao ar. A regra está em `lib/publishable.ts` e é coberta por
testes.

Consequência prática: o site já funciona hoje e vai ficando mais completo à
medida que a GAMA confirma cada informação. Veja `CHECKLIST-GAMA.md`.

## O que precisa ser preenchido

- `content/company.json` — CNPJ, endereço, WhatsApp, e-mail, horário, texto institucional
- `content/products/*.json` — fichas técnicas (`variants`) e fotos (`images[].src`)
- `content/segments.json` — mudar `status` para `"validado"` conforme a GAMA confirmar
  (em produção só aparecem os validados)

Imagens de produto vão em `public/img/` e são referenciadas em `images[].src`.

## Deploy na Vercel

1. Importar o repositório na Vercel (framework Next.js detectado automaticamente).
2. Configurar as variáveis de ambiente (ver `.env.local.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — **obrigatórias**
   - `RESEND_API_KEY`, `LEADS_NOTIFY_TO` — aviso ao comercial
   - `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — anti-abuso
3. Rodar a migração `supabase/migrations/0001_site_schema.sql` no Supabase.
4. Apontar o domínio da GAMA e atualizar `siteUrl` em `content/company.json`.

Sem Supabase configurado, a API recusa gravar em produção — não existe fallback
silencioso em arquivo.

## Segurança

- Service role **só no servidor** (`lib/supabase-server.ts` usa `server-only`).
- Tabelas `site.*` com RLS e **nenhuma policy pública** — leitura só para membros
  autenticados em `site.team_members`.
- `POST /api/quote`: validação zod no servidor, rate limit por IP, Turnstile e
  idempotência (reenvio da mesma tentativa devolve o mesmo protocolo).
- Eventos de análise nunca recebem nome, telefone, e-mail ou texto livre.
- `/interno` fora do sitemap e bloqueado no robots.

## Identidade

Tokens em `app/globals.css` (verde `#2e8b40`, preto, branco), tipografia
Montserrat, logo em `components/site/Logo.tsx` e favicon em `app/icon.svg`.
Logo e favicon são reconstruções a partir do manual de marca — substituir pelo
vetor oficial quando a GAMA enviar.

## Pendente antes do go-live

- Login da equipe em `/interno/leads` (Supabase Auth) — hoje a rota se bloqueia
  sozinha quando o Supabase está configurado, para não expor leads.
- Fotos e fichas reais dos produtos.
- Definir o responsável pelo recebimento dos leads.
