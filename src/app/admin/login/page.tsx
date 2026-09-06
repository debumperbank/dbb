import { login } from '@/app/admin/auth-actions';

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-8">
      <div className="w-full max-w-sm">
        <div className="eyebrow mb-3"><span className="dot" />Beheer</div>
        <h1 className="text-2xl mb-6">Inloggen</h1>
        <form action={login} className="grid gap-4">
          <input
            required
            type="email"
            name="email"
            placeholder="E-mailadres"
            autoComplete="username"
            className="bg-bg-soft border border-[color:var(--line-dark)] rounded-[3px] px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:border-orange"
          />
          <input
            required
            type="password"
            name="password"
            placeholder="Wachtwoord"
            autoComplete="current-password"
            className="bg-bg-soft border border-[color:var(--line-dark)] rounded-[3px] px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:border-orange"
          />
          <button type="submit" className="btn btn-primary w-fit">Inloggen</button>
          {searchParams.error && (
            <p className="font-mono text-xs text-orange-bright">{searchParams.error}</p>
          )}
        </form>
        <p className="mt-6 text-xs text-muted font-mono leading-relaxed">
          Beheeraccounts worden aangemaakt in het Supabase-dashboard onder
          Authentication → Users. Er is geen zelfregistratie.
        </p>
      </div>
    </main>
  );
}
