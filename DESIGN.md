---
name: Riverside Church Membership System
description: The members' directory and calendar for Riverside Community Church, kept calm, plain and readable.
colors:
  cobalt: "#1F3F8F"
  gold: "#D4A72C"
  slate: "#4A5568"
  amber: "#8A5A00"
  ink: "#23252D"
  ink-muted: "#5A5F6B"
  paper: "#FFFFFF"
  band-tint: "#F1F4F9"
  line: "#E2E6ED"
  avatar-blue: "#E3E9F5"
  avatar-grey: "#E9EBEF"
  avatar-sand: "#F3EADB"
  success: "#1F7347"
  error: "#B3261E"
  warning: "#F4BE2E"
typography:
  headline:
    fontFamily: "Atkinson Hyperlegible, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  section:
    fontFamily: "Atkinson Hyperlegible, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1.375rem, 2.5vw, 1.625rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Atkinson Hyperlegible, Segoe UI, Arial, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    letterSpacing: "0"
  body:
    fontFamily: "Atkinson Hyperlegible, Segoe UI, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  button:
    fontFamily: "Atkinson Hyperlegible, Segoe UI, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    letterSpacing: "0"
  label:
    fontFamily: "Atkinson Hyperlegible, Segoe UI, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0"
rounded:
  control: "8px"
  nav: "10px"
  tile: "12px"
  member-tile: "14px"
  pill: "9999px"
  round: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "28px"
  4xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    height: "44px"
  button-outlined:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.cobalt}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    height: "44px"
  button-destructive:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.error}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    height: "44px"
  nav-shell:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.paper}"
    rounded: "{rounded.nav}"
    height: "44px"
  page-band:
    backgroundColor: "{colors.band-tint}"
    textColor: "{colors.ink}"
    padding: "32px 24px 28px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  area-art:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.tile}"
  member-tile:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.member-tile}"
    padding: "12px 14px"
  person-avatar:
    backgroundColor: "{colors.avatar-blue}"
    textColor: "{colors.cobalt}"
    rounded: "{rounded.round}"
    size: "40px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  chip-status:
    backgroundColor: "{colors.success}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
---

# Design System: Riverside Church Membership System

## Overview

**Creative North Star: "The Well-Kept Register"**

The app reads like a church office's register that someone keeps carefully: white pages, one steady ink-blue, every entry in the same plain, legible hand. A cobalt bar runs across the top and carries the actions; below it is white paper, neutral cards with hairline borders, and ink text. Inner pages open with a pale cobalt-tinted header band that holds the title and the page's actions, so every page starts the same way. Gold is the one accent: it underlines the current page in the bar, rules the bottom of every page band and of the Home hero, tops each Home area heading with a short bar, and tints text selection. Home is the one page with pictures: the church's stained-glass window under a cobalt wash, and a friendly flat illustration beside each area. Where you are is told by the page title and that gold underline, never by a change of colour.

There is one typeface, Atkinson Hyperlegible, in regular and bold, for everything from the wordmark to the hints under a field. Hierarchy comes from size and weight alone. People appear as quiet tinted initials avatars whose tone comes from their family, so a household reads as a set without anything shouting. Colour beyond cobalt is rationed: slate and amber exist only to tell events apart, and green, red and yellow only to report state.

Density is comfortable rather than compact: 44px targets, a 17px body, nothing under 14px, because many members are older and read on phones. Controls are standard Vuetify 3 (outlined fields, flat and outlined buttons, pill chips) restyled to the house type and colour rather than replaced. The look turns down churchy kitsch: no doves, no stained-glass clip art, no gothic type.

**Key Characteristics:**
- White paper, a cobalt shell and actions, ink text; one scheme on every page.
- Every inner page opens with the same pale cobalt-tinted band and gold rule.
- One family, Atkinson Hyperlegible 400 and 700; bold headings with slight negative tracking.
- Neutral cards and tiles with hairline borders and a soft, low, ink-tinted shadow.
- Quiet tinted initials avatars, toned by family.
- Large type and big targets: 17px body, 44px controls, 14px floor.

## Colors

One working blue on white paper with warm-grey hairlines and near-black ink; two muted event colours and the status colours stand apart from it.

### Primary
- **Register Cobalt** (cobalt): The shell bar and every action: filled and outlined buttons, tonal Edit buttons, text buttons, links, input focus, checkboxes and radios, the caret, the 3px focus ring and the icons in member detail lists. It is also the default event colour.

### Secondary
- **Slate** (slate): An event colour only. Calendar events, the date discs on the "Coming up" board and the strip atop event details.

### Tertiary
- **Amber** (amber): An event colour only, in the same places as slate. It is a deep, brown-leaning amber so white text on it stays readable.

