import Vue from 'vue';
import VueRouter from 'vue-router';
import Hello from './components/Hello.vue';
import Error404 from './components/Error404.vue';

Vue.use(VueRouter);

export const AppRouter = new VueRouter({
  mode: 'hash',
  scrollBehavior: function (to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
  routes: [
    { path: '/', component: Hello }, // Default
    { path: '*', component: Error404 } // Not found
  ]
});

export default AppRouter;