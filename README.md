# Entrelinhas

Micro-SaaS que lê um histórico de conversa do WhatsApp e devolve um relatório com os padrões do relacionamento. O front-end fica aqui; a leitura acontece num fluxo do N8n e o pagamento no checkout da Cakto.

```
npm install
npm run dev      # http://localhost:3000
```

Sem nenhuma variável de ambiente o site roda em **modo demonstração**: a leitura é simulada em ~7 segundos, a cobrança vira um PIX de exemplo e aparece um botão para confirmar o pagamento na mão. Dá para percorrer as quatro telas do começo ao fim.

## As rotas

| Rota | O que é |
| --- | --- |
| `/` | Landing. Só apresentação e persuasão — nenhum upload aqui. |
| `/analise` | Quatro perguntas sobre a relação, uma por tela |
| `/analise/tutorial` | Passo a passo de exportação, com telas desenhadas e chave Android/iPhone |
| `/analise/enviar` | Upload do `.txt`, adicional da análise avançada, aceite dos termos |
| `/relatorio/[id]` | Processando → pagamento → relatório liberado |

O estado real mora no servidor. `/relatorio/[id]` consulta `GET /api/analyze/[id]` a cada 2,5s e troca de tela sozinho — dá para fechar a aba, voltar do checkout ou abrir no computador que a análise continua no mesmo lugar. As respostas das perguntas ficam no `sessionStorage` até o envio e seguem junto com o arquivo para o N8n.

## O agente que lê a conversa

