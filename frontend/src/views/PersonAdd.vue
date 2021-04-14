<template>
<!--<v-form v-model="valid">
   <v-container>
      <v-flex sm12 offset-sm4 align-center justify-center>
      <v-row>
        <v-col
          cols="19"
          md="6"
        >
  -->
  <div class="submit-form mx-5 mx-auto">
    <H1>Add a member</H1>
    <form @submit.prevent="savePerson">
       <v-checkbox
      v-model="person.pub_permission"
      label="Publish Permission"
      
    ></v-checkbox>
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
        v-model="person.bday"
        label="Birthday YYYY-MM-DD"
        required
      ></v-text-field>
       <v-checkbox
      v-model="person.baptised"
      label="Baptised"

    ></v-checkbox>
    
      <v-text-field
        v-model="person.bapt_date"
        label="Baptism Date YYYY-MM-DD"
        required
      ></v-text-field>
      <v-text-field 
        v-model="person.employer" 
        label="Employer Name" 
        required></v-text-field>
       <v-textarea
          v-model="person.notes"
          solo
          label="Notes"
        ></v-textarea>
       </form>
       <PersonContact
        v-bind:personContacts="personContacts"
      ></PersonContact>

      <v-btn color="dark" class="offset-sm4 mt-3" @click="savePerson">Submit</v-btn>
      <v-btn color="dark" class="mt-3" @click="cancel">Cancel</v-btn>
     </div>
  
</template>

<script>
import PersonDataService from "../services/PersonDataService";
import CommunicationService from "../services/CommunicationService";
import PersonContactService from "../services/PersonContactService";
import PersonContact from "../components/AddContactInfo";

export default {
  components: {
		PersonContact
	},
  data() {
    return {
      person: {},
      people: {},
      prevRoute: "",
      personContacts: []
    };
  },
  methods: {
    savePerson() {
      console.log(this.$route.params)
      PersonDataService.create(this.person)
        .then(() => {
          console.log(this.prevRoute)
          this.$router.push({ name: this.prevRoute.name, params: { per_ID: this.person.per_ID, id: this.$route.params.fam_ID } });
          console.log(this.data)
        .then((response) => {
          this.personContacts.forEach(personContact => {
            personContact.per_ID = response.data.per_ID;
            this.savePersonContact(personContact)
          })
          this.$router.push({ name: this.prevRoute.name, params: { per_ID: response.data.per_ID, id: this.$route.params.fam_ID } });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    savePersonContact(contact) {
      CommunicationService.create(contact)
      .then(response => {
          let personContact = {com_ID : response.data.com_ID, per_ID : contact.per_ID};
          PersonContactService.create(personContact)
          .then(response => {
              console.log(response.data);
          })
          .catch(e => {
              console.log(e);
          });
          console.log(response.data);
      })
      .catch(e => {
          console.log(e);
      });
    },
    cancel() {
      this.$router.go(-1);
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from
    })
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