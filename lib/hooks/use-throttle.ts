"use client"

import { useCallback, useRef } from "react"

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const lastCall = useRef<number>(0)

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall.current >= delay) {
        lastCall.current = now
        callback(...args)
      }
    },
    [callback, delay],
  )
}
