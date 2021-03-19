<template>
<view>
<web-view :src="webSrc" @message="getContractFile"></web-view>
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      env: 'dev',
      devSrc: 'https://dev.shanqian.cn/fileSelect',
      prodSrc: 'https://shanqian.cn/fileSelect',
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
    this.webSrc = this[app.globalData.env + 'Src']
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
