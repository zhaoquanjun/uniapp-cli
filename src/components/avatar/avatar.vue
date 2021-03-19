<template>
<!--components/avatar/avatar.wxml-->
<view class="avatar-box">
  <view class="avatar-default" v-if="(!serverAvatarUrl || serverAvatarUrl.length <= 0) && (!localAvatarName || localAvatarName.length <= 0)">
    <image class="avatar-bg" src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/account/avatar_bg_icon.png"></image> 
    <view class="avatar-text-box">
      <view class="avatar-text" :style="'font-size:' + fontSize">{{text}}</view>
    </view>
  </view>
  <image class="avatar-custom" v-if="(serverAvatarUrl && serverAvatarUrl.length > 0) || (localAvatarName && localAvatarName.length > 0)" :src="(serverAvatarUrl && serverAvatarUrl.length > 0) ? serverAvatarUrl : localAvatarName"></image> 
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    text: {
      type: String,
      default: 'A'
    },
    serverAvatarUrl: {
      type: String,
      default: ''
    },
    localAvatarName: {
      type: String,
      default: ''
    },
    fontSize: {
      type: String,
      default: '40rpx'
    }
  },
  methods: {}
};
</script>
<style>
@import "./avatar.css";
</style>