<template>
  <div>
    <PageBand title="Life Events">
      <v-btn
        :to="{ name: 'lifeeventpersonadd', params: { id: $route.params.id } }"
        color="primary"
        prepend-icon="mdi-plus"
      >
        Add Life Event
      </v-btn>
    </PageBand>
    <div class="page-body page-body--narrow">
      <p v-if="lifeventpersons.length === 0" class="text-medium-emphasis">No life events yet.</p>
      <v-timeline v-else density="compact" side="end" line-color="primary">
        <v-timeline-item
          v-for="lifeventperson in lifeventpersons"
          :key="lifeventperson.lep_ID"
          dot-color="primary"
          size="small"
        >
          <template v-if="lifeventperson.lifeevent">
          <v-card>
            <v-card-title class="pt-4 px-5"><h2>{{ lifeventperson.lifeevent.event_note }}</h2></v-card-title>
            <v-card-subtitle class="px-5">{{ formatDate(lifeventperson.lifeevent.event_date) }}</v-card-subtitle>
            <v-card-actions class="px-4 pb-4">
              <v-btn variant="tonal" color="primary" prepend-icon="mdi-pencil" @click="editLifeEvent(lifeventperson.lifeevent)">Edit</v-btn>
              <v-btn @click="deleteLifeEventForPerson(lifeventperson)" color="error" variant="outlined">Remove</v-btn>
            </v-card-actions>
          </v-card>
          </template>
        </v-timeline-item>
      </v-timeline>
    </div>
  </div>
</template>


<script>
import PageBand from "../components/PageBand.vue";
import { formatDate } from "../formatDate";
import LifeEventService from "../services/LifeEventService";
import PersonDataService from "../services/PersonDataService";
import LifeEventPersonService from "../services/LifeEventPersonService";

export default {
  components: { PageBand },
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
    formatDate,
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

