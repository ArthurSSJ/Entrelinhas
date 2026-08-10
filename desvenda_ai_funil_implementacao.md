# DESVENDA AI — IMPLEMENTAÇÃO DO FUNIL DE CONVERSÃO

> **Instrução para o Claude Code:** este arquivo é um plano de implementação sequencial. O projeto já está aberto no Claude Code e você já conhece a arquitetura, funcionalidades e contexto da Desvenda AI.
>
> **Não peça explicações sobre o produto.** Trabalhe diretamente no código existente.
>
> **IMPORTANTE:** os seguintes itens **já foram implementados anteriormente e NÃO devem ser refeitos do zero**:
>
> - Reestruturação da landing page para conversão
> - Seção de curiosidade
> - Reformulação do quiz
> - Melhoria do upload/tutorial
> - Exit intent
> - Tracking/eventos do funil
>
> Aproveite o que já existe e faça apenas os ajustes necessários para integrar as novas etapas abaixo.
>
> Execute as etapas **na ordem**. Ao terminar cada etapa, valide o funcionamento antes de seguir para a próxima. Não pare no meio do plano. No final, faça a auditoria completa descrita na última etapa.

---

# ETAPA 1 — AUDITAR O ESTADO ATUAL ANTES DAS ALTERAÇÕES

Antes de modificar qualquer código:

1. Analise as páginas e componentes que já foram implementados.
2. Identifique o fluxo atual:
   - landing
   - quiz
   - upload
   - processamento
   - checkout
   - pagamento
   - resultado
3. Identifique como o resultado da análise é armazenado e disponibilizado.
4. Identifique como o estado do usuário é persistido entre as etapas.
5. Identifique como o checkout e o pagamento já funcionam.
6. Identifique como o tracking já implementado funciona.
7. Identifique se já existe algum componente de modal, oferta, pricing card ou sistema de estado que possa ser reutilizado.
8. Identifique qualquer limitação atual do backend necessária para implementar as novas etapas.

Não reescreva funcionalidades que já estejam funcionando.

Antes de continuar, tenha certeza de que entende o fluxo atual e que as alterações seguintes poderão ser integradas sem quebrar as etapas existentes.

---

# ETAPA 2 — CRIAR A TELA DE PROCESSAMENTO DA ANÁLISE

Depois que o usuário enviar a conversa e a análise realmente começar, criar/melhorar uma tela de processamento premium.

## Objetivo

Transformar o processamento em uma experiência de antecipação e expectativa.

## Copy

### Título

> Estamos analisando sua conversa...

### Subtítulo

> Estamos procurando padrões que seriam difíceis de perceber olhando mensagem por mensagem.

Mostrar visualmente etapas do processamento, por exemplo:

- Organizando o histórico
- Analisando padrões de comunicação
- Observando reciprocidade
- Identificando pontos de atenção
- Preparando seu relatório
- Finalizando análise

### Regras importantes

- Se o backend já fornece status real, utilizar esses status.
- Não fingir que uma etapa técnica foi executada quando ela não foi.
- Não inventar porcentagens de progresso.
- Não simular uma análise concluída enquanto ela ainda está em andamento.
- Se o processamento for muito rápido, garantir que a interface continue elegante sem criar espera artificial desnecessária.
- Se houver erro, apresentar uma mensagem clara e permitir recuperação.
- Se o usuário atualizar a página, preservar o estado sempre que a arquitetura atual permitir.

Quando a análise REAL terminar:

### Título

> Análise concluída.

### Subtítulo

> Encontramos alguns padrões que merecem uma análise mais cuidadosa.

CTA:

> Ver minha prévia

O CTA deve levar à próxima etapa.

---

# ETAPA 3 — CRIAR A PRÉVIA PERSONALIZADA DO RELATÓRIO

Esta é uma das etapas mais importantes do funil.

Ela deve aparecer **depois que a análise real terminou e antes do pagamento**.

## Objetivo

O usuário deve sentir:

> "Eu já descobri uma parte. Agora quero ver o restante."

## Headline

> Sua análise encontrou alguns pontos interessantes.

## Subheadline

> Veja uma pequena prévia do que apareceu no seu relatório.

## Conteúdo

Mostrar 2 ou 3 insights REAIS produzidos pela análise.

Nunca inventar insights apenas para criar suspense.

A apresentação deve ser visual, por exemplo:

### Insight

