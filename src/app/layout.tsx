import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
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
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Upam - WordPress Virtual Assistant & Web Designer",
    description:
      "WordPress VA and B2B Lead Generation specialist with 8+ years experience. Professional WordPress site management, theme customization, and virtual assistant services.",
    siteName: "Upam Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Upam - WordPress Virtual Assistant & Web Designer",
    description:
      "WordPress VA and B2B Lead Generation specialist with 8+ years experience.",
    creator: "@upam1721",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
