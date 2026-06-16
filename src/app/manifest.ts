import type { MetadataRoute } from "next";

const SITE_URL = "https://upam1721.com";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Upam - WordPress Virtual Assistant & Web Designer",
    short_name: "Upam",
    description:
      "WordPress Virtual Assistant & B2B Lead Generation specialist with 8+ years experience.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1628",
    theme_color: "#06b6d4",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["portfolio", "business", "freelance"],
  };
}
