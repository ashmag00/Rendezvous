import Vue from "vue";

Vue.config.productionTip = false;

import Vuetify from "vuetify";

Vue.use(Vuetify);
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

import Login from "./pages/Login.vue";
import Activities from "./pages/Activities.vue";
import Getcommitments from "./pages/Getcommitments.vue";
import Getteams from "./pages/Getteam.vue";


/*import Home from "./pages/Home.vue";
import SignUp from "./pages/SignUp.vue";
import About from "./pages/About.vue";
import Accounts from "./pages/Accounts.vue";
import ResetPassword from "./pages/ResetPassword.vue";*/

import VueRouter from "vue-router";

Vue.use(VueRouter);
const router = new VueRouter({
    mode: "history",
    routes: [
        {name: "login", path: "/", component: Login},
        {name: "activities", path: "/activities", component: Activities},
        {name: "getcommitments", path: "/getcommitments", component: Getcommitments},
        {name: "getteams", path: "/getteams", component: Getteams},

        /*
        {name: "sign-up", path: "/sign-up", component: SignUp},
        {name: "about-us", path: "/about-us", component: About},
        {name: "accounts", path: "/accounts", component: Accounts},
        {name: "reset-password", path: "/reset-password", component: ResetPassword}*/
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
