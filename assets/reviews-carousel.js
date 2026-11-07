(() => {
  const viewport = document.querySelector('.reviews-viewport');
  if (!viewport) return;
  const section = viewport.closest('section');
  const track = viewport.querySelector('.google-reviews-grid');
  const group = track.querySelector('.reviews-slide-group');
  const play = section.querySelector('.reviews-play');
  const previous = section.querySelector('.reviews-prev');
  const next = section.querySelector('.reviews-next');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const copy = group.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.setAttribute('inert', '');
  copy.classList.add('reviews-copy');
  track.appendChild(copy);
  let paused = false;
  let hovered = false;
  let touched = false;
  let focused = false;
  let visible = false;
  let frame = 0;
  let lastTime = 0;
  let position = 0;
  let resumeTimer;
  let loopWidth = group.getBoundingClientRect().width;
  const allowed = () => visible && !document.hidden && !paused && !hovered && !touched && !focused && !reducedMotion.matches;
  function syncButton() {
    play.textContent = paused ? 'Reproduzir' : 'Pausar';
    play.setAttribute('aria-pressed', String(paused));
    play.setAttribute('aria-label', paused ? 'Reproduzir carrossel automático' : 'Pausar carrossel automático');
    play.disabled = reducedMotion.matches;
    if (reducedMotion.matches) {
      play.textContent = 'Manual';
      play.setAttribute('aria-label', 'Animação desativada pela preferência de movimento reduzido');
    }
  }
  function tick(time) {
    frame = 0;
    if (!allowed()) return;
    if (lastTime) position += Math.min(time - lastTime, 50) * 0.026;
    lastTime = time;
    if (loopWidth > 0 && position >= loopWidth) position %= loopWidth;
    viewport.scrollLeft = position;
    frame = requestAnimationFrame(tick);
  }
  function reconcile() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    position = viewport.scrollLeft;
    if (allowed()) frame = requestAnimationFrame(tick);
  }
  function holdForReading() {
    touched = true;
    clearTimeout(resumeTimer);
    reconcile();
    resumeTimer = setTimeout(() => { touched = false; reconcile(); }, 6000);
  }
  play.addEventListener('click', () => { paused = !paused; syncButton(); reconcile(); });
  viewport.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { hovered = true; reconcile(); } });
  viewport.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch') { hovered = false; reconcile(); } });
  viewport.addEventListener('pointerdown', holdForReading, { passive: true });
  viewport.addEventListener('pointerup', holdForReading, { passive: true });
  viewport.addEventListener('pointercancel', holdForReading, { passive: true });
  viewport.addEventListener('wheel', holdForReading, { passive: true });
  viewport.addEventListener('keydown', holdForReading);
  viewport.addEventListener('focusin', () => { focused = true; reconcile(); });
  viewport.addEventListener('focusout', () => { focused = false; reconcile(); });
  function step(direction) {
    paused = true;
    syncButton();
    reconcile();
    const card = group.querySelector('.google-review-card');
    const distance = card.getBoundingClientRect().width + 16;
    let target = viewport.scrollLeft + direction * distance;
    if (reducedMotion.matches) {
      viewport.scrollTo({ left: Math.max(0, Math.min(target, viewport.scrollWidth - viewport.clientWidth)), behavior: 'instant' });
      return;
    }
    if (target < 0) { viewport.scrollLeft += loopWidth; target += loopWidth; }
    if (target >= loopWidth) { viewport.scrollLeft -= loopWidth; target -= loopWidth; }
    viewport.scrollTo({ left: Math.max(0, target), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  document.addEventListener('visibilitychange', reconcile);
  reducedMotion.addEventListener('change', () => { syncButton(); reconcile(); });
  new ResizeObserver(() => { loopWidth = group.getBoundingClientRect().width; reconcile(); }).observe(group);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; reconcile(); }, { threshold: 0.05 }).observe(viewport);
  syncButton();
})();
