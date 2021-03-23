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
      developmentWebSrc: 'https://dev.shanqian.cn/miniFill',
      productionWebSrc: 'https://shanqian.cn/miniFill',
      contractId: ''
    }
  },
  onLoad(options) {
    this.contractId = options.contractId ?? ''
  },
  onShow() {
    let str =
      this[process.env.NODE_ENV + 'WebSrc'] +
      '?contractId=' +
      this.contractId +
      '&token=' +
      this.userToken
    if (this.currentUser && this.currentUser.companyId) {
      str += '&companyId=' + this.currentUser.companyId
    }
    this.webSrc = str
  },
  onUnload: function() {
    const pages = getCurrentPages()
    if (
      pages.length > 2 && pages[pages.length - 2].route ==
      'pages/template/contractTemplate/contractTemplate'
    ) {
      uni.redirectTo({
        url: '/pages/template/contractTemplate/contractTemplate',
      })
    }
  },
  computed: {
    ...mapState({
      userToken: (state) => state.userToken,
      currentUser: (state) => state.currentUser,
    }),
  },
  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
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
@import './fill.css';
</style>