**Comunicação**

> [Insight real produzido pela análise]

### Insight

**Reciprocidade**

> [Insight real produzido pela análise]

### Insight

**Ponto de atenção**

> [Insight real produzido pela análise]

Depois da prévia, criar uma área visualmente bloqueada.

## Título

> Seu relatório completo contém muito mais.

Cards bloqueados:

- Dinâmica emocional
- Padrões de comunicação
- Reciprocidade
- Pontos de atenção
- Recomendações personalizadas
- Análise detalhada

Utilizar blur/lock visual para transmitir que existem informações adicionais sem inventar o conteúdo.

## CTA

> Desbloquear meu relatório

Preço:

> R$19,90

Microcopy:

> Pagamento único • Sem assinatura

## Regras

- Os insights visíveis precisam vir da análise real.
- Não mostrar "17 sinais", "8 problemas", "92% de interesse" ou qualquer outro número se esse dado não existir realmente no resultado.
- Não criar falsa descoberta.
- Não liberar conteúdo que deveria estar atrás do pagamento.
- Não bloquear a prévia inteira: ela precisa demonstrar valor antes da compra.
- A página deve ser mobile-first.

---

# ETAPA 4 — OTIMIZAR O CHECKOUT

Agora otimize o checkout existente sem quebrar a integração atual de pagamento.

## Estrutura

### Headline

> Seu relatório está pronto.

### Subheadline

> Falta apenas desbloquear o resultado completo.

Mostrar um resumo:

**DESVENDA AI — Relatório Completo**

- Análise da comunicação
- Padrões de interesse e reciprocidade
- Pontos de atenção
- Dinâmica da relação
- Recomendações personalizadas

Preço:

> R$19,90

Indicar claramente:

> Pagamento único.

CTA:

> Desbloquear meu relatório

## Regras

- Remover distrações desnecessárias.
- Não adicionar menus ou links que facilitem abandono sem necessidade.
- Não esconder preço.
- Não usar falsa urgência.
- Não utilizar contagem regressiva falsa.
- Não alterar o funcionamento do gateway existente sem necessidade.
- Garantir que o estado do pedido seja corretamente mantido.

---

# ETAPA 5 — IMPLEMENTAR ORDER BUMP DA INVESTIGAÇÃO AVANÇADA

Adicionar ao checkout um Order Bump para a Investigação Avançada.

## Oferta

**ADICIONAR INVESTIGAÇÃO AVANÇADA**

> + R$9,90

Texto:

> Se você já vai analisar a conversa, pode ir além.

Benefícios:

- Mudanças de comportamento
- Inconsistências na comunicação
- Distanciamento emocional
- Padrões que merecem atenção
- Possíveis indícios compatíveis com infidelidade

Adicionar observação:

> A análise identifica padrões e sinais de alerta. Ela não confirma traição como fato.

## Resumo de preço

Relatório:

> R$19,90

Investigação Avançada:

> + R$9,90

Total:

> R$29,80

## Comportamento

- Checkbox grande e fácil de selecionar.
- Atualizar o total dinamicamente.
- Se desmarcar, voltar para R$19,90.
- Se marcar, enviar corretamente a informação para o checkout/backend.
- Evitar qualquer cobrança duplicada.
- Se o usuário já tiver comprado a Investigação Avançada, não mostrar a oferta novamente.
- O Order Bump deve aparecer somente quando fizer sentido para o estado atual da compra.

---

# ETAPA 6 — IMPLEMENTAR UPSELL PÓS-COMPRA

Depois que o usuário comprar o relatório principal, verificar se ele já comprou a Investigação Avançada.

## Se já comprou

Não mostrar upsell.

Liberar o fluxo para o resultado.

## Se NÃO comprou

Mostrar uma página intermediária antes do resultado.

### Headline

> Seu relatório principal está pronto.

### Subheadline

> Mas existe uma análise adicional que ainda não foi executada.

### Título

> Quer olhar mais fundo?

### Texto

> A Investigação Avançada procura padrões relacionados a mudanças de comportamento, inconsistências, distanciamento e sinais de alerta na conversa.

Benefícios:

- análise comportamental aprofundada
- mudanças ao longo do histórico
- padrões de comunicação
- sinais de alerta
- possíveis indícios compatíveis com infidelidade

Preço:

> R$9,90

CTA principal:

> Sim, quero a Investigação Avançada

CTA secundário:

