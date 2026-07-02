# TEL PLASTICS — MASTER BUILD PRD
### For: Gemini 3.5 Flash (High) inside Antigravity IDE

---

## 0. ROLE & MISSION

You are the lead front-end engineer and motion designer building a portfolio website for **TEL Plastics**, a Bangladeshi manufacturer that turns recycled plastic into furniture and everyday household essentials. This site will be presented live at an international trade conference to win a project contract against dozens of generic competitor demos.

**The one rule that matters most: this must never resemble a normal website template.** No hero-section-then-cards-then-accordion-then-carousel-then-footer. Every section must feel deliberately art-directed, cinematic, and alive. If at any point what you're building starts to resemble a Bootstrap template or a typical SaaS landing page, stop and reconsider.

The feeling to aim for: the first few sections behave like a **pinned, cinematic presentation deck** — each one holds the screen, plays its beat, then gets pulled away by the next. The remaining sections loosen into a **living, free-scrolling site** that is still far more choreographed and tactile than a normal website.

Work through this document **phase by phase, in order**, as laid out in Section 8. Do not skip ahead. Self-review each phase against this brief before moving to the next.

---

## 1. TECH STACK & ARCHITECTURE

- Pure HTML5 / CSS3 / vanilla JavaScript. No React, no Vue, no build step. Must run by opening `index.html` directly or via a simple static server.
- Libraries (load via CDN — source the current latest stable versions yourself from cdnjs/jsdelivr/unpkg):
  - **GSAP core + ScrollTrigger plugin** — drives all pinning, scrubbing, and reveal timelines.
  - **Lenis** — smooth-scroll library, integrated with ScrollTrigger's scroller-proxy so pinned sections stay perfectly in sync with the smoothed scroll position.
  - **SplitType** (or equivalent) — for word/character-level text-reveal animations.
- Suggested file structure:
```
/index.html
/css/
  variables.css      (design tokens: colors, spacing, shadows, fonts)
  base.css           (resets, global typography)
  sections.css        (or split per-section if it grows large)
/js/
  main.js            (Lenis + ScrollTrigger init, magnetic cursor, grain overlay, scroll-progress rail)
  preloader.js
  brandfilm.js
  hero.js
  process.js
  products.js
  story.js
  sustainability.js
  reach.js
  contact.js
/assets/
  /images/           (generated product images, vectorized logo)
  /svg/              (hand-coded inline SVG components — leaves, process icons, map)
```
- **Performance rules (non-negotiable):** all animations use `transform`/`opacity` only — never animate `width`, `top`, `left`, `box-shadow` spread directly. Respect `prefers-reduced-motion`: provide a fallback where pinning is disabled and reveals become simple fades. Lazy-load below-the-fold video and images. Debounce resize handlers.
- **Priority: desktop/laptop first.** Design and build for a 1440–1920px viewport as the primary target since this ships as a live conference demo. A responsive pass for tablet/mobile happens only after the core desktop experience is fully polished.

---

## 2. DESIGN SYSTEM

### 2.1 Color Palette
*Derived directly from the TEL Plastics logo. Do not deviate from this palette.*

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#FAF7F0` | Primary background |
| `--cream-deep` | `#F1EBDD` | Secondary background / section alternation |
| `--sage` | `#8DC63F` | Primary accent, CTAs, highlights |
| `--forest` | `#0B5E32` | Headlines, primary text accents, deep CTA states |
| `--brown` | `#5C3A21` | Tertiary accent, grounding tones, icon details |
| `--sky` | `#3B9BD9` | Rare accent — use sparingly, e.g. Global Reach section |
| `--ink` | `#24261F` | Body text (warm near-black, never pure black) |
| `--shadow-soft` | `rgba(11,94,50,0.15)` | Base color for all soft claymorphism shadows |

### 2.2 Claymorphism / Soft-3D Visual Language
This is the site's core aesthetic — soft, tactile, molded, premium. NOT flat design, NOT dark glassmorphism/tech aesthetic.
- Large border-radii on cards and containers (24–40px).
- Dual-layer soft shadows: a faint light highlight on the top-left edge + a soft, diffused, color-tinted shadow (using `--shadow-soft`) on the bottom-right — never a harsh black `box-shadow`.
- A subtle grain/noise texture overlay across the entire viewport at ~3–5% opacity, blended with `mix-blend-mode: overlay`, for a premium tactile finish.
- 2–3 large, softly blurred (`filter: blur(80px)`), slow-drifting radial-gradient color blobs positioned behind content in various sections, at low opacity, for ambient background life.

### 2.3 Typography
- **Display/headline font:** Clash Display (Fontshare CDN) — bold weight, used for large cinematic headlines.
- **Body font:** General Sans (Fontshare CDN).
- Import both via Fontshare's CSS API, e.g.: `https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=general-sans@400,500&display=swap`
- Type scale: hero headlines should be genuinely massive — `clamp(3rem, 8vw, 9rem)` — with a clear, generous hierarchy and comfortable line-height for body copy.

