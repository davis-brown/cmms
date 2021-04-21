<template>
  <div v-if="currentPerson" class="submit-form" data-app="true">
      <v-form ref="form" lazy-validation>
        
      <v-text-field
        v-model="currentPerson.per_name"
        :rules="[(v) => !!v || 'Group name is required']"
        label="Group's Name"
        required
      ></v-text-field>
      
      <v-card>
        <v-data-table
          :headers="headers"
          :items="groupMembers"
          hide-default-footer
          >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Group Members</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog
                v-model="dialog"
                max-width="700px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Edit/Add Life Event
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span>New Life Event</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row justify="center" align="center">
                        <v-col justify="left" col="1"> 
                            <v-autocomplete
                                v-model="groupMember.per_ID"
                                :items="people"
                                label="Group Member"
                                item-value="per_ID"
                            
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
                              v-model="groupMember.grp_role"
                              label="Group Role"
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
                      @click="addLifeEventForPerson()"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                @click="deletePersonForGroup(item)"
              >
                mdi-delete
              </v-icon>
          </template>
        </v-data-table>
      </v-card>
      <v-divider class="my-5"></v-divider>

      <v-row justify="center">
        <v-col justify="left" col="1"> 
          <v-btn color="dark" @click="deleteGroup">
            Delete
          </v-btn>
        </v-col>
        <v-col justify="right" col="2"> 
          <v-btn class= "float-right" color="dark" @click="updateGroup">
            Update
          </v-btn>
        </v-col>
      </v-row>
     </v-form>
  </div>

  <div v-else>
    <br />
    <p>Please click on a Group...</p>
    
  </div>
</template>

<script>
import LifeEventService from "../services/LifeEventService";
import PersonDataService from "../services/PersonDataService";
import LifeEventPersonService from "../services/LifeEventPersonService";

export default {
  data() {
    return {
      dialog: false,
      currentPerson: null,
      lifeventpersons: [],
      lifeevent: [],
      lifeventperson: {},
      message: '',
      headers: [
                {
                    text: 'Name',
                    align: 'left',
                    value: 'person.frst_name',
                },
                {
                    text: '',
                    align: 'left',
                    value: 'person.last_name',
                },
                {
                    text: 'Role',
                    align: 'left',
                    value: 'grp_role',
                }, 
                {
                    text: 'Delete',
                    value: 'actions',
                    align: 'center',
                    sortable: false,
                }
            ],
    }
  },
  
  methods: {
    getPerson(per_ID) {
      PersonDataService.get(per_ID)
        .then(response => {
          this.currentPerson = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    updatePerson() {
      PersonDataService.update(this.currentPerson.per_ID, this.currentPerson)
        .then(response => {
          console.log(response.data);
          this.message = 'The Group was updated successfully!';
          this.$router.push({ name: 'groupdisplay' });
        })
        .catch(e => {
          console.log(e);
        });
   },

    deletePerson() {
      PersonDataService.delete(this.currentPerson.per_ID)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "groupdisplay" });
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    getLifeEventForPerson(per_ID)  {
      LifeEventPersonService.getLifeEvents(per_ID)
        .then(response => {
            this.groupMembers = response.data;
            console.log(this.groupMembers);
        })
        .catch(error => {
            this.message = error.response.data.message;
        });
    },

    getLifeEvent() {
      LifeEventService.getAll()
        .then(response => {
            this.lifeevents = response.data;
            console.log(this.lifeevents);
        })
        .catch(error => {
            this.message = error.response.data.message;
        });
    },

    deleteLifeEventForPerson(lifeventperson) {
      LifeEventPersonService.delete(lifeventperson.per_ID)
        .then(() => {  
          this.lifeventperson = this.lifeventperson.filter(lifeventperson => lifeventperson.lep_ID!=lifeventperson.lep_ID);
        })
        .catch(error => {
            this.message = error.response.data.message;
        });
    },

    addLifeEventForPerson() {
        this.dialog = false
        let lifeventperson = {};
        lifeventperson.per_ID = this.currentLifeEvent.per_ID;
        lifeventperson.lep_ID = this.lifeventperson.lep_ID;
        console.log(lifeventperson)
        LifeEventPersonService.create(lifeventperson)
          .then(() => {
                this.getPeopleForGroup(this.$route.params.id);
                console.log(this.groupMembers);
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
    this.getGroup(this.$route.params.id);
    this.getPeopleForGroup(this.$route.params.id);
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
  max-width: 600px;
  max-height: 900px;
  margin: auto;
}
</style>