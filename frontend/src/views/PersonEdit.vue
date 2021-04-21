<template>
  <div v-if="currentPerson" class="edit-form py-3">
      <v-form ref="form" lazy-validation>
      <v-checkbox
      v-model="currentPerson.pub_permission"
      label="Publish Permission"

    ></v-checkbox>
       <v-text-field
        v-model="currentPerson.fam_ID"
        :rules="[(v) => !!v || 'Family ID is required']"
        label="Family ID"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentPerson.frst_name"
        :rules="[(v) => !!v || 'First name is required']"
        label="First Name"
        required
      ></v-text-field>
       <v-text-field
        v-model="currentPerson.midl_name"
        label="Middle Name"
        required
      ></v-text-field>

        <v-text-field
        v-model="currentPerson.last_name"
        :rules="[(v) => !!v || 'Last Name is required']"
        label="Last Name"
        required
      ></v-text-field>
    
      <v-text-field
        v-model="currentPerson.bday"
        :rules="[(v) => !!v || 'Birthday is required']"
        label="Birthday (YYYY-MM-DD)"
        required
      ></v-text-field>
        <v-checkbox
      v-model="currentPerson.baptised"
      label="Baptised"
 
    ></v-checkbox>
        <v-text-field
        v-model="currentPerson.bapt_date"
        label="Baptism Date"
        required
      ></v-text-field>
       <v-text-field
        v-model="currentPerson.employer"
        label="Employer"
        required
      ></v-text-field>
      <v-text-field
        v-model="currentPerson.pub_permission"
        :rules="[(v) => !!v || 'Publish Permission is required']"
        label="Publishing Permission "
        required
      ></v-text-field>
     
          <v-textarea
          v-model="currentPerson.notes"
          solo
          label="Notes"
        ></v-textarea>

    <PersonContact
      v-bind:key="currentPerson.per_ID"
      v-bind:person="currentPerson"
		></PersonContact>
       <v-divider class="my-5"></v-divider>

      <v-row justify="center">
        <v-col justify="left" col="1"> 
          <v-btn color="dark" @click="deletePerson">
            Delete
          </v-btn>
        </v-col>
        <v-col justify="right" col="2"> 
          <v-btn class= "float-right" color="dark" @click="updatePerson">
            Update
          </v-btn>
        </v-col>
      </v-row>
    
        
     </v-form>
    <p>{{ message }}</p>
  </div>

  <div v-else>
    <br />
    <p>Please click on a Person ...</p>
    
  </div>

</template>

<script>
import PersonDataService from "../services/PersonDataService";
import PersonContact from "../components/ContactInfo";

export default {
  components: {
		PersonContact
	},
  data() {
    return {
      currentPerson: null,
     
    };
  },
  methods: {
    getPerson(per_ID) {
      PersonDataService.get(per_ID)
        .then(response => {
          this.currentPerson = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    cancel() {
      this.$router.push({ name: "personlist" });
    },
    updatePerson() {
      PersonDataService.update(this.currentPerson.per_ID, this.currentPerson)
        .then(response => {
          console.log(response.data);
          this.message = 'The Person was updated successfully!';
          this.$router.push({ name: 'personlist' });
        })
        .catch(e => {
          console.log(e);
        });
    },
    deletePerson() {
      PersonDataService.delete(this.currentPerson.per_ID)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "personlist" });
        })
        .catch(e => {
          console.log(e);
        });
    },
    

  },
  mounted() {
    this.message = '';
    this.getPerson(this.$route.params.id);
    
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
