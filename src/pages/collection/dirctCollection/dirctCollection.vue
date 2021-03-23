<template>
<!--pages/collection/dirctCollection/receipt.wxml-->
<view class="pageContent">
	<view class="pageHeader">
		<view class="title">{{title1}}</view>
		<view class="amount">
			<view class="prefix">¥</view>
			<input class="value-input" type="text" @blur="handleBlurInputFun" v-model="inputAmount" />
		</view>
	</view>

	<view class="receipt-message">
		<view class="title" style="border-bottom:2rpx solid #F5F5F5">{{title2}}</view>
		<view class="input-message-box">
			<textarea name="content" maxlength="100" placeholder="请输入收款信息" v-model="receiptMessage" />
			<text class="input-tip">{{receiptMessage.length}}/100</text>
		</view>
	</view>

	<view class="payer-info">
		<view class="title">付款方信息</view>
		<view class="info-wrapper">
			<input type="text" maxlength="50" v-model="payerName" />
		</view>
	</view>

	<view class="payer-info">
		<view class="title">备注</view>
		<view class="info-wrapper">
			<input type="text" maxlength="100" v-model="remark" />
		</view>
	</view>

	<button class="nextButton" style="background-color:#464646" v-if="ishighLight" @tap.stop="codeGenerate">{{nextText}}</button>
	<button class="nextButton" v-if="!ishighLight" style="background:#B7B7B7">{{nextText}}</button>
</view>
</template>

<script>
import { postBody } from '@api/request.js'
import { get_sell_pay_QrCode, get_pay_QrCode } from '@api/collection.js'
var utils = require("@u/utils.js");
var app = getApp();

export default {
  data() {
    return {
      buttonClicked: true,
      title1: "收款金额",
      title2: "收款信息",
      receiptMessage: '',
      ishighLight: false,
      inputAmount: '',
      nextText: "生成收款码",
      hour: " ",
      minute: " ",
      isTemplate: 0,
      templateId: '',
      payerName: '',
      // 付款方名称
      remark: '' // 备注

    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.isTemplate) {
      this.isTemplate = options.isTemplate
    }

    if (options.templateId) {
      this.templateId = options.templateId
    }

    this.inputAmount = options.templateAmount
    this.receiptMessage = options.templateName
  },
  onShareAppMessage: function () {},
  computed: {
    ishighLight() {
      return this.receiptMessage && this.inputAmount
    }
  },
  methods: {

    bindKeyInput(e) {
      this.inputAmount = this.inputAmount.replace(/[^\d.]/g, "").replace(/^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
    },

    handleBlurInputFun() {
      this.inputAmount = Number(this.inputAmount).toFixed(2)
    },

    codeGenerate() {
      if (this.inputAmount == 0) {
        utils.showError("请输入收款金额");
        return;
      }

      if (!this.payerName) {
        utils.showError("请输入付款方");
        return;
      }

      this.buttonClicked = false

      const params = {
        name: this.receiptMessage,
        amount: this.inputAmount * 100,
        id: this.templateId,
        payerName: this.payerName,
        remark: this.remark
      };
      const url = this.isTemplate == 1 ? get_sell_pay_QrCode : get_pay_QrCode;
      postBody({
        url: url,
        params: params,
        success: res => {
          uni.hideLoading({});
          uni.navigateTo({
            url: '/pages/collection/dirctCollection/dirctCollectionLaunch/dirctCollectionLaunch?inputAmount= ' + inputAmount + '&receiptMessage=' + receiptMessage + '&qrCodeUrl=' + res.qrCodeUrl + '&isTemplate=' + isTemplate + '&url=' + res.url
          });
        },
        fail: err => {
          uni.hideLoading();
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: err
            })
          }, 50)
        }
      });
    }

  }
};
</script>
<style>
@import "./dirctCollection.css";
</style>
