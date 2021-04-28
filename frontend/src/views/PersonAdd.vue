<template>
  <div class="submit-form mx-5 mx-auto">
    <h1>Add a member</h1>
    <form @submit.prevent="savePerson">
      

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
        <v-select
         v-model="currentPerson.pub_permission"
         :items="status"
         label="Status"
        required
        ></v-select>
       </form>
       <PersonContact
        v-bind:personContacts="personContacts"
        v-bind:person="person"
      ></PersonContact>
       </form>
      <v-divider class="my-5"></v-divider>
    <v-row justify="center">
      <v-col justify="left" col="1"> 
        <v-btn color="dark" @click="cancel">
          Cancel
        </v-btn>
      </v-col>
      <v-col justify="right" col="2"> 
        <v-btn class= "float-right" color="dark" @click="savePerson">
          Submit
        </v-btn>
      </v-col>
    </v-row>
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
      personContacts: [],
      status: ["Active", "Inactive"]
 
    };
  },
  methods: {
    savePerson() {
      console.log(this.$route.params)
      PersonDataService.create(this.person)
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
  max-width: 600px;
  margin: auto;
  font-size: 20px;
}
h1 {
  text-align: center;
}
</style>