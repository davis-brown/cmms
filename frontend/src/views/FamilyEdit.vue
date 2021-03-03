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

      <v-data-table
        :headers="headers"
        :items="familyPersons"
        hide-default-footer
        class="elevation - 1">
        <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="deleteMajorForCourse(item)"
            >
              Delete
            </v-icon>
        </template>
      </v-data-table>
      <v-row justify="center">
        <v-col col="2">  
              <v-btn color="success" @click="addMajorForCourse()"
                  >Add</v-btn
              >
        </v-col>
        <v-col justify="left" col="2"> 
            <v-select :items="majors"
              label="Major"
              item-text ="major_name"
              item-value= "major_id" 
              v-model="major.major_id" />
        </v-col>
      </v-row>

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
import PersonDataService from "../services/PersonDataService";
import FamilypersonService from "../services/FamilypersonService";

export default {
  data() {
    return {
      currentFamily: null,
      headers
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