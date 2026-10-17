/* ==========================================================
   LOLITA KIDS — interacciones
   Huellas que crecen en la portada, medidor de pie (arrastra el
   tope y te dice la talla europea con margen para crecer), cinta
   de etapas, juego de parejas de zapatos y horario en directo.
   ========================================================== */
(() => {
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const STATIC = /[?&]static\b/.test(location.search);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || STATIC;
const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const motion = hasGSAP && !reduced;
if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const play = (v) => { if (!v) return; if (v.preload === 'none') v.preload = 'auto'; const p = v.play(); if (p) p.catch(() => {}); };
const fmt = (n) => n.toFixed(1).replace('.', ',');

/* ----------------------------------------------------------
   ZAPATOS DIBUJADOS (SVG) — para la cinta y el juego
   ---------------------------------------------------------- */
const SHOE = {
  sneaker: (c, a) => `<path d="M8 70Q8 80 18 80H104Q114 80 114 70Z" fill="#fff" stroke="#D5DCE6" stroke-width="2"/><rect x="11" y="73" width="100" height="3" rx="1.5" fill="${a}"/><path d="M10 70C10 52 18 40 34 38L58 36C64 36 68 40 72 46L100 56C110 59 114 64 114 70Z" fill="${c}"/><path d="M86 52L100 56C110 59 114 64 114 70H88Z" fill="#fff" opacity=".9"/><rect x="42" y="39" width="28" height="7" rx="3.5" fill="#fff" transform="rotate(18 56 42)"/><rect x="50" y="49" width="28" height="7" rx="3.5" fill="#fff" transform="rotate(18 64 52)"/><path d="M10 48L19 40L23 54Z" fill="${a}"/><circle cx="30" cy="58" r="5" fill="${a}"/>`,
  sandal: (c, a) => `<path d="M6 72Q6 80 16 80H106Q116 80 116 72V69H6Z" fill="#C89B62"/><rect x="8" y="64" width="106" height="7" rx="3.5" fill="#EBCB92"/><path d="M18 66C20 46 40 42 44 66" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M52 66C58 44 80 44 86 66" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M90 66C96 52 106 54 110 66" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="40" cy="52" r="4.5" fill="${a}"/><path d="M60 50l4-6 4 6-4 4z" fill="${a}"/>`,
  welly: (c, a) => `<path d="M22 8H58L60 50L96 54C108 56 114 64 114 72V76H20Z" fill="${c}"/><rect x="18" y="74" width="98" height="7" rx="3" fill="#2A3442"/><rect x="20" y="6" width="40" height="8" rx="4" fill="${a}"/><circle cx="34" cy="28" r="4" fill="#fff" opacity=".7"/><circle cx="46" cy="40" r="3" fill="#fff" opacity=".7"/><circle cx="32" cy="50" r="3.5" fill="#fff" opacity=".7"/><circle cx="76" cy="64" r="3.5" fill="#fff" opacity=".7"/><path d="M58 18c10 0 10 14 0 14" stroke="${a}" stroke-width="4" fill="none"/>`,
  maryjane: (c, a) => `<rect x="10" y="72" width="104" height="6" rx="3" fill="#2A3442"/><path d="M12 72C12 58 22 50 36 50L60 52C70 53 76 56 84 58L104 62C112 64 114 68 114 72Z" fill="${c}"/><path d="M42 52C48 40 62 38 66 54" stroke="${a}" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="64" cy="52" r="4" fill="#fff"/><path d="M92 58c4-6 12-6 12 2" fill="${a}"/><path d="M14 66C30 62 40 62 54 64" stroke="#fff" stroke-width="2" opacity=".5" fill="none"/>`,
  boot: (c, a) => `<path d="M18 18H54L58 50L96 56C108 58 114 64 114 72V74H16Z" fill="${c}"/><path d="M14 74H116V80Q116 84 112 84H18Q14 84 14 80Z" fill="#3B2A1E"/><path d="M22 84v-4M34 84v-4M46 84v-4M58 84v-4M70 84v-4M82 84v-4M94 84v-4M106 84v-4" stroke="#6B4A33" stroke-width="3"/><rect x="16" y="14" width="40" height="9" rx="4.5" fill="${a}"/><path d="M40 28l12 6M40 36l12 6M42 44l12 6M40 34l12-6M40 42l12-6M42 50l12-6" stroke="${a}" stroke-width="2.5" stroke-linecap="round"/><path d="M86 56C98 58 108 62 112 70" stroke="#fff" stroke-width="3" opacity=".35" fill="none"/>`,
  slipper: (c, a) => `<path d="M8 72Q8 80 18 80H104Q114 80 114 72Z" fill="#fff" stroke="#E4DDEB" stroke-width="2"/><path d="M10 72C10 52 24 44 44 46L80 50C100 52 114 60 114 72Z" fill="${c}"/><path d="M14 56c4-4 8-4 12 0s8 4 12 0 8-4 12 0" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/><circle cx="72" cy="46" r="11" fill="${a}"/><circle cx="68" cy="42" r="3" fill="#fff" opacity=".6"/>`,
  first: (c, a) => `<rect x="14" y="72" width="94" height="7" rx="3.5" fill="#F2E6CF"/><path d="M16 72C16 54 24 42 40 40L52 40C58 40 60 46 66 50L92 56C104 58 108 64 108 72Z" fill="${c}"/><path d="M14 44C24 38 40 36 52 40" stroke="${a}" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="50" y="44" width="30" height="9" rx="4.5" fill="${a}" transform="rotate(14 65 48)"/><circle cx="96" cy="64" r="4" fill="#fff" opacity=".7"/><circle cx="30" cy="58" r="3" fill="#fff" opacity=".7"/>`
};
const shoe = (t, c, a) => `<svg viewBox="0 0 122 90" aria-hidden="true">${SHOE[t](c, a)}</svg>`;

const STAGES = [
  { pic: 'd-coche.jpg', tag: 'En la tienda', h: 'El coche de los zapatos', p: 'Cargado de novedades, aparcado en medio de la tienda.', c: '#FFE08A' },
  { svg: ['first', '#FF9EBB', '#FFC928'], bg: '#FFF3C4', h: 'Primeros pasos', p: 'Suela flexible, puntera amplia y un cierre que sujete bien el tobillo.', c: '#FFE08A' },
  { svg: ['sandal', '#2F8FE0', '#FFC928'], bg: '#E0F1FF', h: 'Sandalias', p: 'Para el verano de Lloret: mejor cerradas atrás, para que el pie no baile.', c: '#CFE4F7' },
  { pic: 'd-pared.jpg', tag: 'En la tienda', h: 'La pared de deportivas', p: 'De velcro para quien aún no se ata los cordones, de cordones para los mayores.', c: '#D9F0B8' },
  { svg: ['sneaker', '#8CC63F', '#2F8FE0'], bg: '#ECF7DE', h: 'Deportivas', p: 'Para el cole, el parque y el patio.', c: '#D9F0B8' },
  { svg: ['welly', '#FFC928', '#2F8FE0'], bg: '#FFF7DA', h: 'Botas de agua', p: 'Para saltar en los charcos sin mojarse los calcetines.', c: '#FFE08A' },
  { pic: 'd-escaparate.jpg', tag: 'Escaparate', h: 'El escaparate', p: 'Sandalias y novedades de temporada, a pie de calle.', c: '#CFE4F7' },
  { svg: ['maryjane', '#E84B6A', '#FFC928'], bg: '#FFE6EC', h: 'Fiesta y ceremonia', p: 'Merceditas y zapatos para bodas, bautizos y comuniones.', c: '#FFD0DC' },
  { svg: ['boot', '#B07A4E', '#FFC928'], bg: '#F6EADF', h: 'Botas', p: 'Para el otoño y los días de frío.', c: '#EAD8C6' },
  { svg: ['slipper', '#A58BD4', '#FF9EBB'], bg: '#F1EBFA', h: 'Zapatillas de casa', p: 'Para correr por el pasillo sin hacer ruido.', c: '#E0D5F2' },
  { pic: 'd-banco.jpg', tag: 'En la tienda', h: 'El banco de probarse', p: 'Con escalones, a la medida de los peques.', c: '#CFE4F7' }
];
const MEMO = [['sneaker', '#2F8FE0', '#FFC928'], ['sandal', '#FF8FB1', '#8CC63F'], ['welly', '#FFC928', '#E84B6A'], ['maryjane', '#E84B6A', '#2F8FE0'], ['boot', '#B07A4E', '#8CC63F'], ['slipper', '#A58BD4', '#FFC928']];

/* ----------------------------------------------------------
   HORARIO · L–S 9:30–13:30 y 16:30–20:30 · D cerrado
   ---------------------------------------------------------- */
const madrid = () => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { d: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), m: +p.hour * 60 + +p.minute };
};
const paintLive = () => {
  const { d, m } = madrid();
  const open = d !== 0 && ((m >= 570 && m < 810) || (m >= 990 && m < 1230));
  let txt;
  if (open) txt = m < 810 ? '¡Abierto! Hasta las 13:30' : '¡Abierto! Hasta las 20:30';
  else if (d !== 0 && m < 570) txt = 'Cerrado · abrimos a las 9:30';
  else if (d !== 0 && m >= 810 && m < 990) txt = 'Cerrado · volvemos a las 16:30';
  else txt = d === 6 || d === 0 ? 'Cerrado · el lunes a las 9:30' : 'Cerrado · mañana a las 9:30';
  $$('[data-live]').forEach((el) => { el.classList.toggle('is-open', open); el.classList.toggle('is-closed', !open); $('[data-live-text]', el).textContent = txt; });
  $$('#hours tr').forEach((tr) => tr.classList.toggle('is-today', +tr.dataset.d === d));
};
paintLive(); setInterval(paintLive, 30000);

