import type { MetadataRoute } from "next"

// Add this line to make the robots.txt compatible with static exports
export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/admin/"],
    },
    sitemap: "https://baltzartandvard.se/sitemap.xml",
  }
}
