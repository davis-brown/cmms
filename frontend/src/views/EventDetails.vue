<template>
  <div v-if="currentEvent">
    <PageBand title="Event Details">
      <v-btn variant="outlined" color="primary" prepend-icon="mdi-arrow-left" @click="cancel()">Back</v-btn>
    </PageBand>
    <div class="page-body page-body--narrow">
      <v-card class="event-card">
        <div class="event-strip" :class="`bg-${eventColor(currentEvent.color)}`"></div>
        <v-card-title class="pt-5 px-6"><h2>{{ currentEvent.event_name }}</h2></v-card-title>
        <v-card-text class="px-6 pb-6">
          <p v-if="currentEvent.event_desc" class="event-desc">{{ currentEvent.event_desc }}</p>
          <dl class="event-facts">
            <dt><v-icon icon="mdi-calendar" color="primary" />Date</dt>
            <dd>{{ formatDate(currentEvent.event_date) }}</dd>
            <dt><v-icon icon="mdi-clock-outline" color="primary" />Time</dt>
            <dd>{{ formatTime(currentEvent.event_start) }} – {{ formatTime(currentEvent.event_end) }}</dd>
            <template v-if="currentEvent.loc_ID">
              <dt><v-icon icon="mdi-map-marker" color="primary" />Location</dt>
              <dd>{{ currentEvent.loc_ID }}</dd>
            </template>
            <dt><v-icon icon="mdi-account-multiple-check" color="primary" />Attendance</dt>
            <dd>{{ currentEvent.attendance == null ? 0 : currentEvent.attendance }}</dd>
          </dl>
        </v-card-text>
      </v-card>

      <section v-if="latestRsvps.some(a => a.contribution)" class="event-section">
        <h2>Contributions</h2>
        <ul class="event-contributions">
          <template v-for="attendee in latestRsvps" :key="attendee.atd_ID">
            <li v-if="attendee.contribution">
              <PersonAvatar :name="attendee.username || ''" :size="36" />
              <span><strong>{{ attendee.username }}</strong> is bringing {{ attendee.contribution }}</span>
            </li>
          </template>
        </ul>
      </section>

      <section class="event-section">
        <h2>Bringing something?</h2>
        <p v-if="myRsvp" class="event-rsvp-status mt-2">
          <v-icon icon="mdi-check-circle" color="success" />You're going.
        </p>
        <v-text-field label="Add your contribution" v-model="attendee.contribution" class="mt-3"></v-text-field>
        <div class="d-flex flex-wrap ga-3">
          <v-btn @click="addAttendance()" color="primary" variant="flat" size="large">{{ myRsvp ? 'Update RSVP' : 'RSVP for Event' }}</v-btn>
          <v-btn v-if="myRsvp" @click="cancelAttendance()" color="error" variant="outlined" size="large">Cancel RSVP</v-btn>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import PageBand from "../components/PageBand.vue";
import PersonAvatar from "../components/PersonAvatar.vue";
import { formatDate, formatTime } from "../formatDate";
import { eventColor } from "../eventColors";
import EventService from "../services/EventService";
import AttendeeService from "../services/AttendeeService";
export default {
  components: { PageBand, PersonAvatar },
    data: () => ({
    currentEvent: null,
    num: 0,
    openText: false,
    attendees: [],
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
    },
    // One entry per username, holding their latest RSVP, so old duplicate rows don't show
    latestRsvps() {
      const byUser = new Map();
      [...this.attendees].sort((a, b) => a.atd_ID - b.atd_ID).forEach(a => byUser.set(a.username, a));
      return [...byUser.values()];
    },
    myRsvp() {
      return this.latestRsvps.find(a => a.username === this.currentUser.username);
    }
  },


   created() {
    this.message = '';
    this.getEvent(this.$route.params.id);
    this.getAttendeeForEvent(this.$route.params.id);
  },

  methods: {
    formatDate,
    formatTime,
    eventColor,
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
                for ( var i=0; i< response.data.length; i++) {
                  var event ={};
                   event.atd_ID = response.data[i].atd_ID;
                   event.evt_ID = response.data[i].evt_ID;
                   event.per_ID= response.data[i].per_ID;
                   event.username = response.data[i].username;
                   event.contribution = response.data[i].contribution;
                   attendance.push(event);  
                }
                this.attendees = attendance;
                if (this.myRsvp) this.attendee.contribution = this.myRsvp.contribution;
            })
            .catch(error => {
              console.log(error);
                this.message = (error.response && error.response.data.message) || error.message;
            })
    },

    addAttendance() {
      this.attendee.evt_ID = this.currentEvent.evt_ID;
      // The server records the RSVP under the logged-in user and updates the event's attendance
      AttendeeService.create(this.attendee)
          .then(() => {
            this.$router.push({name: 'calendar'});
          })
          .catch((e) => {
            console.log(e);
          });
    },

    cancelAttendance() {
      AttendeeService.delete(this.currentEvent.evt_ID)
          .then(() => {
            this.$router.push({name: 'calendar'});
          })
          .catch((e) => {
            console.log(e);
          });
    },

    cancel() {
      this.$router.push({name: 'calendar'});
    }
  }
}

</script>

<style scoped>
.event-card {
  overflow: hidden;
}
.event-strip {
  height: 10px;
}
.event-desc {
  font-size: 1.125rem;
  margin-bottom: 16px;
}
.event-facts {
  margin: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 16px;
  font-size: 1.0625rem;
  color: var(--ink);
}
.event-facts dt {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}
.event-facts dd {
  margin: 0;
}
.event-section {
  margin-top: 40px;
}
.event-rsvp-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.125rem;
  font-weight: 700;
}
.event-contributions {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}
.event-contributions li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
}
</style>
