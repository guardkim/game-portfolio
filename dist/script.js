const panels = [...document.querySelectorAll('.project-panel')];
const projectLinks = [...document.querySelectorAll('.project-nav a')];
const announcement = document.getElementById('project-announcement');
let selectedProject = panels[0].id;

function selectProject(announce = false) {
  const requested = location.hash.slice(1) || panels[0].id;
  const next = panels.find((panel) => panel.id === requested);
  if (next) selectedProject = next.id;

  panels.forEach((panel) => { panel.hidden = panel.id !== selectedProject; });
  projectLinks.forEach((link) => {
    if (link.hash === `#${selectedProject}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });

  if (announce && next) {
    announcement.textContent = `${next.querySelector('h2').textContent} 프로젝트를 표시합니다.`;
    document.getElementById('main').scrollIntoView({ block: 'start' });
  }
}

selectProject();
document.querySelector('.projects').classList.add('is-interactive');
window.addEventListener('hashchange', () => selectProject(true));
