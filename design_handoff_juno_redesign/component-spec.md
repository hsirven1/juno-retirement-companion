# Juno — component spec

Read `design-tokens.md` first. This document describes each component's anatomy and states, not its implementation.

The **"Existing app"** column is the important one. Most of these already exist in your codebase. The instruction for those is *restyle in place* — same component, same props, same call sites, new visuals. Only four components are genuinely new.

---

## Summary table

| Component | New or restyle | Notes |
|---|---|---|
| `PrimaryButton` | Restyle | Coral fill, pill, larger |
| `SecondaryButton` | Restyle | Outline, pill |
| `TextLink` | Restyle | `#B93A26`, 700 weight |
| `Pill` / `CategoryPill` | Restyle | Active = ink fill, not coral |
| `EyebrowLabel` | **New** (probably) | Tiny reusable label primitive |
| `Checkbox` / `TaskCheck` | Restyle | 34px, green when complete |
| `WeeklyTaskRow` | Restyle | Position-stable completion |
| `WeekCard` | Restyle | Container for the above |
| `ResourceCard` | Restyle | Image-first, real hierarchy |
| `ResourceCardCompact` | Restyle | Horizontal variant |
| `ResourceCardMini` | **New** | For in-chat suggestions |
| `CollectionTile` | **New** | Découvrir colour-coded index (1d) |
| `ThemeCard` | Restyle | Now theme-tinted |
| `JourneyProgressBar` | Restyle | Segmented, per-phase |
| `SegmentedStepProgress` | **New** | Overlay top bar, 5 segments |
| `JunoOrb` | Restyle | The character, sized + animated |
| `JunoChatPreview` | Restyle | Dark panel on Home |
| `JunoChatOverlay` | Restyle | Full conversation |
| `ChatBubble` | Restyle | Juno / user variants |
| `SuggestionChip` | Restyle | Quick replies |
| `JunoInput` | Restyle | Round, coral send |
| `QuizOption` | Restyle | Large, 2px, unmissable |
| `ScenarioCard` | **New** | Option with abstract visual |
| `InsightPanel` | Restyle | "Pourquoi Juno" / synthesis |
| `JourneyOverlay` | Restyle | Shell for 5 screen types |
| `JourneyScreen` (A–G) | Restyle | The 7 templates |
| `JourneyCompletion` | Restyle | Terminal screen |
| `MetaTile` | **New** | 2×2 fact grid on detail |
| `MediaBlock` | **New** | Image slot + placeholder |
| `SectionHeader` | Restyle | Title + subtitle + link |
| `PriorityRow` | Restyle | Compact context list |

Nine new components. Everything else is a restyle.

---

## Buttons and controls

### `PrimaryButton`
The only coral-filled element that can be clicked.

- Fill `#E1503A`, text `#FFFFFF` at 17–19px/700, radius 999px, padding 15–19px × 22–28px.
- Sizes: **L** 19px text / 19px pad (overlay CTA, detail CTA — usually full-width), **M** 17px / 15px pad (inline), **S** 16px / 12px pad (in-row, e.g. "Reprendre").
- Hover: darken to `#CE452F`. Active: `#B93A26`, `scale(.985)`. Focus: 3px `rgba(225,80,58,.35)` ring, offset 2px.
- Disabled: `#EFE4D6` bg, `#A0958A` text. No coral ghost.
- **Min height 44px in every size.** Full-width on mobile.
- On coral surfaces (1b weekly block) it inverts: `#221C18` fill, white text.
- On theme-colored surfaces (journey editorial screen) it inverts to white fill with theme-ink text (`#FFFFFF` / `#A82B44`).

### `SecondaryButton`
- Transparent, 1.5px `#DCD1C1` border, ink text at 700.
- Hover: bg `#F3EDE4`, border `#CDBFAC`.
- Same heights as Primary. Never two Primaries side by side — the pair is always Primary + Secondary ("Ajouter à ma semaine" / "Plus tard").

### `TextLink`
`#B93A26` at 16px/700, often with a trailing `→`. Hover `#8E2A19` + underline. Used for "Tout découvrir →", "Ajuster", "Voir la carte →".

### `Pill` (category filter)
- Idle: `#FFFFFF`, 1.5px `#E3D9CC`, 16px/700, padding 12×22, radius 999.
- Hover: bg `#F6EFE5`.
- **Active: `#221C18` fill, `#FDF9F4` text.** Not coral — a filter is not an action, and seven coral pills in a row would destroy the signature.
- Row scrolls horizontally on mobile with `scroll-snap`, no wrap, gutter-bleeding, no visible scrollbar.

### `SuggestionChip`
Quick replies under a Juno message. `#F6EFE5` bg, 15px/700, padding 10×16, radius 999. On dark: `rgba(255,255,255,.09)` bg with a `rgba(255,255,255,.26)` border. Hover lightens.

