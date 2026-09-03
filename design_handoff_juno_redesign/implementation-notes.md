# Juno — implementation notes

Screen-by-screen changes, asset inventory, and what to reuse versus recreate.

Companion docs: `design-tokens.md`, `component-spec.md`, `responsive-spec.md`.

---

# Part 1 — Screen by screen

For each screen: what changed, what to leave alone, which components it uses.

---

## 1. Accueil / Home

**Two directions were designed. Pick one before writing code.**

- **`1a` "toile chaude"** — white cards on ivory, coral reserved for actions, Juno in a dark panel. Calmer, more premium, closer to what you have, cheapest to implement.
- **`1b` "couleur en tête"** — the week sits on a solid coral block, recommendations become large theme-colored tiles, Juno is a light card. More energy, more personality, further from the current app.

They are not mergeable — the coral block in `1b` and the white week card in `1a` are the same slot. `1b` answers the "too beige, too quiet" brief more directly; `1a` is safer. The rest of this document assumes whichever you pick; where they differ materially I say so.

### What changed
- Architecture is **unchanged**: left column = Votre semaine → Recommandé pour vous; right column = Parler à Juno → Vos priorités. Exactly as briefed.
- Real contrast: white surfaces on an ivory canvas instead of four beiges. Every cream-inside-cream nesting is gone.
- Greeting is Newsreader 44px; the date is a proper eyebrow label; an active-journey chip appears top-right.
- **Votre semaine** is now the visual anchor — a shadowed white card (or a coral block in `1b`) with 34px checks, theme-dotted eyebrows per row, and a row-specific action. Completed rows keep their position and gain a green check plus a strikethrough title.
- **Parler à Juno** went from a card with a link to a **miniature live conversation** on a dark surface: 50px breathing orb, a real message referencing the user's profile, two quick replies, and a working-looking input. This is the largest single change on the screen.
- **Recommandé pour vous** went from text rows to image-first cards with a real hierarchy: category eyebrow → title → provider → `place · format · rhythm` → one useful sentence. `1b` promotes one to a large theme-colored feature tile.
- **Vos priorités** stays compact — 9px theme dot, label, status. No progress bars, no cards.

### Preserve
Column architecture, the "only a few next steps" rule (3 items, never a backlog), the completion model, priorities as context. All the data, all the logic.

### Components
`WeekCard`, `WeeklyTaskRow`, `TaskCheck`, `EyebrowLabel`, `SectionHeader`, `ResourceCard`, `CollectionTile` (`1b` only), `JunoChatPreview`, `JunoOrb`, `ChatBubble`, `SuggestionChip`, `JunoInput`, `PriorityRow`, `PrimaryButton`, `SecondaryButton`, `TextLink`.

### Assets
Two resource photographs. Nothing else — the orb and all decoration are CSS.

---

## 2. Mon parcours / My journey

