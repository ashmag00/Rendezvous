<template>
    <div>
        <h4 class="display-1">Commitments (GET)</h4>

        <v-data-table v-bind:headers="headers" v-bind:items="commitments">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.date }}</td>
                <td>{{ props.item.starttime }}</td>
                <td>{{ props.item.endtime }}</td>
                <td>{{ props.item.location }}</td>

            </template>
        </v-data-table>
    </div>
</template>

<script>
    const axios = require("axios");

    export default {
        name: "Commitments",
        data: function () {
            return {
                headers: [
                    {text: "Date", value: "date"},
                    {text: "Start Time", value: "starttime"},
                    {text: "End Time", value: "endtime"},
                    {text: "Location", value: "location"}
                ],
                commitments: []
            };
        },
        mounted: function () {
            if(this.$root.currentUser == null) {
                this.$router.push({ name: "login" });
            }
            axios.get(`/api/${this.$root.currentUser}/commitments`).then(response => {
                this.commitments = response.data.map(commitment => ({
                    date: (new Date(Date.parse(commitment.date))).toLocaleDateString("en-US"),
                    starttime: commitment.starttime,
                    endtime: commitment.endtime,
                    location: commitment.location
                }));
            });
        }
    };
</script>

<style scoped></style>
