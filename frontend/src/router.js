import Vue from "vue";
import Router from "vue-router";
import FamiliesList from "./views/FamiliesList"
import FamilyAdd from "./views/FamilyAdd"
import FamilyEdit from "./views/FamilyEdit"
import Calendar from "./components/Calendar"
import CongregationEdit from "./views/CongregationEdit"
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
Vue.use(Router);

export const router = new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'HomePage',
      // lazy-loaded
      component: () => import('./views/HomePage.vue')
    },
    {
      path: '/homepage',
      name: 'HomePage',
      // lazy-loaded
      component: () => import('./views/HomePage.vue')
    },
    {
      path: '/congregation',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/profile',
      name: 'profile',
      // lazy-loaded
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      // lazy-loaded
      component: () => import('./views/BoardAdmin.vue')
    },
    {
      path: '/mod',
      name: 'moderator',
      // lazy-loaded
      component: () => import('./views/BoardModerator.vue')
    },
    {
      path: '/user',
      name: 'user',
      // lazy-loaded
      component: () => import('./views/BoardUser.vue')
    },
    {
      path: "/families",
      name: "familieslist",
      component: FamiliesList
    },
    {
      path: "/familyadd",
      name: "familyadd",
      component: FamilyAdd
    },
    {
      path: "/familyedit",
      name: "familyedit",
      component: FamilyEdit
    },
    {
      path: "/calendar",
      name: "calendar",
      component: Calendar
    },
    {
      path: "/eventdetails",
      name: "eventdetails",
      component: () => import("./views/EventDetails")
    },

    {
      path: "/person",
      name: "personlist",
      component: () => import("./views/PersonList")
    },
    {
      path: "/personedit",
      name: "person-edit",
      component: () => import("./views/PersonEdit")
    },
    {
      path: "/personadd",
      name: "personadd",
      component: () => import("./views/PersonAdd")
    },
    {
        path: "/congregationedit",
        name: "congregationedit",
        component: CongregationEdit
    },
    {
      path: "/congregationadd",
      name: "congregationadd",
      component: () => import("./views/CongregationAdd")

  },
  {
    path: "/group",
    name: "groupdisplay",
    component: () => import("./views/Group")

  },
  {
    path: "/groupadd",
    name: "groupadd",
    component: () => import("./views/GroupAdd")

  },
  {
    path: "/groupedit",
    name: "groupedit",
    component: () => import("./views/GroupEdit")

  }

  
  ]
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/homepage','/'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }

  if ((from.path=='/' || from.path=='/homepage')&& !loggedIn) {
    next('/login');
    if (loggedIn) {
      if (to.path=='/person'){
        router.push('/person');
      }
      if (to.path=='/group'){
        router.push('/group');
      }
      if (to.path=='/families'){
        router.push('/families');
      }
      if (to.path=='/calendar'){
        router.push('/calendar');
      }
    }
    

  }
});
