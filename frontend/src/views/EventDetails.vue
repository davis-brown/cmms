<template>
    <div v-if="currentEvent" class="container">
        <h1>Event Details</h1>
        <br>
        <v-card max-width="700px" class="mx-auto">
            <v-toolbar :color = "currentEvent.color">
                <v-card-title style="color: white; font-size:x-large">{{currentEvent.event_name}}</v-card-title>
            </v-toolbar>
            <v-card-text style="padding-left:2rem">
                <p><strong>Description: </strong>{{currentEvent.event_desc}}</p>
                <p><strong>Location: </strong>{{currentEvent.loc_ID}}</p>
                <p><strong>Date: </strong>{{currentEvent.event_date.substr(0,10)}}</p>
                <p><strong>Event Duration : </strong>{{currentEvent.event_start.substr(0,5)}} - {{currentEvent.event_end.substr(0,5)}}</p>
            </v-card-text>
            
        </v-card>
        <br>
        <br>
        
        <br>
        <h2>Bringing something?</h2>
        <br>
        
        <v-row style="margin-bottom:12px">
        <v-text-field label="Add your contribution" class="mx-5" v-model="attendees.contribution"></v-text-field>
        </v-row>
      
        <v-btn block color="success" @click="addAttendance()">RSVP for Event</v-btn>
        <br>
        <br>
      
    </div>
</template>

<script>
import EventService from "../services/EventService";
import AttendeeService from "../services/AttendeeService";
export default {
    data: () => ({
    currentEvent: null,
    openText: false,
    attendees: {},

    }),

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },


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

    getAttendeeForEvent(evt_ID) {
      EventService.getAttendee(evt_ID)
      .then(response => {
        this.attendees = response.data;
        console.log(response.data);
      })
    },

    addAttendance() {
      console.log("works");
      this.attendees.evt_ID = this.currentEvent.evt_ID;
      this.attendees.user_ID = this.currentUser.id;

      console.log(this.attendees.evt_ID);
      AttendeeService.create(this.attendees)
          .then(() => {
            console.log(this.data)
          })
          .catch((e) => {
            console.log(e);
          });
    }
   
  }
}
</script>

<style scoped>
    h1, h3 {
        text-align:center;
        margin:1rem;
    }
    
</style>