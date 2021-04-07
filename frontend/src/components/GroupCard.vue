<template>
<v-hover>
    <template 
    v-slot:default="{ hover }"
    >
      <v-card
        class="mx-auto"
        max-width="544"
      >
         <v-card-title class="justify-center">
          <h2>
       {{group.grp_name }}
        </h2>
        </v-card-title>
				<v-card-subtitle>
				Members of the group: 
        <v-divider> </v-divider>
         {{ groupNames }}
				</v-card-subtitle>
  



        <v-expand-transition>
          <v-overlay
            v-if="hover"
            class="d-flex transition-fast-in-fast-out grey darken-1 v-card--reveal display-3 white--text"
            absolute
            style="height: 65%;"
        
          >
          <v-card-actions>
      <v-btn
				@click="editGroup(group)"
				class="ma-2"
				outlined
				large
				fab
				color="white dark"
				>
        Edit
				</v-btn>
          <v-spacer></v-spacer>
          </v-card-actions>
          </v-overlay>
        </v-expand-transition>
    </v-card>
     </template>
       </v-hover>
</template>

<script>
import GroupMemberService from "../services/GroupMemberService";

export default {
	name: 'Group-List',
    props: ['group'],
    data() {
        return {
            groupMembers: [],
            groupNames: "",
            path: ""
            
        };
    },
    
	methods: {
 editGroup(group){
            this.$router.push({ name: 'groupedit', params: { id: group.grp_ID } });

 },
    getPeopleForGroup(grp_ID)  {
      GroupMemberService.getGroupMembers(grp_ID)
        .then(response => {
            this.groupMembers = response.data;
            this.groupMembers.forEach( groupMember => {this.groupNames += groupMember.person.frst_name + " " + groupMember.person.last_name +", "});
            console.log(this.groupMembers);
            this.groupNames = this.groupNames.slice(0, -2);
             console.log(this.groupNames);
        })
        .catch(error => {
            this.message = error.response.data.message;
        });
    },

    },
    mounted() {
        this.getPeopleForGroup(this.group.grp_ID)
    }
};
</script>

<style>

</style>