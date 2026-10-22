<template>
  <div v-if="currentGroup" class="submit-form">
      <v-form ref="form">
        
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
              color="white"
            >
              <v-toolbar-title>Group Member</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog
                v-model="dialog"
                max-width="900px"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    color="primary"
                    variant="elevated"
                    class="mb-2"
                    v-bind="props"
                  >
                    Edit/Add Members
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
                                :item-title="personName"
                              ></v-autocomplete>
                        </v-col>
                        
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="close"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="addMemberForGroup()"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.head`]="{ item }">
            <v-radio-group
              v-model="currentGroup.per_ID">
              <div class="d-flex justify-center"><v-radio :value="item.person.per_ID"/></div>
            </v-radio-group>
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
          <v-btn @click="deleteGroup">
            Delete
          </v-btn>
        </v-col>
        <v-col justify="right" col="2"> 
          <v-btn class= "float-right" @click="updateGroup">
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
import GroupDataServices from "../services/GroupDataService";
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
                    title: 'Name',
                    align: 'left',
                    value: 'person.frst_name',
                },
                {
                    title: '',
                    align: 'left',
                    value: 'person.last_name',
                },
                {
                    title: 'Group Leader',
                    align: 'center',
                    value: 'head',
                    sortable: false,
                },
                   {
                    title: 'Contact',
                    align: 'center',
                    value: 'person.phone',
                    sortable: false,
                },
                {
                    title: 'Delete',
                    value: 'actions',
                    align: 'center',
                    sortable: false,
                }
            ],
    }
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

    async updateGroup() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
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
      if (!window.confirm(`Delete the ${this.currentGroup.grp_name || ''} group? Its members stay in the directory.`)) {
        return;
      }
      GroupDataServices.delete(this.currentGroup.grp_ID)
        .then(response => {
          //GroupMemberService.delete(this.currentGroup.gm_ID)
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

    deletePersonForGroup(groupmember) {
      GroupMemberService.delete(groupmember.gm_ID)
        .then(() => {  
          this.groupMembers = this.groupMembers.filter(groupMember => groupMember.gm_ID!=groupmember.gm_ID);
        })
        .catch(error => {
            this.message = (error.response && error.response.data.message) || error.message;
        });
    },

    addMemberForGroup() {
        this.dialog = false
        if (!this.groupMember.per_ID) {
          return;
        }
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
.submit-form {
  max-width: 600px;
  max-height: 700px;
  margin: auto;
}
</style>