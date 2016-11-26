import Vue from 'vue'
import VueTouch from 'vue-touch'
// import VueResource from 'vue-resource'
import Quasar from 'quasar'
import Router from './router'

// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require('./themes/app.' + __THEME + '.styl')
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require('quasar/dist/quasar.' + __THEME + '.css')
// ==============================

Quasar.theme.set(__THEME)

Vue.use(VueTouch) // Touch events
// Vue.use(VueResource) // Ajax Requests
Vue.use(Quasar) // Install Quasar Framework

Quasar.start(() => {
  Router.start(Vue.extend({}), '#quasar-app')
})
