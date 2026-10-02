import { qs } from "../lib/dom.js";

const PARTICLE = "201, 162, 39";
const LINE = "201, 162, 39";
const GLOW = "240, 200, 80";
const FADE = "7, 8, 15";

export function setupAmbientBackground({ reducedMotion }) {
  const canvas = qs("#ambientLiquidCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const mobileLike = coarse || window.matchMedia("(max-width: 620px)").matches;
  const particleCount = mobileLike ? 60 : 110;
  const waveCount = mobileLike ? 8 : 10;
  const splashesEnabled = mobileLike && !reducedMotion;
  let width = 0;
  let height = 0;
  let frame = 0;
  let rafId = 0;
  let particles = [];
  let splashes = [];
  let scrollEnergy = 0;
  let lastScrollY = window.scrollY;
  let lastPointerSplash = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.1,
      r: 0.45 + Math.random() * 1.25,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function addSplash(x, y, strength = 1) {
    if (!splashesEnabled) return;
    splashes.push({
      x,
      y,
      radius: 10 + Math.random() * 14,
      maxRadius: 74 + Math.random() * 58 * strength,
      life: 1,
      strength,
      wobble: Math.random() * Math.PI * 2
    });
    if (splashes.length > 16) splashes.splice(0, splashes.length - 16);
  }

  function onScroll() {
    const current = window.scrollY;
    const delta = Math.abs(current - lastScrollY);
    lastScrollY = current;
    scrollEnergy = Math.min(1, scrollEnergy + delta / 520);
    if (delta > 18 && frame % 3 === 0) {
      addSplash(width * (0.24 + Math.random() * 0.52), height * (0.24 + Math.random() * 0.52), 0.55);
    }
  }

  function drawWaves() {
    ctx.save();
    ctx.globalAlpha = mobileLike ? 0.16 : 0.1;
    ctx.strokeStyle = `rgba(${LINE}, 1)`;
    ctx.lineWidth = mobileLike ? 0.62 : 0.5;
    for (let i = 0; i < waveCount; i++) {
      const yBase = (height / waveCount) * i + Math.sin(frame * 0.004 + i) * (mobileLike ? 22 : 16);
      ctx.beginPath();
      for (let x = -48; x <= width + 48; x += 24) {
        const y = yBase
          + Math.sin(x * 0.0065 + frame * 0.007 + i * 1.7) * (mobileLike ? 10 : 7)
          + Math.cos(x * 0.012 + frame * 0.004 + i) * (mobileLike ? 4.5 : 3);
        if (x === -48) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawParticles() {
    const alpha = mobileLike ? 0.24 : 0.16;
    particles.forEach((particle, index) => {
      particle.phase += 0.0075;
      particle.x += particle.vx + Math.cos(particle.phase) * 0.018;
      particle.y += particle.vy + Math.sin(particle.phase) * 0.014;

      if (particle.x < -12) particle.x = width + 12;
      if (particle.x > width + 12) particle.x = -12;
      if (particle.y < -12) particle.y = height + 12;
      if (particle.y > height + 12) particle.y = -12;

      const pulse = 0.58 + Math.sin(particle.phase + frame * 0.01) * 0.24;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${PARTICLE}, ${alpha})`;
      ctx.fill();

      if (!coarse && index % 4 === 0) {
        const next = particles[(index + 11) % particles.length];
        const distance = Math.hypot(next.x - particle.x, next.y - particle.y);
        if (distance < 132) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(${LINE}, ${(1 - distance / 132) * 0.045})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    });
  }

  function drawScrollGlow() {
    scrollEnergy *= 0.92;
    if (scrollEnergy <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = scrollEnergy * 0.16;
    ctx.strokeStyle = `rgba(${GLOW}, 1)`;
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 3; i++) {
      const y = height * (0.2 + i * 0.28) + Math.sin(frame * 0.018 + i) * 24;
      ctx.beginPath();
      for (let x = -40; x <= width + 40; x += 26) {
        const wave = Math.sin(x * 0.018 + frame * 0.018 + i) * 11;
        if (x === -40) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSplashes() {
    for (const splash of splashes) {
      splash.life -= 0.018;
      splash.radius += (splash.maxRadius - splash.radius) * 0.035;
      splash.x += Math.cos(frame * 0.025 + splash.wobble) * 0.22;
      splash.y += Math.sin(frame * 0.022 + splash.wobble) * 0.18;

      const alpha = Math.max(0, splash.life);
      const gradient = ctx.createRadialGradient(splash.x, splash.y, 0, splash.x, splash.y, splash.radius);
      gradient.addColorStop(0, `rgba(${GLOW}, ${alpha * 0.18 * splash.strength})`);
      gradient.addColorStop(0.45, `rgba(${LINE}, ${alpha * 0.11 * splash.strength})`);
      gradient.addColorStop(1, `rgba(${LINE}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(splash.x, splash.y, splash.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(splash.x, splash.y, splash.radius * 0.58, splash.wobble, splash.wobble + Math.PI * 1.25);
      ctx.strokeStyle = `rgba(${LINE}, ${alpha * 0.2})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
    splashes = splashes.filter(splash => splash.life > 0);
  }

  function draw() {
    frame += 1;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `rgba(${FADE}, 0.05)`;
    ctx.fillRect(0, 0, width, height);
    drawWaves();
    drawParticles();
    if (mobileLike) {
      drawScrollGlow();
      drawSplashes();
    }
  }

  const loop = () => {
    draw();
    rafId = requestAnimationFrame(loop);
  };

  const start = () => {
    if (!rafId) rafId = requestAnimationFrame(loop);
  };

  const stop = () => {
    cancelAnimationFrame(rafId);
    rafId = 0;
  };

  resize();

  if (reducedMotion) {
    draw();
    return;
  }

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  if (splashesEnabled) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", event => {
      if (frame - lastPointerSplash < 5) return;
      lastPointerSplash = frame;
      addSplash(event.clientX, event.clientY, 0.74);
    }, { passive: true });
    window.addEventListener("pointerdown", event => addSplash(event.clientX, event.clientY, 0.9), { passive: true });
  }

  start();
}
