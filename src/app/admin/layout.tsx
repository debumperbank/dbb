import Link from "next/link";
import { logout } from "@/app/admin/auth-actions";

export const dynamic = "force-dynamic";

export const metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-soft text-paper flex flex-col md:flex-row">
      <aside className="w-full md:w-56 shrink-0 border-r border-[color:var(--line-dark)] bg-bg px-5 py-7 flex flex-col">
        <div className="font-display font-bold text-sm mb-8">
          DE <span className="text-orange">BUMPER</span>BANK{" "}
          <span className="text-muted font-mono text-[10px]">/ beheer</span>
        </div>
        <nav className="flex flex-wrap md:flex-col gap-1 text-sm">
          <Link
            href="/admin"
            className="px-3 py-2 rounded-[3px] hover:bg-bg-soft-2 transition-colors"
          >
            Overzicht
          </Link>
          <Link
            href="/admin/appointments"
            className="px-3 py-2 hover:text-orange"
          >
            Agenda
          </Link>
          <Link href="/admin/customers" className="px-3 py-2 hover:text-orange">
            Klanten
          </Link>
          <Link href="/admin/vehicles" className="px-3 py-2 hover:text-orange">
            Voertuigen
          </Link>
          <Link
            href="/admin/work-orders"
            className="px-3 py-2 hover:text-orange"
          >
            Werkorders
          </Link>
          <Link href="/admin/trade-ins" className="px-3 py-2 hover:text-orange">
            Inkoop
          </Link>
          <Link
            href="/admin/listings"
            className="px-3 py-2 rounded-[3px] hover:bg-bg-soft-2 transition-colors"
          >
            Voorraad
          </Link>
          <Link
            href="/admin/inquiries"
            className="px-3 py-2 rounded-[3px] hover:bg-bg-soft-2 transition-colors"
          >
            Interesses
          </Link>
          <Link
            href="/admin/bookings"
            className="px-3 py-2 rounded-[3px] hover:bg-bg-soft-2 transition-colors"
          >
            Boekingen
          </Link>
        </nav>
        <div className="mt-auto pt-6">
          <Link
            href="/"
            className="block text-xs text-muted font-mono mb-3 hover:text-paper"
          >
            ← Naar de site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-xs text-muted font-mono hover:text-orange"
            >
              Uitloggen
            </button>
          </form>
        </div>
      </aside>
      <div className="flex-1 min-w-0 px-5 py-10 md:px-12">{children}</div>
    </div>
  );
}
