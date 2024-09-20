import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axiosPlugin from "./plugins/axios";

// Import font-awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, far, fab } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

library.add(fas, far, fab);

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(axiosPlugin);
app.use(router);
app.mount("#app");
