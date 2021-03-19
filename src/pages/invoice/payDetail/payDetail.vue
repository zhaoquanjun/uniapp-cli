<template>
<view class="pay-detail--page">
  <view class="title">合同主题</view>
  <view class="desc">{{title}}</view>
  <view class="title" v-if="paidList">支付信息</view>
  <view v-for="(item, index) in paidList" :key="index" class="info-list">
    <view class="list-item">
      <view class="label">付款方</view>
      <view class="value">{{item.payerName}}</view>
    </view>
    <view class="list-item">
      <view class="label">支付时间</view>
      <view class="value">{{item.gmtModified}}</view>
    </view>
    <view class="list-item">
      <view class="label">支付金额</view>
      <view class="value">¥ {{item.amount}}</view>
    </view>
  </view>
  <view class="title" v-if="unpaidList">等待付款</view>
  <view v-for="(item, index) in unpaidList" :key="index" class="info-list">
    <view class="list-item">
      <view class="label">{{item.payerName}}</view>
      <view class="value">¥ {{item.amount}}</view>
    </view>
  </view>
</view>
</template>

<script>
import { get } from '@api/request.js'
import { get_pay_detail } from '@api/invoice.js'

export default {
  data() {
    return {
      title: '',
      paidList: [],
      unpaidList: []
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPayDetailFun(options.id);
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
     * @name 获取支付详情
     * @param {*} title - 合同名
     */
    getPayDetailFun(title) {
      uni.showLoading({
        title: '加载中'
      });
      get({
        url: get_pay_detail + '?contractSubjectId=' + title,
        success: res => {
          console.log(res);
          res.paidList && res.paidList.forEach(it => {
            it.gmtModified = this.formatTimeConvertFun(it.gmtModified, 0);
            it.amount = (it.amount / 100).toFixed(2);
          });
          res.unpaidList && res.unpaidList.forEach(it => {
            it.gmtModified = this.formatTimeConvertFun(it.gmtModified, 0);
            it.amount = (it.amount / 100).toFixed(2);
          });
          this.title = res.name
          this.paidList = res.paidList
          this.unpaidList = res.unpaidList
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
     * @name 格式化时间
     * @params {num} 格式参数
     */
    formatTimeConvertFun(timestamp, num) {
      timestamp = timestamp + "";
      timestamp = timestamp.length == 10 ? timestamp * 1000 : timestamp;
      var date = new Date(Number(timestamp));
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;

      if (num == 0) {
        return y + "-" + m + "-" + d;
      } else {
        return y + "" + m + "." + d + " " + h + ":" + minute + ":" + second;
      }
    }

  }
};
</script>
<style>
@import "./payDetail.css";
</style>
