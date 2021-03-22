<!--<template>
  <v-app>
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
        { title: 'Members', icon: 'mdi-account-box', href:"/person" },
        { title: 'Families', icon: 'mdi-account-group', href:"/families" },
        { title: 'Groups', icon: 'mdi-account-group-outline', href:"/groups" },
        { title: 'LifeGroups', icon: 'mdi-home-group', href:"/lifegroups" },
        { title: 'Events Calendar', icon: 'mdi-calendar', href:"/calendar" },

      ],
    }
    
    }
  }

</script>
-->
<!--<template>
  <v-app>
    <v-app-bar
      app
      absolute
      color="#B22222"
      dark
      elevation-18
      extended
      tile
      extension-height="20"
    >
      <div class="d-flex align-center">
        <v-img
          alt="OC Logo"
          class="shrink mr-2"
          contain
          src="./assets/OC.png"
          transition="scale-transition"
          width="60"
        />
    <v-toolbar-title> 
      Team 3
    </v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        to="/majorlist"
        text-lg-right
        elevation="6"
      >
      <span class="mr-2">
      <v-icon>Majors</v-icon>
      </span>
      </v-btn>

      <v-btn
        to="/"
        text-lg-right
        elevation="6"
      >
        <span class="mr-2">
        <v-icon>Courses</v-icon>
        </span>
      </v-btn>

      <v-btn
        to="/studentlist">
            <span class="mr-2">
        <v-icon>Students</v-icon>
        </span>
      </v-btn>

  
      <v-btn
        to="/advisor"
        text-lg-right
        elevation="6"
      >
        <span class="mr-2">
        <v-icon>Advisors</v-icon>
        </span>
      </v-btn>

      <v-btn
        to="/semesterlist"
        text-lg-right
        elevation="6"
      >
      <span class="mr-2">
      <v-icon>Semesters</v-icon>
      </span>
      </v-btn>

      <v-btn
        to="/stucourseslist"
        text-lg-right
        elevation="6"
      >
        <span class="mr-2">
        <v-icon>Course Plan</v-icon>
        </span>
      </v-btn>

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>
-->
<template>
  <v-app>
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
     <v-btn
        to="/home"
        text-lg-right
        elevation="6"
      >
      <span class="mr-2">
      <v-icon>Home</v-icon>
      </span>
      </v-btn>

      <v-btn
        to="/congregation"
        text-lg-right
        elevation="6"
      >
        <span class="mr-2">
        <v-icon>Congregation</v-icon>
        </span>
      </v-btn>

      <v-btn
        to="/person">
            <span class="mr-2">
        <v-icon>Members</v-icon>
        </span>
      </v-btn>

  
      <v-btn
        to="/families"
        text-lg-right
        elevation="6"
      >
        <span class="mr-2">
        <v-icon>Family</v-icon>
        </span>
      </v-btn>

      <v-btn
        to="/group"
        text-lg-right
        elevation="6"
      >
      <span class="mr-2">
      <v-icon>Groups</v-icon>
      </span>
      </v-btn>

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
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
        { title: 'Members', icon: 'mdi-account-box', href:"/person" },
        { title: 'Families', icon: 'mdi-account-group', href:"/families" },
        { title: 'Groups', icon: 'mdi-account-group-outline', href:"/groups" },
        { title: 'LifeGroups', icon: 'mdi-home-group', href:"/lifegroups" },
        { title: 'Events Calendar', icon: 'mdi-calendar', href:"/calendar" },

      ],
    }
    
    }
  }

</script>
