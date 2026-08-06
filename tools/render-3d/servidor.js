/**
 * Servidor mínimo só para a bancada de render.
 *
 * Serve a cena (deste diretório) e o `three` (do node_modules do projeto), e
 * recebe de volta cada PNG pronto em POST /salvar?nome=xxx. O navegador nunca
 * baixa arquivo: ele manda o dataURL e quem escreve em disco é o Node.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const AQUI = path.resolve(__dirname);
const PROJETO = path.resolve(process.argv[2]);
const SAIDA = path.join(PROJETO, "public", "render");

fs.mkdirSync(SAIDA, { recursive: true });

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
};

const servidor = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "POST" && url.pathname === "/salvar") {
    const nome = (url.searchParams.get("nome") || "peca").replace(/[^a-z0-9_-]/gi, "");
    const pedacos = [];
    req.on("data", (d) => pedacos.push(d));
    req.on("end", () => {
      const dataUrl = Buffer.concat(pedacos).toString("utf8");
      const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
      const destino = path.join(SAIDA, `${nome}.png`);
      fs.writeFileSync(destino, Buffer.from(base64, "base64"));
      console.log(`salvo ${nome}.png (${(base64.length * 0.75 / 1024).toFixed(0)} KB)`);
      res.writeHead(200).end("ok");
    });
    return;
  }

  let rel = decodeURIComponent(url.pathname);
  if (rel === "/") rel = "/cena.html";

  for (const raiz of [AQUI, PROJETO]) {
    const alvo = path.join(raiz, rel);
    if (!alvo.startsWith(raiz)) continue;
    if (fs.existsSync(alvo) && fs.statSync(alvo).isFile()) {
      res.writeHead(200, { "content-type": TIPOS[path.extname(alvo)] || "application/octet-stream" });
      fs.createReadStream(alvo).pipe(res);
      return;
    }
  }

  res.writeHead(404).end("nao encontrado");
});

servidor.listen(4711, () => console.log("bancada em http://localhost:4711"));
