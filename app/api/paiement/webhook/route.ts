import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyTransaction } from '@/lib/kkiapay'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { sendEmail, getOrderConfirmationEmail } from '@/lib/email'
import { formatPrice } from '@/lib/utils'
import { checkRateLimit, getClientIP, RATE_LIMIT_WEBHOOK } from '@/lib/rate-limit'

// POST /api/paiement/webhook - Webhook KKiaPay
export async function POST(request: NextRequest) {
  try {
    // SECURITE : Rate limiting — max 30 webhooks par minute par IP
    const clientIP = getClientIP(request)
    if (!checkRateLimit(clientIP, 'webhook', RATE_LIMIT_WEBHOOK)) {
      console.warn(`SECURITE: Rate limit webhook depasse pour IP ${clientIP}`)
      return NextResponse.json(
        { error: 'Trop de requetes' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { transactionId, data: orderId } = body

    console.log('KKiaPay webhook received:', { transactionId, orderId })

    if (!transactionId || !orderId) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }

    // Vérifier la transaction auprès de KKiaPay
    const transaction = await verifyTransaction(transactionId)

    if (!transaction) {
      console.error('Transaction verification failed')
      return NextResponse.json(
        { error: 'Impossible de vérifier la transaction' },
        { status: 400 }
      )
    }

    if (transaction.status !== 'SUCCESS') {
      console.log('Transaction not successful:', transaction.status)
      return NextResponse.json(
        { error: 'Transaction non réussie', status: transaction.status },
        { status: 400 }
      )
    }

    // Récupérer la commande
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      console.error('Order not found:', orderId)
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // SECURITE : Verifier que la commande est bien en attente de paiement
    if (order.status !== 'PENDING') {
      console.warn(
        `SECURITE: Tentative de re-confirmation commande ${order.orderNumber} (statut actuel: ${order.status})`
      )
      return NextResponse.json(
        { error: 'Commande deja traitee' },
        { status: 400 }
      )
    }

    // SECURITE : Verifier que le montant paye correspond au montant attendu
    const expectedAmount = order.isSplitPayment && order.splitFirstAmount
      ? order.splitFirstAmount
      : order.total

    if (transaction.amount !== expectedAmount) {
      console.error(
        `SECURITE FRAUDE: Montant transaction (${transaction.amount} FCFA) != montant attendu (${expectedAmount} FCFA) pour commande ${order.orderNumber}`
      )
      return NextResponse.json(
        { error: 'Montant de la transaction incorrect' },
        { status: 400 }
      )
    }

    // Mettre à jour la commande
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CONFIRMED',
        paymentRef: transactionId,
        paidAt: new Date(),
      },
    })

    // Envoyer confirmation WhatsApp au client
    const productsList = order.items
      .map((item) => `${item.quantity}x ${item.product.name}`)
      .join(', ')

    await sendWhatsAppMessage(order.phone, 'order_confirmation', {
      name: order.customerName.split(' ')[0],
      orderNumber: order.orderNumber,
      products: productsList,
      total: formatPrice(order.total),
      address: order.address,
      quarter: order.quarter,
    })

    // Envoyer email si disponible
    if (order.email) {
      const emailHtml = getOrderConfirmationEmail({
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        total: order.total,
        address: order.address,
        quarter: order.quarter,
      })

      await sendEmail({
        to: order.email,
        subject: `Commande TOKOSSA #${order.orderNumber} confirmée`,
        html: emailHtml,
      })
    }

    // Créer une notification de vente (social proof)
    await prisma.saleNotification.create({
      data: {
        productName: order.items[0]?.product.name || 'Produit',
        customerName: order.customerName.split(' ')[0],
        quarter: order.quarter,
      },
    })

    console.log('Order confirmed:', order.orderNumber)

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
    })
  } catch (error) {
    console.error('POST /api/paiement/webhook error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement du webhook' },
      { status: 500 }
    )
  }
}

// GET - Pour vérification KKiaPay
export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
