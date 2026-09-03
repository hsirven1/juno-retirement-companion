# Handoff: Juno visual redesign

## Overview

A visual redesign of Juno, the personalized retirement companion. Same product model, same architecture, new visual system: a warm neutral canvas, one signature coral, five controlled theme colors, image-led resource discovery, and guided journeys that use seven distinct screen templates instead of one repeated cream modal.

The old app's problems were named precisely: too beige, too uniform, too text-heavy, too card-heavy, too quiet, too repetitive. This redesign addresses each by introducing real surface contrast, a recognizable brand color, photography-led discovery, and immersive moments inside guided journeys — while keeping the base application calm.

**Scope:** visual identity, hierarchy, layout, interaction design, component styling, color, imagery, guided experiences, resource discovery.

**Explicitly out of scope:** product architecture, routing, state, i18n plumbing, journey content and branching, resource data, recommendation logic. Those stay exactly as they are.

## About the design files

The file in `reference/Juno Redesign.dc.html` is a **design reference created in HTML** — a static prototype showing intended look, hierarchy, and component anatomy. It is not production code and it is not a frontend to port.

The task is to **recreate these designs inside the existing Juno React/Vite codebase**, using its established patterns, component structure, styling approach, and libraries. Every screen in the file is a static frame with hardcoded French content, inline styles, no routing, no state, and no responsive behavior. Read it for values and structure; build in your own idiom.

Concretely: no file from this bundle should be copied into `src/`. The markdown docs are the specification; the PNGs are the visual target; the HTML is a lookup table for exact declarations.

## Fidelity

**High-fidelity.** Desktop is fully drawn; four key mobile screens (390px) are now drawn as well.

Colors, typography, spacing, radii, shadows, and component anatomy are final and should be matched precisely — the values are all documented in `design-tokens.md`, so there is no need to eyedrop the PNGs.

Two caveats, both important:

1. **Mobile is drawn for four screens, not all of them.** Accueil, Découvrir, the guided journey overlay, and Juno chat are drawn at 390px (`juno-*-mobile.png`) and are the source of truth for mobile layout, navigation, and stacking. Resource detail, Mon parcours, and the bilan remain written specification only — `responsive-spec.md` covers them in enough detail to build from, but nobody has looked at a rendered screen for those three. Build them, screenshot them, and get them reviewed.
2. **The prototype is static.** No hover, focus, selection, or transition state is interactive in the file. All of those are specified in `component-spec.md` and `design-tokens.md` (§6 Motion) instead. Focus rings in particular are specified but not shown — they must be implemented.

Image areas throughout are theme-colored blocks with a small monospace label naming what belongs there ("photo · atelier"). Those are honest placeholders for real photography, not a visual style. See `implementation-notes.md` Part 2.

## Direction — decided

**Accueil:** `1a` "toile chaude" — white cards on ivory, coral reserved for actions, Juno in a dark panel.

**Découvrir:** a combination — `1d`'s large color-coded intent tiles as the page header, over `1c`'s editorial curated rows.

The four mobile screens implement exactly this combination; there is no remaining direction decision.

## Documents in this bundle

Read in this order.

| File | What it covers |
|---|---|
| **`design-tokens.md`** | Every color, type step, spacing value, radius, shadow, and motion spec. Start here — it is the foundation for everything else. |
| **`component-spec.md`** | All 29 components: anatomy, states, dimensions, mobile behavior, and whether each is a **restyle** of something you already have or genuinely **new**. Only nine are new. |
| **`responsive-spec.md`** | Breakpoints and layout behavior at desktop, tablet, and mobile. Written spec, not drawn screens. |
| **`implementation-notes.md`** | Screen-by-screen changes and what to preserve; asset inventory; the reuse / reference-only / do-not-copy split; export checklist; work order; how to brief Cursor. |

## Screens

