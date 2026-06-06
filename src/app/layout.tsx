import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import Providers from "@/components/Providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://postmd.vercel.app";
const siteDescription = "Простой сервис для публикации постов в формате Markdown";
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PostMD",
  url: siteUrl,
  applicationCategory: "WebApplication",
  operatingSystem: "Any",
  description: siteDescription,
  inLanguage: "ru",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PostMD - Markdown Paste Service",
    template: "%s | PostMD",
  },
  description: siteDescription,
  applicationName: "PostMD",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "PostMD - Markdown Paste Service",
    description: siteDescription,
    url: "/",
    siteName: "PostMD",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PostMD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PostMD - Markdown Paste Service",
    description: siteDescription,
    images: ["/og-image.svg"],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" dir="ltr">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <a className="skip-link" href="#main-content">
          К основному содержимому
        </a>
        <Providers>
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <footer className="site-footer">
            <nav aria-label="Служебные ссылки">
              <Link href="/">Главная</Link>
              <Link href="/privacy">Политика конфиденциальности</Link>
              <a href="/llms.txt">llms.txt</a>
            </nav>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
