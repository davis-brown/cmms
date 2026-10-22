<template>
 

  <v-row class="fill-height">
    
    <v-col>
      <v-sheet height="200">
        <v-card :elevation="0" class=" d-flex justify-center mt-10 mb-10 loading tile">
          <h1 class="font-weight-regular" style="font-weight:400;">Events Calendar</h1>
        </v-card>
        
        <v-toolbar
          flat
          color="white"
          
        >
        <v-btn
            
            class="mr-4"
            color="primary"
            variant="elevated"
            @click="dialog = true"
            v-if="canManageEvents"
          >
            New Event
          </v-btn> 
          <v-btn
            variant="outlined"
            class="mr-4"
            color="grey-darken-2"
            @click="setToday"
          >
            Today
          </v-btn> 
          <v-btn
            icon
            variant="text"
            size="small"
            color="grey-darken-2"
            @click="prev"
          >
            <v-icon size="small">
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            size="small"
            color="grey-darken-2"
            @click="next"
          >
            <v-icon size="small">
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            location="bottom end"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                variant="outlined"
                color="grey-darken-2"
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
      </v-sheet>


      <!--Add Event dialog-->
      <v-dialog v-model="dialog" max-width="500">
          <v-card>
              <v-container>
                <v-form ref="eventForm" @submit.prevent="addEvent">
                    <v-text-field v-model="event.event_name" type="text" label="event name (required)" :rules="requiredRule"></v-text-field>
                    <v-text-field v-model="event.event_desc" type="text" label="detail" required></v-text-field>
                    <v-text-field v-model="event.loc_ID" type="text" label="event location" required></v-text-field>
                    <v-text-field v-model="event.event_date" type="date" label="start (required)" :rules="requiredRule"></v-text-field>
                    <v-text-field v-model="event.event_start" type="time" label="start time (required)" :rules="requiredRule"></v-text-field>
                    <v-text-field v-model="event.event_end" type="time" label="end time (required)" :rules="requiredRule"></v-text-field>
                    <v-label><p style="font-size: 14px">Color (pick a color)</p></v-label>
                    <div class="container" style="margin-top:-20px; margin-bottom: 15px">
                      <v-btn icon size="x-small" color="blue" @click="event.color='#1e90ff'" style=" margin-left: -15px; margin-right:4px"></v-btn>
                      <v-btn icon size="x-small" color="red" @click="event.color='#ff0000'" style="margin-right:4px"></v-btn>
                      <v-btn icon size="x-small" color="green" @click="event.color='#008000'" style="margin-right:4px"></v-btn>
                      <v-btn icon size="x-small" color="pink" @click="event.color='#ff69b4'" style="margin-right:4px"></v-btn>
                      <v-btn icon size="x-small" color="purple" @click="event.color='#800080'" style="margin-right:4px"></v-btn>
                      <v-btn icon size="x-small" color="orange" @click="event.color='#ffa500'"></v-btn>
                    </div>
                    <hr>
                    <v-btn type="submit" color="primary" class="mr-4">Create Event</v-btn>
                </v-form>
              </v-container>
          </v-card>
      </v-dialog>
      <v-sheet height="600">
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
            color="grey-lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              theme="dark"
            >
              <v-btn v-if="canManageEvents" @click="deleteEvent()" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color= "transparent" @click="attendeeDetails(selectedEvent)">
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
                color="secondary"
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
    </v-col>
  </v-row>
</template>

<script>
import EventService from "../services/EventService";

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
  color: "#1976D2",
  loc_ID: null,
});
export default {

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

      getEventColor (event) {
        return event.color
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