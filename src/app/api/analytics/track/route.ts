import { NextResponse } from 'next/server';
import { getSupabaseAdminClient, getSupabaseClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      event_name,
      visitor_id,
      session_id,
      user_id,
      page_url,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      device_type,
      browser,
      revenue_amount,
      metadata,
    } = body;

    if (!event_name || !visitor_id || !session_id) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes: event_name, visitor_id, session_id' },
        { status: 400 }
      );
    }

    // Tentar obter cliente Supabase Admin ou Público
    const supabase = getSupabaseAdminClient() || getSupabaseClient();

    if (!supabase) {
      // Se o Supabase ainda não estiver configurado no .env, registra em dev e retorna ok
      console.warn(
        `[Analytics Ingestion] Evento recebido '${event_name}', mas o Supabase não está configurado no .env.`
      );
      return NextResponse.json({ success: true, warning: 'Supabase não configurado' });
    }

    const { error } = await supabase.from('analytics_events').insert([
      {
        event_name,
        visitor_id,
        session_id,
        user_id: user_id || null,
        page_url: page_url || null,
        referrer: referrer || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_content: utm_content || null,
        utm_term: utm_term || null,
        device_type: device_type || null,
        browser: browser || null,
        revenue_amount: typeof revenue_amount === 'number' ? revenue_amount : 0,
        metadata: metadata || {},
      },
    ]);

    if (error) {
      console.error('[Analytics Ingestion] Erro ao inserir no Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Analytics Ingestion] Exceção na rota:', error);
    return NextResponse.json({ error: 'Erro interno ao processar evento' }, { status: 500 });
  }
}
