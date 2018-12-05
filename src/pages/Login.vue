<template>
    <div>
        <h4 class="display-1">Login</h4>

        <v-form v-model="valid">
            <v-text-field
                v-model="email"
                v-bind:rules="rules.email"
                error-count="10"
                type="email"
                label="Email Address"
            >
            </v-text-field>
            <v-text-field
                v-model="password"
                v-bind:rules="rules.password"
                error-count="10"
                type="password"
                label="Password"
                required
            >
            </v-text-field>
            <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit"
                >Login
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
    name: "LoginPage",
    data: function() {
        return {
            valid: false,
            email: "",
            password: "",

            dialogHeader: "<no dialogHeader>",
            dialogText: "<no dialogText>",
            dialogVisible: false,

            rules: {
                required: [
                    val => val.length > 0 || 'Required'
                ],
                email: [
                    val => /^\w+@\w+\.\w{2,}$/.test(val) || "Invalid e-mail"
                ],
                password: [
                    val => /[A-Z]/.test(val) || "Need upper case letter",
                    val => /[a-z]/.test(val) || "Need lower case letter",
                    val => /\d/.test(val) || "Need digit",
                    val => val.length >= 8 || "Minimum 8 characters"
                ]
            }
        };
    },
    methods: {
        handleSubmit: function() {
            axios
                .post(`/api/`, {
                    email: this.email,
                    password: this.password,
                })
                .then(result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.showDialog("Success" );
                            this.$root.currentUser = result.data.data.membersid;
                            //console.log(this.$root.currentUser);
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
