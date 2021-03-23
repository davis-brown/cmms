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
      cols="8"
      align="center"
    >
  <v-hover>
    <template 
    v-slot:default="{ hover }"
    >
      <v-card
        class="mx-auto"
        max-width="344"
      >
      
        <v-img src="https://cdn.vuetifyjs.com/images/cards/forest-art.jpg"></v-img>

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



<!--
<v-container
    fluid
    style="height: 300px"
  >
    <v-row justify="center">
      <v-menu
        bottom
        min-width="200px"
        rounded
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            x-large
            v-on="on"
          >
            <v-avatar
              color="brown"
              size="48"
            >
              <span class="white--text headline">{{ user.initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar
                color="brown"
              >
                <span class="white--text headline">{{ groupMember.per_ID.frst_name }}</span>
              </v-avatar>
              <h3>{{ user.fullName }}</h3>
              <p class="caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                depressed
                rounded
                text
              >
                Edit Account
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn
                depressed
                rounded
                text
              >
                Disconnect
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-row>
    https://vuetifyjs.com/en/components/avatars/#advanced-usage
    -->