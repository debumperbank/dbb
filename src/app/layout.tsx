import { EXAMPLE_MODE } from "@/lib/public-offering";
import {PublicOnly} from "@/components/PublicOnly";
import { CartProvider } from "@/components/CartProvider";
import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.debumperbank.nl",
  ),
  icons: { icon: "/brand/de-bumperbank-service-icon.png", apple: "/brand/de-bumperbank-service-icon.png" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "De Bumperbank",
    images: [{ url: "/detailing-hero.png", alt: EXAMPLE_MODE ? "De Bumperbank — In opbouw" : "De Bumperbank — Detailing & webshop" }],
  },
  title: EXAMPLE_MODE ? "De Bumperbank — In opbouw" : "De Bumperbank — Detailing & webshop",
  description:
    EXAMPLE_MODE ? "Maak kennis met De Bumperbank en onze autopassie. Onze website is in opbouw. Bestellen, betalen en afspraken maken is momenteel niet mogelijk." : "Persoonlijke auto detailing op afspraak, locatie in overleg. Ontdek autoverzorging van DRIFT, GECKO en Cartec en de ontwikkeling van BUMPR.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="nl"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Analytics />
        <CartProvider>
          <a href="#page-content" className="skip-link">Direct naar de inhoud</a>
          <PublicOnly><Nav /></PublicOnly>
          <div id="page-content" tabIndex={-1}>{children}</div>
          <PublicOnly><Footer /></PublicOnly>
        </CartProvider>
      </body>
    </html>
  );
}
