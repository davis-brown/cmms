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
  <div class="submit-form mt-3 mx-auto">
    <H1>Add a member</H1>
    <form @submit.prevent="savePerson">
    
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
      <!--<v-text-field
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
        type="password"
        label="Password"
        required
      ></v-text-field> -->
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
      <!-- v-text-field
        v-model="person.church_pos"
        label="Position in Church"
        required
      ></v-text-field-->
       <!--<v-text-field
        v-model="person.fam_pos"
        label="Position in Family"
        required
      ></v-text-field> -->
       </form>
      <v-btn color="primary" class="offset-sm4 mt-3" @click="savePerson">Submit</v-btn>
      <v-btn color="primary" class="mt-3" @click="cancel">Cancel</v-btn>


      <v-container>

     <h1>List of Life Events </h1>
	<v-btn
			to="/lifeeventadd"
			class="mr-4"
			dark
			color="primary"
		>
    New Life Event
		</v-btn>
      <v-spacer>  </v-spacer> 
  
      <v-spacer>  </v-spacer> 
  <v-card
    class="mx-auto"
    max-width="1000"
    elevation="3"
    height="1000"
    outlined
    >
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
  
  <v-data-table
      :headers="headers"
      :items="person"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="event_ID"
      show-expand
      class="elevation-1"
      :search="search"
    
    >
<template v-slot:expanded-item="{ item }">
      <td :colspan="headers.length">
        <v-card-actions>
				<v-btn
				@click="editEvent(item)"
				class="ma"
				outlined
        top
				small
				fab
				color="blue darken"
				>
				<v-icon>mdi-pencil</v-icon>
				</v-btn>
       </v-card-actions>
      </td>
    </template>
    </v-data-table>
    </v-card> 
    </v-container>
     </div>
  
</template>

<script>
import PersonDataService from "../services/PersonDataService";

export default {
  data() {
    return {
      person: {},
      people: {},
      prevRoute: ""
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
        })
        .catch((e) => {
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