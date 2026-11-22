const panels = [...document.querySelectorAll('.project-panel')];
const projectLinks = [...document.querySelectorAll('.project-nav a')];
const announcement = document.getElementById('project-announcement');
let selectedProject = panels[0].id;

function selectProject(announce = false) {
  const requested = location.hash.slice(1) || panels[0].id;
  const caseTarget = requested === 'cravant-team' ? document.getElementById(requested) : null;
  const next = caseTarget ? caseTarget.closest('.project-panel') : panels.find((panel) => panel.id === requested);
  if (next) selectedProject = next.id;

  panels.forEach((panel) => {
    panel.hidden = panel.id !== selectedProject;
  });
  projectLinks.forEach((link) => {
    if (link.hash === `#${selectedProject}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });

  if (announce && next) {
    announcement.textContent = `${next.querySelector('h2').textContent} 프로젝트를 표시합니다.`;
  }
  if (caseTarget) {
    caseTarget.focus({ preventScroll: true });
    caseTarget.scrollIntoView({ block: 'start' });
  } else if (announce && next) {
    next.scrollIntoView({ block: 'start' });
  }
}

selectProject();
document.querySelector('.projects').classList.add('is-interactive');
window.addEventListener('hashchange', () => selectProject(true));

document.querySelectorAll('.replay-toggle').forEach((button) => {
  const still = button.closest('figure').querySelector('.replay source');
  const preference = window.matchMedia(still.media);

  function setPlayback(playing) {
    still.media = playing ? 'not all' : 'all';
    button.textContent = playing ? '움직임 멈추기' : 'GIF 재생';
  }

  setPlayback(!preference.matches);
  button.hidden = false;
  button.addEventListener('click', () => setPlayback(still.media === 'all'));
  preference.addEventListener('change', (event) => setPlayback(!event.matches));
});
