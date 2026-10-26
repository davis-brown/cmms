<template>
  <v-card class="group">
    <div class="group-head">
      <v-card-title class="group-title">{{ group.grp_name }}</v-card-title>
      <v-btn
        v-if="showAdminBoard || showModeratorBoard"
        @click="editGroup(group)"
        variant="tonal"
        color="primary"
        prepend-icon="mdi-pencil"
      >
        Edit
      </v-btn>
    </div>
    <p v-if="message" class="group-empty" role="alert">{{ message }}</p>
    <p v-else-if="loaded && people.length === 0" class="group-empty">No members yet.</p>
    <ul v-else class="group-people">
      <li v-for="person in people" :key="person.per_ID">
        <PersonAvatar :name="[person.frst_name, person.last_name].filter(Boolean).join(' ')" :color-key="familyKeys[person.per_ID] || person.last_name" :size="40" />
        <span class="group-name">{{ [person.frst_name, person.last_name].filter(Boolean).join(' ') }}</span>
        <a v-if="person.phone" :href="`tel:${person.phone}`" class="group-phone">{{ person.phone }}</a>
      </li>
    </ul>
  </v-card>
</template>

<script>
import GroupMemberService from "../services/GroupMemberService";
import PersonAvatar from "./PersonAvatar.vue";
import { loadFamilyKeys } from "../familyKeys";

export default {
    components: { PersonAvatar },
    computed: {
    people() {
      return this.groupMembers
        .filter(groupMember => groupMember.person)
        .map(groupMember => groupMember.person);
    },
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_ADMIN');
      }
      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_MODERATOR');
      }
      return false;
    }
  },
	name: 'Group-List',
    props: ['group'],
    data() {
        return {
            groupMembers: [],
            loaded: false,
            message: "",
            familyKeys: {},
            path: ""
            
        };
    },
    
	methods: {
 editGroup(group){
            this.$router.push({ name: 'groupedit', params: { id: group.grp_ID } });

 },
    getPeopleForGroup(grp_ID)  {
      GroupMemberService.getGroupMembers(grp_ID)
        .then(response => {
            this.groupMembers = response.data;
            this.loaded = true;
        })
        .catch(error => {
            this.message = (error.response && error.response.data.message) || error.message;
        });
    },

    },
    mounted() {
        this.getPeopleForGroup(this.group.grp_ID)
        loadFamilyKeys().then(keys => { this.familyKeys = keys; })
    }
};
</script>

<style scoped>
.group {
  height: 100%;
}
.group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 16px 4px 0;
  border-bottom: 1px solid var(--line);
  margin: 0 0 4px;
}
.group-title {
  font-weight: 700;
  font-size: 1.375rem;
  padding: 0 0 0 20px;
}
.group-empty {
  padding: 12px 20px 20px;
  color: var(--ink-muted);
}
.group-people {
  list-style: none;
  margin: 0;
  padding: 8px 20px 16px;
}
.group-people li {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
}
.group-name {
  font-weight: 700;
}
</style>