<template>
    <v-app>
        <nav-bar />
        <v-content>
            <v-container> <router-view></router-view> </v-container>
        </v-content>
    </v-app>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
    components: {
        NavBar
    }
};
</script>
