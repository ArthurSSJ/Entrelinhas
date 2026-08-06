import type { Report } from "./types";

/**
 * Relatório de demonstração. Usado apenas quando N8N_WEBHOOK_URL não está
 * configurada, para que a interface inteira possa ser percorrida sem depender
 * do fluxo de automação. Em produção o conteúdo vem do N8n.
 */
export function mockReport(withAdvanced: boolean): Report {
  return {
    headline: "Vocês conversam muito, e falam pouco sobre vocês.",
    summary:
      "A conversa tem ritmo e carinho. O que aparece com força é uma diferença de tempo: uma pessoa abre assunto difícil de madrugada, a outra responde de manhã, já resolvida. Nada disso é ruptura. É só um desencontro de horário que virou hábito.",
    patternCount: withAdvanced ? 7 : 6,
    sections: [
      {
        icon: "conversa",
        title: "Quem começa as conversas",
        body: "Em 68% dos dias, a primeira mensagem é sua. Isso não significa desinteresse do outro lado: as respostas chegam rápido e longas. Significa que o papel de iniciar ficou só com você, e esse tipo de papel cansa em silêncio.",
      },
      {
        icon: "coracao",
        title: "O tom mudou em março",
        body: "Até fevereiro, apelidos e áudios apareciam quase todo dia. Depois disso, a conversa ficou mais funcional: horários, contas, combinados. O afeto não sumiu, mas migrou para os encontros presenciais e saiu do texto.",
      },
      {
        icon: "lupa",
        title: "Assuntos que ninguém termina",
        body: "Três temas aparecem, esquentam e somem sem conclusão: dinheiro, a viagem de julho e a família dele. Em todos, alguém muda de assunto com uma piada. É um mecanismo de proteção, e está funcionando bem demais.",
      },
      {
        icon: "celular",
        title: "O horário das brigas",
        body: "Quase todo atrito acontece depois das 23h, quando as respostas ficam curtas e o intervalo entre mensagens dobra. As mesmas conversas, quando acontecem de tarde, terminam em acordo.",
      },
      {
        icon: "presente",
        title: "O que vocês fazem bem",
        body: "Vocês pedem desculpa rápido e sem rodeios. Em 9 de 11 desentendimentos, alguém retoma o contato em menos de duas horas. Esse é o hábito mais saudável da conversa inteira.",
      },
      {
        icon: "foguete",
        title: "Uma coisa para tentar esta semana",
        body: "Escolha um dos três assuntos inacabados e traga ele num horário calmo, pessoalmente. Não para resolver, só para nomear. A conversa de vocês já mostrou que dá conta.",
      },
    ],
    acoes: [
      {
        titulo: "Escolha um assunto inacabado",
        texto:
          "Dos três que ficaram pendentes, pegue o mais fácil (a viagem de julho) e traga num horário calmo. Não para resolver, só para nomear.",
      },
      {
        titulo: "Troque o horário das conversas difíceis",
        texto:
          "As mesmas conversas terminam em acordo quando acontecem de tarde. Quando der vontade de mandar às 23h, escreva e mande no dia seguinte.",
      },
      {
        titulo: "Deixe a próxima primeira mensagem para o outro lado",
        texto:
          "Por três dias, não abra a conversa. Não é teste nem castigo: é ver como fica o ritmo sem você segurando ele sozinho.",
      },
    ],
    advanced: withAdvanced
      ? {
          level: "baixo",
          title: "Análise avançada de traição",
          body: "Não há indícios de envolvimento com terceiros nesta conversa. As ausências têm explicação dentro do próprio histórico (trabalho e viagens já mencionados), o vocabulário afetivo é estável e não existem mudanças bruscas de padrão de resposta. O ponto de atenção é outro: o desgaste de quem sustenta a conversa sozinho.",
        }
      : null,
  };
}
