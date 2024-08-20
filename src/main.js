import { createApp } from "vue";
import cors from "cors";
import cookieParser from "cookie-parser";

import App from "./App.vue";
import Home from "./components/Home.vue";
import Registration from "./components/Registration.vue";
import Login from "./components/Login.vue";

import axiosPlugin from "./plugins/axios";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import cookieParser from "cookie-parser";

/* add icons to the library */
library.add(fas, far, fab);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

app.use(axiosPlugin);
app.use(router);

app.mount("#app");
