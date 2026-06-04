import type { Metadata } from "next";
import { Unbounded, Geist, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fiteducation.ro'),
  title: "Fiteducation School - Școală de Fitness & Specializări",
  description: "Devino antrenor personal certificat. Cursuri de specializare în fitness: Personal Training, Aerobic, Nutriție Sportivă și Antrenament Funcțional.",
  keywords: "școală fitness, curs personal trainer, certificare fitness, antrenor personal, instructor aerobic, nutriție sportivă",
  icons: {
    icon: "/favico.jpg",
    shortcut: "/favico.jpg",
    apple: "/favico.jpg",
  },
  openGraph: {
    title: "Fiteducation School - Școală de Fitness & Specializări",
    description: "Devino antrenor personal certificat. Cursuri de specializare în fitness.",
    type: "website",
    locale: "ro_RO",
    images: [
      {
        url: "/ogimage.jpg",
        width: 1200,
        height: 630,
        alt: "Fiteducation School - Școală de Fitness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiteducation School - Școală de Fitness & Specializări",
    description: "Devino antrenor personal certificat. Cursuri de specializare în fitness.",
    images: ["/ogimage.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={cn("scroll-smooth", "font-sans", geist.variable)}>
      <body
        className={`${unbounded.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
