<template>
  <div class="submit-form mt-3 mx-auto">
    <h1>Add a family</h1>

    <form @submit.prevent="saveFamily">

      <v-text-field
        v-model="family.fam_name"
        label="Family Name"
        required
      ></v-text-field>

       <v-select :items="familyPersons"
        label="Head of the Family"
        item-text ="person.frst_name"
        item-value= "per_ID" 
        v-model="family.per_ID" >
        <template v-slot:selection="{ item } " >
          {{item.person.frst_name}} {{item.person.last_name}}
        </template>
      </v-select>

      <v-data-table
        :headers="headers"
        :items="familyPersons"
        hide-default-footer
        class="elevation - 1">
        <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="deletePersonForFamily(item)"
            >
              mdi-delete
            </v-icon>
        </template>
      </v-data-table>

      <v-row justify="center" align="center">
        <v-col justify="left" col="1"> 
            <v-autocomplete
                v-model="familyPerson.per_ID"
                :items="people"
                label="Family Member"
                item-value="per_ID"
                :filter="customFilter"
              >
                <template slot="selection" slot-scope="data" >
                  {{data.item.frst_name}} {{data.item.last_name}}
                </template>
                <template slot="item" slot-scope="data" >
                  {{data.item.frst_name}} {{data.item.last_name}}
                </template>
              </v-autocomplete>
        </v-col>
        <v-col justify="left" col="2"> 
            <v-text-field
              v-model="familyPerson.fam_role"
              label="Family Role"
              required
            ></v-text-field>
        </v-col>
        <v-col align="center" col="3">  
              <v-btn color="success" @click="addPersonForTable()"
                  >Add</v-btn
              >
        </v-col>
      </v-row>



    </form>
  <v-divider class="my-5"></v-divider>
    <v-row justify="center">
      <v-col justify="left" col="1"> 
        <v-btn color="error" @click="cancel">
          Cancel
        </v-btn>
      </v-col>
      <v-col justify="right" col="2"> 
        <v-btn class= "float-right" color="success" @click="saveFamily">
          Save
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import FamilyService from "../services/FamilyService";
import PersonDataService from "../services/PersonDataService";
import FamilyPersonService from "../services/FamilyPersonService";

export default {
  data() {
    return {
      family: {},
      familyPersons: [],
      people: [],
      familyPerson: {},
      message: '',
      headers: [
                {
                    text: 'First Name',
                    align: 'left',
                    value: 'person.frst_name',
                },
                {
                    text: 'Last Name',
                    align: 'left',
                    value: 'person.last_name',
                },
                {
                    text: 'Family Role',
                    align: 'left',
                    value: 'fam_role',
                },
                {
                    text: 'Action',
                    value: 'actions',
                    align: 'left',
                    sortable: false,
                }
            ],
    };
  },
  methods: {
    saveFamily() {
      console.log(this.family)
      FamilyService.create(this.family)
        .then(response => {
          console.log(response.data.fam_ID)
          this.familyPersons.forEach(familyPerson => {
            familyPerson.fam_ID = response.data.fam_ID;
            this.addPersonForFamily(familyPerson)
          })
          this.$router.push({ name: "familieslist" });
        })
        .catch((e) => {
          console.log(e);
        });
    },

    cancel() {
      this.$router.push({ name: "familieslist" });
    },

    getPeople() {
      PersonDataService.getAll()
        .then(response => {
            this.people = response.data;
            console.log(this.people);
        })
        .catch(error => {
            this.message = error.response.data.message;
        });
    },

    deletePersonForFamily(familyperson) {
      this.familyPersons = this.familyPersons.filter(familyPerson => familyPerson.fp_ID!=familyperson.fp_ID);
    },

    addPersonForFamily(familyPerson) {
        FamilyPersonService.create(familyPerson)
          .then(() => {
          })
          .catch(error => {
              this.message = error.response.data.message;
          });
    },

    addPersonForTable() {
      let familyPerson = {};
      familyPerson.per_ID = this.familyPerson.per_ID;
      familyPerson.fam_role = this.familyPerson.fam_role;

      PersonDataService.get(this.familyPerson.per_ID)
        .then(response => {
          familyPerson.person = response.data;
          console.log(familyPerson)
          this.familyPersons.push(familyPerson)
        })
        .catch(e => {
          console.log(e);
        });
      
    },
    customFilter (item, queryText) {
      const textOne = item.frst_name.toLowerCase()
      const textTwo = item.last_name.toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1
    }
  },
  mounted() {
    this.message = '';
    this.getPeople();
  }
};
</script>

<style>
.submit-form {
  max-width: 400px;
  margin: auto;
  font-size: 20px;
}


h1 {
  text-align: center;
}


</style>