<template>
<view>
<web-view :src="webSrc" @load="webLoadSuc" @error="webLoadErr"></web-view>
</view>
</template>

<script>
// pages/contract/sign/next/signConfirm/signConfirm.js
const app = getApp();

export default {
  data() {
    return {
      webSrc: '',
      devWebSrc: 'https://dev.shanqian.cn/miniSign',
      prodWebSrc: 'https://shanqian.cn/miniSign'
    };
  },

  props: {},
  onLoad: function (options) {
    console.log(options);
		
		// #ifdef  H5
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		const userId = localStorage.getItem('userId');
		// #endif
		
		// #ifndef  H5
		const currentUser = uni.getStorageSync('currentUser');
		const userId = uni.getStorageSync('userId');
		// #endif
   
		const token = app.globalData.getUserToken();
    let str = this[app.globalData.env + 'WebSrc'] + '?userId=' + userId + '&contractId=' + options.contractId + '&token=' + token;

    if (currentUser && currentUser.companyId) {
      console.log(currentUser.companyId, 'companyId---');
      const phone = uni.getStorageSync('phone');
      str += '&phone=' + phone + '&companyId=' + currentUser.companyId + '&type=' + 'company' + '&roleType=' + currentUser.roleTypes;
    } else {
      str += '&phone=' + currentUser.account + '&type=' + 'signal';
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
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    const pages = getCurrentPages();

    if (pages[pages.length - 2].route == "pages/contract/sign/next/next") {
      uni.reLaunch({
        url: '/pages/contract/contractList/contract?searchType=1&pageTitle=我发起的'
      });
    }
  },

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
@import "./signConfirm.css";
</style>
