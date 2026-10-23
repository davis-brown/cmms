<template>
  <div>
    <PageBand title="Groups">
      <template v-if="showAdminBoard || showModeratorBoard">
        <v-btn to="/groupadd" color="primary" prepend-icon="mdi-plus">
          Add Group
        </v-btn>
        <v-btn variant="outlined" color="primary" prepend-icon="mdi-printer" @click="exportToPDF">
          Print Groups
        </v-btn>
      </template>
    </PageBand>
    <div class="page-body">
      <p v-if="groups.length === 0" class="text-medium-emphasis">No groups yet.</p>
      <v-row>
        <v-col
          v-for="group in groups"
          :key="group.grp_ID"
          cols="12"
          md="6"
        >
          <GroupCard v-bind:group="group"></GroupCard>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import GroupDataServices from "../services/GroupDataService";
import GroupCard from "../components/GroupCard";
import PageBand from "../components/PageBand.vue";
import GroupMemberService from "../services/GroupMemberService";
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
    PageBand,
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
                    this.message = (error.response && error.response.data.message) || error.message;
                });
            },
        // Each group with its members, listed the same way as on the cards
        exportToPDF () {
          Promise.all(this.groups.map(group => GroupMemberService.getGroupMembers(group.grp_ID)))
            .then(responses => {
              const content = this.groups.map((group, i) => {
                const members = responses[i].data
                  .filter(groupMember => groupMember.person)
                  .map(({ person }) => {
                    const name = [person.frst_name, person.last_name].filter(Boolean).join(" ");
                    return person.phone ? `${name} (${person.phone})` : name;
                  });
                return [
                  { text: group.grp_name, fontSize: 18, margin: [0, 12, 0, 4] },
                  { ul: members.length ? members : ["No members"] }
                ];
              });
              pdfMake.createPdf({ content }).download('groups.pdf');
            })
            .catch(error => {
              this.message = (error.response && error.response.data.message) || error.message;
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

