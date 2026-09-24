import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ProtocolBadge } from "@/components/site/ProtocolBadge";

export const metadata: Metadata = {
  title: "Solicitação enviada",
  robots: { index: false, follow: false },
};

export default function EnviadoPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <CheckCircle2
        className="mx-auto h-16 w-16 text-[var(--gama-verde)]"
        aria-hidden
      />
      <h1 className="mt-6 text-3xl font-extrabold text-balance">Solicitação recebida.</h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--gama-suave)]">
        A GAMA usará o contato informado para dar continuidade ao seu orçamento.
      </p>

      <Suspense fallback={null}>
        <ProtocolBadge />
      </Suspense>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/produtos" variant="outline">
          Voltar aos produtos
        </ButtonLink>
        <ButtonLink href="/">Ir para a página inicial</ButtonLink>
      </div>
    </div>
  );
}
