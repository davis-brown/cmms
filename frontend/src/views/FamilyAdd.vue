<template>
  <div class="submit-form mt-3 mx-auto" data-app=“true>
    <h1>Add a family</h1>

    <form @submit.prevent="saveFamily">
      
      <v-file-input
      v-model="selectedFile"
      accept="image/png, image/jpeg, image/bmp"
      prepend-icon="mdi-camera"
      label="Family Photo"
    ></v-file-input>

      <v-text-field
        v-model="family.fam_name"
        label="Family Name"
        required
      ></v-text-field>

      <v-card>
        <v-data-table
          :headers="headers"
          :items="familyPersons"
          hide-default-footer
          >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Family Members</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    @click="addNewMember"
                  >
                    New Member
              </v-btn>
              <v-spacer></v-spacer>
              <v-dialog
                v-model="dialog"
                max-width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Add Member
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span>New Family Member</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
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
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="close"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="addPersonForTable()"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot: item.head="{ item }">
            <v-radio-group
              v-model="family.per_ID"
              name="rowSelector">
              <div class="d-flex justify-center"><v-radio :value="item.person.per_ID"/></div>
            </v-radio-group>
          </template>
          <template v-slot: item.actions="{ item }">
              <v-icon
                @click="deletePersonForFamily(item)"
              
              >
                mdi-delete
              </v-icon>
          </template>
        </v-data-table>
      </v-card>
    </form>

  <v-divider class="my-5"></v-divider>
    <v-row justify="center">
      <v-col justify="left" col="1"> 
        <v-btn color="dark" @click="cancel">
          Cancel
        </v-btn>
      </v-col>
      <v-col justify="right" col="2"> 
        <v-btn class= "float-right" color="dark" @click="saveFamily">
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
      selectedFile: [],
      dialog: false,
      family: {},
      familyPersons: [],
      people: [],
      familyPerson: {},
      message: '',
      headers: [
                {
                    text: 'Name',
                    align: 'left',
                    value: 'person.frst_name',
                    sortable: false,
                },
                {
                    text: '',
                    align: 'left',
                    value: 'person.last_name',
                    sortable: false,
                },
                {
                    text: 'Role',
                    align: 'left',
                    value: 'fam_role',
                    sortable: false,
                },
                {
                    text: 'Family Head',
                    align: 'center',
                    value: 'head',
                    sortable: false,
                },
                {
                    text: 'Action',
                    value: 'actions',
                    align: 'center',
                    sortable: false,
                }
            ],
    };
  },
  methods: {
    saveFamily() {
      const formData = new FormData();
      formData.append("file", this.selectedFile);
      FamilyService.upload(formData)
      .then(res => {
        this.family.fam_pic = res.data.path;
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
      })
      .catch(err => {
        console.log(err);
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

    addNewMember() {
        this.$router.push({ name: 'personadd' });
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
      this.dialog = false;
      let familyPerson = {};
      familyPerson.per_ID = this.familyPerson.per_ID;
      familyPerson.fam_role = this.familyPerson.fam_role;

      PersonDataService.get(this.familyPerson.per_ID)
        .then(response => {
          familyPerson.person = response.data;
          console.log(familyPerson)
          this.familyPersons.push(familyPerson)
          this.familyPerson = {};
        })
        .catch(e => {
          console.log(e);
        });
      
    },
    close () {
        this.dialog = false
    },
    customFilter (item, queryText) {
      const textOne = item.frst_name.toLowerCase()
      const textTwo = item.last_name.toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1
    },

  },
  mounted() {
    this.message = '';
    this.getPeople();
  }
};
</script>

<style>
.submit-form {
  max-width: 500px;
  margin: auto;
  font-size: 20px;
}


h1 {
  text-align: center;
}
</style>