<template>
<div>
    <v-text-field
    v-model="currentCongregation.con_ID"
    label="Congregation ID"
    ></v-text-field>

    <v-text-field
    v-model="currentCongregation.con_name"
    label="Congregation Name"
    ></v-text-field>

    <v-text-field
    v-model="currentCongregation.con_address"
    label="Congregation Address"
    ></v-text-field>


    <v-btn @click="editCongregation">
        Edit
    </v-btn>
    </div>
</template>
<script>
import CongregationServices from "../services/CongregationServices.js";
export default{
    data(){
        return {
            currentCongregation: null,
            message: ''
        };
        },
        methods: {
            getCongregation(con_ID){
                CongregationServices.get(con_ID)
                .then(response => {
                    this.currentCongregation = response.data;
                    console.log(response.data);
                })
                .catch(e => {
                    console.log(e);
                });
            }
        },
        mounted(){
            this.getCongregation(this.$route.params.con_ID);
        }

    };
    </script>