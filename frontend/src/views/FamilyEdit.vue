<template>
  <div>
  <PageBand title="Edit family" />
  <div class="page-body page-body--narrow">
  <div v-if="currentFamily" class="form-page">
      <v-form ref="form">

      <v-file-input
        v-model="selectedFile"
        accept="image/png, image/jpeg, image/gif, image/webp"
        prepend-icon="mdi-camera"
        label="Family Photo"
      ></v-file-input>

      <v-text-field
        v-model="currentFamily.fam_name"
        :rules="[(v) => !!v || 'Family name is required']"
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
        <v-data-table no-data-text="No members yet"
          :headers="headers"
          :items="familyPersons"
          hide-default-footer
          >
          <template v-slot:top>
            <v-toolbar
              flat
              color="white"
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
                    variant="elevated"
                    class="mb-2"
                    @click="addNewMember"
                    v-if="isModeratorOrAdmin"
                  >
                    New Member
              </v-btn>
              <v-spacer></v-spacer>
              <v-dialog
                v-model="dialog"
                max-width="500px"
                v-if="isModeratorOrAdmin"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                   
                   
                    class="mb-2"
                    v-bind="props"
                   color="primary" variant="flat">
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
                                :item-title="personName"
                              ></v-autocomplete>
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
                     
                     
                      @click="close"
                     variant="text">
                      Cancel
                    </v-btn>
                    <v-btn
                     
                     
                      @click="addPersonForFamily()"
                     color="primary" variant="flat">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.head`]="{ item }">
            <v-radio-group
              v-model="currentFamily.per_ID">
              <div class="d-flex justify-center"><v-radio :value="item.person.per_ID"/></div>
            </v-radio-group>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
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
          <v-btn @click="deleteFamily" v-if="isModeratorOrAdmin" color="error" variant="outlined">
            Delete
          </v-btn>
        </v-col>
        <v-col justify="right" col="2"> 
          <v-btn class= "float-right" @click="updateFamily" color="primary" variant="flat">
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

  </div>
  </div>
</template>

<script>
import PageBand from "../components/PageBand.vue";
import FamilyService from "../services/FamilyService";
import PersonDataService from "../services/PersonDataService";
import FamilyPersonService from "../services/FamilyPersonService";

export default {
  components: { PageBand },
  data() {
    return {
      selectedFile: null,
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
                    title: 'Name',
                    align: 'left',
                    value: 'person.frst_name',
                    sortable: false,
                },
                {
                    title: '',
                    align: 'left',
                    value: 'person.last_name',
                    sortable: false,
                },
                {
                    title: 'Role',
                    align: 'left',
                    value: 'fam_role',
                    sortable: false,
                },
                {
                    title: 'Family Head',
                    align: 'center',
                    value: 'head',
                    sortable: false,
                },
                {
                    title: 'Action',
                    align: 'center',
                    value: 'actions',
                    sortable: false,
                }
            ],
    }
  },
  
  computed: {
    // Family members can edit their family; only moderators and admins can
    // delete it, add people to it or create new member records
    isModeratorOrAdmin() {
      const user = this.$store.state.auth.user;
      return !!(user && user.roles) &&
        (user.roles.includes('ROLE_MODERATOR') || user.roles.includes('ROLE_ADMIN'));
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

    async updateFamily() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      // A new photo is saved straight onto the family, replacing the old one
      let upload = Promise.resolve();
      if (this.selectedFile)  {
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        formData.append("fam_ID", this.currentFamily.fam_ID);
        upload = FamilyService.upload(formData);
      }

      upload
        .then(() => FamilyService.update(this.currentFamily.fam_ID, this.currentFamily))
        .then(() => {
          this.$router.push({ name: 'familieslist' });
        })
        .catch(e => {
          console.log(e);
        });
    },

    deleteFamily() {
      if (!window.confirm(`Delete the ${this.currentFamily.fam_name || ''} family? Its members stay in the directory.`)) {
        return;
      }
      // The server also removes the family's member links
      FamilyService.delete(this.currentFamily.fam_ID)
        .then(() => {
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
            this.message = (error.response && error.response.data.message) || error.message;
        });
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
      FamilyPersonService.delete(familyperson.fp_ID)
        .then(() => {  
          this.familyPersons = this.familyPersons.filter(familyPerson => familyPerson.fp_ID!=familyperson.fp_ID);
        })
        .catch(error => {
            this.message = (error.response && error.response.data.message) || error.message;
        });
    },

    addNewMember() {
        this.$router.push({ name: 'personadd', query: { fam_ID: this.currentFamily.fam_ID } });
    },

    addPersonForFamily() {
        this.dialog = false
        if (!this.familyPerson.per_ID) {
          return;
        }
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
              this.message = (error.response && error.response.data.message) || error.message;
          });
        
           
    },
    close () {
        this.dialog = false
      },
    personName(person) {
      return [person.frst_name, person.last_name].filter(Boolean).join(" ");
    },
  },
  mounted() {
    this.message = '';
    this.getFamily(this.$route.params.id);
    this.getPeopleForFamily(this.$route.params.id);
    this.getPeople();
    if(this.$route.query.per_ID)  {
      this.dialog = true;
      this.familyPerson.per_ID = Number(this.$route.query.per_ID);
    }
  }
};
</script>

