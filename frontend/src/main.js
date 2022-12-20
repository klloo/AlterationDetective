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
import '@/assets/css/reset.css';
import '@/assets/css/common.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import VueLoading from 'vue-loading-template'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

Vue.prototype.$http = axios;
Vue.prototype.$store = store;
Vue.config.productionTip = false;

Vue.use(VueLoading);
Vue.component('VueSlider', VueSlider)

Vue.use(naver, {
  clientID: 'n9dm36idtu',
  useGovAPI: false, //OpenAPI 사용
});

Vue.use(VueGeolocation);
Vue.use(Toast, {
  transition: 'Vue-Toastification__slide',
  maxToasts: 20,
  newestOnTop: false,
  hideProgressBar: true,
  timeout: 2000,
  position: 'bottom-center',
  toastClassName: 'custom-toast-class',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});

