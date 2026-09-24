"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, FileText } from "lucide-react";
import { GamaLogo } from "@/components/site/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { useQuote } from "@/lib/quote-store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/produtos", label: "Produtos" },
  { href: "/#segmentos", label: "Soluções por negócio" },
  { href: "/sobre", label: "Sobre a GAMA" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const count = useQuote((s) => s.items.length);
  // Evita divergência de hidratação: o contador só aparece no cliente.
  const mounted = useHydrated();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--gama-linha)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="GAMA Embalagens — página inicial">
          <GamaLogo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.95rem] font-medium text-[var(--gama-texto)] hover:text-[var(--gama-verde-escuro)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href="/orcamento"
            size="sm"
            className="hidden sm:inline-flex"
            aria-label={
              mounted && count > 0
                ? `Solicitar orçamento — ${count} itens na cotação`
                : "Solicitar orçamento"
            }
          >
            <FileText className="h-4 w-4" aria-hidden />
            Solicitar orçamento
            {mounted && count > 0 && (
              <span className="ml-1 rounded-full bg-white/25 px-2 py-0.5 text-xs font-bold tabular-nums">
                {count}
              </span>
            )}
          </ButtonLink>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className={cn("border-t border-[var(--gama-linha)] bg-white lg:hidden")}
      >
        <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2" aria-label="Menu móvel">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-[var(--gama-filme)] py-3.5 font-medium"
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink href="/orcamento" className="my-3" onClick={() => setOpen(false)}>
            Solicitar orçamento{mounted && count > 0 ? ` (${count})` : ""}
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
