# Juno — design tokens

Every value below is taken from the final design file (`reference/Juno Redesign.dc.html`). Nothing here is aspirational; if a token is listed, it is used in the mocks.

Naming is a suggestion. Match your codebase's existing convention (Tailwind theme keys, CSS custom properties, a `tokens.ts` — whatever you already have). **Do not introduce a second token system alongside one you already have.**

---

## 1. Color

### Surfaces (warm neutral canvas)

| Token | Hex | Use |
|---|---|---|
| `--juno-canvas` | `#FAF6F0` | Page background. The one warm base. |
| `--juno-surface` | `#FFFFFF` | Primary cards, panels, chat bubbles from Juno, quiz options (unselected). |
| `--juno-surface-sunken` | `#F3EDE4` | Section backgrounds that group cards (e.g. "À essayer sans trop s'engager"), secondary panels. |
| `--juno-surface-warm` | `#F6EFE5` | Juno message bubble on light backgrounds, suggestion chips. |
| `--juno-immersive` | `#241C18` | Dark immersive surfaces: Juno panel, "Pourquoi Juno" block, journey synthesis screen. |
| `--juno-desk` | `#E8E1D6` | **Canvas backdrop only** — the grey-beige behind the screen frames in the design doc. Not an app surface. Do not implement. |

The old app's problem was cream-on-cream-on-cream. The rule now: **canvas `#FAF6F0` → surface `#FFFFFF`.** A card sitting on a card is a bug. If you need a third level, it is `#F3EDE4` as a *section wrapper* holding white cards — never a card inside a card.

### Text

| Token | Hex | Use |
|---|---|---|
| `--juno-ink` | `#221C18` | All headings, card titles, primary body. |
| `--juno-ink-body` | `#4A433D` | Long-form body copy inside cards. |
| `--juno-ink-secondary` | `#58504A` | Sub-headings, page subtitles, secondary descriptions. |
| `--juno-ink-muted` | `#6B625B` | Metadata lines, inactive nav, helper text. |
| `--juno-ink-soft` | `#8A817A` | Field labels, counts, dates. Lowest allowed on white. |
| `--juno-ink-label` | `#A0958A` | Uppercase eyebrow labels only, at 700–800 weight. Never for sentences. |

`#A0958A` at 12px/800 uppercase passes because of weight and tracking. **Do not use it below 12px or at weight < 700.** No text in this system is lighter than `#A0958A`, and no body copy is lighter than `#6B625B`.

### Borders

| Token | Hex | Use |
|---|---|---|
| `--juno-hairline` | `#EDE5DA` | Default card border, header border. |
| `--juno-border` | `#E3D9CC` | Pills, inputs, slightly stronger definition. |
| `--juno-border-strong` | `#DCD1C1` | Secondary button outline, screen frame. |
| `--juno-divider` | `#F2EBE1` | Row separators inside a card (weekly task rows). |
| `--juno-control-idle` | `#DCD2C6` | Unchecked radio / checkbox ring, 2px. |

### Brand — one signature color

| Token | Hex | Use |
|---|---|---|
| `--juno-coral` | `#E1503A` | **The Juno color.** Primary CTAs, selected states, progress fill, active indicators, send button, user chat bubble. |
| `--juno-coral-ink` | `#B93A26` | Coral as *text* on light surfaces (links, "Tout découvrir →"). Needed for contrast; `#E1503A` text on white is too light. |
| `--juno-coral-ink-hover` | `#8E2A19` | Link hover. |
| `--juno-coral-tint` | `#F6E4DF` | Coral chip / active nav pill background. |
| `--juno-coral-select` | `#FDF1EF` | Selected quiz option / scenario card background. |
| `--juno-coral-glow` | `#F8B39A` | Light end of the Juno orb gradient; emphasis text on dark. |

Coral is the only color that means "act". A theme color never becomes a button.

### Theme colors

Five themes. Each has a solid (large blocks, tags, progress), a tint (image blocks, soft cards), and an ink (labels on the tint).

| Theme | Solid | Tint | Ink on tint |
|---|---|---|---|
| Ma vie sociale | `#D6455E` | `#FBE6E9` | `#A82B44` |
| Rester actif | `#2F7D5B` | `#E1EFE4` | `#216245` |
| Nouveau rythme | `#3563C9` | `#E3EAF8` | `#24499C` |
| Apprendre | `#6D4AC4` | `#EDE4FA` | `#5B3FA8` |
| S'engager | `#C98A16` | `#F7EBD8` | `#8A5D0A` |

Rules: at most **two** theme hues visible in one viewport (the Découvrir collection grid in `1d` is the one deliberate exception — it is a color-coded index). Themes decorate; they never replace coral for an action.

### State

