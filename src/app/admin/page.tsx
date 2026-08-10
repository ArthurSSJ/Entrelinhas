'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('30d');
  const router = useRouter();

  const fetchData = async (selectedPeriod = period) => {
    setLoading(true);
    setError('');

    let startDate = new Date();
    const endDate = new Date().toISOString();

    if (selectedPeriod === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (selectedPeriod === '7d') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (selectedPeriod === '30d') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (selectedPeriod === 'month') {
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    } else if (selectedPeriod === 'all') {
      startDate = new Date('2025-01-01');
    }

    try {
      const res = await fetch(
        `/api/admin/analytics?startDate=${startDate.toISOString()}&endDate=${endDate}`
      );

      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Falha ao carregar dados do relatório.');
      }

      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Erro ao comunicar com a API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(period);
  }, [period]);

  const handleLogout = async () => {
    await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ action: 'logout' }),
    });
    router.push('/admin/login');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val || 0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      {/* Container Central com max-w-7xl */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER DO DASHBOARD */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-emerald-400 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Analytics Entrelinhas</h1>
                {data?.is_demo && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                    Modo Demonstração
                  </span>
                )}
                {!data?.is_demo && data && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Supabase Ao Vivo
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Dashboard executivo de funil e métricas financeiras
              </p>
            </div>
          </div>

          {/* Filtro de Período e Ações */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
              {[
                { id: 'today', label: 'Hoje' },
                { id: '7d', label: '7 Dias' },
                { id: '30d', label: '30 Dias' },
                { id: 'month', label: 'Este Mês' },
                { id: 'all', label: 'Tudo' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPeriod(item.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                    period === item.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchData(period)}
              disabled={loading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all text-xs font-semibold flex items-center gap-1.5"
              title="Atualizar dados"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl transition-all text-xs font-semibold"
            >
              Sair
            </button>
          </div>
        </header>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* SECÃO DE METRICAS FINANCEIRAS (CARDS KPI) */}
        {data && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Receita Total */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Receita Total</span>
                <span className="text-emerald-400 bg-emerald-500/10 p-1.5 rounded-lg">💰</span>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {formatCurrency(data.totals.revenue)}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Compras + Upsells + Downsells
              </p>
            </div>

            {/* Card 2: Ticket Médio (AOV) */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 hover:border-purple-500/30 transition-all">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Ticket Médio (AOV)</span>
                <span className="text-purple-400 bg-purple-500/10 p-1.5 rounded-lg">🏷️</span>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {formatCurrency(data.financials.avg_order_value)}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Receita / {data.totals.purchases} compras concluídas
              </p>
            </div>

            {/* Card 3: Receita por Visitante (RPV) */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 hover:border-blue-500/30 transition-all">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Receita / Visitante (RPV)</span>
                <span className="text-blue-400 bg-blue-500/10 p-1.5 rounded-lg">👥</span>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {formatCurrency(data.financials.revenue_per_visitor)}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Baseado em {data.totals.visitors} visitantes únicos
              </p>
            </div>

            {/* Card 4: Receita por Usuário no Quiz (RPQ) */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Receita / Início Quiz (RPQ)</span>
                <span className="text-amber-400 bg-amber-500/10 p-1.5 rounded-lg">🎯</span>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {formatCurrency(data.financials.revenue_per_quiz_starter)}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Baseado em {data.totals.quiz_starters} inícios de quiz
              </p>
            </div>
          </section>
        )}

        {/* FUNIL DE CONVERSÃO PRINCIPAL */}
        {data && (
          <section className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Funil Principais Etapas</h2>
                <p className="text-xs text-slate-400">Conversão passo a passo da jornada do visitante até a compra</p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Taxa Global: {data.totals.visitors > 0 ? ((data.totals.purchases / data.totals.visitors) * 100).toFixed(2) : 0}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              {[
                { label: 'Landing View', value: data.totals.visitors, rate: 100, color: 'from-blue-500 to-cyan-500' },
                { label: 'Quiz Iniciado', value: data.totals.quiz_starters, rate: data.funnel_rates.landing_to_quiz, color: 'from-cyan-500 to-teal-500', prevLabel: 'Landing → Quiz' },
                { label: 'Upload Iniciado', value: data.totals.upload_starters, rate: data.funnel_rates.quiz_to_upload, color: 'from-teal-500 to-emerald-500', prevLabel: 'Quiz → Upload' },
                { label: 'Análise Iniciada', value: data.totals.analysis_starters, rate: data.funnel_rates.upload_to_analysis, color: 'from-emerald-500 to-amber-500', prevLabel: 'Upload → Análise' },
                { label: 'Checkout Iniciado', value: data.totals.checkout_starters, rate: data.funnel_rates.analysis_to_checkout, color: 'from-amber-500 to-purple-500', prevLabel: 'Análise → Checkout' },
                { label: 'Compra Concluída', value: data.totals.purchases, rate: data.funnel_rates.checkout_to_purchase, color: 'from-purple-500 to-pink-500', prevLabel: 'Checkout → Compra' },
              ].map((step, idx) => (
                <div key={idx} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-3 relative group hover:border-slate-700 transition-all">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Etapa {idx + 1}</span>
                    <h3 className="text-sm font-semibold text-slate-200 mt-0.5">{step.label}</h3>
                    <div className="text-2xl font-black text-white mt-2">{step.value}</div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">{step.prevLabel || 'Penetração'}</span>
                      <span className="font-bold text-emerald-400">{step.rate}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${step.color} transition-all duration-500`}
                        style={{ width: `${Math.min(step.rate, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAXAS ESPECIAIS DE OFERTAS & EXIT INTENT */}
        {data && (
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Order Bump */}
            <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Order Bump</div>
              <div className="text-2xl font-bold text-white mb-1">
                {data.offer_rates.order_bump_rate}% <span className="text-xs text-slate-400 font-normal">adesão</span>
              </div>
              <p className="text-xs text-slate-500">
                {data.offer_rates.order_bump_selected} seleções no checkout
              </p>
            </div>

            {/* Upsell */}
            <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Conversão Upsell</div>
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {data.offer_rates.upsell_conversion_rate}%
              </div>
              <p className="text-xs text-slate-500">
                {data.offer_rates.upsell_accepted} aceitos / {data.offer_rates.upsell_declined} recusados
              </p>
            </div>

            {/* Downsell */}
            <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Conversão Downsell</div>
              <div className="text-2xl font-bold text-amber-400 mb-1">
                {data.offer_rates.downsell_conversion_rate}%
              </div>
              <p className="text-xs text-slate-500">
                {data.offer_rates.downsell_accepted} aceitos / {data.offer_rates.downsell_declined} recusados
              </p>
            </div>

            {/* Exit Intent */}
            <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Exit Intent</div>
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {data.offer_rates.exit_intent_shown > 0
                  ? ((data.offer_rates.exit_intent_converted / data.offer_rates.exit_intent_shown) * 100).toFixed(2)
                  : 0}%
              </div>
              <p className="text-xs text-slate-500">
                {data.offer_rates.exit_intent_converted} convertidos de {data.offer_rates.exit_intent_shown} exibidos
              </p>
            </div>
          </section>
        )}

        {/* TABELA DE TODOS OS 22 EVENTOS */}
        {data && data.event_counts && (
          <section className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Detalhamento dos 22 Eventos Rastreados</h2>
                <p className="text-xs text-slate-400">Frequência e visitantes únicos para cada ponto de contato</p>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                Total: {data.event_counts.length} eventos
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-6">Nome do Evento</th>
                    <th className="py-3.5 px-6">Total Disparos</th>
                    <th className="py-3.5 px-6">Visitantes Únicos</th>
                    <th className="py-3.5 px-6">% Penetração (Visitantes)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.event_counts.map((item: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-6 font-mono font-medium text-purple-300">
                        {item.event_name}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-white">
                        {item.total_count}
                      </td>
                      <td className="py-3.5 px-6 text-slate-300">
                        {item.unique_visitors}
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-emerald-400 w-12">{item.conversion_pct}%</span>
                          <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${Math.min(item.conversion_pct, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
