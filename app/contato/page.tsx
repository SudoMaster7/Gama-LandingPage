import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a equipe comercial da GAMA Embalagens para solicitar uma cotação de bobinas, sacolas, filme PVC e filme stretch.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  const hasChannel = Boolean(contact.whatsapp || contact.email || contact.phone);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-4xl font-extrabold text-balance">Contato</h1>
      <p className="mt-3 text-lg text-[var(--gama-suave)]">
        O caminho mais rápido é enviar sua solicitação de orçamento com produto, medida,
        quantidade e cidade — a equipe já recebe o contexto completo.
      </p>

      <ButtonLink href="/orcamento" size="lg" className="mt-6">
        Solicitar orçamento
      </ButtonLink>

      {hasChannel && (
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold">Canais oficiais</h2>
          <ul className="mt-5 space-y-3">
            {contact.whatsappDisplay && (
              <Row icon={MessageCircle} label="WhatsApp" value={contact.whatsappDisplay} />
            )}
            {contact.phone && <Row icon={Phone} label="Telefone" value={contact.phone} />}
            {contact.email && (
              <Row
                icon={Mail}
                label="E-mail"
                value={contact.email}
                href={`mailto:${contact.email}`}
              />
            )}
            {contact.openingHours && (
              <Row icon={Clock} label="Horário de atendimento" value={contact.openingHours} />
            )}
            {contact.address && <Row icon={MapPin} label="Endereço" value={contact.address} />}
          </ul>

          <div className="mt-6">
            <WhatsAppButton position="contato" />
          </div>
        </section>
      )}
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <li className="flex gap-3 rounded-lg border border-[var(--gama-linha)] p-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gama-verde)]" />
      <div>
        <p className="text-xs font-semibold tracking-wide text-[var(--gama-suave)] uppercase">
          {label}
        </p>
        {href ? (
          <a href={href} className="font-medium underline">
            {value}
          </a>
        ) : (
          <p className="font-medium">{value}</p>
        )}
      </div>
    </li>
  );
}
