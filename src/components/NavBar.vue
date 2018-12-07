<template>
    <v-toolbar dark color="primary">
        <v-toolbar-side-icon></v-toolbar-side-icon>

        <router-link v-bind:to="{ name: 'activities' }">
            <v-toolbar-title class="white--text">
                Rendezvous
            </v-toolbar-title>
        </router-link>

        <v-spacer></v-spacer>

        <v-btn flat v-bind:to="{ name: 'login' }">Login</v-btn>
        <v-btn flat v-bind:to="{ name: 'getcommitments' }">Commitment</v-btn>
        <v-btn flat v-bind:to="{ name: 'getteams' }">Team</v-btn>


    </v-toolbar>
</template>
