<template>
<div v-if="currentEvent">

    
    <v-card style="margin-top:3rem; margin-bottom:2rem;" max-width="700px" class="mx-auto">
        <v-toolbar :color = "currentEvent.color">
                <v-card-title style="color: white; font-size:x-large"> 
                    <v-btn dark icon @click="cancel()" class="mr-auto">
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    Attendees for {{currentEvent.event_name}}
                </v-card-title>
            </v-toolbar>
            <div class="listitems" style="padding-left: 20px">  
            <v-list v-if="attendees">
                <v-card-text v-if="uniqueAttendees.length == 0">
                    There is no one RSVP'd for this event
                </v-card-text>
                <v-list-item v-for="(attendee,index) in uniqueAttendees" :key="index">
                    {{attendee}}
                </v-list-item>
            </v-list>
            </div>
            
    </v-card>

    
</div>
  

</template>

<script>
import EventService from "../services/EventService";
import AttendeeService from "../services/AttendeeService";
export default {
    data: () => ({
    currentEvent: null,
    attendees: {},
    uniqueAttendees: {},
    attendee: {
      atd_ID: null,
      evt_ID: null,
      per_ID: null,
    }

    }),

    created() {
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

<style>

</style>