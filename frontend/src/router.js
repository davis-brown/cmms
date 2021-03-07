import Vue from "vue";
import Router from "vue-router";
import FamiliesList from "./views/FamiliesList"
import FamilyAdd from "./views/FamilyAdd"
import FamilyEdit from "./views/FamilyEdit"
import Calendar from "./components/Calendar"
import Congregation_Display from "./views/Congregation_Display"
import CongregationEdit from "./views/CongregationEdit"
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
      name: "calendar",
      component: Calendar
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
      path: "/congregation",
      name: "congregationdisplay",
      component: Congregation_Display
  },
  {
      path: "/congregationedit",
      name: "congregationedit",
      component: CongregationEdit
  },
  
  ]
});
