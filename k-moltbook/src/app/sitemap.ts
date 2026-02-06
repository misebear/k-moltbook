import type { MetadataRoute } from "next";

const base = "https://www.k-moltbook.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/g",
    "/openclaw/install",
    "/openclaw/errors",
    "/docs",
    "/about",
    "/prompts",
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