### What changed
- The active journey gets a full-width white card: theme eyebrow, "Semaine 2 — Comprendre" at 30px/800, a one-line description, a coral **Reprendre**, and a 6-segment progress bar with the three phase labels beneath (Comprendre / Définir ce qui me convient / Passer à l'action).
- Other themes become **theme-tinted cards** with an abstract circle composition, a status eyebrow ("Prêt à démarrer", "Suggéré ensuite", "Disponible"), duration + weekly time, and a white pill CTA. Four across.
- The point: after a few weeks the user recognizes coral-pink as social, green as activity, violet as learning — without reading.

### Preserve
Phase model, week numbering, which journeys are unlocked or suggested, all sequencing logic.

### Components
`ThemeCard`, `JourneyProgressBar`, `EyebrowLabel`, `PrimaryButton`, `SectionHeader`.

### Assets
None. Compositions are CSS circles.

---

## 3. Découvrir / Discover

**Two directions here too.**

- **`1c` "éditoriale"** — category pills, then curated rows with a personalized subtitle per row. Image-first cards with almost no chrome. Closest to a magazine.
- **`1d` "collections"** — opens with six large color-coded collection tiles phrased as intents ("Rencontrer des gens près de chez moi"), then one row of real nearby resources.

These **are** combinable, and probably should be: `1d`'s tiles as the top-of-page entry, `1c`'s curated rows below. That gives a browse-by-intent header over an editorial body. If you want the cheaper path, ship `1c` alone.

### What changed
- Page title in Newsreader with a real subtitle ("Des idées choisies pour vous à Lille.").
- Category pills with an **ink-filled** active state (`#221C18`), not coral — coral stays for actions.
- Sections carry a **reason**: "Parce que vous cherchez à rencontrer de nouvelles personnes." That sentence is what separates curation from search. Wire it to real profile data or cut it.
- Sections differ from each other visually: borderless cards on canvas, then a `#F3EDE4` wrapper holding white cards, then horizontal compact cards. Same components, different rhythm.
- Every card is image-led with the `place · format · commitment` triad.
- No filter sidebar, no result counts, no sort dropdown. This is a browse surface.

### Preserve
Resource data, category taxonomy, recommendation ranking, geography/radius logic, search.

### Components
`Pill`, `SectionHeader`, `ResourceCard`, `ResourceCardCompact`, `CollectionTile`, `MediaBlock`, `TextLink`.

### Assets
The bulk of the photography — 10–14 images at this page's density.

---

## 4. Resource detail

Designed as a **page** in the mock. If it is a modal in your app today, keep it a modal — the layout works either way. Just give it real width (≥1040px content) and the two-column split.

### What changed
- Airbnb-style hierarchy: gallery left (hero + two thumbs), decision column right.
- Right column: category eyebrow → Newsreader 38px title → provider → short description → **2×2 meta tiles** (Rythme / Format / Engagement / Coût) → `InsightPanel` → CTAs.
- **"Pourquoi Juno vous le propose"** is a dark panel with the orb and coral-highlighted emphasis. It is the single most visually distinct element on the page, by design — this is Juno's coaching layer showing up in a discovery context, and it is what stops the page from being Airbnb.
- Practical information is a clean label/value list with hairline dividers, not a metadata dump. Source is credited as one line.
- CTAs: "Ajouter à ma semaine" (coral) + "Plus tard" (outline), with "ou en parler à Juno avant de décider" underneath — the escape hatch for someone not ready to commit.

### Preserve
Resource schema, source attribution, add-to-week logic, similar-resources query.

### Components
`MediaBlock`, `MetaTile`, `InsightPanel`, `JunoOrb`, `PrimaryButton`, `SecondaryButton`, `TextLink`, `ResourceCard` (similar resources).

### Assets
3 images per resource ideally (hero + 2). One is acceptable — the grid degrades to a single 3:2 hero.

---

## 5. Guided journey overlay

**The most important interface in the redesign, and the biggest departure.**

### What changed
The old experience was one template repeated: cream background, heading, paragraph, button. Now there are **seven templates across five background families**, and the sequencing rule is that no two consecutive screens share a family. Five are drawn in the design file (`1i`): editorial, quiz, scenario, synthesis, completion.

- **Editorial (A):** full theme-solid background (`#D6455E`), a large abstract composition, a Newsreader 40px statement, one paragraph, white CTA. Immersive — the app disappears.
- **Quiz (C):** warm neutral, one focused question at 34px/800, four large options, coral CTA.
- **Scenario (D):** `#F3EDE4`, three option cards each with an abstract visual representing a way of relating.
- **Synthesis (E):** dark `#241C18`, 96px breathing orb, Newsreader statement, three fact rows echoing the user's own answers back with coral emphasis, then "C'est assez juste" / "Pas tout à fait" — the user can correct Juno's model.
- **Completion (G):** green success composition, statement, and a "La semaine prochaine" card that names the next step and carries one linked resource.

The overlay keeps a top-pinned segmented progress bar (one segment per screen), back and close circles that recolor per background, and a bottom-pinned CTA.

### Preserve
The overlay interaction itself (large closable popup), the micro-step structure, 4–7 screens per step, progress persistence on close, all journey content and branching, the Understand → Define → Act phase model.

### Components
`JourneyOverlay`, `SegmentedStepProgress`, all seven `JourneyScreen` types, `QuizOption`, `ScenarioCard`, `InsightPanel`, `JunoOrb`, `PrimaryButton`, `MediaBlock`, `JourneyCompletion`.

### Assets
None strictly required — every composition in the mock is CSS circles and arcs. **This is the one area where commissioned illustration would raise the ceiling significantly**; see Part 2.

---

## 6. Quiz / reflection step

Covered above as template C, but one instruction deserves its own heading: **rotate the interaction.** The brief is explicit and the mocks only show two forms. Across a 4–7 screen step, vary between:

- large horizontal option rows (`QuizOption`) — drawn
- `ScenarioCard` with visuals — drawn
- a pill row for short, scannable choices
- a 4–5 point scale for agreement questions (large circular targets, labelled ends only)
- multi-select with the same option chassis and an explicit "plusieurs réponses possibles" helper

Selection must be unmissable: 2px border in both states so nothing shifts, coral fill in the circle, background tint, weight 600 → 700. Keyboard and radio semantics throughout.

---

## 7. Journey completion

Covered as template G. Three things to hold onto:

1. The success visual animates **once** — a scale-in with a slight overshoot and a drawn check. No confetti, no replay, no sound.
2. The **"La semaine prochaine"** card is the most valuable element: it closes the loop and gives a reason to return. It names the next step *and* attaches one concrete resource.
3. No XP, streaks, levels, or badges. The reward is the insight and the next thing to do.

---

## 8. Juno chat overlay

### What changed
- A real conversation surface: white header with a 44px breathing orb and a memory line ("Se souvient de vos parcours et de vos priorités"), ivory scrollback, white composer with a suggestion-chip row.
- Juno bubbles white with the clipped corner pointing at the orb; user bubbles coral.
- **Juno's messages can carry resources** — a 2-up `ResourceCardMini` row inside the bubble. This is what makes the chat part of the product rather than a support widget: the coach hands you a real thing to do.
- Composer: round input, 46px coral send button.
- The Home preview and the overlay are the same components at two scales, so the message the user saw on Home is the first message in scrollback.

### Preserve
Conversation logic, memory/context model, message history, streaming, any tool-calling that surfaces resources.

### Components
`JunoChatOverlay`, `ChatBubble`, `ResourceCardMini`, `SuggestionChip`, `JunoInput`, `JunoOrb`.

---

## 9. Mon profil / My profile

**Not designed.** No profile screen exists in the design file — it was not in the brief's screen list and I did not invent one.

To restyle it consistently without new design work: white cards on ivory canvas, 24px radius, 1px `#EDE5DA`; section titles 25px/800; `EyebrowLabel` for field groups; `PriorityRow` for priority lists; `Pill` for interest tags (ink-filled when active); `PrimaryButton` for save. Reuse the bilan's option components for anything editable as a choice. If the profile shows what Juno has learned, use `InsightPanel` — that is exactly what it is for.

If you want it properly designed, say so and I will draw it.

---

## 10. Onboarding / Bilan

### What changed
- One question per screen, centered, on a near-white `#FDFAF5` — the warmest, quietest surface in the product.
- Thin coral progress bar with a `3 / 8` counter, back arrow at the left.
- A 60px breathing orb above the question: Juno is asking, not a form.
- Question at 34px/800 with a reassuring helper line ("Il n'y a pas de bonne réponse. Cela m'aide à savoir par où commencer.").
- Four large options, coral selection, unmissable.
- Coral CTA + a "Passer" text link — skippable, no dark patterns.

### Preserve
Question set, order, branching, scoring, how answers map to journeys and recommendations.

### Components
`JunoOrb`, `QuizOption`, `PrimaryButton`, `TextLink`, progress bar.

---

# Part 2 — Asset inventory

The short version: **this design needs almost no exported assets.** Everything decorative is CSS. What it needs is photography, and that is a content problem, not an export problem.

## Brand

| Asset | Status |
|---|---|
| Juno logo | **Unchanged.** Wordmark in Newsreader 500 lowercase + a 26px orb. Keep whatever mark you have; if you want it as an asset, `juno-logo.svg`, transparent, height-normalized to 32px. |
| Juno character/orb | **Do not export.** It is a radial gradient plus two rounded divs — 20 lines of CSS, resolution-independent, animatable, recolorable. Exporting it as SVG or PNG would make it worse. Build `JunoOrb` from the spec in `design-tokens.md`. |
| Icons | **None unique to Juno.** Every glyph in the mocks is a CSS shape: the check is two borders rotated 45°, the arrow is two borders rotated 45°, the close is a text ✕. In production, use your existing icon library (Lucide, Heroicons, whatever you have) at 1.5–2px stroke weight — but keep the **check** as the drawn CSS/SVG version so its stroke weight and round caps match the design's completion moment. |

## Illustrations

Everything in the mocks is CSS: circles, rings (`border` + `border-radius`), dashed orbit rings, and offset overlapping discs in theme colors. Zero files to export.

That is a deliberate prototype decision, not a recommendation. I cannot generate images, and hand-drawn SVG beyond simple shapes is not something I do well. The abstract compositions work — they are calm, adult, and non-literal, which is what the brief asked for — but a real illustration system would be a step up, particularly on the journey editorial and explanation screens where a visual metaphor is doing conceptual work.

If you commission illustration, the briefs the design implies:

| Suggested filename | Concept | Where | Format |
|---|---|---|---|
| `illo-invisible-moments.svg` | Work created social moments you never planned | Journey A, week 2 | SVG, transparent |
| `illo-ways-of-connecting.svg` | Few-and-deep vs group-with-a-rhythm vs many-and-loose | Journey B / scenario | SVG, transparent |
| `illo-new-rhythm.svg` | A week finding its own shape | Nouveau rythme theme | SVG, transparent |
| `illo-trying-something.svg` | The first time you go somewhere new | Journey A / F | SVG, transparent |
| `illo-existing-vs-new.svg` | Tending existing links vs making new ones | Journey B | SVG, transparent |
| `illo-completion.svg` | Quiet arrival, not a trophy | Completion (G) | SVG, transparent |

Style constraints for whoever draws them: adult, warm, editorial, slightly abstract, optimistic. Limited palette — one theme color plus warm neutrals per illustration. No faces with age markers, no elderly couples, no medical or wellness iconography, no sunsets, autumn leaves, rocking chairs, walking sticks, or beaches. Flat or minimal texture, no gradients beyond the Juno orb's. Designed to sit on both `#FAF6F0` and the theme solids.

Until they exist, ship the CSS compositions. They are not placeholders — they hold up.

## Resource photography

**The real requirement, and the biggest risk to the redesign.** Everything in Découvrir, Recommandé pour vous, resource detail, and the in-chat cards is drawn as a theme-tinted block with a mono label naming what belongs there ("photo · atelier", "photo · jardin"). Those blocks are honest placeholders — they are not a style.

If real photography never lands, Découvrir reverts to feeling like a directory and the Airbnb-desirability half of the brief fails. Budget for it.

| Need | Spec |
|---|---|
| Format | **WebP** with a JPEG fallback. No transparency. |
| Card image | 16:10, served at 800×500 (2× for retina at card size) |
| Detail hero | 3:2, served at 1600×1067 |
| Detail thumb | 1:1 or 3:2, 600px |
| In-chat mini | 16:9, 400px |
| Per resource | 1 required, 3 ideal |
| Naming | `resource-<slug>-01.webp` (e.g. `resource-atelier-photo-utl-01.webp`) |
| Delivery | Through whatever image pipeline you have (`next/image`, Cloudinary, an `<img srcset>`); lazy-load everything below the fold |

Content rules from the brief: real photography of the actual activity where it exists — people walking for a walking group, a workshop for a workshop, a garden for a garden. Prefer source-provided imagery from the association or venue. No stock "senior living" photography, no AI-generated people. If a resource has no image, render the theme-tint `MediaBlock` **without** the mono label — a clean colored block is fine, a fake photo is not.

## UI assets

None. There is nothing in this design that cannot be built in CSS or taken from your existing icon library.

---

# Part 3 — What to reuse, reference, and not copy

## Safe to reuse directly

- **Token values** — every hex, size, radius, shadow, and duration in `design-tokens.md`. Transcribe them into your existing token layer.
- **The Juno orb CSS** — the gradient, eye positions, and `breathe` keyframes. Copy the values, write the component in your own idiom.
- **Individual style declarations** for a component you are restyling: the exact `border-radius`, padding, and border values off `ResourceCard`, `QuizOption`, `ChatBubble`, `WeeklyTaskRow`.
- **The abstract composition recipes** — the circle sizes, positions, and opacities that make up the illustrations and image-block decoration. They are pure CSS and worth lifting.
- **Copy.** All French strings in the mocks are usable as-is: section subtitles, Juno's messages, the bilan helper line, "Pourquoi Juno vous le propose". Put them through your existing i18n layer, and get a native speaker to check the two or three lines I wrote rather than adapted.

## Use as reference only

- **Page layouts.** The grids and ratios are correct, but they are written as inline styles on a static canvas with no routing, data, or state. Read them, then rebuild in your components.
- **Component markup.** The anatomy is right; the implementation is a mock. Take the structure and the values, not the divs.
- **The `.dc.html` file as a whole** — it is a design document, not an app. Every "screen" is a static frame with hardcoded content, no interactivity, and no responsive behavior.

## Do not copy

- **Any layout as-is into a component file.** Inline styles on 3,000 lines of static markup are not a starting point for a React codebase.
- **The fake data** — Claire, the Lille resources, the specific weeks and dates. All of it is illustrative. Your real data shapes are correct; do not migrate toward the mock's.
- **The canvas chrome** — the `#E8E1D6` backdrop, the screen frames, the `1a`/`1b` badges, the section labels. That is design-document furniture, not product UI.
- **Anything resembling routing, state, or i18n.** There is none in the file. If Cursor generates it while implementing, that is Cursor inventing architecture — reject it and use yours.
- **Screenshots as UI.** Never. The reference PNGs are for comparison only.

---

# Part 4 — Export checklist

## Must export

| Artifact | Why Cursor needs it |
|---|---|
| `design-tokens.md` | Every color, type, spacing, radius, shadow, and motion value. Without it Cursor guesses hexes and drifts. |
| `component-spec.md` | Anatomy and states for all 29 components, and — critically — which are restyles of things you already have versus genuinely new. This is what stops Cursor from rebuilding your app. |
| `responsive-spec.md` | The mocks are desktop-only. Without this, mobile is invented from nothing. |
| `implementation-notes.md` | Screen-by-screen changes, what to preserve, assets, and the reuse/reference/don't-copy split. |
| `README.md` | The framing: these are design references to recreate in your codebase, not code to ship. |
| `reference/*.png` | Visual ground truth. Cursor can compare its output to these. Eight images, one per interface. |

## Nice to have

| Artifact | Why |
|---|---|
| `reference/Juno Redesign.dc.html` | The source design. Useful when a doc is ambiguous and Cursor needs to read the exact declaration. Include it, but the README must be clear it is a reference document — otherwise there is a real risk Cursor treats it as the app to port. |
| Screenshots of your **current** screens | Not in this bundle — you have them. A before/after pair per screen makes "restyle, don't rebuild" concrete and is the single cheapest thing you can add. |
| A one-line direction decision | Which Home (`1a`/`1b`) and which Découvrir (`1c`/`1d`) won. Cursor cannot pick for you, and building both is waste. |

## Do not export

| Thing | Why not |
|---|---|
| Screenshots of every option and iteration | Two Home directions and two Découvrir directions exist. Export the winners only. Ambiguity in a handoff produces hedged code. |
| The Juno orb as SVG/PNG | It is CSS. An exported version would be worse in every way. |
| Icon exports | Use your existing icon library. |
| Illustration exports | There is nothing to export — the compositions are CSS. |
| Font files | Newsreader and Plus Jakarta Sans are on Google Fonts. Install via `@fontsource` and self-host through your build. |
| Placeholder image blocks | They are scaffolding marking where photography goes. Nothing to hand off. |
| The `#E8E1D6` canvas backdrop or screen frames | Design-document furniture. |
| A generated React/Vite frontend | None was produced, and you do not want one. This is the point of the whole handoff. |

## Recreate from spec rather than exporting

Text, borders, shadows, gradients, basic shapes, buttons, cards, pills, inputs, layout, typography, the check and arrow glyphs, and every abstract illustration. In other words: nearly everything. That is the correct outcome for a CSS-native design.

---

# Part 5 — Reference screenshots

Eight desktop PNGs are in `reference/`, one per interface, winners only:

```
juno-home-desktop.png          1a — warm canvas direction
juno-home-alt-desktop.png      1b — color-forward direction (decide between these two)
juno-discover-desktop.png      1c — editorial rows
juno-discover-collections.png  1d — collection tiles (combinable with 1c)
juno-resource-detail.png       1e
juno-my-journey.png            1f
juno-guided-step-editorial.png 1i, screen 1 — theme-solid immersive
juno-guided-step-quiz.png      1i, screen 2
juno-guided-step-scenario.png  1i, screen 3
juno-guided-step-insight.png   1i, screen 4 — dark synthesis
juno-guided-step-completion.png 1i, screen 5
juno-chat-overlay.png          1g
juno-bilan-question.png        1h
juno-design-system.png         1j — tokens and components at a glance
```

Thirteen rather than eight, because the journey templates are the heart of the redesign and each is a different template — one screenshot cannot represent them.

**No mobile screenshots exist**, because no mobile layout was designed. `responsive-spec.md` covers mobile in writing. If you want drawn mobile screens — Accueil, Découvrir, the journey overlay, and the chat overlay are the four worth doing — that is a separate piece of design work. Ask and I will do it; it is a few hours, and it would de-risk the mobile build considerably.

---

# Part 6 — Manifest

```
/juno-design-handoff
  README.md                     start here
  design-tokens.md
  component-spec.md
  responsive-spec.md
  implementation-notes.md       this file

  /reference
    juno-home-desktop.png
    juno-home-alt-desktop.png
    juno-discover-desktop.png
    juno-discover-collections.png
    juno-resource-detail.png
    juno-my-journey.png
    juno-guided-step-editorial.png
    juno-guided-step-quiz.png
    juno-guided-step-scenario.png
    juno-guided-step-insight.png
    juno-guided-step-completion.png
    juno-chat-overlay.png
    juno-bilan-question.png
    juno-design-system.png
    Juno Redesign.dc.html       the source design document
```

No `/assets` folder, because there are no assets. That is the design working as intended.

---

# Part 7 — Give Cursor these files

The minimum set:

```
README.md
design-tokens.md
component-spec.md
responsive-spec.md
implementation-notes.md
reference/*.png
```

That is it. Six things. Add `Juno Redesign.dc.html` only if you want Cursor able to check an exact value — and if you do, say explicitly that it is a reference document.

## How to instruct Cursor

Start a session with the whole folder in context and open with something close to this:

> This folder is a design handoff for a visual redesign of our existing Juno app. The HTML file is a **design reference**, not code to port — do not copy its markup, layout, or data into the codebase.
>
> Our architecture stays as it is: routing, state, i18n, journey engine, resource data, and recommendation logic are all unchanged. This work is visual: tokens, component styling, layout, imagery, and the specific UX improvements described in `implementation-notes.md`.
>
> Read all five markdown files before writing anything. Then, before you make changes, give me:
> 1. a mapping from the components in `component-spec.md` to the files in our codebase that already implement them, and
> 2. a proposed order of work, smallest-blast-radius first.
>
> We are going **restyle-first**. Only four or five components in the spec are genuinely new; everything else is an existing component getting new visuals. If you find yourself creating a new component that duplicates one we have, stop and ask.

Then work in this order — it front-loads the leverage and keeps every step reviewable:

1. **Tokens.** Land the color, type, spacing, radius, shadow, and motion values in your existing token layer. Load the two fonts. Nothing visual ships yet.
2. **Primitives.** `PrimaryButton`, `SecondaryButton`, `TextLink`, `Pill`, `EyebrowLabel`, `TaskCheck`, `JunoOrb`. Small, high-reuse, low-risk — and this is where you will feel whether the tokens are right.
3. **Accueil.** The whole screen: `WeekCard`, `WeeklyTaskRow`, `ResourceCard`, `JunoChatPreview`, `PriorityRow`. Highest-traffic screen, and it exercises most of the system. Review here before going further.
4. **Découvrir + resource detail.** `MediaBlock`, card variants, `MetaTile`, `InsightPanel`, collection tiles. Photography pipeline lands with this step.
5. **Journey overlay.** The five screen templates, `SegmentedStepProgress`, `QuizOption`, `ScenarioCard`, completion. Most design-dense, most valuable, and it needs the primitives settled first.
6. **Chat + bilan.** Both reuse components built in steps 2–5.
7. **Responsive pass.** Per `responsive-spec.md`. Then screenshot mobile and send it to me — that is the part nobody has seen yet.

## Two things to hold Cursor to

**"Restyle, don't rebuild"** needs repeating. The failure mode is a well-meaning agent creating `ResourceCardNew.tsx` next to your `ResourceCard.tsx` and rewiring call sites. Every time it proposes a new file for something in the "Restyle" column of `component-spec.md`, push back.

**The accessibility floors are requirements, not suggestions.** 44px minimum hit targets, 16px minimum body text, no text lighter than `#8A817A`, visible focus rings on everything, and `prefers-reduced-motion` honoured including the Juno breathe. The mocks do not show focus states — Cursor must add them, and it will not unless you ask.
