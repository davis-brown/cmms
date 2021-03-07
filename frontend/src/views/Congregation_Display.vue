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
    v-model="currentCongregation.con_addrs"
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
            currentCongregation: {},
            message: ''
        };
        },
        methods: {
            getCongregation(con_ID){
                CongregationServices.get(con_ID)
                .then(response => {
                    this.currentCongregation = response.data;
                    console.log("congregation"+this.currentCongregation.con_ID+this.currentCongregation.con_name);
                })
                .catch(e => {
                    console.log(e);
                });
            },
            editCongregation(){

            }
        },

        mounted(){
            this.getCongregation(1);
        }

    };
    </script>