/* ----------------------------------------------------------
   SCROLL · NAV · MENÚ
   ---------------------------------------------------------- */
let lenis = null;
if (motion && typeof window.Lenis !== 'undefined') {
  lenis = new Lenis({ duration: 1.05, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const nav = $('#nav'), burger = $('#burger'), drawer = $('#drawer');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('is-scrolled', y > 30);
  nav.classList.toggle('is-hidden', y > 600 && y > lastY && !drawer.classList.contains('is-open'));
  lastY = y;
}, { passive: true });
const setDrawer = (open) => { burger.setAttribute('aria-expanded', open); drawer.classList.toggle('is-open', open); document.body.style.overflow = open ? 'hidden' : ''; if (lenis) open ? lenis.stop() : lenis.start(); };
burger.addEventListener('click', () => setDrawer(burger.getAttribute('aria-expanded') !== 'true'));
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href'); if (id.length < 2) return;
  const t = $(id); if (!t) return;
  e.preventDefault(); setDrawer(false);
  if (lenis) lenis.scrollTo(t, { offset: -70 }); else t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}));

/* ----------------------------------------------------------
   PORTADA · letras que botan y huellas que crecen
   ---------------------------------------------------------- */
(() => {
  const b = $('#bounce');
  b.innerHTML = b.textContent.split('').map((ch) => `<span>${ch}</span>`).join('');
  if (motion) {
    gsap.from('#bounce span', { y: -140, opacity: 0, duration: 1.1, ease: 'bounce.out', stagger: .08 });
    gsap.from('.hero__kids', { scale: 0, rotation: -40, duration: .8, ease: 'back.out(2.5)', delay: .7 });
    gsap.from('.hero__lead, .hero__cta, .pill', { y: 20, opacity: 0, duration: .8, stagger: .08, delay: .4 });
    gsap.from('.hero__pic', { scale: .7, opacity: 0, duration: 1.2, ease: 'elastic.out(1, .6)', delay: .2 });
    $$('#bounce span').forEach((s) => s.addEventListener('pointerenter', () => gsap.fromTo(s, { y: 0 }, { y: -26, duration: .25, yoyo: true, repeat: 1, ease: 'power2.out' })));
  }
  // huellas: de bebé a cole, a lo largo de una curva
  const svg = $('#trail'), N = 14;
  const fp = 'M0 -30C9 -30 13 -18 12 -4C11 8 9 22 0 24C-9 22 -11 8 -12 -4C-13 -18 -9 -30 0 -30Z';
  const toes = [[-7, -40, 4.2], [0, -44, 3.6], [6, -42, 3.2], [11, -37, 2.8], [14, -31, 2.4]];
  let html = '';
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const x = lerp(-40, 1240, t), y = 620 - Math.sin(t * Math.PI) * 300 - t * 120;
    const ang = Math.atan2(-(300 * Math.PI * Math.cos(t * Math.PI) + 120) / 1280, 1) * 180 / Math.PI + 90;
    const side = i % 2 ? 1 : -1, s = .55 + t * .9;
    const ox = Math.cos((ang) * Math.PI / 180) * 16 * side, oy = Math.sin((ang) * Math.PI / 180) * 16 * side;
    html += `<g class="fp" transform="translate(${(x + ox).toFixed(1)} ${(y + oy).toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${(s * (side > 0 ? -1 : 1)).toFixed(2)} ${s.toFixed(2)})"><path d="${fp}"/>${toes.map(([a, b2, r]) => `<circle cx="${a}" cy="${b2}" r="${r}"/>`).join('')}</g>`;
  }
  svg.innerHTML = html;
  const prints = $$('.fp', svg);
  if (!motion) { prints.forEach((p) => { p.style.opacity = .12; }); return; }
  const tl = gsap.timeline({ repeat: -1, repeatDelay: .6 });
  tl.to(prints, { opacity: .16, duration: .25, stagger: .22 }).to(prints, { opacity: 0, duration: .8, stagger: .1 }, '+=1');
})();

