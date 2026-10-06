"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
export function SecurityForm() {
  const [factor, setFactor] = useState("");
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const db = createClient();
    Promise.all([db.auth.mfa.listFactors(), db.auth.mfa.getAuthenticatorAssuranceLevel()]).then(([f, a]) => {
      if (f.error || a.error) { setError("Accountcontrole mislukt. Vernieuw de pagina."); return; }
      setFactor(f.data.totp.find(x => x.status === "verified")?.id || "");
      setActive(a.data.currentLevel === "aal2"); setReady(true);
    }).catch(() => setError("Accountcontrole mislukt. Vernieuw de pagina."));
  }, []);
  async function enroll() {
    setBusy(true); setError("");
    try {
      const db = createClient();
      const factors = await db.auth.mfa.listFactors();
      if (factors.error) throw factors.error;
      // Clear abandoned setups only; never remove a verified factor.
      for (const f of factors.data.all.filter(f => f.factor_type === "totp" && f.status === "unverified")) {
        const result = await db.auth.mfa.unenroll({ factorId: f.id });
        if (result.error) throw result.error;
      }
      const result = await db.auth.mfa.enroll({ factorType: "totp", friendlyName: "De Bumperbank beheer" });
      if (result.error) throw result.error;
      setFactor(result.data.id); setQr(result.data.totp.qr_code);
    } catch { setError("Koppelen mislukt. Probeer het opnieuw."); }
    finally { setBusy(false); }
  }
  async function verify(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const result = await createClient().auth.mfa.challengeAndVerify({ factorId: factor, code });
      if (result.error) throw result.error;
      setQr(""); setCode(""); window.location.assign("/admin");
    } catch { setError("De code is ongeldig of verlopen. Probeer de nieuwste code."); setBusy(false); }
  }
  if (active) return <p>Tweestapsverificatie is actief voor deze sessie. <a href="/admin" className="underline">Naar beheer</a></p>;
  return <div className="space-y-5">
    {!factor && <button disabled={busy || !ready} onClick={enroll} className="btn btn-primary">Authenticator koppelen</button>}
    {qr && <div><p className="mb-3">Scan deze persoonlijke QR-code met je authenticator-app. Bewaar toegang tot die app op een veilige manier en deel deze QR-code niet.</p>
      {/* Supabase returns an SVG; use an image, never inject SVG markup. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qr.startsWith("data:") ? qr : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qr)}`} alt="Persoonlijke QR-code voor je authenticator" width={240} height={240} className="bg-white p-3" /></div>}
    {factor && <form onSubmit={verify} className="grid gap-4">
      <label htmlFor="mfa-code">Code uit je authenticator-app</label>
      <input id="mfa-code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required className="bg-bg-soft border rounded px-4 py-3" />
      <button disabled={busy || code.length !== 6} className="btn btn-primary">Code bevestigen</button>
    </form>}
    {error && <p role="alert">{error}</p>}
    <p className="text-sm text-muted">Verlies je toegang tot je authenticator, dan moet de eigenaar via het beveiligde Supabase-account de toegang herstellen.</p>
  </div>;
}
