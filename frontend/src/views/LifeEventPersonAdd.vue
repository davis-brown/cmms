<template>
  <div>
  <PageBand title="Add a life event" />
  <div class="page-body page-body--narrow">
  <div class="form-page">
        <form @submit.prevent="addLifeEventForPerson">

    <v-text-field
    v-model="lifeventperson.event_date"
    label="Life Event Date: YYYY-MM-DD"
    required
    clearable
    ></v-text-field>

    <v-text-field
    v-model="lifeventperson.event_note"
    label="Life Event Notes"
    required
    clearable
    ></v-text-field>
      
       </form>
      <v-btn class="offset-sm4 mt-3" @click="addLifeEventForPerson" color="primary" variant="flat">Submit</v-btn>
      <v-btn class="mt-3" @click="cancel" variant="text">Cancel</v-btn>
     </div>
  
  </div>
  </div>
</template>


<script>
import PageBand from "../components/PageBand.vue";
import LifeEventService from "../services/LifeEventService";
import PersonDataService from "../services/PersonDataService";
import LifeEventPersonService from "../services/LifeEventPersonService";

export default {
  components: { PageBand },
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
            this.lifeventpersons = response.data;
            console.log(this.lifeventpersons);
        })
        .catch(error => {
            this.message = (error.response && error.response.data.message) || error.message;
        });
    },

    deleteLifeEventForPerson(lifeventperson) {
      LifeEventPersonService.delete(lifeventperson.per_ID)
        .then(() => {  
          this.lifeventperson = this.lifeventperson.filter(lifeventperson => lifeventperson.lep_ID!=lifeventperson.lep_ID);
        })
        .catch(error => {
            this.message = (error.response && error.response.data.message) || error.message;
        });
    },
     getLifeEvents() {
      LifeEventService.getAll()
        .then(response => {
            this.lifeevents = response.data;
            console.log(this.lifeevents);
        })
        .catch(error => {
            this.message = (error.response && error.response.data.message) || error.message;
        });
    },
     cancel() {
      this.$router.push({ name: "lifeeventperson", params: { id: this.$route.params.id } });
    },
    // Create the life event from the form, then link it to the person in the URL
    addLifeEventForPerson() {
        const per_ID = this.$route.params.id;
        LifeEventService.create({
          event_date: this.lifeventperson.event_date,
          event_note: this.lifeventperson.event_note,
        })
          .then(response => {
            if (per_ID) {
              return LifeEventPersonService.create({ event_ID: response.data.event_ID, per_ID: per_ID });
            }
          })
          .then(() => {
            this.$router.push({ name: "lifeeventperson", params: { id: per_ID } });
          })
          .catch(error => {
              this.message = (error.response && error.response.data.message) || error.message;
          });
    },
   
    close () {
        this.dialog = false
      },

    customFilter (item, queryText) {
      const textOne = (item.frst_name || '').toLowerCase()
      const textTwo = (item.last_name || '').toLowerCase()
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