### `EyebrowLabel`
The small uppercase label used everywhere (category, "PARCOURS EN COURS", "COMPRENDRE · 1 SUR 5"). 12–13px/800, `letter-spacing .09–.11em`, uppercase. Color is contextual: theme ink, `#A0958A` neutral, or `#D6455E`/`#B93A26`. Optional 7px leading dot in the theme solid. Worth extracting as a primitive — it appears in ~20 places.

---

## Weekly dashboard

### `TaskCheck`
- 34px circle. Idle: 2px `#DCD2C6` ring, transparent. Hover: ring `#B9AB9C`, bg `#F6EFE5`.
- Complete: fill `#2F7D5B`, white check (3px stroke, round caps).
- **44px hit area** via padding, even though the visual is 34px.
- On coral surface (1b): complete = white fill, coral check.

### `WeeklyTaskRow`
The most functional component in the product. Anatomy, left to right:

`TaskCheck` — 18–20px gap — `[EyebrowLabel (dot + theme name)]` over `[title 19px/700]` over `[meta 15px #7A7069]` — flexible spacer — `[action]`.

- 21–22px vertical padding, `#F2EBE1` bottom divider, none on the last row.
- Action varies by row: `PrimaryButton S` for the live journey step, `SecondaryButton S` for a resource, `TextLink` for a Juno nudge, static `#2F7D5B` text ("Fait lundi") when complete.
- **Completed state: the row stays exactly where it is.** Title → `#8A817A` with `line-through` in `#D6CDC2`; eyebrow and meta persist; action becomes the green done-label. No reordering, no collapse, no move-to-bottom. The user's week should look the same shape all week.
- Hover on the whole row (when it opens something): bg `#FDFBF7`.
- Mobile: action drops to a full-width row beneath the text, check stays top-left.
- **Language:** no "tasks", no "to-do", no counts framed as productivity. "Votre semaine" and "1 sur 3" is the ceiling.

### `WeekCard`
White, 24px radius, `--shadow-card`, 30–34px padding with only 12–14px bottom (rows supply their own). Header: "Votre semaine" 25px/800 left, date range + `1 sur 3` 15px right.

Direction `1b` variant: same anatomy on a `#E1503A` block, rows as `rgba(255,255,255,.14)` panels, and the **live** row promoted to a solid white panel. Pick one direction — see `implementation-notes.md`.

### `PriorityRow`
Deliberately quiet. 9px theme dot · label 17px/600 · status 14px/700 `#8A817A`. Stacked with 13px gaps, no borders, no cards, no progress bars. This is context, not content.

---

## Resources

### `MediaBlock`
Wraps every image slot so the placeholder story is in one place.

- Radius 18–20px (14px for square thumbs), `overflow: hidden`, theme tint background.
- Aspect: **16:10** for card images (200px at a 320px card), **3:2** for the detail hero, **1:1** for thumbs.
- With an image: `object-fit: cover`, `object-position: center`, `loading="lazy"`, `decoding="async"`.
- Without: theme tint + 1–2 abstract circles at 14–30% opacity + an `IBM Plex Mono` 11px label naming what belongs there. **This is scaffolding.** Delete the placeholder branch once photography lands; do not ship the mono label.
- Never put text over a photo in this system — all copy sits below the block.

### `ResourceCard` (vertical, the primary one)
```
MediaBlock            16:10
EyebrowLabel          category, theme ink
Title                 20–21px/800, -.015em, 2 lines max
Provider              16px/600 #58504A          (optional)
Meta                  15px #8A817A — "Lille-Centre · Petit groupe · Chaque mardi"
Description           16px/1.5 #4A433D, 2 lines  (optional)
```
- White, 20–22px radius, 1px `#EDE5DA`, 20–22px padding. Or borderless-on-canvas in the editorial variant (`1c`) — image, then text, no container at all.
- Meta is **three facts, dot-separated: place · format · rhythm.** That trio is the contract. Never IDs, never source slugs, never "last updated".
- Hover: `translateY(-3px)` + `--shadow-card-hover`, cursor pointer, whole card is the target.
- Fixed-height? No. Titles wrap to 2 lines; let cards in a row equalise via grid.
- Mobile: full width, image 16:10, all copy retained.

### `ResourceCardCompact`
Horizontal: 128px square `MediaBlock` + text column, 18px gap, 18px padding, 20px radius. For 2-up rows ("Pour transmettre votre expérience").
Mobile: keep horizontal but shrink the thumb to 96px — do not stack.

### `ResourceCardMini` — new
For Juno's in-chat suggestions. 84px tall `MediaBlock`, then title 17px/800 + one 14px line. 16px radius. Two side by side inside a chat bubble's width.

