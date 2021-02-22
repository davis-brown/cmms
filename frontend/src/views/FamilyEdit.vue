<template>
  <div v-if="currentFamily" class="edit-form py-3">
      <v-form ref="form" lazy-validation>

      <v-text-field
        v-model="currentFamily.fam_name"
        :rules="[(v) => !!v || 'First name is required']"
        label="Family Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentFamily.per_ID"
        label="Family Head ID"
        required
      ></v-text-field>

      <v-divider class="my-5"></v-divider>

      <v-btn color="error" small class="mr-2" @click="deleteFamily">
        Delete
      </v-btn>
      <v-btn color="success" small @click="updateFamily">
        Update
      </v-btn>

     </v-form>
  </div>

  <div v-else>
    <br />
    <p>Please click on an Family...</p>
    
  </div>

</template>

<script>
import FamilyService from "../services/FamilyService";

export default {
  data() {
    return {
      currentFamily: null
    };
  },
  methods: {
    getFamily(fam_ID) {
      FamilyService.get(fam_ID)
        .then(response => {
          this.currentFamily = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    updateFamily() {
      FamilyService.update(this.currentFamily.fam_ID, this.currentFamily)
        .then(response => {
          console.log(response.data);
          this.message = 'The family was updated successfully!';
          this.$router.push({ name: 'familieslist' });
        })
        .catch(e => {
          console.log(e);
        });
    },

    deleteFamily() {
      FamilyService.delete(this.currentFamily.fam_ID)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "familieslist" });
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.message = '';
    this.getFamily(this.$route.params.id);
    
  }
};
</script>

<style>
h4 {
  font-size: 25px;
  text-align: center;
}
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>