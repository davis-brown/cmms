<template>
<v-main>
<v-container>
    <h1>Groups</h1>
     <v-btn
			to="/groupadd"
			class="mr-4"
			dark
			color="primary"
		>
    Add Group
		</v-btn>
        <v-row
        align="center">
		<v-col
            v-for="group in groups"
            :key="group.grp_ID"
            cols="12"
            align="center"
          >

  <v-card
  class="mx-auto"
  max-width="544"
    
  >

  <v-card-title primary-title class="justify-center">

    <h2>{{group.grp_name}}</h2>
    </v-card-title>
<v-spacer></v-spacer>
 
    
      <v-card-actions>
      <v-btn
				@click="editGroup(group)"
				class="ma-2"
				outlined
				large
				fab
				color="blue darken-4"
				>
				<v-icon>mdi-pencil</v-icon>
				</v-btn>
        <v-spacer></v-spacer>
        </v-card-actions>
   
      </v-card>

       </v-col>
       </v-row>
 </v-container>
    </v-main>
</template>

<script>
import GroupDataServices from "../services/GroupDataService.js";

export default {
    data(){
        return {
            groups: {}
        };
      },
        created() {
            GroupDataServices.getAll()
               .then(response => {
                    this.groupss = response.data;
                    console.log(this.groups);
                })
                .catch(error => {
                    this.message = error.response.data.message;
                });
            },
       methods: {
         editGroup(group){
            this.$router.push({ name: 'groupedit', params: { id: group.grp_ID } });


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