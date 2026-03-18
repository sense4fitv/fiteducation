import type { Metadata } from "next";
import { Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fiteducation School - Școală de Fitness & Specializări",
  description: "Devino antrenor personal certificat. Cursuri de specializare în fitness: Personal Training, Aerobic, Nutriție Sportivă și Antrenament Funcțional.",
  keywords: "școală fitness, curs personal trainer, certificare fitness, antrenor personal, instructor aerobic, nutriție sportivă",
  openGraph: {
    title: "Fiteducation School - Școală de Fitness & Specializări",
    description: "Devino antrenor personal certificat. Cursuri de specializare în fitness.",
    type: "website",
    locale: "ro_RO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="scroll-smooth">
      <body
        className={`${poppins.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
