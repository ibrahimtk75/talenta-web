# GlobalFundConnect — Web App

A global financial marketplace where people **search, compare and apply** for financial
products — loans, credit cards, insurance, savings, investments, grants, scholarships,
microfinance, fintech apps and government schemes — from **verified providers**, with
transparent trust scores and explainable AI guidance.

This repository contains the **responsive web app** (the first platform in the wider
GlobalFundConnect roadmap). It is a production-shaped front-end foundation built on the
target stack, wired to a mock data layer that a real Node/NestJS + PostgreSQL backend can
later replace with zero UI changes.

> Figures in the demo catalog are illustrative and are not financial advice.

## ✨ What's built

| Area | Details |
| --- | --- |
| **Landing** | Hero + global search, 10 category tiles, how-it-works, featured products, trust band |
| **Marketplace** | Search, category filter, sort (rate / rating / trust), verified-only & hide-flagged toggles, **side-by-side compare** (up to 3) |
| **Product detail** | Full terms, highlights, provider **trust score** card, **AI eligibility estimate** (live, explainable), apply flow, similar products |
| **AI Advisor** | 3-step questionnaire → ranked recommendations with plain-English "why we matched" reasons |
| **AI chat widget** | Always-on assistant with intent routing to categories, safety and eligibility |
| **Auth** | Email + social (Google / Apple / Phone OTP) mock, **role selector** (client / provider / admin) |
| **Client dashboard** | Application tracking, saved products, notifications, recommendations |
| **Provider portal** | Listings, conversion funnel, subscription plan, verification status |
| **Admin portal** | Fraud review queue, provider verification, platform stats |
| **Cross-cutting** | Light/Dark theme, multi-currency, multi-language (EN/ES/HI/AR incl. RTL), trust & **scam-flag indicators** |

## 🧱 Tech stack

- **React 18 + TypeScript** (Vite)
- **Tailwind CSS** design system (trust-first emerald palette, light/dark)
- **React Router** (hash routing — deploys to any static host)
- **lucide-react** icons

State lives in a single `AppContext` (theme, currency, language, session, saved products),
persisted to `localStorage`.

## 🚀 Getting started

```bash
npm install
npm run dev        # dev server
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build
```

## 📁 Structure

```
src/
  components/   Navbar, Footer, Layout, ProductCard, CompareTray,
                TrustBadge, StarRating, StatCard, AIChatWidget, Icon, Logo
  context/      AppContext (prefs + session + saved products)
  data/         categories, providers, products (mock catalog)
  lib/          types, format (currency/rate/trust), eligibility, i18n
  pages/        Landing, Marketplace, ProductDetail, Advisor, Login,
                Dashboard, ProviderPortal, AdminPortal, Providers, About, NotFound
```

## 🗺️ Roadmap

The full product/engineering plan — PRD outline, architecture, database schema,
API surface, sprint plan, revenue model and AI-tooling master prompts — lives in
[`docs/ROADMAP.md`](docs/ROADMAP.md).
