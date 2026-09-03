# Juno — responsive spec

## Read this first

**Four mobile screens are now designed** at 390px and included as references: `juno-home-mobile.png`, `juno-discover-mobile.png`, `juno-journey-mobile.png`, `juno-chat-mobile.png` (design-doc ids `2a`–`2d`). Where a drawn mobile screen exists, **it is the source of truth** and overrides the written spec below. Section 6 lists every decision the mobile pass settled or changed.

Everything else — tablet, resource detail, Mon parcours, bilan — remains a written specification derived from the desktop design. Those layouts are one- or two-column and collapse predictably, so the spec is enough to build from, but nobody has looked at a rendered screen. Build them, screenshot them, and we can review.

Approved desktop directions: **`1a`** for Accueil, and for Découvrir a **combination** — `1d`'s large color tiles as the page header over `1c`'s editorial rows. The mobile screens implement exactly that.

If your existing app already has working breakpoints and mobile layouts, **keep them.** This redesign changes surfaces, type, and components, not your layout engine. Restyle inside the responsive structure you have.

---

## Breakpoints

Use whatever your app already defines. If it defines nothing:

```
mobile    < 768px     single column
tablet    768–1119px  two columns where the ratio still works, else stacked
desktop   ≥ 1120px    full two-column layouts
```

Content max-width **1240px**, gutters **40px** desktop / **24px** tablet / **20px** mobile.

---

## Desktop (≥1120px)

| Screen | Structure |
|---|---|
| **Accueil** | Two columns, `minmax(0, 1.62fr) / minmax(0, 1fr)`, 26–28px gap. Left: week card + recommendations. Right: Juno preview + priorities. Right column ends up ~430px at max width. |
| **Découvrir** | Full width. Card rows are 3-up (`repeat(3, 1fr)`, 20–22px gap) or 4-up for compact rows. Collection tiles (`1d`) are `repeat(3, 1fr)`, 18px gap, 2 rows. |
| **Resource detail** | Two columns, `1.25fr / 1fr`, 34px gap. Left: gallery (hero spanning 2 cols at 300px + two 150px thumbs) then "Ce qui vous attend" / "Informations pratiques" as a 2-up. Right: title, meta tiles 2×2, `InsightPanel`, CTAs — all above the fold, no sticky needed at this length. |
| **Mon parcours** | Full width. Active journey card full width, then theme cards `repeat(4, 1fr)`, 18px gap, 210px min-height. |
| **Journey overlay** | Centered board **620 × 780px**, backdrop `rgba(34,28,24,.45)`. Fixed height on purpose — the templates are composed to it. |
| **Chat overlay** | Centered board **720px wide × ~900px tall**. |
| **Bilan** | Centered board 720px, content column ~630px. |

Header is 76px, sticky, `rgba(250,246,240,.88)` + `backdrop-filter: blur(14px)`, 1px `#EDE5DA` bottom border.

Card widths land around 300–390px in the 3-up rows. Don't hard-code them; let the grid do it.

---

## Tablet (768–1119px)

- **Accueil:** keep two columns down to ~900px, then stack. When stacked, order is: week card → **Juno preview** → recommendations → priorities. Juno moves up because the panel is a live conversation, not a sidebar widget; burying it under six resource cards kills it.
- **Découvrir:** 3-up becomes 2-up. Collection tiles 2-up. Compact rows 2-up.
- **Resource detail:** stack to one column. Gallery first (hero + thumbs as a horizontal scroller), then the right column's content in its desktop order, then the long-form sections.
- **Mon parcours:** theme cards 2-up.
- **Overlays:** board becomes `min(620px, calc(100vw - 48px))` wide, height `auto` up to `calc(100vh - 96px)`, body scrolls, CTA stays pinned.
- **Journey overlay is the thing to watch.** The 780px boards are composed to a fixed height with a top-pinned progress bar and a bottom-pinned CTA. Below ~820px viewport height, let the middle scroll and keep both ends fixed. Never let the CTA scroll out of reach.

---

## Mobile (<768px)

