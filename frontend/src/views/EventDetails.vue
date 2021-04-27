<template>
    <div v-if="currentEvent" class="container">
        <h1>Event Details</h1>
        <br>
        <v-card max-width="700px" class="mx-auto">
            <v-toolbar :color = "currentEvent.color">
                <v-btn dark icon @click="cancel()">
                        <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-card-title style="color: white; font-size:x-large">{{currentEvent.event_name}}</v-card-title>
            </v-toolbar>
            <v-card-text style="padding-left:2rem">
                <p><strong>Description: </strong>{{currentEvent.event_desc}}</p>
                <p><strong>Location: </strong>{{currentEvent.loc_ID}}</p>
                <p><strong>Date: </strong>{{currentEvent.event_date.substr(0,10)}}</p>
                <p><strong>Event Duration : </strong>{{currentEvent.event_start.substr(0,5)}} - {{currentEvent.event_end.substr(0,5)}}</p>
                <p><strong>Attendance: </strong>{{currentEvent.attendance}}</p>
            </v-card-text>
            
        </v-card>
        <br>
        
        <v-card class="mx-auto" tile max-width="800" v-if="attendees.contribution">
          <v-toolbar color = "primary">
                <v-card-title style="color: white; font-size:x-large">Contributions</v-card-title>
            </v-toolbar>
          <v-list>
            <v-list-item v-for="attendee in attendees" :key="attendee.atd_ID">
              {{attendee.username}}: {{attendee.contribution}}
            </v-list-item>
          </v-list>
        </v-card>
        <br>
        
        <br>
        <h2>Bringing something?</h2>
        <br>
        
        <v-row style="margin-bottom:12px">
        <v-text-field label="Add your contribution" class="mx-5" v-model="attendee.contribution"></v-text-field>
        </v-row>
          <v-btn ml-5 color="success" @click="addAttendance()" >RSVP for Event</v-btn>
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
    num: 0,
    openText: false,
    attendees: {},
    uniqueAttendees: {},
    attendee: {
      atd_ID: null,
      evt_ID: null,
      per_ID: null,
      username: null,
      contribution: null,
    }

    }),

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },


   created() {
    this.message = '';
    this.getEvent(this.$route.params.id);
    this.getAttendeeForEvent(this.$route.params.id);
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

    updateEvent(evt_ID) {
         EventService.get(evt_ID)
        .then(response => {
          this.currentEvent = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
        
        this.currentEvent.attendance = this.uniqueAttendees.length;
        console.log('Hi there I just put ' + this.currentEvent.attendance);
        EventService.update(evt_ID, this.currentEvent)
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    getAttendeeForEvent(evt_ID) {
      
      AttendeeService.getAttendee(evt_ID)
      .then(response => {
        var attendance = new Array();
        var attendeeNames = new Array();
                for ( var i=0; i< response.data.length; i++) {
                  var event ={};
                   event.atd_ID = response.data[i].atd_ID;
                   event.evt_ID = response.data[i].evt_ID;
                   event.per_ID= response.data[i].per_ID;
                   event.username = response.data[i].username;
                   event.contribution = response.data[i].contribution;
                   attendance.push(event);  
                   attendeeNames.push(event.username);
                }
                this.attendees = attendance;
                console.log(attendance);
                this.getNumberofAttendees(attendeeNames);
            })
            .catch(error => {
              console.log(error);
                this.message = error.response.data.message;
            })
    },

    addAttendance() {
      this.attendee.evt_ID = this.currentEvent.evt_ID;
      this.attendee.username = this.currentUser.username;
      AttendeeService.create(this.attendee)
          .then(() => {
          })
          .catch((e) => {
            console.log(e);
          });
      this.updateEvent(this.currentEvent.evt_ID);
      this.getAttendeeForEvent(this.currentEvent.evt_ID);
      this.$router.push({name: 'calendar'});
    },

    getNumberofAttendees(attendees) {
      var unique = []
      for(var i = 0; i < attendees.length; i++) {
        var value = attendees[i]
        if (unique.indexOf(value) == -1) {
          unique.push(value)
        }
      }
      this.uniqueAttendees = unique;
      console.log (this.uniqueAttendees);
    },

    cancel() {
      this.$router.push({name: 'calendar'});
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