from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent


class Audit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.anchors, self.resources = set(), [], []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "a":
            href = attrs.get("href", "")
            assert href.startswith("#"), f"Off-page navigation: {href}"
            assert attrs.get("target") != "_blank", "Unexpected new-tab navigation"
            self.anchors.append(href[1:])
        for attribute in ("src", "data-zoom"):
            if attrs.get(attribute):
                self.resources.append(attrs[attribute])
        if tag == "link" and attrs.get("href"):
            self.resources.append(attrs["href"])


audit = Audit()
audit.feed((ROOT / "index.html").read_text(encoding="utf-8"))
assert all(anchor in audit.ids for anchor in audit.anchors), "Broken section anchor"
for resource in audit.resources:
    parsed = urlsplit(resource)
    assert not parsed.scheme and not parsed.netloc, f"Remote resource: {resource}"
    path = (ROOT / unquote(parsed.path)).resolve()
    assert path.is_relative_to(ROOT), "Resource outside repository"
    assert path.is_file(), f"Missing asset: {resource}"
    assert path.stat().st_size > 0, f"Empty asset: {resource}"
print(f"PASS: {len(audit.anchors)} in-page links, {len(audit.resources)} local resource references")
