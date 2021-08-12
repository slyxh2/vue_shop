import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import 'element-ui/lib/theme-chalk/index.css'
// import ElementUI from 'element-ui'
//import './plugins/element.js'
import './assets/css/global.css'
import './fonts/iconfont.css'
import ZKTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import axios from 'axios'

import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  nprogress.done()
  return config
})
Vue.prototype.$http = axios

//Vue.use(ElementUI)
Vue.use(ZKTable)
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
