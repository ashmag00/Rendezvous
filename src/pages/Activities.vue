<template>
    <div>
        <h4 class="display-1">Activities</h4>

        <v-btn flat v-bind:to="{name: 'propose'}">Add new Activity</v-btn>
        <v-data-table v-bind:headers="headers" v-bind:items="activities">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.starttime }}</td>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.loc }}</td>
                <td>{{ props.item.endtime }}</td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    const axios = require("axios");

    export default {
        name: "Activities",
        data: function () {
            return {
                headers: [
                    {text: "Start Time", value: "starttime"},
                    {text: "Activity Name", value: "name"},
                    {text: "Location", value: "loc"},
                    {text: "End Time", value: "endtime"}
                ],
                activities: []
            };
        },
        mounted: function () {
            if(this.$root.currentUser == null) {
                this.$router.push({ name: "login" });
            }
            axios.get(`/api/${this.$root.currentUser}/activities`).then(response => {
                this.activities = response.data.map(activity => ({
                    name: activity.activityname,
                    loc: activity.location,
                    starttime: (new Date(Date.parse(activity.timeslots[0].starttime))).toLocaleDateString("en-US",{hour: "numeric", minute: "numeric"}),
                    endtime: (new Date(Date.parse(activity.timeslots[0].endtime))).toLocaleDateString("en-US",{hour: "numeric", minute: "numeric"})
                }));
            });
        }
    };
</script>

<style scoped></style>
