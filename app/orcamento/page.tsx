import type { Metadata } from "next";
import { QuoteForm } from "@/components/site/QuoteForm";

export const metadata: Metadata = {
  title: "Solicitar orçamento",
  description:
    "Monte sua lista de produtos e solicite uma cotação à GAMA Embalagens. Informe medida, quantidade e cidade para agilizar o atendimento.",
  alternates: { canonical: "/orcamento" },
  robots: { index: true, follow: true },
};

export default function OrcamentoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-balance">Solicitar orçamento</h1>
        <p className="mt-3 text-lg text-[var(--gama-suave)]">
          Envie seus produtos de interesse em uma única solicitação. A equipe confirma
          especificações, disponibilidade e condições comerciais.
        </p>
      </header>

      <QuoteForm />
    </div>
  );
}
