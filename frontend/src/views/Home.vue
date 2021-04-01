<template>
  <v-app id="inspire">
    <v-carousel height="350px">
      <v-carousel-item
        v-for="(item,i) in items"
        :key="i"
        :src="item.src"
        reverse-transition="fade"
        transition="fade"
      ></v-carousel-item>
    </v-carousel>
  
  <v-main>
<v-container>
    <h1> Congregation Information</h1>
     <v-btn
			to="/congregationadd"
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
</v-app>
</template>

<script>
import UserService from '../services/user.service';
import CongregationServices from "../services/CongregationServices";

export default {
  name: 'Home',
  data() {
    return {
      congregations: {},
      items: [
        {
           src: 'https://christianchronicle.org/wp-content/uploads/2017/09/mrcc_01.jpg'
        },
        {
          src: 'https://c4s6k6b6.rocketcdn.me/wp-content/uploads/2020/06/cross-at-sunset-50x30-1-667x400.jpg.webp'
        },
        {
           src: 'https://christianchronicle.org/wp-content/uploads/2019/03/p21_ATFbeller_0419-1024x768.jpg'
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
                    this.message = error.response.data.message;
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