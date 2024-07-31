import { createApp } from 'vue'

import App from './App.vue'
import axiosPlugin from './plugins/axios';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'




/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* add icons to the library */
library.add(fas, far, fab)

/* import mongoDB pass */
import { mongodbUri } from './js/variables'

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.provide('mongodbUri', mongodbUri)

app.use(axiosPlugin);

app.mount('#app')