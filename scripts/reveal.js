export function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'))
    return
  }
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('.reveal').forEach(el => io.observe(el))
}

export function initScrollProgress() {
  const bar = document.getElementById('scroll-bar')
  if (!bar) return
  const update = () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100
    bar.style.width = `${Math.min(pct, 100)}%`
  }
  window.addEventListener('scroll', update, { passive: true })
}
