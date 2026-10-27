"""Dependency-free checks for links, downloads and project dialog wiring."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1] / "dist"


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.references = []
        self.dialogs = set()
        self.triggers = []
        self.downloads = []
        self.headings = 0

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if "id" in attrs:
            assert attrs["id"] not in self.ids, f"Duplicate ID: {attrs['id']}"
            self.ids.add(attrs["id"])
        if tag == "dialog":
            self.dialogs.add(attrs["id"])
            assert attrs.get("aria-labelledby"), "Dialog must have an accessible title"
            self.references.append("#" + attrs["aria-labelledby"])
        if "data-dialog" in attrs:
            self.triggers.append(attrs["data-dialog"])
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


page = Page()
page.feed((ROOT / "index.html").read_text(encoding="utf-8"))
assert page.headings == 1
assert len(page.dialogs) == 4
assert set(page.triggers) == page.dialogs
assert len(page.triggers) == 8
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

assert len(set(page.downloads)) == 1
assert {path.name for path in (ROOT / "assets/documents").glob("*.pdf")} == {"kim-kyoungho-portfolio.pdf"}
for download in set(page.downloads):
    with (ROOT / unquote(urlsplit(download).path)).open("rb") as stream:
        assert stream.read(5) == b"%PDF-", f"Invalid PDF: {download}"
assert (ROOT / ".nojekyll").is_file()
assert "prefers-reduced-motion" in (ROOT / "styles.css").read_text(encoding="utf-8")
print(f"PASS: {len(page.references)} references, 4 project dialogs, portfolio-only PDF download, relative Pages paths.")
