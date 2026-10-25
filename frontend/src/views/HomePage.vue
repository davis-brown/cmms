<template>
  <div class="home">
    <section class="home-welcome">
      <div class="home-inner">
        <p class="home-place">Riverside Community Church</p>
        <h1 v-if="currentUser">{{ greeting }}, {{ currentUser.username }}</h1>
        <h1 v-else>Welcome to Riverside</h1>
        <p class="home-lede">
          <template v-if="currentUser">Find a member, look up a family, or see what's on this week.</template>
          <template v-else>The members' directory and calendar for Riverside Community Church. Log in to find people, families, groups and events.</template>
        </p>
        <div v-if="!currentUser" class="home-auth">
          <v-btn color="white" variant="flat" size="large" class="text-primary" to="/login">Log in</v-btn>
          <v-btn variant="outlined" color="white" size="large" to="/register">Sign up</v-btn>
        </div>
        <p class="home-address">100 Main St, Springfield</p>
      </div>
    </section>

    <section v-if="currentUser" class="home-inner home-coming">
      <div class="home-coming-head">
        <h2>Coming up</h2>
        <v-btn variant="text" color="primary" to="/calendar" append-icon="mdi-arrow-right">Full calendar</v-btn>
      </div>
      <p v-if="upcoming === null" class="home-quiet">Loading events…</p>
      <p v-else-if="upcoming.length === 0" class="home-quiet">
        Nothing coming up.
        <router-link to="/calendar">Open the calendar</router-link> to see past events or add one.
      </p>
      <ol v-else class="board">
        <li v-for="event in upcoming" :key="event.evt_ID">
          <router-link :to="{ name: 'eventdetails', params: { id: event.evt_ID } }" class="board-row">
            <span class="board-date" :class="`bg-${eventColor(event.color)}`">
              <span class="board-day">{{ event.day }}</span>
              <span class="board-month">{{ event.month }}</span>
            </span>
            <span class="board-name">{{ event.event_name }}</span>
            <span class="board-when">{{ event.weekday }} · {{ event.time }}</span>
            <span class="board-where">{{ event.loc_ID }}</span>
          </router-link>
        </li>
      </ol>
    </section>

    <section aria-label="Areas" class="areas">
      <article v-for="area in areas" :key="area.to" class="area">
        <div class="home-inner area-inner">
          <div class="area-art">
            <img :src="area.art" alt="" loading="lazy">
          </div>
          <div class="area-text">
            <h2 class="area-name">{{ area.label }}</h2>
            <p class="area-blurb">{{ area.blurb }}</p>
            <p v-if="area.count !== null" class="area-count">{{ area.count }} {{ area.noun }}</p>
            <v-btn :to="area.to" class="area-link" color="primary" variant="outlined" size="large" append-icon="mdi-arrow-right">
              Open {{ area.label }}
            </v-btn>
          </div>
        </div>
      </article>
    </section>

    <footer class="home-footer">
      <div class="home-inner">
        <strong>Riverside Community Church</strong>
        <span>100 Main St, Springfield</span>
        <a href="tel:+15555550100">555-555-0100</a>
        <span>Copyright &copy;{{ year }}</span>
      </div>
    </footer>
  </div>
</template>

<script>
import PersonDataService from '../services/PersonDataService';
import FamilyService from '../services/FamilyService';
import GroupDataService from '../services/GroupDataService';
import EventService from '../services/EventService';
import { eventColor } from '../eventColors';
import membersArt from '../assets/members.jpg';
import familiesArt from '../assets/big-family.jpg';
import groupsArt from '../assets/group.jpg';
import eventsArt from '../assets/calendarpicture.jpg';

