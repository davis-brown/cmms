<template>
<v-app>
  <div id="app">
    <nav v-if="currentUser" class="navbar navbar-expand navbar-dark" style="background-color:#1b53c4; height: 40px;">

        <div v-if="currentUser" class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link to="/profile" class="nav-link">
              <font-awesome-icon icon="user-plus" />
              
       
              {{ currentUser.username }}
 
            </router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href @click.prevent="logOut">
              <font-awesome-icon icon="sign-out-alt" />LogOut
            </a>
          </li>
        </div>
    </nav>
    <header class="header header-absolute bg-gradient" style="height: 200px; background-color: #31609d;">
      <div class="container-fluid">
          <img style="display:block; height:150px; margin:auto" src="./assets/logoriverside.png">
          
      </div>
      <h3 class="nav-title font-weight-light text-center" style="color:#f1f1f1">Riverside Church Membership System</h3>
    </header>
      <nav class="navbar navbar-expand navbar-dark" style="background-color:#31609d;">
        <div class="navbar-nav mx-auto font-weight-normal" style="font-size:25px">
          <li class="nav-item">
            <router-link to="/home" class="nav-link">
              Home
            </router-link>
          </li>
          
    
          <li v-if="currentUser" class="nav-item">
            <router-link to="/calendar" class="nav-link">
            Events Calendar
            </router-link>
          </li>
          <li v-if="currentUser" class="nav-item">
            <router-link to="/person" class="nav-link">
            Members
            </router-link>
          </li>
          <li v-if="currentUser" class="nav-item">
            <router-link to="/families" class="nav-link">
            Families
            </router-link>
          </li>
          <li v-if="currentUser" class="nav-item">
            <router-link to="/group" class="nav-link">
            Groups
            </router-link>
          </li>
        </div>

        <div v-if="!currentUser" class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link to="/register" class="nav-link">
              <font-awesome-icon icon="user-plus" />Sign Up
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link">
              <font-awesome-icon icon="sign-in-alt" />Login
            </router-link>
          </li>
        </div>
      <div v-if="currentUser" class="navbar-nav">
        
        <li v-if="showAdminBoard" class="nav-item">
            <router-link to="/admin" class="nav-link">Admin Board</router-link>
          </li>
          <li v-if="showModeratorBoard" class="nav-item">
            <router-link to="/mod" class="nav-link">Moderator Board</router-link>
          </li>
 </div>
      </nav>
      </div>
  

      <v-main>
        <router-view />
       
      </v-main>

</v-app>

</template>

  <!-- <v-app>
    <v-app-bar app
      color="blue darken-4"
      height="100"
     dark>
      <v-img 
      alt="logo"
      src="./assets/logoriverside.png"
      :aspect-ratio="10/2"
      align
      />
     <div class="d-flex align-center mr-2">
        <h2 class="font-weight-light">
          Church Membership System
        </h2>
      </div>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click="drawer = true" right class="mr-4"></v-app-bar-nav-icon>
    </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        fixed
        temporary
        right
      >
        <v-list dense>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :href="item.href"
          >
          
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
  
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
        
          </v-list-item>
          
        </v-list>
      
      </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app> -->

<script>
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
    showModeratorBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_MODERATOR');
      }
      return false;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
  // name: "app",
  // data() {
   
  //   return {
  //     drawer: false,
  //     items: [
  //       { title: 'Home', icon: 'mdi-home', href:"/home"},
  //       { title: 'Congregation Information', icon: 'mdi-church', href:"/congregation"},
  //       { title: 'Members', icon: 'mdi-account-box', href:"/person" },
  //       { title: 'Families', icon: 'mdi-account-group', href:"/families" },
  //       { title: 'Groups', icon: 'mdi-account-group-outline', href:"/groups" },
  //       { title: 'LifeGroups', icon: 'mdi-home-group', href:"/lifegroups" },
  //       { title: 'Events Calendar', icon: 'mdi-calendar', href:"/calendar" },
  //     ],
  //   }
    
  //   }
  }
</script>
