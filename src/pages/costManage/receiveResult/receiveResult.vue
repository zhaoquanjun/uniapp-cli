<template>
<web-view :src="webSrc" @load="webLoadSuc" @error="webLoadErr"></web-view>
</template>

<script>

export default {
  data() {
    return {
      webSrc: '',
      developmentWebSrc: 'https://dev.shanqian.cn/receiveResult',
      productionWebSrc: 'https://shanqian.cn/receiveResult'
    };
  },
  onLoad(options) {
    this.result = options.result
  },
  onShow() {
    this.webSrc = this[process.env.NODE_ENV + 'WebSrc'] + `?result=${options.result}`
  },
  onShareAppMessage: function () {},
  methods: {}
};
</script>
<style>
@import "./receiveResult.css";
</style>