| Token | Hex | Use |
|---|---|---|
| `--juno-success` | `#2F7D5B` | Completed task check-circle fill, "Fait lundi", completion screen. Same green as Rester actif — intentional, one green in the product. |
| `--juno-strike` | `#D6CDC2` | `text-decoration-color` on completed task titles. |
| Selected (option) | bg `#FDF1EF` + 2px border `#E1503A` | Quiz / scenario / bilan selection. |
| Unselected (option) | bg `#FFFFFF` + 2px border `#EDE5DA` | Note: 2px in **both** states so nothing shifts on select. |
| Active nav (1a) | 3px `#E1503A` underline, 20px below the label | |
| Active nav (1b) | pill bg `#F6E4DF`, text `#B93A26` | |

### Juno character

| Token | Value |
|---|---|
| Orb fill | `radial-gradient(circle at 32% 28%, #F8B39A, #E1503A 72%)` (74% on larger sizes) |
| Eyes | `#3A1B12`, rounded pills, `border-radius: 50%/4–6px`, positioned at `top 40–41%`, `left 28–29%` and `left 57–58%` |
| Glow (dark bg) | `box-shadow: 0 10px 26px rgba(225,80,58,.42)`; large: `0 18px 50px rgba(225,80,58,.45)` |
| Ambient halo | `radial-gradient(circle, rgba(225,80,58,.32–.45), transparent 66–68%)`, 190–460px, bleeding off-corner |

Sizes in use: 21–26px (nav/inline), 32–34px (chat message, "pourquoi Juno"), 44px (chat header), 50–54px (home panel), 60px (bilan), 96px (journey synthesis).

---

## 2. Typography

Two families. Both on Google Fonts.

```
Newsreader        400, 500      — display only
Plus Jakarta Sans 400,500,600,700,800 — everything else
IBM Plex Mono     500           — placeholder labels in the mock ONLY (see note)
```

**Implementation:** self-host via `@fontsource/newsreader` and `@fontsource/plus-jakarta-sans` (or your existing font pipeline) rather than the Google CDN — you already have a build step, and CLS on a 60–75 audience matters. Load Newsreader 500 and Jakarta 400/600/700/800; you can drop 500. Newsreader is an optical-size variable font: set `font-optical-sizing: auto`.

**IBM Plex Mono is not a product font.** It appears only on the grey placeholder labels ("photo · atelier") that mark where real photography goes. When real images land, the font leaves the product. Do not add it to the bundle.

### Scale

| Role | Family / weight | Size | Line height | Tracking | Where |
|---|---|---|---|---|---|
| Display L | Newsreader 500 | 44px | 1.08–1.1 | -0.02em | Page titles ("Découvrir", "Bonjour Claire.") |
| Display M | Newsreader 500 | 40px | 1.14 | -0.02em | Journey editorial statement, "Votre semaine, Claire" (1b) |
| Display S | Newsreader 500 | 34–38px | 1.12–1.2 | -0.02em | Resource detail title, journey synthesis, completion |
| Question | Jakarta 800 | 34px | 1.2–1.22 | -0.025em | Quiz + bilan questions (sans, not serif — these must feel direct) |
| Section | Jakarta 800 | 27px | 1.2 | -0.02em | "Pour vous", "Recommandé pour vous" |
| Section S | Jakarta 800 | 25px | 1.2 | -0.015em | In-card section titles ("Votre semaine") |
| Card title L | Jakarta 800 | 23–24px | 1.2 | -0.02em | Theme cards, collection tiles |
| Card title | Jakarta 800 | 20–21px | 1.25 | -0.015em | Resource card titles |
| Card title S | Jakarta 800 | 18–19px | 1.3 | 0 | Compact cards, panel titles |
| Row title | Jakarta 700 | 19px | 1.35 | -0.01em | Weekly task rows, quiz option labels |
| Body L | Jakarta 400 | 19–20px | 1.5–1.6 | 0 | Page subtitles, journey paragraphs, chat messages (18) |
| Body | Jakarta 400 | 17–18px | 1.5–1.6 | 0 | Card descriptions, practical info |
| Body S | Jakarta 400 | 16px | 1.45–1.5 | 0 | Dense card copy |
| Meta | Jakarta 400/600 | 15px | 1.4 | 0 | "Lille-Centre · Petit groupe · Mardi", dates |
| Meta S | Jakarta 600/700 | 14px | 1.4 | 0 | Counts, timestamps, orb sub-label |
| Label | Jakarta 800 | 12–13px | 1.3 | 0.09–0.11em, uppercase | Eyebrows: "APPRENDRE", "PARCOURS EN COURS" |

**Floors:** body never below 16px, metadata never below 14px, labels never below 12px. Weight never below 400. This is the accessibility budget — hold it.

Apply `text-wrap: pretty` to headings and short paragraphs (it is on the display and card titles in the mocks).

---

## 3. Spacing

Base unit 4px, but the design uses a coarse practical scale. Actual values in use:

```
4  8  10  12  14  16  18  20  22  24  26  30  34  40  46  54  68
```

