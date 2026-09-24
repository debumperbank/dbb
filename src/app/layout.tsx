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
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "De Bumperbank",
    images: [{ url: "/hero-garage.jpg", alt: "De Bumperbank — autoservice in regio Hulst" }],
  },
  title: "De Bumperbank — Mobiele autoservice in regio Hulst",
  description:
    "Onderhoud, reparatie en detailing op locatie in regio Hulst. Vraag een afspraak aan, bekijk onze occasions of bied je auto aan.",
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
          <Nav />
          <div id="page-content" tabIndex={-1}>{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
