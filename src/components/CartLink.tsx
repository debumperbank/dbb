"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";
export function CartLink({ onClick }: { onClick?: () => void }) {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  return (
    <Link
      href="/bumpr/mandje"
      onClick={onClick}
      aria-label={`Winkelmandje, ${count} ${count === 1 ? "product" : "producten"}`}
      className="relative w-11 h-11 shrink-0 flex items-center justify-center border border-white/20 rounded-md hover:border-orange"
    >
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        aria-hidden="true"
      >
        <path d="M3 3h2l3 12h11l2-8H6" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 rounded-full bg-orange text-ink min-w-5 h-5 px-1 text-xs flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
