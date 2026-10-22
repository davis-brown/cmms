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
                <h3 class="heading-title">Riverside Community Church</h3>
                
                <p class="heading-address">100 Main St, Springfield</p>
               </div>
                
              
         
          </div>
        
        </v-carousel-item>
    </v-carousel>

    <div class="member row section" style="background-color: orange; width:100%; margin:0;">
        <div class="textcontainer">
             <h2 style="font-weight: 900">Members</h2>
            <p>Find out more about the members of the riverside church</p>
            <v-btn large outlined dark @click="$router.push('person')">Members</v-btn>
        </div>
        <div class="imagecontainer">
            <img src="../assets/members.jpg">
        </div>
        
    </div>
       
     <div class="group row section" style="background-color: turquoise; width:100%; margin:0;">
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

    <div class="families row section" style="background-color:#F4A460; width:100%; margin:0;">
        <div class="textcontainer">
             <h2 style="font-weight: 900">Families</h2>
            <p>View and edit your family information and view the families in Riverside Community Church</p>
            <v-btn large outlined dark @click="$router.push('families')">Families</v-btn>
        </div>
        <div class="imagecontainer">
            <img src="../assets/big-family.jpg">
        </div>
        
    </div>
       
     <div class="event row section" style="background-color:#87CEFA; width:100%; margin:0;">
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
      <h6>100 Main St, Springfield</h6>
      <p>555-555-0100</p>
      <p>Copyright &copy;{{ year }}</p>

    </footer>

    </v-main>
</template>

<script>
export default {
    name: 'Home',
  data() {
    return {
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
      content: '',
      year: new Date().getFullYear()
    };
  },

  }
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    overflow: hidden;
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

 .heading-title {
   font-size: 3.2rem;
   text-align: center;
   font-weight: 600;
 }

 .heading-address {
   font-size: 1.2rem;
   text-align: center;
   margin-top: -1rem;
 }

 .section {
   min-height: 400px;
 }

 /* Phones: stack text above the picture instead of squeezing them side by side */
 @media (max-width: 767px) {
   .section {
     flex-direction: column;
   }
   .textcontainer,
   .imagecontainer {
     width: 100%;
   }
   .textcontainer {
     padding: 2rem;
   }
   .textcontainer h2 {
     font-size: 40px;
   }
   /* Text before its picture in every section, so pictures don't pair up */
   .textcontainer {
     order: -1;
   }
   .heading {
     padding: 30% 1rem 0;
   }
   .heading-title {
     font-size: 2rem;
   }
   .heading-address {
     font-size: 1rem;
     margin-top: 0;
   }
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
