-- GAMA Embalagens — schema do site público
-- Isolado das tabelas operacionais (clientes, vendas, frota).
-- O site público NUNCA lê estas tabelas: não existe nenhuma policy para anon.

create schema if not exists site;

do $$ begin
  create type site.lead_stage as enum (
    'recebido','em_contato','necessidade_validada','cotacao_enviada',
    'negociacao','pedido','perdido','sem_perfil'
  );
exception when duplicate_object then null;
end $$;

create table if not exists site.quote_requests (
  id                uuid primary key default gen_random_uuid(),
  protocol          text unique not null,
  idempotency_key   uuid unique not null,
  created_at        timestamptz not null default now(),
  name              text not null check (char_length(name) between 2 and 120),
  business_name     text not null check (char_length(business_name) between 2 and 160),
  preferred_channel text not null check (preferred_channel in ('whatsapp','email')),
  phone             text,
  email             text,
  city              text not null,
  uf                char(2) not null,
  segment           text,
  purchase_type     text check (purchase_type in ('recorrente','eventual','nao_sei')),
  notes             text check (char_length(notes) <= 2000),
  needs_guidance    boolean not null default false,
  source_page       text,
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  marketing_opt_in  boolean not null default false,
  stage             site.lead_stage not null default 'recebido',
  assigned_to       uuid references auth.users(id),
  constraint contact_required check (
    (preferred_channel = 'whatsapp' and phone is not null) or
    (preferred_channel = 'email'    and email is not null)
  )
);

create index if not exists quote_requests_created_idx on site.quote_requests (created_at desc);
create index if not exists quote_requests_stage_idx   on site.quote_requests (stage);

create table if not exists site.quote_items (
  id            uuid primary key default gen_random_uuid(),
  request_id    uuid not null references site.quote_requests(id) on delete cascade,
  product_slug  text not null,
  variant_label text,
  quantity      numeric,
  unit          text,
  unknown_spec  boolean not null default false
);

create index if not exists quote_items_request_idx on site.quote_items (request_id);

create table if not exists site.stage_history (
  id         bigserial primary key,
  request_id uuid not null references site.quote_requests(id) on delete cascade,
  from_stage site.lead_stage,
  to_stage   site.lead_stage not null,
  changed_by uuid references auth.users(id),
  changed_at timestamptz not null default now(),
  note       text
);

create table if not exists site.team_members (
  user_id uuid primary key references auth.users(id),
  role    text not null check (role in ('admin','comercial'))
);

alter table site.quote_requests enable row level security;
alter table site.quote_items    enable row level security;
alter table site.stage_history  enable row level security;
alter table site.team_members   enable row level security;

-- Nenhuma policy para anon/public: inserção só pelo servidor (service role).
drop policy if exists team_read    on site.quote_requests;
drop policy if exists team_update  on site.quote_requests;
drop policy if exists team_items   on site.quote_items;
drop policy if exists team_history on site.stage_history;
drop policy if exists self_member  on site.team_members;

create policy team_read on site.quote_requests for select
  using (exists (select 1 from site.team_members t where t.user_id = auth.uid()));

create policy team_update on site.quote_requests for update
  using (exists (select 1 from site.team_members t where t.user_id = auth.uid()));

create policy team_items on site.quote_items for select
  using (exists (select 1 from site.team_members t where t.user_id = auth.uid()));

create policy team_history on site.stage_history for all
  using (exists (select 1 from site.team_members t where t.user_id = auth.uid()));

create policy self_member on site.team_members for select
  using (user_id = auth.uid());

-- Garantia explícita: o papel anônimo não tem nenhum privilégio no schema.
revoke all on schema site from anon;
revoke all on all tables in schema site from anon;
