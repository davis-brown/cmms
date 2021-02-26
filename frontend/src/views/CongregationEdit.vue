<template>
    <div>
        <v-text-field
        v-model="congregation.con_name"
        :rules="[(v) => !! v || 'Name is required']"
        label="Name"
        required
        ></v-text-field>

        <v-text-field
        v-model="congregation.con_addrs"
        :rules="[(v) => !!v || 'Address is required']"
        label="Address"
        required
        ></v-text-field>

        <v-btn @click="updateCongregation">
            Save
        </v-btn>
</div>
</template>

<script>
import CongregationServices from "../services/CongregationServices.js";

export default {
    data(){
        return{
            currentCongregation: null,
            message: ''
        };
    },
    methods: {
        getCongregation(con_ID){
            CongregationServices.get(con_ID)
            .then(response => {
            this.currentCongregation=response.data;
            console.log(response.data);

        })
        .catch(e=>{
            console.log(e);
        })
    },
    updateCongregation(){
        CongregationServices.update(this.currentCongregation.con_ID, this.currentCongregation)
        .then(response => {
            console.log(response.data);
            this.message='The congregation was updated successfully.';

        })
        .catch(e=>{
            console.log(e);
        });
    }
    }
}
</script>