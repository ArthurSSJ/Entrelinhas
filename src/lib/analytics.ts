/**
 * Entrelinhas Analytics SDK
 * Rastreamento resiliente de eventos de funil e métricas de conversão.
 */

export type AnalyticsEventName =
  | 'landing_view'
  | 'cta_clicked'
  | 'quiz_started'
  | 'quiz_completed'
  | 'upload_started'
  | 'upload_completed'
  | 'analysis_started'
  | 'analysis_completed'
  | 'preview_viewed'
  | 'checkout_viewed'
  | 'checkout_started'
  | 'order_bump_selected'
  | 'purchase_started'
  | 'purchase_completed'
  | 'upsell_viewed'
  | 'upsell_accepted'
  | 'upsell_declined'
  | 'downsell_viewed'
  | 'downsell_accepted'
  | 'downsell_declined'
  | 'exit_intent_shown'
  | 'exit_intent_converted';

export interface EventPayload {
  user_id?: string;
  revenue_amount?: number; // Valor em reais ou centavos
  metadata?: Record<string, any>;
  page_url?: string;
  referrer?: string;
}

// Chaves para cookies / storage
const VISITOR_COOKIE = 'entrelinhas_vid';
const SESSION_COOKIE = 'entrelinhas_sid';

/**
 * Auxiliar para gerar ID único v4 simples
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Obtém ou cria o Visitor ID único persistente
 */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';

  try {
    let vid = localStorage.getItem(VISITOR_COOKIE);
    if (!vid) {
      vid = generateUUID();
      localStorage.setItem(VISITOR_COOKIE, vid);
    }
    return vid;
  } catch {
    return 'anon_visitor';
  }
}

/**
 * Obtém ou cria o Session ID para a visita atual
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  try {
    let sid = sessionStorage.getItem(SESSION_COOKIE);
    if (!sid) {
      sid = generateUUID();
      sessionStorage.setItem(SESSION_COOKIE, sid);
    }
    return sid;
  } catch {
    return 'anon_session';
  }
}

/**
 * Extrai parâmetros UTM da URL atual
 */
export function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const searchParams = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((param) => {
    const val = searchParams.get(param);
    if (val) utms[param] = val;
  });

  return utms;
}

/**
 * Detecta tipo de dispositivo
 */
export function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';

  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Função principal para disparar qualquer um dos 22 eventos
 */
export async function trackEvent(
  eventName: AnalyticsEventName,
  payload: EventPayload = {}
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const utms = getUtmParams();
    const visitor_id = getVisitorId();
    const session_id = getSessionId();
    const device_type = getDeviceType();

    const data = {
      event_name: eventName,
      visitor_id,
      session_id,
      user_id: payload.user_id,
      page_url: payload.page_url || window.location.href,
      referrer: payload.referrer || document.referrer || '',
      utm_source: utms.utm_source || '',
      utm_medium: utms.utm_medium || '',
      utm_campaign: utms.utm_campaign || '',
      utm_content: utms.utm_content || '',
      utm_term: utms.utm_term || '',
      device_type,
      browser: navigator.userAgent.split(' ')[0] || 'Unknown',
      revenue_amount: payload.revenue_amount || 0,
      metadata: payload.metadata || {},
    };

    // Dispara via fetch para o endpoint API local
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    });

    return response.ok;
  } catch (error) {
    console.error(`[Analytics] Erro ao registrar evento ${eventName}:`, error);
    return false;
  }
}

// ==============================================================================
// HELPERS CONVENIENTES PARA OS 22 EVENTOS REQUERIDOS
// ==============================================================================

export const trackLandingView = (metadata?: Record<string, any>) =>
  trackEvent('landing_view', { metadata });

export const trackCtaClicked = (ctaLabel: string, metadata?: Record<string, any>) =>
  trackEvent('cta_clicked', { metadata: { cta_label: ctaLabel, ...metadata } });

