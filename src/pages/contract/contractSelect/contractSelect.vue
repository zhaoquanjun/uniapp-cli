<template>
<view>
<web-view :src="webSrc" @message="getContractFile"></web-view>
</view>
</template>

<script>
export default {
  data() {
    return {
      developmentSrc: 'https://dev.shanqian.cn/fileSelect',
      productionSrc: 'https://shanqian.cn/fileSelect',
      webSrc: '',
      needUpload: false
    };
  },
  onLoad(options) {
    this.needUpload = options.needUpload ?? ''
  },
  onShow() {
    this.webSrc = this[process.env.NODE_ENV + 'Src'] + '?needUpload=' + this.needUpload
  },
  methods: {
    getContractFile(e) {
      console.log(e)
			console.log(e.detail.data[0])
    }

  }
};
</script>
<style>
@import "./contractSelect.css";
</style>
