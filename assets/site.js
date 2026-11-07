(() => {
  const campaignKeys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src','sck'];
  try {
    const incoming = new URLSearchParams(location.search);
    campaignKeys.forEach(key => { if (incoming.get(key)) sessionStorage.setItem(key, incoming.get(key)); });
    document.querySelectorAll('a[href="/registro/"]').forEach(link => {
      const target = new URL(link.href);
      campaignKeys.forEach(key => { const value = sessionStorage.getItem(key); if (value) target.searchParams.set(key,value); });
      link.href = target.pathname + target.search;
    });
  } catch {}
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.mobile-nav');
  toggle.addEventListener('click', () => { const expanded = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(expanded)); nav.classList.toggle('open', expanded); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
  const modal = document.getElementById('reviewModal');
  const image = document.getElementById('reviewModalImg');
  const close = document.querySelector('.review-modal-close');
  let previousFocus;
  function dismiss() { modal.classList.remove('active'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; if (previousFocus) previousFocus.focus(); }
  window.openReviewModal = src => { previousFocus = document.activeElement; image.src = src; modal.classList.add('active'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; close.focus(); };
  document.querySelectorAll('.heroReviews__thumb').forEach((thumb, index) => { thumb.setAttribute('role','button'); thumb.setAttribute('tabindex','0'); thumb.setAttribute('aria-label','Ampliar depoimento '+(index+1)); thumb.addEventListener('keydown',e=> {if(e.key==='Enter'||e.key===' '){e.preventDefault(); window.openReviewModal(thumb.querySelector('img').src);}}); });
  close.addEventListener('click',dismiss);
  modal.addEventListener('click',event=> { if(event.target===modal) dismiss(); });
  document.addEventListener('keydown',event=> { if(!modal.classList.contains('active')) return; if(event.key==='Escape') dismiss(); if(event.key==='Tab'){event.preventDefault();close.focus();} });
})();
