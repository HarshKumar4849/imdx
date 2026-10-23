# CLAUDE.md — Rules & Context for AI Coding Agents

(Also usable as `AGENTS.md` / `.cursorrules` — copy the content.)

## Project

Rebuild of the **Eclipse Tractus-X** business website. Read `SPECS.md` before any feature work and `PLAN.md` to see the current phase. Do not invent features outside `SPECS.md`.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · GSAP + ScrollTrigger · cobe · d3-geo · Embla · Zod · Resend · Cloudflare Turnstile.

## Commands

```bash
pnpm dev            # local dev
pnpm build          # production build (must pass before any PR/commit)
pnpm lint           # ESLint
pnpm typecheck      # tsc --noEmit
pnpm test:e2e       # Playwright smoke tests
pnpm analyze        # bundle analyzer
pnpm lhci           # Lighthouse CI against performance budget
```

## Folder Structure

```
/app                 routes (server components by default)
/components/ui       small reusable primitives (Button, Card, Container)
/components/sections one file per home section (Hero, Partners, Events, ...)
/components/motion   client-only animation wrappers (loaded dynamically)
/content             JSON + MDX content (the only place content lives)
/lib                 helpers, Zod schemas, content loaders
/public              optimized static assets (video, posters, logos)
/styles              globals.css, tokens
```

## Golden Rules

1. **Server Components by default.** Add `"use client"` only for interactivity/animation, and keep those components as small leaf nodes.
2. **Performance budget is law** (see `SPECS.md §7`). Before adding any dependency, state its gzip size and why it is needed. Prefer CSS over JS, native over library.
3. **Heavy libs are dynamically imported** (`next/dynamic` / `import()`), only on the route/section that needs them, and only after first paint or when near the viewport (IntersectionObserver).
4. **No content in components.** Text, partners, events, kits, etc. come from `/content` through typed loaders in `/lib`. Validate with Zod.
5. **Images:** always `next/image` with explicit `width`/`height` (or `fill` + sizes), `alt` text, AVIF/WebP. **Video:** muted, `playsInline`, `preload="none"` or `metadata`, poster required, lazy unless it's the hero.
6. **Animate only `transform` and `opacity`.** No animating width/height/top/left. Add `will-change` sparingly and remove after animation.
7. **Every animation needs a reduced-motion fallback** (`prefers-reduced-motion`) and a mobile strategy.
8. **No scroll-hijacking.** Use sticky/pinned sections with `scrub`; native scroll must always work.
9. **Accessibility is not optional:** semantic HTML, labelled form fields, focus states, keyboard support, AA contrast.
10. **TypeScript strict, no `any`.** No unused code, no commented-out blocks, no `console.log` in commits.
11. **Styling:** Tailwind utilities + design tokens (CSS variables). No inline hard-coded colours/sizes that duplicate tokens. Mobile-first.
12. **Security:** never commit secrets; env vars in `.env.local` + `.env.example`; validate and rate-limit the contact route; all external links `rel="noopener noreferrer"`.
13. **Small, focused changes.** One feature per task; touch only the files needed; don't refactor unrelated code.
14. **Don't guess assets/brand.** If a logo, copy, colour, or URL is missing, use a clearly marked placeholder (`TODO:`) and list it in `PLAN.md` under "Blocked on content".

## Workflow for Every Task

1. Read the relevant section in `SPECS.md` and the task in `PLAN.md`.
2. Briefly state the approach (files to create/change, new deps, perf impact).
3. Implement.
4. Run `pnpm lint && pnpm typecheck && pnpm build`.
5. Check the section on mobile width (375 px) and with reduced motion.
6. Tick the task in `PLAN.md` and note anything deferred.

## Definition of Done

- Matches `SPECS.md` for that section
- Responsive (375 / 768 / 1280 / 1920)
- Keyboard + screen-reader sanity checked
- Lighthouse budget still met
- No new lint/type errors; build passes
- Content comes from `/content`

## Code Conventions

- Components: PascalCase files, named exports for components, one component per file.
- Hooks: `useXyz`, in `/lib/hooks`.
- Section components accept no content props beyond what loaders provide; data is loaded in the page and passed down.
- Commit messages: `feat:`, `fix:`, `perf:`, `chore:`, `docs:` (Conventional Commits).

## Known Pitfalls (avoid)

- Importing GSAP/d3/cobe at the top of a server component or a layout (bloats every page).
- Using `<video autoplay>` without `muted playsInline` and poster.
- Creating more than one WebGL context on a page (use cobe once; the footer map is static SVG).
- Using `100vh` on mobile for hero height; use `100svh`.
- Layout shift from fonts/images without dimensions.
- Hover-only interactions with no tap/keyboard equivalent.
