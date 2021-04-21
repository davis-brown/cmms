<template>

  <div class="submit-form mt-3 mx-auto">
    <H1>Add Life Event </H1>
    <form @submit.prevent="addLifeEventForPerson">

    <v-text-field
    v-model="lifeventperson.event_date"
    label="Life Event Date: YYYY-DD-MM"
    required
    clearable
    ></v-text-field>


    <v-text-field
    v-model="lifeventperson.event_note"
    label="Life Event Notes"
    :rules="rules"
    hide-details="auto"

    required
    clearable
    ></v-text-field>
      
       </form>
      <v-btn color="primary" class="offset-sm4 mt-3" @click="addLifeEventForPerson">Submit</v-btn>
      <v-btn color="primary" class="mt-3" @click="cancel">Cancel</v-btn>
     </div>
  
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
          this.$router.push({ name: 'groupdisplay' });
        })
        .catch(e => {
          console.log(e);
        });
   },

    deletePerson() {
      PersonDataService.delete(this.currentPerson.per_ID)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "groupdisplay" });
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    getLifeEventsForPerson(per_ID)  {
      LifeEventPersonService.getLifeEventPerson(per_ID)
        .then(response => {
            this.groupMembers = response.data;
            console.log(this.groupMembers);
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