### 2.4 Motion Language
- **Never a plain fade.** Reveals use clip-path wipes, staggered word/character reveals, elastic scale-ins, or magnetic pulls.
- **Pinned sections** use ScrollTrigger `pin: true` with a scrubbed timeline tied to scroll progress.
- **Free-scroll sections** use ScrollTrigger `toggleActions` (or IntersectionObserver) to trigger staggered on-enter reveals.
- **Custom cursor:** a small dot that follows the pointer via `gsap.quickTo` easing, and scales/morphs into a soft blob when hovering any element with a `.magnetic` class — those elements should also subtly pull toward the cursor.
- **Scroll-progress rail:** a slim fixed vertical dot-navigation on the right edge of the viewport, spanning Hero through Contact (8 dots: Intro, Hero, Process, Showcase, Story, Sustainability, Reach, Contact). The active section's dot is highlighted; hovering a dot reveals its section label.

### 2.5 Product & Video Visual Language — House Style
**Critical decision, apply consistently everywhere:** All product imagery (both the generated static product photos and the product-related videos) share ONE unified house style — soft-dimensional 2D vector illustration, NOT photorealistic renders and NOT flat clip-art. This is the same visual language used across all four supplied videos. Keeping product photography in this same illustrated style (rather than switching to photoreal renders) is a deliberate choice — it makes the whole site read as one cohesively art-directed world rather than mixed media, and it differentiates TEL Plastics from the generic "stock photo of a plastic chair" catalogs competitors will show.

Every product image and product video also carries a small **embossed TEL leaf-icon maker's mark** somewhere on the product's surface (base, handle, or leg) — this recurring detail is a deliberate brand signature tying every piece of visual media on the site together.

---

## 3. SUPPLIED VIDEO ASSETS

Four videos have already been generated and hosted. Reference them directly via their Cloudinary URLs in `<video>` tags (for the final production deploy, consider downloading and self-hosting under `/assets/video/` to remove the external dependency).

| # | Name | URL | Placement |
|---|---|---|---|
| 1 | Brand Film | `https://res.cloudinary.com/dtctcaxxr/video/upload/v1782998580/Plastic_bottle_becomes_flower_vase_202607021922_ntnhil.mp4` | Opening cinematic, Section: Brand Film |
| 2 | Care in the Making | `https://res.cloudinary.com/dtctcaxxr/video/upload/v1783002847/Hands_making_product_with_logo_202607022033_dkycep.mp4` | Our Story / Craftsmanship section |
| 3 | The Loop | `https://res.cloudinary.com/dtctcaxxr/video/upload/v1783002917/Bottle_particles_reform_into_bottle_202607022034_ijnu6z.mp4` | Sustainability section, ambient background |
| 4 | The Leaf Chair | `https://res.cloudinary.com/dtctcaxxr/video/upload/v1783003180/Outdoor_lounge_chair_rotates_202607022039_tuaqnd.mp4` | Product Showcase, flagship hero card |

---

## 4. LOGO HANDLING

The official logo asset is supplied as **`trLogo.png`** — a clean, transparent-background PNG (leaf-and-globe mark + wordmark + "Plastics" + Bengali tagline). Use this file directly, unaltered, wherever a static logo placement is needed: the Hero section, the Brand Film → Hero morph target, and the Footer. Do not regenerate, redraw, or reinterpret its shape or colors.

The one exception is the **Preloader's stroke-draw-on animation (Section 5.0)**, which requires true vector path data that a PNG cannot provide. For that single instance only, hand-code a simplified SVG line-art version of just the leaf-pair silhouette — matching `trLogo.png`'s proportions and colors closely enough to clearly read as the same mark — so it can animate via `stroke-dashoffset`. This simplified version only needs to capture the twin-leaf outline, not every internal detail.

Since the site is English-only, do not add or translate Bengali text anywhere else on the site — the tagline already exists as part of the logo artwork itself, and that's the only place it should appear.

---

## 5. SECTION-BY-SECTION SPECIFICATION

Section order: **Preloader → Brand Film → Hero → Our Process → Product Showcase → Our Story → Sustainability → Global Reach → Contact → Footer**

### 5.0 Preloader
Quick — 2–3 seconds maximum, cream background. The logo's leaf icon draws itself via SVG `stroke-dashoffset` animation, alongside a small percentage counter (0→100%) in the bottom corner. On completion, the entire preloader wipes away (clip-path reveal) to expose the Brand Film section beneath.

