<template>
  <div>
    <!-- <h1>메인 페이지</h1> -->
    <div class="z_index pa_1">
      <div class="input_icon  mb_8">
        <input  type="text" placeholder="지역명, 매장이름으로 검색하세요.">
      </div>
      <div class="filter d_flex align_items_center">
        <span class="TUNE"></span>
        <button class="blue">추천 수선집</button>
        <button>교복</button>
        <button>어깨</button>
        <button>바지 기장</button>
        <!-- <button>바지 기장</button> -->
      </div>
    </div>
    <components :is="currentComponent" />
    <div>
      <ul class="tab_area">
        <li v-for="(tab, index) in tabList" :key="index" style="cursor:pointer" @click="currentComponent = tab.component">
          <img :src="tab.img" alt="menu" />
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
.z_index{
  position: absolute;
  z-index: 999;
}
.test{position:absolute;
/* bottom: 16px; */
bottom: 100px;
right: 16px;
width: 24px;
height: 24px;
background:  url('~@/assets/images/Myplace.png')no-repeat;
background-size: contain;
}
.filter span, .filter button{
margin-right: 8px;
}
.filter button:last-child{
  margin-right: 0;
}

button {
padding: 5px 12px;
border-width: 0px;
font-family: inherit;
font-size: 14px;
font-weight: normal;
text-align: center;
border-radius: 12px;
border-style: none;
cursor: pointer;
background: #FFFFFF;
box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
transition: .5s;
}
input {
  padding: 16px;
  border: 0;
  color: #333;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
.input_icon{
position: relative;
}
.input_icon:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: url('~@/assets/images/Search.png')no-repeat;
  background-size: cover;
}
input:read-only{background-color:#f0f0f0;} */
input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #ca0000;
}
input::placeholder {color: #ACB4BC; -webkit-text-fill-color:#ACB4BC; padding-left: 32px;}
input:disabled::placeholder {color: #ccc; -webkit-text-fill-color: #ccc;}
input:disabled {color: #333;-webkit-text-fill-color: #333; font-size: 1em; opacity: 1}
input:read-only:focus{ border: 1px solid #ddd; outline:none;}
input[type=text], input[type=password], input[type=email], input[type=file] {width: 100%;}


</style>
