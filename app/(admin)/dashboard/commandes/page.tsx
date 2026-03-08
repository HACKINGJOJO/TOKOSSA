import Link from 'next/link'
import prisma from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import OrderStatusButton from '@/components/admin/OrderStatusButton'

/**
 * Page de gestion des commandes admin TOKOSSA.
 * Server Component async qui recupere les commandes depuis Prisma.
 * Accepte un searchParam ?status= pour filtrer par statut.
 * Onglets de filtrage, tableau responsive, bouton changement de statut par commande.
 */

/** Couleurs de badges par statut */
const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-indigo-100 text-indigo-800',
  DELIVERING: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

/** Labels lisibles par statut */
const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmee',
  PREPARING: 'Preparation',
  DELIVERING: 'En livraison',
  DELIVERED: 'Livree',
  CANCELLED: 'Annulee',
}

/** Labels des methodes de paiement */
const paymentLabels: Record<string, string> = {
  MOBILE_MONEY: 'Mobile Money',
  MTN_MOBILE_MONEY: 'MTN MoMo',
  MOOV_MONEY: 'Moov Money',
  CELTIS_MONEY: 'Celtis',
  CASH_ON_DELIVERY: 'Cash',
}

/** Onglets de filtrage */
const tabs = [
  { label: 'Toutes', value: '' },
  { label: 'En attente', value: 'PENDING' },
  { label: 'Confirmees', value: 'CONFIRMED' },
  { label: 'En livraison', value: 'DELIVERING' },
  { label: 'Livrees', value: 'DELIVERED' },
  { label: 'Annulees', value: 'CANCELLED' },
]

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function CommandesPage({ searchParams }: PageProps) {
  const { status } = await searchParams

  // Filtre conditionnel sur le statut
  const where: Record<string, unknown> = {}
  if (status && status !== '') {
    where.status = status
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-600">{orders.length} commande{orders.length > 1 ? 's' : ''}</p>
        </div>
        <a
          href="/api/admin/export/commandes"
          download
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exporter CSV
        </a>
      </div>

      {/* Onglets de filtrage */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => {
          const isActive = (status || '') === tab.value
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/dashboard/commandes?status=${tab.value}` : '/dashboard/commandes'}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Liste des commandes */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 text-lg">Aucune commande{status ? ` avec le statut "${statusLabels[status] || status}"` : ''}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* En-tete du tableau (desktop) */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-2">Commande</div>
            <div className="col-span-2">Client</div>
            <div className="col-span-2">Telephone</div>
            <div className="col-span-1">Paiement</div>
            <div className="col-span-1">Total</div>
            <div className="col-span-1">Statut</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Action</div>
          </div>

          {/* Lignes */}
          <div className="divide-y">
            {orders.map((order) => (
              <div
                key={order.id}
                className="px-6 py-4 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center space-y-3 lg:space-y-0"
              >
                {/* Numero de commande */}
                <div className="col-span-2">
                  <p className="font-mono text-sm font-medium text-gray-900">
                    #{order.orderNumber}
                  </p>
                  <p className="text-xs text-gray-400 lg:hidden">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Client */}
                <div className="col-span-2">
                  <p className="font-medium text-gray-900 text-sm">{order.customerName}</p>
                  <p className="text-xs text-gray-400">{order.quarter}</p>
                </div>

                {/* Telephone */}
                <div className="col-span-2">
                  <a
                    href={`https://wa.me/${order.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    {order.phone}
                  </a>
                </div>

                {/* Methode de paiement */}
                <div className="col-span-1">
                  <span className="text-xs font-medium text-gray-600">
                    {paymentLabels[order.paymentMethod] || order.paymentMethod}
                  </span>
                </div>

                {/* Total */}
                <div className="col-span-1">
                  <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                </div>

                {/* Statut badge */}
                <div className="col-span-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      statusColors[order.status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>

                {/* Date */}
                <div className="col-span-2 hidden lg:block">
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {/* Action : changer le statut */}
                <div className="col-span-1">
                  <OrderStatusButton orderId={order.id} currentStatus={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
