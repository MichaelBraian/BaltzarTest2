import { redirect } from "next/navigation"

export default function StaffPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = params.locale
  // Redirect to the home page since staff content is now integrated there
  return redirect(`/${locale}`)
}
