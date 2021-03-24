<template>
<view class="receive-card--page">
  <image class="page-bg" :src="bg" mode="widthFix"></image>
  <view class="content">
    <view class="label">手机号</view>
    <input placeholder="请输入手机号" maxlength="11" class="input-block" type="number" v-model="tel" />
    <view class="label">验证码</view>
    <view class="input-area">
      <input placeholder="请输入验证码" maxlength="6" class="yzm-input" type="number" v-model="yzm" />
      <view class="get-code" @tap="handleGetCodeFun">{{btnWords}}</view>
    </view>
    <view class="get-card-btn" @tap="handlePcLoginFun">手机号登录领取</view>
    <view class="divider">
      <view class="line"></view>
      <view class="tips">其他方式登录</view>
      <view class="line"></view>
    </view>
    <view class="wx-login-btn">
      <button class="wx-login" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信登录</button>
      <!--  #ifdef  MP-WEIXIN -->
      <image class="wx-logo" :src="wx_icon" mode="aspectFit"></image>
      <view class="btn-words">微信授权登录</view>
      <!--  #endif -->

      <!--  #ifdef  MP-ALIPAY -->
      <image class="wx-logo" :src="zfb_icon" mode="aspectFit"></image>
      <view class="btn-words">支付宝授权登录</view>
      <!--  #endif -->
      
    </view>
  </view>
</view>
</template>

