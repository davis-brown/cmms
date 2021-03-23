<template>
  <div v-if="currentGroup" class="edit-form">
      <v-form ref="form" lazy-validation>
        
      <v-text-field
        v-model="currentGroup.grp_name"
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
                    Edit Members
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span>New Group Member</span>
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
                      @click="addMemberForGroup()"
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
              v-model="currentGroup.per_ID"
              name="rowSelector">
              <v-radio :value="item.person.per_ID"/>
            </v-radio-group>
          </template>
          <template v-slot: item.actions="{ item }">
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
          <v-btn color="error" @click="deleteGroup">
            Delete
          </v-btn>
        </v-col>
        <v-col justify="right" col="2"> 
          <v-btn class= "float-right" color="success" @click="updateGroup">
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
import GroupDataServices from "../services/GroupDataService.js";
import PersonDataService from "../services/PersonDataService";
import GroupMemberService from "../services/GroupMemberService";

export default {
  data() {
    return {
      dialog: false,
      currentGroup: null,
      groupMembers: [],
      people: [],
      groupMember: {},
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
                    text: 'Action',
                    value: 'actions',
                    align: 'left',
                    sortable: false,
                }
            ],
    };
  },
  
  methods: {
    getGroup(grp_ID) {
      GroupDataServices.get(grp_ID)
        .then(response => {
          this.currentGroup = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    updateGroup() {
      GroupDataServices.update(this.currentGroup.grp_ID, this.currentGroup)
        .then(response => {
          console.log(response.data);
          this.message = 'The Group was updated successfully!';
          this.$router.push({ name: 'groupdisplay' });
        })
        .catch(e => {
          console.log(e);
        });
    },

    deleteGroup() {
      GroupDataServices.delete(this.currentGroup.grp_ID)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "groupdisplay" });
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    getPeopleForGroup(grp_ID)  {
      GroupMemberService.getGroupMembers(grp_ID)
        .then(response => {
            this.groupMembers = response.data;
            console.log(this.groupMembers);
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

    deletePersonForGroup(groupmember) {
      GroupMemberService.delete(groupmember.gm_ID)
        .then(() => {  
          this.groupMembers = this.groupMembers.filter(groupMember => groupMember.gm_ID!=groupmember.gm_ID);
        })
        .catch(error => {
            this.message = error.response.data.message;
        });
    },

    addMemberForGroup() {
        this.dialog = false
        let groupMember = {};
        groupMember.grp_ID = this.currentGroup.grp_ID;
        groupMember.per_ID = this.groupMember.per_ID;
        groupMember.grp_role = this.groupMember.grp_role;
        console.log(groupMember)
        GroupMemberService.create(groupMember)
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
  max-width: 600;
  margin: auto;
}
</style>