<template>
  <view :class="'message-box ' + (wrapperShow ? 'show' : '')">
    <view class="mask" @tap="hide"></view>
    <view :class="'message-wrapper ' + (contentShow ? 'contentShow' : '')">
      <view class="header">{{ messageInfo.title }}</view>
      <view class="content">
        <scroll-view class="inner" scroll-y="true">
          <view class="item">{{ messageInfo.content }}</view>
        </scroll-view>
      </view>
      <view class="footer" @tap="hide">{{ messageInfo.btnWords }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      wrapperShow: false,
      contentShow: false,
      timer: null,
    }
  },

  components: {},
  props: {
    messageInfo: {
      type: Object,
      default: () => ({
        title: '',
        content: '',
        btnWords: '知道了',
      }),
    },
  },
  methods: {
    hide() {
      if (this.timer) clearTimeout(this.timer)
      this.contentShow = false
      this.timer = setTimeout(() => {
        this.wrapperShow = false
      }, 20)
    },

    show() {
      if (this.timer) clearTimeout(this.timer)
      this.wrapperShow = true
      this.timer = setTimeout(() => {
        this.contentShow = true
      }, 20)
    },
  },
}
</script>
<style>
@import './messageBox.css';
</style>
