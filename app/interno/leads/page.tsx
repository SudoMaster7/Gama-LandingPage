import type { Metadata } from "next";
import { isSupabaseConfigured } from "@/lib/supabase-server";
import { listLeadsFromFile } from "@/lib/lead-fallback";
import { getProduct } from "@/lib/content";

export const metadata: Metadata = {
  title: "Leads (interno)",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

const STAGE_LABEL: Record<string, string> = {
  recebido: "Recebido",
  em_contato: "Em contato",
  necessidade_validada: "Necessidade validada",
  cotacao_enviada: "Cotação enviada",
  negociacao: "Negociação",
  pedido: "Pedido",
  perdido: "Perdido",
  sem_perfil: "Sem perfil",
};

export default async function LeadsPage() {
  // Em produção este painel exige Supabase Auth + RLS (site.team_members).
  // O acesso é bloqueado enquanto a autenticação não estiver configurada,
  // para nunca expor leads publicamente.
  if (isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold">Painel de leads</h1>
        <div className="mt-6 rounded-lg border-2 border-amber-300 bg-amber-50 p-6">
          <h2 className="font-bold text-amber-900">Autenticação pendente</h2>
          <p className="mt-2 text-sm leading-relaxed text-amber-800">
            O Supabase está configurado, mas o login da equipe ainda não foi implementado
            nesta rota. Enquanto isso, o painel não lista nenhum lead — os dados só podem
            ser consultados por um membro autenticado presente em{" "}
            <code className="rounded bg-amber-100 px-1">site.team_members</code>.
          </p>
          <p className="mt-3 text-sm text-amber-800">
            Próximo passo: adicionar Supabase Auth (magic link) e o guard de sessão antes
            do go-live.
          </p>
        </div>
      </div>
    );
  }

  const leads = await listLeadsFromFile();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Leads recebidos</h1>
        <p className="mt-2 text-sm text-[var(--gama-suave)]">
          Modo desenvolvimento — leitura do arquivo local{" "}
          <code className="rounded bg-[var(--gama-filme)] px-1">.leads/</code>. Em produção
          esta tela exige login da equipe.
        </p>
      </header>

      {leads.length === 0 ? (
        <p className="rounded-lg border border-[var(--gama-linha)] bg-[var(--gama-filme)] p-8 text-center">
          Nenhuma solicitação recebida ainda.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[56rem] border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--gama-filme)] text-left">
                {["Protocolo", "Recebido", "Empresa", "Contato", "Cidade/UF", "Itens", "Etapa"].map(
                  (h) => (
                    <th key={h} scope="col" className="border border-[var(--gama-linha)] p-3">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.protocol}>
                  <td className="border border-[var(--gama-linha)] p-3 font-mono text-xs font-bold">
                    {lead.protocol}
                  </td>
                  <td className="border border-[var(--gama-linha)] p-3 whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleString("pt-BR")}
                  </td>
                  <td className="border border-[var(--gama-linha)] p-3">
                    <span className="font-semibold">{lead.businessName}</span>
                    <br />
                    <span className="text-xs text-[var(--gama-suave)]">{lead.name}</span>
                  </td>
                  <td className="border border-[var(--gama-linha)] p-3">
                    {lead.preferredChannel === "whatsapp" ? lead.phone : lead.email}
                    <br />
                    <span className="text-xs text-[var(--gama-suave)]">
                      via {lead.preferredChannel}
                    </span>
                  </td>
                  <td className="border border-[var(--gama-linha)] p-3 whitespace-nowrap">
                    {lead.city}/{lead.uf}
                  </td>
                  <td className="border border-[var(--gama-linha)] p-3">
                    {lead.items.length === 0 ? (
                      <em className="text-[var(--gama-suave)]">
                        {lead.needsGuidance ? "Pediu orientação" : "—"}
                      </em>
                    ) : (
                      <ul className="space-y-0.5">
                        {lead.items.map((i, idx) => (
                          <li key={idx}>
                            {getProduct(i.productSlug)?.name ?? i.productSlug}
                            {i.unknownSpec
                              ? " — não sabe informar"
                              : i.quantity
                                ? ` — ${i.quantity} ${i.unit ?? ""}`
                                : ""}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="border border-[var(--gama-linha)] p-3">
                    <span className="rounded bg-[var(--gama-verde-claro)] px-2 py-1 text-xs font-bold text-[var(--gama-verde-escuro)]">
                      {STAGE_LABEL[lead.stage] ?? lead.stage}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
