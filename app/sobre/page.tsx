import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { company, contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sobre a GAMA",
  description:
    "Conheça a GAMA Embalagens, seu catálogo de produtos e como solicitar uma cotação para o seu negócio.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  const hasStory = Boolean(company.about.lead || company.about.body);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-4xl font-extrabold text-balance">Conheça a GAMA Embalagens.</h1>

      {hasStory ? (
        <>
          {company.about.lead && (
            <p className="mt-5 text-lg leading-relaxed">{company.about.lead}</p>
          )}
          {company.about.body && (
            <p className="mt-4 leading-relaxed text-[var(--gama-suave)]">
              {company.about.body}
            </p>
          )}
        </>
      ) : (
        <p className="mt-5 text-lg leading-relaxed text-[var(--gama-suave)]">
          A GAMA Embalagens atua no {company.activityLabel.toLowerCase()}, com foco nas
          linhas de bobina fundo estrela, sacolas, filme PVC e filme stretch. Consulte
          nosso catálogo e solicite uma cotação para a sua operação.
        </p>
      )}

      {(contact.address || contact.coverage || contact.openingHours || contact.cnpj) && (
        <section className="mt-10 rounded-lg border border-[var(--gama-linha)] bg-[var(--gama-filme)] p-6">
          <h2 className="text-xl font-extrabold">Dados da empresa</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {contact.legalName && <Item label="Razão social" value={contact.legalName} />}
            {contact.cnpj && <Item label="CNPJ" value={contact.cnpj} />}
            {contact.address && <Item label="Endereço" value={contact.address} />}
            {contact.coverage && <Item label="Atendimento" value={contact.coverage} />}
            {contact.openingHours && <Item label="Horário" value={contact.openingHours} />}
          </dl>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold">Fale com a equipe</h2>
        <p className="mt-3 text-[var(--gama-suave)]">
          Conte o que sua empresa precisa e receba uma cotação com as opções disponíveis.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/orcamento">Solicitar orçamento</ButtonLink>
          <WhatsAppButton position="sobre" />
        </div>
      </section>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-[var(--gama-suave)] uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 leading-relaxed font-medium">{value}</dd>
    </div>
  );
}
