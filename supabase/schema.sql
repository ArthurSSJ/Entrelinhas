-- ==============================================================================
-- SCHEMA DE ANALYTICS & DASHBOARD ADMIN - ENTRELINHAS SUPABASE
-- Executar este script no SQL Editor do seu projeto Supabase
-- ==============================================================================

-- 1. Criar a Tabela de Eventos de Analytics
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    visitor_id VARCHAR(100) NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(100),
    page_url TEXT,
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    revenue_amount NUMERIC(12, 2) DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Índices para Otimização de Consultas Analíticas
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor_id ON public.analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name_created ON public.analytics_events(event_name, created_at);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Política de Inserção Pública (Permite registrar eventos sem login)
DROP POLICY IF EXISTS "Allow public insert for analytics_events" ON public.analytics_events;
CREATE POLICY "Allow public insert for analytics_events" 
    ON public.analytics_events 
    FOR INSERT 
    TO public 
    WITH CHECK (true);

-- Política de Leitura Apenas para Admin Autenticado ou Service Role
DROP POLICY IF EXISTS "Allow authenticated select for analytics_events" ON public.analytics_events;
CREATE POLICY "Allow authenticated select for analytics_events" 
    ON public.analytics_events 
    FOR SELECT 
    TO authenticated 
    USING (true);

DROP POLICY IF EXISTS "Allow service role full access for analytics_events" ON public.analytics_events;
CREATE POLICY "Allow service role full access for analytics_events" 
    ON public.analytics_events 
    FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

