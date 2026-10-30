const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal sections as they enter the viewport.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => observer.observe(el));

// Progress line and lightweight parallax.
const progress = $('#progress');
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    const stage = $('.hero-image-stage');
    if (stage && !reduceMotion && innerWidth > 600) {
      stage.style.transform = `translateY(${Math.min(scrollY * .07, 55)}px)`;
    }
    ticking = false;
  });
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Smooth anchor navigation with a reduced-motion fallback.
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = $(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    $('.nav-links')?.classList.remove('open');
  });
});

// Mobile navigation.
$('#menuToggle').addEventListener('click', () => $('.nav-links').classList.toggle('open'));

// Custom cursor, disabled on touch devices.
if (matchMedia('(pointer:fine)').matches && !reduceMotion) {
  const cursor = $('#cursor'), dot = $('#cursorDot');
  let x=innerWidth/2, y=innerHeight/2, dx=x, dy=y;
  addEventListener('mousemove', e => { x=e.clientX; y=e.clientY; dot.style.left=x+'px'; dot.style.top=y+'px'; });
  function moveCursor(){ dx += (x-dx)*.16; dy += (y-dy)*.16; cursor.style.left=dx+'px'; cursor.style.top=dy+'px'; requestAnimationFrame(moveCursor); }
  moveCursor();
  $$('a,button,.skill-list span').forEach(el => {
    el.addEventListener('mouseenter',()=>{cursor.style.width='54px';cursor.style.height='54px';cursor.style.background='rgba(20,20,20,.06)'});
    el.addEventListener('mouseleave',()=>{cursor.style.width='34px';cursor.style.height='34px';cursor.style.background='transparent'});
  });
}

// Gentle magnetic movement on desktop calls-to-action.
if (matchMedia('(pointer:fine)').matches && !reduceMotion) {
  $$('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r=el.getBoundingClientRect(), x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
      el.style.transform=`translate(${x*.08}px,${y*.12}px)`;
    });
    el.addEventListener('mouseleave',()=>el.style.transform='translate(0,0)');
  });
}