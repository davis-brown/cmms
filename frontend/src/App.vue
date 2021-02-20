<template>
  <v-app>
    <v-card
     height="1000"
     >

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
          Church Membership Management System
        </h2>
      </div>

      <v-spacer></v-spacer>

      <v-app-bar-nav-icon @click="drawer = true" right class="mr-4"></v-app-bar-nav-icon>

    </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        absolute
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
    </v-card>
  </v-app>
</template>

<script>
export default {
  name: "app",
  data() {
   
    return {
      drawer: false,
      items: [
        { title: 'Home', icon: 'mdi-home', href:"/home"},
        { title: 'Congregation Information', icon: 'mdi-church', href:"/congregation"},
        { title: 'Members', icon: 'mdi-account-box', href:"/members" },
        { title: 'Families', icon: 'mdi-account-group', href:"/families" },
        { title: 'Groups', icon: 'mdi-account-group-outline', href:"/groups" },
        { title: 'LifeGroups', icon: 'mdi-home-group', href:"/lifegroups" },
        { title: 'Events Calendar', icon: 'mdi-calendar', href:"./Calendar" },
       
      ],
    }
    
    }
  }
</script>