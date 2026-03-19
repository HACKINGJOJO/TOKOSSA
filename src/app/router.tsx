import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { APP_ROUTES, getRoutePath } from '@/app/routes'
import { RedirectIfAuthenticated, RequireAdmin, RequireAuth } from './guards'

const routeComponents = {
  login: lazy(() => import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.Login }))),
  dashboard: lazy(() => import('@/pages/dashboard/Dashboard').then((m) => ({ default: m.Dashboard }))),
  workspace: lazy(() => import('@/features/workspace/pages/WorkspacePage').then((m) => ({ default: m.Workspace }))),

  fondations: lazy(() => import('@/pages/formation/Fondations').then((m) => ({ default: m.Fondations }))),
  sourcing: lazy(() => import('@/pages/formation/Sourcing').then((m) => ({ default: m.Sourcing }))),
  marketing: lazy(() => import('@/pages/formation/Marketing').then((m) => ({ default: m.Marketing }))),
  'facebook-ads': lazy(() => import('@/pages/formation/FacebookAds').then((m) => ({ default: m.FacebookAds }))),
  shopify: lazy(() => import('@/pages/formation/Shopify').then((m) => ({ default: m.Shopify }))),

  'produits-gagnants': lazy(() => import('@/pages/ressources/ProduitsGagnants').then((m) => ({ default: m.ProduitsGagnants }))),
  calendrier: lazy(() => import('@/pages/ressources/Calendrier').then((m) => ({ default: m.Calendrier }))),
  prompts: lazy(() => import('@/pages/ressources/Prompts').then((m) => ({ default: m.Prompts }))),
  dictionnaire: lazy(() => import('@/pages/ressources/Dictionnaire').then((m) => ({ default: m.Dictionnaire }))),
  'cas-pratiques': lazy(() => import('@/pages/ressources/CasPratiques').then((m) => ({ default: m.CasPratiques }))),
  checklists: lazy(() => import('@/pages/ressources/Checklists').then((m) => ({ default: m.Checklists }))),
  apis: lazy(() => import('@/pages/ressources/APIs').then((m) => ({ default: m.APIs }))),
  outils: lazy(() => import('@/pages/ressources/Outils').then((m) => ({ default: m.Outils }))),
  legal: lazy(() => import('@/pages/ressources/Legal').then((m) => ({ default: m.Legal }))),
  'kit-demarrage': lazy(() => import('@/pages/ressources/KitDemarrage').then((m) => ({ default: m.KitDemarrage }))),

  tricks: lazy(() => import('@/pages/tricks/Tricks').then((m) => ({ default: m.Tricks }))),
  quiz: lazy(() => import('@/pages/quiz/Quiz').then((m) => ({ default: m.Quiz }))),
  videos: lazy(() => import('@/pages/videos/Videos').then((m) => ({ default: m.Videos }))),
  notes: lazy(() => import('@/pages/notes/Notes').then((m) => ({ default: m.Notes }))),
  roadmap: lazy(() => import('@/pages/roadmap/Roadmap').then((m) => ({ default: m.Roadmap }))),
  'mon-business': lazy(() => import('@/pages/mon-business/MonBusiness').then((m) => ({ default: m.MonBusiness }))),
  leaderboard: lazy(() => import('@/pages/leaderboard/Leaderboard').then((m) => ({ default: m.Leaderboard }))),
  sav: lazy(() => import('@/pages/sav/SAV').then((m) => ({ default: m.SAV }))),
  certificat: lazy(() => import('@/pages/certificat/Certificat').then((m) => ({ default: m.Certificat }))),
  favoris: lazy(() => import('@/pages/favoris/Favoris').then((m) => ({ default: m.Favoris }))),
  faq: lazy(() => import('@/pages/faq/FAQ').then((m) => ({ default: m.FAQ }))),
  tarifs: lazy(() => import('@/pages/tarifs/Tarifs').then((m) => ({ default: m.Tarifs }))),
  parcours: lazy(() => import('@/pages/parcours/Parcours').then((m) => ({ default: m.Parcours }))),
  'plan-etude': lazy(() => import('@/pages/plan-etude/PlanEtude').then((m) => ({ default: m.PlanEtude }))),
  reglages: lazy(() => import('@/pages/reglages/Reglages').then((m) => ({ default: m.Reglages }))),

  admin: lazy(() => import('@/pages/admin/Admin').then((m) => ({ default: m.Admin }))),
} as const

type RouteComponentKey = keyof typeof routeComponents

function getElement(routeId: string) {
  const Component = routeComponents[routeId as RouteComponentKey]
  if (!Component) return null
  return <Component />
}

const publicRoutes = APP_ROUTES.filter((route) => route.access === 'public')
const protectedRoutes = APP_ROUTES.filter((route) => route.access === 'protected')
const adminRoutes = APP_ROUTES.filter((route) => route.access === 'admin')

export function AppRouter() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream dark:bg-dark" />}>
      <Routes>
        <Route element={<RedirectIfAuthenticated />}>
          {publicRoutes.map((route) => (
            <Route key={route.id} path={route.path} element={getElement(route.id)} />
          ))}
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            {protectedRoutes.map((route) => (
              <Route key={route.id} path={route.path} element={getElement(route.id)} />
            ))}

            <Route element={<RequireAdmin />}>
              {adminRoutes.map((route) => (
                <Route key={route.id} path={route.path} element={getElement(route.id)} />
              ))}
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={getRoutePath('dashboard')} replace />} />
      </Routes>
    </Suspense>
  )
}
