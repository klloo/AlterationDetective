<template>
  <div class="distance_wrapper">
    <div class="title_wrapper">
      <span>거리 </span>
      <span>현위치 ~ {{ distance }} km </span>
    </div>
    <vue-slider v-model="distance" :data="distanceList" data-value="value" data-label="label" tooltip="none"></vue-slider>
  </div>
</template>
<script>
export default {
  name: 'DistanceTune',
  data() {
    return {
      distanceList: [
        {
          value: 0,
          label: '0km',
        },
        {
          value: 1,
          label: '1km',
        },
        {
          value: 2,
          label: '2km',
        },
        {
          value: 4,
          label: '4km',
        },
        {
          value: 6,
          label: '6km',
        },
        {
          value: 8,
          label: '8km',
        },
      ],
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
  padding: 10px 20px;
  height: 70px;
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
.title_wrapper {
  display: flex;
  justify-content: space-between;
}
</style>
