<template>
<view class="card-detail-page">
	<view v-if="detailData != null && detailData.length > 0">
		<view v-for="(item, index) in detailData" :key="index" class="list-item">
			<view class="top">
				<view class="name">{{item.consumptionTypeText}}</view>
				<view class="money">- {{item.consumptionMoney}}</view>
			</view>
			<view class="bot">
				<view class="time">支出时间：{{item.consumptionTime}}</view>
				<view class="type">{{item.deductionName}}</view>
			</view>
		</view>
	</view>
	<view class="empty" v-if="detailData == null || detailData.length == 0">暂无消费记录</view>
</view>
</template>

<script>
import { get } from '@api/request.js'
import { get_balance_list } from '@api/cost.js'

export default {
  data() {
    return {
      detailData: null
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetailDataFun(options.id || '');
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
    getDetailDataFun(id) {
      let options = {
        consumptionDetailsType: 1,
        deductionId: id,
        deductionType: 0,
        currentPage: 1,
        pageSize: 10000
      };
      uni.showLoading({
        title: '加载中'
      });
      get({
        url: get_balance_list,
        params: options,
        success: res => {
          console.log(res);
          res.results.map(it => {
            it.consumptionMoney = (it.consumptionMoney / 100).toFixed(2);
            it.consumptionTime = this.formatTimeConvertFun(it.consumptionTime, 0);
          });
          this.detailData = res.results
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
    * @params {num} 0:y-m-d 1:y-m-d-h-m-s
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
        return y + "年" + m + "月" + d + "日";
      } else {
        return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
      }
    }

  }
};
</script>
<style>
@import "./cardDetail.css";
</style>
