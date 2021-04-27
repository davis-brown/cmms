<template>
  <v-main>
    <v-container fluid>
     <h1>Groups</h1>
      <div v-if="showAdminBoard || showModeratorBoard">
     <v-btn
      
			to="/groupadd"
			class="mr-4"
			dark
			color="primary"
      
		>
    Add Group
		</v-btn>
      <v-btn
        absolute
        color="white"
        class="black--text"
        raised
        medium
        @click="download()" 
        v-if="showAdminBoard || showModeratorBoard"
        >
         PDF Download
        </v-btn>
    </div>
        <v-divider> </v-divider>
        <div id="pdf">
    <v-row>
    <v-col
      v-for="group in groups"
      :key="group.grp_ID"
      cols="6"
      align="center"
    >
    <GroupCard 
					v-bind:key="group.grp_ID"
					v-bind:group="group"
				></GroupCard>

  </v-col>
    </v-row>
    </div>
 </v-container>
</v-main>
</template>

<script>
import GroupDataServices from "../services/GroupDataService";
import GroupCard from "../components/GroupCard";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
  components: {
    GroupCard,
  },
    data() {
        return {
            groups: [],
     
        };
      },
      methods: {
        getAll() {
            GroupDataServices.getAll()
               .then(response => {
                    this.groups = response.data;
                    console.log(this.groups);
                })
                .catch(error => {
                    this.message = error.response.data.message;
                });
            }
      },
        
       mounted() {
         this.getAll();
        
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

