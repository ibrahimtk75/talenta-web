# GlobalFundConnect — Product & Engineering Roadmap

A realistic, enterprise-grade delivery plan for the global financial marketplace.
This document turns the vision into an executable plan for a small team using AI-assisted
development (Claude Code / Cursor / Copilot).

> **Honest scope note.** GlobalFundConnect is a large product — roughly **6–12 months**
> for a small team to reach production across web + mobile + backend. No single AI prompt
> produces the whole app. What _is_ practical is a strong, correct **foundation** (this
> repo) plus the structured plan below so the team can build sprint by sprint.

---

## 1. Vision & scope

One trusted marketplace to compare and apply for financial products worldwide, across
**10 categories**: Loans · Credit Cards · Insurance · Savings · Investments · Grants ·
Scholarships · Microfinance · Fintech Apps · Government Schemes.

**Platforms:** Responsive Web (this repo) → Admin & Provider portals → iOS/Android
(React Native) sharing the same API.

**User types:** Guest · Client · Company/Provider · Admin · Super Admin.

---

## 2. Personas (summary)

| Persona | Goal | Key needs |
| --- | --- | --- |
| **Priya (Client)** | Find an affordable personal loan | Compare rates, check eligibility, avoid scams |
| **Sam (Provider)** | Acquire qualified applicants | Listings, analytics, sponsored placement |
| **Aisha (Admin)** | Keep the marketplace safe | Moderation, verification, fraud signals |
| **Guest** | Explore before signing up | Browse & compare without an account |

---

## 3. Information architecture

```
/                     Landing
/marketplace          Search & compare (filters, sort, compare tray)
/product/:id          Product detail + AI eligibility + apply
/advisor              AI recommendation questionnaire
/providers            Provider marketing + pricing
/about                Trust, compliance, how-it-works
/login /signup        Auth (email, Google, Apple, phone OTP)
/dashboard            Client: applications, saved, notifications
/provider             Provider portal: listings, analytics, subscription
/admin                Admin portal: moderation, verification, fraud queue
```

---

## 4. System architecture (target)

```
        ┌────────────┐     ┌────────────┐     ┌──────────────┐
        │  Web (Next)│     │ Mobile (RN)│     │ Admin/Provider│
        └─────┬──────┘     └─────┬──────┘     └──────┬───────┘
              └───────────── API Gateway ────────────┘
                              │  (REST/GraphQL, JWT)
        ┌─────────────────────┼──────────────────────────┐
        │        NestJS services (modular monolith)        │
        │  Auth · Catalog · Search · Applications · AI ·   │
        │  Providers · Payments/Billing · Notifications ·  │
        │  Admin/Moderation · Analytics                    │
        └───────┬───────────────┬───────────────┬─────────┘
          PostgreSQL          Redis          Object Storage
          (+ Prisma)      (cache/queues)     (documents)
                    External: Firebase Auth, email/SMS,
                    payment gateways, KYC/KYB, LLM provider
```

**Cross-cutting:** MFA, JWT, OAuth, encryption at rest/in transit, audit logs, rate
limiting, fraud detection, GDPR/CCPA data handling, Docker + CI/CD, observability.

> The current web app uses `src/data/*` mock modules with the same shapes as the API
> contracts below, so swapping to live endpoints is a data-layer change, not a UI rewrite.

---

## 5. Database schema (core tables)

```
users(id, email, role, name, locale, currency, mfa_enabled, created_at)
providers(id, name, country, regulated, verified, trust_score, kyb_status)
products(id, provider_id, category, name, currency, rate, rate_label,
         min_amount, max_amount, term_label, rating, reviews, featured,
         sponsored, flagged, min_income, min_credit_score, country)
applications(id, user_id, product_id, status, amount, submitted_at)
saved_products(user_id, product_id, created_at)
reviews(id, user_id, product_id, rating, body, created_at)
subscriptions(id, provider_id, plan, status, renews_at)
audit_logs(id, actor_id, action, entity, meta, created_at)
notifications(id, user_id, type, body, read, created_at)
```

Trust score is **transparent & recomputed**: verification + regulatory status +
review volume + complaint history + tenure. Never a black box.

---

## 6. API surface (representative)

```
POST /auth/login  /auth/register  /auth/otp        # + OAuth callbacks
GET  /products    ?category&q&sort&verified        # search & compare
GET  /products/:id
POST /eligibility/estimate                          # explainable, non-decision
POST /advisor/recommend                             # ranked + reasons
POST /applications        GET /applications         # apply + track
GET/POST /saved
GET  /providers/:id/analytics                       # provider funnel
POST /admin/providers/:id/verify                    # moderation
GET  /admin/fraud-queue
```

---

## 7. AI features

1. **AI eligibility estimate** — explainable, rule-based → LLM-assisted; guidance, never a decision.
2. **AI recommendations** — rank matches with plain-English reasons.
3. **AI chat assistant** — multi-language support, routes to products/safety/eligibility.
4. **Document summarizer** — summarize uploaded statements/terms (backend + LLM).
5. **Scam/fraud indicators** — flag high-risk listings; consumer warnings.
6. **Provider trust score** — transparent, criteria-based.

---

## 8. Sprint plan (2-week sprints)

| Sprint | Theme | Outcome |
| --- | --- | --- |
| 0 | Foundations | Repo, CI/CD, design system, IA ✅ *(web foundation in this repo)* |
| 1 | Catalog & search | Marketplace, filters, compare, product detail ✅ |
| 2 | Auth & profiles | Firebase auth, MFA, roles, sessions |
| 3 | Client portal | Saved, applications, notifications |
| 4 | Provider portal | Listings CRUD, analytics, subscriptions |
| 5 | Admin portal | Moderation, verification, fraud queue, audit logs |
| 6 | AI features | Eligibility, recommendations, chat, summarizer |
| 7 | Payments & billing | Provider subscriptions, sponsored placement |
| 8 | i18n & multi-currency | Full localization incl. RTL, FX |
| 9 | Security & compliance | Pen-test, GDPR/CCPA, KYC/KYB, rate limiting |
| 10 | Mobile (RN) | Shared API, client app MVP |
| 11 | Hardening & launch | Load testing, observability, docs, GA |

Sprints 0–1 outcomes are already implemented in this web foundation.

---

## 9. Revenue model

Affiliate commissions · Featured listings · Provider subscriptions · Sponsored
placements · Analytics subscriptions · API access. Sponsored content is always
clearly labelled to preserve impartiality.

---

## 10. AI-tooling master prompts

Reusable prompts to drive Claude Code / Cursor per module. Example:

> _"Implement the Applications module for GlobalFundConnect in NestJS + Prisma. Follow
> the schema in `docs/ROADMAP.md §5` and the API in §6. Add `POST /applications`
> (create), `GET /applications` (list for current user), status transitions
> draft→submitted→in-review→approved/declined, audit-log each transition, and unit +
> e2e tests. Match the existing module structure and DTO/validation conventions."_

Create one such prompt per module (Auth, Catalog, Search, Applications, Providers,
Payments, AI, Admin, Notifications, Analytics), always referencing this document as the
single source of truth.

---

## 11. Definition of done (per feature)

- Types shared between client and API; validation on both sides
- Accessible (keyboard, contrast, semantics), responsive, light/dark
- Unit + integration tests; e2e for critical flows
- Security review (authz, rate limits, input validation, audit logging)
- i18n-ready strings; no hard-coded currency
- Observability (logs/metrics) and documentation updated