| Context | Value |
|---|---|
| Page gutter (desktop) | 36–40px |
| Max content width | 1240px |
| Main / side column gap | 26–28px |
| Gap between major sections | 46–54px |
| Card padding (standard) | 24px |
| Card padding (feature, e.g. Votre semaine) | 30–34px |
| Card padding (compact / in-chat) | 17–19px |
| Image-block → text gap | 12–14px |
| Card grid gap | 18–22px |
| Weekly task row padding | 21–22px vertical, 2–4px horizontal (inside a padded card) |
| Weekly task row internal gap | 18–20px |
| Overlay / modal padding | 30px top, 38px sides, 38px bottom |
| Overlay: progress bar → content | 42–68px |
| Quiz option padding | 20–24px |
| Quiz option gap | 12px |
| Button padding | 15–19px vertical, 22–28px horizontal |
| Pill padding | 12px vertical, 20–22px horizontal |
| Input padding | 7px, with 22px left inset (round input, 46px inner button) |

Header height: **76px** (74px inside the mock frames — use 76).

---

## 4. Radius

| Token | Value | Applies to |
|---|---|---|
| `--r-overlay` | 26px | Journey overlay, chat board, screen frames |
| `--r-card-lg` | 24–26px | Feature cards ("Votre semaine"), collection tiles |
| `--r-card` | 20–22px | Resource cards, theme cards, section wrappers |
| `--r-card-sm` | 16–18px | Compact cards, in-chat cards, quiz options (18) |
| `--r-media` | 18–20px | Image blocks (14px for small square thumbs) |
| `--r-inset` | 14px | Metadata tiles, priority rows in 1b |
| `--r-bubble` | `18px 18px 18px 6px` (Juno) / `18px 18px 6px 18px` (user) | Chat bubbles — the clipped corner points at the speaker |
| `--r-pill` | 999px | Buttons, pills, inputs, chips, avatars |
| `--r-bar` | 3–4px | Progress bars |

Nothing in Juno is square-cornered.

---

## 5. Shadow

Three, and only three.

```css
/* Resting card — barely there, just lifts white off cream */
--shadow-card: 0 1px 2px rgba(34,28,24,.04), 0 20px 44px -34px rgba(34,28,24,.30);

/* Overlay / modal / any floating board */
--shadow-overlay: 0 30px 60px -40px rgba(34,28,24,.40);

/* Card hover */
--shadow-card-hover: 0 22px 44px -26px rgba(34,28,24,.34);
```

Plus the Juno orb glow (see Juno character above) — that is a brand element, not an elevation.

Shadows are warm-black (`rgba(34,28,24,…)`), never neutral grey. Most cards in the design carry **no shadow at all** — a 1px `#EDE5DA` border does the work. Reserve shadow for: the weekly card, floating overlays, and hover.

---

## 6. Motion

Deliberately restrained. Only one thing in the design animates on its own.

| Name | Spec | Where |
|---|---|---|
| Juno breathe | `transform: scale(1) → scale(1.05)`, 5.5s, `ease-in-out`, infinite alternate | Every Juno orb ≥ 44px. The character is alive; nothing else pulses. |
| Card hover | `transform: translateY(-3px)` + `--shadow-card-hover`, 200ms `ease-out` | Resource / recommendation cards |
| Control + pill hover | `background` shift, 160–180ms `ease-out` | Nav items, pills, checkboxes |
| Selection | 140ms `ease-out` on `background` and `border-color`. Border is 2px in both states, so **no layout shift** | Quiz, scenario, bilan options |
| Task completion | Circle fills `#2F7D5B` over 200ms, check strokes in over 220ms `ease-out`, title crossfades to `#8A817A` + strikethrough. Row **does not move**. | Weekly task rows |
| Overlay enter | Backdrop fade `rgba(34,28,24,0 → .45)` 220ms; panel `opacity 0→1` + `translateY(12px → 0)` 280ms `cubic-bezier(.16,1,.3,1)` | Journey overlay, chat overlay |
| Overlay exit | Reverse, 180ms `ease-in` | |
| Journey step advance | Outgoing `opacity → 0` + `translateY(-8px)` 160ms; incoming `opacity 0→1` + `translateY(10px)` 240ms. Progress bar segment fills over 300ms `ease-out`. | Between the 5 journey screen types |
| Carousel scroll | Native `scroll-behavior: smooth` + `scroll-snap-type: x mandatory` | Découvrir browse rows |
| Completion screen | Green circle scales `.9 → 1` 260ms `cubic-bezier(.34,1.56,.64,1)`, check draws over 240ms, satellite dots fade in 80ms-staggered. **Once. No confetti, no replay.** | Journey completion |

Wrap everything in `@media (prefers-reduced-motion: reduce)` — including the Juno breathe. Fall back to static, not to a shorter animation.

**No gamification motion.** No XP counters, streak flames, badge reveals, or celebratory bounce beyond the single completion easing above.
