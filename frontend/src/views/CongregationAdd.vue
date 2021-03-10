<template>

  <div class="submit-form mt-3 mx-auto">
    <H1>Add Congregation </H1>
    <form @submit.prevent="saveCongregation">

    <v-text-field
    v-model="congregation.con_name"
    label="Congregation Name"
    ></v-text-field>

    <v-text-field
    v-model="congregation.con_addrs"
    label="Congregation Address"
    ></v-text-field>
      
       </form>
      <v-btn color="primary" class="offset-sm4 mt-3" @click="saveCongregation">Submit</v-btn>
      <v-btn color="primary" class="mt-3" @click="cancel">Cancel</v-btn>
     </div>
  
</template>

<script>
import CongregationServices from "../services/CongregationServices";

export default {
  data() {
    return {
      congregation: {},
      congregations: []
  
    };
  },
  methods: {
    saveCongregation() {
      console.log(this.congregation)
      CongregationServices.create(this.congregation)
        .then(() => {
          this.$router.push({ name: "congregationdisplay" });
          console.log(this.data)
        })
        .catch((e) => {
          console.log(e);
        });
    },
    cancel() {
      this.$router.push({ name: "congregationdisplay" });
    },
  },
};
</script>

<style>
.submit-form {
  max-width: 400px;
  margin: auto;
  font-size: 20px;
}
h1 {
  text-align: center;
}
</style>