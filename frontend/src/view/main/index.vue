<template>
  <div>
    <h1>메인 페이지</h1>
    <div>API 테스트</div>
    <div>{{ data.name }}</div>
    <div>{{ data.age }}</div>
    <main-map></main-map>
  </div>
</template>

<script>
import { getServerData } from '@/api/home-api';
import MainMap from './components/MainMap';

export default {
  name: 'MainView',
  components: {
    MainMap,
  },
  data() {
    return {
      data: {},
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    /**
     * api 통신 테스트
     */
    loadData() {
      getServerData().then((response) => {
        this.data = response.data;
      });
    },
  },
};
</script>

<style lang="css"></style>
