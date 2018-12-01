<template>
    <div>
        <h4 class="display-1">Reset Password</h4>

        <instructions details="Reset the password on your account." />

        <v-form v-model="valid">
            <v-text-field
                v-model="email"
                v-bind:rules="rules.email"
                error-count="10"
                type="email"
                label="Your email address"
            >
            </v-text-field>
            <v-text-field
                v-model="oldPassword"
                v-bind:rules="rules.password"
                error-count="10"
                type="password"
                label="Current password"
                required
            >
            </v-text-field>
            <v-text-field
                v-model="newPassword"
                v-bind:rules="rules.password"
                error-count="10"
                type="password"
                label="New password"
                required
            >
            </v-text-field>
            <v-text-field
                v-model="repPassword"
                v-bind:rules="rules.password"
                error-count="10"
                type="password"
                label="Repeat new password"
                required
            >
            </v-text-field>
            <v-btn v-bind:disabled="!valid || repPassword != newPassword" v-on:click="handleSubmit"
                >Sign Up
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
import Instructions from "../components/Instructions.vue";
import axios from "axios";

export default {
    name: "ResetPasswordPage",
    components: {
        Instructions
    },
    data: function() {
        return {
            valid: false,
            email: "",
            oldPassword: "",
            newPassword: "",
            repPassword: "",

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
                .patch(`/api/accounts/`, {
                    email: this.email,
                    oldPassword: this.oldPassword,
                    newPassword: this.newPassword
                })
                .then(result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.showDialog("Success", result.data.msge);
                        } else {
                            this.showDialog("Sorry", result.data.msge);
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
            if(this.dialogHeader == "Success") {
                this.$router.push({ name: "home-page" });
            }
        }
    }
};
</script>
