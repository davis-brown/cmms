import Vue from "vue";
import Router from "vue-router";
import FamiliesList from "./views/FamiliesList"
import FamilyAdd from "./views/FamilyAdd"
import FamilyEdit from "./views/FamilyEdit"
import Calendar from "./components/Calendar"

Vue.use(Router);

export default new Router({
  mode: "history",


  routes: [
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
      alias: "/calendar",
      name: "calendar",
      component: Calendar
    },
    {
      path: "/person",
      name: "personlist",
      component: () => import("./components/PersonList")
    },
    {
      path: "/personedit/:id",
      name: "person-edit",
      component: () => import("./components/PersonEdit")
    },
    {
      path: "/personadd",
      name: "personadd",
      component: () => import("./components/PersonAdd")
    }
  
  ]
});
