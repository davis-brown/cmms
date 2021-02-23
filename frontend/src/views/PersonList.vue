<template>     
<div>
  <h3>First Name: {{frst_name}} Last Name: {{lst_name}}</h3>
    <v-btn
          to="/personadd"
          class="add-button"
          text-lg-right
        >
  <v-data-table
      :headers="headers"
      :items="person"
      hide-default-footer
      :items-per-page="30"
      mobile-breakpoint="0"
      @click:row="selectRow"
  >
  </v-data-table>
  </div>
      
</template>

<script>
import PersonDataService from "../services/PersonDataService";
  export default {

  data() {
        return { 
            person :[],
            headers: [
                {
                    text: 'First Name',
                    value: 'person.frst_name' + 'person.lst_name',
                    align: 'left',
                    sortable: true,
                    width: "1%"
                },
                {
                    text: 'Family',
                    value: 'person.fam_ID',
                    align: 'left',
                    sortable: false,
                    width: "1%"
                },
            ],
            message: 'Enter click on course to edit'
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
    methods: {
        selectRow(event) {
            let id = event.id;
            this.$router.push({ name: 'personedit', params: { id: id } });
        }
    }
  };
</script>

<style>
.add-button {
  margin-left:71%; 
  margin-right:0;
}
</style>