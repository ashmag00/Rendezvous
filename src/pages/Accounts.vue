<template>
    <div>
        <h4 class="display-1">Accounts</h4>

        <v-data-table v-bind:headers="headers" v-bind:items="accounts">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.email }}</td>
                <td>{{ props.item.firstName }}</td>
                <td>{{ props.item.lastName }}</td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    const axios = require("axios");

    export default {
        name: "Accounts",
        data: function () {
            return {
                headers: [
                    {text: "Email", value: "email"},
                    {text: "First", value: "firstName"},
                    {text: "Last", value: "lastName"}
                ],
                accounts: []
            };
        },
        mounted: function () {
            axios.get("/api/accounts").then(response => {
                this.accounts = response.data.map(account => ({
                    email: account.email,
                    firstName: account.firstname,
                    lastName: account.lastname
                }));
            });
        }
    };
</script>

<style scoped></style>
