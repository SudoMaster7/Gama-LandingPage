import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-[var(--gama-verde)] text-white hover:bg-[var(--gama-verde-escuro)]",
        outline:
          "border-2 border-[var(--gama-verde)] text-[var(--gama-verde-escuro)] bg-white hover:bg-[var(--gama-verde-claro)]",
        ghost: "text-[var(--gama-texto)] hover:bg-[var(--gama-filme)]",
        dark: "bg-[var(--gama-preto)] text-white hover:opacity-90",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-13 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof button>;

export function Button({
  className,
  variant,
  size,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & Variants) {
  return <button className={cn(button({ variant, size }), className)} {...props} />;
}

export function ButtonLink({
  className,
  variant,
  size,
  href,
  ...props
}: React.ComponentProps<typeof Link> & Variants) {
  return (
    <Link href={href} className={cn(button({ variant, size }), className)} {...props} />
  );
}
