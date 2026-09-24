"""
Confere as fotos de public/produtos/ contra a especificação do site.

Uso:
    npm run fotos

Verifica dimensão, proporção, peso e nome do arquivo, e aponta o que
corrigir. Não altera nada — só informa.

Especificação completa em ESPECIFICACAO-FOTOS.md.
"""

import json
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("\n[fotos] Falta a biblioteca Pillow. Instale com:\n\n    pip install pillow\n")
    sys.exit(1)

RAIZ = Path(__file__).resolve().parent.parent
PASTA = RAIZ / "public" / "produtos"
FICHAS = RAIZ / "content" / "products"

LARGURA_IDEAL = 1600
ALTURA_IDEAL = 1200
PROPORCAO_IDEAL = 4 / 3
TOLERANCIA_PROPORCAO = 0.08          # ±8% ainda recorta bem
PESO_MAXIMO = 250 * 1024             # 250 KB
LARGURA_MINIMA = 1080                # o dobro do maior uso real (540 px)
EXTENSOES = {".webp", ".jpg", ".jpeg", ".png", ".avif"}


def kb(n: int) -> str:
    return f"{n / 1024:.0f} KB"


def slugs_existentes() -> set[str]:
    return {f.stem for f in FICHAS.glob("*.json")}


def main() -> int:
    if not PASTA.exists():
        print(f"\n[fotos] A pasta {PASTA.relative_to(RAIZ)} não existe. Nada a conferir.\n")
        return 0

    imagens = sorted(f for f in PASTA.iterdir() if f.suffix.lower() in EXTENSOES)
    if not imagens:
        print(
            f"\n[fotos] Nenhuma imagem em {PASTA.relative_to(RAIZ)}.\n"
            "        Os produtos seguem com as ilustrações vetoriais.\n"
        )
        return 0

    slugs = slugs_existentes()
    erros: list[str] = []
    avisos: list[str] = []
    ok: list[str] = []

    for img in imagens:
        nome = img.name
        problemas: list[str] = []

        # --- nome do arquivo
        if nome != nome.lower():
            problemas.append("nome com maiúscula — renomeie tudo em minúsculo")
        if " " in nome:
            problemas.append("nome com espaço — use hífen")

        stem = img.stem.lower().replace(" ", "-")
        if stem not in slugs:
            parecidos = [s for s in slugs if s.startswith(stem[:6])]
            dica = f" (você quis dizer {parecidos[0]}?)" if parecidos else ""
            problemas.append(
                f'não existe ficha "{stem}" em content/products/{dica}'
            )

        # --- peso
        peso = img.stat().st_size
        if peso > PESO_MAXIMO:
            problemas.append(
                f"{kb(peso)} — acima do limite de {kb(PESO_MAXIMO)}; rode `npm run fotos:preparar`"
            )

        # --- dimensão e proporção
        try:
            with Image.open(img) as im:
                largura, altura = im.size
        except Exception as exc:  # arquivo corrompido ou formato estranho
            erros.append(f"  {nome}: não foi possível abrir — {exc}")
            continue

        if largura < LARGURA_MINIMA:
            problemas.append(
                f"{largura}px de largura — abaixo do mínimo de {LARGURA_MINIMA}px, vai borrar em tela boa"
            )

        proporcao = largura / altura
        if abs(proporcao - PROPORCAO_IDEAL) / PROPORCAO_IDEAL > TOLERANCIA_PROPORCAO:
            if proporcao < 1:
                forma = "retrato"
            elif proporcao > 1.9:
                forma = "panorâmica"
            else:
                forma = "fora do 4:3"
            problemas.append(
                f"{largura}x{altura} ({forma}) — o site usa 4:3; "
                "o recorte central pode cortar o produto"
            )

        if problemas:
            erros.append(f"  {nome}:\n" + "\n".join(f"      - {p}" for p in problemas))
        else:
            ok.append(f"  {nome}: {largura}x{altura}, {kb(peso)}")

    # --- fichas que ainda não apontam para a foto
    for img in imagens:
        stem = img.stem.lower().replace(" ", "-")
        ficha = FICHAS / f"{stem}.json"
        if not ficha.exists():
            continue
        try:
            dados = json.loads(ficha.read_text(encoding="utf-8"))
        except Exception:
            continue
        srcs = [i.get("src") for i in dados.get("images", [])]
        if not any(srcs):
            avisos.append(
                f"  {stem}.json ainda está com \"src\": null — "
                f'aponte para "/produtos/{img.name}" para a foto aparecer'
            )

    # --- relatório
    if ok:
        print("\n[fotos] Prontas para publicar:\n" + "\n".join(ok))

    if avisos:
        print("\n[fotos] Falta ligar na ficha:\n" + "\n".join(avisos))

    if erros:
        print("\n[fotos] Corrija antes de publicar:\n" + "\n".join(erros))
        print(
            "\n        Dica: `npm run fotos:preparar` resolve dimensão, "
            "proporção, peso e nome de uma vez.\n"
        )
        return 1

    print("\n[fotos] Tudo dentro da especificação.\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
