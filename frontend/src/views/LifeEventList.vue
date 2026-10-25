<template>
  <div>
    <PageBand title="Life Events">
      <v-btn to="/lifeeventadd" color="primary" prepend-icon="mdi-plus">
        Add Life Event
      </v-btn>
    </PageBand>
    <div class="page-body page-body--narrow">
      <p v-if="lifeevents.length === 0" class="text-medium-emphasis">No life events yet.</p>
      <v-timeline v-else density="compact" side="end" line-color="primary">
        <v-timeline-item
          v-for="lifeevent in lifeevents"
          :key="lifeevent.event_ID"
          dot-color="primary"
          size="small"
        >
          <v-card>
            <v-card-title class="pt-4 px-5"><h2>{{ lifeevent.event_note }}</h2></v-card-title>
            <v-card-subtitle class="px-5">{{ formatDate(lifeevent.event_date) }}</v-card-subtitle>
            <v-card-actions class="px-4 pb-4">
              <v-btn variant="tonal" color="primary" prepend-icon="mdi-pencil" @click="editLifeEvent(lifeevent)">Edit</v-btn>
              
            </v-card-actions>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </div>
  </div>
</template>

<script>
import PageBand from "../components/PageBand.vue";
import { formatDate } from "../formatDate";
import LifeEventService from "../services/LifeEventService";

export default {
  components: { PageBand },
  data() {
    return {
      lifeevents: [],
     
    };
  },
  created() {
    LifeEventService.getAll()
      .then((response) => {
        this.lifeevents = response.data;
        console.log(this.lifeevents);
      })
      .catch((error) => {
        this.message = (error.response && error.response.data.message) || error.message;
      });
  },
  methods: {
    formatDate,
    editLifeEvent(lifeevent) {
      this.$router.push({
        name: "lifeeventedit",
        params: { id: lifeevent.event_ID },
      });
    },
  },
};
</script>


