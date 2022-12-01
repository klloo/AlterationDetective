<template>
  <div id="app">
    <router-view :class="viewName" />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    viewName() {
      return this.$route.name;
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
