"""Dependency-free checks for links, downloads and project navigation."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1] / "dist"


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.references = []
        self.projects = set()
        self.project_links = []
        self.in_project_nav = False
        self.downloads = []
        self.headings = 0

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if "id" in attrs:
            assert attrs["id"] not in self.ids, f"Duplicate ID: {attrs['id']}"
            self.ids.add(attrs["id"])
        classes = attrs.get("class", "").split()
        if tag == "section" and "project-panel" in classes:
            self.projects.add(attrs["id"])
            assert attrs.get("aria-labelledby"), "Project must have an accessible title"
            assert "hidden" not in attrs, "Project content must be available without JavaScript"
            self.references.extend("#" + label for label in attrs["aria-labelledby"].split())
        if tag == "nav" and ("project-nav" in classes or attrs.get("id") == "project-nav"):
            self.in_project_nav = True
        if tag == "a" and self.in_project_nav:
            self.project_links.append(attrs.get("href"))
        if tag == "h1":
            self.headings += 1
        if tag == "img":
            assert attrs.get("alt"), "Content image needs alt text"
            assert attrs.get("width") and attrs.get("height"), "Image dimensions prevent layout shift"
        if tag == "a" and attrs.get("target") == "_blank":
            assert "noopener" in attrs.get("rel", ""), "External tab needs noopener"
        if "download" in attrs:
            self.downloads.append(attrs["href"])
        for attr in ("src", "href"):
            if attrs.get(attr):
                self.references.append(attrs[attr])

    def handle_endtag(self, tag):
        if tag == "nav":
            self.in_project_nav = False


page = Page()
page.feed((ROOT / "index.html").read_text(encoding="utf-8"))
assert page.headings == 1
assert page.projects == {"gunpowder", "cravant", "cyberfunk", "swordlord"}
assert len(page.project_links) == 4
assert set(page.project_links) == {"#" + project for project in page.projects}
for reference in page.references:
    url = urlsplit(reference)
    if url.scheme or url.netloc:
        assert url.scheme in {"https", "mailto"}, f"Unexpected URL scheme: {reference}"
        continue
    if not url.path:
        assert not url.fragment or url.fragment in page.ids, f"Missing anchor: {reference}"
        continue
    assert not url.path.startswith("/"), f"Absolute path breaks project Pages: {reference}"
    target = (ROOT / unquote(url.path)).resolve()
    assert target.is_relative_to(ROOT.resolve()), f"Path escapes dist: {reference}"
    assert target.is_file(), f"Missing file: {reference}"
    if url.fragment and target.suffix != ".pdf":
        assert url.fragment in page.ids, f"Missing fragment: {reference}"

downloads = {unquote(urlsplit(download).path) for download in page.downloads}
assert downloads == {"assets/documents/kim-kyoungho-portfolio.pdf"}
assert {path.name for path in (ROOT / "assets/documents").glob("*.pdf")} == {"kim-kyoungho-portfolio.pdf"}
for download in downloads:
    with (ROOT / download).open("rb") as stream:
        assert stream.read(5) == b"%PDF-", f"Invalid PDF: {download}"
assert (ROOT / ".nojekyll").is_file()
assert "prefers-reduced-motion" in (ROOT / "styles.css").read_text(encoding="utf-8")
print(f"PASS: {len(page.references)} references, 4 project panels and navigation links, portfolio-only PDF download, relative Pages paths.")
