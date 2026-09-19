import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "stamp" | "outline" | "quiet";

const VARIANT_CLASSES: Record<Variant, string> = {
  stamp:
    "bg-stamp text-[color:var(--stamp-ink)] border-2 border-stamp-dark shadow-[2px_2px_0_var(--stamp-dark)] hover:-translate-y-px hover:shadow-[3px_3px_0_var(--stamp-dark)] active:translate-y-0 active:shadow-[1px_1px_0_var(--stamp-dark)]",
  outline:
    "bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-paper",
  quiet: "bg-transparent text-ink-soft border-2 border-transparent hover:text-ink",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none";

export function Button({
  variant = "stamp",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`} {...props} />
  );
}

export function LinkButton({
  variant = "stamp",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return <a className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`} {...props} />;
}
