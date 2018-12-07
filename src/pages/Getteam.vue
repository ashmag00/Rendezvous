<template>
    <div>
        <h4 class="display-1">Teams (GET)</h4>

        <v-data-table v-bind:headers="headers" v-bind:items="teams">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.teamname }}</td>

            </template>
        </v-data-table>
    </div>
</template>

<script>
    const axios = require("axios");

    export default {
        name: "Teams",
        data: function () {
            return {
                headers: [
                    {text: "Team Name", value: "teamname"}
                ],
                teams: []
            };
        },
        mounted: function () {
            if(this.$root.currentUser == null) {
                this.$router.push({ name: "login" });
            }
            axios.get(`/api/teams/${this.$root.currentUser}`).then(response => {
                this.teams = response.data.map(team => ({
                    teamname: team
                }));
            });
        }
    };
</script>

<style scoped></style>