> Não, quero apenas meu relatório

## Regras

- O upsell é opcional.
- Se o usuário recusar, ele deve conseguir acessar o relatório principal.
- Se aceitar, o pagamento deve ser tratado corretamente pelo sistema atual.
- Não cobrar novamente pelo relatório principal.
- Não mostrar o upsell para quem já comprou a Investigação Avançada.
- Registrar corretamente o estado da compra.
- Não criar loop de upsell.

---

# ETAPA 7 — IMPLEMENTAR DOWNSELL

Implementar uma única oferta alternativa para usuários que recusarem a Investigação Avançada.

## Condições

Mostrar apenas se:

- o usuário recusou o upsell;
- ainda não possui a Investigação Avançada;
- ainda não recebeu o downsell nesta sessão/fluxo.

## Copy

### Título

> Antes de continuar...

### Texto

> Se o motivo da sua dúvida foi o preço, você ainda pode adicionar a Investigação Avançada por uma condição especial.

Preço:

> R$4,90

CTA:

> Adicionar por R$4,90

Segundo botão:

> Continuar sem ela

## Regras

- Mostrar somente uma vez.
- Se recusar novamente, não mostrar outra oferta.
- Não criar uma cadeia infinita de descontos.
- Não bloquear o relatório principal.
- Registrar aceitação/recusa corretamente.
- Garantir que o valor do downsell esteja configurado corretamente no backend/gateway.
- Não aplicar o desconto por erro em compras que não deveriam recebê-lo.

---

# ETAPA 8 — OFERTA DE RECUPERAÇÃO PARA ABANDONO DA COMPRA

O Exit Intent já foi implementado anteriormente. Não recriar o mecanismo.

Agora apenas integre a oferta comercial adequada ao sistema de exit intent existente.

Criar uma variante de oferta para teste:

## Oferta

**RELATÓRIO + INVESTIGAÇÃO AVANÇADA**

Preço normal:

> R$29,80

Oferta:

> R$19,90

Copy:

### Título

> Talvez você só precisasse de um motivo para concluir.

### Texto

> Leve o relatório completo + Investigação Avançada pelo mesmo valor do relatório.

Preço:

> R$19,90

CTA:

> Quero aproveitar essa condição

Microcopy:

> Pagamento único.

## Regras

Esta oferta deve ser tratada como uma VARIANTE DE TESTE.

Não substituir definitivamente a oferta principal.

Criar uma forma simples de ativar/desativar essa oferta.

Não mostrar para:

- usuários que já compraram;
- usuários que já receberam a mesma oferta naquela sessão;
- usuários que já possuem a Investigação Avançada.

Acompanhar separadamente:

- visualização;
- clique;
- conversão;
- receita;
- ticket médio;
- receita por visitante.

---

# ETAPA 9 — MELHORAR A PÁGINA DE RESULTADO

Depois do pagamento e de todas as ofertas necessárias, entregar o relatório em uma experiência visual premium.

O relatório não deve parecer simplesmente um bloco enorme de texto gerado por IA.

## Estrutura

### Header

> Seu diagnóstico está pronto.

### Resumo

> Visão geral da relação

Mostrar indicadores reais gerados pela análise.

Exemplos de categorias, apenas quando existirem no resultado:

- comunicação;
- reciprocidade;
- demonstração de interesse;
- conflitos;
- proximidade emocional;
- pontos de atenção.

Depois:

### Principais descobertas

Mostrar os principais insights reais.

### O que está funcionando

Mostrar pontos positivos reais encontrados.

### O que merece atenção

Mostrar pontos de atenção reais.

### Padrões identificados

Mostrar padrões encontrados na conversa.

### Como melhorar

Mostrar recomendações práticas personalizadas.

---

## Investigação Avançada

Se o cliente comprou:

Criar uma seção claramente separada:

> Investigação Avançada

Apresentar os resultados adicionais gerados por essa análise.

Se não comprou:

Não bloquear o relatório principal.

Caso a oferta ainda esteja disponível, pode existir uma chamada discreta:

> Quer investigar padrões adicionais?

CTA:

> Adicionar Investigação Avançada por R$9,90

Essa chamada não deve prejudicar a experiência de quem já comprou.

---

# ETAPA 10 — GARANTIR COERÊNCIA ENTRE ESTADOS DO FUNIL

Agora revise todos os estados possíveis.

