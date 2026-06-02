import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Preloader } from "@/components/portfolio/Preloader";
import { JsonLdSchema } from "@/components/portfolio/JsonLdSchema";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = 'https://upam1721.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Upam - WordPress Virtual Assistant & Web Designer",
  description:
    "WordPress Virtual Assistant & B2B Lead Generation specialist with 8+ years experience. Expert in WordPress site management, theme customization, plugin setup, speed optimization, and virtual assistant services.",
  keywords: [
    "Upam",
    "WordPress Virtual Assistant",
    "Web Designer",
    "B2B Lead Generation",
    "WordPress Developer",
    "Theme Customization",
    "Plugin Setup",
    "Speed Optimization",
    "Data Entry",
    "Virtual Assistant",
    "Freelancer",
    "Fiverr",
  ],
  authors: [{ name: "Upam", url: "https://www.fiverr.com/upam1721" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    other: [
      { rel: "mask-icon", url: "/icon.svg", color: "#06b6d4" },
    ],
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Upam - WordPress Virtual Assistant & Web Designer",
    description:
      "WordPress VA and B2B Lead Generation specialist with 8+ years experience. Professional WordPress site management, theme customization, and virtual assistant services.",
    siteName: "Upam Portfolio",
    type: "website",
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Upam - WordPress Virtual Assistant & Web Designer',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upam - WordPress Virtual Assistant & Web Designer",
    description:
      "WordPress VA and B2B Lead Generation specialist with 8+ years experience.",
    creator: "@upam1721",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

/**
 * Blocking script that reads the theme cookie BEFORE first paint.
 * This prevents the flash-of-wrong-theme on page reload/initial load.
 * It runs before React hydration, so the DOM classes are correct from the start.
 */
const themeScript = `
(function(){
  try {
    var c = document.cookie.split('; ');
    var theme = 'dark';
    for (var i = 0; i < c.length; i++) {
      var p = c[i].split('=');
      if (p[0] === 'upam_theme' && p.length > 1) {
        theme = decodeURIComponent(p[1]);
        break;
      }
    }
    var r = document.documentElement;
    if (theme === 'light') {
      r.classList.remove('dark');
      r.classList.add('light');
    } else {
      r.classList.add('dark');
      r.classList.remove('light');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <JsonLdSchema />
        <Preloader />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
