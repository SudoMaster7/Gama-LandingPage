import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { QuoteRequest } from "@/lib/schemas";

/**
 * Gravação local de leads enquanto o Supabase não estiver configurado.
 * Permite testar o fluxo de ponta a ponta em desenvolvimento.
 *
 * NÃO usar em produção: o arquivo não tem controle de acesso.
 * Em produção, isSupabaseConfigured() deve ser verdadeiro.
 */
const FILE = path.join(process.cwd(), ".leads", "quote-requests.json");

type StoredLead = QuoteRequest & { protocol: string; createdAt: string; stage: string };

async function readAll(): Promise<StoredLead[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as StoredLead[];
  } catch {
    return [];
  }
}

export async function findLeadByIdempotencyKey(key: string): Promise<StoredLead | null> {
  const all = await readAll();
  return all.find((l) => l.idempotencyKey === key) ?? null;
}

export async function saveLeadToFile(
  data: QuoteRequest,
  makeProtocol: () => string,
): Promise<{ protocol: string; duplicated: boolean }> {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Supabase não configurado em produção. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const all = await readAll();
  const existing = all.find((l) => l.idempotencyKey === data.idempotencyKey);
  if (existing) return { protocol: existing.protocol, duplicated: true };

  const protocol = makeProtocol();
  all.push({ ...data, protocol, createdAt: new Date().toISOString(), stage: "recebido" });

  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(all, null, 2), "utf8");

  return { protocol, duplicated: false };
}

export async function listLeadsFromFile(): Promise<StoredLead[]> {
  const all = await readAll();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