### Navigation — decided
**Bottom tab bar**, four items: Accueil · Découvrir · Parcours · Profil. Icon (24px) over a 12px/700–800 label, each tab a full-height flex column so the target is the full width/height of its quarter — comfortably past 44px. Active tab is coral icon + `#B93A26` label; inactive is `#A0958A` icon outline + `#6B625B` label. Bar sits on `rgba(255,255,255,.94)` with a 1px `#EDE5DA` top border and 22px bottom padding for the home indicator (`env(safe-area-inset-bottom)`).

A **60px Juno orb floats above the bar**, inset 20px from the right, overlapping it by ~34px, with the coral glow shadow and the breathe animation. That is how Juno stays one tap from anywhere without spending a fifth tab on it.

A slim top bar stays: 56px, logo + wordmark left, avatar right. It scrolls away; the tab bar does not.

If your router cannot support bottom tabs cleanly, the fallback is the top bar collapsed to logo + Juno orb + menu — but the tab bar is the design, and it suits the audience better (bigger targets, thumb reach).

### Accueil — stacking order (see `juno-home-mobile.png`)
1. Greeting + date, then the active-journey chip as a **full-width white row** under it
2. **Votre semaine** — the reason the app is open, and still the primary object
3. **Parler à Juno** — full-width dark panel, keeps orb + message + chips + input
4. Recommandé pour vous — cards full width, stacked, then a full-width outline **"Tout découvrir"** button (the desktop text link is too small a target here)
5. Vos priorités — compact, on a `#F3EDE4` panel rather than a white card, so the screen doesn't end on a third white box

Display type drops: 44px → **32px**. Section titles 27px → **23px**. Card titles 21px → 20px. Body holds at 16–18px. **Do not shrink body copy on mobile** — it is the wrong place to save space for this audience.

**Weekly task rows** change shape: the 34px check stays top-left, the text column runs full width beside it, and the action becomes a **full-width button beneath the text** (`Reprendre` coral, `Détails` outline) — 14px padding, ~48px tall. The date range moves to its own 15px line under "Votre semaine" so the header never crowds "1 sur 3". Completed rows still hold their position, with the green check, struck title, and "Fait lundi" in green.

**Recommendation cards keep real imagery** — full-width `MediaBlock` at 16:10 (350×219 inside 20px gutters), not a shrunken desktop card. Category, title, provider, the `place · format · rhythm` line, and the one-sentence description are all retained. Only two cards; the rest live in Découvrir.

Nesting depth is capped at two: canvas → card. The priorities panel holds rows, not cards.

### Découvrir — combination layout (see `juno-discover-mobile.png`)

The answer to "carousels, stacked, or a combination" is **a combination, and the choice is per section, driven by what the section is for**:

| Section | Treatment | Why |
|---|---|---|
| Category pills | Horizontal scroller | Filters, glanceable, order doesn't matter |
| **Par où commencer** (`1d` tiles) | **2-up grid**, 4 visible + "Voir les 6 collections" | An index — hiding half of it in a carousel defeats the purpose |
| **Pour vous** | **Horizontal carousel**, 304px cards | Curated, ranked, open-ended length; large imagery survives |
| **À essayer sans trop s'engager** | Stacked compact cards on a `#F3EDE4` band | Short list, and the horizontal thumb form is scannable |

Details:
- A search field sits under the intro (full-width pill, 48px) — on mobile, search earns its place at the top in a way it doesn't on desktop.
- Category pills and carousels are **gutter-bleeding**: `margin-inline: -20px; padding-inline: 20px`, `scroll-snap-type: x proximity` (pills) / `x mandatory` with `scroll-snap-align: start` (cards), no visible scrollbar, no wrap. The next item is always partly visible — that peek is what tells the user to swipe.
- Collection tiles: 2-up, **min-height 148px**, title 20px/800 at max ~15ch, count 14px at the bottom. Full-width outline button reveals the remaining two.
- Carousel cards: **304px** wide (≈78vw), image 190px at 16:10, borderless on canvas as in `1c`.
- Compact cards stay horizontal with a **96px** square thumb — never stacked; the horizontal form is what keeps a list of six scannable.
- The `#F3EDE4` band runs **full-bleed** with its own 20px inner padding, so the section change is legible without a border.
- Section subtitles keep their full French sentence and wrap to two lines. They are the curation; do not truncate them.

