 /* ── LOADER ── */
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hidden'), 2000);
  });

  /* ── MOBILE MENU ── */
  function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
  }

  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => observer.observe(r));

  /* ── MENU FILTER ── */
  function filterMenu(cat, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.menu-card').forEach(card => {
      if (cat === 'todos' || card.dataset.cat === cat) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  /* ── LIGHTBOX ── */
  /*function openLightbox(imagen, name) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightbox-content').innerHTML =
      `<div style="font-size:8rem;">${imagen}</div><p style="font-family:'Bebas Neue',sans-serif;font-size:2rem;letter-spacing:2px;color:#F5C518;margin-top:1rem;">${name}</p>`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  } */
 function openLightbox(urlImagem, name) {
  const lb = document.getElementById('lightbox');
  
  // Aqui trocamos a div de texto por uma tag <img> real
  document.getElementById('lightbox-content').innerHTML = `
    <img src="${urlImagem}" alt="${name}" class="lightbox-img">
    <p style="font-family:'Bebas Neue',sans-serif;font-size:2rem;letter-spacing:2px;color:#F5C518;margin-top:1rem; text-align: center;">${name}</p>
  `;
  
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
  });

  /* ── CLOSE NAV ON LINK CLICK (mobile) ── */
  document.querySelectorAll('#navLinks a').forEach(a => a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  }));

  /* ── NAV SCROLL STYLE ── */
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (window.scrollY > 50) nav.style.background = 'rgba(13,13,13,.97)';
    else nav.style.background = 'rgba(13,13,13,.85)';
  });

  /* ── REDUCED MOTION ── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[style*="animation"]').forEach(el => {
      el.style.animation = 'none';
    });
  }