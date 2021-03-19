<template>
<view class="personal-auth-type">
    <view class="type-select-header">
        <text class="type-text">请选择个人认证方式</text>
    </view>
    <view class="types-select-container">
        <view class="type-item" @tap.stop="goPage" data-index="1">
            <text data-index="1">人脸识别认证</text>
            <text class="right" data-index="1">
                <text>去认证</text>
                <text class="iconfont iconright-arrow"></text>
            </text>
        </view>
        <view class="type-item" @tap.stop="goPage" data-index="2">
            <text data-index="2">手机号认证</text>
            <text class="right" data-index="2">
                <text>去认证</text>
                <text class="iconfont iconright-arrow"></text>
            </text>
        </view>
    </view>
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {},

  onLoad() {
    uni.getLocation({
      type: 'wgs84',
      success: function (location) {
        uni.setStorageSync('location', location);
      },
      fail: function (errorRes) {
        setTimeout(() => {
          uni.showToast({
            icon: "none",
            title: "获取位置信息失败，您的认证将不能使用，请允许获取位置信息"
          });
        }, 50);
      }
    });
  },

  onShareAppMessage() {},

  methods: {
    goPage(e) {
      let {
        index
      } = e.target.dataset;

      if (index == 1) {
        uni.navigateTo({
          url: '/pages/authentication/personal/personal-face-auth/index'
        });
      } else {
        uni.navigateTo({
          url: '/pages/authentication/personal/personal-phone-auth/index'
        });
      }
    }

  }
};
</script>
<style>
@import "./index.css";
</style>