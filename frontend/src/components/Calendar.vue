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
                    <v-text-field v-model="event.event_name" type="text" label="event name (required)"></v-text-field>
                    <v-text-field v-model="event.event_desc" type="text" label="detail"></v-text-field>
                    <v-text-field v-model="event.event_date" type="date" label="start (required)"></v-text-field>
                    <v-text-field v-model="event.event_start" type="time" label="start time (required)"></v-text-field>
                    <v-text-field v-model="event.event_end" type="time" label="end time (required)"></v-text-field>
                    <v-text-field v-model="event.event_color" type="color" label="color (click to open color menu)"></v-text-field>
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
              :color="selectedEvent.event_color"
              dark
            >
              <v-btn @click="deleteEvent(selectedEvent.evt_id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.event_name"></v-toolbar-title>
              <v-spacer></v-spacer>
              
            </v-toolbar>
            <v-card-text>
              <form v-if="currentlyEditing != selectedEvent.evt_id">
                  {{selectedEvent.event_desc}}
              </form>
              <form v-else>
                  <textarea-autosize
                      v-model="selectedEvent.event_desc"
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
                v-if="currentlyEditing != selectedEvent.evt_id"
                @click.prevent="editEvent(selectedEvent)"
              >
                Edit 
              </v-btn>
              <v-btn
                text
                v-else
                @click.prevent="updateEvent(selectedEvent)"
              >
                Save
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
    
    data: () => ({

       
          event: {
            evt_ID: null,
            event_name: null,
            event_desc: null,
            event_date: null,
            event_end: null,
            event_start: null,
            event_color: "#1976D2",
            loc_id: null
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
      
      EventService.getEvents()

            .then(response => {
                this.events = response.data;
                const events = []
                for ( var i=0; i<this.events.length; i++) {
                  this.events[i].event_date = this.events[i].event_date.substr(0,10);
                  this.events[i].event_start = this.events[i].event_date + ' '+ this.events[i].event_start;
                  this.events[i].event_end = this.events[i].event_date + ' '+ this.events[i].event_end;
                 events.push({
                   name: this.events[i].event_name,
                   start: this.events[i].event_start,
                   end: this.events[i].event_end,
                   color: this.events[i].event_color,
                   
                 })
                 
                 console.log('names: '+ this.events.name);
                }
                this.events = events;
                console.log(this.events);
                console.log('names: '+name);
                
            })
            .catch(error => {
                this.message = error.response.data.message;
            });
    },

    
    methods: {


      /*
        async getEvents () {
            let snapshot = await db.collection('calEvent').get();
            let events = [];
            snapshot.forEach(doc => {
                let appData = doc.data();
                appData.id = doc.id;
                //start
                let datelength = appData.start.length;
                var changemonth = appData.start.substr(datelength-5);
                var changeyear = appData.start.substr(0,4);
                var newdate = changeyear + "-" + changemonth;
                //end
                let datelengthE = appData.start.length;
                var changemonthE = appData.start.substr(datelengthE-5);
                var changeyearE = appData.start.substr(0,4);
                var newdateE = changeyearE + "-" + changemonthE;
                appData.start = newdate;
                appData.end = newdateE;
                events.push(appData);

            });
            this.events =events;


            console.log(events);
        },

        */

        // async addEvent() {
        //     if(this.name && this.start && this.end) {
        //         await db.collection('calEvent').add({
        //             name: this.name,
        //             details: this.details,
        //             start: this.start,
        //             end: this.end,
        //             starttime: this.starttime,
        //             endtime: this.endttime,
        //             color: this.color
        //         });
        //         this.getEvents();
        //         this.name = "";
        //         this.details = "";
        //         this.start = "";
        //         this.end = "";
        //         this.color = "";
        //         this.starttime = "",
        //         this.endtime = ""
        //     }
        //     else {
        //         alert('Name, start and end date are required')
        //     }
        // },

      addEvent() {
        console.log(this.event)
        EventService.create(this.event)
          .then(() => {
            console.log(this.data)
          })
          .catch((e) => {
            console.log(e);
          });
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

      updateEvent() {
      EventService.update(this.selectedEvent.evt_ID, this.selectedEvent)
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
      },

      //MySQL 
      deleteEvent() {
        EventService.delete(this.currentEvent.event_ID)
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
      },
    
        
/*
        async deleteEvent(ev) {
            await db
            .collection('calEvent')
            .doc(ev)
            .delete();

            this.selectedOpen = false;
            this.getEvents();
        },
      

      */

       
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
          this.currentlyEditing = event.evt_ID;
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
      }

    }


}
</script>