export const trackQuizStarted = (metadata?: Record<string, any>) =>
  trackEvent('quiz_started', { metadata });

export const trackQuizCompleted = (answersCount: number, metadata?: Record<string, any>) =>
  trackEvent('quiz_completed', { metadata: { answers_count: answersCount, ...metadata } });

export const trackUploadStarted = (fileType?: string, metadata?: Record<string, any>) =>
  trackEvent('upload_started', { metadata: { file_type: fileType, ...metadata } });

export const trackUploadCompleted = (fileSize?: number, metadata?: Record<string, any>) =>
  trackEvent('upload_completed', { metadata: { file_size: fileSize, ...metadata } });

export const trackAnalysisStarted = (analysisId?: string, metadata?: Record<string, any>) =>
  trackEvent('analysis_started', { metadata: { analysis_id: analysisId, ...metadata } });

export const trackAnalysisCompleted = (analysisId?: string, metadata?: Record<string, any>) =>
  trackEvent('analysis_completed', { metadata: { analysis_id: analysisId, ...metadata } });

export const trackPreviewViewed = (analysisId?: string, metadata?: Record<string, any>) =>
  trackEvent('preview_viewed', { metadata: { analysis_id: analysisId, ...metadata } });

export const trackCheckoutViewed = (planName?: string, metadata?: Record<string, any>) =>
  trackEvent('checkout_viewed', { metadata: { plan_name: planName, ...metadata } });

export const trackCheckoutStarted = (planName?: string, price?: number, metadata?: Record<string, any>) =>
  trackEvent('checkout_started', { revenue_amount: price, metadata: { plan_name: planName, ...metadata } });

export const trackOrderBumpSelected = (selected: boolean, bumpPrice?: number, metadata?: Record<string, any>) =>
  trackEvent('order_bump_selected', {
    revenue_amount: selected ? bumpPrice : 0,
    metadata: { selected, bump_price: bumpPrice, ...metadata },
  });

export const trackPurchaseStarted = (orderId?: string, amount?: number, metadata?: Record<string, any>) =>
  trackEvent('purchase_started', { revenue_amount: amount, metadata: { order_id: orderId, ...metadata } });

export const trackPurchaseCompleted = (orderId?: string, amount?: number, metadata?: Record<string, any>) =>
  trackEvent('purchase_completed', { revenue_amount: amount, metadata: { order_id: orderId, ...metadata } });

export const trackUpsellViewed = (offerName?: string, metadata?: Record<string, any>) =>
  trackEvent('upsell_viewed', { metadata: { offer_name: offerName, ...metadata } });

export const trackUpsellAccepted = (offerName?: string, amount?: number, metadata?: Record<string, any>) =>
  trackEvent('upsell_accepted', { revenue_amount: amount, metadata: { offer_name: offerName, ...metadata } });

export const trackUpsellDeclined = (offerName?: string, metadata?: Record<string, any>) =>
  trackEvent('upsell_declined', { metadata: { offer_name: offerName, ...metadata } });

export const trackDownsellViewed = (offerName?: string, metadata?: Record<string, any>) =>
  trackEvent('downsell_viewed', { metadata: { offer_name: offerName, ...metadata } });

export const trackDownsellAccepted = (offerName?: string, amount?: number, metadata?: Record<string, any>) =>
  trackEvent('downsell_accepted', { revenue_amount: amount, metadata: { offer_name: offerName, ...metadata } });

export const trackDownsellDeclined = (offerName?: string, metadata?: Record<string, any>) =>
  trackEvent('downsell_declined', { metadata: { offer_name: offerName, ...metadata } });

export const trackExitIntentShown = (page?: string, metadata?: Record<string, any>) =>
  trackEvent('exit_intent_shown', { metadata: { page, ...metadata } });

export const trackExitIntentConverted = (actionTaken?: string, metadata?: Record<string, any>) =>
  trackEvent('exit_intent_converted', { metadata: { action_taken: actionTaken, ...metadata } });
