<template>
  <view>
    <web-view :src="webSrc" @load="webLoadSuc" @error="webLoadErr"></web-view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      webSrc: '',
      developmentWebSrc: 'https://dev.shanqian.cn/miniPreview',
      productionWebSrc: 'https://shanqian.cn/miniPreview',
      templateId: '',
      id: '',
    }
  },
  onLoad: function(options) {
    this.templateId = options.templateId
    this.id = options.id
  },
  onShow: function() {
    this.webSrc =
      this[process.env.NODE_ENV + 'WebSrc'] +
      '?templateId=' +
      this.templateId +
      '&id=' +
      this.id +
      '&token=' +
      this.userToken
    if (this.currentUser && this.currentUser.companyId) {
      this.webSrc += '&companyId=' + this.currentUser.companyId
    }
  },
  computed: {
    ...mapState({
      userToken: (state) => state.userToken,
      currentUser: (state) => state.currentUser,
    }),
  },
  methods: {
    webLoadSuc(e) {
      console.log(e)
    },

    webLoadErr(e) {
      console.log(e)
    },

    back() {
      uni.navigateBack()
    },
  },
}
</script>
<style>
@import './index.css';
</style>
