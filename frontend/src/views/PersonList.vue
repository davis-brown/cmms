<template>
  <div>
    <PageBand title="Members of the Congregation">
      <v-btn
        to="/personadd"
        color="primary"
        prepend-icon="mdi-plus"
        v-if="showAdminBoard || showModeratorBoard"
      >
        Add Member
      </v-btn>
      <v-btn
        variant="outlined"
        color="primary"
        prepend-icon="mdi-download"
        @click="download()"
        v-if="showAdminBoard || showModeratorBoard"
      >
        CSV Download
      </v-btn>
    </PageBand>

    <div class="page-body">
      <v-text-field
        v-model="search"
        label="Search Members"
        prepend-inner-icon="mdi-magnify"
        class="member-search"
        @update:model-value="filterMembers"
      ></v-text-field>

      <p v-if="message" class="member-empty" role="alert">{{ message }}</p>
      <p v-else-if="loaded && searchMembers.length === 0" class="member-empty">
        {{ persons.length === 0 ? 'No members yet.' : `No one matches “${search}”.` }}
      </p>

      <ul class="member-grid">
        <li v-for="person in searchMembers" :key="person.per_ID">
          <v-menu :close-on-content-click="false" location="bottom start">
            <template v-slot:activator="{ props }">
              <button type="button" class="member" v-bind="props">
                <PersonAvatar :name="[person.frst_name, person.last_name].filter(Boolean).join(' ')" :color-key="familyKeys[person.per_ID] || person.last_name" />
                <span class="member-text">
                  <span class="member-name">{{ person.frst_name }} {{ person.last_name }}</span>
                  <span v-if="person.church_pos" class="member-role">{{ person.church_pos }}</span>
                </span>
              </button>
            </template>

            <v-card class="member-card" max-height="70vh" width="420">
              <div class="member-card-head">
                <PersonAvatar :name="[person.frst_name, person.last_name].filter(Boolean).join(' ')" :color-key="familyKeys[person.per_ID] || person.last_name" :size="64" />
                <div>
                  <h2>{{ person.frst_name }} {{ person.last_name }}</h2>
                  <v-chip
                    v-if="person.pub_permission"
                    size="small"
                    :color="person.pub_permission == 'Active' ? 'success' : 'error'"
                    variant="flat"
                  >{{ person.pub_permission }}</v-chip>
                </div>
              </div>

              <dl class="member-facts">
                <template v-if="person.phone">
                  <dt><v-icon color="primary" size="20" icon="mdi-phone" />Mobile</dt>
                  <dd><a :href="`tel:${person.phone}`">{{ person.phone }}</a></dd>
                </template>
                <template v-if="person.email">
                  <dt><v-icon color="primary" size="20" icon="mdi-email" />Email</dt>
                  <dd><a :href="`mailto:${person.email}`">{{ person.email }}</a></dd>
                </template>
                <template v-if="person.address">
                  <dt><v-icon color="primary" size="20" icon="mdi-home" />Home</dt>
                  <dd>{{ person.address }}</dd>
                </template>
                <template v-if="person.bday">
                  <dt><v-icon color="primary" size="20" icon="mdi-cake-variant" />Birthday</dt>
                  <dd>{{ formatDate(person.bday) }}</dd>
                </template>
                <template v-if="person.church_pos">
                  <dt><v-icon color="primary" size="20" icon="mdi-account-tie" />Ministry Position</dt>
                  <dd>{{ person.church_pos }}</dd>
                </template>
                <template v-if="person.employer">
                  <dt><v-icon color="primary" size="20" icon="mdi-briefcase" />Employer</dt>
                  <dd>{{ person.employer }}</dd>
                </template>
                <template v-if="person.baptised == 1">
                  <dt><v-icon color="primary" size="20" icon="mdi-water" />Baptised</dt>
                  <dd>{{ person.bapt_date ? formatDate(person.bapt_date) : 'Yes' }}</dd>
                </template>
              </dl>

              <v-card-actions v-if="showAdminBoard" class="px-4 pb-4">
                <v-btn color="primary" variant="flat" prepend-icon="mdi-pencil" @click="editPerson(person)">
                  Edit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import PersonDataService from "../services/PersonDataService";
import PageBand from "../components/PageBand.vue";
import PersonAvatar from "../components/PersonAvatar.vue";
import { formatDate } from "../formatDate";
import { loadFamilyKeys } from "../familyKeys";

  export default {
    components: { PageBand, PersonAvatar },
      computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_ADMIN');
      }
      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_MODERATOR');
      }
      return false;
    }
  },
  data() {
        return { 
         persons: [],
         searchMembers: [],
         familyKeys: {},
         loaded: false,
         message: "",
         search: ""

         
        
        };
  },
    created() {
        loadFamilyKeys().then(keys => { this.familyKeys = keys; });
        PersonDataService.getAll()
            .then(response => {
                this.persons = response.data;
                this.searchMembers = response.data;
                this.loaded = true;
            })
            .catch(error => {
                this.message = (error.response && error.response.data.message) || error.message;
            });
    },
      
    
    methods: {
          formatDate,
          editPerson(person) {
            this.$router.push({ name: 'person-edit', params: { id: person.per_ID } });
    
        },
    
      filterMembers() {
			const search = (this.search || "").trim().toLowerCase();
			this.searchMembers = this.persons.filter((person) => {
				const name = `${person.frst_name || ""} ${person.last_name || ""}`;
				return name.toLowerCase().includes(search);
			});
		},
        download() {
          const columns = [
            ['First Name', 'frst_name'],
            ['Middle Name', 'midl_name'],
            ['Last Name', 'last_name'],
            ['Email', 'email'],
            ['Phone', 'phone'],
            ['Address', 'address'],
            ['Birthday', 'bday'],
            ['Status', 'pub_permission'],
            ['Church Position', 'church_pos'],
            ['Baptised', 'baptised'],
            ['Baptism Date', 'bapt_date'],
            ['Employer', 'employer'],
          ];
          // Quote every cell and double any quotes inside it. A leading ' stops
          // spreadsheets running values like "=..." as formulas.
          const cell = value => {
            let text = String(value == null ? '' : value);
            if (/^[=+\-@]/.test(text)) {
              text = "'" + text;
            }
            return '"' + text.replace(/"/g, '""') + '"';
          };
          const rows = [columns.map(([label]) => cell(label))];
          this.persons.forEach(person => {
            rows.push(columns.map(([, field]) => cell(person[field])));
          });
          const text = rows.map(row => row.join(',')).join('\r\n');

          const element = document.createElement('a');
          element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
          element.setAttribute('download', 'members.csv');
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }
     
        },
    
       /*findLifeEvents(person) {
         this.$router.push({ name: 'lifeeventadd', params: { id: person.per_ID } });
       }
*/
   

  
  };

</script>


<style scoped>
.member-search {
  max-width: 520px;
}
.member-empty {
  color: var(--ink-muted);
}
.member-grid {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}
.member {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
  text-align: left;
  color: var(--ink);
  transition: border-color 0.15s ease-out, box-shadow 0.15s ease-out;
}
.member:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
  box-shadow: var(--shadow-card);
}
.member-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.member-name {
  font-weight: 700;
  font-size: 1.125rem;
}
.member-role {
  color: var(--ink-muted);
  font-size: 0.9375rem;
}
.member-card-head {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 20px 8px;
}
.member-card-head h2 {
  margin: 0 0 6px;
}
.member-facts {
  margin: 0;
  padding: 8px 20px 12px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 16px;
}
.member-facts dt {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  white-space: nowrap;
}
.member-facts dd {
  margin: 0;
  overflow-wrap: anywhere;
}
</style>
