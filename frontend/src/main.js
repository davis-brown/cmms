
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router.js';
import VueTextAreaAutosize from 'vue-textarea-autosize';
import firebase from 'firebase/app';
import 'firebase/firestore';

Vue.use(VueTextAreaAutosize);

Vue.config.productionTip = false;

firebase.initializeApp({
  apiKey: "REMOVED",
    authDomain: "vue-calendar-11.firebaseapp.com",
    databaseURL: "https://vue-calendar-11-default-rtdb.firebaseio.com",
    projectId: "vue-calendar-11",
    storageBucket: "vue-calendar-11.appspot.com",
    messagingSenderId: "1085269062531",
    appId: "1:1085269062531:web:014ade62953e6b10e5bcb6"
});

export const db = firebase.firestore();

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')

