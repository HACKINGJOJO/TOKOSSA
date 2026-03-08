import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/utils'
import { OrderStatus } from '@prisma/client'

// Statuts valides pour une commande (aligne sur l'enum Prisma)
const VALID_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'DELIVERING',
  'DELIVERED',
  'CANCELLED',
]

// GET /api/commandes/[id] — Detail d'une commande avec ses items (admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verification admin
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorise' },
        { status: 401 }
      )
    }

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                slug: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvee' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('GET /api/commandes/[id] error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de la commande' },
      { status: 500 }
    )
  }
}

// PUT /api/commandes/[id] — Mettre a jour le statut d'une commande (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verification admin
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorise' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body as { status: OrderStatus }

    // Valider le statut
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Statut invalide. Valeurs acceptees : ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    // Verifier que la commande existe
    const existing = await prisma.order.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Commande non trouvee' },
        { status: 404 }
      )
    }

    // Construire les donnees de mise a jour selon le statut
    const updateData: {
      status: OrderStatus
      deliveredAt?: Date
      paidAt?: Date
    } = { status }

    // Marquer la date de livraison si le statut passe a DELIVERED
    if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date()
    }

    // Marquer la date de paiement si le statut passe a CONFIRMED
    if (status === 'CONFIRMED' && !existing.paidAt) {
      updateData.paidAt = new Date()
    }

    // Si annulation, restaurer le stock des produits
    if (status === 'CANCELLED' && existing.status !== 'CANCELLED') {
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: id },
      })

      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        })
      }
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true },
            },
          },
        },
      },
    })

    // Notifications WhatsApp selon le statut (fire-and-forget)
    try {
      const customerFirstName = order.customerName.split(' ')[0]

      if (status === 'CONFIRMED') {
        const productsList = order.items
          .map((item: { quantity: number; product: { name: string } | null }) =>
            `${item.quantity}x ${item.product?.name || 'Produit'}`
          )
          .join(', ')

        sendWhatsAppMessage(order.phone, 'order_confirmation', {
          name: customerFirstName,
          orderNumber: order.orderNumber,
          products: productsList,
          total: formatPrice(order.total),
          address: `${order.address}, ${order.quarter}`,
          quarter: order.quarter,
        }).catch((err) => console.error('WhatsApp confirmation error:', err))
      }

      if (status === 'DELIVERING') {
        sendWhatsAppMessage(order.phone, 'order_delivering', {
          name: customerFirstName,
          orderNumber: order.orderNumber,
          duration: '30-60 minutes',
          deliveryPhone: process.env.DELIVERY_PHONE || '',
        }).catch((err) => console.error('WhatsApp delivering error:', err))
      }

      if (status === 'DELIVERED') {
        sendWhatsAppMessage(order.phone, 'order_delivered', {
          name: customerFirstName,
          orderNumber: order.orderNumber,
          reviewLink: `${process.env.NEXT_PUBLIC_APP_URL || 'https://tokossa.bj'}/avis/${order.id}`,
        }).catch((err) => console.error('WhatsApp delivered error:', err))
      }
    } catch (notifError) {
      // Les erreurs de notification ne doivent pas bloquer la reponse
      console.error('Erreur notification WhatsApp:', notifError)
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('PUT /api/commandes/[id] error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de la commande' },
      { status: 500 }
    )
  }
}
