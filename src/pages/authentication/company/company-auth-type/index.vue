<template>
<view class="company-type-select">
    <view class="type-select-header">
        <text class="type-text">请选择企业认证类型</text>
    </view>
    <view class="types-select-container">
        <view class="type-item" data-index="1" @tap.stop="goPage">
            <text>我是企业法定代表人 </text>
            <text style="color:#999999;font-weight:400">（即时认证）</text>
            <text class="right">
                <text>去认证</text>
                <text class="iconfont iconright-arrow"></text>
            </text>
            <view class="bottom-info" style="font-size:30rpx">
                <view>请确认你是企业法定代表人</view>
                <view>需要准备营业执照原件的高清照片</view>
            </view>

        </view>
        <view class="type-item" data-index="2" @tap.stop="goPage">
            <text>我是企业代理人</text>
            <text style="color:#999999;font-weight:400">（约0～3工作日）</text>
            <text class="right">
                <text>去认证</text>
                <text class="iconfont iconright-arrow"></text>
            </text>
            <view class="bottom-info" style="font-size:30rpx">
                <view>需要准备营业执照原件的高清照片</view>
                <view>需要准备对公银行账户及开户行信息</view>
            </view>
        </view>
    </view>
</view>
</template>

<script>

export default {
  data() {
    return {
      companyId: ''
    };
  },

  components: {},
  props: {},

  /**
   * 页面的初始数据
   */
  onLoad(option) {
    this.companyId = option.companyId
  },

  onShareAppMessage() {},

  methods: {
    goPage(e) {
      const index = e.currentTarget.dataset.index;

      if (index == 1) {
        uni.navigateTo({
          url: `/pages/authentication/company/company-info/index?type=legent&companyId=${this.companyId}`
        });
      } else {
        uni.navigateTo({
          url: `/pages/authentication/company/company-info/index?type=agent&companyId=${this.companyId}`
        });
      }
    }

  }
};
</script>
<style>
@import "./index.css";
</style>
