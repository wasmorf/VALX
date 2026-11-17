#!/usr/bin/env python3
"""Gera dist/index.html: o jogo inteiro em UM arquivo (CSS, JS e favicon embutidos).

Uso:  python3 tools/build.py
Útil para publicar subindo só um arquivo (ex.: pelo celular, no GitHub).
"""
import base64, re, pathlib

raiz = pathlib.Path(__file__).resolve().parent.parent
html = (raiz / "index.html").read_text(encoding="utf8")

# CSS
css = (raiz / "css" / "style.css").read_text(encoding="utf8")
html = html.replace('<link rel="stylesheet" href="css/style.css">', f"<style>\n{css}</style>")

# favicon
fav = base64.b64encode((raiz / "img" / "favicon.png").read_bytes()).decode()
html = html.replace('href="img/favicon.png"', f'href="data:image/png;base64,{fav}"')

# JS (na mesma ordem das tags <script src>)
srcs = re.findall(r'<script src="([^"]+)" defer></script>\n?', html)
js = "\n".join((raiz / s).read_text(encoding="utf8") for s in srcs)
html = re.sub(r'(?:[ \t]*<script src="[^"]+" defer></script>\n?)+', "", html)
html = html.replace("</body>", f"<script>\n{js}\n</script>\n</body>")

saida = raiz / "dist" / "index.html"
saida.parent.mkdir(exist_ok=True)
saida.write_text(html, encoding="utf8")
print(f"{saida} gerado ({saida.stat().st_size/1024:.0f} KB, {len(srcs)} scripts)")
