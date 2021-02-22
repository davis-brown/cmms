<template>
  <div class="submit-form mt-3 mx-auto">
    <H1>Add a family</H1>

    <form @submit.prevent="saveFamily">

      <v-text-field
        v-model="family.fam_name"
        label="Family Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="family.per_ID"
        label="Family Head ID"
        required
      ></v-text-field>

    </form>
  <v-divider class="my-5"></v-divider>
      <v-btn color="primary" class="mt-3" @click="saveFamily">Submit</v-btn>

      <v-btn color="primary" class="mt-3" @click="cancel">Cancel</v-btn>

  </div>
</template>

<script>
import FamilyService from "../services/FamilyService";

export default {
  data() {
    return {
      family: {},
      familymembers: {}
    };
  },
  methods: {
    saveFamily() {
      console.log(this.family)
      FamilyService.create(this.family)
        .then(() => {
          this.$router.push({ name: "familieslist" });
          console.log(this.data)
        })
        .catch((e) => {
          console.log(e);
        });
    },
    cancel() {
      this.$router.push({ name: "familieslist" });
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