### `CollectionTile` — new (direction `1d`)
Large color-coded entry point. Theme solid background, white text, 22px radius, 26px padding, min-height 168px, `flex column space-between`: a 24px/800 title (max ~15ch) at top, a 15px/700 count at bottom. Decorative white circles at 12–16% opacity bleeding off the corners, `overflow: hidden`.
Hover: `translateY(-2px)`, decorative circles nudge (`scale(1.04)`).
The last tile is the inverse: white, `#E3D9CC` border, coral link text.
Mobile: 2-up grid, min-height 140px, title 20px.

### `MetaTile` — new
The 2×2 fact grid on resource detail. White, 1px `#EDE5DA`, 14px radius, 15px×17px padding. Label 13px/700 `#8A817A` over value 17px/700. Four of them: Rythme, Format, Engagement, Coût.
Mobile: stays 2×2 — these are short.

### `SectionHeader`
Title (27px/800, `-.02em`) + optional `TextLink` right-aligned on the same baseline, subtitle underneath (17px `#6B625B`). The subtitle carries the personalization — *"Parce que vous cherchez à rencontrer de nouvelles personnes."* — and is what makes Découvrir feel curated rather than queried. Keep it wired to real profile data or drop the sentence; never fake it.

---

## Juno character and chat

### `JunoOrb`
- Radial gradient + two `#3A1B12` eye pills (see tokens).
- Sizes 21 / 32 / 44 / 54 / 60 / 96px. `breathe` animation at ≥44px only.
- Glow shadow on dark surfaces only.
- States: idle (breathe), thinking (three `#F8B39A` dots, 1.4s staggered — **no spinner**), speaking (n/a, static).
- Ship as one component with a `size` prop. It is CSS, not an asset — see `asset-inventory.md`.
- **Restraint is the spec.** Home panel, chat, insight screens, completion, bilan, loading. Nowhere else. It is not a mascot in the corner of every card.

### `ChatBubble`
- **Juno:** `#FFFFFF` + 1px `#EDE5DA` on canvas (or `rgba(255,255,255,.09)` on the dark panel), radius `18 18 18 6`, 17–19px padding, 18px/1.55 text, 34px orb to its left, max-width 82%.
- **User:** `#E1503A` fill, white text, radius `18 18 6 18`, right-aligned, max-width 78%.
- A bubble can own trailing content: `SuggestionChip` row, or a 2-up `ResourceCardMini` row.
- Day separator: centered 14px/700 `#A0958A`.

### `JunoInput`
Pill, `#FAF6F0` bg with `#E3D9CC` border (or white on dark), 7px padding with 22px left inset, 18px placeholder `#9A9088`, and a **46px coral circle send button** inset right. On the Home preview it is 40px. Enter sends; Shift+Enter newlines; grows to ~4 lines then scrolls.

### `JunoChatPreview` (Home right column)
`#241C18` panel, 24px radius, 26×24px padding, a coral radial halo bleeding off the top-right corner. Contents: 50px orb + name/status, one Juno bubble, two suggestion chips, then the input. It should read as a **miniature live conversation**, not a "Chat" nav card — that is the whole point of the redesign here. Clicking anywhere opens `JunoChatOverlay` with that message in scrollback.

### `JunoChatOverlay`
Light board: white 22px header (44px orb, name, "Se souvient de vos parcours et de vos priorités", history link), `#FAF6F0` scrolling message area at 26–28px padding with 18px gaps, then a white composer block with a chip row above the input.
Desktop: 720px wide, ~900px tall, centered, `--shadow-overlay`. Mobile: full screen, sticky header, composer pinned above the keyboard.

### `InsightPanel`
Juno's interpretation of the user, and the one thing on a page that should stop the eye. `#221C18` (or `#241C18`), 20px radius, 24px padding, coral halo top-right, 32px orb + `EyebrowLabel` in `#E6B9A6`, then 18px/1.55 `#F2E7DC` body. Emphasis inside the copy is `#F8B39A` bold.
Two uses: **"Pourquoi Juno vous le propose"** on resource detail, and the **synthesis screen** in a journey (where it fills the board and stacks three `rgba(255,255,255,.09)` fact rows).

---

## Guided journey

### `JourneyOverlay`
The shell. Fixed board, 26px radius, `--shadow-overlay`, over a `rgba(34,28,24,.45)` backdrop. Desktop 620px × 780px (the chat board is wider, 720px); mobile full-screen.

Chrome, top row: 34px back circle · `SegmentedStepProgress` · 34px close circle. The chrome recolors per screen background:
- light board → `#F0E8DC` circles, `#6B625B` glyphs
- theme/dark board → `rgba(255,255,255,.14–.2)` circles, white glyphs

