import Vue from "vue";
import axios from "axios";
import App from "./App";
import router from "./router";
import store from "./store";
import "../common/serialport";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "../style/global.css";
import "../style/iconfont.css";
import comNedb from "../database/comNedb";

Vue.use(ElementUI);

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
comNedb.find({ type: "filePath" }).then(res => {
  if (res.length !== 0) {
    window.pathName = res[0].pathName;
  }
});
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>"
}).$mount("#app");
