<template>
<view class="personal-info">
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
            <input class="value-input" placeholder="请输入姓名" @input="bindKeyInput" :value="name" data-field="name"></input>
        </view>
        <view class="field-item">
            <label class="name">证件类型</label>
            <label class="value-select">
                居民身份证
                <text class="one one-arrow-down"></text>
            </label>
        </view>
        <view class="field-item">
            <label class="name">证件号</label>
            <input class="value-input" placeholder="请输入证件号" @input="bindKeyInput" :value="idCard" data-field="idCard"></input>
        </view>
    </view>    
        <view class="field-item-division"></view>
    <view class="base-info-container">
        <view class="field-item">
            <label class="name">手机号</label>
            <input class="value-input" placeholder="请输入手机号" @input="bindKeyInput" :value="phone" data-field="phone"></input>
        </view>
        <view class="field-item">
            <label class="name">验证码</label>
            <input class="value-input" placeholder="请输入验证码" @input="bindKeyInput" data-field="phoneCode"></input>
            <label class="code-line"></label>
            <label class="get-code" @tap="getPhoneCode">
                {{smsButtonText}}</label>
        </view>
    </view>
    <view class="base-info-reminder">
      <label class="radio" @tap.stop="checkedTap">
      <radio value="r1" :checked="checked"></radio>
      </label>
      <view style="color:#999999;margin-top:4rpx">我已阅读并同意</view>
      <view style="color:#6E87B8;margin-top:4rpx" @tap="handleShowSecretFun">《隐私保护协议》</view>
    </view>
    <view class="bottom-btn-container">
        <text class="back" @tap="back">返回</text>
        <text class="next" @tap="next" :style="'background:' + (ishighLight ? '#464646' : '#B7B7B7')">下一步</text>
    </view>

    <modal :content="warnTips" :title="warnTitle" :isShow="isShow" @triggerEvent="handleEmitFun"></modal>

</view>
</template>

<script>
import { get, postBody } from '@api/request.js'
import { smsSend, authPhone } from '@api/authen.js'
import { get_user_info } from '@api/account.js'
import modal from "@c/modal/modal";

export default {
  data() {
    return {
      ishighLight: false,
      smsButtonText: '获取验证码',
      name: '',
      idCard: '',
      userId: '',
      phone: '',
      phoneCode: '',
      checked: false,
      warnTips: ['1、在您使用闪签账号签发文件前，您需要进行实名认证，实名认证需要提供您的真实姓名、身份证号码、手机号码；收集此类信息是纯属满足相关法律法规的实名制要求，若您不提供这类信息，您将无法完成实名认证，亦无法以实名身份签发文件。', '2、实名认证通过后会由权威CA机构为您颁发数字证书，我们会保留您的数字证书信息，此信息包含您的姓名、身份证件信息，以及为您申请的数字证书序列号，以便供您在签发文件时调用。若您不授权我们保存此信息，您将无法正常使用我们的签发服务。'],
      warnTitle: '隐私保护协议',
      isShow: false,
      field: "",
      codeTime: "",
      safeIcon: require('@s/authen/safe.png')
    };
  },

  components: {
    modal
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  onShareAppMessage() {},

  methods: {
    handleShowSecretFun() {
      this.isShow = true
    },

    handleEmitFun() {
      this.isShow = false
    },

    showSafeInfo() {
      uni.showModal({
        title: '个人身份隐私安全声明',
        showCancel: false,
        confirmText: '知道了',
        content: '您输入的身份信息仅用于个人实名认证和获取CA认证证书'
      });
    },

    checkedTap: function () {
      this.checked = !this.checked
      const {
        name,
        idCard,
        checked,
        phone,
        phoneCode
      } = this;

      if (name == undefined || name == '' || idCard == undefined || idCard == "" || checked == null || phone == '' || phone == undefined || phoneCode == '' || phoneCode == undefined) {
        this.ishighLight = false
      } else {
        this.ishighLight = true
      }
    },

    bindKeyInput(e) {
      const {
        name,
        idCard,
        checked,
        phone,
        phoneCode
      } = this;
      const {
        field
      } = e.target.dataset;
      const {
        value
      } = e.detail;
      
      this[field] = value

      if (name == undefined || name == '' || idCard == undefined || idCard == "" || checked == null || phone == '' || phone == undefined || phoneCode == '' || phoneCode == undefined) {
        this.ishighLight = false
      } else {
        this.ishighLight = true
      }
    },

    changeCodeText() {
      let codeTime = 60;
      const timer = setInterval(() => {
        codeTime -= 1;

        if (codeTime > 0) {
          this.smsButtonText = `重新获取 ${codeTime}s`
          this.codeTime = codeTime
          
        } else {
          clearInterval(timer);
          this.smsButtonText = '重新获取'
          this.codeTime = codeTime
        }
      }, 1000);
    },

    getPhoneCode() {
      const {
        phone,
        codeTime
      } = this;
      const that = this;

      if (codeTime) {
        return;
      }

      if (!phone) {
        setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请输入正确的手机号码'
          });
        }, 50);
        return false;
      }

      uni.showLoading({
        title: '加载中...'
      });
      get({
        url: smsSend + phone,
        success: function () {
          uni.hideLoading();
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '短信验证码发送成功'
            }, 50);
          });
          that.changeCodeText();
        },
        fail: function () {
          uni.hideLoading();
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '短信验证码发送失败'
            });
          }, 50);
        }
      });
    },

    back() {
      uni.navigateBack();
    },

    next() {
      const {
        name,
        idCard,
        phone,
        phoneCode,
        checked
      } = this;
      let mgs = [];

      if (!name) {
        mgs.push('姓名');
      }

      if (!idCard) {
        mgs.push('证件号');
      }

      if (!phone) {
        mgs.push('手机号');
      }

      if (!phoneCode) {
        mgs.push('验证码');
      }

      if (mgs.length) {
        setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: mgs.join('、') + '不能为空'
          });
        }, 50);
        return false;
      }

      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

      if (!reg.test(idCard)) {
        setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请输入正确的身份证号码'
          });
        }, 50);
        return false;
      }

      if (checked == false) {
        console.log("name");
        setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请阅读并同意《隐私保护协议》'
          });
        }, 50);
        return false;
      }

      uni.showLoading({
        title: '加载中'
      });
      uni.setStorageSync('personInfo', {
        name,
        idCard,
        phone
      });
      postBody({
        url: `${authPhone}?phoneCode=${phoneCode}`,
        params: {
          name,
          idCard,
          phone
        },
        success: function (res) {
          console.log(res);
          uni.hideLoading();
          get({
            url: get_user_info,
            success: function (res) {
              let currentUser = uni.getStorageSync('currentUser');
              currentUser.name = res.name;
              currentUser.auth = 1;
              uni.setStorageSync('currentUser', currentUser);
            }
          });
          uni.navigateTo({
            url: '/pages/authentication/personal/auth-result/index?result=s&type=phone'
          });
        },
        fail: function (err) {
          console.log(err);
          uni.hideLoading();
          uni.navigateTo({
            url: '/pages/authentication/personal/auth-result/index?result=f&type=phone&desc=' + err
          });
        }
      });
    }

  }
};
</script>
<style>
@import "./index.css";
</style>
