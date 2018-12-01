<template>
    <v-toolbar dark color="primary">
        <v-toolbar-side-icon></v-toolbar-side-icon>

        <router-link v-bind:to="{ name: 'home-page' }">
            <v-toolbar-title class="white--text">
                Single Page App
            </v-toolbar-title>
        </router-link>

        <v-spacer></v-spacer>

        <v-btn flat v-bind:to="{ name: 'sign-up' }">Sign Up</v-btn>

        <v-btn flat v-bind:to="{ name: 'about-us' }">About Us</v-btn>

	<v-btn flat v-bind:to="{ name: 'reset-password' }">Reset Password</v-btn>

        <v-menu offset-y>
            <v-btn flat slot="activator">
                <span>Admin</span>
                <v-icon dark>arrow_drop_down</v-icon>
            </v-btn>

            <v-list>
                <v-list-tile v-bind:to="{ name: 'accounts' }">
                    <v-list-tile-title>Accounts</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </v-toolbar>
</template>
