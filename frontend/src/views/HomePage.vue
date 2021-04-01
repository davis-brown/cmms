<template>
<div id="app">
  <v-app id="inspire">
    <v-carousel>
      <v-carousel-item
        v-for="(item,i) in items"
        :key="i"
        :src="item.src"
        reverse-transition="fade"
        transition="fade"
      ></v-carousel-item>
    </v-carousel>
  </v-app>
</div>
</template>
<script>
export default {
  name: "app",
  data () {
    return {
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
      ]
    }
  }
}
</script>
<style scoped>


</style>
