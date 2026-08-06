# Bancada de render 3D

Os PNGs de `public/render` não vieram de um banco de imagens: são renderizados
aqui, em Three.js, com material de plástico (clearcoat + reflexo de estúdio) e
fundo transparente. Assim a arte acompanha a paleta do site, e refazer todas as
peças em outra cor é mudar três constantes.

## Refazer os renders

```bash
npm install three --no-save
node tools/render-3d/servidor.js .
```

Abra `http://localhost:4711`. A página desenha cada peça, manda o PNG de volta
para o servidor e ele grava em `public/render`. Quando o console imprimir a
última linha (`salvo cadeado.png`), pode fechar.

## Onde mexer

- **Cor**: as constantes `ROSA_CLARO`, `ROSA`, `ROSA_FORTE` e `VINHO` no topo do
  `<script>` de `cena.html`.
- **Peças**: uma função por objeto (`coracao`, `balao`, `presente`, `alerta`,
  `cadeado`). Formas 2D viram volume em `inflar()`, que é o `ExtrudeGeometry`
  com bisel grande: é o bisel que dá o aspecto inflado.
- **Enquadramento**: `pecas.<nome>` devolve a distância da câmera; o tamanho
  final de cada arquivo está na lista `lista`.
- **Luz**: `cenaBase()`. A contraluz rosa é o que separa a peça do fundo escuro
  do site.

O tamanho do arquivo é o dobro do informado em `lista` porque o renderer usa
`pixelRatio` 2, então o PNG sai na resolução cheia com o canvas na metade.
