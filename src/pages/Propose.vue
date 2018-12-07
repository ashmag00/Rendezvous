<template>
    <div>
        <h4 class="display-1">Propose Activity</h4>

        <v-form v-model="valid">
            <v-text-field
                v-model="team"
                error-count="10"
                label="teamID"
            >
            </v-text-field>
            <v-text-field
                v-model="location"
                error-count="10"
                label="Location"
            >
            </v-text-field>
            <v-text-field
                v-model="name"
                error-count="10"
                label="Activity Name"
            >
            </v-text-field>
            <v-subheader>Start Date</v-subheader>
            <v-date-picker full-width v-model="startDate" label="Date" required></v-date-picker>
            <v-subheader>Start Time</v-subheader>
            <v-time-picker full-width v-model="startTime" label="Time" required></v-time-picker>
            <v-subheader>End Date</v-subheader>
            <v-date-picker full-width v-model="endDate" label="Date" required></v-date-picker>
            <v-subheader>End Time</v-subheader>
            <v-time-picker full-width v-model="endTime" label="Time" required></v-time-picker>
            <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit"
                >Submit
            </v-btn>
        </v-form>

        <div class="text-xs-center">
            <v-dialog v-model="dialogVisible" width="500">
                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>
                        {{ dialogHeader }}
                    </v-card-title>

                    <v-card-text> {{ dialogText }} </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat v-on:click="hideDialog"
                            >Okay</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "ProposePage",
    data: function() {
        return {
            valid: false,
            team: "",
            location: "",
            name: "",
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",

            dialogHeader: "<no dialogHeader>",
            dialogText: "<no dialogText>",
            dialogVisible: false,

            rules: {
                required: [
                    val => val.length > 0 || 'Required'
                ],
            }
        };
    },
    methods: {
        handleSubmit: function() {
            let startDate = new Date(`${this.startDate} ${this.startTime}`);
            let endDate = new Date(`${this.endDate} ${this.endTime}`);
            axios
                .post(`/api/${this.team}/activities`, {
                    activityName: this.name,
                    loc: this.location,
                    startTime: startDate,
                    endTime: endDate
                })
                .then(result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.showDialog("Success" );
                            this.$router.push({ name: "activities" });
                        } else {
                            this.showDialog("Sorry", result);
                        }
                    }
                })
                .catch(err => this.showDialog("Failed", err));
        },
        showDialog: function(header, text) {
            this.dialogHeader = header;
            this.dialogText = text;
            this.dialogVisible = true;
        },
        hideDialog: function() {
            this.dialogVisible = false;
        }
    }
};
</script>
