<template>
  <!--pages/collection/dirctCollection/receiptLaunch/receiptLaunch.wxml-->
  <view class="pageContent">
    <view class="header">
      <image
        src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/contract/receipt.png"
        class="icon"
      ></image>
      <view class="header-title">{{ title }}</view>
    </view>
    <view class="tip">{{ tip }}</view>
    <view class="amount">
      <view class="prefix">¥</view>
      <view class="receiveAmount">{{ receiveAmount }}</view>
      <view class="decimal">{{ decimal }}</view>
    </view>
    <view class="img">
      <image class="QR_code" :src="qrCodeUrl"></image>
    </view>
    <view class="count-down" v-if="delay"
      >二维码将在{{ hour }}小时<text v-if="minute < 10"> 0</text
      >{{ minute }}分钟后过期</view
    >
    <view class="count-down" v-if="!delay">二维码已过期，请重新发起收款</view>
    <view class="link" v-if="isTemplate == '1'">
      <view class="chained-address">{{ url }}</view>
      <view class="copy_link" @tap="copyBtn">复制链接</view>
    </view>
    <view class="title">收款信息</view>
    <view class="receiptMessage">{{ receiptMessage }}</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isTemplate: false,
      isCopySuccess: true,
      url: '',
      title: '合同收款',
      tip: '打开微信、支付宝扫码付钱',
      receiveAmount: '',
      decimal: '',
      receiptMessage: '',
      qrCodeUrl: '',
      countDownText: '',
      timer: null,
      hour: 1,
      minute: 58,
      delay: 118,
    }
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.receiveAmount = options.inputAmount.slice(
      0,
      options.inputAmount.indexOf('.')
    )
    this.decimal = options.inputAmount.slice(options.inputAmount.indexOf('.'))
    this.receiptMessage = options.receiptMessage
    this.qrCodeUrl = options.qrCodeUrl
    this.isTemplate = options.isTemplate
    this.url = options.url
    this.changeVaildTime()
    console.log(this.isTemplate)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    changeVaildTime() {
      let minute = 118
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        minute -= 1

        if (minute > 0) {
          this.hour = Math.floor(minute / 60)
          this.minute = this.delay = minute % 60
        } else {
          clearInterval(this.timer)
        }
      }, 60000)
    },

    copyBtn(e) {
      uni.setClipboardData({
        //去找上面的数据
        data: that.url,
        success: () => {
          setTimeout(() => {
            uni.showToast({
              title: '链接已复制',
            })
          }, 50)
        },
      })
      this.isCopySuccess = false
    },
  },
}
</script>
<style>
@import './dirctCollectionLaunch.css';
</style>
