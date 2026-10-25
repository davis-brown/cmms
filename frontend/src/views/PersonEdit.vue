<template>
  <div>
  <PageBand title="Edit member" />
  <div class="page-body page-body--narrow">
  <div v-if="currentPerson" class="form-page">
      <v-form ref="form">

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
      :true-value="1"
      :false-value="0"
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
        v-model="currentPerson.user_name"
        label="Login username"
        hint="Links this member to a login so they can edit their own family"
        persistent-hint
      ></v-text-field>

          <v-textarea
          v-model="currentPerson.notes"
          label="Notes"
        ></v-textarea>
     <v-select
         v-model="currentPerson.pub_permission"
         :items="status"
         label="Status"
        required
        ></v-select>
      <v-select
         v-model="currentPerson.church_pos"
         :items="position"
         label="Church Position"
        required
        ></v-select>

    <PersonContact
      v-bind:key="currentPerson.per_ID"
      v-bind:person="currentPerson"
		></PersonContact>
       <v-divider class="my-5"></v-divider>


<v-row justify="center">
      <v-col justify="left" col="1"> 
        <v-btn @click="deletePerson" color="error" variant="outlined">
          Delete
        </v-btn>
      </v-col>
      <v-col justify="right" col="2"> 
        <v-btn class= "float-right" @click="updatePerson" color="primary" variant="flat">
          Update
        </v-btn>
      </v-col>
    </v-row>
 
     </v-form>
    <v-alert v-if="message" type="error" density="compact">{{ message }}</v-alert>
  </div>

  <div v-else>
    <br />
    <p>Please click on a Person ...</p>
    
  </div>

  </div>
  </div>
</template>

<script>
import PageBand from "../components/PageBand.vue";
import PersonDataService from "../services/PersonDataService";
import PersonContact from "../components/ContactInfo";

export default {
  components: { PageBand, 
		PersonContact
	},
  data() {
    return {
      currentPerson: null,
      message: '',
      select: null,
      status: ["Active", "Inactive"],
      position: ['Prayer Leader', 'Choir Leader', 'Communion Helper', 'Youth Minister', 'VBS Staff', 'Minister']
    
     
  
     
    };
  },
  methods: {
    getPerson(per_ID) {
      PersonDataService.get(per_ID)
        .then(response => {
          const person = response.data;
          // The fields take YYYY-MM-DD; the API sends full timestamps
          for (const field of ['bday', 'bapt_date']) {
            if (typeof person[field] === 'string') person[field] = person[field].substr(0, 10);
          }
          this.currentPerson = person;
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
          // e.g. the login username is already linked to another member
          this.message = (e.response && e.response.data && e.response.data.message) || e.message;
        });
    },
    deletePerson() {
      if (!window.confirm(`Delete ${this.currentPerson.frst_name || ''} ${this.currentPerson.last_name || ''}? They are also removed from their families, groups and events.`)) {
        return;
      }
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

