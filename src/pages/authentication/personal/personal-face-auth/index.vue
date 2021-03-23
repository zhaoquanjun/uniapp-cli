<template>
<view class="personal-face-auth">
    <view class="type-select-header">
        <view class="type-text">个人信息</view>
        <view class="right" @tap="showSafeInfo">
          <image :src="safeIcon" class="safe-tip"></image>   
            安全声明
        </view>
    </view>
    <view class="base-info-container">

        <view class="field-item">
            <label class="name">姓名</label>
            <input class="value-input" placeholder="请输入姓名" v-model="name" />
        </view>
        <view class="field-item">
            <label class="name">证件类型</label>
            <label class="value-select">
                居民身份证
            </label>
        </view>
        <view class="field-item">
            <label class="name">证件号</label>
            <input class="value-input" placeholder="请输入证件号" v-model="idCard" />
        </view>
    </view>
    <view class="base-info-reminder">
      <label class="radio" @tap.stop="checkedTap">
      <radio value="r1" :checked="checked"></radio>
      </label>
      <view style="color:#999999; margin-top:4rpx">我已阅读并同意</view>
      <view style="color:#6E87B8; margin-top:4rpx" @tap="handleShowSecretFun">《隐私保护协议》</view>
    </view>

    <view class="bottom-btn-container">
        <text class="back" @tap="back">返回</text>
        <text class="next" @tap="chooseVideo" :style="'background:' + (ishighLight ? '#464646' : '#B7B7B7')">下一步</text>
    </view>
    <modal :content="warnTips" :title="warnTitle" :isShow="isShow" @triggerEvent="handleEmitFun"></modal>
</view>
</template>

<script>
import { get, postBody, upload } from '@api/request.js'
import { authFace, applyAuth } from '@api/authen.js'
import { get_user_info } from '@api/account.js'
import modal from "@c/modal/modal";
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      ishighLight: false,
      name: '',
      idCard: '',
      checked: false,
      warnTips: ['1、在您使用闪签账号签发文件前，您需要进行实名认证，实名认证需要提供您的真实姓名、身份证号码、手机号码；收集此类信息是纯属满足相关法律法规的实名制要求，若您不提供这类信息，您将无法完成实名认证，亦无法以实名身份签发文件。', '2、实名认证通过后会由权威CA机构为您颁发数字证书，我们会保留您的数字证书信息，此信息包含您的姓名、身份证件信息，以及为您申请的数字证书序列号，以便供您在签发文件时调用。若您不授权我们保存此信息，您将无法正常使用我们的签发服务。'],
      warnTitle: '隐私保护协议',
      isShow: false,
      isFinished: false,
      field: "",
      safeIcon: require('@s/authen/safe.png')
    };
  },
  components: {
    modal
  },
  onLoad: function (options) {
    uni.getLocation({
      type: 'wgs84',
      success: function (location) {
        uni.setStorageSync('location', location);
      },
      fail: function (errorRes) {
        setTimeout(() => {
          uni.showToast({
            icon: "none",
            title: "获取位置信息失败，您的认证将不能使用，请允许获取位置信息"
          });
        }, 50);
      }
    });
  },
  computed: {
    ...mapState({
      currentUser: state => state.currentUser
    }),
    ishighLight() {
      return !(!this.name || !this.idCard || !this.checked)
    }
  },
  methods: {
    ...mapMutations(['updateStateAttr']),
    handleShowSecretFun() {
      this.isShow =true
    },

    handleEmitFun() {
      this.isShow = false
    },

    checkedTap() {
      this.checked = !this.checked
    },

    showSafeInfo() {
      uni.showModal({
        title: '个人身份隐私安全声明',
        showCancel: false,
        confirmText: '知道了',
        content: '您输入的身份信息仅用于个人实名认证和获取CA认证证书'
      });
    },

    videoAuth(tmpUrl) {
      uni.showLoading({
        title: '认证中'
      });
      upload({
        url: authFace,
        filePath: tmpUrl,
        key: 'faceVideo',
        success: res => {
          console.log(res);
          this.isFinished = true
          get({
            url: get_user_info,
            success: res => {
              let newUser = JSON.parse(JSON.stringify(this.currentUser))
              newUser.auth = 1;
              this.updateStateAttr({currentUser: newUser, isAuth: true})
            },
            complete: () => {
              uni.hideLoading();
              uni.navigateTo({
                url: '/pages/authentication/personal/auth-result/index?result=s&type=face'
              });
            }
          });
        },
        fail: function (err) {
          uni.hideLoading();
          uni.navigateTo({
            url: '/pages/authentication/personal/auth-result/index?result=f&type=face&desc=' + err
          });
        }
      });
    },

    chooseVideo() {
      let mgs = [];

      if (!this.name) {
        mgs.push('姓名');
      }

      if (!this.idCard) {
        mgs.push('证件号');
      }

      if (mgs.length) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: mgs.join('、') + '不能为空'
          });
        }, 50);
      }

      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

      if (!reg.test(this.idCard)) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请输入正确的身份证号码'
          });
        }, 50);
      }

      if (!this.checked) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请阅读并同意《隐私保护协议》'
          });
        }, 50);
      }

      if (this.isFinished) return;

      uni.setStorageSync('personInfo', {
        name: this.name,
        idCard: this.idCard
      });
      
      uni.showLoading({
        title: '加载中'
      });
      postBody({
        url: applyAuth,
        params: {
          name: this.name,
          idCard: this.idCard
        },
        success: res => {
          console.log(res);
          uni.chooseMedia({
            count: 1,
            mediaType: ['video'],
            sourceType: ['camera'],
            maxDuration: 10,
            camera: 'front',

            success: res => {
              uni.hideLoading();
              this.videoAuth(res.tempFiles[0].tempFilePath);
            }

          });
        },
        fail: err => {
          console.log(err);
          uni.hideLoading();
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: err,
              duration: 5000
            });
          }, 50);
        },
        complete: function () {
          uni.hideLoading();
        }
      });
    },
    back() {
      uni.navigateBack();
    }

  }
};
</script>
<style>
@import "./index.css";
</style>