### 5.1 Brand Film
Full-bleed `<video>`, autoplay, muted, `playsinline`, using Video 1's URL. A small unmute toggle sits bottom-right; a "Skip" text link fades in bottom-left after ~1 second. When the video ends (or Skip is clicked), trigger a transition where the video scales/fades down while the Hero section fades up beneath it — critically, animate the video's final on-screen logo position so it morphs (via a FLIP-style coordinated transform) directly into the Hero section's actual logo element position. This should read as one continuous motion, not a hard cut.

### 5.2 Hero (pinned)
Big cinematic headline, revealed word-by-word/character-by-character as the section pins. The logo lands exactly where the Brand Film's closing frame positioned it (see 5.1). Two SVG fanned-leaf illustrations sit at the bottom-left and bottom-right corners of the viewport — hand-code these to match the logo's leaf shape language (curved twin-leaf silhouettes with fine vein linework), in the site's palette. As the user scrolls through the pinned section, the leaves fan further open and rotate, cinematically revealing more supporting text beneath the main headline as they do.

**Copy:**
- Eyebrow tag: `RECYCLED. REIMAGINED. RELIABLE.`
- Headline: **"What The World Throws Away, We Build Life Around."**
- Sub-headline (revealed as the leaves fan open further): "TEL Plastics turns discarded plastic into furniture and everyday essentials — engineered for real homes, priced for real life, without ever compromising on quality."
- CTA button: `See The Journey` (scrolls to Our Process) and/or `View Our Work` (scrolls to Product Showcase)

### 5.3 Our Process (pinned)
Five steps — **Collect → Sort → Shred → Mold → Deliver** — as hand-coded SVG icons in a consistent line-art style matching the leaf motif, connected by a single flowing path/line that draws itself progressively as the user scrolls through the pinned section. Each icon scales/pops in with an elastic ease exactly as the drawing line reaches it, accompanied by a short caption.

**Copy per step:**
1. **Collect** — "Every piece starts as something someone else let go of."
2. **Sort** — "Sorted by hand and by care, not just by category."
3. **Shred** — "Broken down to its rawest form, ready to be reborn."
4. **Mold** — "Shaped with precision into something built to last."
5. **Deliver** — "Finished. Functional. Far from waste."

### 5.4 Product Showcase (free-scroll, with contained horizontal mechanic)
This section briefly pins while vertical scroll input drives horizontal `translateX` movement across a row of floating product cards, then releases back into normal vertical flow once the row is exhausted.

**Card behavior — this must NOT read as a standard grid:**
- Cards float with a continuous idle vertical bob (a sine-based loop), staggered per card so they never move in unison — an organic, alive feel.
- Cursor-proximity 3D tilt: cards near the pointer tilt toward it using real `perspective` + `rotateX`/`rotateY` transforms based on cursor position relative to the card's center — not a fake CSS box-shadow hover trick.
- On first reveal, each card **assembles** into place: its image, label, and any secondary elements start from scattered offset positions and converge into final layout with staggered elastic easing — never a simple fade or slide-in.
- One flagship card — **The Leaf Chair** — uses Video 4 instead of a static image, autoplay-muted-loop, otherwise styled identically to the other cards.

**Product list (generate images per the house style brief below):**

**House style brief for image generation** *(paste before every product prompt)*: "Soft-dimensional 2D vector illustration, consistent with the site's video language — clean rounded forms, gentle soft shading and highlights, not flat clip-art and not photorealistic CGI. Warm cream (#FAF7F0) studio backdrop with a soft circular sage-green (#8DC63F) gradient glow beneath the product acting as a pedestal. Single consistent soft overhead-left light source across all images. Generous negative space, no background clutter, no on-image text. Include a small embossed TEL leaf-icon maker's mark subtly visible on the product's base or handle."

1. **The Leaf Chair** (flagship) — a single-piece molded outdoor lounge chair, continuous sculptural silhouette with no visible seams or hardware. Matte soft-touch sage-green finish, warm cream-toned base and legs. Backrest features two flowing curved vertical vents echoing a twin-leaf motif. Rounded ergonomic seat, gentle recline, subtle stacking lip at the base.
2. **Modular Storage Crate** — stackable, interlocking crate with a woven-texture lid pattern.
3. **Communal Dining Table** — long rectangular table, softly rounded corners, a subtle leaf-vein grain texture pressed into the tabletop surface.
4. **Garden Bench** — curved two-seater bench with a slatted, leaf-motif backrest.
5. **Study Stool** — compact round stool with a single continuous molded leg form.
6. **Kids' Furniture Set** — a small chair-and-table pair in playful rounded shapes, slightly brighter secondary accent color.
7. **Woven-Style Laundry Basket** — tall basket with a molded basket-weave surface texture.
8. **Kitchen Container Set** — nested, stackable containers with soft push-fit lids.
9. **Bucket & Mug Set** — a matching bucket-and-mug pair with a subtle leaf-embossed handle detail.
10. **Multipurpose Bin** — pedal-lid bin with a rounded, soft silhouette.

