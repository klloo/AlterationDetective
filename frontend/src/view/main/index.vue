<template>
  <div>
    <!-- <h1>메인 페이지</h1> -->
    <components :is="currentComponent" />
    <div>
      <ul class="tab_area">
        <li v-for="(tab, index) in tabList"
        :key="index" style="cursor:pointer"
        @click="currentComponent = tab.component"
        :class="{active: currentComponent === tab.component}"
        >
          <div class="tab_item">
            <img :src="tab.img2" alt="menu" v-if="currentComponent === tab.component"/>
            <img :src="tab.img" alt="menu" v-else />
          </div>
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
    menuClickChange: 'gray',
  },
  data() {
    return {
      currentComponent: MainMapView,
      tabList: [
        {
          name: 'mainMap',
          img: require('@/assets/images/TAB_HOME_GRAY.png'),
          img2: require('@/assets/images/TAB_HOME_BLUE.png'),
          component: MainMapView,
        },
        {
          name: 'alterationShop',
          img: require('@/assets/images/REPAIR_GRAY.png'),
          img2: require('@/assets/images/REPAIR_BLUE.png'),
          component: AlterationShopView,
        },
        {
          name: 'favorite',
          img: require('@/assets/images/FAVORITE_GRAY.png'),
          img2: require('@/assets/images/FAVORITE_BLUE.png'),
          component: FavoriteView,
        },
        {
          name: 'myPage',
          img: require('@/assets/images/USER_PRO_GRAY.png'),
          img2: require('@/assets/images/USER_PRO_BlUE.png'),
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
  method: {
    changeImg() {
    },
  },
};
</script>

<style scoped>
.active {
  border-bottom: 2px solid #8AB2FF;
  transition: all .5s;
}</style>
