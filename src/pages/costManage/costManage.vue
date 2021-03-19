<template>
<!--pages/costManage/costManage.wxml-->
<view class="cost-manage--page">
  <view class="list-item">
     <view class="title">账户金额</view>
     <view class="content">
      <view class="balance">
        <view class="prefix">¥</view>
        <view class="amount">{{balance}}</view>
      </view>
      <view class="btn-group">
        <view class="btn" @tap="handleRechargeFun">充值</view>
        <view class="btn black" @tap="handleGivingFun">赠送</view>
      </view>
     </view>
     <view class="detail" @tap="handleShowBalanceFun">
      <view class="detail-word">详情</view>
      <view class="iconfont iconright-arrow icon"></view>
     </view>
  </view>
	<view class="list-item">
	  <view class="title">合同套餐</view>
	   <view class="content">
	    <view class="balance card">
	      <view class="amount">{{package}}</view>
	      <view class="prefix">份</view>
	    </view>
	    <view class="btn-group">
	      <view class="btn primary" @tap="handleBuyPacckageFun">购买套餐</view>
	    </view>
	   </view>
	</view>
</view>
</template>

<script>
import { get } from '@api/request.js'
import { get_accout_info } from '@api/cost.js'

export default {
  data() {
    return {
      balance: 0,
      count: 0,
			package: 0
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserAccountInfoFun();
  },

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
  onPullDownRefresh: function () {
    this.getUserAccountInfoFun();
  },

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
     * @name 获取用户账户信息
     */
    getUserAccountInfoFun() {
      uni.showLoading({
        title: '加载中'
      });
      get({
        url: get_accout_info,
        success: res => {
          this.balance = (res.accountFee / 100).toFixed(2)
          this.count = res.couponFee
          this.package = res.contractExpense
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
     * @name 跳转账户余额
     */
    handleShowBalanceFun() {
      uni.navigateTo({
        url: '/pages/costManage/accountBalance/accountBalance'
      });
    },

    /**
     * @name 充值跳转
     */
    handleRechargeFun() {
      uni.navigateTo({
        url: '/pages/costManage/recharge/recharge'
      });
    },

    /**
     * @name 赠送跳转
     */
    handleGivingFun() {
      uni.navigateTo({
        url: '/pages/costManage/buyCard/buyCard?origin=give'
      });
    },
		/**
		 * @name 购买套餐
		 */
		handleBuyPacckageFun() {
			uni.navigateTo({
			  url: '/pages/costManage/buyPackage/buyPackage'
			});
		}

  }
};
</script>
<style>
@import "./costManage.css";
</style>
