import { createRouter, createWebHistory } from "vue-router";
/* Auth */
import Login from "../views/auth/Login.vue";
import Registration from "../views/auth/Registration.vue";
/* Travel */
import TravelCreate from "../views/travel/TravelCreate.vue";
import TravelRead from "../views/travel/TravelRead.vue";
import TravelUpdate from "../views/travel/TravelUpdate.vue";
/* Days */
import DayRead from "../views/days/DayRead.vue";
/* Stops */
import StopRead from "../views/stops/StopRead.vue";
import StopUpdate from "../views/stops/StopUpdate.vue";
/* Home */
import Home from "../views/Home.vue"; // Keep home at root for now

const routes = [
    { path: "/", component: Home, name: "home" },
    /* Auth Routes */
    { path: "/login", component: Login, name: "login" },
    { path: "/registration", component: Registration, name: "registration" },
    /* Travel Routes */
    { path: "/travel/create", component: TravelCreate, name: "travelCreate" },
    { path: "/travel/:id", component: TravelRead, name: "travelRead", props: true },
    { path: "/travel/:id/update", component: TravelUpdate, name: "travelUpdate", props: (route) => ({ id: route.params.id }) },
    /* Days Routes */
    { path: "/travel/:id/day/:dayNumber", component: DayRead, name: "dayRead", props: route => ({ id: route.params.id, travelId: route.params.id, dayNumber: Number(route.params.dayNumber) }) },
    /* Stops Routes */
    { path: "/travel/:travelId/day/:dayNumber/stop/:id", component: StopRead, name: "stopRead", props: route => ({ id: route.params.id, travelId: route.params.travelId, dayNumber: Number(route.params.dayNumber) }) },
    { path: "/stop/:id/update", component: StopUpdate, name: "stopUpdate", props: true },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

export default router;
