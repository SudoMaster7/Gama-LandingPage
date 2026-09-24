import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogClient } from "@/components/site/CatalogClient";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Catálogo da GAMA Embalagens: bobina fundo estrela, sacolas, filme PVC e filme stretch. Selecione os itens e solicite uma cotação.",
  alternates: { canonical: "/produtos" },
};

export default function ProdutosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-balance">Produtos</h1>
        <p className="mt-3 text-lg text-[var(--gama-suave)]">
          Selecione os itens de seu interesse e envie uma única solicitação de cotação.
        </p>
      </header>

      <Suspense fallback={<p className="text-[var(--gama-suave)]">Carregando catálogo…</p>}>
        <CatalogClient />
      </Suspense>
    </div>
  );
}
