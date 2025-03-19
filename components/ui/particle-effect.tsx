"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
  life: number
  maxLife: number
}

interface ParticleEffectProps {
  count?: number
  colors?: string[]
  speed?: number
  size?: number
  lifetime?: number
  className?: string
}

export function ParticleEffect({
  count = 50,
  colors = ["#9333ea", "#6366f1", "#ec4899", "#8b5cf6"],
  speed = 1,
  size = 3,
  lifetime = 100,
  className = "",
}: ParticleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return

      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, () => createParticle(canvas))

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.speedX * speed
        particle.y += particle.speedY * speed

        // Update particle life
        particle.life--

        // Calculate opacity based on life
        particle.opacity = particle.life / particle.maxLife

        // Draw particle
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Reset particle if it's dead or out of bounds
        if (
          particle.life <= 0 ||
          particle.x < 0 ||
          particle.x > canvas.width ||
          particle.y < 0 ||
          particle.y > canvas.height
        ) {
          particlesRef.current[index] = createParticle(canvas)
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [count, colors, speed, size, lifetime])

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * size + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      life: Math.random() * lifetime + 50,
      maxLife: Math.random() * lifetime + 50,
    }
  }

  return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none ${className}`} />
}
