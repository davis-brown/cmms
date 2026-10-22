<template>
  <v-main>
    <v-container fluid>
      <h1>Users</h1>
      <p class="text-center">
        New sign-ups can't log in until they're approved. Link an account to a
        member with the Login username field on that member's edit page.
      </p>

      <v-alert v-if="message" :type="messageType" closable @click:close="message = ''">
        {{ message }}
      </v-alert>

      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        item-value="id"
        :sort-by="[{ key: 'approved', order: 'asc' }]"
        class="elevation-1"
      >
        <template v-slot:[`item.member`]="{ item }">
          {{ item.member ? item.member.name : "Not linked" }}
        </template>

        <template v-slot:[`item.approved`]="{ item }">
          <v-chip size="small" :color="item.approved ? 'green' : 'orange'">
            {{ item.approved ? "Approved" : "Waiting" }}
          </v-chip>
        </template>

        <template v-slot:[`item.roles`]="{ item }">
          <v-select
            :model-value="item.roles"
            :items="roleNames"
            multiple
            chips
            density="compact"
            hide-details
            :aria-label="`Roles for ${item.username}`"
            @update:model-value="roles => setRoles(item, roles)"
          ></v-select>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex justify-end">
            <v-btn
              v-if="!item.approved"
              size="small"
              color="primary"
              class="mr-2"
              @click="setApproved(item, true)"
            >Approve</v-btn>
            <v-btn
              v-else-if="!isSelf(item)"
              size="small"
              variant="outlined"
              class="mr-2"
              @click="setApproved(item, false)"
            >Revoke</v-btn>
            <v-btn
              v-if="!isSelf(item)"
              size="small"
              variant="outlined"
              color="red"
              @click="deleteUser(item)"
            >Delete</v-btn>
          </div>
        </template>
      </v-data-table>
    </v-container>
  </v-main>
</template>

<script>
import UserService from "../services/user.service";

export default {
  name: "Admin",
  data() {
    return {
      users: [],
      loading: false,
      message: "",
      messageType: "success",
      roleNames: ["user", "leader", "moderator", "admin"],
      headers: [
        { title: "Username", value: "username" },
        { title: "Email", value: "email" },
        { title: "Member", value: "member", sortable: false },
        { title: "Status", value: "approved" },
        { title: "Roles", value: "roles", sortable: false, width: "280px" },
        { title: "", value: "actions", sortable: false, align: "end" },
      ],
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    isSelf(user) {
      return this.currentUser && user.id === this.currentUser.id;
    },
    show(message, type = "success") {
      this.message = message;
      this.messageType = type;
    },
    showError(error) {
      this.show((error.response && error.response.data.message) || error.message, "error");
    },
    getUsers() {
      this.loading = true;
      return UserService.getUsers()
        .then(response => {
          this.users = response.data;
        })
        .catch(this.showError)
        .finally(() => {
          this.loading = false;
        });
    },
    update(user, changes, done) {
      return UserService.updateUser(user.id, changes)
        .then(() => this.show(done))
        .catch(this.showError)
        // Reload either way so the table matches what was saved
        .finally(this.getUsers);
    },
    setApproved(user, approved) {
      if (!approved && !window.confirm(`Revoke ${user.username}'s access? They'll be logged out.`)) {
        return;
      }
      this.update(user, { approved }, `${user.username} ${approved ? "can now log in" : "can no longer log in"}.`);
    },
    setRoles(user, roles) {
      this.update(user, { roles }, `Updated ${user.username}'s roles.`);
    },
    deleteUser(user) {
      if (!window.confirm(`Delete the account ${user.username}? Their member record is kept.`)) {
        return;
      }
      UserService.deleteUser(user.id)
        .then(() => this.show(`Deleted ${user.username}.`))
        .catch(this.showError)
        .finally(this.getUsers);
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>
