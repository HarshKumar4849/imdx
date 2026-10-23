# SPECS.md — Eclipse Tractus-X Website Rebuild

> Source of truth for WHAT we are building. HOW to build it lives in `CLAUDE.md`; WHEN lives in `PLAN.md`.
> Based on `Layout_draft_v1.pdf`. Items marked **[CHANGE]** deviate from the draft for performance/quality reasons.

---

## 1. Goals

1. A fast, credible, professional business website for the Tractus-X open-source community and its Kits.
2. Memorable "wow" moments (TV-pixel hero, globe/world map) **without** hurting load speed.
3. Content (kits, events, partners, dataspaces, gallery) editable without touching components.
4. Fully usable on mobile, keyboard, and low-end devices.

**Non-goals (v1):** user accounts, a backend database, a blog, multi-language, a heavy CMS.

## 2. Audience

- Enterprise/engineering decision-makers evaluating Tractus-X Kits
- Developers wanting docs, repos, and community access
- Potential partners/contributors

## 3. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + React 19 + TypeScript (strict)** | Static generation, great image/font optimization, huge vibe-coding ecosystem |
| Styling | **Tailwind CSS v4** + CSS variables for tokens | Small output, fast iteration |
| Scroll animation | **GSAP + ScrollTrigger** (dynamic import, home page only) | Reliable pinned/scrubbed sections |
| UI animation | CSS transitions first; **Motion** only where CSS can't | Keep JS small |
| Globe | **cobe** (~5 KB WebGL) **[CHANGE]** | Replaces Three.js (~600 KB+) |
| Flat world map | **d3-geo + topojson-client + world-atlas**, rendered as SVG | Light, crisp, hover-able countries |
| Carousel | **Embla Carousel** (~5 KB) | Accessible, touch-friendly |
| Content | **JSON/YAML + MDX files in `/content`**, validated with **Zod** | No CMS cost; Git-based editing |
| Forms | Next.js Route Handler + **Resend** + **Cloudflare Turnstile** | Spam-safe, no DB |
| Icons | `lucide-react` (import individually) | Tree-shakeable |
| Fonts | `next/font` (1 display + 1 body, self-hosted) | No layout shift |
| Hosting | **Vercel** (or Cloudflare Pages) + CDN | Zero-config previews |
| Quality | ESLint, Prettier, Playwright (smoke), Lighthouse CI, `@next/bundle-analyzer` | Guard the performance budget |
| Analytics | Plausible or Vercel Analytics (cookie-free) | Light, privacy-friendly |

> Alternative if you want the lightest possible output: **Astro** with React islands. Next.js is recommended here because it matches the React learning path and has the larger vibe-coding tooling support.

## 4. Sitemap

```
/                    Home (all sections below)
/about               About us
/kits                Kits overview (ecosystem diagram + kit grid)
/kits/[slug]         Dedicated kit page (automotive, manufacturing, semiconductor, construction, chemical)
/developers          Developers hub (docs links, repos, getting started)
/community           Community (events, bases, how to join)
/gallery             Full gallery
/contact             Get in touch (also embedded on home)
/privacy, /imprint   Legal
```

Global nav: **LOGO · About us · Kits · Developers hub · Community** + CTA "Join us".

## 5. Home Page — Section Specs

### S1. Hero — "TV display" video
- Full-viewport muted looping video of branding, styled as a TV/pixel display.
- **Cursor effect:** pixels switch off under the cursor, revealing company name + logo + welcome text.
- **Scroll effect:** while scrolling down, the display's pixels progressively switch off, fully revealing the branding.
- **[CHANGE]** Render the pixel effect with a single `<canvas>` mask (grid of cells, ~20–32 px), not hundreds of DOM nodes.
- **[CHANGE]** Video ≤ 2 MB (H.264/WebM, 720p, 8–10 s loop) + a poster image (AVIF/WebP) for instant LCP. No video on mobile, `prefers-reduced-motion`, or `Save-Data`: show the poster.
- Branding text is real HTML (not baked into the video) for SEO/accessibility.

### S2. "Welcome to the community" → Community partners
- Centered welcome heading + description text (no images).
- On scroll, the welcome text fades out and the partner logos fade in.
- Partner logos scroll as a continuous marquee (**pure CSS** animation, pauses on hover).
- Logos are SVG/optimized WebP from `content/partners.json`.

### S3. Video montage + Upcoming events
- Video montage panel with title, short text, buttons: **Join us**, **Schedule**.
- A collapsed "Upcoming Events +" side tab sits on the right.
- On scroll, the montage fades/shrinks and the events appear as minimal cards (image, title, date, details, **Register** / **Join**).
- **[CHANGE]** Montage loads lazily (only when near viewport) and uses the same compressed-video rules as S1.
- Events come from `content/events.json` (past events auto-hidden at build time).

