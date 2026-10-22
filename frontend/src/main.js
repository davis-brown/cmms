import { createApp } from 'vue'
// Before Vuetify, so Vuetify's spacing classes (my-5, px-5, ...) win over Bootstrap's like they did in Vuetify 2
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import vuetify from './plugins/vuetify';
import { router } from './router';
import store from './store';
import App from './App.vue'
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

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
