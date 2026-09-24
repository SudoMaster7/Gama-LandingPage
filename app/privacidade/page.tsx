import type { Metadata } from "next";
import Link from "next/link";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacidade",
  description:
    "Como a GAMA Embalagens trata os dados enviados pelo site ao solicitar uma cotação.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-4xl font-extrabold">Aviso de privacidade</h1>
      <p className="mt-3 text-[var(--gama-suave)]">
        Este aviso explica como tratamos os dados enviados pelo formulário de orçamento
        deste site.
      </p>

      <div className="mt-10 space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl font-extrabold">Quais dados coletamos</h2>
          <p className="mt-2 text-[var(--gama-suave)]">
            Coletamos apenas o necessário para responder a sua solicitação: nome, nome do
            negócio, canal de contato preferido (WhatsApp ou e-mail) com o respectivo
            contato, cidade e estado, segmento declarado, produtos de interesse,
            quantidades informadas e as observações que você escrever.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold">Para que usamos</h2>
          <p className="mt-2 text-[var(--gama-suave)]">
            Os dados são usados para entrar em contato, confirmar especificações e
            elaborar sua cotação. O envio do formulário não gera pedido, reserva de
            estoque ou cobrança.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold">Comunicações de marketing</h2>
          <p className="mt-2 text-[var(--gama-suave)]">
            O retorno sobre a sua cotação é independente de marketing. Você só recebe
            novidades e campanhas se marcar a opção correspondente no formulário, que
            nunca vem pré-selecionada, e pode pedir o cancelamento a qualquer momento.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold">Compartilhamento</h2>
          <p className="mt-2 text-[var(--gama-suave)]">
            Os dados ficam acessíveis à equipe comercial responsável pelo atendimento e
            aos provedores de hospedagem, banco de dados e envio de e-mail contratados
            para operar o site. Não vendemos dados pessoais.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold">Medição de uso do site</h2>
          <p className="mt-2 text-[var(--gama-suave)]">
            Medimos eventos de navegação de forma agregada (páginas vistas, produtos
            adicionados à cotação, envios concluídos). Nome, telefone, e-mail e texto
            livre nunca são enviados a ferramentas de análise.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold">Seus direitos</h2>
          <p className="mt-2 text-[var(--gama-suave)]">
            Você pode solicitar confirmação, acesso, correção ou exclusão dos seus dados,
            bem como informações sobre compartilhamento.{" "}
            {contact.email ? (
              <>
                Entre em contato pelo e-mail{" "}
                <a href={`mailto:${contact.email}`} className="underline">
                  {contact.email}
                </a>
                .
              </>
            ) : (
              <>
                Utilize os canais publicados na página de{" "}
                <Link href="/contato" className="underline">
                  contato
                </Link>
                .
              </>
            )}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold">Retenção</h2>
          <p className="mt-2 text-[var(--gama-suave)]">
            As solicitações são mantidas pelo tempo necessário ao atendimento comercial e
            ao cumprimento de obrigações legais aplicáveis.
          </p>
        </section>
      </div>
    </div>
  );
}
