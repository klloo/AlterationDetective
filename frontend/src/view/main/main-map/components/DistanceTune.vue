<template>
  <div class="distance_wrapper">
    <div class="title_wrapper">
      <span>거리 </span>
      <span>현위치 ~ {{ distance }} km </span>
    </div>
    <el-slider class="mr_12 ml_12" v-model="distance" :show-tooltip="false" :marks="distanceList" :max="8"> </el-slider>
  </div>
</template>
<script>
export default {
  name: 'DistanceTune',
  data() {
    return {
      distanceList: {
        0: '0km',
        1: '1km',
        2: '2km',
        4: '4km',
        6: '6km',
        8: '8km',
      },
      distance: 2,
    };
  },
  watch: {
    distance() {
      this.$emit('change-value', this.distance);
    },
  },
};
</script>
<style>
.distance_wrapper {
  padding: 20px 20px;
  height: 105px;
  border-width: 0px;
  font-family: inherit;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  border-radius: 12px;
  border-style: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  transition: 0.5s;
}
.title_wrapper {
  color: rgb(106, 106, 106);
  display: flex;
  justify-content: space-between;
}
</style>
