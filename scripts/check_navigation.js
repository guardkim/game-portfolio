const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { runInNewContext } = require('node:vm');

const source = readFileSync(path.join(__dirname, '../dist/script.js'), 'utf8');
const titles = { gunpowder: 'GunPowder', cravant: 'CRAVANT', cyberfunk: 'Cyberfunk Rider', swordlord: '검물주 키우기' };

function loadPage(hash = '') {
  const panels = Object.entries(titles).map(([id, textContent]) => ({
    id,
    hidden: false,
    querySelector(selector) { assert.equal(selector, 'h2'); return { textContent }; },
  }));
  const links = panels.map(({ id }) => ({
    hash: `#${id}`,
    attributes: new Map(),
    setAttribute(name, value) { this.attributes.set(name, value); },
    removeAttribute(name) { this.attributes.delete(name); },
  }));
  const announcement = { textContent: '' };
  const classes = new Set();
  const scrollCalls = [];
  const events = new Map();
  const location = { hash };
  const document = {
    querySelectorAll(selector) {
      assert.ok(['.project-panel', '.project-nav a'].includes(selector));
      return selector === '.project-panel' ? panels : links;
    },
    querySelector(selector) {
      assert.equal(selector, '.projects');
      return { classList: { add: (name) => classes.add(name) } };
    },
    getElementById(id) {
      assert.ok(['project-announcement', 'main'].includes(id));
      return id === 'project-announcement' ? announcement : { scrollIntoView: (options) => scrollCalls.push(options.block) };
    },
  };
  runInNewContext(source, { document, location, window: { addEventListener: (name, callback) => events.set(name, callback) } });
  assert.ok(classes.has('is-interactive'));
  assert.ok(events.has('hashchange'));
  return { panels, links, announcement, scrollCalls, navigate(nextHash) { location.hash = nextHash; events.get('hashchange')(); } };
}

function expectSelection(page, id) {
  assert.deepEqual(page.panels.filter((panel) => !panel.hidden).map((panel) => panel.id), [id]);
  assert.deepEqual(page.links.filter((link) => link.attributes.has('aria-current')).map((link) => [link.hash, link.attributes.get('aria-current')]), [[`#${id}`, 'location']]);
}

const page = loadPage();
expectSelection(page, 'gunpowder');
assert.equal(page.announcement.textContent, '');
assert.deepEqual(page.scrollCalls, []);
expectSelection(loadPage('#swordlord'), 'swordlord');
expectSelection(loadPage('#unknown'), 'gunpowder');

page.navigate('#cravant');
expectSelection(page, 'cravant');
assert.equal(page.announcement.textContent, 'CRAVANT 프로젝트를 표시합니다.');
page.navigate('#cyberfunk');
expectSelection(page, 'cyberfunk');
page.navigate('#about');
expectSelection(page, 'cyberfunk');
assert.equal(page.announcement.textContent, 'Cyberfunk Rider 프로젝트를 표시합니다.');
assert.deepEqual(page.scrollCalls, ['start', 'start']);

// Back/forward navigation dispatches the same hashchange event as a project link.
page.navigate('#cravant');
expectSelection(page, 'cravant');
page.navigate('#unknown');
expectSelection(page, 'cravant');
page.navigate('');
expectSelection(page, 'gunpowder');
assert.deepEqual(page.scrollCalls, ['start', 'start', 'start', 'start']);
console.log('PASS: initial selection, deep links, project changes, about, history hashes and unknown hashes.');
