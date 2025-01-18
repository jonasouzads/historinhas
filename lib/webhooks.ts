type WebhookEventType = 
  | 'user_created'
  | 'password_reset'
  | 'subscription_created'
  | 'subscription_updated'
  | 'subscription_canceled';

interface WebhookData {
  id?: string;
  email?: string;
  phone?: string | null;
  full_name?: string;
  created_at?: string;
  subscription_id?: string;
  customer_id?: string;
  plan_id?: string;
  [key: string]: unknown;
}

interface WebhookResponse {
  success: boolean;
  message?: string;
  error?: Error;
}

interface WebhookPayload {
  event: WebhookEventType;
  timestamp: string;
  data: WebhookData;
}

export async function sendWebhook(
  event: string,
  data: WebhookData
): Promise<WebhookResponse> {
  try {
    const webhookUrl = process.env.EXTERNAL_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error('EXTERNAL_WEBHOOK_URL não configurada');
    }

    const payload: WebhookPayload = {
      event: event as WebhookEventType,
      timestamp: new Date().toISOString(),
      data,
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'ebookloove',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar webhook: ${response.statusText}`);
    }

    console.log('Webhook enviado com sucesso:', event);
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    };
  }
}
