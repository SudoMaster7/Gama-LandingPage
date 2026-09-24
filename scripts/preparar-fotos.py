"""
Prepara as fotos de produto para o site.

Uso:
    npm run fotos:preparar

Pega o que houver em public/produtos/ (ou na pasta indicada), e para cada
imagem: recorta para 4:3 pelo centro, redimensiona para 1600x1200, converte
para WebP com peso alvo e grava com o nome do slug.

Os originais NÃO são alterados: vão para public/produtos/_originais/.

Especificação completa em ESPECIFICACAO-FOTOS.md.
"""

import shutil
import sys
import unicodedata
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("\n[fotos] Falta a biblioteca Pillow. Instale com:\n\n    pip install pillow\n")
    sys.exit(1)

RAIZ = Path(__file__).resolve().parent.parent
PASTA = RAIZ / "public" / "produtos"
ORIGINAIS = PASTA / "_originais"
FICHAS = RAIZ / "content" / "products"

LARGURA = 1600
ALTURA = 1200
PESO_ALVO = 250 * 1024
EXTENSOES = {".webp", ".jpg", ".jpeg", ".png", ".avif", ".tif", ".tiff"}


def slugificar(texto: str) -> str:
    """'Bobina fundo estrela.png' -> 'bobina-fundo-estrela'"""
    sem_acento = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    limpo = "".join(c if c.isalnum() else "-" for c in sem_acento.lower())
    while "--" in limpo:
        limpo = limpo.replace("--", "-")
    return limpo.strip("-")


def recortar_4x3(im: Image.Image) -> Image.Image:
    """Recorta pelo centro na proporção 4:3, preservando o máximo da imagem."""
    largura, altura = im.size
    alvo = LARGURA / ALTURA
    atual = largura / altura

    if abs(atual - alvo) < 0.01:
        return im

    if atual > alvo:
        # larga demais: corta as laterais
        nova_largura = int(altura * alvo)
        x = (largura - nova_largura) // 2
        return im.crop((x, 0, x + nova_largura, altura))

    # alta demais: corta em cima e embaixo, puxando um pouco para cima
    # (em foto de produto o miolo interessante costuma ficar acima do centro)
    nova_altura = int(largura / alvo)
    y = int((altura - nova_altura) * 0.42)
    return im.crop((0, y, largura, y + nova_altura))


def salvar_com_peso(im: Image.Image, destino: Path) -> int:
    """Salva em WebP buscando ficar abaixo do peso alvo."""
    for qualidade in (88, 84, 80, 75, 70, 65, 60):
        im.save(destino, "WEBP", quality=qualidade, method=6)
        if destino.stat().st_size <= PESO_ALVO:
            return qualidade
    return 60


def main() -> int:
    if not PASTA.exists():
        print(f"\n[fotos] A pasta {PASTA.relative_to(RAIZ)} não existe.\n")
        return 1

    imagens = sorted(
        f for f in PASTA.iterdir()
        if f.is_file() and f.suffix.lower() in EXTENSOES
    )

    if not imagens:
        print(f"\n[fotos] Nenhuma imagem em {PASTA.relative_to(RAIZ)}.\n")
        return 0

    slugs = {f.stem for f in FICHAS.glob("*.json")}
    ORIGINAIS.mkdir(exist_ok=True)

    processadas = []
    sem_ficha = []

    for img in imagens:
        slug = slugificar(img.stem)

        if slug not in slugs:
            parecidos = [s for s in slugs if s.startswith(slug[:6])]
            sem_ficha.append((img.name, slug, parecidos))
            continue

        with Image.open(img) as im:
            original = im.size
            im = im.convert("RGB")
            im = recortar_4x3(im)
            im = im.resize((LARGURA, ALTURA), Image.LANCZOS)

            destino = PASTA / f"{slug}.webp"
            temporario = PASTA / f"{slug}.tmp.webp"
            qualidade = salvar_com_peso(im, temporario)
            temporario.replace(destino)

        # guarda o original, a menos que ele já seja o destino
        if img.resolve() != destino.resolve():
            shutil.move(str(img), str(ORIGINAIS / img.name))

        peso = destino.stat().st_size
        processadas.append(
            f"  {img.name}\n"
            f"      -> {destino.name}  "
            f"{original[0]}x{original[1]} -> {LARGURA}x{ALTURA}, "
            f"{peso / 1024:.0f} KB (q{qualidade})"
        )

    if processadas:
        print("\n[fotos] Preparadas:\n" + "\n".join(processadas))
        print(f"\n        Originais guardados em {ORIGINAIS.relative_to(RAIZ)}/")
        print("\n        Agora aponte cada foto na ficha do produto:")
        for linha in processadas:
            nome = linha.split("-> ")[1].split("  ")[0]
            slug = nome.replace(".webp", "")
            print(f'          content/products/{slug}.json  ->  "src": "/produtos/{nome}"')

    if sem_ficha:
        print("\n[fotos] Sem ficha correspondente (não processadas):")
        for nome, slug, parecidos in sem_ficha:
            dica = f" — existe {parecidos[0]}.json, renomeie a imagem" if parecidos else ""
            print(f"  {nome}: procurei content/products/{slug}.json{dica}")

    print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
