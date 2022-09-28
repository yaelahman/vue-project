import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Swal from 'sweetalert2'
import common from './helper/common'
// import vueProgressbar from 'vue-progressbar'
import VueProgressBar from "@aacassandra/vue3-progressbar"
import VueApexCharts from "vue3-apexcharts";
// import VueGoogleMaps from '@fawmi/vue-google-maps'
// import VueSimpleAlert from "vue-simple-alert";
// import lodash from "lodash"
import jQuery from 'jquery'
// import popperJS from "popper.js"
import VueGeolocation from "vue3-geolocation";
import GMaps from "vuejs3-google-maps";

import axios from 'axios'

window.env =
    import.meta.env

window.axios = axios
window.Swal = Swal
window.$ = window.jQuery = jQuery

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.isLoggedIn) {
            next({ name: 'login' })
        } else {
            next()
        }
    } else {
        next()
    }
})
const app = createApp(App)

app.use(store)
app.use(router)
app.mixin(common)
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')

// app.use(VueSimpleAlert);
app.use(VueProgressBar, {
    color: 'rgb(2, 117, 216)',
    failedColor: 'red',
    height: '2px'
})
app.component("apexchart", VueApexCharts);
// app.use(VueGoogleMaps, {
//     load: {
//         key: 'AIzaSyCWjSQkpYWRMa93lsB6UbQ8jeEWtH7J43s',
//         libraries: 'places',
//     }
// });
app.use(VueGeolocation);
app.use(GMaps, {
    load: {
        apiKey: "AIzaSyCWjSQkpYWRMa93lsB6UbQ8jeEWtH7J43s",
        libraries: ["places"],
    },
});

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    onOpen: toast => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
})
window.Toast = Toast

app.mount('#app')