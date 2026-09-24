# Fotos dos produtos

Coloque aqui as fotos, com o nome igual ao slug do produto:

```
public/produtos/filme-stretch.jpg
public/produtos/sacolas.jpg
```

Depois aponte na ficha do produto, em `content/products/<slug>.json`:

```json
"images": [
  { "src": "/produtos/filme-stretch.jpg", "alt": "Rolo de filme stretch transparente" }
]
```

O caminho começa em `/produtos/` — sem o `public`.

Recomendado: 1200 × 900 px, até 300 KB, fundo branco.

Enquanto `src` for `null`, o site mostra a ilustração vetorial da marca.

Detalhes em `MANUAL-CONTEUDO.md`.
