<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import * as APP_INFO from '../package.json'

/*
 * Root component
 */
export default {
  mounted () {
    document.title = APP_INFO.productName || 'Quasar App'
  }
}
</script>

<style></style>
