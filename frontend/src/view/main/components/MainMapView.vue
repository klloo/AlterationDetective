<template>
  <div class="map_wrap">
    <naver-maps :height="height" :width="width" :mapOptions="mapOptions" :initLayers="initLayers" @load="onLoad">
      <naver-marker :lat="latitude" :lng="longitude" />
    </naver-maps>
    <button class="test" @click="setCurrentPosition"></button>
    <alteration-shop-list-swipe />
  </div>
</template>

<script>
import AlterationShopListSwipe from './AlterationShopListSwipe';

export default {
  name: 'MainMap',
  components: {
    AlterationShopListSwipe,
  },
  data() {
    // 기본 위치
    const latitude = 37;
    const longitude = 127;
    return {
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
<style>
body {
  margin: 0;
}
.map_wrap {
  position: relative;
}
.test {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  background: url('~@/assets/images/Myplace.png') no-repeat;
  background-size: contain;
}
button {
  padding: 0px;
  border-width: 0px;
  font-family: inherit;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  border-radius: 10px;
  border-style: none;
  cursor: pointer;
  transition: 0.5s;
}
</style>
