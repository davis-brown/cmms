import Vue from "vue";
import Router from "vue-router";
import FamiliesList from "./views/FamiliesList"
import FamilyAdd from "./views/FamilyAdd"
import FamilyEdit from "./views/FamilyEdit"

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.NODE_ENV === "development" ? "/" : "/congregations/",


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
    }
  ]
});
    