Garantir que o sistema lide corretamente com:

## Usuário que não terminou o quiz

Não deve receber ofertas relacionadas ao checkout.

## Usuário que terminou o quiz e não enviou conversa

Deve poder continuar de onde parou quando possível.

## Usuário que enviou conversa

Não deve ser obrigado a reenviar o arquivo sem necessidade.

## Usuário com análise concluída

Deve conseguir acessar a prévia.

## Usuário que chegou ao checkout

Deve manter os dados da análise.

## Usuário que comprou o relatório

Não deve ser cobrado novamente pelo relatório.

## Usuário que comprou Investigação Avançada

Não deve receber oferta da Investigação Avançada novamente.

## Usuário que recusou upsell

Pode receber o downsell uma única vez.

## Usuário que recusou downsell

Não deve receber outra sequência de descontos.

## Usuário que atualiza a página

Preservar o estado sempre que tecnicamente possível.

## Usuário que acessa diretamente uma URL intermediária

Validar se possui autorização/estado para acessar aquela etapa.

Não confiar apenas no frontend para proteger estados de pagamento ou conteúdo pago.

---

# ETAPA 11 — REVISÃO DE COPY E CURIOSIDADE

Depois de implementar tudo, faça uma revisão de todas as novas telas.

A linguagem deve transmitir:

- curiosidade;
- antecipação;
- valor;
- descoberta;
- personalização;
- confiança.

Utilize naturalmente frases como:

> "Você lê as mensagens. A Desvenda lê os padrões."

> "E se a resposta que você procura já estiver escrita na conversa?"

> "Algumas coisas ficam muito mais claras quando você olha para a conversa inteira."

> "Talvez não seja impressão sua. Talvez exista um padrão."

> "Você já descobriu uma parte. O restante está no relatório."

> "Seu relatório está pronto."

Não exagerar em textos.

A copy deve ser agressiva no sentido de despertar curiosidade, mas nunca mentirosa.

Não utilizar:

- falsas descobertas;
- falsas avaliações;
- números inventados;
- falsa escassez;
- contadores falsos;
- afirmações de que a IA comprovou uma traição;
- afirmações psicológicas/diagnósticos clínicos;
- depoimentos inventados.

---

# ETAPA 12 — RESPONSIVIDADE E UX MOBILE

Faça uma revisão específica para mobile.

Verificar:

- hero;
- quiz;
- upload;
- processamento;
- prévia;
- checkout;
- order bump;
- upsell;
- downsell;
- resultado;
- modais existentes.

Garantir:

- botões grandes o suficiente;
- textos legíveis;
- nenhum overflow horizontal;
- cards que não quebrem;
- modais que possam ser fechados;
- CTA visível;
- preço legível;
- checkout fácil de utilizar;
- upload funcionando corretamente em celular.

Não adicionar animações pesadas que prejudiquem performance.

---

# ETAPA 13 — TESTES FUNCIONAIS COMPLETOS

Agora execute uma bateria de testes.

Não apenas analise visualmente.

Teste o fluxo completo:

## Fluxo A — Compra somente do relatório

Landing
→ Quiz
→ Upload
→ Análise
→ Prévia
→ Checkout
→ R$19,90
→ Pagamento
→ Recusar upsell
→ Recusar downsell
→ Resultado

Validar:

- compra;
- valor;
- acesso ao resultado;
- ausência de cobrança duplicada.

---

## Fluxo B — Compra com Order Bump

Landing
→ Quiz
→ Upload
→ Análise
→ Prévia
→ Checkout
→ Selecionar +R$9,90
→ Pagamento
→ Resultado

Validar:

- total R$29,80;
- Investigação Avançada registrada;
- upsell não aparece novamente;
- resultado avançado disponível.

---

## Fluxo C — Compra principal + Upsell

Landing
→ Quiz
→ Upload
→ Análise
→ Prévia
→ Checkout
→ Comprar R$19,90
→ Aceitar upsell R$9,90
→ Resultado

Validar:

- relatório principal comprado;
- upsell comprado separadamente;
- total correto;
- Investigação Avançada disponível.

---

## Fluxo D — Recusar upsell + aceitar downsell

Comprar relatório
→ Recusar upsell
→ Downs ell R$4,90
→ Aceitar

Validar:

- valor correto;
- Investigação Avançada liberada;
- nenhuma cobrança duplicada.

---

## Fluxo E — Recusar tudo

