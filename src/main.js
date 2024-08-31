import { createApp } from "vue";

import App from "./App.vue";
import Home from "./components/Home.vue";
/* Auth */
import Login from "./components/Login.vue";
import Registration from "./components/Registration.vue";
/* Travels */
import TravelCreate from "./views/TravelCreate.vue";
import TravelRead from "./views/TravelRead.vue"
import TravelUpdate from "./views/TravelUpdate.vue"
/* Days */
import DayRead from "./views/DayRead.vue"
/* Stops */
import StopRead from "./views/StopRead.vue"
import StopUpdate from "./views/StopUpdate.vue";

import axiosPlugin from "./plugins/axios";

// Importiamo bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

/* ROUTES */
import { createRouter, createWebHistory } from "vue-router";
const routes = [
  { path: "/", component: Home, name: "home" },
  /* Authorization */
  { path: "/login", component: Login, name: "login" },
  { path: "/registration", component: Registration, name: "registration" },
  /* Travels */
  { path: "/travel/create", component: TravelCreate, name: "travelCreate" },
  { path: '/travel/:id', component: TravelRead, name: 'travelRead', props: true },
  { path: "/travel/:id/update", component: TravelUpdate, name: "travelUpdate", props: (route) => ({ id: route.params.id }), },
  /* Days */
  { path: "/travel/:id/day/:dayNumber", component: DayRead, name: "dayRead", props: route => ({ id: route.params.id, dayNumber: Number(route.params.dayNumber) }) },
  /* Stops */
  { path: "/travel/:travelId/day/:dayNumber/stop/:id", component: StopRead, name: "stopRead", props: route => ({ id: route.params.id, travelId: route.params.travelId, dayNumber: Number(route.params.dayNumber) }) },
  { path: "/stop/:id/update", component: StopUpdate, name: "stopUpdate", props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* add icons to the library */
library.add(fas, far, fab);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

app.use(axiosPlugin);
app.use(router);

app.mount("#app");
