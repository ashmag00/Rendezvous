import Vue from "vue";

Vue.config.productionTip = false;

import Vuetify from "vuetify";

Vue.use(Vuetify);
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

import Login from "./pages/Login.vue";
import Activities from "./pages/Activities.vue";
import Propose from "./pages/Propose.vue";
import Getcommitments from "./pages/Getcommitments.vue";
import Getteams from "./pages/Getteam.vue";

import VueRouter from "vue-router";

Vue.use(VueRouter);
const router = new VueRouter({
    mode: "history",
    routes: [
        {name: "login", path: "/", component: Login},
        {name: "activities", path: "/activities", component: Activities},
        {name: "propose", path: "/activities/propose", component: Propose},
        {name: "getcommitments", path: "/getcommitments", component: Getcommitments},
        {name: "getteams", path: "/getteams", component: Getteams},
    ]
});

import App from "./App.vue";

new Vue({
    el: "#app",
    data: {
        currentUser: null
    },
    router,
    render: h => h(App)
});
