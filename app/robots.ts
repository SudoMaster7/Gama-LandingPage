import type { MetadataRoute } from "next";
import { company } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  const base = company.siteUrl.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/interno", "/api/", "/orcamento/enviado"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
