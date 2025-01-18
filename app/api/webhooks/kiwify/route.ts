import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendWebhook } from '@/lib/webhooks';

const WEBHOOK_SECRET = process.env.KIWIFY_WEBHOOK_SECRET || '';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

interface KiwifyWebhookData {
  url: string;
  signature: string;
  order: {
    webhook_event_type: string;
    order_id: string;
    subscription_id: string;
    order_status: string;
    approved_date: string | null;
    payment_method: string;
    installments?: number;
    Customer: {
      email: string;
      full_name: string;
      mobile: string;
    };
    Product: {
      product_id: string;
      product_name: string;
    };
    Subscription?: {
      start_date: string;
      next_payment: string;
      status: string;
      plan: {
        id: string;
        name: string;
        frequency: string;
        qty_charges: number;
      };
    };
    Commissions: {
      currency: string;
      charge_amount: number;
      kiwify_fee: number;
      my_commission: number;
      commissioned_stores: Array<{
        id: string;
        type: string;
        value: string;
        email: string;
        custom_name: string;
      }>;
    };
  };
}

// Tipos de eventos do webhook
type WebhookEventType = 
  | 'billet_created'
  | 'pix_created'
  | 'order_rejected'
  | 'order_approved'
  | 'order_refunded'
  | 'chargeback'
  | 'subscription_canceled'
  | 'subscription_late'
  | 'subscription_renewed';

// Função para validar a assinatura do webhook
function validateWebhookSignature(payload: KiwifyWebhookData['order'], signature: string): boolean {
  const calculatedSignature = crypto
    .createHmac('sha1', WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === calculatedSignature;
}

// Função para determinar o tipo de plano
function getPlanType(productName: string): 'magic' | 'family' {
  const normalizedName = productName.trim().toLowerCase();
  if (normalizedName === 'plano mágico') return 'magic';
  if (normalizedName === 'plano família') return 'family';
  return 'magic';
}

export async function HEAD() {
  // Responder requisições HEAD conforme documentação
  return new NextResponse(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request: Request) {
  try {
    // Obter o payload do webhook
    const rawBody = await request.text();
    const payload: KiwifyWebhookData = JSON.parse(rawBody);

    // Em desenvolvimento, podemos pular a validação da assinatura
    if (!IS_DEVELOPMENT) {
      if (!payload.signature) {
        return new NextResponse(
          JSON.stringify({ error: 'Assinatura não fornecida' }), 
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validar a assinatura usando o corpo raw conforme documentação
      if (!validateWebhookSignature(payload.order, payload.signature)) {
        return new NextResponse(
          JSON.stringify({ error: 'Assinatura inválida' }), 
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Inicializar o cliente Supabase
    const supabase = createRouteHandlerClient({ cookies });

    // Processar diferentes eventos do webhook
    const eventType = payload.order.webhook_event_type as WebhookEventType;

    console.log('Processando evento:', eventType, {
      order_id: payload.order.order_id,
      subscription_id: payload.order.subscription_id,
      status: payload.order.order_status
    });

    switch (eventType) {
      case 'order_approved': {
        // Verificar se o status do pedido é paid
        if (payload.order.order_status !== 'paid') {
          console.log('Pedido não está pago:', payload.order.order_status);
          break;
        }

        const {
          order_id,
          subscription_id,
          Customer: { email, full_name, mobile },
          Product: { product_name },
          Subscription,
        } = payload.order;

        // Usar a data de início da assinatura se disponível, senão usar approved_date ou data atual
        const startDate = Subscription?.start_date 
          ? new Date(Subscription.start_date)
          : payload.order.approved_date 
            ? new Date(payload.order.approved_date)
            : new Date();

        // Usar a próxima data de pagamento como data final se disponível
        const endDate = Subscription?.next_payment
          ? new Date(Subscription.next_payment)
          : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias

        // Verificar se o usuário já existe
        let { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .single();

        // Se o usuário não existir, criar um novo
        if (!user) {
          const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
            email,
            password: crypto.randomBytes(20).toString('hex'),
            options: {
              data: {
                full_name,
                phone: mobile || null
              }
            }
          });

          if (signUpError) throw signUpError;
          user = { id: newUser?.id };
        }

        // Criar ou atualizar a assinatura
        const planType = getPlanType(product_name);

        await supabase
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            kiwify_order_id: order_id,
            kiwify_subscription_id: subscription_id,
            plan_type: planType,
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
          });

        // Enviar webhook com os dados da assinatura
        await sendWebhook('subscription_created', {
          user_id: user.id,
          email,
          full_name,
          phone: mobile,
          subscription: {
            order_id,
            subscription_id,
            plan_type: planType,
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
          },
          payment: {
            method: payload.order.payment_method,
            installments: payload.order.installments,
            currency: payload.order.Commissions.currency,
            amount: payload.order.Commissions.charge_amount,
          }
        });

        break;
      }

      case 'order_refunded':
      case 'chargeback':
      case 'subscription_canceled': {
        // Todos esses eventos cancelam a assinatura
        const { order_id, subscription_id, Customer: { email, full_name, mobile } } = payload.order;

        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .match(subscription_id 
            ? { kiwify_subscription_id: subscription_id }
            : { kiwify_order_id: order_id }
          );

        // Enviar webhook de cancelamento
        await sendWebhook('subscription_canceled', {
          order_id,
          subscription_id,
          email,
          full_name,
          phone: mobile,
          reason: eventType
        });

        break;
      }

      case 'subscription_renewed': {
        const { subscription_id, approved_date } = payload.order;

        if (subscription_id && approved_date) {
          const startDate = new Date(approved_date);
          const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias

          await supabase
            .from('subscriptions')
            .update({
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
              status: 'active'
            })
            .eq('kiwify_subscription_id', subscription_id);
        }

        break;
      }

      case 'subscription_late': {
        const { subscription_id } = payload.order;

        if (subscription_id) {
          await supabase
            .from('subscriptions')
            .update({ status: 'late' })
            .eq('kiwify_subscription_id', subscription_id);
        }

        break;
      }

      // Outros eventos que podemos logar mas não precisamos processar
      case 'billet_created':
      case 'pix_created':
      case 'order_rejected':
        console.log(`Evento ${eventType} recebido:`, payload);
        break;
    }

    // Retornar sucesso conforme documentação
    return new NextResponse(
      JSON.stringify({ status: 'ok' }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro no webhook:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Erro interno do servidor', details: error }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
