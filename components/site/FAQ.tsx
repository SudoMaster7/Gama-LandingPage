import { faq } from "@/lib/content";

export function FAQ({ items = faq }: { items?: { q: string; a: string }[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-3xl divide-y divide-[var(--gama-linha)] border-y border-[var(--gama-linha)]">
      {items.map((item) => (
        <details key={item.q} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
            {item.q}
            <span
              aria-hidden
              className="shrink-0 text-2xl leading-none text-[var(--gama-verde)] transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-[var(--gama-suave)]">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
