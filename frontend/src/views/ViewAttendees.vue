<template>
  <div v-if="currentEvent">
    <PageBand :title="`Attendees for ${currentEvent.event_name}`">
      <v-btn variant="outlined" color="primary" prepend-icon="mdi-arrow-left" @click="cancel()">Back</v-btn>
    </PageBand>
    <div class="page-body page-body--narrow">
      <p v-if="uniqueAttendees.length == 0" class="text-medium-emphasis">No one has RSVP'd for this event yet.</p>
      <v-list v-else lines="one">
        <v-list-item v-for="(attendee, index) in uniqueAttendees" :key="index" :title="attendee">
          <template v-slot:prepend>
            <PersonAvatar :name="attendee || ''" :size="40" class="mr-3" />
          </template>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script>
import PageBand from "../components/PageBand.vue";
import PersonAvatar from "../components/PersonAvatar.vue";
import EventService from "../services/EventService";
import AttendeeService from "../services/AttendeeService";
export default {
  components: { PageBand, PersonAvatar },
    data: () => ({
    currentEvent: null,
    attendees: [],
    uniqueAttendees: [],
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
                    this.getNumberofAttendees(attendeeNames);
                })
                .catch(error => {
                console.log(error);
                    this.message = (error.response && error.response.data.message) || error.message;
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
        },

        cancel() {
            this.$router.push({name: 'calendar'});
        }
    }


}
</script>

