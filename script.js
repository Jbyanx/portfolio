/**
 * Jabes Borré — Portafolio
 * Reveals al scroll · modal de video · typewriter · rastro de cursor
 */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia('(pointer: fine)').matches;

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initEmail();
  initScrollReveal();
  initVideoModal();
  initTypewriter();
  if (!REDUCED_MOTION && FINE_POINTER) initCursorTrail();
});

/* 0. Email ensamblado en runtime (no queda en el HTML para los bots de spam) */
function initEmail() {
  const btn = document.getElementById('email-btn');
  if (!btn) return;
  const user = 'jabesbyanc';
  const domain = 'gmail.com';
  const addr = user + '@' + domain;
  btn.setAttribute('href', 'mailto:' + addr);
  const text = document.getElementById('email-text');
  if (text) text.textContent = addr;
}

/* 1. Reveal al entrar en viewport (stagger definido en CSS) */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* 2. Modal de video para las demos */
function initVideoModal() {
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('demo-video');
  const source = video ? video.querySelector('source') : null;
  if (!modal || !video || !source) return;

  const titleEl = document.getElementById('modal-title');
  const descEl  = document.getElementById('modal-desc');
  const closeBtn = modal.querySelector('.modal-close');
  const backdrop = modal.querySelector('.modal-backdrop');

  function open(src, title, desc) {
    source.src = src;
    if (titleEl) titleEl.textContent = title || 'Demo';
    if (descEl) descEl.textContent = desc || '';
    video.load();
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    video.play().catch(() => {}); // autoplay puede bloquearse; el usuario le da play
  }
  function close() {
    modal.classList.remove('active');
    video.pause();
    video.currentTime = 0;
    source.src = '';
    video.load();
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('.btn-demo').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      open(btn.dataset.video, btn.dataset.title, btn.dataset.desc);
    });
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) close();
  });
}

/* 3. Typewriter honesto en el subtítulo */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const words = [
    'Desarrollador Backend Java',
    'APIs REST con Spring Boot',
    'Java 21 · Spring Boot 3'
  ];

  // Con motion reducido: texto fijo, sin animación.
  if (REDUCED_MOTION) { target.textContent = words[0]; return; }

  let w = 0, c = 0, deleting = false;
  (function type() {
    const word = words[w];
    target.textContent = deleting ? word.substring(0, c - 1) : word.substring(0, c + 1);
    c += deleting ? -1 : 1;

    let speed = deleting ? 34 : 68;
    if (!deleting && c === word.length) { speed = 2000; deleting = true; }
    else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; speed = 450; }
    setTimeout(type, speed);
  })();
}

/* 4. Rastro de cursor (verde pino, sutil, throttled) */
function initCursorTrail() {
  let last = 0;
  const throttle = 55;
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - last < throttle) return;
    last = now;

    const p = document.createElement('span');
    p.className = 'matrix-particle';
    p.textContent = Math.random() > 0.5 ? '1' : '0';
    p.style.left = e.pageX + 'px';
    p.style.top = (e.pageY - 10) + 'px';
    p.style.fontSize = (Math.floor(Math.random() * 5) + 11) + 'px';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  });
}