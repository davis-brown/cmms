<template> 
<v-main>
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
      :items="event"
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
</v-main>
</template>

<script>
import LifeEventService from "../services/LifeEventService";
  export default {
  data() {
        return { 
        search: '',
         event: [],
         singleExpand: false,
         expanded: [],
            headers: [
              {
                    text: 'ID',
                    value: 'event_ID',
                    align: 'start',
                    width: "5%"
              },
                {
                    text: 'Date',
                    value: 'date',
                    align: 'left',
                    sortable: true,
                    width: "5%"
                },
                  {
                    text: 'Details',
                    value: 'notes',
                    align: 'left',
                    sortable: true,
                    width: "5%"
                },
               
                 {
                    text: 'Edit',
                    value: 'data-table-expand',
                    align: 'right',
                    width: "1%"
                },
            ],
            message: 'Enter click on Life Event to edit'
           
        };
    },
    created() {
        LifeEventService.getAll()
            .then(response => {
                this.event = response.data;
                console.log(this.event);
            })
            .catch(error => {
                this.message = error.response.data.message;
            });
    },
    methods: {
          editLifeEvent(event) {
            this.$router.push({ name: 'lifeeventedit', params: { id: event.event_ID } });
      
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