<template>
  <div class="submit-form mt-3 mx-auto" data-app=“true>
    <h1>Add a family</h1>

    <v-form ref="form" @submit.prevent="saveFamily">
      
      <v-file-input
      v-model="selectedFile"
      accept="image/png, image/jpeg, image/gif, image/webp"
      prepend-icon="mdi-camera"
      label="Family Photo"
    ></v-file-input>

      <v-text-field
        v-model="family.fam_name"
        :rules="[(v) => !!v || 'Family name is required']"
        label="Family Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="family.fam_email"
        :rules="emailRules"
        label="Family Email"
        required
      ></v-text-field>

      <v-text-field
        v-model="family.fam_phone"
        :rules="phoneRules"
        label="Family Phone"
        required
      ></v-text-field>

      <v-text-field
        v-model="family.fam_address"
        :rules="addressRules"
        label="Family Address"
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
                            <v-select
                              v-model="familyPerson.fam_role"
                              :items="familyRoles"
                              label="Family Role"
                              required
                            ></v-select>
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
          <template v-slot:item.head="{ item }">
            <v-radio-group
              v-model="family.per_ID"
              name="rowSelector">
              <div class="d-flex justify-center"><v-radio :value="item.person.per_ID"/></div>
            </v-radio-group>
          </template>
          <template v-slot:item.actions="{ item }">
              <v-icon
                @click="deletePersonForFamily(item)"
              
              >
                mdi-delete
              </v-icon>
          </template>
        </v-data-table>
      </v-card>

    </v-form>

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
      selectedFile: null,
      dialog: false,
      family: {},
      familyPersons: [],
      familyRoles: ["Primary", "Spouse", "Child"],
      people: [],
      familyPerson: {},
      message: '',
      emailRules: [
          v => !!v || 'E-mail is required',
          v => /^\S{1,}@\S{2,}\.\S{2,}$/.test(v) || 'E-mail must be valid',
      ],
      // Any usual format (555-0101, (405) 555-0101, +1 405.555.0101) with 7 to 15 digits
      phoneRules: [
          v => !!v || 'Phone number is required.',
          v => (/^[0-9+().\s-]+$/.test(v || '') && /^\d{7,15}$/.test((v || '').replace(/\D/g, ''))) || 'Enter a valid phone number',
      ],
      addressRules: [
                v => !!v || 'Address is required.'
      ],
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
      if (!this.$refs.form.validate()) {
        return;
      }
      // The photo is optional; only upload when one was picked
      let upload = Promise.resolve();
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        upload = FamilyService.upload(formData).then(res => {
          this.family.fam_pic = res.data.path;
        });
      }

      upload
        .then(() => FamilyService.create(this.family))
        .then(response => {
          // Wait for the members to be saved so the list page shows them
          return Promise.all(this.familyPersons.map(familyPerson => {
            familyPerson.fam_ID = response.data.fam_ID;
            return this.addPersonForFamily(familyPerson);
          }));
        })
        .then(() => {
          this.$router.push({ name: "familieslist" });
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
            this.message = (error.response && error.response.data.message) || error.message;
        });
    },

    deletePersonForFamily(familyperson) {
      // Rows here aren't saved yet, so they have no fp_ID to compare
      this.familyPersons = this.familyPersons.filter(familyPerson => familyPerson !== familyperson);
    },

    addNewMember() {
        this.$router.push({ name: 'personadd' });
    },

    addPersonForFamily(familyPerson) {
        return FamilyPersonService.create(familyPerson)
          .then(() => {
          })
          .catch(error => {
              this.message = (error.response && error.response.data.message) || error.message;
          });
    },

    addPersonForTable() {
      this.dialog = false;
      if (!this.familyPerson.per_ID) {
        return;
      }
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
      const textOne = (item.frst_name || '').toLowerCase()
      const textTwo = (item.last_name || '').toLowerCase()
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