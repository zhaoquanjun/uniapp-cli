<template>
  <view>
    <view class="personal-auth-result" v-if="result == 'f'">
      <view class="result-top">
        <view class="icon-container">
          <text class="iconfont iconwarningo"></text>
        </view>
        <view class="result-text">认证失败</view>
        <view class="result-reason">{{ desc }}</view>
      </view>
      <view class="type-select-header">
        <text class="type-text">核对身份信息</text>
      </view>
      <view class="base-info-container">
        <view class="field-item">
          <label class="name">姓名</label>
          <text class="value-input">{{ userInfo.name }}</text>
        </view>
        <view class="line"></view>
        <view class="field-item">
          <label class="name">证件类型</label>
          <label class="value-select">
            居民身份证
          </label>
        </view>
        <view class="line"></view>
        <view class="field-item">
          <label class="name">证件号</label>
          <text class="value-input">{{ userInfo.idCard }}</text>
        </view>
        <view class="line" v-if="type == 'phone'"></view>
        <view class="field-item" v-if="type == 'phone'">
          <label class="name">手机号</label>
          <text class="value-input">{{ userInfo.phone }}</text>
        </view>
      </view>

      <view
        class="bottom-btn-container"
        @tap.stop="reDo"
        style="margin-top:194rpx"
      >
        <text class="next">修改信息重新认证</text>
      </view>
    </view>

    <view
      class="personal-auth-result"
      v-if="result == 's'"
      style="height:1800rpx; background:#ffffff"
    >
      <view class="result-top">
        <view class="icon-container">
          <text class="iconfont iconSuccess success"></text>
        </view>
        <view class="result-text">认证成功</view>
        <view class="result-reason"
          >{{
            type === 'phone' ? '手机' : '人脸'
          }}对比通过，可以进行合同签署</view
        >
      </view>
      <view
        class="bottom-btn-container"
        @tap.stop="goSign"
        style="margin-top:50rpx"
      >
        <text class="next">发起合同签署</text>
      </view>
    </view>

    <canvas
      id="myCanvas"
      canvas-id="myCanvas"
      style="z-index: -11; opacity: 0; visiblity: hidden; position: absolute; left: -100%; top: -100%; width: 300px; height: 300px;"
    ></canvas>
  </view>
</template>

<script>
const FXQ = require('@u/FXQ')
import { postBody } from '@api/request.js'
import { create_seal, upload_person_seal } from '@api/seal.js'
var app = getApp()

export default {
  data() {
    return {
      type: '',
      userInfo: {},
      result: 's',
      desc: '',
    }
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.type = options.type
    this.result = options.result
    this.desc = options.desc
    this.userInfo = uni.getStorageSync('personInfo')
    options.result == 's' && this.getSealBase64Fun()
  },

  onShareAppMessage() {},

  methods: {
    showSafeInfo() {
      uni.showModal({
        title: '个人身份隐私安全声明',
        showCancel: false,
        confirmText: '知道了',
        content: '您输入的身份信息仅用于个人实名认证和获取CA认证证书',
      })
    },

    reDo() {
      uni.navigateBack()
    },

    goSign() {
      getApp().updateUserInfo(() => {
        uni.reLaunch({
          url: '/pages/home/home',
        })
      })
    },

    /**
     * @name 生成base
     */
    getSealBase64Fun() {
      const selectColor = 0 // 0:红色 1:蓝色 2:黑色

      FXQ.FXQ.personal(
        this.userInfo.name || '个人',
        selectColor,
        3,
        1,
        0,
        this.createSealFun
      )
    },

    /**
     * @name 生成印章
     */
    createSealFun(base64) {
      postBody({
        url: create_seal,
        params: {
          base64String: base64,
        },
        success: (res) => {
          this.uploadPersonalSealFun(res)
        },
        fail: (err) => {
          console.log(err)
        },
      })
    },

    /**
     * @name 上传印章
     * @param {*} url path
     */
    uploadPersonalSealFun(data) {
      let options = {
        name: '个人印章',
        url: data.url,
        originType: 4,
      }
      postBody({
        url: upload_person_seal,
        params: options,
        success: () => {
          console.log('印章制作完成')
        },
        fail: (error) => {
          uni.hideLoading()
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: error,
            })
          }, 50)
        },
      })
    },
  },
}
</script>
<style>
@import './index.css';
</style>
