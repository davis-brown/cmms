<template>
  <div class="home">
    <section class="home-welcome">
      <div class="home-inner">
        <h1 v-if="currentUser">{{ greeting }}, {{ currentUser.username }}</h1>
        <h1 v-else>Welcome to Riverside</h1>
        <p class="home-lede">
          <template v-if="currentUser">Find a member, look up a family, or see what's on this week.</template>
          <template v-else>The members' directory and calendar for Riverside Community Church. Log in to find people, families, groups and events.</template>
        </p>
        <div v-if="!currentUser" class="home-auth">
          <v-btn color="primary" size="large" to="/login">Log in</v-btn>
          <v-btn variant="outlined" color="primary" size="large" to="/register">Sign up</v-btn>
        </div>
      </div>
    </section>

    <section class="home-inner" aria-label="Areas">
      <ul class="area-grid">
        <li v-for="area in areas" :key="area.to">
          <router-link :to="area.to" class="area-tile">
            <v-icon :icon="area.icon" size="28" color="primary" class="area-tile-icon" />
            <span class="area-tile-name">{{ area.label }}</span>
            <span v-if="area.count !== null" class="area-tile-count">{{ area.count }} {{ area.noun }}</span>
          </router-link>
        </li>
      </ul>
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
        { to: '/person', label: 'Members', icon: 'mdi-account-multiple', noun: 'people', count: c.members },
        { to: '/families', label: 'Families', icon: 'mdi-home-account', noun: 'families', count: c.families },
        { to: '/group', label: 'Groups', icon: 'mdi-account-group', noun: 'groups', count: c.groups },
        { to: '/calendar', label: 'Events', icon: 'mdi-calendar', noun: 'coming up', count: c.events }
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
.home-welcome {
  padding: 48px 0 8px;
}
.home-lede {
  margin: 12px 0 0;
  font-size: 1.25rem;
  color: var(--ink-muted);
  max-width: 52ch;
}
.home-auth {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}

/* The four areas as quiet link tiles */
.area-grid {
  list-style: none;
  margin: 0;
  padding: 32px 0 40px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.area-tile {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  color: var(--ink);
  text-decoration: none;
  transition: border-color 0.15s ease-out, box-shadow 0.15s ease-out;
}
.area-tile:hover {
  color: var(--ink);
  border-color: rgba(var(--v-theme-primary), 0.5);
  box-shadow: var(--shadow-card);
}
.area-tile-icon {
  margin-bottom: 8px;
}
.area-tile-name {
  font-size: 1.25rem;
  font-weight: 700;
}
.area-tile-count {
  color: var(--ink-muted);
}

.home-coming {
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
  .area-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 599px) {
  .home-inner {
    padding: 0 16px;
  }
  .home-welcome {
    padding-top: 28px;
  }
  .area-grid {
    padding: 24px 0 32px;
    gap: 12px;
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