/* ----------------------------------------------------------
   EL MEDIDOR DE PIE
   SVG 300×560 · talón en y = 512 · 19,6 px por cm
   talla europea = 1,5 × (pie + 1,2 cm de margen)
   ---------------------------------------------------------- */
(() => {
  const svg = $('.gauge__svg'), foot = $('#foot'), toesG = $('#toes'), slider = $('#slider'), range = $('#cm');
  const HEEL = 512, K = 19.6, MIN = 9.5, MAX = 23;
  // regla
  let t = '';
  for (let c = 0; c <= 24; c += .5) {
    const y = HEEL - c * K; if (y < 40) break;
    const big = c % 1 === 0;
    t += `<line x1="48" x2="${big ? 70 : 60}" y1="${y}" y2="${y}" stroke="#2F8FE0" stroke-width="${big ? 2 : 1}" opacity=".7"/>`;
    t += `<line x1="252" x2="${big ? 230 : 240}" y1="${y}" y2="${y}" stroke="#2F8FE0" stroke-width="${big ? 2 : 1}" opacity=".7"/>`;
    if (big && c > 0) t += `<text x="76" y="${y + 4}" font-family="Fredoka, sans-serif" font-size="11" fill="#1C68B0" font-weight="600">${c}</text>`;
  }
  $('#ticks').innerHTML = t;
  // contorno del pie a partir de puntos (catmull-rom)
  const SHAPE = [[0, 0], [.3, .03], [.4, .15], [.37, .35], [.42, .55], [.5, .72], [.47, .85], [.3, .9], [.05, .91], [-.2, .9], [-.36, .85], [-.43, .7], [-.37, .5], [-.3, .3], [-.33, .12], [-.25, .02]];
  const TOES = [[-.27, .93, .17], [-.02, .955, .11], [.15, .94, .1], [.29, .9, .09], [.41, .84, .08]];
  const path = (pts) => {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length; i++) {
      const p0 = pts[(i - 1 + pts.length) % pts.length], p1 = pts[i], p2 = pts[(i + 1) % pts.length], p3 = pts[(i + 2) % pts.length];
      d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
    }
    return d + 'Z';
  };
  const age = (eu) => eu <= 18 ? '6 – 12 meses' : eu <= 20 ? '12 – 18 meses' : eu <= 22 ? '18 meses – 2 años' : eu <= 24 ? '2 – 3 años' : eu <= 26 ? '3 – 4 años' : eu <= 28 ? '4 – 5 años' : eu <= 30 ? '5 – 7 años' : eu <= 32 ? '7 – 8 años' : eu <= 34 ? '8 – 10 años' : '10 años o más';
  const check = (eu) => eu <= 24 ? 'cada 2 – 3 meses' : eu <= 30 ? 'cada 3 – 4 meses' : 'cada 6 meses';
  let cm = 15, shown = 0;
  const draw = (v) => {
    cm = clamp(v, MIN, MAX);
    const h = cm * K, w = h * .42, cx = 150;
    foot.setAttribute('d', path(SHAPE.map(([x, y]) => [cx + x * w, HEEL - y * h])));
    toesG.innerHTML = TOES.map(([x, y, r]) => `<circle cx="${cx + x * w}" cy="${HEEL - y * h}" r="${r * w}" fill="#FFD7B5" stroke="#E9A97A" stroke-width="2.5"/>`).join('');
    slider.setAttribute('transform', `translate(0 ${HEEL - h - 11})`);
    range.value = cm;
    const eu = clamp(Math.round(1.5 * (cm + 1.2)), 17, 38);
    $('#rFoot').textContent = `${fmt(cm)} cm`;
    $('#rAge').textContent = age(eu);
    $('#rCheck').textContent = check(eu);
    $('#callSize span').textContent = `Llamar y preguntar por el ${eu}`;
    if (eu !== shown) {
      shown = eu; $('#rSize').textContent = eu;
      if (motion) gsap.fromTo('#rSize', { scale: 1.25, rotation: -6 }, { scale: 1, rotation: 0, duration: .5, ease: 'back.out(3)' });
    }
  };
  const toSvgY = (e) => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()).y; };
  let drag = false;
  const onMove = (e) => { if (!drag) return; e.preventDefault(); draw((HEEL - toSvgY(e)) / K); };
  svg.addEventListener('pointerdown', (e) => { drag = true; svg.setPointerCapture(e.pointerId); onMove(e); $('.gauge__hint').style.opacity = 0; });
  svg.addEventListener('pointermove', onMove);
  svg.addEventListener('pointerup', () => { drag = false; });
  svg.addEventListener('pointercancel', () => { drag = false; });
  range.addEventListener('input', () => draw(+range.value));
  draw(15);
  if (motion) {
    // pequeña demostración al entrar: el pie crece y vuelve
    ScrollTrigger.create({ trigger: '#medidor', start: 'top 60%', once: true, onEnter: () => {
      const o = { v: 11 };
      gsap.to(o, { v: 17.5, duration: 1.4, ease: 'power2.inOut', yoyo: true, repeat: 1, onUpdate: () => { if (!drag) draw(o.v); }, onComplete: () => draw(15) });
    } });
  }
})();

