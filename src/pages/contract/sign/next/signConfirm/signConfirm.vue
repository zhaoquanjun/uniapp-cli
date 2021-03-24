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
      developmentWebSrc: 'https://dev.shanqian.cn/miniSign',
      productionWebSrc: 'https://shanqian.cn/miniSign',
      contractId: ''
    }
  },
  onLoad: function(options) {
    console.log(options)
    this.contractId = options.contractId
  },
  onShow() {
    let str =
      this[process.env.NODE_ENV + 'WebSrc'] +
      '?userId=' +
      this.userId +
      '&contractId=' +
      this.contractId +
      '&token=' +
      this.userToken
    if (this.currentUser && this.currentUser.companyId) {
      console.log(currentUser.companyId, 'companyId---')
      str +=
        '&phone=' +
        this.phone +
        '&companyId=' +
        this.currentUser.companyId +
        '&type=' +
        'company' +
        '&roleType=' +
        this.currentUser.roleTypes
    } else {
      str += '&phone=' + this.currentUser.account + '&type=' + 'signal'
    }
    console.log(str)
    this.webSrc = str
  },
  onUnload: function() {
    const pages = getCurrentPages()
    if (pages.length.length > 2 && pages[pages.length - 2].route == 'pages/contract/sign/next/next') {
      uni.reLaunch({
        url:
          '/pages/contract/contractList/contract?searchType=1&pageTitle=我发起的',
      })
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.currentUser,
      userId: (state) => state.userId,
      userToken: (state) => state.userToken,
      phone: state => state.userAccount
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
@import './signConfirm.css';
</style>
