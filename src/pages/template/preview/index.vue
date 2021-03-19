<template>
<view>
<web-view :src="webSrc" @load="webLoadSuc" @error="webLoadErr"></web-view>
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      webSrc: '',
      devWebSrc: 'https://dev.shanqian.cn/miniPreview',
      prodWebSrc: 'https://shanqian.cn/miniPreview'
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    console.log(options);
    const token = app.globalData.getUserToken();
    const currentUser = uni.getStorageSync('currentUser');
    let str = this[app.globalData.env + 'WebSrc'] + '?templateId=' + options.templateId + '&id=' + options.id + '&token=' + token;

    if (currentUser && currentUser.companyId) {
      str += '&companyId=' + currentUser.companyId;
    }

    console.log(str);
    this.webSrc = str
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
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
@import "./index.css";
</style>
