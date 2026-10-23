<template>
  <div>
    <PageBand title="Events Calendar">
      <v-btn
        color="primary"
        @click="dialog = true"
        v-if="canManageEvents"
        prepend-icon="mdi-plus"
      >
        New Event
      </v-btn>
    </PageBand>
    <div class="page-body">
        <v-toolbar flat color="white" class="calendar-toolbar">
          <v-btn
            variant="outlined"
            class="mr-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn icon variant="text" @click="prev" aria-label="Previous">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon variant="text" @click="next" aria-label="Next">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title class="calendar-title">
            {{ title }}
          </v-toolbar-title>
          <v-menu
            location="bottom end"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                variant="outlined"
                v-bind="props"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon end>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>

      <!--Add Event dialog-->
      <v-dialog v-model="dialog" max-width="520">
          <v-card>
              <v-card-title class="pt-5 px-6"><h2>New event</h2></v-card-title>
              <v-card-text class="px-6">
                <v-form ref="eventForm" @submit.prevent="addEvent">
                    <v-text-field v-model="event.event_name" type="text" label="event name (required)" :rules="requiredRule"></v-text-field>
                    <v-text-field v-model="event.event_desc" type="text" label="detail" required></v-text-field>
                    <v-text-field v-model="event.loc_ID" type="text" label="event location" required></v-text-field>
                    <v-text-field v-model="event.event_date" type="date" label="start (required)" :rules="requiredRule"></v-text-field>
                    <v-row dense>
                      <v-col cols="6"><v-text-field v-model="event.event_start" type="time" label="start time (required)" :rules="requiredRule"></v-text-field></v-col>
                      <v-col cols="6"><v-text-field v-model="event.event_end" type="time" label="end time (required)" :rules="requiredRule"></v-text-field></v-col>
                    </v-row>
                    <fieldset class="swatches">
                      <legend>Colour</legend>
                      <v-btn
                        v-for="swatch in eventColors"
                        :key="swatch.hex"
                        icon
                        size="small"
                        :color="swatch.name"
                        :aria-label="swatch.label"
                        :aria-pressed="event.color === swatch.hex"
                        class="swatch"
                        :class="{ 'swatch--on': event.color === swatch.hex }"
                        @click="event.color = swatch.hex"
                      >
                        <v-icon v-if="event.color === swatch.hex">mdi-check</v-icon>
                      </v-btn>
                    </fieldset>
                    <v-btn type="submit" color="primary" class="mt-2">Create Event</v-btn>
                </v-form>
              </v-card-text>
          </v-card>
      </v-dialog>
      <v-sheet height="600" class="calendar-sheet">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          location="end"
        >
          <v-card
            min-width="350px"
          >
            <v-toolbar
              :color="eventColor(selectedEvent.color)"
            >
              <v-btn v-if="canManageEvents" @click="deleteEvent()" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="attendeeDetails(selectedEvent)" aria-label="Attendance">
              <v-icon>mdi-account-multiple-check</v-icon>
              <v-divider vertical></v-divider>
              {{selectedEvent.attendance}}
              </v-btn>
              
            </v-toolbar>
            <v-card-text>
              <form v-if="currentlyEditing !== selectedEvent.id">
                  {{selectedEvent.details}}
              </form>
              <form v-else>
                  <v-textarea
                      v-model="selectedEvent.details"
                      auto-grow
                      rows="4"
                      placeholder="add note"
                  ></v-textarea>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                variant="text"
                @click="selectedOpen = false"
              >
                Close
              </v-btn>

              <v-btn
                variant="text"
                v-if="(currentlyEditing != selectedEvent.id) && canManageEvents"
                @click.prevent="editEvent(selectedEvent)"
              >
                Edit 
              </v-btn>
              <v-btn
                variant="text"
                v-else-if="canManageEvents"
                @click.prevent="updateEvent(selectedEvent)"
              >
                Save
              </v-btn>
              <v-btn
              variant="text"
               @click.prevent="moreEvent(selectedEvent)"
              >
                View More...
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
      <!-- Month chips are too narrow to read on a phone, so list the events too -->
      <template v-if="$vuetify.display.xs && phoneEvents.length">
        <h2 class="mt-8">This month</h2>
        <ul class="phone-events">
          <li v-for="event in phoneEvents" :key="event.id">
            <router-link :to="{ name: 'eventdetails', params: { id: event.id } }">
              <span class="phone-events-dot" :class="`bg-${eventColor(event.color)}`"></span>
              <span>
                <strong>{{ event.name }}</strong>
                <span class="phone-events-when">{{ formatDate(event.start) }} · {{ formatTime(event.start.substr(11)) }}</span>
              </span>
            </router-link>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
