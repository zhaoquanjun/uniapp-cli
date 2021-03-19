<template>
<view>
<web-view :src="webSrc" @message="getRecordVideoFun"></web-view>
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      env: 'dev',
      devSrc: 'https://dev.shanqian.cn/fileRecord',
      prodSrc: 'https://shanqian.cn/fileRecord',
      webSrc: ''
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const token = app.globalData.getUserToken();
    const currentUser = uni.getStorageSync('currentUser');
    let webSrc = this[app.globalData.env + 'Src'] + '?fileType=' + options.type + '&token=' + token;

    if (currentUser.companyId) {
      webSrc += '&companyId=' + currentUser.companyId;
    }

    if (options.fromId) {
      let queryStr = '';

      for (const key in options) {
        if (options.hasOwnProperty(key) && key != 'type') {
          console.log(options[key]);
          queryStr += '&' + key + '=' + options[key];
        }
      }

      webSrc += queryStr;
    }

    console.log(webSrc);
    this.webSrc = webSrc
  },
  methods: {
    getRecordVideoFun(e) {
      console.log(e.detail.data[0].type)
    }

  }
};
</script>
<style>
@import "./fileRecord.css";
</style>
