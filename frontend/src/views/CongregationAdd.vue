<template>
  <div>
  <PageBand title="Add a congregation" />
  <div class="page-body page-body--narrow">

  <div class="form-page">
        <form @submit.prevent="saveCongregation">

    <v-text-field
    v-model="congregation.con_name"
    label="Congregation Name"
    ></v-text-field>

    <v-text-field
    v-model="congregation.con_addrs"
    label="Congregation Address"
    ></v-text-field>
      
       </form>
      <v-btn class="offset-sm4 mt-3" @click="saveCongregation" color="primary" variant="flat">Submit</v-btn>
      <v-btn class="mt-3" @click="cancel" variant="text">Cancel</v-btn>
     </div>
  
  </div>
  </div>
</template>

<script>
import PageBand from "../components/PageBand.vue";
import CongregationServices from "../services/CongregationServices";

export default {
  components: { PageBand },
  data() {
    return {
      congregation: {},
      congregations: []
  
    };
  },
  methods: {
    saveCongregation() {
      console.log(this.congregation)
      CongregationServices.create(this.congregation)
        .then(() => {
          this.$router.push({ name: 'home' });
          console.log(this.data)
        })
        .catch((e) => {
          console.log(e);
        });
    },
    cancel() {
      this.$router.push({ name: 'home' });
    },
  },
};
</script>

