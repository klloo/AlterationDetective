import { isEmpty } from 'lodash';
import { checkLogin } from '@/api/user';
import router from './router';
import store from './store';

const PATH_LOGIN = '/login';
const whiteList = [PATH_LOGIN]; // no redirect whitelist

router.beforeEach((to, from, next) => {
  if (!isEmpty(store.getters.userInfo)) {
    if (to.path === PATH_LOGIN) {
      next({
        path: '/',
      });
    } else {
      next();
    }
  } else if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    checkLogin().then((data) => {
      const user = data.data.user;
      if(user) {
        store.dispatch('setUserInfo', user);
        if(to.path === PATH_LOGIN) {
          next();
        }
        next();
      } else {
         next({
          path: '/login',
        });
      }
    });
  }
});
