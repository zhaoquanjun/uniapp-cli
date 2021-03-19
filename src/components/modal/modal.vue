<template>
<view class="modal-area" v-if="isShow">
  <view class="modal-wrapper">
    <view class="header">{{title}}</view>
    <view class="content">
      <scroll-view class="inner" scroll-y="true">
        <view v-for="(item, index) in content" :key="index" class="item">{{item}}</view>
      </scroll-view>
    </view>
    <view class="footer" @tap="handleCloseFun">知道了</view>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    content: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCloseFun() {
      this.$emit('triggerEvent');
    }

  }
};
</script>
<style>
@import "./modal.css";
</style>