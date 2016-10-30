<template>
  <!-- Don't drop "quasar-app" class -->
  <div id="quasar-app">
    <router-view></router-view>
  </div>
</template>

<script>
/*
 * Root component
 */

// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require('./themes/app.' + __THEME + '.styl')
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require('quasar/dist/quasar.' + __THEME + '.css')
// ==============================

export default {}
</script>

<style>
</style>
