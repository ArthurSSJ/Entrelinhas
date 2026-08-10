import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdminClient, getSupabaseClient } from '@/lib/supabase';

// Dados demonstrativos padrão quando o Supabase ainda não estiver populado
function getMockAnalyticsData() {
  return {
    totals: {
      visitors: 1240,
      quiz_starters: 868,
      upload_starters: 607,
      analysis_starters: 546,
      checkout_starters: 382,
      purchases: 191,
      revenue: 4373.9,
    },
    funnel_rates: {
      landing_to_quiz: 70.0,
      quiz_to_upload: 69.93,
      upload_to_analysis: 89.95,
      analysis_to_checkout: 69.96,
      checkout_to_purchase: 50.0,
    },
    offer_rates: {
      order_bump_selected: 86,
      order_bump_rate: 22.51,
      upsell_viewed: 191,
      upsell_accepted: 48,
      upsell_declined: 143,
      upsell_conversion_rate: 25.13,
      downsell_viewed: 143,
      downsell_accepted: 29,
      downsell_declined: 114,
      downsell_conversion_rate: 20.28,
      exit_intent_shown: 310,
      exit_intent_converted: 62,
    },
    financials: {
      avg_order_value: 22.9,
      revenue_per_visitor: 3.53,
      revenue_per_quiz_starter: 5.04,
    },
    event_counts: [
      { event_name: 'landing_view', total_count: 1540, unique_visitors: 1240, conversion_pct: 100 },
      { event_name: 'cta_clicked', total_count: 1100, unique_visitors: 950, conversion_pct: 76.61 },
      { event_name: 'quiz_started', total_count: 980, unique_visitors: 868, conversion_pct: 70.0 },
      { event_name: 'quiz_completed', total_count: 750, unique_visitors: 680, conversion_pct: 54.84 },
      { event_name: 'upload_started', total_count: 650, unique_visitors: 607, conversion_pct: 48.95 },
      { event_name: 'upload_completed', total_count: 590, unique_visitors: 550, conversion_pct: 44.35 },
      { event_name: 'analysis_started', total_count: 580, unique_visitors: 546, conversion_pct: 44.03 },
      { event_name: 'analysis_completed', total_count: 575, unique_visitors: 542, conversion_pct: 43.71 },
      { event_name: 'preview_viewed', total_count: 520, unique_visitors: 490, conversion_pct: 39.52 },
      { event_name: 'checkout_viewed', total_count: 420, unique_visitors: 400, conversion_pct: 32.26 },
      { event_name: 'checkout_started', total_count: 400, unique_visitors: 382, conversion_pct: 30.81 },
      { event_name: 'order_bump_selected', total_count: 95, unique_visitors: 86, conversion_pct: 6.94 },
      { event_name: 'purchase_started', total_count: 230, unique_visitors: 210, conversion_pct: 16.94 },
      { event_name: 'purchase_completed', total_count: 200, unique_visitors: 191, conversion_pct: 15.4 },
      { event_name: 'upsell_viewed', total_count: 200, unique_visitors: 191, conversion_pct: 15.4 },
      { event_name: 'upsell_accepted', total_count: 50, unique_visitors: 48, conversion_pct: 3.87 },
      { event_name: 'upsell_declined', total_count: 150, unique_visitors: 143, conversion_pct: 11.53 },
      { event_name: 'downsell_viewed', total_count: 150, unique_visitors: 143, conversion_pct: 11.53 },
      { event_name: 'downsell_accepted', total_count: 30, unique_visitors: 29, conversion_pct: 2.34 },
      { event_name: 'downsell_declined', total_count: 120, unique_visitors: 114, conversion_pct: 9.19 },
      { event_name: 'exit_intent_shown', total_count: 350, unique_visitors: 310, conversion_pct: 25.0 },
      { event_name: 'exit_intent_converted', total_count: 68, unique_visitors: 62, conversion_pct: 5.0 },
    ],
    daily_trends: [
      { date: '2026-08-03', landing_views: 150, quiz_starts: 105, purchases: 22, revenue: 503.8 },
      { date: '2026-08-04', landing_views: 170, quiz_starts: 120, purchases: 26, revenue: 595.4 },
      { date: '2026-08-05', landing_views: 190, quiz_starts: 133, purchases: 29, revenue: 664.1 },
      { date: '2026-08-06', landing_views: 210, quiz_starts: 147, purchases: 32, revenue: 732.8 },
      { date: '2026-08-07', landing_views: 230, quiz_starts: 161, purchases: 35, revenue: 801.5 },
      { date: '2026-08-08', landing_views: 160, quiz_starts: 112, purchases: 24, revenue: 549.6 },
      { date: '2026-08-09', landing_views: 130, quiz_starts: 90, purchases: 23, revenue: 526.7 },
    ],
    is_demo: true,
  };
}

export async function GET(req: Request) {
  try {
    // 1. Verificar Cookie de Sessão Admin
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('entrelinhas_admin_session')?.value;

    if (!adminSession) {
      return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
    }

    // 2. Extrair parâmetros de data
    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const startDate = startDateParam
      ? new Date(startDateParam).toISOString()
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = endDateParam ? new Date(endDateParam).toISOString() : new Date().toISOString();

    // 3. Tentar buscar dados reais do Supabase
    const supabase = getSupabaseAdminClient() || getSupabaseClient();

    if (!supabase) {
      return NextResponse.json({ ...getMockAnalyticsData(), is_demo: true });
    }

    // Chamar função de agregação Postgres RPC get_analytics_summary
    const { data, error } = await supabase.rpc('get_analytics_summary', {
      p_start_date: startDate,
      p_end_date: endDate,
    });

    if (error || !data || !data.totals) {
      console.warn(
        '[Admin Analytics API] Supabase RPC não retornou dados ou tabela ainda não criada. Retornando exibição padrão.',
        error
      );
      return NextResponse.json({ ...getMockAnalyticsData(), is_demo: true });
    }

    return NextResponse.json({ ...data, is_demo: false });
  } catch (error: any) {
    console.error('[Admin Analytics API] Exceção:', error);
    return NextResponse.json({ error: 'Erro ao carregar dados de analytics' }, { status: 500 });
  }
}
