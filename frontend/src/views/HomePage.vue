<template>
    <v-main>
    <v-carousel cycle hide-delimiter-background height="500px">
        <v-carousel-item
            v-for="(item,i) in items"
            :key="i"
            :src="item.src"
            reverse-transition="fade"
            transition="fade"
            
        >
          <div class="display-3" style="background-color: rgba(0, 0, 0, 0.33); width:100%; height:100%;">
               <div class="heading">
                <h3 style="font-size: 3.2rem; text-align: center; font-weight:600">Riverside Community Church</h3>
                
                <p style="font-size:1.2rem; text-align: center; margin-top:-1rem">100 Main St, Springfield</p>
               </div>
                
              
         
          </div>
        
        </v-carousel-item>
    </v-carousel>

    <div class="member row" style="background-color: orange; height: 400px; width:100%; margin:0; overflow: hidden;">
        <div class="textcontainer">
             <h2 style="font-weight: 900">Members</h2>
            <p>Find out more about the members of the riverside church</p>
            <v-btn large outlined dark @click="$router.push('person')">Members</v-btn>
        </div>
        <div class="imagecontainer">
            <img src="../assets/members.jpg">
        </div>
        
    </div>
       
     <div class="group row" style="background-color: turquoise; height: 400px; width:100%; margin:0;">
        <div class="imagecontainer">
            <img src="../assets/group.jpg">
        </div>
        
        <div class="textcontainer">
             <h2 style="font-weight: 900">Groups</h2>
             <br>
            <p>Register and discover the different groups at riverside church</p>
            <v-btn large outlined dark @click="$router.push('group')">Groups</v-btn>
        </div>
    </div>

    <div class="families row" style="background-color:#F4A460; height: 400px; width:100%; margin:0; overflow: hidden;">
        <div class="textcontainer">
             <h2 style="font-weight: 900">Families</h2>
            <p>View and edit your family information and view the families in Riverside Community Church</p>
            <v-btn large outlined dark @click="$router.push('families')">Families</v-btn>
        </div>
        <div class="imagecontainer">
            <img src="../assets/big-family.jpg">
        </div>
        
    </div>
       
     <div class="event row" style="background-color:#87CEFA; height: 400px; width:100%; margin:0; overflow: hidden;">
        <div class="imagecontainer">
            <img src="../assets/calendarpicture.jpg">
        </div>
        
        <div class="textcontainer">
             <h2 style="font-weight: 900">Event Calendar</h2>
             <br>
            <p>Find out and keep up to date with the upcoming events at Riverside Community Church</p>
            <v-btn large outlined dark @click="$router.push('calendar')">Events</v-btn>
        </div>
    </div>

    <footer class="footer">
      <h3>Riverside Community Church</h3>
      <h8>100 Main St, Springfield</h8>
      <p>555-555-0100</p>
      <p>Copyright &copy;2021</p>

    </footer>

    </v-main>
</template>

<script>
import CongregationServices from "../services/CongregationServices";
export default {
    name: 'Home',
  data() {
    return {
      congregations: {},
      items: [
        {
          src: require("../assets/riversidewindow.jpg")
        },
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
  }
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}


 .textcontainer {
     width: 60%;
     height: 100%;
     padding: 5rem;
     padding-bottom: 0;
     
 }

 .textcontainer h2 {
   font-size: 60px;
   color: 	#F5F5F5;
 }

 .textcontainer p {
   font-size: x-large;
   color: azure;
 }

 .imagecontainer {
     width: 40%;
     overflow: hidden;
 }

 .imagecontainer img {
     width: 100%;
     height: auto;
     float: right;
     
 }

 .heading {
   padding-top:18%;
 }

 .footer {
   height: 200px;
   text-align: center;
   width: 100%;
   background-color:grey;
   color: white;
   padding: 40px;
 }
</style>