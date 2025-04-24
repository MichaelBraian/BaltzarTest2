"use client"

import { useState, useEffect, useRef } from "react"
import { useInView } from "framer-motion"

interface CounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  title: string
  description?: string
}

export function AnimatedCounter({ end, duration = 2, suffix = "", prefix = "", title, description }: CounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const startAnimation = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / (duration * 1000)

      if (progress < 1) {
        const currentCount = Math.floor(end * progress)
        setCount(currentCount)
        animationFrame = requestAnimationFrame(startAnimation)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(startAnimation)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, isInView])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-orange-500 mb-2">
        {prefix}
        {count}
        {suffix}
      </div>
      <h3 className="text-xl font-medium text-white mb-1">{title}</h3>
      {description && <p className="text-gray-400">{description}</p>}
    </div>
  )
}