### Resource detail
- Full-screen sheet, not a centered modal. Sticky close button top-left over the hero.
- Gallery: full-bleed hero at 16:10, swipeable, with dot indicators. Thumbs collapse into the swipe.
- Order: hero → eyebrow + title → provider → description → meta tiles (2×2, still fits) → **`InsightPanel`** → "Ce qui vous attend" → "Informations pratiques" → similar resources.
- CTA: **sticky bottom bar**, white with a top hairline, `PrimaryButton` full width + "Plus tard" as a text link beside it. The decision must always be one tap away.

### Journey overlay (see `juno-journey-mobile.png`)
- Full screen, no radius, no backdrop — a screen, not a sheet. It covers the tab bar; the close button is the only way out, and progress persists.
- Chrome row pinned top: back · `SegmentedStepProgress` · close. **The chrome circles grow from 34px to 44px on mobile** — at desktop they sit next to a mouse, here they are the two most important targets on screen.
- The eyebrow gains the theme dot and reads "Ma vie sociale · comprendre", so context survives without the desktop's surrounding page.
- CTA pinned bottom in its own footer: `rgba(250,246,240,.96)` with a 1px `#EDE5DA` top border, 16px/26px padding, full-width coral button. The border matters — without it the button floats ambiguously over scrolling content.
- Middle scrolls between the two fixed ends. The CTA never scrolls out of reach.
- Question 34px → **27px**; options 19px → 18px, min-height 64px, 12px gaps, 18px padding.
- 390×844 fits four options plus question and helper with no scroll. Five or more, or a longer question, and the middle scrolls — which is fine and expected.
- Editorial screen (type A): abstract composition shrinks to ~180px, Newsreader statement 40px → **30px**.
- Quiz: options full width, min-height 64px, 12px gaps. Question 34px → **27px**.
- Scenario cards: visual 96px → 64px, stay horizontal.
- Insight (type E): orb 96px → 72px, statement 34px → 27px, fact rows full width.
- Completion: composition 210px → 160px.

### Chat overlay (see `juno-chat-mobile.png`)
Full screen, three fixed zones: header, scrolling conversation, composer.

- **Header** is white and sticky: a 44px **back chevron** (not a close ✕ — this is a place you came from, and back is what the audience expects), the 44px breathing orb, then "Juno" over the memory line, shortened to "Se souvient de vos parcours" so it holds one line at 390px.
- **Composer** pinned above the keyboard (`env(safe-area-inset-bottom)`; handle the iOS viewport-resize case). White, 1px top border, a scrolling `SuggestionChip` row above a pill input with the 46px coral send button.
- **Bubbles:** Juno max-width 88% with the 32px orb beside it, user 86% right-aligned in coral. 14px vertical gaps, 16px gutters.
- **`ResourceCardMini` goes 1-up and full-width** inside the bubble at this width, and gains its own "Ajouter à ma semaine" button — on mobile the suggestion should be actionable in place rather than sending the user to a detail screen and back.
- It reads as Juno, not a generic assistant, because of four things: the breathing orb in the header, the memory line, coral user bubbles, and the fact that Juno hands over a real local resource card. Keep all four.

### Bilan / onboarding
Full screen, single column, 20px gutters. Progress bar + count pinned top. Question 34px → 27px. Options full width. CTA pinned bottom, full width. One question per screen — never two.

---

## Rules that apply at every size

- **Nothing below 44px** if it can be tapped.
- **No fixed heights on anything containing text.** French runs long; German, if it ever ships, runs longer.
- Card grids equalise via `grid`, never via a hard-coded height.
- Images are always inside `MediaBlock` with a fixed aspect ratio, so a slow-loading photo never reflows the page.
- Carousels: only for curated rows of 4+ items. Never for the weekly tasks, never for priorities, never for meta tiles.
- The Juno orb never renders below 21px.
- Test the whole app at **200% browser zoom** at 1280px. Given the audience, that is a real usage mode, and it is the fastest way to find every fixed height you missed.

