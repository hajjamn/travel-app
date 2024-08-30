import { createApp } from "vue";

import App from "./App.vue";
import Home from "./components/Home.vue";
import Registration from "./components/Registration.vue";
import UpdateTravelView from "./view/UpdateTravelView.vue";
import UpdateStopView from "./view/UpdateStopView.vue";
import Login from "./components/Login.vue";
import TravelCreate from "./components/TravelCreate.vue";

import axiosPlugin from "./plugins/axios";

// Importiamo bootstrap perche' rompe le palle
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

import { createRouter, createWebHistory } from "vue-router";
const routes = [
  { path: "/", component: Home, name: "home" },
  { path: "/registration", component: Registration, name: "registration" },
  { path: "/login", component: Login, name: "login" },
  { path: "/new-travel", component: TravelCreate, name: "travelCreate" },
  {
    path: "/update/:id",
    component: UpdateTravelView,
    name: "updateTravelView",
    props: (route) => ({ id: route.query.id }),
  },
  {
    path: '/update-stop/:id',
    name: 'updateStopView',
    component: UpdateStopView,
    props: true, // Allow passing the route params as props
  },
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
