<template>
    <div>
        <h4 class="display-1">Activities</h4>

        <v-data-table v-bind:headers="headers" v-bind:items="activities">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
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
                    {text: "Activity Name", value: "name"},
                ],
                activities: []
            };
        },
        mounted: function () {
            axios.get(`/api/${this.$root.currentUser}/activities`).then(response => {
                this.activities = response.data.map(activity => ({
                    name: activity.activityname,
                }));
            });
        }
    };
</script>

<style scoped></style>
