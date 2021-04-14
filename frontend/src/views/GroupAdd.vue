<template>
  <div class="submit-form mt-3 mx-auto" data-app="true">
    <h1>Add a Group</h1>

    <form @submit.prevent="saveGroup">

      <v-text-field
        v-model="group.grp_name"
        label="Group Name"
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
              <v-toolbar-title>Add Group Members</v-toolbar-title>
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
                    Add Group Member
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
                                label="Group"
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
                              label="Role in Group"
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
                      @click="addMemberForTable()"
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
    </form>

  <v-divider class="my-5"></v-divider>
    <v-row justify="center">
      <v-col justify="left" col="1"> 
        <v-btn color="dark" @click="cancel">
          Cancel
        </v-btn>
      </v-col>
      <v-col justify="right" col="2"> 
        <v-btn class= "float-right" color="dark" @click="saveGroup">
          Save
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import GroupDataServices from "../services/GroupDataService";
import PersonDataService from "../services/PersonDataService";
import GroupMemberService from "../services/GroupMemberService";

export default {
  data() {
    return {
      dialog: false,
      group: {},
      groupMembers: [],
      people: [],
      groupMember: {},
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
                    text: 'Group Role',
                    align: 'left',
                    value: 'grp_role',
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
    saveGroup() {
      console.log(this.group)
      GroupDataServices.create(this.group)
        .then(response => {
          console.log(response.data.grp_ID)
          this.groupMembers.forEach(groupMember => {
            groupMember.grp_ID = response.data.grp_ID;
            this.addMemberForGroup(groupMember)
          })
          this.$router.push({ name: "groupdisplay" });
        })
        .catch((e) => {
          console.log(e);
        });
    },

    cancel() {
      this.$router.push({ name: "groupdisplay" });
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
      this.groupMembers = this.groupMembers.filter(groupMember => groupMember.gm_ID!=groupmember.gm_ID);
    },

    addMemberForGroup(groupMember) {
        GroupMemberService.create(groupMember)
          .then(() => {
          })
          .catch(error => {
              this.message = error.response.data.message;
          });
    },

    addMemberForTable() {
      this.dialog = false;
      let groupMember = {};
      groupMember.per_ID = this.groupMember.per_ID;
      groupMember.grp_role = this.groupMember.grp_role;
      //groupMember.grp_ID = this.currentGroup.grp_ID;
      PersonDataService.get(this.groupMember.per_ID)
        .then(response => {
          groupMember.person = response.data;
          console.log(groupMember)
          this.groupMembers.push(groupMember)
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