import { createApp } from "vue";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./style.css";
import App from "./App.vue";

import { createPinia } from "pinia";
import router from "./router";
import { registerSW } from "virtual:pwa-register";
import { toastPlugin } from "./plugins/toastPlugin";
import { vDelayHighlight } from "./directives/delayHighlight";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.directive("delay-highlight", vDelayHighlight);

app.use(toastPlugin);

app.mount("#app");
registerSW();
