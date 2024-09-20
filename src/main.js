import { createApp } from "vue";
import App from "./App.vue"; // Main App.vue remains the same
import router from "./router"; // Router is now imported from the new router/index.js
import axiosPlugin from "./plugins/axios"; // Axios plugin remains the same

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// FontAwesome imports
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";  // Solid icons
import { far } from "@fortawesome/free-regular-svg-icons";  // Regular icons
import { fab } from "@fortawesome/free-brands-svg-icons";  // Brands icons

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"; // Import FontAwesomeIcon

library.add(fas, far, fab);

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon); // Register FontAwesomeIcon globally

app.use(axiosPlugin);
app.use(router);
app.mount("#app");
