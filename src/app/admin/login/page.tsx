import { login } from '@/app/admin/auth-actions';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-bg text-paper flex items-center justify-center p-4">
      <div className="bg-bg-soft border border-[color:var(--line-dark)] p-8 rounded-[4px] w-full max-w-sm">
        <h1 className="text-xl font-bold mb-6 text-center">Inloggen Beheer</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded">
            {error}
          </div>
        )}

        <form action={login} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-mono mb-1 text-muted">E-mailadres</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-bg border border-[color:var(--line-dark)] rounded-[3px] p-2 text-sm focus:outline-none focus:border-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-mono mb-1 text-muted">Wachtwoord</label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-bg border border-[color:var(--line-dark)] rounded-[3px] p-2 text-sm focus:outline-none focus:border-orange"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange text-bg font-bold py-2 rounded-[3px] text-sm hover:bg-orange-dark transition-colors mt-2"
          >
            Inloggen
          </button>
        </form>
      </div>
    </main>
  );
}