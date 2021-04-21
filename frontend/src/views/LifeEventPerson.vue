<template>
<v-main>
<v-container>
<h1>List of Life Events </h1>
	<v-btn
			to="/lifeeventpersonadd"
			class="mr-4"
			dark
			color="primary"
		>
    Add Life Event
		</v-btn>
      <v-spacer></v-spacer> 
      <v-col
        v-for="lifeventperson in lifeventpersons"
        :key="lifeventperson.lep_ID"
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
                
              <v-list-item-title><h2>{{lifeeventperson.event_note}}</h2></v-list-item-title>
              <v-list-item-subtitle>{{lifeeventperson.event_date}}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
          <v-btn
          @click="editLifeEvent(lifeeventperson)"
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
import PersonDataService from "../services/PersonDataService";
import LifeEventPersonService from "../services/LifeEventPersonService";

export default {
  data() {
    return {
      dialog: false,
      currentPerson: null,
      lifeventpersons: [],
      lifeevent: [],
      lifeventperson: {},
      
    }
  },
  
  methods: {
    getPerson(per_ID) {
      PersonDataService.get(per_ID)
        .then(response => {
          this.currentPerson = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    updatePerson() {
      PersonDataService.update(this.currentPerson.per_ID, this.currentPerson)
        .then(response => {
          console.log(response.data);
          this.message = 'The Group was updated successfully!';
          this.$router.push({ name: 'lifeeventperson' });
        })
        .catch(e => {
          console.log(e);
        });
   },

    deletePerson() {
      PersonDataService.delete(this.currentPerson.per_ID)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "lifeeventperson" });
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    getLifeEventsForPerson(per_ID)  {
      LifeEventPersonService.getLifeEventPerson(per_ID)
        .then(response => {
            this.lifeventpersons = response.data;
            console.log(this.lifeventpersons);
        })
        .catch(error => {
            this.message = error.response.data.message;
        });
    },

    deleteLifeEventForPerson(lifeventperson) {
      LifeEventPersonService.delete(lifeventperson.per_ID)
        .then(() => {  
          this.lifeventperson = this.lifeventperson.filter(lifeventperson => lifeventperson.lep_ID!=lifeventperson.lep_ID);
        })
        .catch(error => {
            this.message = error.response.data.message;
        });
    },
     getLifeEvents() {
      LifeEventService.getAll()
        .then(response => {
            this.lifeevents = response.data;
            console.log(this.lifeevents);
        })
        .catch(error => {
            this.message = error.response.data.message;
        });
    },

    addLifeEventForPerson() {
        this.dialog = false
        let lifeventperson = {};
        lifeventperson.per_ID = this.currentLifeEvent.per_ID;
        lifeventperson.lep_ID = this.lifeventperson.lep_ID;
        console.log(lifeventperson)
        LifeEventPersonService.create(lifeventperson)
          .then(() => {
                this.getLifeEventsForPerson(this.$route.params.id);
                console.log(this.lifeventpersons);
          })
          .catch(error => {
              this.message = error.response.data.message;
          });
           
    },
    close () {
        this.dialog = false
      },

    customFilter (item, queryText) {
      const textOne = item.frst_name.toLowerCase()
      const textTwo = item.last_name.toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1
    }
  },
  mounted() {
    this.message = '';
    this.getPerson(this.$route.params.id);
    this.getLifeEventsForPerson(this.$route.params.id);
    this.getLifeEvents();
  }
};
</script>

<style>
h4 {
  font-size: 25px;
  text-align: center;
}
.edit-form {
  max-width: 600px;
  max-height: 900px;
  margin: auto;
}
</style>