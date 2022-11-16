// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import App from './App';
import router from './router';
import store from './store';
import naver from 'vue-naver-maps';
import VueGeolocation from 'vue-geolocation-api';
import './permission';


Vue.prototype.$http = axios;
Vue.prototype.$store = store;
Vue.config.productionTip = false;

Vue.use(naver, {
  clientID: 'n9dm36idtu',
  useGovAPI: false, //OpenAPI 사용
});

Vue.use(VueGeolocation);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});

