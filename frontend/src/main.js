import { createApp } from 'vue'
import vuetify from './plugins/vuetify';
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import './styles/app.css';
import { router } from './router';
import store from './store';
import App from './App.vue'

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')
