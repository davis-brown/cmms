
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router.js';
import VueTextAreaAutosize from 'vue-textarea-autosize';
import { router } from './router';
import store from './store';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VeeValidate from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

Vue.use(VueTextAreaAutosize);
Vue.use(VeeValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);



Vue.config.productionTip = false;
new Vue({
  router,
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app')

