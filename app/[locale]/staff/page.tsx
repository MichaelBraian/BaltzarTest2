import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Staff | Baltzar Tandvård",
  description: "Meet our team of dental professionals at Baltzar Tandvård",
}

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function StaffPage({ params }: Props) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  
  // Redirect to the home page since staff content is now integrated there
  return redirect(`/${locale}`)
}
