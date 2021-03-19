<template>
<!--components/wechatUserInfo/wechatUserInfo.wxml-->
<view class="we-box" catchtouchmove="preventMove" v-if="show">
  <view class="alert-box" v-if="canIUse">
    <view>点击授权，同意获取您的微信信息</view>
    <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo" class="auth-btn">授权</button>
  </view>
  <view class="update-tip" v-else>请升级微信版本</view>
</view>
</template>

<script>

export default {
  data() {
    return {
      canIUse: uni.canIUse('button.open-type.getUserInfo')
    };
  },

  components: {},
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    bindGetUserInfo: function (e) {
      this.$emit('getWechatUserInfo', {
        detail: e.detail.userInfo
      });
    },
    preventMove: function () {//prevent body move
    }
  }
};
</script>
<style>
@import "./wechatUserInfo.css";
</style>