<template>
  <div>
    <h1>메인 페이지</h1>
    <components :is="currentComponent" />
    <div>
      <ul>
        <li v-for="(tab, index) in tabList" :key="index" style="cursor:pointer" @click="currentComponent = tab.component">
          {{ tab.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import MainMapView from './components/MainMapView';
import AlterationShopView from './components/AlterationShopView';
import FavoriteView from './components/FavoriteView.vue';
import MyPageView from './components/MyPageView.vue';

export default {
  name: 'MainView',
  components: {
    MainMapView,
    AlterationShopView,
    FavoriteView,
    MyPageView,
  },
  data() {
    return {
      currentComponent: MainMapView,
      tabList: [
        {
          name: 'mainMap',
          label: '메인',
          component: MainMapView,
        },
        {
          name: 'alterationShop',
          label: '수선집',
          component: AlterationShopView,
        },
        {
          name: 'favorite',
          label: '좋아요',
          component: FavoriteView,
        },
        {
          name: 'myPage',
          label: '마이페이지',
          component: MyPageView,
        },
      ],
    };
  },
  computed: {
    loginUser() {
      return this.$store.getters.userInfo;
    },
  },
};
</script>

<style lang="css"></style>
