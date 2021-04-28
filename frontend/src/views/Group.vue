<template>
  <v-main>
    <v-container fluid>
     <h1>Groups</h1>
     <v-btn
      v-if="showAdminBoard"
			to="/groupadd"
			class="mr-4"
			dark
			color="primary"
		>
    Add Group
		</v-btn>
    <v-btn
      color="primary"
      @click.native="exportToPDF">
        Print <br/> Groups
    </v-btn>
    <v-divider> </v-divider>
    <div ref="document">
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
import html2pdf from 'html2pdf.js'

export default {
  name: 'Group-List',
  components: {
    GroupCard,
  },
    data() {
        return {
            groups: [],
        showAdminBoard() {
            if (this.currentUser && this.currentUser.roles) {
              return this.currentUser.roles.includes('ROLE_ADMIN');
            }
            return false;
          },
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
            },
        exportToPDF () {
          html2pdf(this.$refs.document, {
            margin: 1,
            filename: 'document.pdf',
            html2canvas: { dpi: 192, letterRendering: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
          })
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