/* ----------------------------------------------------------
   POR ETAPAS · cinta arrastrable con puntos
   ---------------------------------------------------------- */
(() => {
  const wrap = $('#belt'), track = $('#beltTrack'), dots = $('#beltDots');
  track.innerHTML = STAGES.map((s, i) => `
    <article class="stage" data-i="${i}" style="--c:${s.c};--bg:${s.bg || '#EAF5FF'}">
      <div class="stage__pic">${s.pic ? `<img src="assets/img/${s.pic}" alt="${s.h}" loading="lazy" draggable="false">` : shoe(...s.svg)}</div>
      ${s.tag ? `<span class="stage__tag">${s.tag}</span>` : ''}
      <h3>${s.h}</h3><p>${s.p}</p>
    </article>`).join('');
  const cards = $$('.stage', track);
  dots.innerHTML = cards.map((_, i) => `<button type="button" aria-label="Ir a la tarjeta ${i + 1}"></button>`).join('');
  let x = 0, tx = 0, drag = false, sx = 0, sxx = 0, raf = 0;
  const maxX = () => Math.min(0, -(track.scrollWidth - wrap.clientWidth));
  const cur = () => { let b = 0, bd = Infinity; cards.forEach((c, j) => { const d = Math.abs(-c.offsetLeft + cards[0].offsetLeft - tx); if (d < bd) { bd = d; b = j; } }); return b; };
  const paint = () => { const c = cur(); $$('button', dots).forEach((d, j) => d.classList.toggle('is-on', j === c)); };
  const tick = () => { raf = 0; x = reduced ? tx : lerp(x, tx, .12); track.style.transform = `translate3d(${x}px,0,0)`; if (Math.abs(x - tx) > .3 || drag) raf = requestAnimationFrame(tick); };
  const go = () => { if (!raf) raf = requestAnimationFrame(tick); paint(); };
  const to = (i) => { i = clamp(i, 0, cards.length - 1); tx = Math.max(maxX(), -(cards[i].offsetLeft - cards[0].offsetLeft)); go(); };
  wrap.addEventListener('pointerdown', (e) => { drag = true; sx = e.clientX; sxx = tx; wrap.classList.add('is-drag'); go(); });
  window.addEventListener('pointermove', (e) => { if (!drag) return; tx = clamp(sxx + e.clientX - sx, maxX() - 80, 80); paint(); });
  window.addEventListener('pointerup', () => { if (!drag) return; drag = false; wrap.classList.remove('is-drag'); to(cur()); });
  $('#beltPrev').addEventListener('click', () => to(cur() - 1));
  $('#beltNext').addEventListener('click', () => to(cur() + 1));
  dots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) to($$('button', dots).indexOf(b)); });
  window.addEventListener('resize', () => to(cur()));
  to(0);
})();

