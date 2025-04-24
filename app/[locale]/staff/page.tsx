import { redirect } from "next/navigation"

export default function StaffPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  // Redirect to the home page since staff content is now integrated there
  return redirect(`/${locale}`)
}
