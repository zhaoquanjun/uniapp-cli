<template>
<view class="account-info">
    <view class="type-select-header">
        <text class="type-text">汇款信息</text>
    </view>
    <view class="base-info-container">
        <view class="field-item">
            <label class="name">金额</label>
            <text class="value-input">￥0.01</text>
        </view>
        <view class="line"></view>
        <view class="field-item">
            <label class="name">开户名</label>
            <label class="value-select">
                北京新橙长科技有限公司
            </label>
        </view>
        <view class="line"></view>
        <view class="field-item">
            <label class="name">开户行</label>
            <text class="value-input">招商银行股份有限公司青年路支行</text>
        </view>
        <view class="field-item">
            <label class="name">账号</label>
            <text class="value-input">110936742010801</text>
        </view>
        <view class="field-item">
            <label class="name">汇款备注</label>
            <text class="value-input">请务必备注当前帐号手机号</text>
        </view>
    </view>
    <view class="bottom-btn-container">
        <text class="next" @tap="handleCompletePayFun">已完成汇款</text>
    </view>
</view>
</template>

<script>
// authentication/auth-type/index.js

export default {
  data() {
    return {};
  },

  components: {},
  props: {},

  onShareAppMessage() {},

  methods: {
    handleCompletePayFun() {
      uni.navigateTo({
        url: '/pages/authentication/company/auth-result/index?result=ing'
      });
    }

  }
};
</script>
<style>
@import "./index.css";
</style>