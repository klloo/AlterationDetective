<template>
  <div>
    <h1>메인 페이지~!</h1>
    <div>{{ data.name }}</div>
    <div>{{ data.age }}</div>
  </div>
</template>

<script>
import { getServerData } from '@/api/home-api';

export default {
  name: 'MainView',
  data() {
    return {
      data: {},
    };
  },
  created() {
    getServerData().then((response) => {
      this.data = response.data;
    });
  },
  methods: {
    loadData() {},
  },
};
</script>

<style lang="css"></style>
