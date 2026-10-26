<template>
  <v-app>
    <header class="shell bg-primary">
      <div class="shell-inner">
        <router-link to="/homepage" class="shell-brand" aria-label="Riverside Community Church, home">
          <span class="shell-name">Riverside</span>
          <span class="shell-sub">Community Church</span>
        </router-link>

        <nav v-if="currentUser" class="shell-nav" aria-label="Main">
          <router-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="shell-link"
            :class="{ 'shell-link--active': link.area === activeArea }"
            :aria-current="link.area === activeArea ? 'page' : null"
          >{{ link.label }}</router-link>
          <router-link
            v-if="showAdminBoard"
            to="/admin"
            class="shell-link"
            :class="{ 'shell-link--active': activeArea === 'admin' }"
            :aria-current="activeArea === 'admin' ? 'page' : null"
          >Admin Board</router-link>
        </nav>

        <div class="shell-account">
          <template v-if="currentUser">
            <router-link to="/profile" class="shell-link shell-link--quiet">
              <v-icon size="20" icon="mdi-account-circle" />{{ currentUser.username }}
            </router-link>
            <a class="shell-link shell-link--quiet" href @click.prevent="logOut">
              <v-icon size="20" icon="mdi-logout" />Log out
            </a>
          </template>
          <template v-else>
            <router-link to="/register" class="shell-link shell-link--quiet">
              <v-icon size="20" icon="mdi-account-plus" />Sign up
            </router-link>
            <router-link to="/login" class="shell-link shell-link--quiet">
              <v-icon size="20" icon="mdi-login" />Log in
            </router-link>
          </template>
        </div>
      </div>
    </header>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
// Which nav area each route belongs to, by path prefix
const ROUTE_AREAS = [
  ['/homepage', 'home'],
  ['/calendar', 'events'], ['/eventdetails', 'events'], ['/viewattendees', 'events'],
  ['/person', 'members'], ['/lifeevent', 'members'],
  ['/famil', 'families'],
  ['/group', 'groups'],
  ['/admin', 'admin']
];

export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_ADMIN');
      }
      return false;
    },
    links() {
      return [
        { to: '/homepage', label: 'Home', area: 'home' },
        { to: '/person', label: 'Members', area: 'members' },
        { to: '/families', label: 'Families', area: 'families' },
        { to: '/group', label: 'Groups', area: 'groups' },
        { to: '/calendar', label: 'Events Calendar', area: 'events' }
      ];
    },
    activeArea() {
      const match = ROUTE_AREAS.find(([prefix]) => this.$route.path.startsWith(prefix));
      return match ? match[1] : null;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/homepage');
    }
  }
};
</script>

<style>
.shell {
  position: relative;
  z-index: 5;
}
.shell-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  gap: 8px 28px;
  flex-wrap: wrap;
}
.shell-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #fff;
  min-height: 52px;
}
.shell-name {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #fff;
}
.shell-sub {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.85);
}
.shell-nav {
  display: flex;
  gap: 4px;
  flex: 1;
  min-width: 0;
}
.shell-account {
  display: flex;
  gap: 4px;
  margin-left: auto;
}
.shell-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 12px;
  border-radius: 10px;
  color: #fff;
  font-size: 1.0625rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.15s ease-out;
}
.shell-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}
.shell-link:focus-visible {
  outline-color: #fff;
}
/* The current page is underlined in gold */
.shell-link--active::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 2px;
  height: 4px;
  border-radius: 2px;
  background: rgb(var(--v-theme-gold));
}
.shell-link--quiet {
  font-weight: 400;
}

/* Phones and narrow windows: the nav gets its own scrolling row under the brand */
@media (max-width: 1023px) {
  .shell-inner {
    padding: 8px 16px 4px;
  }
  .shell-nav {
    order: 3;
    flex-basis: 100%;
    flex-wrap: wrap;
    margin: 0 -8px;
  }

}
@media (max-width: 479px) {
  .shell-sub {
    display: none;
  }
  .shell-link {
    padding: 0 10px;
  }
}
</style>
