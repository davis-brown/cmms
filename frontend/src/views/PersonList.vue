<template>
<div class="list row">
    <div class="col-md-6">
      <h4>Member List 
        <v-btn
          to="/personadd"
          class="add-button"
          text-lg-right
        >
        <span class="mr-2">
        <v-icon>mdi-plus</v-icon>
        </span>
        </v-btn>
      </h4>

      
    </div>

    <div class="col-md-4">
      <div v-if="currentPerson">
        <h4>Person</h4>
        <div>
          <label><strong>ID: </strong></label> {{ currentPerson.per_ID }}
        </div>
        <div>
          <label><strong>Family ID: </strong></label> {{ currentPerson.fam_ID }}
        </div>
        <div>
          <label><strong>First Name: </strong></label> {{ currentPerson.frst_name }}
        </div>
        <div>
          <label><strong>Middle Name: </strong></label> {{ currentPerson.midl_name }}
        </div>
         <div>
          <label><strong>Last Name: </strong></label> {{ currentPerson.last_name }}
        </div>
        <div>
          <label><strong>Role Value: </strong></label> {{ currentPerson.role_value }}
        </div>
        <div>
          <label><strong>Password: </strong></label> {{ currentPerson.password }}
        </div>
        <div>
          <label><strong>Birthday: </strong></label> {{ currentPerson.bday }}
        </div>
        <div>
          <label><strong>Baptised: </strong></label> {{ currentPerson.baptised }}
        </div>
        <div>
          <label><strong>Baptism Date: </strong></label> {{ currentPerson.bapt_date }}
        </div>
        <div>
          <label><strong>Employer: </strong></label> {{ currentPerson.employer }}
        </div>
        <div>
          <label><strong>Publish Permission: </strong></label> {{ currentPerson.pub_permission }}
        </div>
        <div>
          <label><strong>Church Position: </strong></label> {{ currentPerson.church_pos }}
        </div>
        <div>
          <label><strong>Family Position: </strong></label> {{ currentPerson.fam_pos }}
        </div>
        
        <v-btn @click="editPerson">Edit Person</v-btn>
   
      </div>
      <div v-else>
        <br />
        <p>Please click on a Person.</p>
      </div>
    </div>
  </div>
</template>

<script>
import PersonDataService from "../services/PersonDataService";
export default {
  name: "person-list",
  data() {
    return {
      person: [],
      currentPerson: null,
      currentIndex: -1
    };
  },
  created() {
        PersonDataService.getAll()
        .then((response) => {
         
          this.person = response.data;
          console.log(this.person);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    methods: {

      editPerson(person) {
      this.$router.push({ 
        name: 'personedit', 
        params: { id: person.per_ID }, 
        })
    }

    }
  
  
};
</script>

<style>
.list {
  text-align: left;
  max-width: 1400px;
  margin: fixed;
}
.add-button {
  margin-left:71%; 
  margin-right:0;
}
</style>