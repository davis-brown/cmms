<template>
  <div>
    <PageBand title="Congregation Information">
      <v-btn
        to="/congregationadd"
        v-if="isModeratorOrAdmin"
        color="primary"
        prepend-icon="mdi-plus"
      >
        Add Congregation
      </v-btn>
    </PageBand>
    <div class="page-body">
      <v-row>
        <v-col
          v-for="congregation in congregations"
          :key="congregation.con_ID"
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-title class="pt-5 px-5"><h2>{{ congregation.con_name }}</h2></v-card-title>
            <v-card-text class="px-5 text-body-1">
              <v-icon icon="mdi-map-marker" color="primary" class="mr-1" />{{ congregation.con_addrs }}
            </v-card-text>
            <v-card-actions v-if="isModeratorOrAdmin" class="px-4 pb-4">
              <v-btn
                @click="editCongregation(congregation)"
                variant="tonal"
                color="primary"
                prepend-icon="mdi-pencil"
              >
                Edit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import PageBand from "../components/PageBand.vue";
import CongregationServices from "../services/CongregationServices";

export default {
  components: { PageBand },
  name: 'Home',
  computed: {
    isModeratorOrAdmin() {
      const user = this.$store.state.auth.user;
      return !!(user && user.roles) &&
        (user.roles.includes('ROLE_MODERATOR') || user.roles.includes('ROLE_ADMIN'));
    }
  },
  data() {
    return {
      congregations: [],
    };
  },
  created() {
            CongregationServices.getAll()
               .then(response => {
                    this.congregations = response.data;
                    console.log(this.congregations);
                })
                .catch(error => {
                    this.message = (error.response && error.response.data.message) || error.message;
                });
            },
       methods: {
         editCongregation(congregation){
            this.$router.push({ name: 'congregationedit', params: { id: congregation.con_ID } });


            }
        }
};
</script>

<style scoped>

</style>