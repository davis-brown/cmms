# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: church members using it for themselves. They look up other members and families, keep their own family's details and photo up to date, find groups, and check and RSVP to events on the calendar.

Secondary: staff and leaders (the moderator, admin and leader roles), who approve new sign-ups, manage roles, keep records and life events, take attendance, and produce the printable PDF directory.

Many users are older, with lower vision or less comfort with technology. People use it on phones (on a Sunday, on the go) and on desktop computers (record keeping, admin), so both are first-class.

## Product Purpose

A Church Membership Management System: one place where a congregation keeps its member directory, families, groups, events and life events, so members can find and stay connected with each other, and so the people who care for the congregation have current, accurate records. Success means a member can find someone or something, or update their own details, without help.

## Positioning

A portfolio and demo project. It was built for one real congregation, and it now mainly shows the work. It is not an active product for that church or for others. It is a members-first directory and calendar, not a back-office database or a donations or giving tool.

## Operating Context

- Accounts: people sign up, and an admin approves them before they can log in. The roles are user, moderator, admin and leader. The demo login `demo` / `demo1234` has every role, and the seed data adds sample members, families, groups and events.
- Workflows: member directory with CSV export; families and family photos; groups and group membership; an event calendar with attendees and RSVPs; life events (for example births, baptisms, illnesses) linked to people; and a printable PDF church directory.
- Stack in place: Vue 3, Vuetify 3, Vue Router 4 and Vuex 4 on the frontend, and an Express, Sequelize and MySQL API with JWT auth. It runs locally with `docker compose up --build` (app on :8081).

## Capabilities and Constraints

- The data is personal and sensitive: home addresses, phone numbers, children and family links, and life events such as illness and death. Who can see or edit what follows the role, and new features must not widen exposure by default.
- Undecided: whether it will ever be generalised for other congregations. Don't design for multiple tenants unless asked.

## Brand Commitments

- The Riverside Community Church name, address (100 Main St, Springfield) and phone number in the app are fictional placeholders, not a real church.

## Evidence on Hand

- The members, families, group and calendar illustrations in `frontend/src/assets/`, used on the Home page.
- No testimonials, usage numbers, member counts or endorsements from the church. Do not make any up.

## Product Principles

1. Members first: everyday tasks (find a person, see what's on, fix my family's details) must be obvious without training.
2. Readable for everyone: plain language, comfortable type and generous touch targets, because many users are older.
3. Works the same on phone and desktop: no task should exist on only one of them.
4. Private by default: show personal details only to the roles that need them, and treat life events with care.

## Accessibility & Inclusion

Many users are older, so aim for at least WCAG 2.1 AA, with particular care for text size, contrast, target size and simple wording. No other formal standard has been set.
