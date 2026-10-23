---
version: 1
slug: "frontend-src-app-vue"
primary_target: "frontend/src/App.vue"
related_targets: ["frontend/src/views","frontend/src/components"]
---

# Surface: the whole Riverside app (shell + every route)

Mode: Operate. Members find people, families, groups and events and fix their own details; staff keep records. Behind login; phone and desktop both first-class; many older users.

Constraints: keep every route, feature, role check and service call. Stack stays Vue 3 + Vuetify 3. No churchy kitsch (doves, stained glass clip art, gothic type). Readable first: large type, AA contrast, big targets. The old flat illustrations are retired; nothing in the old look is fixed (logo treatment included).

## Direction contract

THESIS: A calm, well-kept congregation register: clear, readable and quietly professional. It refuses both the grey admin template and the earlier bright per-section colours.

OWN-WORLD: Professional and restrained (user's call, 2026-10-23, replacing the bright potluck palette): white ground, cobalt shell and actions, page headers as a pale cobalt-tinted band with ink titles, neutral cards with hairline borders. One family face, Atkinson Hyperlegible, regular and bold, for everything. People appear as quiet tinted initials avatars coloured by family. Event colours are cobalt, slate and amber only. Standard Vuetify controls.

STORY: A member lands on Home, sees what's coming up and the four areas, opens one, finds a person by name or a family, and edits their own details without help.

FIRST VIEWPORT: Cobalt top bar (wordmark left, Home, Members, Families, Groups, Events Calendar, the current one underlined in white; account right). Home: a greeting heading; four bordered link tiles (Members, Families, Groups, Events) with an icon, name and count, two by two on phones; below them a "Coming up" board of the next events. Inner pages: a pale tinted header band holding the page title and the primary action, then content.

FORM: Potluck Table, 1 of 7 on my list, later restrained at the user's request into "The Well-Kept Register" (one blue, one face, neutral surfaces). seed:404c2e2ca3b28e9e

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
