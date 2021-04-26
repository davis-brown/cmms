<template>
  <div v-if="currentFamily" class="submit-form mt-3 mx-auto" data-app=“true”>
      <v-form ref="form" lazy-validation>

      <v-file-input
        v-model="selectedFile"
        accept="image/png, image/jpeg, image/bmp"
        prepend-icon="mdi-camera"
        label="Family Photo"
      ></v-file-input>

      <v-text-field
        v-model="currentFamily.fam_name"
        :rules="[(v) => !!v || 'First name is required']"
        label="Family Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentFamily.fam_email"
        :rules="emailRules"
        label="Family Email"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentFamily.fam_phone"
        :rules="phoneRules"
        label="Family Phone"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentFamily.fam_address"
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
                      @click="addPersonForFamily()"
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
              v-model="currentFamily.per_ID"
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

      

      <v-divider class="my-5"></v-divider>

      <v-row justify="center">
        <v-col justify="left" col="1"> 
          <v-btn color="dark" @click="deleteFamily">
            Delete
          </v-btn>
        </v-col>
        <v-col justify="right" col="2"> 
          <v-btn class= "float-right" color="dark" @click="updateFamily">
            Update
          </v-btn>
        </v-col>
      </v-row>
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
      selectedFile: [],
      dialog: false,
      currentFamily: null,
      familyPersons: [],
      familyRoles: ["Primary", "Spouse", "Child"],
      people: [],
      familyPerson: {},
      message: '',
      emailRules: [
          v => !!v || 'E-mail is required',
          v => /^\S{1,}@\S{2,}\.\S{2,}$/.test(v) || 'E-mail must be valid',
      ],
      phoneRules: [
          v => !!v || 'Phone number is required.',
          v => (v || '').length == 12 || 'Phone number must be 10 digits',
          v => /(\d{3})-?(\d{3})-?(\d{4})/.test(v) || 'Phone number must be format ###-###-####'
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
                    align: 'center',
                    value: 'actions',
                    sortable: false,
                }
            ],
    }
  },
  
  methods: {
    getFamily(fam_ID) {
      FamilyService.get(fam_ID)
        .then(response => {
          this.currentFamily = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    updateFamily() {
      if(this.selectedFile.length != 0)  {
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        formData.append("existingPic", this.currentFamily.fam_pic);
        FamilyService.upload(formData)
        .then(res => {
          this.currentFamily.fam_pic = res.data.path;
          FamilyService.update(this.currentFamily.fam_ID, this.currentFamily)
            .then(response => {
              console.log(response.data);
              this.message = 'The family was updated successfully!';
              this.$router.push({ name: 'familieslist' });
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(err => {
          console.log(err);
        });
      } else {
        FamilyService.update(this.currentFamily.fam_ID, this.currentFamily)
          .then(response => {
            console.log(response.data);
            this.message = 'The family was updated successfully!';
            this.$router.push({ name: 'familieslist' });
          })
          .catch(e => {
            console.log(e);
          });
      }
    },

    deleteFamily() {
      console.log(this.currentFamily.fam_pic);
      FamilyService.delete(this.currentFamily.fam_ID, this.currentFamily.fam_pic)
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
      FamilyPersonService.deleteAll(this.currentFamily.fam_ID)
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
      this.$router.push({ name: "familieslist" });
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

    addNewMember() {
        this.$router.push({ name: 'personadd', params: { fam_ID: this.currentFamily.fam_ID } });
    },

    addPersonForFamily() {
        this.dialog = false
        let familyPerson = {};
        familyPerson.fam_ID = this.currentFamily.fam_ID;
        familyPerson.per_ID = this.familyPerson.per_ID;
        familyPerson.fam_role = this.familyPerson.fam_role;
        console.log(familyPerson)
        FamilyPersonService.create(familyPerson)
          .then(() => {
                this.getPeopleForFamily(this.$route.params.id);
                console.log(this.familyPersons);
                this.familyPerson = {};
          })
          .catch(error => {
              this.message = error.response.data.message;
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
    }
  },
  mounted() {
    this.message = '';
    this.getFamily(this.$route.params.id);
    this.getPeopleForFamily(this.$route.params.id);
    this.getPeople();
    if(this.$route.params.per_ID)  {
      this.dialog = true;
      this.familyPerson.per_ID = this.$route.params.per_ID;
    }
  }
};
</script>

<style>
h4 {
  font-size: 25px;
  text-align: center;
}
.submit-form {
  max-width: 500px;
  margin: auto;
}
</style>