# PLAN.md — Build Plan & Task Tracker

> Work top to bottom. One task at a time. Tick items as done. Feed the agent ONE phase (or even one task) per prompt, always referencing `SPECS.md` + `CLAUDE.md`.

**Current phase:** 0

---

## Phase 0 — Foundations
- [ ] Init repo: Next.js 15 + TS strict + Tailwind v4 + pnpm
- [ ] ESLint, Prettier, Husky pre-commit (lint + typecheck)
- [ ] Folder structure from `CLAUDE.md`
- [ ] Design tokens (colours, fonts via `next/font`, spacing, radius) in `styles/tokens.css`
- [ ] Base layout: Header (nav), Footer, Container, Button, Card
- [ ] Content layer: Zod schemas + loaders in `/lib/content`, sample JSON for each file
- [ ] CI: build + lint + typecheck + Lighthouse CI with budget
- [ ] Deploy empty skeleton to Vercel (preview URLs working)

## Phase 1 — Static Skeleton (no fancy effects yet)
- [ ] Home page with all 9 sections as plain, responsive, content-driven blocks
- [ ] Pages: /about, /kits, /kits/[slug], /developers, /community, /gallery, /contact, legal
- [ ] Nav: sticky header, mobile menu (accessible), "Join us" CTA
- [ ] SEO: metadata, OG images, sitemap, robots, JSON-LD
- [ ] **Checkpoint:** Lighthouse ≥ 95 on the plain version (this is your baseline)

## Phase 2 — Core Interactions (cheap and high-value first)
- [ ] Partners marquee (pure CSS)
- [ ] Events cards + "Upcoming Events +" side tab
- [ ] Dataspaces carousel (Embla)
- [ ] Gallery masonry + lightbox
- [ ] Contact form: Zod + Route Handler + Resend + Turnstile + states
- [ ] Kit pages from MDX with ecosystem navigation

## Phase 3 — Signature Effects (one at a time; measure after each)
- [ ] Hero: poster + video, canvas pixel-mask (cursor + scroll reveal), reduced-motion/mobile fallbacks
- [ ] S2: welcome → partners scroll transition (GSAP, dynamic import)
- [ ] S3: video montage → events scroll transition
- [ ] S4: cobe globe + SVG flat map with country hover cards (tap on mobile)
- [ ] S5: product containers fade → Kit ecosystem SVG (hover/click)
- [ ] Footer/Contact: slide transition, static base map
- [ ] **Checkpoint:** re-run Lighthouse + bundle analyzer; fix regressions before continuing

## Phase 4 — Polish & Hardening
- [ ] Cross-browser (Chrome, Safari iOS, Firefox) + low-end device test
- [ ] Accessibility audit (axe, keyboard, screen reader pass)
- [ ] Image/video compression pass; remove unused deps/CSS
- [ ] 404 / error pages, loading states
- [ ] Analytics (cookie-free), cookie/legal review
- [ ] Playwright smoke tests (nav, form, kit pages)

## Phase 5 — Launch
- [ ] Redirect map from old URLs
- [ ] Final content/copy review, real assets in place
- [ ] Domain + DNS + HTTPS, production env vars
- [ ] Monitoring (uptime + Web Vitals)
- [ ] Post-launch backlog: Decap CMS, blog/news, search, i18n

---

## Blocked on Content / Decisions
- [ ] Brand name, logo, colours, fonts
- [ ] Hero + montage videos (compressed)
- [ ] Partner logos (permission)
- [ ] Real kits copy (5 kits) and links
- [ ] Bases list (countries/cities/links)
- [ ] Gallery images
- [ ] "Chat with us" destination
- [ ] Old site URLs for redirects
- [ ] Compress supplied home hero video from 41.9 MB to the ≤2 MB performance target and generate its matching poster

## Prompt Template (copy for each task)

```
Read SPECS.md, CLAUDE.md and PLAN.md.
Task: <exact task from PLAN.md>
Constraints: follow the Golden Rules; state any new dependency + gzip size first.
When done: run lint/typecheck/build, then tell me what changed and which PLAN.md boxes to tick.
```

## Decision Log
| Date | Decision | Reason |
|---|---|---|
| 2026-10-22 | Restored the full-frame looping hero video with a subtle 3 px dot overlay, cursor cutouts, randomized scroll reveal, and bottom navigation. | Keep the video bright and legible while the existing brand and join action sit behind the display. |
