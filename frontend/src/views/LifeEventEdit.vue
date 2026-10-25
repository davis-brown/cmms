<template>
  <div>
  <PageBand title="Edit life event" />
  <div class="page-body page-body--narrow">
      <div v-if="currentLifeEvent" class="form-page">
      <v-form ref="form">
     
        <v-text-field
        v-model="currentLifeEvent.event_date"
        :rules="[(v) => !! v || 'Date is required']"
        label="Life Event Date YYYY-DD-MM"
        clearable
        required
        ></v-text-field>

        <v-text-field
        v-model="currentLifeEvent.event_note"
        :rules="[(v) => !!v || 'Notes are required']"
        label="Notes"
        clearable
        required
        ></v-text-field>


    <v-btn @click="updateLifeEvent" color="primary" variant="flat">
        Submit
      </v-btn>

    <v-btn @click="cancel" variant="text">
        Cancel
      </v-btn>

    <v-btn @click="deleteLifeEvent" color="error" variant="outlined">
        Delete Event
    </v-btn>
    
  </v-form>
  </div>
  </div>
  </div>
</template>

<script>
import PageBand from "../components/PageBand.vue";
import LifeEventService from "../services/LifeEventService.js";

export default {
  components: { PageBand },
    data(){
        return {
            currentLifeEvent: null,
        };
    },
     methods: {
    getLifeEvent(event_ID) {
      LifeEventService.get(event_ID)
        .then(response => {
          this.currentLifeEvent = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
     cancel() {
      this.$router.push({ name: "lifeevent" });
    },
    updateLifeEvent() {
      LifeEventService.update(this.currentLifeEvent.event_ID, this.currentLifeEvent)
        .then(response => {
          console.log(response.data);
          this.message = 'The LifeEvent was updated successfully!';
          this.$router.push({ name: 'lifeeventperson' });
        })
        .catch(e => {
          console.log(e);
        });
    },
    deleteLifeEvent() {
      if (!window.confirm('Delete this life event?')) {
        return;
      }
      LifeEventService.delete(this.currentLifeEvent.event_ID)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "lifeeventperson" });
        })
        .catch(e => {
          console.log(e);
        });
    }

    },
  mounted() {
    this.message = '';
    this.getLifeEvent(this.$route.params.id);
    
  }
};

</script>
