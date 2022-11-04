<template>
  <div>
    <naver-maps :height="height" :width="width" :mapOptions="mapOptions" :initLayers="initLayers" @load="onLoad">
      <naver-marker :lat="latitude" :lng="longitude" />
    </naver-maps>
  </div>
</template>

<script>
export default {
  name: 'MainMap',
  data() {
    // 기본 위치
    const latitude = 37;
    const longitude = 127;
    return {
      width: 300,
      height: 300,
      map: null,
      latitude,
      longitude,
      mapOptions: {
        lat: latitude,
        lng: longitude,
        zoom: 13,
        zoomControl: false,
        mapTypeControl: false,
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
<style scoped></style>
