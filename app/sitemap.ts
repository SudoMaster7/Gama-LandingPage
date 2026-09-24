import type { MetadataRoute } from "next";
import { company, products } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = ["", "/produtos", "/sobre", "/orcamento", "/contato", "/privacidade"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...products.map((p) => ({
      url: `${base}/produtos/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