### S4. Community bases around the world
- Left: decorative interactive **globe** (cobe), slowly rotating.
- Right: **flat world map** (main interaction). Hovering a country shows a mini card listing the bases/dataspaces in that location.
- **[CHANGE]** Globe auto-pauses off-screen; on mobile the globe is hidden and the flat map is full width (tap instead of hover).
- Data from `content/bases.json` (country code, name, city, lat/lng, link).

### S5. Our Products → Kits
- Minimal product containers (1–2 shown by default, more rows if >2).
- Containers fade away slowly to reveal the **Kit ecosystem**: central "KITs" node with branches: Automotive, Manufacturing, Semiconductor, Construction, Chemical, (+ more).
- Hover a branch → short detail; click → `/kits/[slug]`.
- **[CHANGE]** Build the ecosystem as an inline **SVG** with CSS/GSAP animation (no canvas/3D). On mobile it becomes a vertical list with the same fade-in.
- Kit data from `content/kits/*.mdx` (frontmatter + body).

### S6. Our Gallery
- Layout was undecided in the draft. **Proposed:** responsive masonry grid (6–9 images on home), "View all" → `/gallery` with lightbox.
- All images via `next/image` (AVIF/WebP, blur placeholder, lazy).

### S7. "Different dataspaces in our network"
- Horizontal carousel of cards: image, title, short details, **Visit** button (external link, `rel="noopener"`).
- Data from `content/dataspaces.json`.

### S8. Footer block — Logo + Branding name
- Large logo + branding name, nav links, social links, legal links.

### S9. Get in touch
- Orange panel: "Join the … solution", form: **Name, Email, How you can contribute**, buttons **Chat with us** (link to community chat) and **Join us**.
- Small map/globe of bases (reuse S4 data as a static SVG; no second WebGL context) **[CHANGE]**.
- Validation with Zod on client + server; Turnstile; success/error states; no data stored beyond the email delivery.

## 6. Content Model (all in `/content`, Zod-validated at build)

| File | Fields |
|---|---|
| `partners.json` | name, logo, url |
| `events.json` | title, date, endDate?, image, summary, registerUrl, type |
| `bases.json` | country (ISO), city, lat, lng, name, url |
| `dataspaces.json` | name, image, summary, url |
| `kits/*.mdx` | slug, title, tagline, domain, icon, summary, links, body |
| `gallery.json` | src, alt, caption, width, height |

## 7. Performance Budget (hard limits — CI fails if exceeded)

- Lighthouse (mobile): **Performance ≥ 90**, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95
- **LCP < 2.5 s**, **CLS < 0.05**, **INP < 200 ms**
- Initial JS (home) **≤ 170 KB gzip**; GSAP/cobe/d3 loaded **dynamically** after first paint
- Hero poster ≤ 120 KB; hero video ≤ 2 MB; no other video autoloads
- Total page weight on first load ≤ 1.5 MB
- Animations only on `transform` and `opacity`; no layout-thrashing

## 8. Accessibility & Motion

- Respect `prefers-reduced-motion`: all scroll/pixel/globe effects degrade to static content.
- Full keyboard navigation; visible focus rings; semantic landmarks; alt text on all images.
- Colour contrast AA (orange CTA with dark text or large white text only — verify).
- **No scroll-hijacking:** use pinned/sticky sections with normal scrolling; users must never get "stuck".

## 9. SEO & Meta

- Per-page metadata, Open Graph images, `sitemap.xml`, `robots.txt`, JSON-LD (Organization).
- Clean slugs, canonical URLs, redirects from any old URLs (map old → new before launch).

## 10. Design Tokens (starting point — refine in a design pass)

- Palette: neutral greys (from draft) + **orange accent** (CTA/buttons); define as CSS variables (`--bg`, `--surface`, `--text`, `--accent`).
- Type: one display font + one body font, 4–5 sizes in a fluid scale.
- Radius/spacing scale consistent across cards, buttons, inputs.
- Dark-surface hero, light content sections (as in the draft).

## 11. Open Questions (answer before/while building)

1. Final brand name, logo files, official colours/fonts?
2. Is there an existing site/URLs to preserve (redirects)?
3. Where does the "Chat with us" link go (Matrix/Slack/Discord)?
4. Who maintains content — developers only, or non-technical editors (→ consider a Git-based CMS like Decap later)?
5. Real assets: hero video, montage video, gallery images, partner logos (with permission).
6. Is "Developers hub" a full page or a link out to docs?
7. Hosting/domain constraints (e.g., Eclipse Foundation infrastructure)?
