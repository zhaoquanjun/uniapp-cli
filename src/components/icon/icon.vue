<template>
<!--components/icon/icon.wxml-->
<i :class="'icon iconfont icon-' + name"></i>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    name: String
  },
  methods: {}
};
</script>
<style>
@import "./icon.css";
</style>