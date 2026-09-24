import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { company, contact } from "@/lib/content";

const montserrat = Montserrat({
  variable: "--font-gama-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: "GAMA Embalagens | Bobinas, Sacolas, Filme PVC e Stretch",
    template: "%s | GAMA Embalagens",
  },
  description:
    "Conheça os produtos da GAMA Embalagens e solicite uma cotação para sua empresa. Consulte bobina fundo estrela, sacolas, filme PVC e filme stretch.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "GAMA Embalagens",
  },
  robots: { index: true, follow: true },
};

function OrganizationJsonLd() {
  // Só publicamos dados estruturados que existem e foram confirmados.
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.brandName,
    url: company.siteUrl,
  };
  if (contact.legalName) data.legalName = contact.legalName;
  if (contact.email) data.email = contact.email;
  if (contact.phone) data.telephone = contact.phone;
  if (contact.address) data.address = contact.address;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded focus:bg-[var(--gama-verde)] focus:px-4 focus:py-2 focus:text-white"
        >
          Ir para o conteúdo
        </a>
        <Header />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton position="floating" />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
