<!--<template>
<div id="app">
  <v-app id="inspire">
    <v-carousel v-model="model">
      <v-carousel-item
        v-for="(color, i) in colors"
        :key="color"
      >
        <v-sheet
          :color="color"
          height="100%"
          tile
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <div class="display-3">
              Slide {{ i + 1 }}
            </div>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </v-app>
</div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    setup() {
        
    },
})

new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    model: 0,
    colors: [
      'primary',
      'secondary',
      'yellow darken-2',
      'red',
      'orange',
    ],
  }),
})
</script>
-->