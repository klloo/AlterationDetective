<template>
  <div>
    <div class="z_index pa_1">
      <div class="input_icon  mb_8">
        <input  type="text" placeholder="지역명, 매장이름으로 검색하세요.">
      </div>
      <div class="d_flex align_center">
        <span class="TUNE mr_8"></span>
        <div class="filter d_flex ">
          <button :class="{blue: selectedTab === 1 }" @click="selectedTab = 1">추천 수선집</button>
          <button :class="{blue: selectedTab === 2 }" @click="selectedTab = 2">교복</button>
          <button :class="{blue: selectedTab === 3 }" @click="selectedTab = 3">어깨</button>
          <button :class="{blue: selectedTab === 4 }" @click="selectedTab = 4">바지 기장</button>
          <button :class="{blue: selectedTab === 5 }" @click="selectedTab = 5">소매 기장</button>
        </div>
      </div>
    </div>
  <div class="map_wrap">
    <naver-maps :height="height" :width="width" :mapOptions="mapOptions" :initLayers="initLayers" @load="onLoad">
      <naver-marker :lat="latitude" :lng="longitude" />
    </naver-maps>
    <span class="MYPLACE" @click="setCurrentPosition"></span>
    <alteration-shop-list-swipe />
  </div>
  <!-- <ModalViewM></ModalViewM> -->
</div>
</template>

<script>
// import ModalViewM from '@/components/Layout/ModalSlideUp';
import AlterationShopListSwipe from './AlterationShopListSwipe';

export default {
  name: 'MainMap',
  components: {AlterationShopListSwipe,},
  data() {
    // 기본 위치
    const latitude = 37;
    const longitude = 127;
    return {
      selectedTab: 0,
      width: null,
      height: 300,
      map: null,
      latitude,
      longitude,
      mapOptions: {
        lat: latitude,
        lng: longitude,
        zoom: 18,
        zoomControl: false,
        mapTypeControl: false,
        mapDataControl: false,
        scaleControl: false,
      },
      initLayers: ['BACKGROUND', 'BACKGROUND_DETAIL', 'POI_KOREAN', 'TRANSIT', 'ENGLISH', 'CHINESE', 'JAPANESE'],
    };
  },
  methods: {
    /**
     * 지도가 로드되면 수행
     * map 컴포넌트 할당
     */
    onLoad(map) {
      this.map = map;
      this.setCurrentPosition();
    },
    /**
     * 현재 위치를 설정한다.
     *
     * @return  {[type]}  [return description]
     */
    setCurrentPosition() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
          // 마커 위치
          this.latitude = pos.coords.latitude;
          this.longitude = pos.coords.longitude;
          // 지도 위치
          this.map.setCenter(new naver.maps.LatLng(this.latitude, this.longitude));
        });
      }
    },
  },
};
</script>
<style scoped>
.TUNE{
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: inline-block;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.z_index{
  position: absolute;
  z-index: 999;
  width: 100%;
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
.filter{
  overflow: auto;
  white-space: nowrap;
}
.filter {
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
}
.filter::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
.filter span, .filter button{
  display: inline-block;
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


.map_wrap {
  position: relative;
    top: 0;
    left: 0;
    width: 100vw;
}
.MYPLACE {
  z-index: 999;
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  background: url('~@/assets/images/Myplace.png') no-repeat;
  background-size: contain;
  background-color: #FFFFFF;

box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
border-radius: 4px;
}
</style>
