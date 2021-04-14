<template>
    <div class="container">
        <h1>Event Details</h1>
        <br>
        <v-card max-width="700px" class="mx-auto">
            <v-toolbar :color = "currentEvent.color">
                <v-card-title style="color: white; font-size:x-large">{{currentEvent.event_name}}</v-card-title>
                <v-btn class="ml-auto">Attending?</v-btn>
            </v-toolbar>
            <v-card-text style="padding-left:2rem">
                <p><strong>Description: </strong>{{currentEvent.event_desc}}</p>
                <p><strong>Location: </strong>{{currentEvent.loc_ID}}</p>
                <p><strong>Date: </strong>{{currentEvent.event_date.substr(0,10)}}</p>
                <p><strong>Event Duration : </strong>{{currentEvent.event_start.substr(0,5)}} - {{currentEvent.event_end.substr(0,5)}}</p>
            </v-card-text>
            
        </v-card>
        <br>
        <h3>Bringing something?</h3>
        <br>
        <v-btn :color="currentEvent.color" @click="openText = true" dark>Add contribution</v-btn>
        <br><br>
        <v-row>
        <v-text-field v-if="openText" label="contribution" class="mx-5"></v-text-field>
        <v-icon v-if="openText" @click="openText = false" color="error">mdi-close</v-icon>
        </v-row>
        <v-spacer></v-spacer>
        <v-btn v-if="openText" block color="success" onclick="openText = false">Save</v-btn>
    </div>
</template>

<script>
import EventService from "../services/EventService";
export default {
    data: () => ({
    currentEvent: null,
    openText: false,
    }),


   created() {
    this.message = '';
    this.getEvent(this.$route.params.id);
  },

  methods: {
    getEvent(evt_ID) {
      EventService.get(evt_ID)
        .then(response => {
          this.currentEvent = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    
   
  }
}
</script>

<style scoped>
    h1, h3 {
        text-align:center;
        margin:1rem;
    }
    
</style>