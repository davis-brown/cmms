import Vue from "vue";
import Router from "vue-router";
import FamiliesList from "./views/FamiliesList"
import FamilyAdd from "./views/FamilyAdd"
import FamilyEdit from "./views/FamilyEdit"
import Calendar from "./components/Calendar"
import CongregationEdit from "./views/CongregationEdit"
import HomePage from "./views/HomePage"
import LifeEventList from "./views/LifeEventList"
import LifeEventAdd from "./views/LifeEventAdd"
import LifeEventEdit from "./views/LifeEventEdit"
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import LifeEventPerson from "./views/LifeEventPerson"
import LifeEventPersonAdd from "./views/LifeEventPersonAdd"
Vue.use(Router);

export const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/homepage"
    },
    {
      path: "/lifeevent",
      name: "lifeevent",
      component: LifeEventList
    },
    {
      path: "/lifeeventadd",
      name: "lifeeventadd",
      component: LifeEventAdd
    },
    {
      path: "/lifeeventedit/:id",
      name: "lifeeventedit",
      component: LifeEventEdit
    },
    {
      path: "/lifeeventperson/:id?",
      name: "lifeeventperson",
      component: LifeEventPerson
    },
    {
      path: "/lifeeventpersonadd/:id?",
      name: "lifeeventpersonadd",
      component: LifeEventPersonAdd
    },
    {
      path: '/homepage',
      name: 'HomePage',
      component: HomePage
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
      path: "/familyedit/:id",
      name: "familyedit",
      component: FamilyEdit
    },
    {
      path: "/calendar",
      name: "calendar",
      component: Calendar
    },
    {
      path: "/eventdetails/:id",
      name: "eventdetails",
      component: () => import("./views/EventDetails")
    },
    {
      path: "/viewattendees/:id",
      name: "viewattendees",
      component: () => import("./views/ViewAttendees")
    },
    {
      path: "/person",
      name: "personlist",
      component: () => import("./views/PersonList")
    },
    {
      path: "/personedit/:id",
      name: "person-edit",
      component: () => import("./views/PersonEdit")
    },
    {
      path: "/personadd",
      name: "personadd",
      component: () => import("./views/PersonAdd")
    },
    {
      path: "/congregationedit/:id",
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
      // Older links to /home go to the same page as /homepage
      path: "/home",
      redirect: "/homepage"
    },
    {
      path: "/groupadd",
      name: "groupadd",
      component: () => import("./views/GroupAdd")
    },
    {
      path: "/groupedit/:id",
      name: "groupedit",
      component: () => import("./views/GroupEdit")
    }
  ]
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/homepage'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});