/* ----------------------------------------------------------
   JUEGO DE PAREJAS
   ---------------------------------------------------------- */
(() => {
  const memo = $('#memo');
  let first = null, lock = false, moves = 0, pairs = 0;
  const deal = () => {
    const deck = [...MEMO, ...MEMO].map((s, i) => ({ s, k: s[0], r: Math.random() + i * 0 })).sort((a, b) => a.r - b.r);
    memo.innerHTML = deck.map((c, i) => `<button class="mc" type="button" data-k="${c.k}" aria-label="Carta ${i + 1}"><span class="mc__b"><span>L</span></span><span class="mc__f">${shoe(...c.s)}</span></button>`).join('');
    first = null; lock = false; moves = 0; pairs = 0;
    $('#moves').textContent = 0; $('#pairs').textContent = 0; $('#win').hidden = true;
    if (motion) gsap.from('.mc', { scale: 0, rotation: () => (Math.random() - .5) * 40, duration: .5, ease: 'back.out(2)', stagger: .04 });
  };
  memo.addEventListener('click', (e) => {
    const c = e.target.closest('.mc');
    if (!c || lock || c === first || c.classList.contains('is-done')) return;
    c.classList.add('is-up');
    if (!first) { first = c; return; }
    moves++; $('#moves').textContent = moves;
    if (first.dataset.k === c.dataset.k) {
      [first, c].forEach((x) => { x.classList.add('is-done'); x.setAttribute('aria-label', 'Pareja encontrada'); });
      first = null; pairs++; $('#pairs').textContent = pairs;
      if (pairs === MEMO.length) { $('#winMoves').textContent = moves; $('#win').hidden = false; if (motion) gsap.from('#win', { scale: .6, duration: .6, ease: 'back.out(2)' }); }
    } else {
      lock = true;
      const a = first; first = null;
      setTimeout(() => { a.classList.remove('is-up'); c.classList.remove('is-up'); lock = false; }, 850);
    }
  });
  $('#restart').addEventListener('click', deal);
  deal();
})();

/* para mamá: vídeo */
(() => {
  const v = $('.mama__vid video');
  new IntersectionObserver(([en]) => { if (en.isIntersecting) { if (!reduced) play(v); } else v.pause(); }, { threshold: .3 }).observe(v);
})();

/* ----------------------------------------------------------
   APARICIONES
   ---------------------------------------------------------- */
if (motion) {
  $$('.sec-head, .result, .parejas__copy, .tienda__copy, .mama__copy, .visita__card').forEach((el) => {
    gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: 'back.out(1.4)', scrollTrigger: { trigger: el, start: 'top 86%' } });
  });
  gsap.from('.gauge', { y: 80, rotation: -6, opacity: 0, duration: 1.1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.gauge', start: 'top 86%' } });
  gsap.from('.stage', { y: 80, opacity: 0, duration: .8, stagger: .06, ease: 'back.out(1.6)', scrollTrigger: { trigger: '#belt', start: 'top 85%' } });
  gsap.from('.tienda__pic img', { scale: .6, opacity: 0, duration: 1, stagger: .15, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.tienda__pic', start: 'top 80%' } });
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
})();
