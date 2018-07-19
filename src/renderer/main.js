import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import '../common/serialport'

import {
  Button,
  Select,
  Option,
  Message,
  Row,
  Col
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import '../style/global.css';
import '../style/iconfont.css';

Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(Row);
Vue.use(Col);
Vue.prototype.$message = Message;

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
