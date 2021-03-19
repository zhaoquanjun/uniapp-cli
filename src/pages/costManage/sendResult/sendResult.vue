<template>
<view class="send-result-page">
  <view class="success-result" v-if="result == 's'">
    <view class="result-icon">
      <image :src="success" mode="aspectFit"></image>
    </view>
    <view class="result-title">已赠送至对方用户</view>
    <view class="result-desc">等待对方确认（{{time}}s后自动返回至费用管理页）</view>
    <view class="back-btn" @tap="handleBackToCostFun">返回至费用管理页</view>
  </view>
  <view class="fail-result" v-if="result == 'f'">
    <view class="result-icon">
      <image :src="fail" mode="aspectFit"></image>
    </view>
    <view class="result-title">赠送失败</view>
    <view class="result-desc">赠送失败，请检查后重试</view>
    <view class="btn-groups">
      <view class="btn" @tap="handleBackToCostFun">返回</view>
      <view class="btn buy-again black" @tap="handleReBuyFun">重新购买</view>
    </view>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {
      result: 'f',
      success: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/success_result.png',
      fail: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/fail_result.png',
      timer: null,
      time: 3
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.result) {
      this.result = options.result
    }

    this.timer = setInterval(() => {
        let curTime = this.time;
        if (this.time > 1) {
          this.time = curTime - 1
        } else {
          clearInterval(this.timer);
          this.handleBackToCostFun();
        }
      }, 1000)
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
     * @name 重新购买
     */
    handleReBuyFun() {
      clearInterval(this.timer);
      uni.redirectTo({
        url: '/pages/costManage/buyCard/buyCard?origin=give'
      });
    },

    /**
     * @name 返回费用管理主页
     */
    handleBackToCostFun() {
      clearInterval(this.timer);
      uni.reLaunch({
        url: '/pages/costManage/costManage'
      });
    }

  }
};
</script>
<style>
@import "./sendResult.css";
</style>
