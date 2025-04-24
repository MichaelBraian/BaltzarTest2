import { ImageResponse } from "next/og"
import { i18n } from "@/lib/i18n-config"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image({ params }: { params: { locale: string } }) {
  const locale = params?.locale || i18n.defaultLocale

  // Title based on locale
  const title =
    locale === "sv"
      ? "Baltzar Tandvård - Digital Precision, Personlig Omsorg"
      : "Baltzar Tandvård - Digital Precision, Personal Care"

  return new ImageResponse(
    <div
      style={{
        fontSize: 48,
        background: "black",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        padding: 32,
      }}
    >
      <div style={{ fontSize: 64, fontWeight: "bold", marginBottom: 24, color: "#f97316" }}>Baltzar Tandvård</div>
      <div style={{ textAlign: "center", maxWidth: "80%" }}>{title}</div>
    </div>,
    size,
  )
}

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}
