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
    <v-row>
    <v-col
      v-for="group in groups"
      :key="group.grp_ID"
      cols="6"
      align="center"
    >
  <v-hover>
    <template 
    v-slot:default="{ hover }"
    >
      <v-card
        class="mx-auto"
        max-width="544"
      >
        <v-card-title>
            {{ group.grp_name }}
        </v-card-title>


				<v-card-subtitle>
				Members of the group: 
				</v-card-subtitle>

        <!-- INSERT MEMBERS HERE -->
        <v-fade-transition>
          <v-overlay
            v-if="hover"
            absolute
            color="#036358"
          >
           <v-card-actions>
      <v-btn
				@click="editGroup(group)"
				class="ma-2"
				outlined
				large
				fab
				color="black dark"
				>
        Edit
				</v-btn>
          <v-spacer></v-spacer>
          </v-card-actions>
          </v-overlay>
        </v-fade-transition>

 </v-card>
 </template>
  </v-hover>
  </v-col>
    </v-row>
 </v-container>
</v-main>
</template>

<script>
import GroupDataServices from "../services/GroupDataService";

export default {
    data() {
        return {
            groups: []
        };
      },
        created() {
            GroupDataServices.getAll()
               .then(response => {
                    this.groups = response.data;
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

