import Vue from "vue";
import Router from './router';
import Congregation_Display from "./views/Congregation_Display"
import CongregationEdit from "./views/CongregationEdit"

Vue.use(Router);
export default new Router({
    mode: "history",
    base: process.env.NODE_ENV === "development" ? "/": "/congregation/",

    routes:[
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
})