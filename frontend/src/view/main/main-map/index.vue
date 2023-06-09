<template>
  <div>
    <search-popup ref="searchPopup" @select-addr="setPosition" @select-shop="selectAlterationShop" />
    <alteraion-shop-detail-popup ref="detailPopup" @set-shop-map="setShopMap"></alteraion-shop-detail-popup>
    <div>
      <div class="search_box pa_1">
        <div @click="openSearchPopup">
          <el-input class="search_bar" prefix-icon="el-icon-search" type="text" placeholder="지역명, 매장이름으로 검색하세요." readonly />
        </div>
        <div class="d_flex align_center mt_8">
          <el-tag :class="`my_tag mr_16 ${showDistanceTune ? 'selected-btn' : ''}`" @click="showDistanceTune = !showDistanceTune">
            <i class="el-icon-s-operation mr_2 ml_2" />
          </el-tag>
        </div>
        <!-- 거리 조정 슬라이더 -->
        <distance-tune v-show="showDistanceTune" @change-value="changeDistance"></distance-tune>
        <el-button v-if="!isEmpty(alterationShopPos)" @click="alterationShopPos = []">
          매장 위치
          <i class="el-icon-refresh-left" />
        </el-button>
      </div>
      <!-- 지도 -->
      <div class="map_wrap" v-loading="isLoading" element-loading-background="rgba(255, 255, 255, 0.8)">
        <naver-maps :height="height" :width="width" :mapOptions="mapOptions" :initLayers="initLayers" @load="onLoad">
          <naver-marker :lat="mapLatitude" :lng="mapLongitude" ref="marker1">
            <i class="el-icon-location map-pos-icon" />
          </naver-marker>
          <naver-marker
            v-for="(item, index) in mapAltreationShopList"
            :key="index"
            :lat="item.latitude"
            :lng="item.longitude"
            :ref="`marker${index}`"
            @click="selectAlterationShop(item)"
          >
            <div class="shop-pos-icon">
              <i class="el-icon-s-shop" />
              {{ item.alterationShopName }}
            </div>
          </naver-marker>
        </naver-maps>
        <!-- <el-button class="refresh" @click="refreshAlterationShop" icon="el-icon-refresh-right"> </el-button> -->
        <el-button class="my-place" @click="setCurrentPosition" icon="el-icon-aim"> </el-button>
      </div>
      <!-- 수선집 목록 -->
      <modal-view-m>
        <div slot="open-title">
          <el-row class="tal">
            <p class="fs_24">
              <span class="fw_600">{{ addressString }}</span>
              근처의
              <br />
              수선집을 추천하고 있어요!
            </p>
          </el-row>
        </div>
        <div slot="open">
          <recommend :alteration-shop-list="alterationShopList" @click-shop="selectAlterationShop"></recommend>
        </div>
        <div class="mt_8" slot="close">
          <span class="shop_count">
            <span style="font-weight: bold">
              {{ alterationShopList.length }}
            </span>
            개의 수선집 목록 보기
          </span>
        </div>
      </modal-view-m>
    </div>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import axios from 'axios';
import { getAlterationShopList } from '@/api/alteration-shop';
import Recommend from './components/Recommend';
import DistanceTune from './components/DistanceTune';
import ModalViewM from '../components/ModalSlideUp';
import AlteraionShopDetailPopup from './popup/AlteraionShopDetailPopup';
import SearchPopup from './popup/SearchPopup';

