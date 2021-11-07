import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import VueRouter from 'vue-router'
import ListesDesRestaurants from './components/ListesDesRestaurants.vue'
import Restaurant from './components/Restaurant.vue'
import * as VueGeolocation from 'vue-browser-geolocation'
import * as VueGoogleMaps from 'vue2-google-maps'
 
Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(VueRouter)
Vue.use(VueGeolocation)
Vue.use(VueGoogleMaps,  {
  load: {
    key: 'AIzaSyBmY-q_JK1ngq_NF3xxi1z_C6YbEMxO8Gg',
  },
  installCompenents: false
})

//on définit des routes
const router= new VueRouter({
  routes:[
    {
      path:'/',
      component: ListesDesRestaurants
    },
    
    {
      path:'/restaurant/:id',
      component: Restaurant
    },
  ], 
  mode: 'history'
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
