<template>
<!--pages/contract/sign/next/signConfirm/signConfirm.wxml-->
<view class="contract-page--section" v-if="contractData != null">
	<view class="contract-subject--area">
		<view class="subject-title title">合同主题</view>
		<view class="subject-desc">{{contractData.contractSubject.contractTitle}}</view>
	</view>
	<view class="contract-info--area">
		<view class="info-title title">合同信息</view>
		<view class="info-list">
			<view class="info-list-item">
				<text class="item-title">发起方</text>
				<text class="item-content">{{contractData.initiatorName}}</text>
			</view>
			<view class="info-list-item">
				<text class="item-title">发起时间</text>
				<text class="item-content">{{contractData.contractSubject.gmtCreate ? contractData.contractSubject.gmtCreate : ''}}</text>
			</view>
			<view class="info-list-item" v-if="contractData.contractSubject.signingDeadline">
				<text class="item-title">签署截止时间</text>
				<text class="item-content">{{contractData.contractSubject.signingDeadline}}</text>
			</view>
			<view class="info-list-item" v-if="contractData.contractSubject.fileTermination">
				<text class="item-title">文件有效签署时间</text>
				<text class="item-content">{{contractData.contractSubject.fileTermination}}</text>
			</view>
		</view>
	</view>
	<view class="contract-status">
		<view class="base-title title">合同状态</view>
		<view class="status-wrapper">
			<view class="base-list-item">
				<text class="item-title">{{(contractData.type == 1 && contractData.secondType == 2 && contractData.myselfSigned == 0) ? '等待签署方完成签署' : (contractData.type == 1 && contractData.secondType == 0) ? '待自己签署' : (contractData.type == 1 && contractData.secondType == 2 && contractData.myselfSigned == 1) ? '未轮到自己签署，等待他人签署' : (contractData.type == 1 && contractData.secondType == 2 && contractData.myselfSigned == 2) ? '你已完成本文件签署，等待他人签署' : (contractData.type == 1 && contractData.secondType == 1) ? '等待用印审批通过' : (contractData.type == 1 && contractData.secondType == 4) ? '你已撤回本合同文件' : (contractData.type == 1 && contractData.secondType == 5) ? '合同被拒签，无法继续签署' : (contractData.type == 1 && contractData.secondType == 3 && contractData.repealStatus != 1) ? '已完成' : (contractData.type == 1 && contractData.secondType == 5 && contractData.secondType == 6) ? '已超过签署截止日期，无法继续签署' : (contractData.type == 1 && contractData.secondType == 5 && contractData.secondType != 6 && contractData.secondType < 8) ? '合同文件已失效' : (contractData.type == 1 && contractData.secondType == 8) ? '等待用印审批通过' : (contractData.type == 2 && contractData.secondType == 0) ? '待自己签署' : (contractData.type == 2 && contractData.secondType == 1) ? contractData.approvalSponsor + '签署了文件，等待你的用印审批' : (contractData.type == 2 && contractData.secondType == 2 && contractData.myselfSigned == 2) ? '你已完成本文件签署，等待他人签署' : (contractData.type == 2 && contractData.secondType == 8) ? '你已完成文件签署，等待用印审批通过' : (contractData.type == 2 && contractData.secondType == 3) ? '已完成' : (contractData.type == 2 && contractData.secondType == 4) ? '被发起方撤回' : (contractData.type == 2 && contractData.secondType == 5) ? (contractData.myselfRejected ? '本文件你已拒签' : '合同被拒签，无法继续签署') : (ontractData.type == 2 && contractData.secondType > 5 && contractData.secondType < 8 && contractData.secondType != 6) ? '合同文件已失效' : (contractData.secondType > 5 && contractData.secondType < 8) ? '已超过签署截止日期，无法继续签署' : contractData.repealStatus == 5 ? '已废除' : ''}}</text>
			</view>
		</view>
	</view>
	<view class="contract-base--area">
		<view class="base-title title">合同签署方</view>
		<view class="base-list">
			<view v-for="(item, index) in contractData.contractFlowTasks" :key="index" class="base-list-item">
				<text class="item-title">{{item.relationType === 1 ? item.userName : item.relationType === 2 ? item.companyName + '（' + item.userName + '）' : ''}} - {{ item.userPhone }}</text>
				<text class="item-content">{{item.status === 1 ? '未签署' : item.status === 2 ? '已签署' : item.status === 3 ? '审批中' : item.status === 4 ? '已拒签' : item.status === 5 ? '抄送方' : ''}}</text>
			</view>
		</view>
	</view>
	<view class="contract-sign-flow">
		<view class="flow-title title">合同签署时间流</view>
		<view class="flow-content--area">
			<view v-for="(item, index) in contractData.timeProcessVOS" :key="index" class="flow-content-item">
				<view class="item-info">
					<text class="item-result">{{item.name}}{{item.actionName}}</text>
					<text class="item-time">{{item.time}}</text>
				</view>
				<view class="item-reason" :data-item="item" @tap="watchSeason" v-if="item.reason">查看原因</view>
				<view :class="'item-flag ' + (item.status == 2 ? 'success' : item.status == 3 ? 'active' : item.status == 4 ? 'fail' : fail)"></view>
			</view>
		</view>
	</view>
</view>
</template>

<script>
import { get } from '@api/request.js'
import { get_contract_detail } from '@api/contract.js'
import avatar from "@c/avatar/avatar";

export default {
  data() {
    return {
      contractData: null
    };
  },

  components: {
    avatar
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.getDetailDataFun(options.contractId);
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
      get({
        url: get_contract_detail,
        params: {
          id: id
        },
        success: res => {
          console.log(res);
          const copy = res.contractFlowTasks.filter(it => {
            return it.processType == 2;
          });
          res.contractFlowTasks = copy;
          const contractSubject = res.contractSubject;

          if (contractSubject.gmtCreate) {
            res.contractSubject.gmtCreate = this.formatTimeConvert(contractSubject.gmtCreate, 1);
          }

          if (contractSubject.signingDeadline) {
            res.contractSubject.signingDeadline = this.formatTimeConvert(contractSubject.signingDeadline, 1);
          }

          if (contractSubject.fileTermination) {
            res.contractSubject.fileTermination = this.formatTimeConvert(contractSubject.fileTermination, 1);
          }

          res.timeProcessVOS.forEach(item => {
            item.time = this.formatTimeConvert(item.relationTime, 1);
          });

          this.contractData = res
        },
        fail: function (err) {
          console.log(err);
        }
      });
    },

    watchSeason(e) {
      console.log(e);
      var reason = e.currentTarget.dataset.item.reason || ' ';
      uni.showModal({
        title: "查看原因",
        content: reason,
        confirmText: "知道了",
        showCancel: false
      });
    },

    /**
     * 
     * @param {*} timestamp 时间戳
     * @param {*} num 格式化类型
     */
    formatTimeConvert(timestamp, num) {
      timestamp = timestamp + '';
      timestamp = timestamp.length == 10 ? timestamp * 1000 : timestamp;
      var date = new Date(Number(timestamp));
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = date.getDate();
      d = d < 10 ? '0' + d : d;
      var h = date.getHours();
      h = h < 10 ? '0' + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;

      if (num == 0) {
        return y + '-' + m + '-' + d;
      } else {
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
      }
    },

    back() {
      uni.navigateBack();
    }

  }
};
</script>
<style>
@import "./contractDetail.css";
</style>
