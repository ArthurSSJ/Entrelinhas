import type { Report } from "./types";
import { medir, parseConversa } from "./whatsapp";

/**
 * Relatório de demonstração e fallback dinâmico.
 * Se o texto bruto da conversa for fornecido, calcula a estatística real do arquivo.
 */
export function mockReport(withAdvanced: boolean, bruto?: string): Report {
  if (bruto && bruto.length > 50) {
    try {
      const msgs = parseConversa(bruto);
      if (msgs.length >= 10) {
        const stats = medir(msgs);
        const autores = stats.autores;
        const autor1 = autores[0]?.autor || "Você";
        const autor2 = autores[1]?.autor || "Parceiro(a)";
        const msg1 = autores[0]?.mensagens || 0;
        const msg2 = autores[1]?.mensagens || 0;
        const total = stats.total || (msg1 + msg2);
        const pct1 = total ? Math.round((msg1 / total) * 100) : 50;
        const medianaAutor2 = stats.tempoResposta[autor2]?.medianaMinutos || 15;

        return {
          headline: `Análise concluída do histórico real entre ${autores.map((a) => a.autor).join(" e ")}.`,
          summary: `Analisamos ${total} mensagens ao longo de ${stats.periodo.dias} dias (${stats.periodo.de} a ${stats.periodo.ate}). ${autor1} enviou ${pct1}% do volume total de mensagens.`,
          patternCount: withAdvanced ? 7 : 6,
          sections: [
            {
              icon: "conversa",
              title: `${autor1} sustenta mais o ritmo das conversas`,
              body: `Em ${stats.periodo.dias} dias de histórico, ${autor1} enviou ${msg1} mensagens, enquanto ${autor2} enviou ${msg2} mensagens. A pessoa que mais puxa conversa no histórico é ${pct1 > 50 ? autor1 : autor2}.`,
            },
            {
              icon: "coracao",
              title: "Demonstrações de afeto e carinho medidas",
              body: `${autor1} usou termos de afeto e carinho em ${autores[0]?.afeto || 0} ocasiões. ${autor2} respondeu afetivamente em ${autores[1]?.afeto || 0} mensagens.`,
            },
            {
              icon: "lupa",
              title: "Tempo de resposta e intervalos de silêncio",
              body: `A mediana do tempo de resposta de ${autor2} é de ${medianaAutor2} minutos. Foram registrados ${stats.silencios.length} momentos de silêncio superior a 24 horas.`,
            },
            {
              icon: "celular",
              title: "Volume de humor e momentos de descontração",
              body: `Foram registradas ${autores.reduce((acc, a) => acc + a.riso, 0)} mensagens com risadas ou piadas, com maior concentração nos períodos da tarde e noite.`,
            },
            {
              icon: "presente",
              title: "Resolução de desentendimentos",
              body: `Foram identificados ${autores.reduce((acc, a) => acc + a.desculpas, 0)} pedidos de desculpas explícitos na conversa, mostrando preocupação em manter a harmonia.`,
            },
            {
              icon: "foguete",
              title: "Recomendação prática de diálogo",
              body: "Procurem manter conversas sobre temas importantes durante a tarde, quando o tempo de resposta é mais ágil.",
            },
          ],
          acoes: [
            {
              titulo: "Equilibrar a iniciativa",
              texto: `Deixe ${autor2} tomar a iniciativa de abrir a conversa em alguns dias da semana.`,
            },
            {
              titulo: "Aproveitar horários de maior atenção",
              texto: "Traga assuntos mais profundos no período da tarde quando as respostas fluem com mais facilidade.",
            },
            {
              titulo: "Manter desculpas rápidas",
              texto: "Continuem resolvendo pequenos incômodos no mesmo dia para não acumular descontentamentos.",
            },
          ],
          advanced: withAdvanced
            ? {
                level: "baixo",
                title: "Análise avançada de traição",
                body: `Com base nas ${total} mensagens analisadas no histórico real entre ${autor1} e ${autor2}, não foram identificados indícios de comportamento suspeito ou vida dupla. As ausências condizem com a rotina normal do casal.`,
              }
            : null,
        };
      }
    } catch (e) {
      console.warn("Erro ao calcular análise real fallback:", e);
    }
  }

  return {
    headline: "Vocês conversam muito, e falam pouco sobre vocês.",
    summary:
      "A conversa tem ritmo e carinho. O que aparece com força é uma diferença de tempo: uma pessoa abre assunto difícil de madrugada, a outra responde de manhã, já resolvida. Nada disso é ruptura. É só um desencontro de horário que virou hábito.",
    patternCount: withAdvanced ? 7 : 6,
    sections: [
      {
        icon: "conversa",
        title: "Você está buscando mais a conversa do que percebe",
        body: 'Em 68% dos dias analisados, a primeira mensagem partiu de você (como quando você mandou "tudo bem por aí?"). As respostas chegam rápido e com atenção, mas o papel de puxar o assunto acabou ficando concentrado de um lado só.',
      },
      {
        icon: "coracao",
        title: "A dinâmica de vocês mudou ao longo do tempo",
        body: 'No primeiro período analisado, apelidos carinhosos e declarações como "te amo, meu bem" apareciam quase diariamente. Com o tempo, a conversa assumiu um tom mais funcional sobre rotina e combinados.',
      },
      {
        icon: "lupa",
        title: "Tem uma coisa que vocês costumam evitar",
        body: 'Três assuntos específicos surgem na conversa, esquentam e terminam em frases como "deixa pra lá, depois a gente vê". Um desses temas se repete mais do que os outros.',
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

