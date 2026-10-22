<template>
<v-hover>
    <template 
    v-slot:default="{ isHovering, props }"
    >
      <v-card
        v-bind="props"
        class="mx-auto"
        max-width="544"
      >
         <v-card-title class="text-center">
          <h2>
       {{group.grp_name }}
   
        </h2>
        </v-card-title>
				<v-card-subtitle>
				Members of the group: 
        <v-divider> </v-divider>
         {{ groupNames }} 
				</v-card-subtitle>
          <v-overlay
            v-if="showAdminBoard || showModeratorBoard"
            :model-value="isHovering"
            class="d-flex transition-fast-in-fast-out bg-grey-darken-1 v-card--reveal text-h2 text-white"
            contained
            style="height: 65%;"
        
          >
          <v-card-actions>
            <div v-if="showAdminBoard || showModeratorBoard">
      <v-btn
    
				@click="editGroup(group)"
				class="ma-2"
				variant="outlined"
				size="large"
				icon
				color="white"
				>
        Edit
				</v-btn>
        </div>
          <v-spacer></v-spacer>
          </v-card-actions>
          </v-overlay>
    </v-card>
     </template>
       </v-hover>
</template>

<script>
import GroupMemberService from "../services/GroupMemberService";

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
  
                  
          // "First Last (phone)", leaving out whatever a member doesn't have
          this.groupNames = this.groupMembers
            .filter(groupMember => groupMember.person)
            .map(groupMember => {
              const person = groupMember.person;
              const name = [person.frst_name, person.last_name].filter(Boolean).join(" ");
              return person.phone ? `${name} (${person.phone})` : name;
            })
            .join(", ");
          
             console.log(this.groupNames);
        })
        .catch(error => {
            this.message = (error.response && error.response.data.message) || error.message;
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