### Neutral
- **Ink** (ink): Headings, body text and the band h1 (the theme's `secondary`). Ink text on the warning colour.
- **Muted Ink** (ink-muted): Ledes, subtitles, counts, secondary facts, family card icons, empty states, out-of-month calendar days.
- **Paper** (paper): The ground of every page and the fill of cards, tiles, inputs and the footer. The ground is never tinted.
- **Band Tint** (band-tint): The pale cobalt-tinted fill of the page band, and only that.
- **Register Gold** (gold): The one accent. The 4px underline on the active nav link, the 3px rule along the bottom of every page band and the Home hero, the 40px bar above each Home area heading, the small uppercase place name on the dark Home hero, and the 35% text-selection wash. Never a fill or button colour, and never text on a light ground.
- **Hairline** (line): Card and tile borders, group card title dividers, board and phone-list row rules, calendar grid lines and the footer rule.
- **Avatar tones** (avatar-blue with cobalt initials, avatar-grey with #3A4150 initials, avatar-sand with #6B4700 initials): The three quiet person-avatar tints.
- **Status** (success, error, warning): State only. Active and inactive chips, alerts, and the outlined Delete and Remove buttons.

### Named Rules
**The One Blue Rule.** Cobalt is the only colour that acts. The shell, buttons, links and focus are cobalt; gold only marks (the nav underline, the band and hero rules, the area bars, selection); nothing else on a page is coloured unless it is an event or a state.

**The Events Only Rule.** Slate and amber appear on events and nowhere else. Every stored event colour, old or new, is mapped onto cobalt, slate or amber when shown, and an unknown colour shows as cobalt.

**The Status Stays Status Rule.** Success, warning and error mean a state (active, inactive, pending, failed, destructive). They never decorate a page, a card, a heading or an event.

## Typography

**Body Font:** Atkinson Hyperlegible (with Segoe UI, Arial, sans-serif), self-hosted with @fontsource at 400 and 700.

**Character:** A face drawn for low-vision legibility, used alone. Bold carries the structure, regular carries the reading, and the slight negative tracking on h1 and h2 keeps large bold lines compact and composed.

### Hierarchy
- **Headline** (700, clamp(1.75rem, 3.5vw, 2.25rem), 1.15, -0.01em): Page titles (h1) in the band and the greeting on Home, with balanced wrapping. The "Riverside" wordmark is 1.5rem bold in the same face.
- **Section** (700, clamp(1.375rem, 2.5vw, 1.625rem), 1.15, -0.01em): h2 such as "Coming up" and the name in a member's detail card.
- **Title** (700, 1.375rem): h3, family and group card titles. Generic card titles are 1.25rem bold, table toolbar titles 1.125rem bold. On Home, the greeting is clamp(2rem, 4.5vw, 3rem) and area names use the Headline size.
- **Body** (400, 1.0625rem, 1.55): All running text. Ledes run 1.125 to 1.25rem in muted ink, capped at 52 to 60ch. Tables use 1rem with tabular numerals.
- **Button** (700, 1rem, no tracking): Every button, in sentence case.
- **Label** (400, 0.875rem, 1.35): Floating labels, hints, messages and chips. This is the floor; the only smaller text is the 13px bold month abbreviation inside a date disc.

### Named Rules
**The One Face Rule.** Atkinson Hyperlegible sets everything, wordmark included. Hierarchy is size and weight, never a second family.

**The Sentence Case Rule.** Buttons are 1rem bold in sentence case with no letter-spacing. Nothing is shouted in capitals.

## Layout

Content sits in a centred column with a 1200px maximum; forms and detail pages narrow to 760px. Gutters are 24px, dropping to 16px under 600px. Each inner page is two parts: a full-width page band (32px top, 28px bottom padding) with the h1 and optional lede at the left and the actions at the right, bottom-aligned and wrapping; then the page body (28px top, 64px bottom padding).

Home has no band. It opens with a hero: the stained-glass window photo under a left-to-right cobalt wash (92% to 45%), a small uppercase gold place name, a white greeting h1 and lede (Log in and Sign up buttons when logged out), the church address, and a 3px gold bottom rule. Logged-in members then see the "Coming up" board: ruled rows on a fixed grid (date disc, name, when, where) that collapse to a disc plus a stacked text column on phones. Then each of the four areas gets its own full-width band, alternating white and the pale band tint: an illustration in a 5:4 hairline frame (12px corners) beside a gold bar, the area name, a one-line description, a muted bold count and an outlined "Open …" button. The picture swaps sides on each band (5fr to 6fr columns, 56px gap); under 600px the picture sits above the text at 16:10. A white footer with a hairline top rule closes the page.

Member lists are auto-filling tile grids (minimum 260px, 12px gap). Family and group cards sit in a responsive card grid. The shell wraps under 1024px, giving the nav its own full-width row under the brand; under 480px the "Community Church" subline is hidden. Spacing steps in use are 4, 8, 12, 16, 20, 24, 28 and 48px.

## Elevation & Depth

Depth is soft, low and tinted with ink rather than black. Cards sit on paper with a hairline border and a gentle two-layer shadow; menus and dialogs lift further. Member tiles are flat at rest and take the card shadow plus a half-strength cobalt border on hover. Motion is limited to 150ms ease-out hover feedback, and reduced-motion preferences collapse it.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 1px 2px rgba(35, 37, 45, 0.08), 0 4px 14px rgba(35, 37, 45, 0.08)`): Cards at rest; member tiles on hover.
- **Lift** (`box-shadow: 0 2px 4px rgba(35, 37, 45, 0.1), 0 10px 24px rgba(35, 37, 45, 0.12)`): Menus and dialogs.

### Named Rules
**The Hairline First Rule.** Edges are drawn with a 1px hairline before any shadow. A tile only gains a shadow when it is being pointed at.

## Shapes

Gently rounded and plain. Buttons, cards and fields use 8px corners; shell links 10px; Home illustration frames 12px; member tiles 14px. Chips are full pills. Person avatars, the date discs on the "Coming up" board and the calendar's phone-list dots are circles. Every border is a single 1px hairline; the heavier lines are the 4px rounded gold underline on the active nav link, the 3px gold rule under the page band, and the 10px event-colour strip that tops an event's detail card.

## Components

### Buttons
Plain-spoken, sentence case, sturdy.
- **Shape:** gently curved (8px), 44px minimum height, 44px square for icon buttons.
- **Primary:** cobalt fill, white text, 1rem bold, often with a leading mdi icon ("Add Member", "Create Event"). Large size for log in and sign up.
- **Outlined:** cobalt outline and text on white, the second action beside a primary ("CSV Download", "Print Groups", "Sign up").
- **Tonal:** the light cobalt tonal Edit button on family and group cards.
- **Text:** cobalt text with a trailing arrow for links such as "Full calendar".
- **Destructive:** outlined in status red ("Delete", "Remove").
- **Hover / Focus:** Vuetify state overlays, plus a 3px cobalt focus ring offset 2px (white in the shell).

### Chips
- **Style:** full pill, 14px label, flat fill.
- **State:** status only: success green for active or approved, error red for inactive, warning (ink text) for pending.

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** paper.
- **Shadow Strategy:** Card at rest, Lift in an overlay.
- **Border:** 1px hairline.
- **Internal Padding:** 20px sides. Group cards put a hairline divider under the title row (title left, tonal Edit right). Family cards list members as small avatars with first names, then email, phone and address beside muted-ink icons. Auth cards use 32px 28px 24px in a centred 440px column.

### Inputs / Fields
- **Style:** Vuetify outlined fields on white, in the body face.
- **Focus:** cobalt outline and cobalt caret.
- **Error / Disabled:** Vuetify defaults. Hints and messages are 14px with 8px below.

### Navigation
The cobalt shell holds the bold "Riverside" wordmark with a "Community Church" subline, then Home, Members, Families, Groups, Events Calendar and, for admins, Admin Board, with the account links on the right. Links are 1.0625rem bold white in 44px hit areas rounded to 10px, with a 12% white wash on hover. The current area gets a 4px rounded gold underline. Account links are regular weight with a leading icon. On narrow screens the nav wraps to its own row.

### Page Band
Opens every inner page. Band-tint fill, a hairline bottom rule, the h1 in ink, an optional muted lede up to 60ch, and the page's actions as a filled primary plus outlined primary buttons. It takes no colour argument.

### Person Avatar
A circular initials avatar (40px in cards, 48px in member tiles, 64px in detail cards) with bold initials at 38% of its size and no ring or shadow. Its tone (blue, grey or sand) is hashed from the person's family key, falling back to their surname, so a household shares a tone on every page.

### Home Hero, Area Bands and Coming Up Board
The Home hero is the only photo in the app, and the area illustrations are the only drawings; both stay on Home. Each area band pairs one illustration with its text and an outlined cobalt button, and the bands alternate sides like the original page did, in the quiet palette instead of bright fills. "Coming up" is a ruled board; each row starts with a 56px date disc in the event's colour (bold day, 13px uppercase month) followed by the bold name, then when and where in muted ink.

## Do's and Don'ts

### Do:
- **Do** open every inner page with the page band, and mark the current area with the gold nav underline.
- **Do** use cobalt for every action and link, and pair a filled primary with an outlined primary when a band has two actions.
- **Do** represent people with the tinted initials avatar keyed by family.
- **Do** keep targets at 44px and text at 14px or larger, with the body at 1.0625rem.
- **Do** set buttons in sentence case, 1rem bold, with no letter-spacing.
- **Do** draw edges with the 1px hairline, and keep shadows to the Card and Lift values.

### Don't:
- **Don't** give a section, area or role its own colour; cobalt is the only accent outside events and status.
- **Don't** use slate or amber anywhere but events, or let an event colour fall outside cobalt, slate and amber.
- **Don't** use success, warning or error to decorate a page, a card, an event or a heading.
- **Don't** add a second typeface or a display face; hierarchy is Atkinson's size and weight.
- **Don't** tint the page ground; the pale band tint belongs to the page band alone.
- **Don't** use churchy kitsch: doves, stained-glass clip art or gothic type.
