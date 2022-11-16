import Vue from 'vue';
import Router from 'vue-router';

import Main from '@/view/main';
import Login from '@/view/login';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
});
