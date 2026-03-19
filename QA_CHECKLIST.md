# QA Checklist - JOJO App

Date de référence: 2026-02-16

## 1) Auth
- Ouvrir `/login`
- Vérifier connexion avec code valide
- Vérifier erreur sur code invalide
- Vérifier redirection vers `/` après succès

## 2) Onboarding Dashboard
- Sur `/`, vérifier affichage du bloc "Démarrage Express"
- Étape 1: choisir une niche
- Étape 2: choisir un objectif
- Étape 3: choisir un canal puis cliquer "Générer mon script maintenant"
- Vérifier redirection vers `/workspace?tab=script&onboarding=1`

## 3) Workspace
- Vérifier pré-remplissage script en mode onboarding
- Générer:
  - Description
  - Post
  - Script
  - Calcul marge
- Vérifier toasts de succès/erreur

## 4) Parcours + Progression
- Aller sur `/parcours`
- Marquer des étapes faites/non faites
- Retourner `/` et vérifier reflet des jalons

## 5) Tarifs + Upgrade
- Aller sur `/tarifs`
- Tester CTA d'un plan (Pro/Empire)
- Remplir modal checkout, confirmer upgrade
- Vérifier badge "Plan actif"
- Vérifier barre sticky mobile

## 6) Admin Cockpit
- Aller sur `/admin` en admin
- Vérifier KPI funnel + activation/onboarding
- Vérifier export CSV membres
- Vérifier copie relance WhatsApp
- Vérifier bouton reset analytics/feed

## 7) Responsive
- Vérifier vues mobile:
  - Sidebar
  - Dashboard onboarding
  - Tarifs sticky CTA
  - Modal checkout

## 8) Build/Quality gates
- `npm run lint`
- `npm run test:unit`
- `npm run build`