import EventService from "../services/EventService";
import PageBand from "./PageBand.vue";
import { EVENT_COLORS, eventColor } from "../eventColors";
import { formatDate, formatTime } from "../formatDate";

// Today's date as YYYY-MM-DD in the viewer's time zone
const todayString = () => {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const newEvent = () => ({
  event_name: null,
  event_desc: null,
  event_date: todayString(),
  event_start: "12:00",
  event_end: "13:00",
  color: EVENT_COLORS[0].hex,
  loc_ID: null,
});
export default {
  components: { PageBand },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_ADMIN');
      }
      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_MODERATOR');
      }
      return false;
    },
    // Events in the month the calendar shows ("October 2026"), for the phone list
    phoneEvents() {
      const shown = this.title;
      return this.events
        .filter(e => {
          const [y, m] = e.start.split('-').map(Number);
          // Vuetify titles the month in English, e.g. "October 2026"
          return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) === shown;
        })
        .sort((a, b) => a.start.localeCompare(b.start));
    },
    canManageEvents() {
      return this.showModeratorBoard || this.showAdminBoard;
    }
  },
    
    data: () => ({

        today: new Date().toISOString(),
        focus: new Date().toISOString(),
          event: newEvent(),
          requiredRule: [v => !!v || 'Required'],
      
      
        
        type: "month",
        title: "",
        typeToLabel: {
            month: "Month",
            week: "Week",
            day: "Day",
            "4day": "4 Days"
        },
        
    
        currentlyEditing: null,
        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false,
        events: [],
        eventColors: EVENT_COLORS,
        dialog: false

    }),

    created() { 
      this.getEvents();
    },

    
    methods: {

      getEvents() {
        EventService.getEvents()

            .then(response => {
                //console.log(response.data[0]);
                var events = new Array();
                

                for ( var i=0; i< response.data.length; i++) {
                  var event ={};
                  event.start = response.data[i].event_date.substr(0,10) + ' '+ response.data[i].event_start;
                  event.end = response.data[i].event_date.substr(0,10) + ' '+ response.data[i].event_end;
                 
                   event.name = response.data[i].event_name;
                   
                   event.color = response.data[i].color;
                   event.id = response.data[i].evt_ID;
                   event.details = response.data[i].event_desc;
                   event.location = response.data[i].loc_ID;
                   event.attendance = response.data[i].attendance;

                   events.push(event);  
                
                }
                this.events = events;
                console.log(events);
            })
            .catch(error => {
              console.log(error);
                this.message = (error.response && error.response.data.message) || error.message;
            });
      },

      async addEvent() {
        const { valid } = await this.$refs.eventForm.validate();
        if (!valid) {
          return;
        }
        EventService.create(this.event)
          .then(() => {
            this.dialog = false;
            this.event = newEvent();
            this.$refs.eventForm.resetValidation();
            this.getEvents();
          })
          .catch((e) => {
            console.log(e);
          });
      },

      updateEvent(calendarevent) {
        // calendarevent.start/end look like "YYYY-MM-DD HH:MM:SS"
        const [date, start] = calendarevent.start.split(' ');
        const end = calendarevent.end.split(' ')[1];
        const changes = {
          event_name: calendarevent.name,
          event_desc: calendarevent.details,
          event_date: date,
          event_start: start,
          event_end: end,
          loc_ID: calendarevent.location,
          color: calendarevent.color,
        };

        EventService.update(this.currentlyEditing, changes)
          .then(() => {
            this.getEvents();
          })
          .catch(e => {
            console.log(e);
          });
        this.selectedOpen = false;
        this.currentlyEditing = null;
      },

      deleteEvent() {
        if (!window.confirm(`Delete "${this.selectedEvent.name}"? Its RSVPs are deleted too.`)) {
          return;
        }
        EventService.delete(this.selectedEvent.id)
          .then(() => {
            this.getEvents();
          })
          .catch(e => {
            console.log(e);
          });
        this.selectedOpen = false;
      },

      attendeeDetails(currentevent) {
        this.$router.push({ name: 'viewattendees', params: { id: currentevent.id } });
      },

      moreEvent(currentevent) {
        this.$router.push({ name: 'eventdetails', params: { id: currentevent.id } });
      },

      viewDay (nativeEvent, { date }) {
        this.focus = date
        this.type = 'day'
      },

      eventColor,
      formatDate,
      formatTime,

      getEventColor (event) {
        return eventColor(event.color)
      },

      setToday () {
        this.focus = ''
      },

      prev () {
        this.$refs.calendar.prev()
      },

      next () {
        this.$refs.calendar.next()
      },

      editEvent(event) {
          this.currentlyEditing = event.id;
      },

      showEvent (nativeEvent, { event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },

      // Runs whenever the calendar shows a different range, e.g. "October 2026"
      updateRange () {
        this.title = this.$refs.calendar.title
      },

      nth (d) {
          return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th','th', 'th'][d % 10]
      }

    }


}
</script>
<style scoped>
.calendar-toolbar :deep(.v-toolbar__content) {
  height: auto !important;
  flex-wrap: wrap;
  gap: 8px 0;
  padding: 8px 0;
}
/* Phones: the month name gets its own line instead of being cut to "O…" */
@media (max-width: 599px) {
  .calendar-title {
    order: -1;
    flex-basis: 100%;
    margin-inline-start: 0;
  }
}
.calendar-title {
  font-weight: 700;
  font-size: 1.5rem;
}
/* Vuetify's calendar text is 12px; bring it up to a size older eyes can read */
.calendar-sheet :deep(.v-calendar-weekly__head-weekday),
.calendar-sheet :deep(.v-calendar-daily_head-weekday) {
  font-size: 0.9375rem;
}
.calendar-sheet :deep(.v-calendar-weekly__day-label .v-icon-btn),
.calendar-sheet :deep(.v-calendar-weekly__day-label .v-btn) {
  font-size: 1rem;
}
/* Days outside the month stay on the white table, just quieter */
.calendar-sheet :deep(.v-outside) {
  background-color: #fff !important;
  color: var(--ink-muted);
}
.calendar-sheet :deep(.v-calendar-weekly__day),
.calendar-sheet :deep(.v-calendar-weekly__head-weekday) {
  border-color: var(--line) !important;
}
.phone-events {
  list-style: none;
  padding: 0;
  margin: 24px 0 0;
}
.phone-events a {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  text-decoration: none;
}
.phone-events-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex: none;
}
.phone-events-when {
  display: block;
  color: var(--ink-muted);
  font-size: 0.9375rem;
}
.calendar-sheet :deep(.v-event),
.calendar-sheet :deep(.v-event-timed) {
  font-size: 0.875rem;
  height: auto !important;
  padding: 2px 0;
}
.swatches {
  border: 0;
  margin: 4px 0 16px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.swatches legend {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.swatch--on {
  box-shadow: 0 0 0 3px #fff, 0 0 0 5px var(--ink);
}
</style>