Body scrolls if needed; the CTA is pinned to the bottom with `margin-top: auto`.

Escape closes with a confirm if the step is mid-way. **Progress must survive close** — that is existing behavior, keep it.

### `SegmentedStepProgress` — new
One 5px rounded segment per screen in the micro-step, 5px gaps, flex-equal. Filled = current theme solid (or white on colored boards); empty = `#EADFD2` / `rgba(255,255,255,.34)`. Partial fill uses a linear-gradient hard stop.
**No percentages, no step counter chrome, no XP.** The eyebrow ("Comprendre · 1 sur 5") carries the number when it is useful.

### `JourneyProgressBar` (Mon parcours)
Six 8px segments across the phase, plus three labels beneath: Comprendre / Définir ce qui me convient / Passer à l'action. Filled in the theme solid, partial via gradient stop, empty in the theme tint (`#F0DCDF`).

### The seven screen templates
The brief's A–G. Each is a distinct background family — that variety *is* the design. A journey that renders seven cream-and-paragraph screens has failed regardless of token accuracy.

| Type | Background | Anatomy |
|---|---|---|
| **A — Editorial** | Theme solid (`#D6455E`) | Abstract composition (~240px) → eyebrow → Newsreader 40px statement → 19px paragraph → white CTA |
| **B — Visual explanation** | Theme tint | Diagram/timeline center, short caption, CTA. Same chassis as A, tinted. |
| **C — Quiz** | `#FAF6F0` | Eyebrow → 34px/800 question → helper line → 4 `QuizOption` → coral CTA |
| **D — Scenario** | `#F3EDE4` | 34px/800 question → 3 `ScenarioCard` → coral CTA |
| **E — Insight** | `#241C18` | 96px orb centered → eyebrow → Newsreader 34px statement → 3 fact rows → "C'est assez juste" / "Pas tout à fait" |
| **F — Resource preview** | `#FAF6F0` | Real `MediaBlock` + resource copy + "why this one" + add-to-week |
| **G — Completion** | `#FAF6F0` | Green success composition → eyebrow → Newsreader 36px → "La semaine prochaine" card → CTA + text link |

Sequence rule for the implementer: **never two consecutive screens with the same background family.** A 4–7 screen step should hit at least three.

### `QuizOption`
- Full-width row, 18px radius, **2px border in both states**, 20–24px padding, 16px gap.
- 24px selection circle: idle 2px `#DCD2C6`; selected coral fill + white check.
- Idle `#FFFFFF` / `#EDE5DA` border / 19px 600. Selected `#FDF1EF` / `#E1503A` border / 19px **700**.
- Hover: border `#DCD1C1`, bg `#FDFBF7`.
- Min height 64px. Keyboard: arrows move, Space selects, radio semantics.
- Sized for French — the longest option in the mock is 47 characters and wraps to two lines cleanly. Do not set a fixed height.
- Variants the brief asks you to rotate between: this row form, a pill row, `ScenarioCard`, and a 4–5 point scale. **Do not use the same interaction on every question.**

### `ScenarioCard` — new
`QuizOption` plus a 96px square abstract visual on the left (theme tint bg, 2–3 circles at 25–50% opacity, 16px radius), a 20px/800 title and a 17px/1.45 description. 20px padding, 20px radius, same 2px two-state border and same selected treatment.
Mobile: visual shrinks to 64px, stays horizontal.

### `JourneyCompletion`
Success composition: 170px `#E1EFE4` disc, 76px `#2F7D5B` disc, white check; three small theme-colored satellite dots (`#D6455E`, `#C98A16`, `#6D4AC4`) at 45–50% opacity.
Then the statement, then a **"La semaine prochaine"** card (white, 20px radius, 24px padding) which names the next step *and* carries one linked resource with a 40px thumb.
CTA "Revenir à ma semaine" + a text link to the resource.
**Nothing gamified.** One easing on the check, once.

---

## Cross-cutting requirements

**Hit targets.** 44px minimum on everything interactive. The 34px check and the 24px radio meet it via padding — verify in the browser, not in the mock.

**Focus.** Every interactive element needs a visible focus ring: 3px `rgba(225,80,58,.35)`, 2px offset. The mocks do not show focus states; you must add them.

**French first.** Every component here was measured against French copy, which runs ~20% longer than English. No fixed heights on anything containing text, no `white-space: nowrap` on labels or buttons, no truncation on titles (2-line clamp at most, and only on cards). The one place truncation is acceptable is the card description.

**Contrast.** All body text on its intended surface clears 4.5:1; large text clears 3:1. If you introduce a new tint, check it — the theme tints are light and it is easy to put 15px `#8A817A` on one and fail.
