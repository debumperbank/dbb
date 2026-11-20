"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="nl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0e0f11",
          color: "#f4f3f0",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "4rem 1.25rem",
        }}
      >
        <main style={{ maxWidth: "40rem" }}>
          <p style={{ color: "#f5d028", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Even niet beschikbaar
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 1.05, margin: "1rem 0" }}>
            Deze pagina kan nu niet worden geladen.
          </h1>
          <p style={{ color: "#9195a0", lineHeight: 1.6 }}>
            Probeer het opnieuw. Lukt dat niet, ga terug naar de startpagina.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.75rem" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                background: "#f5d028",
                color: "#101113",
                border: 0,
                borderRadius: "0.375rem",
                minHeight: "3rem",
                padding: "0.75rem 1.25rem",
                fontWeight: 600,
              }}
            >
              Opnieuw proberen
            </button>
            <Link
              href="/"
              style={{
                color: "#f4f3f0",
                border: "1px solid rgba(244,243,240,0.35)",
                borderRadius: "0.375rem",
                minHeight: "3rem",
                padding: "0.75rem 1.25rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Naar de startpagina
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