Seventeen reference PNGs in `reference/` — thirteen desktop, four mobile. Full descriptions of each are in `implementation-notes.md` Part 1 (desktop) and `responsive-spec.md` §6–7 (mobile).

| Screen | Desktop reference | Mobile reference |
|---|---|---|
| Accueil | `juno-home-desktop.png` (`1a`, approved) | `juno-home-mobile.png` |
| Découvrir | `juno-discover-desktop.png` (`1c`) + `juno-discover-collections.png` (`1d`) — approved combination | `juno-discover-mobile.png` |
| Resource detail | `juno-resource-detail.png` | not drawn — see `responsive-spec.md` |
| Mon parcours | `juno-my-journey.png` | not drawn — see `responsive-spec.md` |
| Guided journey | `juno-guided-step-editorial.png`, `-quiz.png`, `-scenario.png`, `-insight.png`, `-completion.png` | `juno-journey-mobile.png` (one representative step) |
| Parler à Juno | `juno-chat-overlay.png` | `juno-chat-mobile.png` |
| Bilan / onboarding | `juno-bilan-question.png` | not drawn — see `responsive-spec.md` |
| Design system | `juno-design-system.png` | — |

**Mon profil was not designed** — it was not in the brief's screen list. `implementation-notes.md` §9 gives enough guidance to restyle it consistently without new design work.

## Design tokens at a glance

Full detail in `design-tokens.md`. The eight values that define the system:

```
canvas          #FAF6F0    warm ivory page background
surface         #FFFFFF    cards, panels
sunken          #F3EDE4    section wrappers holding white cards
immersive       #241C18    Juno panels, insight, dark journey screens
coral           #E1503A    THE Juno color — CTAs, selection, progress
coral-ink       #B93A26    coral as text on light (contrast)
ink             #221C18    all headings and primary text
hairline        #EDE5DA    default card border
```

Themes: `#D6455E` social · `#2F7D5B` actif · `#3563C9` rythme · `#6D4AC4` apprendre · `#C98A16` engager.

Type: **Newsreader** 500 for display (sparingly) + **Plus Jakarta Sans** 400/600/700/800 for everything else. Both on Google Fonts; self-host via `@fontsource`.

## Assets

**Almost none, deliberately.** The Juno character is a CSS radial gradient plus two rounded divs. Every illustration is composed of CSS circles and rings. Every glyph is a CSS shape or should come from your existing icon library. Nothing in this bundle needs an `/assets` folder.

The one real requirement is **resource photography** — 16:10 WebP for cards, 3:2 for detail heroes, real images of the actual activities. Without it, Découvrir reverts to feeling like a municipal directory and half the brief fails. Full spec in `implementation-notes.md` Part 2.

## Non-negotiables

The audience is 55–75+. These are requirements, not preferences, and the prototype does not demonstrate all of them:

- **44px minimum** hit target on everything interactive
- **16px minimum** body text, **14px minimum** metadata; body never shrinks on mobile
- No text lighter than `#8A817A`; body text no lighter than `#6B625B`
- Visible focus rings everywhere: 3px `rgba(225,80,58,.35)`, 2px offset — **specified but not shown in the mocks; you must add them**
- `prefers-reduced-motion` honoured, including the Juno breathe animation
- No fixed heights on anything containing text — French copy runs ~20% longer than English, and every component here was measured against French
- Selection states use a 2px border in *both* states so nothing shifts

It should feel like a premium modern consumer app that happens to be very accessible — never like accessibility software.

## Where to start

1. Read all four markdown docs.
2. Decide `1a`/`1b` and `1c`/`1d`.
3. Land the tokens and load the fonts.
4. Restyle the primitives.
5. Accueil, then review before going further.

`implementation-notes.md` Part 7 has the full seven-step work order and a ready-to-paste opening prompt for Cursor.

The single most likely failure mode is an agent creating new components alongside your existing ones instead of restyling them. `component-spec.md` marks every component as **New** or **Restyle** specifically to prevent that. Hold the line on it.
