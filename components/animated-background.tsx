"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Particle[] = []
    const particleCount = 60 // Increased from 50

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      baseSize: number
      speedX: number
      speedY: number
      color: string
      pulseDirection: boolean
      pulseSpeed: number
      opacity: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.baseSize = Math.random() * 5 + 2 // Increased base size
        this.size = this.baseSize
        this.speedX = (Math.random() - 0.5) * 0.175 // Slowed down by factor of 4
        this.speedY = (Math.random() - 0.5) * 0.175 // Slowed down by factor of 4
        // More orange-tinted colors with higher opacity
        const hue = 30 + Math.random() * 20 // Orange hue range
        const saturation = 80 + Math.random() * 20 // High saturation
        const lightness = 60 + Math.random() * 20 // Medium-high lightness
        this.opacity = 0.3 + Math.random() * 0.4 // Higher opacity (was 0.2 max)
        this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${this.opacity})`
        this.pulseDirection = Math.random() > 0.5
        this.pulseSpeed = 0.03 + Math.random() * 0.05
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Pulse size effect with smaller range (35-55% of base size)
        if (this.pulseDirection) {
          this.size += this.pulseSpeed
          if (this.size > this.baseSize * 0.55) this.pulseDirection = false
        } else {
          this.size -= this.pulseSpeed
          if (this.size < this.baseSize * 0.35) this.pulseDirection = true
        }

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      // Connect particles with lines if they're close enough
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            // Increased connection distance (was 100)
            ctx.beginPath()
            // More visible connections with orange tint
            const opacity = 0.2 * (1 - distance / 150) // Higher base opacity (was 0.1)
            ctx.strokeStyle = `rgba(255, 165, 0, ${opacity})`
            ctx.lineWidth = 0.8 // Slightly thicker lines (was 0.5)
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-70" /> // Increased opacity from 50 to 70
}
