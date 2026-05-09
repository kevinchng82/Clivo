import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return new NextResponse('Missing signature', { status: 400 })

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) return new NextResponse('Webhook not configured', { status: 500 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Stripe webhook constructEvent failed:', err)
    return new NextResponse('Webhook signature invalid', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const clinicId = session.metadata?.clinicId
    if (clinicId) {
      const { error } = await supabase
        .from('clinics')
        .update({
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          subscription_status: 'active',
        })
        .eq('id', clinicId)
      if (error) console.error('Failed to activate clinic:', error)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const { error } = await supabase
      .from('clinics')
      .update({ subscription_status: 'cancelled' })
      .eq('stripe_subscription_id', sub.id)
    if (error) console.error('Failed to cancel clinic:', error)
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const subId = (invoice.parent as { subscription_details?: { subscription?: string } } | null)
      ?.subscription_details?.subscription
    if (subId) {
      const { error } = await supabase
        .from('clinics')
        .update({ subscription_status: 'past_due' })
        .eq('stripe_subscription_id', subId)
      if (error) console.error('Failed to mark clinic past_due:', error)
    }
  }

  return NextResponse.json({ received: true })
}
