<template> 
<v-main>
<v-container>

     <h1>Members of the Congregation </h1>
	<v-btn
			to="/personadd"
			class="mr-4"
			dark
			color="primary"
		>
    New Member
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
      item-key="per_ID"
      show-expand
      class="elevation-1"
      :search="search"
    
    >
<template v-slot:expanded-item="{ item }">
      <td :colspan="headers.length">
        <v-card-actions>
				<v-btn
				@click="editPerson(item)"
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
</v-main>
</template>

<script>
import PersonDataService from "../services/PersonDataService";
  export default {

  data() {
        return { 
        search: '',
         person: [],
         singleExpand: false,
         expanded: [],
            headers: [
              {
                    text: 'ID',
                    value: 'per_ID',
                    align: 'start',
                    width: "2%"
              },
                {
                    text: 'Member',
                    value: 'frst_name',
                    align: 'left',
                    sortable: true,
                    width: "3%"
                },
                  {
                    value: 'last_name',
                    align: 'left',
                    sortable: true,
                    width: "3%"
                },
                  {
                    text: 'Birthday',
                    value: 'bday',
                    align: 'left',
                    sortable: true,
                    width: "7%"
                },
                  {
                    text: 'Baptism ',
                    value: 'baptised',
                    align: 'left',
                    sortable: true,
                    width: "1%"
                },
                  {
                    
                    value: 'bapt_date',
                    align: 'left',
                    sortable: true,
                    width: "7%"
                },
                {
                    text: 'Employer',
                    value: 'employer',
                    align: 'left',
                    sortable: true,
                    width: "4%"
                },
                 {
                    text: 'Publish Permission',
                    value: 'pub_permission',
                    align: 'left',
                    sortable: true,
                    width: "1%"
                },
               
                 {
                    text: 'Edit',
                    value: 'data-table-expand',
                    align: 'right',
                    width: "1%"
                },
              
            ],
            message: 'Enter click on Member to edit'
           
        };
    },
    created() {
        PersonDataService.getAll()
            .then(response => {
                this.person = response.data;
                console.log(this.person);
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