---

## 6. What the mobile pass settled

Decisions now fixed by a drawn screen, and the four that changed from the written spec.

**Settled as previously written:** bottom tab bar; Accueil order (week → Juno → recommendations → priorities); collection tiles as a grid, not a carousel; "Pour vous" as a carousel; compact cards staying horizontal; full-screen journey and chat; gutters at 20px; body copy never shrinking.

**Changed or added:**

1. **Journey chrome circles 34px → 44px.** Back and close are the two highest-stakes targets in the overlay; desktop sizing was too small for a thumb.
2. **Weekly row actions become full-width buttons** beneath the text rather than inline trailing controls, and the week's date range moves to its own line.
3. **In-chat resource cards go full-width and gain their own CTA.** The desktop 2-up pair collapses to one card the user can act on without leaving the conversation.
4. **Découvrir gains a search field** at the top, and the `1d` tile grid shows 4 of 6 behind a "Voir les 6 collections" button — the full six-tile grid is 460px tall on mobile and pushes every curated row below two screens.

Also worth noting: **Vos priorités sits on `#F3EDE4`, not white.** Stacked vertically, three white cards in a row read as one undifferentiated column; the tonal shift ends the page cleanly and keeps nesting at two levels.

---

## 7. Validation against the accessibility brief

Checked on the four drawn screens.

| Requirement | Result |
|---|---|
| Readable text for 55+ | Body 16–18px throughout; card titles 18–20px; questions 27px; nothing below 12px, and 12px only on 800-weight uppercase labels. Body copy does **not** shrink from desktop. |
| Touch targets | Buttons 46–50px tall; tab bar quarters full-height; journey chrome 44px; send button 46px; quiz options min 64px; checks 34px visual in a 44px+ padded row. |
| Contrast | Coral `#E1503A` on white and white on coral both clear 4.5:1 at body weight; theme solids carry white text at 20px/800; the lightest text used is `#8A817A` on white (4.6:1) and `#A0958A` only at 12px/800 uppercase. Theme-ink-on-tint pairs are all from the approved token set. |
| Long French strings | Every card title, option, and section subtitle wraps rather than truncating — "Le sentiment d'être attendu quelque part", "Rencontrer des gens près de chez moi" and "Parce que vous cherchez à rencontrer de nouvelles personnes" all wrap cleanly at 390px. `text-wrap: pretty` throughout. No fixed heights on text containers; tiles use `min-height`. |
| Horizontal overflow | None. Carousels and pill rows are the only horizontally scrolling elements, each in its own `overflow-x` container inside a `overflow-x: hidden` page. Metadata that must not wrap (`1 sur 3`, `En cours`) is `white-space: nowrap` on a `flex: none` child beside a `min-width: 0` flexible sibling. |
| Gutters | 20px page, 16px inside chat, 18–20px inside cards. Carousels bleed to the edge deliberately. |
| Image aspect ratios | 16:10 everywhere on mobile (350×219 full-width, 304×190 carousel), 1:1 at 96px for compact thumbs, 16:9 at 108px in chat. Fixed ratios, so a slow photo never reflows the page. |
| Card widths | Full-width stacked (350px inside gutters), 304px carousel, ~163px collection tiles at 2-up. No card is narrower than 163px, and no full-desktop grid is shrunk down. |
| Sticky controls | Only three: the bottom tab bar, the journey CTA footer, and the chat header + composer. The page header scrolls away. Nothing else is pinned. |
| Sheet / modal behavior | Journey and chat are full screens, not sheets — they own the viewport and cover the tab bar. Resource detail is specified as a full-screen sheet with a sticky CTA bar (not yet drawn). |
| Navigation | Bottom tab bar always visible except inside a full-screen experience; Juno orb floating above it, reachable in one tap. |
