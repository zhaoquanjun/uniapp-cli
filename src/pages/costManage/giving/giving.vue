<template>
<view class="giving-page">
	<view class="giving-content">
		<view class="user-type flex-box">
			<image :src="shanqian_icon" mode="aspectFit"></image>
			<text>闪签用户</text>
		</view>
		<view class="type-select flex-box" @tap="handleSelectWayFun">
			<view class="label">账户类型</view>
			<view class="value">{{accountList[activeIndex].label}}</view>
			<view class="trangle"></view>
		</view>
		<view class="signal" v-if="activeIndex == 0">
			<view class="user-phone has-isAuth flex-box">
				<view class="label">手机号</view>
				<view class="value input-area">
					<input maxlength="11" type="number" :class="personalAuthStatus == 2 ? 'has-long-result' : personalAuthStatus == 0  ? 'has-result' : personalAuthStatus == 1 ? 'has-result-auth' : ''" placeholder="请输入对方手机号" @input="handleInputPhoneFun" data-type="signal" @blur="handleBlurPhoneInputFun"></input>
					<view :class="'is-auth ' + ((personalAuthStatus == 0 || personalAuthStatus == 2) ? 'no-auth' : personalAuthStatus == 1 ? 'already-auth' : '')">{{personalAuthStatus == 0 ? '未认证' : personalAuthStatus == 1 ? '已认证' : personalAuthStatus == 2 ? '已注册未认证' : ''}}</view>
					<view :class="'user-name ' + (personalAuthStatus == 2 ? 'has-long-result' : (personalAuthStatus == 0 || personalAuthStatus == 1) ? 'has-result' : '')">{{userName}}</view>
				</view>
			</view>
		</view>
		<view class="company" v-if="activeIndex == 1">
			<view class="user-company has-isAuth flex-box">
				<view class="label">企业名称</view>
				<view class="value input-area">
					<input :class="companyAuthStatus == 2 ? 'has-long-result' : (companyAuthStatus == 0 || companyAuthStatus == 1)  ? 'has-result' : ''" placeholder="请输入对方企业名称" @blur="handleBlurCompanyNameInputFun" @input="handleInputCompanyNameFun"></input>
					<view :class="'is-auth ' + ((companyAuthStatus == 0 || companyAuthStatus == 2) ? 'no-auth' : companyAuthStatus == 1 ? 'already-auth' : '')">{{companyAuthStatus == 0 ? '未认证' : companyAuthStatus == 1 ? '已认证' : companyAuthStatus == 2 ? '已注册未认证' : ''}}</view>
					<view :class="'user-name ' + (companyAuthStatus == 2 ? 'has-long-result' : (companyAuthStatus == 0 || companyAuthStatus == 1) ? 'has-result' : '')">{{userName}}</view>
				</view>
			</view>
			<view class="user-phone has-isAuth flex-box">
				<view class="label">经办人手机号</view>
				<view class="value input-area">
					<input maxlength="11" type="number" :class="companyPersonAuthStatus == 2 ? 'has-long-result' : companyPersonAuthStatus == 0 ? 'has-result' : companyPersonAuthStatus == 1 ? 'has-result-auth' : ''" placeholder="请输入经办人手机号" @input="handleInputPhoneFun" data-type="company" @blur="handleBlurPhoneInputFun"></input>
					<view :class="'is-auth ' + ((companyPersonAuthStatus == 0 || companyPersonAuthStatus == 2) ? 'no-auth' : companyPersonAuthStatus == 1 ? 'already-auth' : '')">{{companyPersonAuthStatus == 0 ? '未认证' : companyPersonAuthStatus == 1 ? '已认证' : companyPersonAuthStatus == 2 ? '已注册未认证' : ''}}</view>
					<view :class="'user-name ' + (companyPersonAuthStatus == 2 ? 'has-long-result' : (companyPersonAuthStatus == 0 || companyPersonAuthStatus == 1) ? 'has-result' : '')">{{companyUserName}}</view>
				</view>
			</view>
		</view>
	</view>
  <view class="confirm-btn" @tap="handleConfirmSendFun">确认赠送</view>
	<slider-picker ref="sliderPicker" :sliderList="accountList" @selectWay="handleSelectAccoutFun"></slider-picker>
</view>
</template>

<script>
import { get, postBody } from '@api/request.js'
import { get_personal_auth_status, get_company_auth_status, send_by_buy, send_card_directive } from '@api/cost.js'
var utils = require("@u/utils");
import sliderPicker from "@c/sliderPicker/sliderPicker";

