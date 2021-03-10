<template>
      <div v-if="currentCongregation" class="edit-form py-3">
      <v-form ref="form" lazy-validation>
     
        <v-text-field
        v-model="currentCongregation.con_name"
        :rules="[(v) => !! v || 'Name is required']"
        label="Name"
        required
        ></v-text-field>

        <v-text-field
        v-model="currentCongregation.con_addrs"
        :rules="[(v) => !!v || 'Address is required']"
        label="Address"
        required
        ></v-text-field>


    <v-btn color="success" small @click="updateCongregation">
        Submit
      </v-btn>

    <v-btn color="primary" small @click="cancel">
        Cancel
      </v-btn>
    
  </v-form>
  </div>
</template>

<script>
import CongregationServices from "../services/CongregationServices.js";

export default {
    data(){
        return{
            currentCongregation: null
        };
    },
    methods: {
        getCongregation(con_ID){
            CongregationServices.get(con_ID)
            .then(response => {
            this.currentCongregation = response.data;
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
        },
     cancel() {
      this.$router.push({ name: "congregationdisplay" });
        },

    mounted() {
    this.message = '';
    this.getCongregation(this.$route.params.id);
    
  }
    }
};
</script>
<style>
h4 {
  font-size: 25px;
  text-align: center;
}
.edit-form {
  max-width: 400px;
  margin: auto;
}
</style>