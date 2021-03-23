<template>
<view>
<web-view :src="webSrc" @load="webLoadSuc" @error="webLoadErr"></web-view>
</view>
</template>

<script>
export default {
  data() {
    return {
      webSrc: '',
      developmentWebSrc: 'https://dev.shanqian.cn/invoice/pay-result',
      productionWebSrc: 'https://shanqian.cn/invoice/pay-result'
    };
  },
  onLoad: function (options) {
    this.webSrc = this[process.env.NODE_ENV + 'WebSrc'] + '?customerOrderNo=' + options.customerOrderNo;
  },
  onUnload: function () {
    const pages = getCurrentPages();
    if (pages[pages.length - 2].route == "pages/contract/sign/next/next") {
      uni.reLaunch({
        url: '/pages/contract/contractList/contract?searchType=1&pageTitle=我发起的'
      });
    }
  },
  methods: {
    webLoadSuc(e) {
      console.log(e);
    },

    webLoadErr(e) {
      console.log(e);
    },

    back() {
      uni.navigateBack();
    }

  }
};
</script>
<style>
@import "./payResult.css";
</style>
