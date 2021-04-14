<template>
<v-main>
<v-container>
<h1>List of Life Events </h1>
	<v-btn
			to="/lifeeventadd"
			class="mr-4"
			dark
			color="primary"
		>
    Add Life Event
		</v-btn>
      <v-spacer></v-spacer> 
    <v-col
      v-for="lifeevent in lifeevents"
      :key="lifeevent.event_ID"
  
    >
    <v-timeline>

    <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="dark"
          dark
          v-bind="attrs"
          v-on="on"
        >
          {{lifeevent.event_date}}
        </v-btn>
        </template>
        <v-timeline-item>
        <v-card >
          <v-list>
          <v-list-item>
            <v-list-item-content>
                
              <v-list-item-title><h2>{{lifeevent.event_note}}</h2></v-list-item-title>
              <v-list-item-subtitle>{{lifeevent.event_date}}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
          <v-btn
          @click="editLifeEvent(lifeevent)"
          small
          right
        >
        Edit
   
        </v-btn>
              </v-list-item-action>

          </v-list-item>
              </v-list>
    

          </v-card>
        </v-timeline-item>
          </v-timeline>

 </v-col>
</v-container>
</v-main>
</template>

<script>
import LifeEventService from "../services/LifeEventService";
export default {
  data() {
    return {
      lifeevents: [],
    };
  },
  created() {
    LifeEventService.getAll()
      .then((response) => {
        this.lifeevents = response.data;
        console.log(this.lifeevents);
      })
      .catch((error) => {
        this.message = error.response.data.message;
      });
  },
  methods: {
    editLifeEvent(lifeevent) {
      this.$router.push({
        name: "lifeeventedit",
        params: { id: lifeevent.event_ID },
      });
    },
  },
};
</script>


<style>

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
  
}
</style>