<script>
	import {get, post} from '@api/request.js'
	import { get_gift_card_from_wx, get_gift_card_status } from '@api/cost.js'
	import { get_register_sms_code_url, pc_login, get_phone_wx_code, decode_phone } from '@api/account.js'
  var utils = require("@u/utils.js");
  import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      tel: '',
      yzm: '',
      cardId: '',
      btnWords: "获取验证码",
      time: 60,
      timer: null,
      bg: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/receive_card_bg.png',
      wx_icon: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/wx_logo.png',
      zfb_icon: 'http://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/zfb_logo.png',
      wxCode: '',
      openId: '',
      unionId: '',
      loginPhone: '',
      isShowMark: false,
      originType: null,
      isBindOpenId: true,
      bandPhone: ''
    };
  },
  onLoad: function (options) {
    if (options.gifCardId) this.cardId = options.gifCardId
  },
  onShow: function () {
    if (this.userToken) {
      this.getGiftCardStatusFun(this.getGiftCardFun);
    }
  },
  onShareAppMessage: function () {},
  computed: {
    ...mapState({
      userToken: state => state.userToken
    })
  },
  methods: {
    ...mapMutations(['loginSuccess']),
    /**
     * @name 获取验证码
     */
    handleGetCodeFun() {
      console.log(this.tel);

      if (!utils.isTelCode(this.tel)) {
        setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请输入正确手机号'
          });
        }, 50);
        return false;
      }

      if (this.timer) {
        setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '验证码已发送，请耐心等待'
          });
        }, 50);
        return false;
      }

      uni.showLoading({
        title: '获取中'
      });
      get({
        url: get_register_sms_code_url + '/' + this.tel,
        success: () => {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '发送成功,请注意查收'
            });
          }, 50);
          this.timer = setInterval(() => {
              if (this.time >= 1) {
                let curTime = this.time - 1;
                this.time = curTime
                this.btnWords = curTime + 's后再次获取'
              } else {
                clearInterval(this.timer);
                this.time = 60
                this.timer = null
                this.btnWords = '获取验证码'
              }
            }, 1000)
        },
        fail: err => {
          setTimeout(() => {
            uni.showToast({
              title: err,
              icon: "none"
            });
          }, 50);
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    },

    /**
     * @name pc登录
     */
    handlePcLoginFun() {
      uni.showLoading({
        title: '登录领取中'
      });
      const options = {
        phone: this.tel,
        phoneCode: this.yzm
      };
      post({
        url: pc_login,
        params: options,
        success: res => {
          this.loginSuccess(res)
          this.getGiftCardStatusFun(this.getGiftCardFun);
        },
        fail: () => {
          setTimeout(() => {
            uni.showToast({
              title: '领取失败',
              icon: "none"
            });
          }, 100);
        }
      });
    },

    /**
     * @name 微信登陆
     * @param {*} callback 回调
     */
    loginWxFun(callback) {
      uni.login({
        success: res => {
          if (res.code) {
            this.wxCode = res.code
            typeof callback == 'function' && callback();
          } else {
            setTimeout(() => {
              uni.showToast({
                icon: 'none',
                title: '请先授权微信登陆'
              });
            }, 50);
          }
        },
        fail: function () {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '请先授权微信登陆'
            });
          }, 50);
        }
      });
    },

    handleLoginByPhoneFun() {
      this.loginWxFun(() => {
        this.getUserRegisterInfoFun();
      });
    },

    /**
     * 根据code获取用户是否已经注册
     */
    getUserRegisterInfoFun() {
      get({
        url: get_phone_wx_code + '/' + this.wxCode + '?wxAppType=2',
        success: data => {
          if (data.isRegister) {
            this.bandPhone = data.phone
            this.openId = data.openId
            this.unionId = data.unionId
            this.isBindOpenId = true
            uni.navigateTo({
              url: "/pages/account/loginVerify/loginVerify?phone=" + this.bandPhone + "&unionId=" + this.unionId + "&openId=" + this.openId + "&originType=" + this.originType
            });
          } else {
            setTimeout(() => {
              uni.showToast({
                icon: 'none',
                title: '信息获取失败，请授权登录',
                duration: 3000
              });
            }, 50);
            this.isBindOpenId = false
          }
        },
        fail: err => {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '登陆信息获取失败：' + err
            });
          }, 50);
          this.isBindOpenId = false
        }
      });
    },

    /**
     * @name 通过按钮获取参数，请求后台获取手机号以及微信信息
     */
    getPhoneNumber(e) {
      if ("getPhoneNumber:ok" != e.detail.errMsg) {
        setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '快捷登陆失败'
          });
        }, 50);
        return;
      }

      this.loginWxFun(() => {
        this.getPhoneFun(e);
      });
    },

    /**
     * @name 获取手机号以及微信信息
     * @param {*} e 
     */
    getPhoneFun(e) {
      post({
        url: decode_phone,
        params: {
          encrypted: e.detail.encryptedData,
          iv: e.detail.iv,
          code: this.wxCode,
          wxAppType: 2
        },
        success: data => {
          //判断用户是否已经注册
          this.bandPhone = data.phone
          this.loginPhone = data.phone
          this.openId = data.openId
          this.unionId = data.unionId
          this.isShowMark = true
          this.isBindOpenId = true
          uni.navigateTo({
            url: "/pages/account/loginVerify/loginVerify?phone=" + data.phone + "&unionId=" + data.unionId + "&openId=" + data.openId + '&isCard=true&cardId=' + this.cardId
          });
        },
        fail: msg => {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: msg
            });
          }, 50);
        }
      });
    },

    /**
     * @name 输入验证码
     */
    handleInputYzmFun(e) {
      this.yzm = e.detail.value
      return e.detail.value;
    },

    /**
     * @name 领取礼品卡
     */
    getGiftCardFun() {
      uni.showLoading({
        title: '领取中'
      });
      get({
        url: get_gift_card_from_wx + this.cardId,
        success: res => {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '礼品卡领取成功'
            });
          }, 50);
          setTimeout(() => {
            uni.redirectTo({
              url: '/pages/costManage/accountBalance/accountBalance?type=3'
            });
          }, 2500);
        },
        fail: err => {
          console.log(err);
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: err
            });
          }, 50);
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    },

    /**
     * @name 获取礼品卡状态
     */
    getGiftCardStatusFun(callback) {
     get({
        url: get_gift_card_status + this.cardId,
        success: res => {
          console.log(res);

          if (!res) {
            setTimeout(() => {
              uni.showToast({
                icon: 'none',
                title: '礼品卡已被领取'
              });
            }, 50);
            setTimeout(() => {
              uni.switchTab({
                url: '/pages/home/home'
              });
            }, 1500);
          } else {
            typeof callback == 'function' && callback();
          }
        },
        fail: err => {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: err
            });
          }, 50);
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/home/home'
            });
          }, 1500);
        }
      });
    }

  }
};
</script>
<style>
@import "./receiveCard.css";
</style>