export default {
  name: 'HomePage',
  data() {
    return {
      counts: { members: null, families: null, groups: null, events: null },
      upcoming: null,
      year: new Date().getFullYear()
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    greeting() {
      const hour = new Date().getHours();
      return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    },
    areas() {
      const c = this.counts;
      return [
        { to: '/person', label: 'Members', art: membersArt, noun: 'people', count: c.members,
          blurb: 'Find out more about the members of Riverside church: who they are and how to reach them.' },
        { to: '/families', label: 'Families', art: familiesArt, noun: 'families', count: c.families,
          blurb: 'Keep your own family\'s details up to date and see the other families in the congregation.' },
        { to: '/group', label: 'Groups', art: groupsArt, noun: 'groups', count: c.groups,
          blurb: 'Discover the groups at Riverside and who belongs to each one.' },
        { to: '/calendar', label: 'Events', art: eventsArt, noun: 'coming up', count: c.events,
          blurb: 'Keep up with what\'s happening at Riverside, RSVP, and say what you\'re bringing.' }
      ];
    }
  },
  created() {
    if (!this.currentUser) return;
    const count = (key, request) =>
      request.then(response => { this.counts[key] = response.data.length; }).catch(() => {});
    count('members', PersonDataService.getAll());
    count('families', FamilyService.getFamilies());
    count('groups', GroupDataService.getAll());
    EventService.getEvents()
      .then(response => {
        const today = new Date().toLocaleDateString('en-CA'); // local YYYY-MM-DD
        const coming = response.data
          .filter(e => e.event_date && e.event_date.substr(0, 10) >= today)
          .sort((a, b) => (a.event_date + a.event_start).localeCompare(b.event_date + b.event_start));
        this.counts.events = coming.length;
        this.upcoming = coming.slice(0, 5).map(this.describe);
      })
      .catch(() => { this.upcoming = []; });
  },
  methods: {
    eventColor,
    describe(event) {
      const [y, m, d] = event.event_date.substr(0, 10).split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const [hh, mm] = (event.event_start || '00:00').split(':').map(Number);
      const at = new Date(y, m - 1, d, hh, mm);
      return {
        ...event,
        day: d,
        month: date.toLocaleDateString(undefined, { month: 'short' }),
        weekday: date.toLocaleDateString(undefined, { weekday: 'long' }),
        time: at.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
      };
    }
  }
};
</script>

<style scoped>
.home-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
/* The stained-glass window under a cobalt wash, closed by the gold band rule */
.home-welcome {
  padding: 72px 0 40px;
  color: #fff;
  background:
    linear-gradient(90deg, rgba(18, 33, 78, 0.92) 0%, rgba(18, 33, 78, 0.78) 50%, rgba(18, 33, 78, 0.45) 100%),
    url('../assets/riversidewindow.jpg') center 40% / cover no-repeat #12214e;
  border-bottom: 3px solid rgb(var(--v-theme-gold));
}
.home-welcome h1 {
  color: #fff;
  font-size: clamp(2rem, 4.5vw, 3rem);
}
.home-place {
  margin: 0 0 8px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 0.9375rem;
  color: rgb(var(--v-theme-gold));
}
.home-lede {
  margin: 12px 0 0;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 52ch;
}
.home-auth {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}
.home-address {
  margin: 40px 0 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.75);
}

/* The four areas: illustration and text, alternating sides on alternating bands */
.area:nth-child(even) {
  background: #f1f4f9;
}
.area-inner {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  align-items: center;
  gap: 56px;
  padding-top: 56px;
  padding-bottom: 56px;
}
.area:nth-child(even) .area-art {
  order: 2;
}
.area-art {
  aspect-ratio: 5 / 4;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
}
.area-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.area-name {
  font-size: clamp(1.75rem, 3.5vw, 2.25rem);
  margin: 0;
}
.area-name::before {
  content: '';
  display: block;
  width: 40px;
  height: 3px;
  border-radius: 2px;
  margin-bottom: 16px;
  background: rgb(var(--v-theme-gold));
}
.area-blurb {
  margin: 12px 0 0;
  font-size: 1.1875rem;
  max-width: 44ch;
}
.area-count {
  margin: 8px 0 0;
  color: var(--ink-muted);
  font-weight: 700;
}
.area-link {
  margin-top: 24px;
}

.home-coming {
  padding-top: 40px;
  padding-bottom: 56px;
}
.home-coming-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.home-quiet {
  color: var(--ink-muted);
}

/* Coming up: a board with fixed columns */
.board {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--line);
}
.board-row {
  display: grid;
  grid-template-columns: 64px minmax(0, 2fr) minmax(0, 1.4fr) minmax(0, 1fr);
  align-items: center;
  gap: 20px;
  padding: 12px 8px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  text-decoration: none;
  transition: background-color 0.15s ease-out;
}
.board-row:hover {
  background: #f7f9fc;
  color: var(--ink);
}
.board-date {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.board-day {
  font-weight: 700;
  font-size: 1.375rem;
}
.board-month {
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
}
.board-name {
  font-weight: 700;
  font-size: 1.125rem;
}
.board-when,
.board-where {
  color: var(--ink-muted);
}

.home-footer {
  background: #fff;
  border-top: 1px solid var(--line);
  padding: 28px 0;
  font-size: 1rem;
  color: var(--ink-muted);
}
.home-footer .home-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 24px;
}
.home-footer strong {
  color: var(--ink);
}

@media (max-width: 899px) {
  .area-inner {
    gap: 32px;
  }
}
@media (max-width: 599px) {
  .home-inner {
    padding: 0 16px;
  }
  .home-welcome {
    padding: 40px 0 28px;
  }
  .home-address {
    margin-top: 28px;
  }
  .area-inner {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
    padding-top: 32px;
    padding-bottom: 36px;
  }
  .area:nth-child(even) .area-art {
    order: 0;
  }
  .area-art {
    aspect-ratio: 16 / 10;
  }
  .board-row {
    grid-template-columns: 56px minmax(0, 1fr);
    gap: 4px 14px;
  }
  .board-date {
    grid-row: span 3;
  }
}
</style>
