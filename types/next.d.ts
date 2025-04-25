// Extend Next.js types
import { ReactNode } from 'react'

declare module 'next' {
  export interface PageProps {
    params: {
      locale: string
    }
    searchParams?: { [key: string]: string | string[] | undefined }
  }
} 