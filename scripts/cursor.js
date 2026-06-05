export function initCursor() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return

  const cursor = document.getElementById('cursor')
  if (!cursor) return

  let x = 0, y = 0, cx = 0, cy = 0
  let raf

  const move = e => { x = e.clientX; y = e.clientY }
  window.addEventListener('mousemove', move)

  const loop = () => {
    cx += (x - cx) * 0.18
    cy += (y - cy) * 0.18
    cursor.style.left = `${cx}px`
    cursor.style.top  = `${cy}px`
    raf = requestAnimationFrame(loop)
  }
  loop()

  /* Glass card cursor light tracking */
  document.addEventListener('mousemove', e => {
    const card = e.target.closest('.glass-card')
    if (card) {
      const r    = card.getBoundingClientRect()
      const px   = ((e.clientX - r.left) / r.width)  * 100
      const py   = ((e.clientY - r.top)  / r.height) * 100
      card.style.setProperty('--cx', `${px}%`)
      card.style.setProperty('--cy', `${py}%`)
    }
  })

  /* Hover state */
  document.addEventListener('mouseover', e => {
    const el = e.target
    const isInteractive = el.tagName === 'A' || el.tagName === 'BUTTON' ||
      el.closest('a') || el.closest('button') || el.closest('.project-card')
    cursor?.classList.toggle('is-hover', !!isInteractive)
  })
}
