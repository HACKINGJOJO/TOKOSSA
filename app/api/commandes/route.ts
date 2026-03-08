import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { generateOrderNumber, formatPrice, getDeliveryFee, isValidBeninPhone } from '@/lib/utils'
import { sendWhatsAppMessage, notifyAdminNewOrder } from '@/lib/whatsapp'
import { sendEmail, getOrderConfirmationEmail } from '@/lib/email'
import { checkRateLimit, getClientIP, RATE_LIMIT_ORDERS } from '@/lib/rate-limit'

// ============================================
// SECURITE : fonctions de sanitization
// ============================================

/** Nettoie et tronque un champ texte */
function sanitizeText(value: unknown, maxLength: number = 200): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

// GET /api/commandes - Liste des commandes d'un client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    const status = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)

    // SECURITE : le telephone est obligatoire pour eviter de lister toutes les commandes
    if (!phone) {
      return NextResponse.json(
        { error: 'Le parametre phone est requis' },
        { status: 400 }
      )
    }

    const where: Record<string, unknown> = { phone }

    if (status) {
      where.status = status
    }

    const orders = await prisma.order.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('GET /api/commandes error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    )
  }
}

// POST /api/commandes - Créer une commande
export async function POST(request: NextRequest) {
  try {
    // SECURITE : Rate limiting — max 5 commandes par minute par IP
    const clientIP = getClientIP(request)
    if (!checkRateLimit(clientIP, 'commandes', RATE_LIMIT_ORDERS)) {
      return NextResponse.json(
        { error: 'Trop de requetes. Reessayez dans une minute.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    const {
      customerName,
      phone,
      email,
      address,
      quarter,
      notes,
      paymentMethod,
      items,
      isSplitPayment,
      loyaltyPointsUsed,
    } = body

    // Validation des champs requis
    if (!customerName || !phone || !address || !quarter || !paymentMethod) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    // SECURITE : Valider le format du telephone beninois
    if (!isValidBeninPhone(phone)) {
      return NextResponse.json(
        { error: 'Numero de telephone invalide. Format attendu : +229 01 XX XX XX XX' },
        { status: 400 }
      )
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      )
    }

    // Limiter le nombre d'articles par commande
    if (items.length > 50) {
      return NextResponse.json(
        { error: 'Trop d\'articles dans la commande (max 50)' },
        { status: 400 }
      )
    }

    // SECURITE : Sanitizer les champs texte
    const safeCustomerName = sanitizeText(customerName, 100)
    const safeAddress = sanitizeText(address, 300)
    const safeNotes = sanitizeText(notes, 500)
    const safeEmail = email ? sanitizeText(email, 100) : null

    // Générer le numéro de commande
    const orderNumber = generateOrderNumber()

    // ============================================
    // SECURITE : Recalculer tous les montants cote serveur
    // Ne JAMAIS faire confiance au subtotal/total/deliveryFee du client
    // ============================================

    let serverSubtotal = 0
    const verifiedItems: Array<{ productId: string; quantity: number; price: number; productName: string }> = []

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity < 1) {
        return NextResponse.json(
          { error: 'Donnees article invalides' },
          { status: 400 }
        )
      }

      // Quantite maximale par article
      if (item.quantity > 100) {
        return NextResponse.json(
          { error: 'Quantite trop elevee pour un article (max 100)' },
          { status: 400 }
        )
      }

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, name: true, price: true, stock: true, isActive: true },
      })

      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Produit introuvable ou desactive` },
          { status: 400 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${product.name}` },
          { status: 400 }
        )
      }

      // Utiliser le prix REEL depuis la base de donnees, pas celui du client
      const itemTotal = product.price * item.quantity
      serverSubtotal += itemTotal

      verifiedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        productName: product.name,
      })
    }

    // Calculer les frais de livraison depuis la fonction serveur
    const serverDeliveryFee = getDeliveryFee(quarter)

    // SECURITE : Valider les points de fidelite si utilises
    let serverLoyaltyDiscount = 0
    let serverLoyaltyPointsUsed = 0

    if (loyaltyPointsUsed && loyaltyPointsUsed > 0) {
      // Verifier le solde reel de l'utilisateur
      const user = await prisma.user.findUnique({
        where: { phone },
        select: { loyaltyPoints: true },
      })

      if (!user || user.loyaltyPoints < loyaltyPointsUsed) {
        return NextResponse.json(
          { error: 'Points de fidelite insuffisants' },
          { status: 400 }
        )
      }

      if (loyaltyPointsUsed < 500) {
        return NextResponse.json(
          { error: 'Minimum 500 points pour utiliser vos points' },
          { status: 400 }
        )
      }

      serverLoyaltyPointsUsed = Math.floor(loyaltyPointsUsed)
      // 1 point = 1 FCFA, mais ne peut pas depasser le sous-total
      serverLoyaltyDiscount = Math.min(serverLoyaltyPointsUsed, serverSubtotal)
    }

    // Calculer le total final cote serveur
    const serverTotal = serverSubtotal + serverDeliveryFee - serverLoyaltyDiscount

    if (serverTotal < 0) {
      return NextResponse.json(
        { error: 'Montant total invalide' },
        { status: 400 }
      )
    }

    // Calculer les montants split si applicable
    let serverSplitFirst: number | null = null
    let serverSplitSecond: number | null = null

    if (isSplitPayment) {
      // Paiement en 2x : 60% maintenant, 40% a la livraison
      serverSplitFirst = Math.ceil(serverTotal * 0.6)
      serverSplitSecond = serverTotal - serverSplitFirst
    }

    // Créer la commande avec les montants RECALCULES par le serveur
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: safeCustomerName,
        phone,
        email: safeEmail,
        address: safeAddress,
        quarter,
        notes: safeNotes,
        paymentMethod,
        subtotal: serverSubtotal,
        deliveryFee: serverDeliveryFee,
        total: serverTotal,
        isSplitPayment: isSplitPayment || false,
        splitFirstAmount: serverSplitFirst,
        splitSecondAmount: serverSplitSecond,
        loyaltyPointsUsed: serverLoyaltyPointsUsed,
        loyaltyPointsEarned: Math.floor(serverTotal / 100),
        items: {
          create: verifiedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Décrémenter le stock des produits
    for (const item of verifiedItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    // SECURITE : Debiter les points de fidelite si utilises
    if (serverLoyaltyPointsUsed > 0) {
      await prisma.user.update({
        where: { phone },
        data: { loyaltyPoints: { decrement: serverLoyaltyPointsUsed } },
      })
      await prisma.loyaltyPoint.create({
        data: {
          userId: (await prisma.user.findUnique({ where: { phone }, select: { id: true } }))!.id,
          points: -serverLoyaltyPointsUsed,
          type: 'REDEEM',
          reason: 'order_discount',
          orderId: order.id,
        },
      }).catch(console.error)
    }

    // Notifications (fire-and-forget pour ne pas bloquer la reponse)
    // Les notifications ne sont envoyees que pour les commandes COD.
    // Les commandes mobile money sont confirmees via le webhook KKiaPay.
    if (paymentMethod === 'CASH_ON_DELIVERY') {
      const productsList = verifiedItems
        .map((item) => `${item.quantity}x ${item.productName}`)
        .join(', ')

      // Confirmation WhatsApp au client
      sendWhatsAppMessage(phone, 'order_confirmation', {
        name: customerName.split(' ')[0],
        orderNumber: order.orderNumber,
        products: productsList,
        total: formatPrice(order.total),
        address: `${address}, ${quarter}`,
        quarter,
      }).catch(console.error)

      // Email de confirmation si disponible
      if (email) {
        const orderItems = order.items as Array<{
          product: { name: string } | null
          quantity: number
          price: number
        }>

        const emailHtml = getOrderConfirmationEmail({
          customerName,
          orderNumber: order.orderNumber,
          items: orderItems.map((oi) => ({
            name: oi.product?.name || 'Produit',
            quantity: oi.quantity,
            price: oi.price,
          })),
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          total: order.total,
          address: `${address}, ${quarter}`,
          quarter,
        })

        sendEmail({
          to: email,
          subject: `Commande TOKOSSA #${order.orderNumber} confirmee`,
          html: emailHtml,
        }).catch(console.error)
      }

      // Notification WhatsApp a l'admin
      notifyAdminNewOrder({
        orderNumber: order.orderNumber,
        customerName,
        phone,
        total: order.total,
        quarter,
        paymentMethod: 'CASH_ON_DELIVERY',
      }).catch(console.error)

      // Social proof : enregistrer la notification de vente
      prisma.saleNotification
        .create({
          data: {
            productName: 'Commande',
            customerName:
              customerName.split(' ')[0] +
              ' ' +
              (customerName.split(' ')[1]?.[0] || '') +
              '.',
            quarter,
          },
        })
        .catch(console.error)
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/commandes error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    )
  }
}
