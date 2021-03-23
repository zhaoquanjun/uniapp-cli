<template>
<web-view :src="webSrc" @load="webLoadSuc" @error="webLoadErr"></web-view>
</template>

<script>
export default {
  data() {
    return {
      webSrc: '',
      developmentWebSrc: 'https://dev.shanqian.cn/juheApi/miniPay',
      productionWebSrc: 'https://shanqian.cn/juheApi/miniFill'
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    this.webSrc = this[process.env.NODE_ENV + 'WebSrc'] + '?u=' + options.u + '&t=' + options.t + '&r' + options.r
  },
  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    webLoadSuc(e) {
      console.log(e);
    },

    webLoadErr(e) {
      console.log(e);
    }

  }
};
</script>
<style>
@import "./nuonuoPay.css";
</style>