export default {
  name: 'MainMap',
  components: {
    AlteraionShopDetailPopup,
    ModalViewM,
    Recommend,
    DistanceTune,
    SearchPopup,
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
      mapLatitude: latitude,
      mapLongitude: longitude,
      mapOptions: {
        lat: latitude,
        lng: longitude,
        zoom: 15,
        zoomControl: false,
        mapTypeControl: false,
        mapDataControl: false,
        scaleControl: false,
      },
      initLayers: ['BACKGROUND', 'BACKGROUND_DETAIL', 'POI_KOREAN', 'TRANSIT', 'ENGLISH', 'CHINESE', 'JAPANESE'],
      // 수선집 목록
      alterationShopList: [],
      // 현재 클릭한 수선집 id
      selectedShopId: -1,
      // 로딩 중 여부
      isLoading: false,
      // 거리 조정 컴포넌트 제공 여부
      showDistanceTune: false,
      // 설정한 거리
      distance: 2,
      // 현위치 행정동 주소
      addressString: '',
      // 하단 추천 수선집 open 여부
      openShopList: false,
      // 지도에 위치를 나타낼 수선집 정보
      alterationShopPos: [],
    };
  },
  computed: {
    curPos() {
      return this.$store.getters.curPos;
    },
    mapAltreationShopList() {
      if (!isEmpty(this.alterationShopPos)) return this.alterationShopPos;
      return this.alterationShopList;
    },
  },
  methods: {
    isEmpty,
    /**
     * 지도가 로드되면 수행
     * map 컴포넌트 할당
     */
    onLoad(map) {
      this.map = map;
      // 현 위치 설정
      this.setCurrentPosition();
    },
    /**
     * 수선집 목록을 조회한다.
     */
    loadAlterationShopList() {
      const params = {
        mapLongitude: this.mapLongitude,
        mapLatitude: this.mapLatitude,
        curLongitude: this.curPos.longitude,
        curLatitude: this.curPos.latitude,
        distance: this.distance * 1000,
      };
      getAlterationShopList(params)
        .then((data) => {
          const result = data.data;
          if (result.success) {
            this.alterationShopList = result.data;
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    /**
     * 현재 위치를 가져온다.
     */
    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    },
    /**
     * 현재 위치를 설정한다.
     *
     * @return  {[type]}  [return description]
     */
    setCurrentPosition() {
      this.isLoading = true;
      this.getCurrentPosition()
        .then((pos) => {
          // 마커 위치
          this.mapLatitude = pos.coords.latitude;
          this.mapLongitude = pos.coords.longitude;
          this.$store.dispatch('setCurPos', {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          // 지도 위치
          this.setMapPosition();
        })
        .catch((err) => {
          throw new Error(err);
        })
        .finally(() => {
          this.isLoading = false;
          // 좌표 -> 주소 변환
          this.coordsToAddres();
          // 수선집 목록 조회
          this.loadAlterationShopList();
        });
    },
    /**
     * 현재 설정된 위경도 정보로 지도 위치를 설정한다.
     */
    setMapPosition() {
      this.map.setCenter(new naver.maps.LatLng(this.mapLatitude, this.mapLongitude));
    },
    /**
     * 좌표를 주소로 변환한다.
     */
    coordsToAddres() {
      axios
        .get('/naver/map-reversegeocode/v2/gc', {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': 'n9dm36idtu',
            'X-NCP-APIGW-API-KEY': 'CqEzG5y5swiaYpXOX1Yo7dgdvMlAdlwAGjfwBwiq',
          },
          params: {
            coords: `${this.mapLongitude},${this.mapLatitude}`,
            output: 'json',
            orders: 'admcode',
          },
        })
        .then((res) => {
          const data = res.data;
          if (data.status.code === 0) {
            const region = res.data.results[0].region;
            this.addressString = `${region.area2.name} ${region.area3.name}`;
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    /**
     * 버튼 클래스 반환
     */
    buttonClass(idx) {
      return this.selectedTagBtns.some((item) => item === idx) ? 'selected-btn' : '';
    },
    /**
     * 수선집 선택한 경우 탭 변경
     */
    selectAlterationShop(item) {
      const params = {
        alterationShopId: item.alterationShopId,
      };
      this.$refs.detailPopup.open(params);
    },
    /**
     * 설정한 거리 변경 핸들러
     */
    changeDistance(value) {
      this.map.setCenter(new naver.maps.LatLng(this.mapLatitude, this.mapLongitude));
      this.distance = value;
      this.mapOptions.zoom = 16 - Math.floor(this.distance * 0.5);
      this.map.setOptions(this.mapOptions);
      this.loadAlterationShopList();
    },
    /**
     * 파라미터로 전달받은 주소로 지도 위치를 설정한다.
     */
    setPosition(addr) {
      this.isLoading = true;
      axios
        .get('/naver/map-geocode/v2/geocode', {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': 'n9dm36idtu',
            'X-NCP-APIGW-API-KEY': 'CqEzG5y5swiaYpXOX1Yo7dgdvMlAdlwAGjfwBwiq',
          },
          params: {
            query: addr,
          },
        })
        .then((res) => {
          const data = res.data;
          if (data.status === 'OK') {
            const address = data.addresses[0];
            // 마커 위치
            this.mapLatitude = Number(address.y);
            this.mapLongitude = Number(address.x);
            // 지도 위치
            this.setMapPosition();
          }
        })
        .catch((err) => {
          throw new Error(err);
        })
        .finally(() => {
          this.isLoading = false;
          // 좌표 -> 주소 변환
          this.coordsToAddres();
          // 수선집 목록 조회
          this.loadAlterationShopList();
        });
    },
    /**
     * 검색 팝업을 연다.
     */
    openSearchPopup() {
      this.$refs.searchPopup.open();
    },
    /**
     * 현위치에서 수선집 목록을 새로고침한다.
     */
    refreshAlterationShop() {
      // const point = this.map.getCenter();
      // const latlng = naver.maps.TransCoord.fromTM128ToLatLng(point);
      // this.mapLatitude = latlng.y;
      // this.mapLongitude = latlng.x;
      // this.loadAlterationShopList();
    },
    /**
     * 모든 팝업을 닫는다.
     */
    closePopups() {
      this.$refs.searchPopup.closePopup();
      this.$refs.detailPopup.closePopup();
    },
    /**
     * 파라미터로 전달받은 가게만 지도에 표시한다.
     */
    setShopMap(shopInfo) {
      this.alterationShopPos = [shopInfo];
      this.map.setCenter(new naver.maps.LatLng(shopInfo.latitude, shopInfo.longitude));
      this.mapOptions.zoom = 15;
      this.closePopups();
    },
  },
};
</script>
<style scoped>
.search_bar {
  position: relative;
}
.search_bar {
  box-shadow: 0px 0px 7px rgb(0 0 0/ 20%);
}
.main .search_box {
  position: absolute;
  z-index: 999;
  width: 100%;
  top: 45px;
  padding: 1em;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgb(255, 255, 255, 0.1));
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
.main .my-place {
  position: absolute;
  z-index: 999;
  top: 107px;
  right: 16px;
  background-color: #fff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  color: black;
  height: 38px;
  border-radius: 50px;
}
.main .refresh {
  position: absolute;
  z-index: 999;
  top: 157px;
  right: 16px;
  background-color: #fff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  color: black;
  height: 38px;
  border-radius: 50px;
}
.my_tag {
  border-radius: 15px;
  color: rgb(87, 87, 87);
  background-color: white;
  border: none;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
  height: 28px;
}
.selected-btn {
  border: none;
  color: white;
  background: var(--maincolor) !important;
}
.shop_count {
  font-size: 15px;
}
.map-pos-icon {
  font-size: 35px;
  color: rgb(217, 78, 68) !important;
}
.shop-pos-icon {
  display: flex !important;
  font-size: 13px;
  font-weight: 700;
  color: var(--maincolor) !important;
  border: 1px solid var(--maincolor);
  border-radius: 30px;
  background: #fff;
  padding: 4px;
  white-space: nowrap;
  overflow: hidden;
}
</style>
