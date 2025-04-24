"use client"

import { useState, useEffect, type RefObject } from "react"

interface UseIntersectionObserverProps {
  elementRef: RefObject<Element>
  threshold?: number
  rootMargin?: string
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver({
  elementRef,
  threshold = 0,
  rootMargin = "0px",
  freezeOnceVisible = false,
}: UseIntersectionObserverProps): boolean {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false)

  useEffect(() => {
    const element = elementRef?.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting

        // Update state only if:
        // - Element is intersecting OR
        // - Element is not intersecting AND we don't want to freeze once visible
        if (isElementIntersecting || (!isElementIntersecting && !freezeOnceVisible)) {
          setIsIntersecting(isElementIntersecting)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, threshold, rootMargin, freezeOnceVisible])

  return isIntersecting
}
