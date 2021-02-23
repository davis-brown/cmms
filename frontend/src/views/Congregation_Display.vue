<template>
<div>
    <v-text-field
    v-model="currentCongregation.congregation_id"
    label="Congregation ID"
    ></v-text-field>

    <v-text-field
    v-model="currentCongregation.name"
    label="Congregation Name"
    ></v-text-field>

    <v-text-field
    v-model="currentCongregation.address"
    label="Congregation Address"
    ></v-text-field>

    <v-text-field
    v-model="currentCongregation.phone"
    label="Congregation Phone"
    ></v-text-field>

    <v-btn @click="editCongregation">
        Edit
    </v-btn>
    </div>
</template>
<script>
import CongregationServices from "../services/CongregationServices";
export default{
    data(){
        return {
            currentCongregation: null,
            message: ''
        };
        },
        methods: {
            getCongregation(congregation_id){
                CongregationServices.get(congregation_id)
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
            this.getCongregation(this.$route.params.congregation_id);
        }

    };
    </script>