<template>
  <div>
    <components :is="currentTab.component" ref="currentView" @change-tab="changeTab" :param="currentTab.param" />
    <div>
      <ul class="tab_area">
        <li
          v-for="(tab, index) in tabList"
          :key="index"
          style="cursor:pointer"
          @click="changeTab(tab.name, {})"
          :class="{ active: currentTab.name === tab.name }"
        >
          <div class="tab_item">
            <img :src="tab.img2" alt="menu" v-if="currentTab.name === tab.name" />
            <img :src="tab.img" alt="menu" v-else />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import MainMapView from './main-map';
import AlterationShopView from './alteration-shop';
import FavoriteView from './favorite';
import MyPageView from './my-page';

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
      currentTab: {},
      tabList: [
        {
          name: 'mainMap',
          img: require('@/assets/images/TAB_HOME_GRAY.png'),
          img2: require('@/assets/images/TAB_HOME_BLUE.png'),
          component: MainMapView,
          param: {},
        },
        {
          name: 'alterationShop',
          img: require('@/assets/images/REPAIR_GRAY.png'),
          img2: require('@/assets/images/REPAIR_BLUE.png'),
          component: AlterationShopView,
          param: {},
        },
        {
          name: 'favorite',
          img: require('@/assets/images/FAVORITE_GRAY.png'),
          img2: require('@/assets/images/FAVORITE_BLUE.png'),
          component: FavoriteView,
          param: {},
        },
        {
          name: 'myPage',
          img: require('@/assets/images/USER_PRO_GRAY.png'),
          img2: require('@/assets/images/USER_PRO_BlUE.png'),
          component: MyPageView,
          param: {},
        },
      ],
    };
  },
  computed: {
    loginUser() {
      return this.$store.getters.userInfo;
    },
  },
  watch: {
    currentTab() {
      this.$nextTick(() => {
        if (this.$refs.currentView.loadData) {
          this.$refs.currentView.loadData();
        }
      });
    },
  },
  mounted() {
    this.currentTab = this.tabList[0];
  },
  methods: {
    changeTab(tabname, param) {
      const tab = this.tabList.find((t) => t.name === tabname);
      tab.param = param;
      this.currentTab = tab;
    },
  },
};
</script>

<style scoped>
.active {
  border-bottom: 2px solid #8ab2ff;
}
.tab_area {
  z-index: 999;
}
</style>
