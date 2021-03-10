<template>
  <div v-if="currentFamily" class="edit-form py-3">
      <v-form ref="form" lazy-validation>

      <v-text-field
        v-model="currentFamily.fam_name"
        :rules="[(v) => !!v || 'First name is required']"
        label="Family Name"
        required
      ></v-text-field>

      <v-select :items="familyPersons"
        label="Head of the Family"
        item-text ="person.frst_name"
        item-value= "per_ID" 
        v-model="currentFamily.per_ID" >
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

      <v-row justify="center">
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
        <v-col col="3">  
              <v-btn color="success" @click="addPersonForFamily()" center>
                Add
              </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-btn color="error" small class="mr-2" @click="deleteFamily">
        Delete
      </v-btn>
      <v-btn color="success" small @click="updateFamily">
        Update
      </v-btn>

     </v-form>
  </div>

  <div v-else>
    <br />
    <p>Please click on an Family...</p>
    
  </div>

</template>

<script>
import FamilyService from "../services/FamilyService";
import PersonDataService from "../services/PersonDataService";
import FamilyPersonService from "../services/FamilyPersonService";

export default {
  data() {
    return {
      currentFamily: null,
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
    getFamily(fam_ID) {
      FamilyService.get(fam_ID)
        .then(response => {
          this.currentFamily = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    updateFamily() {
      FamilyService.update(this.currentFamily.fam_ID, this.currentFamily)
        .then(response => {
          console.log(response.data);
          this.message = 'The family was updated successfully!';
          this.$router.push({ name: 'familieslist' });
        })
        .catch(e => {
          console.log(e);
        });
    },

    deleteFamily() {
      FamilyService.delete(this.currentFamily.fam_ID)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "familieslist" });
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    getPeopleForFamily(fam_ID)  {
      FamilyPersonService.getFamilyPersons(fam_ID)
        .then(response => {
            this.familyPersons = response.data;
            console.log(this.familyPersons);
        })
        .catch(error => {
            this.message = error.response.data.message;
        });
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
      FamilyPersonService.delete(familyperson.fp_ID)
        .then(() => {  
          this.familyPersons = this.familyPersons.filter(familyPerson => familyPerson.fp_ID!=familyperson.fp_ID);
        })
        .catch(error => {
            this.message = error.response.data.message;
        });
    },

    addPersonForFamily() {
        let familyPerson = {};
        familyPerson.fam_ID = this.currentFamily.fam_ID;
        familyPerson.per_ID = this.familyPerson.per_ID;
        familyPerson.fam_role = this.familyPerson.fam_role;
        console.log(familyPerson)
        FamilyPersonService.create(familyPerson)
          .then(() => {
                this.getPeopleForFamily(this.$route.params.id);
                console.log(this.familyPersons);
          })
          .catch(error => {
              this.message = error.response.data.message;
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
    this.getFamily(this.$route.params.id);
    this.getPeopleForFamily(this.$route.params.id);
    this.getPeople();
  }
};
</script>

<style>
h4 {
  font-size: 25px;
  text-align: center;
}
.edit-form {
  max-width: 400px;
  margin: auto;
}
</style>