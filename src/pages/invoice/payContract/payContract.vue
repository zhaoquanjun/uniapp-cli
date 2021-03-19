<template>
<view class="pay-contract--page">
  <view class="amount">
    <view class="prefix">¥</view><view class="money">{{integer}}.</view><view class="decimal">{{decimal}}</view>
  </view>
  <view class="item-section">
    <view class="title">付款合同</view>
    <view class="desc">{{payInfo.name}}</view>
  </view>
  <view class="item-section">
    <view class="title">收款公司</view>
    <view class="desc">{{reveive}}</view>
  </view>
  <view class="btn-wrapper">
    <view class="confirm-btn" @tap="handleToPayFun">确认付款</view>
  </view>
</view>
</template>

<script>
import { get } from '@api/request.js'
import { get_pay_info } from '@api/invoice.js'

export default {
  data() {
    return {
      payInfo: null,
      integer: '',
      decimal: '',
      reveive: ''
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reveive = options.receiveName
    this.getPayInfoFun(options.id);
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
     * @name 获取支付信息
     */
    getPayInfoFun(id) {
      uni.showLoading({
        title: '加载中'
      });
      get({
        url: get_pay_info + '/' + id,
        success: res => {
          let curAmount = (res.amount / 100).toFixed(2);
          this.payInfo = res
          this.decimal = curAmount.slice(curAmount.indexOf('.') + 1)
          this.integer = curAmount.slice(0, curAmount.indexOf('.'))
        },
        fail: err => {
          console.log(err);
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    },

    /**
     * @name 跳转第三方支付
     */
    handleToPayFun() {
      let search = this.payInfo.url.slice(this.payInfo.url.indexOf('?') + 1);
      let u = this.getQueryString('u', search);
      let t = this.getQueryString('t', search);
      let r = this.getQueryString('r', search);
      uni.navigateTo({
        url: '/pages/invvoice/nuonuoPay/nuonuoPay?&u=' + u + '&t=' + t + '&r=' + r
      });
    },

    /**
     * @name 获取参数
     */
    getQueryString(name, url) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = url.match(reg);
      if (r != null) return decodeURI(r[2]);
      return null;
    }

  }
};
</script>
<style>
@import "./payContract.css";
</style>