Generate one image per product at a consistent aspect ratio (e.g. 4:5) for grid harmony.

### 5.5 Our Story / Craftsmanship (sticky-split, free-scroll)
Split layout: one side is sticky-pinned, containing Video 2 (Care in the Making) inside a soft rounded claymorphism video-frame — autoplay-muted-loop when scrolled into view, with a small unmute toggle. The other side scrolls copy past it, revealed line by line as it enters view.

**Copy:**
- Eyebrow: `OUR STORY`
- Heading: **"Built By Hand, Backed By Purpose."**
- Body: "TEL Plastics began with a simple belief: that what's discarded doesn't have to be wasted. Every product we make starts its life as something someone else threw away — and ends it as furniture built to hold a family, or a container that holds a home together. We test, inspect, and refine every piece by hand, because affordable should never mean disposable."

### 5.6 Sustainability (free-scroll)
Video 3 (The Loop) plays as a full-bleed ambient background, muted autoplay loop, blended at low opacity into the cream background so it never competes with foreground content. In the foreground: organic, seed-pod/leaf-shaped value cards (soft blob forms with claymorphism shadows) that "sprout" into view with an elastic scale-in as the user scrolls, connected to one another by a thin animated vine/root line that draws progressively between them.

**Copy (meaningful statements — no invented statistics):**
- "Every product we make begins as plastic that would have otherwise lived in a landfill for centuries."
- "We choose durability over disposability — built to be used for years, not thrown away in months."
- "Affordable by design, not by corner-cutting — because sustainability should never be a luxury."
- "Local materials, local hands, local impact — every piece supports a community, not just a customer."

### 5.7 Global Reach (free-scroll)
A stylized, hand-coded SVG/CSS world-map visual (not a literal embedded Google Map) with soft dotted pins over a few representative regions, each with a subtle pulsing glow animation; hovering a pin reveals a small tooltip.

**Copy:**
- Heading: **"Rooted In Bangladesh. Reaching Further."**
- Supporting line: "Built to meet international standards of quality and consistency — because sustainable manufacturing shouldn't stop at any border."

### 5.8 Contact / CTA
A strong closing beat — brief pin acceptable here for a decisive final moment. Large closing statement paired with contact details/form, styled consistently with the claymorphism card language established earlier.

**Copy:**
- Heading: **"Let's Build Something That Lasts."**
- CTA button: `Get In Touch`
- Contact fields: email, phone, and social links (placeholder values, clearly marked for the client to fill in with real details)

### 5.9 Footer
Minimal — logo, nav links, social icons, copyright line — styled consistently, with a subtle grain/leaf-motif divider separating it from the Contact section above.

---

## 6. ACCESSIBILITY & PERFORMANCE GUARDRAILS

- Full `prefers-reduced-motion` fallback path: disable pinning, replace elastic/staggered reveals with simple opacity fades.
- All interactive elements (buttons, nav dots, unmute toggles) must be keyboard-focusable with visible focus states.
- Videos must never autoplay with sound (browser policy also enforces this) — always start muted with an explicit unmute control.
- Alt text on all generated product images, describing the product itself.

---

## 7. WHAT "AWE-MAKING" MEANS HERE — A GUARDRAIL, NOT A SUGGESTION

Before shipping any section, check it against this: **would a Bangladeshi corporate client who has seen a hundred generic agency demos stop and say "wait, how did they do that?"** If a card is just a rounded box with an icon, a title, and a description sitting in a static grid — that's the default to avoid, not a placeholder to accept. Every reveal, hover, and transition in this document has been specified with a reason; don't substitute a simpler generic version of any of them for convenience.

---

## 8. BUILD PHASES — EXECUTE IN THIS ORDER

1. **Phase A:** Scaffold the file structure, import fonts/libraries, establish the CSS design-token system (Section 2), build the vectorized logo asset (Section 4), and set up global infrastructure — Lenis + ScrollTrigger initialization, magnetic cursor, grain overlay, scroll-progress rail shell.
2. **Phase B:** Build Preloader → Brand Film → Hero, including the full logo-morph handoff between them. This is the highest-stakes phase — get the "wow" of the opening exactly right before moving on.
3. **Phase C:** Build Our Process.
4. **Phase D:** Build Product Showcase, including generating all 10 product images per the house-style brief.
5. **Phase E:** Build Our Story, Sustainability, and Global Reach.
6. **Phase F:** Build Contact and Footer, then do a full polish pass — smooth every cross-section transition, verify performance (all animation on transform/opacity only), and implement the reduced-motion fallback path.

After each phase, self-review against this document before proceeding to the next. Do not move forward with a section that falls back to generic patterns explicitly ruled out in Section 7.
