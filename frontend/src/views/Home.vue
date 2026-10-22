<template>
  
<v-main>
 <v-carousel cycle hide-delimiter-background height="500px">
      <v-carousel-item
        v-for="(item,i) in items"
        :key="i"
        :src="item.src"
        reverse-transition="fade"
        transition="fade"
      ></v-carousel-item>
  </v-carousel>
  
<v-container>
    <h1> Congregation Information</h1>
     <v-btn
			to="/congregationadd"
			v-if="isModeratorOrAdmin"
			class="mr-4"
			dark
			color="primary"
		>
    Add Congregation
		</v-btn>
        <v-divider> </v-divider>
        <v-row
        align="center">
		<v-col
            v-for="congregation in congregations"
            :key="congregation.con_ID"
            cols="12"
            align="center"
          >

  <v-card
  class="mx-auto"
  max-width="544"
    
  >
  <v-spacer></v-spacer>
  <v-card-title primary-title class="justify-center">

    <h2>{{congregation.con_name}}</h2>
    </v-card-title>
<v-spacer></v-spacer>
  <v-card-subtitle>
    <h3>
    Congregation Address
       <v-divider></v-divider>
   {{congregation.con_addrs}} 
   </h3>
</v-card-subtitle>
    
      <v-card-actions>
      <v-btn
				@click="editCongregation(congregation)"
				v-if="isModeratorOrAdmin"
				class="ma-2"
				outlined
				large
				fab
				color="blue darken-4"
				>
				<v-icon>mdi-pencil</v-icon>
				</v-btn>
        <v-spacer></v-spacer>
        </v-card-actions>
   
      </v-card>

       </v-col>
       </v-row>
 </v-container>
</v-main>
</template>

<script>
import UserService from '../services/user.service';
import CongregationServices from "../services/CongregationServices";

export default {
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
      congregations: {},
      items: [
        {
          src: require("../assets/riversidewindow.jpg")
        },
        // Placeholders until the church adds its own photos
        {
          src: require("../assets/carousel/placeholder-1.svg")
        },
        {
          src: require("../assets/carousel/placeholder-2.svg")
        },
        {
          src: require("../assets/carousel/placeholder-3.svg")
        }
      ],
      content: ''
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
        },

  mounted() {
    UserService.getPublicContent().then(
      response => {
        this.content = response.data;
      },
      error => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
      }
    );
  }
};
</script>

<style scoped>

</style>