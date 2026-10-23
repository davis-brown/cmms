<template>
  <div v-if="currentUser">
    <PageBand :title="`Hello ${currentUser.username}!`" />
    <div class="page-body page-body--narrow">
      <v-card>
        <div class="profile-head">
          <PersonAvatar :name="currentUser.username" :size="72" />
          <div>
            <h2>{{ currentUser.username }}</h2>
            <p class="profile-email">{{ currentUser.email }}</p>
          </div>
        </div>
        <div class="profile-roles">
          <h3>Roles</h3>
          <div class="d-flex flex-wrap ga-2 mt-2">
            <v-chip v-for="(role, index) in currentUser.roles" :key="index" color="primary" variant="tonal">
              {{ role.replace('ROLE_', '').toLowerCase() }}
            </v-chip>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import PageBand from "../components/PageBand.vue";
import PersonAvatar from "../components/PersonAvatar.vue";

export default {
  name: 'Profile',
  components: { PageBand, PersonAvatar },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  }
};
</script>


<!--
<v-container
    fluid
    style="height: 300px"
  >
    <v-row justify="center">
      <v-menu
        bottom
        min-width="200px"
        rounded
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            x-large
            v-on="on"
          >
            <v-avatar
              color="brown"
              size="48"
            >
              <span class="white--text headline">{{ user.initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar
                color="brown"
              >
                <span class="white--text headline">{{ groupMember.per_ID.frst_name }}</span>
              </v-avatar>
              <h3>{{ user.fullName }}</h3>
              <p class="caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                depressed
                rounded
                text
              >
                Edit Account
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn
                depressed
                rounded
                text
              >
                Disconnect
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-row>
    https://vuetifyjs.com/en/components/avatars/#advanced-usage
    -->

<style scoped>
.profile-head {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  border-bottom: 1px solid var(--line);
}
.profile-head h2 {
  margin: 0;
}
.profile-email {
  margin: 4px 0 0;
  color: var(--ink-muted);
}
.profile-roles {
  padding: 20px 24px 24px;
}
.profile-roles h3 {
  margin: 0;
}
</style>
