<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view></router-view>
  </div>
</template>

<script lang='ts'>
import * as Vue from 'vue'
import Component from 'vue-class-component'

/*
 * Root component, but defined as a typescript decorated class
 */
@Component({
})
export default class App extends Vue {
}
</script>

<style></style>
