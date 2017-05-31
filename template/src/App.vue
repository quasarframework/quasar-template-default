<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
/*
 * Root component
 */
import Vue from 'vue'
import Component from 'vue-class-component'
import { Toast } from 'quasar'

@Component
export default class App extends Vue {
  mounted() {
    const isServiceWorkerSupported = 'serviceWorker' in navigator
    const isServiceWorkerInstalled = !!navigator.serviceWorker.controller
    const isOnline = navigator.onLine

    if (!isServiceWorkerSupported) {
      console.warn('Service workers are not supported in your browser')
    } else if (!isOnline && isServiceWorkerInstalled) {
      Toast.create.positive('You are offline but the app is still working in offline mode.')
    } else if (isOnline) {
      navigator.serviceWorker
        .register('./service-worker.js')
        .then((registration) => {
          registration.onupdatefound = function() {
            // updatefound is also fired the very first time the SW is installed
            if (isServiceWorkerInstalled) {
              // The updatefound event implies that registration.installing is set
              const installingWorker = registration.installing;
              installingWorker!.onstatechange = function() {
                switch (installingWorker!.state) {
                  case 'installed':
                    Toast.create.positive('New content is available, please reload.')
                    break;
                  case 'redundant':
                    throw new Error('The installing service worker became redundant.')
                }
              }
            } else {  // first install
              Toast.create.positive('Content is available offline as well!')
            }
          }
        })
        .catch((err) => { console.error('Unable to register Service Worker', err) })
    } else {
      console.log('this should not happen')
    }
  }
}
</script>

<style></style>
