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
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
    categories: ["portfolio", "business", "freelance"],
  };
}
