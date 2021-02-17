<template>
<v-form v-model="valid">
    <H1>Add a member</H1>
     <v-container>
      <v-flex sm12 offset-sm4 align-center justify-center>
      <v-row>
        <v-col
          cols="19"
          md="6"
        >
      <v-text-field
        v-model="person.per_ID"
        label="Person ID"
        required
      ></v-text-field>
      <v-text-field
        v-model="person.fam_ID"
        label="Fam ID"
        required
      ></v-text-field>
      <v-text-field
        v-model="person.frst_name"
        label="First Name"
        required
      ></v-text-field>
      <v-text-field
        v-model="person.midl_name"
        label="Middle Name"
        required
      ></v-text-field>
      <v-text-field
        v-model="person.last_name"
        label="Last Name"
        required
      ></v-text-field>
      <v-text-field
        v-model="person.user_name"
        label="User Name"
        required
      ></v-text-field>
       <v-text-field
        v-model="person.role_value"
        label="Role Value"
        required
      ></v-text-field>
      <v-text-field
        v-model="person.password"
        label="Password"
        required
      ></v-text-field>
      <v-text-field
        v-model="person.bday"
        label="Birthday YYYY-MM-DD"
        required
      ></v-text-field>
      <v-text-field
        v-model="person.baptised"
        label="Baptised"
        required
      ></v-text-field>
      <v-text-field
        v-model="person.bapt_date"
        label="Baptism Date YYYY-MM-DD"
        required
      ></v-text-field>
      <v-text-field 
        v-model="person.employer" 
        label="Employer Name" 
        required></v-text-field>
      <v-text-field
        v-model="person.pub_permission"
        label="Publish Permission"
        required
      ></v-text-field>
      <v-text-field
        v-model="person.church_pos"
        label="Position in Church"
        required
      ></v-text-field>
       <v-text-field
        v-model="person.fam_pos"
        label="Position in Family"
        required
      ></v-text-field>
      <v-btn color="primary" class="offset-sm4 mt-3" @click="savePerson">Submit</v-btn>
      <v-btn color="primary" class="mt-3" @click="cancel">Cancel</v-btn>
      </v-col>
      </v-row>
      </v-flex> 
      </v-container>
     </v-form> 
</template>

<script>
import PersonDataService from "../services/PersonDataService";

export default {
  data() {
    return {
      person: {}
  
    };
  },
  methods: {
    savePerson() {
      console.log(this.person)
      PersonDataService.create(this.person)
        .then(() => {
          this.$router.push({ name: "personlist" });
          console.log(this.data)
        })
        .catch((e) => {
          console.log(e);
        });
    },
    cancel() {
      this.$router.push({ name: "personlist" });
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