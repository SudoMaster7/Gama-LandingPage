import Link from "next/link";
import { ArrowRight, ClipboardList, ListChecks, Ruler, Send } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductImage } from "@/components/site/ProductImage";
import { SegmentPicker } from "@/components/site/SegmentPicker";
import { FAQ } from "@/components/site/FAQ";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { company, contact, products } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      {/* 6.2 Primeira dobra — fachada real da GAMA ao fundo */}
      <section className="relative isolate overflow-hidden border-b border-[var(--gama-linha)] bg-[var(--gama-preto)]">
        {/* Foto da sede. aria-hidden: é ambientação, não conteúdo. */}
        <div className="absolute inset-0 -z-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/empresa/fachada.webp"
            alt=""
            aria-hidden
            className="h-full w-full object-cover object-center"
            fetchPriority="high"
          />
        </div>

        {/*
          Véu escuro em gradiente: garante contraste do texto sobre a foto.
          Mais fechado à esquerda, onde fica o texto; mais aberto à direita,
          para a fachada continuar reconhecível.
        */}
        <div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-950/95 via-green-950/80 to-black/75"
            aria-hidden="true"
        />

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-3 text-sm font-bold tracking-[0.18em] text-[var(--gama-verde-claro)] uppercase">
              {company.activityLabel}
            </p>
            <h1 className="text-4xl leading-[1.1] font-extrabold text-balance text-white sm:text-5xl">
              Embalagens para a rotina do seu negócio.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
              Conheça bobina fundo estrela, sacolas, filme PVC e filme stretch. Conte à
              GAMA o que sua empresa precisa e solicite uma cotação.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/orcamento" size="lg">
                Solicitar orçamento
              </ButtonLink>
              <ButtonLink
                href="/produtos"
                variant="outline"
                size="lg"
                className="border-white/70 bg-white/5 text-white hover:bg-white/15"
              >
                Conhecer os produtos
              </ButtonLink>
            </div>
            <p className="mt-5 max-w-lg text-sm text-white/70">
              Não sabe a medida ou a quantidade ideal? Descreva sua aplicação para a
              equipe avaliar.
            </p>
          </div>

          {/* Composição com os quatro produtos identificados */}
          <ul className="grid grid-cols-2 gap-3">
            {products.map((p, i) => (
              <li
                key={p.slug}
                className="overflow-hidden rounded-lg border border-white/15 bg-white/95 shadow-lg backdrop-blur-sm"
              >
                <Link href={`/produtos/${p.slug}`} className="block">
                  <ProductImage product={p} className="h-28 w-full" priority={i < 2} />
                  <span className="block px-3 py-2.5 text-sm font-semibold">
                    {p.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6.3 Produtos em destaque */}
      <section className="mx-auto max-w-6xl px-4 py-16" aria-labelledby="h-produtos">
        <div className="mb-8 max-w-2xl">
          <h2 id="h-produtos" className="text-3xl font-extrabold text-balance">
            Encontre o produto que sua operação precisa.
          </h2>
          <p className="mt-3 text-[var(--gama-suave)]">
            Explore as principais linhas da GAMA e informe os itens de seu interesse para
            cotação.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} position="home_destaque" />
          ))}
        </div>

        <p className="mt-6 text-sm text-[var(--gama-suave)]">
          Adicionar à cotação não confirma compra, preço ou reserva de estoque.
        </p>
      </section>

      {/* 6.4 Entrada por tipo de negócio */}
      <section
        id="segmentos"
        className="scroll-mt-20 border-y border-[var(--gama-linha)] bg-[var(--gama-filme)]"
        aria-labelledby="h-segmentos"
      >
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 max-w-2xl">
            <h2 id="h-segmentos" className="text-3xl font-extrabold text-balance">
              Qual é o seu tipo de negócio?
            </h2>
            <p className="mt-3 text-[var(--gama-suave)]">
              Veja os produtos que podem fazer parte da sua rotina e confirme as opções
              com nossa equipe.
            </p>
          </div>
          <SegmentPicker />
        </div>
      </section>

      {/* 6.5 Clareza na escolha */}
      <section className="mx-auto max-w-6xl px-4 py-16" aria-labelledby="h-clareza">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 id="h-clareza" className="text-3xl font-extrabold text-balance">
              Uma cotação começa com as informações certas.
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--gama-suave)]">
              Produto, medida, quantidade e cidade de entrega ajudam a entender sua
              necessidade. Se alguma informação ainda estiver em aberto, explique como
              pretende utilizar o material.
            </p>
            <ButtonLink href="/orcamento" variant="outline" className="mt-6">
              Montar minha cotação
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Ruler, t: "Medida", d: "Largura, altura ou espessura que você já utiliza." },
              { icon: ListChecks, t: "Quantidade", d: "Por rolo, caixa, fardo ou milheiro." },
              { icon: ClipboardList, t: "Aplicação", d: "Onde e como o material será usado." },
              { icon: Send, t: "Cidade e UF", d: "Para conferirmos o atendimento na sua região." },
            ].map(({ icon: Icon, t, d }) => (
              <li
                key={t}
                className="rounded-lg border border-[var(--gama-linha)] bg-white p-5"
              >
                <Icon className="h-6 w-6 text-[var(--gama-verde)]" aria-hidden />
                <h3 className="mt-3 font-bold">{t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--gama-suave)]">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6.6 Sobre a GAMA — só renderiza o que foi aprovado */}
      {(company.about.lead || company.about.body) && (
        <section
          className="border-y border-[var(--gama-linha)] bg-[var(--gama-filme)]"
          aria-labelledby="h-sobre"
        >
          <div className="mx-auto max-w-3xl px-4 py-16">
            <h2 id="h-sobre" className="text-3xl font-extrabold">
              Conheça a GAMA Embalagens.
            </h2>
            {company.about.lead && (
              <p className="mt-4 text-lg leading-relaxed">{company.about.lead}</p>
            )}
            {company.about.body && (
              <p className="mt-3 leading-relaxed text-[var(--gama-suave)]">
                {company.about.body}
              </p>
            )}
            <ButtonLink href="/sobre" variant="outline" className="mt-6">
              Sobre a empresa
            </ButtonLink>
          </div>
        </section>
      )}

      {/* 6.7 Como solicitar orçamento */}
      <section className="mx-auto max-w-6xl px-4 py-16" aria-labelledby="h-como">
        <h2 id="h-como" className="text-3xl font-extrabold">
          Como solicitar seu orçamento.
        </h2>
        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Escolha um ou mais produtos.",
            "Informe sua necessidade e cidade.",
            "Envie a solicitação à GAMA.",
            "A equipe confirma especificações, disponibilidade e condições comerciais.",
          ].map((step, i) => (
            <li
              key={step}
              className="rounded-lg border border-[var(--gama-linha)] bg-white p-5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gama-verde)] font-bold text-white">
                {i + 1}
              </span>
              <p className="mt-3 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 6.9 Perguntas frequentes */}
      <section
        className="border-y border-[var(--gama-linha)] bg-[var(--gama-filme)]"
        aria-labelledby="h-faq"
      >
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 id="h-faq" className="mb-8 text-3xl font-extrabold">
            Perguntas frequentes
          </h2>
          <FAQ />
        </div>
      </section>

      {/* 6.10 Chamada final */}
      <section className="gama-filme-bands bg-[var(--gama-preto)] text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-3xl font-extrabold text-balance">
            Conte à GAMA o que seu negócio precisa.
          </h2>
          <p className="mt-4 text-[#b9c4bd]">
            Selecione seus produtos e envie as informações para receber uma cotação.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/orcamento" size="lg">
              Solicitar orçamento
            </ButtonLink>
            {contact.whatsapp && (
              <WhatsAppButton
                position="home_cta"
                className="justify-center border-white bg-transparent text-white hover:bg-white/10"
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