export default {
  data() {
    return {
      shanqian_icon: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/shanqian_icon.png',
      accountList: [{
        label: '个人账户',
        type: 'signal'
      }, {
        label: '企业账户',
        type: 'company'
      }],
      origin: 'give',
      id: '',
      money: 0,
      activeIndex: 0,
      userName: '',
      companyUserName: '',
      personPhone: '',
      companyPhone: '',
      companyName: '',
      personalAuthStatus: -1,
      companyPersonAuthStatus: -1,
      companyAuthStatus: -1
    };
  },

  components: {
    sliderPicker
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.origin) {
      this.origin = options.origin
    }

    if (options.id) {
      this.id = options.id
    }

    if (options.money) {
      console.log(options);
      this.money = options.money
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    /**
     * @name 选择账户点击事件
     */
    handleSelectWayFun() {
      this.$refs.sliderPicker.show();
    },

    /**
     * @name 选择完毕账户类型
     */
    handleSelectAccoutFun(e) {
      this.activeIndex = e.detail
      this.$refs.sliderPicker.hide();
    },

    /**
     * @name 输入手机号
     */
    handleInputPhoneFun(e) {
      return e.detail.value;
    },

    /**
     * @name 手机号input 失去焦点
     */
    handleBlurPhoneInputFun(e) {
      const type = e.currentTarget.dataset.type;
      const value = e.detail.value;

      if (!utils.isTelCode(value)) {
        setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请输入正确的手机号'
          });
        }, 50);
        return false;
      } else {
        // 校验是否认证 signal-> 个人 company->企业经办人
        if (type == 'signal') {
          this.personPhone = value
          this.personalIsAuthFun(value, 'signal');
        }

        if (type == 'company') {
          this.companyPhone = value
          this.personalIsAuthFun(value, 'company');
        }
      }
    },

    /**
     * @name 公司名称input blur事件
     */
    handleBlurCompanyNameInputFun(e) {
      const value = e.detail.value;
      this.companyName = value
      this.comapnyIsAuthFun(value);
    },

    handleInputCompanyNameFun(e) {
      const value = e.detail.value;
      this.companyName = value
      return value;
    },

    /**
     * @name 手机号校验人是否认证
     */
    personalIsAuthFun(phone, type) {
      uni.showLoading({
        title: '查询中'
      });
      get({
        url: get_personal_auth_status + '?phone=' + phone,
        success: res => {
          if (type == 'signal') {
            if (res == 0 || res == 2) {
              this.personalAuthStatus = res
              this.userName = ''
            } else {
              this.personalAuthStatus = 1
              this.userName = res
            }
          }

          if (type == 'company') {
            if (res == 0 || res == 2) {
              this.companyPersonAuthStatus = res
              this.companyUserName = ''
            } else {
              this.companyPersonAuthStatus = 1
              this.companyUserName = res
            }
          }
        },
        fail: err => {
          console.log(err);
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    },

    /**
     * @name 公司名称校验公司是否认证
     */
    comapnyIsAuthFun(name) {
      uni.showLoading({
        title: '查询中'
      });
      get({
        url: get_company_auth_status + '?companyName=' + name,
        success: res => {
          this.companyAuthStatus = res
        },
        fail: err => {
          console.log(err);
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    },

    /**
     * @name 确认赠送
     */
    handleConfirmSendFun() {
      if (this.money < 10) {
        setTimeout(() => {
          uni.showToast({
            title: '不能赠送小于10元的礼品卡'
          });
        }, 50);
      } // 购买赠送


      if (this.origin == 'give') {
        this.sendByGiveFun();
      } // 卡片赠送 


      if (this.origin == 'card') {
        this.sendByCardFun();
      }
    },

    /**
     * @name 购买赠送
     */
    sendByGiveFun() {
      let buyOptions = {
        transferId: this.id,
        acceptUserType: this.activeIndex + 1,
        acceptUserPhone: this.activeIndex == 0 ? this.personPhone : this.companyPhone
      };
      if (this.activeIndex == 1) buyOptions.acceptCompanyName = this.companyName;
      uni.showLoading({
        title: '赠送中'
      });
      postBody({
        url: send_by_buy,
        params: buyOptions,
        success: res => {
          console.log(res);
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '礼品卡赠送成功'
            });
          }, 50);
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/costManage/sendResult/sendResult?result=s'
            });
          }, 1500);
        },
        fail: err => {
          console.log(err);
          uni.navigateTo({
            url: '/pages/costManage/sendResult/sendResult?result=f'
          });
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    },

    /**
     * @name 卡片赠送
     */
    sendByCardFun() {
      let cardOptions = {
        transferId: this.id,
        transferMoney: this.money,
        acceptUserType: this.activeIndex + 1,
        acceptUserPhone: this.activeIndex == 0 ? this.personPhone : this.companyPhone
      };
      if (this.activeIndex == 1) cardOptions.acceptCompanyName = this.companyName;
      uni.showLoading({
        title: '赠送中'
      });
      postBody({
        url: send_card_directive,
        params: cardOptions,
        success: res => {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '礼品卡赠送成功'
            });
          }, 50);
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/costManage/sendResult/sendResult?result=s'
            });
          }, 1500);
        },
        fail: err => {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: err
            });
          }, 50);
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/costManage/sendResult/sendResult?result=f'
            });
          }, 1500);
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    }

  }
};
</script>
<style>
@import "./giving.css";
</style>
