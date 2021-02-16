import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

export default new VueRouter({ 
  mode: "history",
  base: process.env.NODE_ENV === "development" ? "/" : "/congregation/",

routes = [
  {
    path: "/person",
    name: "personlist",
    component: () => import("./components/Person")
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


