<template>
<v-main>
<v-container>
    <h1>Congregation Information</h1>
     <v-btn
			to="/congregationadd"
			class="mr-4"
			dark
			color="primary"
		>
    Add Congregation
		</v-btn>
        <v-row
        align="center">
		<v-col
            v-for="congregation in congregations"
            :key="congregation.con_ID"
            cols="12"
            align="center"
          >

  <v-card
  class="mx-auto"
  max-width="544"
    
  >
  <v-spacer></v-spacer>
  <v-card-title primary-title class="justify-center">

    <h2>{{congregation.con_name}}</h2>
    </v-card-title>
<v-spacer></v-spacer>
  <v-card-subtitle>
    <h3>
    Congregation Address
       <v-divider></v-divider>
   {{congregation.con_addrs}} 
   </h3>
</v-card-subtitle>
    
      <v-card-actions>
      <v-btn
				@click="editCongregation(congregation)"
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
import CongregationServices from "../services/CongregationServices.js";

export default {
    data(){
        return {
            congregations: {}
        };
      },
        created() {
            CongregationServices.getAll()
               .then(response => {
                    this.congregations = response.data;
                    console.log(this.congregations);
                })
                .catch(error => {
                    this.message = error.response.data.message;
                });
            },
       methods: {
         editCongregation(congregation){
            this.$router.push({ name: 'congregationedit', params: { id: congregation.con_ID } });


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