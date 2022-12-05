<template>
  <div>
    <alteraion-shop-detail-popup v-if="showDetailPopup" :shop-info="selectedShop" @back="showDetailPopup = false" />
    <div v-else>
      <div class="search_box pa_1">
        <div class="input_box">
          <input type="text" placeholder="지역명, 매장이름으로 검색하세요." />
        </div>
        <div class="d_flex align_center">
          <span class="TUNE"></span>
          <div class="filter py_1">
            <!-- 필터 버튼 리스트 형식으로 변환하여 반복문으로 버튼 작성 (추후 확장 고려) -->
            <button v-for="(btn, index) in buttonList" :key="index" :class="buttonClass(index)" @click="selectedTab = index">{{ btn }}</button>
          </div>
        </div>
      </div>
      <vue-loading class="spinner" v-show="isLoading" type="spin" color="black"></vue-loading>
      <div class="map_wrap">
        <naver-maps :height="height" :width="width" :mapOptions="mapOptions" :initLayers="initLayers" @load="onLoad">
          <naver-marker :lat="latitude" :lng="longitude" />
          <naver-marker
            v-for="(item, index) in altreationShopList"
            :key="index"
            :lat="item.latitude"
            :lng="item.longitude"
            @click="markerClick(item)"
          ></naver-marker>
        </naver-maps>
        <span class="MYPLACE" @click="setCurrentPosition"></span>
        <!-- <alteration-shop-list-swipe /> -->
      </div>
      <!-- <ModalViewM></ModalViewM> -->
    </div>
  </div>
</template>

<script>
// import ModalViewM from '@/components/Layout/ModalSlideUp';
import AlterationShopListSwipe from './AlterationShopListSwipe';
import { getAlterationShopList } from '@/api/alteration-shop';
import AlteraionShopDetailPopup from './popup/AlteraionShopDetailPopup';

export default {
  name: 'MainMap',
  components: {
    AlterationShopListSwipe,
    AlteraionShopDetailPopup,
  },
  data() {
    // 기본 위치 (강남역)
    const latitude = 37.493168;
    const longitude = 127.030014;
    return {
      // 지도 관련 필드
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
      // 상단 버튼 관련 필드
      selectedTab: 0,
      buttonList: ['추천 수선집', '교복', '어깨', '바지', '바지 기장', '소매 기장'],
      // 수선집 목록
      altreationShopList: [],
      // 현재 클릭한 수선집 정보
      selectedShop: {},
      // 상세 팝업 오픈 여부
      showDetailPopup: false,
      // 로딩 중 여부
      isLoading: false,
    };
  },
  methods: {
    /**
     * 지도가 로드되면 수행
     * map 컴포넌트 할당
     */
    onLoad(map) {
      this.map = map;
      // 수선집 목록 조회
      getAlterationShopList()
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.altreationShopList = result.data;
          }
        })
        .catch((err) => {
          throw new Error(err);
        })
        .finally(() => {
          this.setCurrentPosition();
        });
    },
    /**
     * 현재 위치를 설정한다.
     *
     * @return  {[type]}  [return description]
     */
    setCurrentPosition() {
      this.isLoading = true;
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
          // 마커 위치
          this.latitude = pos.coords.latitude;
          this.longitude = pos.coords.longitude;
          // 지도 위치
          this.map.setCenter(new naver.maps.LatLng(this.latitude, this.longitude));
          this.isLoading = false;
        });
      }
    },
    /**
     * 버튼 클래스 반환
     */
    buttonClass(idx) {
      return this.selectedTab === idx ? 'blue' : '';
    },
    /**
     * 마커 클릭 이벤트 핸들러
     */
    markerClick(item) {
      this.selectedShop = item;
      this.showDetailPopup = true;
    },
  },
};
</script>
<style scoped>
.main .search_box {
  position: absolute;
  z-index: 999;
  width: 100%;
  padding: 1em;
}
.main .input_box {
  position: relative;
}
.main .input_box:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: url('~@/assets/images/Search.png') no-repeat;
  background-size: cover;
}
.main .input_box input {
  padding-left: 48px;
  box-shadow: 0px 0px 8px rgb(0 0 0 / 20%);
}
.main .TUNE {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: inline-block;
  margin-right: 8px;
}
.main .filter {
  overflow: auto;
  white-space: nowrap;
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
  display: flex;
}
.main .filter::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
.main .filter span,
.filter button {
  display: inline-block;
  margin-right: 8px;
}
.main .filter button:last-child {
  margin-right: 0;
}
.main button {
  padding: 5px 12px;
  border-width: 0px;
  font-family: inherit;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  border-radius: 12px;
  border-style: none;
  cursor: pointer;
  background: #ffffff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  transition: 0.5s;
}
.map_wrap {
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
}
.main .MYPLACE {
  z-index: 999;
  position: absolute;
  bottom: 8px;
  right: 16px;
  width: 24px;
  height: 24px;
}
.spinner {
  z-index: 999;
  position: absolute;
  top: 100vw;
  left: 50%;
}
</style>
