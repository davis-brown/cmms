<template>
<v-main>
<v-container>
<h1>List of Life Events </h1>
	<v-btn
			:to="{ name: 'lifeeventpersonadd', params: { id: $route.params.id } }"
			class="mr-4"
			color="primary"
		>
    Add Life Event
		</v-btn>
    <v-timeline density="compact" side="end">
      <v-timeline-item
        v-for="lifeventperson in lifeventpersons"
        :key="lifeventperson.lep_ID"
      >
        <v-card v-if="lifeventperson.lifeevent">
          <v-list>
            <v-list-item>
                <v-list-item-title><h2>{{ lifeventperson.lifeevent.event_note }}</h2></v-list-item-title>
                <v-list-item-subtitle>{{ (lifeventperson.lifeevent.event_date || '').substr(0, 10) }}</v-list-item-subtitle>
              <v-list-item-action>
                <v-btn size="small" @click="editLifeEvent(lifeventperson.lifeevent)">Edit</v-btn>
                <v-btn size="small" @click="deleteLifeEventForPerson(lifeventperson)">Remove</v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-timeline-item>
    </v-timeline>
</v-container>
</v-main>
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
          this.$router.push({ name: 'lifeeventperson' });
        })
        .catch(e => {
          console.log(e);
        });
   },

    deletePerson() {
      PersonDataService.delete(this.currentPerson.per_ID)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "lifeeventperson" });
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    getLifeEventsForPerson(per_ID)  {
      LifeEventPersonService.getLifeEventPerson(per_ID)
        .then(response => {
            this.lifeventpersons = response.data;
            console.log(this.lifeventpersons);
        })
        .catch(error => {
            this.message = (error.response && error.response.data.message) || error.message;
        });
    },

    editLifeEvent(lifeevent) {
      this.$router.push({ name: 'lifeeventedit', params: { id: lifeevent.event_ID } });
    },

    deleteLifeEventForPerson(lifeventperson) {
      LifeEventPersonService.delete(lifeventperson.lep_ID)
        .then(() => {  
          this.lifeventpersons = this.lifeventpersons.filter(row => row.lep_ID != lifeventperson.lep_ID);
        })
        .catch(error => {
            this.message = (error.response && error.response.data.message) || error.message;
        });
    },
     getLifeEvents() {
      LifeEventService.getAll()
        .then(response => {
            this.lifeevents = response.data;
            console.log(this.lifeevents);
        })
        .catch(error => {
            this.message = (error.response && error.response.data.message) || error.message;
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
    }
  },
  mounted() {
    this.message = '';
    this.getPerson(this.$route.params.id);
    this.getLifeEventsForPerson(this.$route.params.id);
    this.getLifeEvents();
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