Preencha `GROQ_API_KEY` ([console.groq.com/keys](https://console.groq.com/keys)) e o site funciona de ponta a ponta, sem N8n. Modelo padrão: `llama-3.3-70b-versatile`, trocável por `GROQ_MODEL`.

A conversa não vai crua para o modelo. [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts) processa o arquivo primeiro:

**Números medidos aqui**, não estimados: quem manda a primeira mensagem de cada dia, mediana do tempo de resposta por pessoa, quantas vezes passou de 4 horas, volume e marcas de afeto mês a mês, histograma por hora do dia, hora em que aparecem as mensagens de atrito, maiores silêncios e quem voltou a falar primeiro.

**Uma amostra do texto**: o começo (como era), uma varredura espaçada pelo meio (como mudou) e as últimas 120 mensagens (como está agora), com teto de 42 mil caracteres.

Contagem é trabalho de código — modelo de linguagem erra ao contar e acerta ao interpretar. Assim uma conversa de três anos cabe num pedido só, e cada afirmação do relatório se apoia em algo verificável.

O prompt está em [`src/lib/groq.ts`](src/lib/groq.ts). Ele proíbe inventar número, proíbe dizer o que a outra pessoa sente, proíbe diagnóstico e proíbe aconselhar terminar ou continuar. Pede 6 seções e 3 ações concretas para a semana.

A leitura roda em `after()`, depois que a resposta já saiu — o front recebe o id na hora e acompanha por polling.

## Fila e modelo reserva

A camada gratuita da Groq trabalha com teto de tokens por minuto — 12 mil no `llama-3.3-70b`, 6 mil no `llama-3.1-8b`. Sem tratamento, duas pessoas enviando junto derrubam a segunda.

[`src/lib/fila.ts`](src/lib/fila.ts) resolve com três camadas:

1. **Uma leitura por vez**, com orçamento contado numa janela deslizante de 60s.
2. **Se a espera passar de 20 segundos**, a leitura vai direto para o modelo reserva — com recorte menor (4 mil caracteres) e resposta menor, porque o reserva tem metade do teto. Menos afiada, mas na hora. O paywall vem depois da leitura, e ninguém espera um minuto antes de ver o preço.
3. **Se o reserva também estiver cheio**, volta para a fila e espera a vez. Falha só se os dois estiverem congestionados.

Testado com três análises simultâneas: a primeira instantânea no modelo bom, a segunda instantânea no reserva, a terceira esperou 60s na fila. Nenhuma falhou. A tela de carregamento mostra quantas conversas estão na frente.

Ajuste `GROQ_TPM` para o teto do seu plano ([console.groq.com/settings/limits](https://console.groq.com/settings/limits)).

Vale a conta: no plano pago a análise custa perto de **R$ 0,04**, contra R$ 19,90 de venda. A IA é 0,2% da receita — na hora de divulgar, o Dev Tier sai mais barato que qualquer engenharia em volta do limite gratuito.

## Conectando o N8n

Alternativa ao agente acima. Se `N8N_WEBHOOK_URL` estiver preenchida, ela ganha e o Groq é ignorado.

O fluxo pronto está em [`n8n/entrelinhas-analise.json`](n8n/entrelinhas-analise.json). Para usar:

1. No n8n: **Workflows → Import from File** e escolha o arquivo.
2. No nó **Groq lê a conversa**, troque `COLE_AQUI_SUA_CHAVE_GROQ` pela sua chave. (Melhor ainda: apague o header e use uma credencial *Header Auth*.)
3. Nos nós **Devolve ao site** e **Avisa a falha**, troque `COLE_AQUI_O_MESMO_N8N_CALLBACK_TOKEN` pelo valor que você puser em `N8N_CALLBACK_TOKEN`.
4. Ative o workflow, copie a URL de produção do webhook e ponha em `N8N_WEBHOOK_URL`.

Os sete nós: recebe o arquivo → mede a conversa e monta o pedido → Groq (com 3 tentativas e 20s entre elas) → valida a forma do relatório → devolve ao site. Qualquer falha sai pelo ramo de erro e avisa o site, que mostra a tela de falha sem cobrar nada.

O nó **Prepara o pedido** é a mesma lógica de [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts) portada para JavaScript puro, com o mesmo prompt. São duas cópias da mesma coisa: se mexer no prompt de um lado, mexa no outro — ou escolha um dos dois caminhos como definitivo e apague o outro.

Preencha `N8N_WEBHOOK_URL`. O site envia um `multipart/form-data`:

| Campo | Conteúdo |
| --- | --- |
| `arquivo` | O `.txt` exportado |
| `analiseId` | UUID desta análise |
| `avancada` | `"true"` se a pessoa marcou o adicional |
| `callbackUrl` | Para onde devolver o resultado |
| `respostas` | JSON com as perguntas iniciais: `[{ "pergunta": "…", "resposta": "…" }]` |

Quando o fluxo terminar, faça um `POST` no `callbackUrl` com:

```json
{
  "headline": "Vocês conversam muito — e falam pouco sobre vocês.",
  "summary": "Um parágrafo curto de abertura.",
  "patternCount": 6,
  "sections": [
    { "title": "Quem começa as conversas", "body": "…", "icon": "conversa" }
  ],
  "advanced": { "title": "…", "body": "…", "level": "baixo" }
}
```

`icon` aceita: `coracao`, `conversa`, `lupa`, `escudo`, `alerta`, `celular`, `presente`, `nuvem`, `brilho`, `foguete`, `cadeado`. Se vier vazio, o site escolhe um.

Se for mais simples devolver markdown, mande `{ "texto": "## Título\n\nparágrafo…" }` — os títulos `##` viram seções. Deu erro no fluxo? `{ "erro": "mensagem" }` leva a pessoa para a tela de falha, sem cobrança.

Defina `N8N_CALLBACK_TOKEN` e mande o mesmo valor no header `x-entrelinhas-token` para que só o seu fluxo consiga escrever aí.

## Conectando a Cakto

1. Crie dois produtos: o base (R$ 19,90) e o que já inclui a análise avançada (R$ 29,80).
2. Coloque os links em `CAKTO_CHECKOUT_URL` e `CAKTO_CHECKOUT_URL_AVANCADA`.
3. Aponte o postback da Cakto para `https://seusite.com/api/checkout/webhook`.

O `analiseId` viaja na URL do checkout em `ref`, `utm_content` e `src` ao mesmo tempo, porque cada plataforma devolve um campo diferente no postback. Veja no painel qual deles a Cakto repassa e pode enxugar os outros em [`src/lib/payments.ts`](src/lib/payments.ts) — o webhook aceita qualquer um dos três, em qualquer nível do JSON.

Assim que `CAKTO_CHECKOUT_URL` existir, o botão de simular pagamento some sozinho.

## Antes de colocar no ar

- **Troque o armazenamento.** [`src/lib/store.ts`](src/lib/store.ts) é um `Map` em memória: funciona numa instância só. Em serverless, cada função pode subir num processo diferente e a análise "some". Troque por Redis/Upstash mantendo as mesmas funções exportadas.
- **Preencha os depoimentos.** [`src/components/Depoimentos.tsx`](src/components/Depoimentos.tsx) tem a lista vazia e a seção some da página enquanto estiver assim. Cole ali as mensagens de gente de verdade, com autorização — prova social inventada num produto sobre confiança é o pior lugar possível para começar mentindo.
- **Revise os textos legais.** [`/termos`](src/app/termos/page.tsx) e [`/privacidade`](src/app/privacidade/page.tsx) descrevem o produto com honestidade, mas precisam passar por alguém da área jurídica antes de valer como documento.
- **Confirme a promessa de privacidade.** O código cumpre o que a interface diz: o `.txt` só existe em memória durante o repasse para o N8n e nunca entra no armazenamento. Se mudar isso, mude o texto junto.

## Variáveis de ambiente

Todas em [`.env.example`](.env.example). As que importam: `NEXT_PUBLIC_SITE_URL`, `N8N_WEBHOOK_URL`, `CAKTO_CHECKOUT_URL`, `NEXT_PUBLIC_PRECO_BASE`, `NEXT_PUBLIC_PRECO_AVANCADA`.

## Design

Paleta, tipografia, sombras e animações ficam nos tokens no topo de [`src/app/globals.css`](src/app/globals.css). Os ícones 3D são SVG desenhado à mão em [`src/components/Icon3D.tsx`](src/components/Icon3D.tsx) — nenhum arquivo externo, nenhuma fonte de ícone, e cada forma pode ser animada.