Comprar relatório
→ Recusar upsell
→ Recusar downsell
→ Resultado

Validar:

- acesso normal ao relatório;
- nenhuma oferta repetida;
- nenhum bloqueio indevido.

---

## Fluxo F — Oferta de recuperação

Simular abandono em uma etapa onde o Exit Intent existente é acionado.

Validar:

- oferta correta;
- condição correta;
- não aparece para cliente já comprado;
- não aparece repetidamente;
- conversão registrada corretamente.

---

# ETAPA 14 — AUDITORIA FINAL COMPLETA

Esta é a última etapa.

Não considere o trabalho concluído até realizar uma auditoria completa.

## 1. FUNCIONAL

Verifique:

- rotas;
- estados;
- upload;
- processamento;
- análise;
- prévia;
- checkout;
- pagamentos;
- order bump;
- upsell;
- downsell;
- resultado;
- persistência;
- refresh;
- navegação;
- tratamento de erros.

## 2. COMERCIAL

Verifique:

- R$19,90 do produto principal;
- +R$9,90 da Investigação;
- R$29,80 quando ambos forem comprados juntos;
- R$4,90 somente no downsell;
- oferta especial de recuperação configurada corretamente;
- nenhuma cobrança duplicada;
- nenhuma oferta para quem já comprou o produto correspondente.

## 3. TRACKING

O tracking já foi implementado anteriormente.

Não recrie o sistema.

Apenas confirme que os novos fluxos estão disparando corretamente os eventos já existentes, principalmente:

- preview_viewed;
- checkout_viewed;
- checkout_started;
- order_bump_selected;
- purchase_completed;
- upsell_viewed;
- upsell_accepted;
- upsell_declined;
- downsell_viewed;
- downsell_accepted;
- downsell_declined;
- exit_intent_shown;
- exit_intent_converted.

Se algum evento existente não estiver sendo disparado corretamente, corrija.

## 4. UX

Verifique:

- mobile;
- desktop;
- velocidade;
- hierarquia;
- CTAs;
- clareza;
- transições;
- modais;
- excesso de popups;
- legibilidade;
- acessibilidade básica.

## 5. SEGURANÇA

Verifique principalmente:

- conteúdo pago não pode ser liberado apenas manipulando estado no frontend;
- preços e permissões devem ser validados no backend quando aplicável;
- não confiar em parâmetros enviados pelo cliente para conceder acesso;
- usuários não devem conseguir acessar relatório de outra análise;
- não permitir duplicação acidental de pedidos;
- não permitir comprar o mesmo upsell de maneira inconsistente.

## 6. PERFORMANCE

Verifique:

- renders desnecessários;
- imagens;
- animações;
- bundle;
- chamadas duplicadas;
- polling;
- requisições de análise;
- carregamento mobile.

Não faça otimizações prematuras. Corrija problemas reais encontrados.

## 7. COPY

Confirme que não existem:

- números inventados;
- depoimentos inventados;
- falsas provas sociais;
- falsas contagens regressivas;
- falsas descobertas;
- promessa de detectar traição como fato;
- afirmações que a análise não consegue sustentar.

## 8. CÓDIGO

Verifique:

- componentes duplicados;
- código morto;
- estados inconsistentes;
- nomes ruins;
- lógica duplicada;
- erros de console;
- warnings;
- imports desnecessários;
- problemas de TypeScript;
- problemas de lint;
- erros de build.

Corrija os problemas encontrados.

---

# ETAPA 15 — RELATÓRIO FINAL

Somente depois de concluir todas as etapas anteriores, apresente um resumo final contendo:

1. O que foi implementado.
2. Arquivos/componentes principais alterados.
3. Novas rotas criadas, se houver.
4. Novos estados criados.
5. Como o Order Bump funciona.
6. Como o Upsell funciona.
7. Como o Downsell funciona.
8. Como a oferta de recuperação funciona.
9. Como a prévia do relatório funciona.
10. Quais testes foram realizados.
11. Quais problemas foram encontrados e corrigidos.
12. Quais problemas ainda precisam de atenção.
13. Quais pontos você recomenda testar manualmente antes de colocar em produção.

Se algum ponto não puder ser validado automaticamente, deixe isso explicitamente indicado.

**Não finalize dizendo apenas que "está tudo funcionando".**
Quero evidências do que foi validado e uma lista objetiva de qualquer pendência.
