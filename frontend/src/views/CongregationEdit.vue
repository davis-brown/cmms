<template>
    <div>
        <v-text-field
        v-model="congregation.name"
        :rules="[(v) => !! v || 'Name is required']"
        label="Name"
        required
        ></v-text-field>

        <v-text-field
        v-model="congregation.address"
        :rules="[(v) => !!v || 'Address is required']"
        label="Address"
        required
        ></v-text-field>

        <v-text-field
        v-model="congregation.phone"
        :rules="[(v) => !!v || 'Phone is required']"
        label="Phone"
        required
        ></v-text-field>
        <v-btn @click="updateCongregation">
            Save
        </v-btn>
</div>
</template>

<script>
import CongregationServices from "../serices/CongregationServices.js";

export default {
    data(){
        return{
            currentCongregation: null,
            message: ''
        };
    },
    methods: {
        getCongregation(congregation_id){
            CongregationServices.get(congregation_id)
            .then(response => {
            this.currentCongregation=response.data;
            console.log(response.data);

        })
        .catch(e=>{
            console.log(e);
        })
    },
    updateCongregation(){
        CongregationServices.update(this.currentCongregation.congregation_id, this.currentCongregation)
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