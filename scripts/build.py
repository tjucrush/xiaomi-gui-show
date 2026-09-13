import shutil
from pathlib import Path

root = Path(__file__).resolve().parent.parent
output = root / "_site"
output.mkdir(exist_ok=True)
for name in ("index.html", "style.css", "script.js", ".nojekyll"):
    shutil.copyfile(root / name, output / name)
shutil.copytree(root / "assets", output / "assets", dirs_exist_ok=True)
print("Public display assembled in _site")