-- 4. Função RPC para Agregar Métricas do Dashboard em Tempo Real
CREATE OR REPLACE FUNCTION get_analytics_summary(
    p_start_date TIMESTAMPTZ DEFAULT (NOW() - INTERVAL '30 days'),
    p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_visitors INT;
    v_total_quiz_starters INT;
    v_total_upload_starters INT;
    v_total_analysis_starters INT;
    v_total_checkout_starters INT;
    v_total_purchases INT;
    
    v_total_revenue NUMERIC(12, 2);
    
    v_order_bump_selected INT;
    v_upsell_viewed INT;
    v_upsell_accepted INT;
    v_upsell_declined INT;
    v_downsell_viewed INT;
    v_downsell_accepted INT;
    v_downsell_declined INT;
    v_exit_intent_shown INT;
    v_exit_intent_converted INT;

    v_landing_to_quiz_rate NUMERIC(5, 2);
    v_quiz_to_upload_rate NUMERIC(5, 2);
    v_upload_to_analysis_rate NUMERIC(5, 2);
    v_analysis_to_checkout_rate NUMERIC(5, 2);
    v_checkout_to_purchase_rate NUMERIC(5, 2);
    v_order_bump_rate NUMERIC(5, 2);
    v_upsell_conversion_rate NUMERIC(5, 2);
    v_downsell_conversion_rate NUMERIC(5, 2);

    v_avg_order_value NUMERIC(12, 2);
    v_revenue_per_visitor NUMERIC(12, 2);
    v_revenue_per_quiz_starter NUMERIC(12, 2);

    v_event_counts JSONB;
    v_daily_trends JSONB;
    v_result JSONB;
BEGIN
    -- Obter contagem de visitantes únicos por etapa no período
    SELECT COUNT(DISTINCT visitor_id) INTO v_total_visitors 
    FROM public.analytics_events 
    WHERE event_name = 'landing_view' AND created_at BETWEEN p_start_date AND p_end_date;

    SELECT COUNT(DISTINCT visitor_id) INTO v_total_quiz_starters 
    FROM public.analytics_events 
    WHERE event_name = 'quiz_started' AND created_at BETWEEN p_start_date AND p_end_date;

    SELECT COUNT(DISTINCT visitor_id) INTO v_total_upload_starters 
    FROM public.analytics_events 
    WHERE event_name = 'upload_started' AND created_at BETWEEN p_start_date AND p_end_date;

    SELECT COUNT(DISTINCT visitor_id) INTO v_total_analysis_starters 
    FROM public.analytics_events 
    WHERE event_name = 'analysis_started' AND created_at BETWEEN p_start_date AND p_end_date;

    SELECT COUNT(DISTINCT visitor_id) INTO v_total_checkout_starters 
    FROM public.analytics_events 
    WHERE event_name = 'checkout_started' AND created_at BETWEEN p_start_date AND p_end_date;

    SELECT COUNT(DISTINCT visitor_id) INTO v_total_purchases 
    FROM public.analytics_events 
    WHERE event_name = 'purchase_completed' AND created_at BETWEEN p_start_date AND p_end_date;

    -- Obter Receita Total no período
    SELECT COALESCE(SUM(revenue_amount), 0) INTO v_total_revenue
    FROM public.analytics_events
    WHERE event_name IN ('purchase_completed', 'upsell_accepted', 'downsell_accepted')
      AND created_at BETWEEN p_start_date AND p_end_date;

    -- Obter contagens específicas para ofertas e exit intent
    SELECT COUNT(DISTINCT visitor_id) INTO v_order_bump_selected
    FROM public.analytics_events WHERE event_name = 'order_bump_selected' AND created_at BETWEEN p_start_date AND p_end_date;

    SELECT COUNT(DISTINCT visitor_id) INTO v_upsell_viewed
    FROM public.analytics_events WHERE event_name = 'upsell_viewed' AND created_at BETWEEN p_start_date AND p_end_date;

    SELECT COUNT(DISTINCT visitor_id) INTO v_upsell_accepted
    FROM public.analytics_events WHERE event_name = 'upsell_accepted' AND created_at BETWEEN p_start_date AND p_end_date;

    SELECT COUNT(DISTINCT visitor_id) INTO v_upsell_declined
    FROM public.analytics_events WHERE event_name = 'upsell_declined' AND created_at BETWEEN p_start_date AND p_end_date;

    SELECT COUNT(DISTINCT visitor_id) INTO v_downsell_viewed
    FROM public.analytics_events WHERE event_name = 'downsell_viewed' AND created_at BETWEEN p_start_date AND p_end_date;

    SELECT COUNT(DISTINCT visitor_id) INTO v_downsell_accepted
    FROM public.analytics_events WHERE event_name = 'downsell_accepted' AND created_at BETWEEN p_start_date AND p_end_date;

    SELECT COUNT(DISTINCT visitor_id) INTO v_downsell_declined
    FROM public.analytics_events WHERE event_name = 'downsell_declined' AND created_at BETWEEN p_start_date AND p_end_date;

    SELECT COUNT(DISTINCT visitor_id) INTO v_exit_intent_shown
    FROM public.analytics_events WHERE event_name = 'exit_intent_shown' AND created_at BETWEEN p_start_date AND p_end_date;

    SELECT COUNT(DISTINCT visitor_id) INTO v_exit_intent_converted
    FROM public.analytics_events WHERE event_name = 'exit_intent_converted' AND created_at BETWEEN p_start_date AND p_end_date;

    -- Calcular Taxas de Conversão (%)
    v_landing_to_quiz_rate := CASE WHEN v_total_visitors > 0 THEN ROUND((v_total_quiz_starters::NUMERIC / v_total_visitors::NUMERIC) * 100, 2) ELSE 0 END;
    v_quiz_to_upload_rate := CASE WHEN v_total_quiz_starters > 0 THEN ROUND((v_total_upload_starters::NUMERIC / v_total_quiz_starters::NUMERIC) * 100, 2) ELSE 0 END;
    v_upload_to_analysis_rate := CASE WHEN v_total_upload_starters > 0 THEN ROUND((v_total_analysis_starters::NUMERIC / v_total_upload_starters::NUMERIC) * 100, 2) ELSE 0 END;
    v_analysis_to_checkout_rate := CASE WHEN v_total_analysis_starters > 0 THEN ROUND((v_total_checkout_starters::NUMERIC / v_total_analysis_starters::NUMERIC) * 100, 2) ELSE 0 END;
    v_checkout_to_purchase_rate := CASE WHEN v_total_checkout_starters > 0 THEN ROUND((v_total_purchases::NUMERIC / v_total_checkout_starters::NUMERIC) * 100, 2) ELSE 0 END;
    
    v_order_bump_rate := CASE WHEN v_total_checkout_starters > 0 THEN ROUND((v_order_bump_selected::NUMERIC / v_total_checkout_starters::NUMERIC) * 100, 2) ELSE 0 END;
    v_upsell_conversion_rate := CASE WHEN v_upsell_viewed > 0 THEN ROUND((v_upsell_accepted::NUMERIC / v_upsell_viewed::NUMERIC) * 100, 2) ELSE 0 END;
    v_downsell_conversion_rate := CASE WHEN v_downsell_viewed > 0 THEN ROUND((v_downsell_accepted::NUMERIC / v_downsell_viewed::NUMERIC) * 100, 2) ELSE 0 END;

    -- Calcular Métricas Financeiras
    v_avg_order_value := CASE WHEN v_total_purchases > 0 THEN ROUND((v_total_revenue / v_total_purchases::NUMERIC), 2) ELSE 0 END;
    v_revenue_per_visitor := CASE WHEN v_total_visitors > 0 THEN ROUND((v_total_revenue / v_total_visitors::NUMERIC), 2) ELSE 0 END;
    v_revenue_per_quiz_starter := CASE WHEN v_total_quiz_starters > 0 THEN ROUND((v_total_revenue / v_total_quiz_starters::NUMERIC), 2) ELSE 0 END;

    -- Agrupar contagem de todos os 22 eventos com visitantes únicos
    SELECT JSONB_AGG(
        JSONB_BUILD_OBJECT(
            'event_name', e.event_name,
            'total_count', e.total_count,
            'unique_visitors', e.unique_visitors,
            'conversion_pct', CASE WHEN v_total_visitors > 0 THEN ROUND((e.unique_visitors::NUMERIC / v_total_visitors::NUMERIC) * 100, 2) ELSE 0 END
        ) ORDER BY e.total_count DESC
    ) INTO v_event_counts
    FROM (
        SELECT 
            event_name,
            COUNT(*) AS total_count,
            COUNT(DISTINCT visitor_id) AS unique_visitors
        FROM public.analytics_events
        WHERE created_at BETWEEN p_start_date AND p_end_date
        GROUP BY event_name
    ) e;

    -- Agrupar dados diários para gráfico de tendência
    SELECT JSONB_AGG(
        JSONB_BUILD_OBJECT(
            'date', TO_CHAR(d.day, 'YYYY-MM-DD'),
            'landing_views', COALESCE(ev.landing_views, 0),
            'quiz_starts', COALESCE(ev.quiz_starts, 0),
            'purchases', COALESCE(ev.purchases, 0),
            'revenue', COALESCE(ev.revenue, 0)
        ) ORDER BY d.day ASC
    ) INTO v_daily_trends
    FROM (
        SELECT GENERATE_SERIES(
            DATE_TRUNC('day', p_start_date),
            DATE_TRUNC('day', p_end_date),
            INTERVAL '1 day'
        )::DATE AS day
    ) d
    LEFT JOIN (
        SELECT 
            DATE_TRUNC('day', created_at)::DATE AS day,
            COUNT(*) FILTER (WHERE event_name = 'landing_view') AS landing_views,
            COUNT(*) FILTER (WHERE event_name = 'quiz_started') AS quiz_starts,
            COUNT(*) FILTER (WHERE event_name = 'purchase_completed') AS purchases,
            SUM(revenue_amount) FILTER (WHERE event_name IN ('purchase_completed', 'upsell_accepted', 'downsell_accepted')) AS revenue
        FROM public.analytics_events
        WHERE created_at BETWEEN p_start_date AND p_end_date
        GROUP BY DATE_TRUNC('day', created_at)::DATE
    ) ev ON d.day = ev.day;

    -- Montar JSONB Final
    v_result := JSONB_BUILD_OBJECT(
        'totals', JSONB_BUILD_OBJECT(
            'visitors', COALESCE(v_total_visitors, 0),
            'quiz_starters', COALESCE(v_total_quiz_starters, 0),
            'upload_starters', COALESCE(v_total_upload_starters, 0),
            'analysis_starters', COALESCE(v_total_analysis_starters, 0),
            'checkout_starters', COALESCE(v_total_checkout_starters, 0),
            'purchases', COALESCE(v_total_purchases, 0),
            'revenue', COALESCE(v_total_revenue, 0)
        ),
        'funnel_rates', JSONB_BUILD_OBJECT(
            'landing_to_quiz', COALESCE(v_landing_to_quiz_rate, 0),
            'quiz_to_upload', COALESCE(v_quiz_to_upload_rate, 0),
            'upload_to_analysis', COALESCE(v_upload_to_analysis_rate, 0),
            'analysis_to_checkout', COALESCE(v_analysis_to_checkout_rate, 0),
            'checkout_to_purchase', COALESCE(v_checkout_to_purchase_rate, 0)
        ),
        'offer_rates', JSONB_BUILD_OBJECT(
            'order_bump_selected', COALESCE(v_order_bump_selected, 0),
            'order_bump_rate', COALESCE(v_order_bump_rate, 0),
            'upsell_viewed', COALESCE(v_upsell_viewed, 0),
            'upsell_accepted', COALESCE(v_upsell_accepted, 0),
            'upsell_declined', COALESCE(v_upsell_declined, 0),
            'upsell_conversion_rate', COALESCE(v_upsell_conversion_rate, 0),
            'downsell_viewed', COALESCE(v_downsell_viewed, 0),
            'downsell_accepted', COALESCE(v_downsell_accepted, 0),
            'downsell_declined', COALESCE(v_downsell_declined, 0),
            'downsell_conversion_rate', COALESCE(v_downsell_conversion_rate, 0),
            'exit_intent_shown', COALESCE(v_exit_intent_shown, 0),
            'exit_intent_converted', COALESCE(v_exit_intent_converted, 0)
        ),
        'financials', JSONB_BUILD_OBJECT(
            'avg_order_value', COALESCE(v_avg_order_value, 0),
            'revenue_per_visitor', COALESCE(v_revenue_per_visitor, 0),
            'revenue_per_quiz_starter', COALESCE(v_revenue_per_quiz_starter, 0)
        ),
        'event_counts', COALESCE(v_event_counts, '[]'::jsonb),
        'daily_trends', COALESCE(v_daily_trends, '[]'::jsonb)
    );

    RETURN v_result;
END;
$$;
