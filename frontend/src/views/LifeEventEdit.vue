<template>
      <div v-if="currentLifeEvent" class="edit-form py-3">
      <v-form ref="form" lazy-validation>
     
        <v-text-field
        v-model="currentLifeEvent.event_date"
        :rules="[(v) => !! v || 'Date is required']"
        label="Date"
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


    <v-btn color="success" small @click="updateLifeEvent">
        Submit
      </v-btn>

    <v-btn color="primary" small @click="cancel">
        Cancel
      </v-btn>
    
  </v-form>
  </div>
</template>

<script>
import LifeEventService from "../services/LifeEventService.js";

export default {
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
      this.$router.push({ name: "congregationdisplay" });
    },
    updateLifeEvent() {
      LifeEventService.update(this.currentLifeEvent.event_ID, this.currentLifeEvent)
        .then(response => {
          console.log(response.data);
          this.message = 'The LifeEvent was updated successfully!';
          this.$router.push({ name: 'lifeevent' });
        })
        .catch(e => {
          console.log(e);
        });
    },
    deleteLifeEvent() {
      LifeEventService.delete(this.currentLifeEvent.event_ID)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "lifeevent" });
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
<style>
h4 {
  font-size: 25px;
  text-align: center;
}
.edit-form {
  max-width: 400px;
  margin: auto;
}
</style>