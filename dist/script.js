const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-toggle');
let paused = motionPreference.matches;
try { paused = paused || localStorage.getItem('portfolio-motion') === 'paused'; } catch { /* Storage can be disabled in private browsing. */ }

function applyMotion() {
  document.documentElement.dataset.motion = paused ? 'paused' : 'playing';
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.setAttribute('aria-label', paused ? '모션 재생' : '모션 일시정지');
  motionButton.querySelector('.motion-label').textContent = paused ? '모션 꺼짐' : '모션 켜짐';
}
applyMotion();
motionButton.hidden = false;
motionButton.addEventListener('click', () => {
  paused = !paused;
  applyMotion();
  try { localStorage.setItem('portfolio-motion', paused ? 'paused' : 'playing'); } catch { /* The toggle still works without storage. */ }
});
motionPreference.addEventListener('change', (event) => {
  paused = event.matches;
  applyMotion();
});

if ('IntersectionObserver' in window && !paused) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-waiting');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((element) => {
    element.classList.add('is-waiting');
    observer.observe(element);
  });
}

document.querySelectorAll('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.dialog);
    dialog.showModal();
    dialog.scrollTop = 0;
  });
});

document.querySelectorAll('.project-dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
});
