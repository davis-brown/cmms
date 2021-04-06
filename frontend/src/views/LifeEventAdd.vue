<template>

  <div class="submit-form mt-3 mx-auto">
    <H1>Add Life Event </H1>
    <form @submit.prevent="saveLifeEvent">

    <v-text-field
    v-model="event.event_ID"
    label="Life Event Date"
    ></v-text-field>

    <v-text-field
    v-model="event.event_notes"
    label="Life Event Notes"
    ></v-text-field>
      
       </form>
      <v-btn color="primary" class="offset-sm4 mt-3" @click="saveLifeEvent">Submit</v-btn>
      <v-btn color="primary" class="mt-3" @click="cancel">Cancel</v-btn>
     </div>
  
</template>

<script>
import LifeEventService from "../services/LifeEventService";

export default {
  data() {
    return {
      event: {},
      events: []
  
    };
  },
  methods: {
    saveLifeEvent() {
      console.log(this.event)
      LifeEventService.create(this.event)
        .then(() => {
          this.$router.push({ name: "lifeevent" });
          console.log(this.data)
        })
        .catch((e) => {
          console.log(e);
        });
    },
    cancel() {
      this.$router.push({ name: "lifeevent" });
    },
  },
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