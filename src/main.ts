import Vue from "vue";
import "reflect-metadata";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import "./plugins/router";
import Girder from "./girder";

import main, { store } from "./store";

import router from "./views";
import App from "./App.vue";

import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;

Vue.use(Girder);

new Vue({
  provide: () => ({
    girderRest: main.girderRest
  }),
  router,
  store,
  vuetify,
  render: (h: any) => h(App)
}).$mount("#app");
