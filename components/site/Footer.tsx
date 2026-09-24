import Link from "next/link";
import { GamaLogo } from "@/components/site/Logo";
import { company, contact, products } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-[var(--gama-linha)] bg-[var(--gama-preto)] text-[#d7dfd9]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <GamaLogo variant="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#9fada5]">
            {company.activityLabel}. Consulte nossas linhas e solicite uma cotação para o
            seu negócio.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold tracking-wide text-white uppercase">
            Produtos
          </h2>
          <ul className="space-y-2 text-sm">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/produtos/${p.slug}`} className="hover:text-white">
                  {p.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/produtos" className="hover:text-white">
                Ver catálogo completo
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold tracking-wide text-white uppercase">
            Institucional
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/sobre" className="hover:text-white">
                Sobre a GAMA
              </Link>
            </li>
            <li>
              <Link href="/orcamento" className="hover:text-white">
                Solicitar orçamento
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-white">
                Contato
              </Link>
            </li>
            <li>
              <Link href="/privacidade" className="hover:text-white">
                Privacidade
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold tracking-wide text-white uppercase">
            Atendimento
          </h2>
          <ul className="space-y-2 text-sm">
            {contact.whatsappDisplay && <li>WhatsApp: {contact.whatsappDisplay}</li>}
            {contact.phone && <li>Telefone: {contact.phone}</li>}
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-white">
                  {contact.email}
                </a>
              </li>
            )}
            {contact.openingHours && <li>{contact.openingHours}</li>}
            {contact.address && <li className="leading-relaxed">{contact.address}</li>}
            {!contact.whatsappDisplay && !contact.email && (
              <li>
                <Link href="/contato" className="underline hover:text-white">
                  Ver canais de contato
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 text-xs text-[#8b978f]">
          <p>
            © {year} {contact.legalName ?? company.brandName}
            {contact.cnpj ? ` — CNPJ ${contact.cnpj}` : ""}
          </p>
          <p>
            Os produtos, especificações e condições comerciais são confirmados na
            cotação.
          </p>
        </div>
      </div>
    </footer>
  );
}
