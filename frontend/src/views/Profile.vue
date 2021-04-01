<template>
  <div class="container" style="font-size: 20px">
    <header class="jumbotron" style="background-color: light-grey">
  
        <h2 class="text-center"><strong>Hello {{currentUser.username}}!</strong></h2>
        <h5 class="text-center">Edit your information below</h5>

    </header>
    <!-- <p>
      <strong>Token:</strong>
      {{currentUser.accessToken.substring(0, 20)}} ... {{currentUser.accessToken.substr(currentUser.accessToken.length - 20)}}
    </p> -->
    <!-- <p>
      <strong>Id:</strong>
      {{currentUser.id}}
    </p> -->
    <p>
      <strong>Username:</strong>
      {{currentUser.username}}
    </p>
    <p>
      <strong>Email:</strong>
      {{currentUser.email}}
    </p>
    <strong>Role:</strong>
    <ul>
      <li v-for="(role,index) in currentUser.roles" :key="index">{{role}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Profile',
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