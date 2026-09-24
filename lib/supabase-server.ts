import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com service role — EXCLUSIVO do servidor.
 * Nunca importar em componentes client. As tabelas do schema `site` não têm
 * nenhuma policy pública; toda escrita passa por aqui.
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "site" },
  });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
