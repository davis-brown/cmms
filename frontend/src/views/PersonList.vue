<template> 
<v-main>
<v-container>

     <h1>Members of the Congregation </h1>

    <v-btn to="/personadd" class="add-button" text-lg-right>
         <v-icon dark> mdi-plus </v-icon>
     </v-btn>

     <v-row>
         <v-col
         v-for="person in people"
         :key="person.per_ID"
         cols="10"

         >
                
  <v-card
    class="mx-auto"
    max-width="600"
    elevation="5"
    height="200"
    outlined
    shaped
    >
           
    <v-card-title>
      {{person.per_ID}}
      <br>
      <h3> <br> Name:</h3> 
      <br>{{person.frst_name}} {{person.last_name}}
      
      </v-card-title>
      <v-card-subtitle>
      <h3> Baptised: {{person.bapt_date}}</h3>
        {{person.employer}}
  <!--v-data-table
      :headers="headers"
      :items="person"
      :search="search"
      @click:row="editPerson(person)"
    ></v-data-table-->
       <v-card-actions>
				<v-btn
				@click="editPerson(person)"
				class="ma"
				outlined
        top
				medium
				fab
				color="blue darken"
				>
				<v-icon>mdi-pencil</v-icon>
				</v-btn>
       </v-card-actions>
        </v-card-subtitle>
         </v-card> 
         </v-col>
          </v-row>
      <!--v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
  <v-data-table
      :headers="headers"
      :items="people"
      hide-default-footer
      :items-per-page="30"
      mobile-breakpoint="0"
      @click:row="editPerson(person)"
  >
 
  </v-data-table-->

    </v-container>
</v-main>
</template>

<script>
import PersonDataService from "../services/PersonDataService";
  export default {
    name: 'personlist',
    props: ["id"],
  
   

  data() {
        return { 
         people: {},
         /**search: '',
            headers: [
              {
                    text: 'ID',
                    value: 'person.per_ID',
                    align: 'left',
                    sortable: true,
                    width: "1%"

              },
                {
                    text: 'First Name',
                    value: 'persons.frst_name' + 'person.last_name',
                    align: 'left',
                    sortable: true,
                    width: "1%"
                },
                {
                    text: 'Family',
                    value: 'person.fam_ID',
                    align: 'left',
                    sortable: false,
                    width: "1%"
                },
            ],
            message: 'Enter click on course to edit'
            */
        };
    },
    created() {
        PersonDataService.getAll()
            .then(response => {
                this.people = response.data;
                console.log(this.people);
            })
            .catch(error => {
                this.message = error.response.data.message;
            });
    },
    methods: {
          editPerson(person) {
            this.$router.push({ name: 'person-edit', params: { id: person.per_ID } });
      
        }
    }
  };
</script>

<style>
.add-button {
  margin-left:78%; 
  margin-right:0;
  margin-top: 2%;
}
</style>