"use client"

import React, { useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  once?: boolean
  animation?: "fadeIn" | "slideUp" | "slideIn" | "scale" | "staggered"
}

export function AnimatedSection({
  children,
  className = "",
  delay = 0,
  once = true,
  animation = "fadeIn",
}: AnimatedSectionProps) {
  const controls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useIntersectionObserver({
    elementRef: ref,
    threshold: 0.2,
    rootMargin: "-50px 0px",
    freezeOnceVisible: once,
  })

  const variants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.6, delay } },
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
    },
    slideIn: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay } },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay } },
    },
    staggered: {
      hidden: { opacity: 0, y: 20 },
      visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.1 + delay,
          duration: 0.6,
        },
      }),
    },
  }

  // Trigger animation when in view
  React.useEffect(() => {
    if (isInView) {
      controls.start("visible")
    } else if (!once) {
      controls.start("hidden")
    }
  }, [isInView, controls, once])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants[animation]}
      custom={1}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggeredChildren({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.1,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
  once?: boolean
}) {
  const controls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useIntersectionObserver({
    elementRef: ref,
    threshold: 0.1,
    freezeOnceVisible: once,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible")
    } else if (!once) {
      controls.start("hidden")
    }
  }, [isInView, controls, once])

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={containerVariants} className={className}>
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
