<template>
<v-main>
<v-container fluid>
<h1>Members of the Congregation </h1>
<v-row align="end">
			<v-col lg="2" align="center">
	<v-btn
      
			to="/personadd"
			class="mr-4"
			dark
			color="primary"
      v-if="showAdminBoard || showModeratorBoard"
		>
    Add Member
		</v-btn>
    </v-col>
    <v-col>
     <v-text-field
					v-model="search"
					label="Search Members"
					@input="filterMembers"
				></v-text-field>
        </v-col>
  <v-col lg="2" align="center">
      <v-btn
  
        color="primary"
        class="white--text"
        raised
        medium
        @click="download()" 
        v-if="showAdminBoard || showModeratorBoard"
        >
          CSV Download
        </v-btn>
</v-col>
</v-row>
    <v-divider> </v-divider>
      
      
       <v-row justify="center">
    <v-col
      v-for="person in searchMembers" 
      :key="person.per_ID"
      cols="3"
      align="center"
    >
   <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="150"
      offset-x
    >
    <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="dark"
          dark
          v-bind="attrs"
          v-on="on"
          
        >
          {{person.frst_name}} {{person.last_name}}
        </v-btn>
        </template>

        <v-card height="50vh" width="80vh">
          <v-list>
          <v-list-item>
            <v-list-item-content>
                
              <v-list-item-title class="text-center"><h2>{{person.frst_name}} {{person.last_name}} </h2></v-list-item-title>
              <div class="text-center"><h6>Birthdate: {{ person.bday }}</h6>  
            </div>
            <div class="text-center"><h6>Employer: {{ person.employer }}</h6>  
            </div>
                    <h5 class="text-center">Contact Information: </h5>
                <v-divider> </v-divider>
                <v-row>
              <v-col>
              
               <v-list-item-icon>
          <v-icon color="indigo">
            mdi-phone
             <v-spacer> </v-spacer> 
          </v-icon>
           
                     <v-list-item class="text-center">
              <v-list-item-title class="text-center" style="border: 2px transparent">{{person.phone}}  <v-spacer> </v-spacer>  Mobile </v-list-item-title>
     
                     </v-list-item>
                                 </v-list-item-icon>
                 <v-list-item-icon>
          <v-icon color="indigo">
            mdi-email
              <v-spacer> </v-spacer> 
          </v-icon>
             
          <v-list-item class="text-center">
              <v-list-item-title class="text-center" style="border: 2px transparent">{{person.email}} 
                <v-spacer> </v-spacer>        
                Email</v-list-item-title>
      
    </v-list-item>
    </v-list-item-icon>
    <v-list-item-icon>
          <v-icon color="indigo">
            mdi-home
             <v-spacer> </v-spacer> 
          </v-icon>
           
                     <v-list-item class="text-center">
              <v-list-item-title class="text-center" style="border: 2px transparent;"> {{person.address}}  
                <v-spacer> </v-spacer>  
                Home </v-list-item-title>
     
                     </v-list-item>
                                 </v-list-item-icon>



             <v-divider style="width: 100%; margin-right: 50%;"> </v-divider> 
            <v-list-item-title class="text-center" style="border: 2px transparent; margin-left: 5%"> <h5> Member Information: </h5></v-list-item-title>
             <v-divider style="width: 100%; margin-right: 50%;"> </v-divider> 
              <div class="text-center" v-if="person.pub_permission == 'Active'" style="color: blue;"> <h6>Status: {{person.pub_permission}} </h6> </div>
            <div class="text-center" v-if="person.pub_permission == 'Inactive'" style="color: red;"> <h6>Status: {{person.pub_permission}} </h6> </div>
             <div class="text-center"> <h6> Ministry Position: {{person.church_pos}} </h6> </div>

            
            <div class="text-center" style="border: 2px transparent;" v-if="person.baptised == 1"> <h4><u>Baptised</u></h4> </div>
            <div class="text-center" v-if="person.baptised == 1"> <h6>Baptism Date: {{person.bapt_date}} </h6> </div>
           
              </v-col>
              </v-row>
            </v-list-item-content>
            <v-list-item-action>
                  <div v-if="showAdminBoard">
          <v-btn
       
          absolute
          color="white"
          class="black--text"
          fab
          @click="editPerson(person)"
          small
          right
          ripple
        >
        Edit
   
        </v-btn>
        </div>
              </v-list-item-action>
            

          </v-list-item>
              </v-list>

          <v-list-item>
             <!-- <v-list>
               <v-list-item-action>
          <v-btn
          absolute
          color="white"
          class="black--text"
          raised
          medium
          ripple
          to="/lifeevent"
        >
        Life Events
   
        </v-btn>
              </v-list-item-action>
              
            </v-list> -->
          </v-list-item>
          </v-card>
   </v-menu>
 </v-col>
    </v-row>
    <v-divider> </v-divider>
  
</v-container>
</v-main>

</template>

<script>
import PersonDataService from "../services/PersonDataService";
  export default {
      computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_ADMIN');
      }
      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_MODERATOR');
      }
      return false;
    }
  },
  data() {
        return { 
         persons: [],
         searchMembers: [],
         search: ""

         
        
        };
  },
    created() {
        PersonDataService.getAll()
            .then(response => {
                this.persons = response.data;
                this.searchMembers = response.data;
                console.log(this.persons);
            })
            .catch(error => {
                this.message = error.response.data.message;
            });
    },
      
    
    methods: {
          editPerson(person) {
            this.$router.push({ name: 'person-edit', params: { id: person.per_ID } });
    
        },
    
      filterMembers() {
			this.searchMembers = this.persons.filter((person) => {
				return person.frst_name.toLowerCase().includes(this.search.toLowerCase());
			});
		},
        download() {
          let text = JSON.stringify(this.persons);
          let filename = 'members.csv';
         
   
     
          var element = document.createElement('a');
           element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();
            document.body.removeChild(element); 
     
   }
     
        },
    
       /*findLifeEvents(person) {
         this.$router.push({ name: 'lifeeventadd', params: { id: person.per_ID } });
       }
*/
   

  
  };

</script>


<style>

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .5;
  position: absolute;
  width: 100%;
}
</style>

    <!--
    
       
 
    <v-card
      class="mx-auto"
      color="grey lighten-4"
      max-width="700px"

   >
   
            
        </v-card-title>
          </v-card>
  
      <v-card-text
        class="pt-6"
        style="position: relative;"
      >
       <v-card-text>
  
           <v-row>
             <v-col
             cols="12"
                sm="6"
                md="4"
             >
             <v-text-field>
             label="{{person.pub_permission}}{{person.baptised}} {{person.bapt_date}}"
              </v-text-field>
   
                  <v-col>
                      </v-row> 
                              </v-card-text>  
 


<<template> 
<v-main>
<v-container
fluid
>
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

-->