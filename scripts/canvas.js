export function initCanvas() {
  const canvas = document.getElementById('ambient-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const isMobile = window.innerWidth < 768
  const COUNT    = isMobile ? 45 : 80
  const DIST     = 110
  const MDIST    = 160
  const mouse    = { x: -999, y: -999 }
  let raf

  const resize = () => {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY })

  /* Ambient gradient blobs */
  const blobs = [
    { x: 0.2, y: 0.2, r: 380, color: 'rgba(0,255,136,', vx: 0.12, vy: 0.08 },
    { x: 0.8, y: 0.4, r: 300, color: 'rgba(40,100,255,', vx: -0.1, vy: 0.12 },
    { x: 0.5, y: 0.8, r: 260, color: 'rgba(0,255,136,', vx: 0.08, vy: -0.1 },
  ]

  class Particle {
    constructor() { this.reset() }
    reset() {
      this.x  = Math.random() * canvas.width
      this.y  = Math.random() * canvas.height
      this.vx = (Math.random() - 0.5) * 0.3
      this.vy = (Math.random() - 0.5) * 0.3
      this.r  = Math.random() * 1.2 + 0.4
      this.a  = Math.random() * 0.35 + 0.1
    }
    update() {
      const dx = mouse.x - this.x
      const dy = mouse.y - this.y
      const d  = Math.hypot(dx, dy)
      if (d < MDIST && d > 1) {
        const f = (MDIST - d) / MDIST * 0.01
        this.vx += dx / d * f
        this.vy += dy / d * f
      }
      this.vx *= 0.996
      this.vy *= 0.996
      this.x += this.vx
      this.y += this.vy
      if (this.x < 0) this.x = canvas.width
      if (this.x > canvas.width) this.x = 0
      if (this.y < 0) this.y = canvas.height
      if (this.y > canvas.height) this.y = 0
    }
    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0,255,136,${this.a})`
      ctx.fill()
    }
  }

  const particles = Array.from({ length: COUNT }, () => new Particle())

  const drawBlobs = () => {
    blobs.forEach(b => {
      b.x += b.vx * 0.001
      b.y += b.vy * 0.001
      if (b.x < 0.1 || b.x > 0.9) b.vx *= -1
      if (b.y < 0.1 || b.y > 0.9) b.vy *= -1
      const gx = b.x * canvas.width
      const gy = b.y * canvas.height
      const g  = ctx.createRadialGradient(gx, gy, 0, gx, gy, b.r)
      g.addColorStop(0, b.color + '0.08)')
      g.addColorStop(1, b.color + '0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(gx, gy, b.r, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawBlobs()

    for (let i = 0; i < particles.length; i++) {
      particles[i].update()
      particles[i].draw()
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const d  = Math.hypot(dx, dy)
        if (d < DIST) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(0,255,136,${(1 - d / DIST) * 0.15})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    raf = requestAnimationFrame(loop)
  }

  loop()
  return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
}
