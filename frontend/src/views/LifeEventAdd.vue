<template>
  <div>
  <PageBand title="Add a life event" />
  <div class="page-body page-body--narrow">

  <div class="form-page">
        <form @submit.prevent="saveLifeEvent">

    <v-text-field
    v-model="lifeevent.event_date"
    label="Life Event Date: YYYY-DD-MM"
    required
    clearable
    ></v-text-field>


    <v-text-field
    v-model="lifeevent.event_note"
    label="Life Event Notes"
    required
    clearable
    ></v-text-field>
      
       </form>
      <v-btn class="offset-sm4 mt-3" @click="saveLifeEvent" color="primary" variant="flat">Submit</v-btn>
      <v-btn class="mt-3" @click="cancel" variant="text">Cancel</v-btn>
     </div>
  
  </div>
  </div>
</template>

<script>
import PageBand from "../components/PageBand.vue";
import LifeEventService from "../services/LifeEventService";

export default {
  components: { PageBand },
  data() {
    return {
      lifeevent: {},
      lifeevents: []
  
    };
  },
  methods: {
    saveLifeEvent() {
      console.log(this.lifeevent)
      LifeEventService.create(this.lifeevent)
        .then(() => {
          this.$router.push({ name: "lifeeventperson" });
          console.log(this.data)
        })
        .catch((e) => {
          console.log(e);
        });
    },
    cancel() {
      this.$router.push({ name: "lifeeventperson" });
    },
  },
};
</script>

