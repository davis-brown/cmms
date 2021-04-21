<template>
 

  <v-row class="fill-height">
    
    <v-col>
      <v-sheet height="200">
        <v-card :elevation="0" class=" d-flex justify-center mt-10 mb-10 loading tile">
          <h1 class="font-weight-regular" style="font-weight:400;">Events Calendar</h1>
        </v-card>
        
        <v-toolbar
          flat
          
        >
        <v-btn
            
            class="mr-4"
            color="primary"
            @click="dialog = true"
            dark
            v-if="showModeratorBoard || showAdminBoard"
          >
            New Event
          </v-btn> 
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn> 
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
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
                <v-form @submit.prevent="addEvent">
                    <v-text-field v-model="event.event_name" type="text" label="event name (required)" required></v-text-field>
                    <v-text-field v-model="event.event_desc" type="text" label="detail" required></v-text-field>
                    <v-text-field v-model="event.loc_ID" type="text" label="event location" required></v-text-field>
                    <v-text-field v-model="event.event_date" type="date" label="start (required)" required></v-text-field>
                    <v-text-field v-model="event.event_start" type="time" label="start time (required)" required></v-text-field>
                    <v-text-field v-model="event.event_end" type="time" label="end time (required)" required></v-text-field>
                    <v-label><p style="font-size: 14px">Color (pick a color)</p></v-label>
                    <div class="container v-row" style="margin-top:-20px; margin-bottom: 15px">
                      <v-btn fab x-small color="blue" @click="event.color='#1e90ff'" style=" margin-left: -15px; margin-right:4px"></v-btn>
                      <v-btn fab x-small color="red" @click="event.color='#ff0000'" style="margin-right:4px"></v-btn>
                      <v-btn fab x-small color="green" @click="event.color='#008000'" style="margin-right:4px"></v-btn>
                      <v-btn fab x-small color="pink" @click="event.color='#ff69b4'" style="margin-right:4px"></v-btn>
                      <v-btn fab x-small color="purple" @click="event.color='#800080'" style="margin-right:4px"></v-btn>
                      <v-btn fab x-small color="orange" @click="event.color='#ffa500'"></v-btn>
                    </div>
                    <hr>
                    <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog=false">Create Event</v-btn>
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
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn v-if="showAdminBoard" @click="deleteEvent(selectedEvent.id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              
            </v-toolbar>
            <v-card-text>
              <form v-if="currentlyEditing !== selectedEvent.id">
                  {{selectedEvent.details}}
              </form>
              <form v-else>
                  <textarea-autosize
                      v-model="selectedEvent.details"
                      type="text"
                      style="width: 100%"
                      :min-height="100"
                      placeholder="add note"
                  ></textarea-autosize>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Close
              </v-btn>

              <v-btn
                text
                v-if="(currentlyEditing != selectedEvent.id) && showAdminBoard"
                @click.prevent="editEvent(selectedEvent)"
              >
                Edit 
              </v-btn>
              <v-btn
                text
                
                v-else-if="showAdminBoard"
                @click.prevent="updateEvent(selectedEvent)"
              >
                Save
              </v-btn>
              <v-btn
              text
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
    }
  },
    
    data: () => ({

       
          event: {
            evt_ID: null,
            event_name: null,
            event_desc: null,
            event_date: null,
            event_end: null,
            event_start: null,
            color: "#1976D2",
            loc_id: null,
          },
        
        today: new Date().toISOString(),
        focus: new Date().toISOString(),
      
        
        type: "month",
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

                   events.push(event);  
                
                }
                this.events = events;
                console.log(events);
            })
            .catch(error => {
              console.log(error);
                this.message = error.response.data.message;
            });
      },

      addEvent() {
        console.log(this.event)
        EventService.create(this.event)
          .then(() => {
            console.log(this.data)
          })
          .catch((e) => {
            console.log(e);
          });
        this.selectedOpen = false;
        this.getEvents();
        console.log("done");
      },

        // async updateEvent(ev) {
        //     await db
        //     .collection('calEvent')
        //     .doc(this.currentlyEditing)
        //     .update({
        //         details:ev.details
        //     })
        //     this.selectedOpen = false;
        //     this.currentlyEditing = null;
        // },

      updateEvent(calendarevent) {
        this.event = {};
        event.event_name = calendarevent.name;
        event.event_desc = calendarevent.details;
        event.event_date = calendarevent.start.substr(0,10);
        event.event_start = calendarevent.start.substr(10,14);
        event.event_end = calendarevent.end.substr(10,14);
        event.loc_ID = calendarevent.location;

        console.log(event.event_start);

      EventService.update(this.currentlyEditing, event)
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
        this.selectedOpen = false;
        this.currentlyEditing = null;
        
      },

      //MySQL 
      deleteEvent() {
        EventService.delete(this.selectedEvent.id)
        
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });

        this.selectedOpen = false;
        this.getEvents();
      },

      moreEvent(currentevent) {
        this.event = {};
        event.evt_ID = currentevent.id;
        this.$router.push({ name: 'eventdetails', params: { id: event.evt_ID } });
      
        },
       
      viewDay ({ date }) {
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

      showEvent ({ nativeEvent, event }) {
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

      updateRange ({ event_start, event_end }) {
        this.event_start = event_start
        this.event_end = event_end
      },

      nth (d) {
          return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th','th', 'th'][d % 10]
      }, 

      reloadPage() {
        window.location.reload()
      }

    }


}
</script>