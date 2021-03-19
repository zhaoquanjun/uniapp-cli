<template>
  <view class="company-info-pay">
    <view class="type-select-header">
      <text class="type-text">认证信息</text>
    </view>
    <view class="icourt-info">
      <view class="title"
        >{{ companyInfo.companyName }}
        <text class="re-do">重新认证</text>
      </view>
      <view class="company-no"
        >统一社会信用代码：{{ companyInfo.creditCode }}</view
      >
    </view>

    <view class="type-select-header">
      <text class="type-text">汇款细则</text>
    </view>
    <view class="tip-info">
      <view>1、汇款方必须为当前企业:{{ companyInfo.companyName }}</view>
      <view>2、汇款方必须使用对公账户进行汇款</view>
      <view
        >3、汇款方向汇入方汇出单笔金额为0.01元（一分钱）人民币，不能为其他金额或其他币种</view
      >
      <view>4、汇款金额作为企业实名专用,不做退还</view>
    </view>

    <view class="bottom-btn-container" @tap.stop="agree">
      <text class="next">阅读并同意以上细则</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      companyInfo: uni.getStorageSync('companyInfoApply'),
    }
  },

  components: {},
  props: {},

  onLoad() {
    // #ifdef  H5
    this.companyInfo = JSON.parse(localStorage.getItem('companyInfoApply'))
    // #endif

    // #ifndef  H5
    this.companyInfo = uni.getStorageSync('companyInfoApply')
    // #endif
  },

  onShareAppMessage() {},

  methods: {
    agree() {
      uni.navigateTo({
        url: '/pages/authentication/company/account-info/index',
      })
    },
  },
}
</script>
<style>
@import './index.css';
</style>
