import type { MetadataRoute } from "next"
import { i18n } from "@/lib/i18n-config"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://baltzartandvard.se"

  // Create entries for each locale
  const routes = i18n.locales.flatMap((locale) => {
    return [
      {
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/${locale}/services`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${locale}/technology`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${locale}/staff`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/${locale}/contact`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.6,
      },
    ]
  })

  return routes
}
