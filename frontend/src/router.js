import Vue from "vue";
import Router from 'vue-router';
import Congregation_Display from "./views/Congregation_Display"
import CongregationEdit from "./views/CongregationEdit"

Vue.use(Router);
export default new Router({
    mode: "history",

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