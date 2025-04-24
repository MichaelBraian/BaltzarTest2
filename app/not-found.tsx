import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-6xl font-bold text-orange-500">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-white">Page Not Found</h2>
      <p className="mt-4 text-gray-400 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
      <Link href="/" className="mt-8">
        <Button className="bg-orange-500 hover:bg-orange-600">Return to Home</Button>
      </Link>
    </div>
  )
}
