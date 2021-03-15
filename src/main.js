import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Axios from 'axios'

// Bootstrap & Custom SCSS
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import './scss/style.scss'

// Plugin Dialog & Loading 
import Dialog from 'vue-dialog-loading'
Vue.use(Dialog, { dialogBtnColor: '#fd2d01' })

// Plugin V-Scroll-Lock
import VScrollLock from 'v-scroll-lock'
Vue.use(VScrollLock)

// Plugin V-scroll-to
import vueSmoothScroll from 'vue2-smooth-scroll'
Vue.use(vueSmoothScroll)

// Axios pour la connection à l'API
Vue.prototype.$http = Axios 

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')