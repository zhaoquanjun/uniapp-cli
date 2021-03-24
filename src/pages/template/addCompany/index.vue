<template>
<view class="add-person--page">
  <view class="title">输入信息</view>
  <view class="value-list">
    <view class="list-item">
      <text class="sub-tit">公司</text>
      <input type="text" placeholder="请输入" v-model="companyName" @input="handleInputCompanyNameFun" @blur="handleBlurCompanyNameFun" />
      <view :class="'suggest-list ' + (companySuggests ? 'show': '')">
        <view v-for="(item, index) in companySuggests" :key="index" class="item" @tap.stop="handleSelectCompanySuggestFun(item)">{{item.name}} - {{item.phone}}</view>
      </view>
    </view>
    <view class="list-item">
      <text class="sub-tit">经办人姓名</text>
      <input type="text" placeholder="请输入" v-model="name" @input="handleInputUserNameFun" @blur="handleBlurUserNameFun" />
      <view :class="'suggest-list ' + (suggests ? 'show': '')">
        <view v-for="(item, index) in suggests" :key="index" class="item" @tap.stop="handleSelectPersonSuggestFun(item)">{{item.name}} - {{item.phone}}</view>
      </view>
    </view>
    <view class="list-item">
      <text class="sub-tit">经办人账号</text>
      <input type="number" maxlength="11" v-model="phone" placeholder="请输入" />
    </view>
  </view>
  <view class="btn-group">
    <view class="cancel" @tap="handleBackFun">撤回</view>
    <view :class="'confirm ' + (canNext ? 'canNext' : '')" @tap="handleConfirmFun">确定</view>
  </view>
</view>
</template>

<script>
import { get } from '@api/request.js'
import { get_signal_sign_person_list } from '@api/template.js'
import { company_message, person_message } from '@api/account.js'
const util = require("@u/utils");

export default {
  data() {
    return {
      companySuggests: [],
      // 公司suggest列表
      suggests: [],
      // 个人suggest列表
      timer: null,
      // 定时器
      companyName: '',
      name: '',
      phone: '',
      id: '',
      // 模版id 
      index: -1 // 当前编辑的索引

    };
  },
  onLoad: function (options) {
    this.id = options.id
    this.index = options.index
    this.companyName = options.companyName || ''
    this.name = options.name || ''
    this.phone = options.phone || ''
  },
  onShareAppMessage: function () {},
  computed: {
    canNext() {
      return this.name && this.phone && this.companyName
    }
  },
  methods: {
    /**
     * @name 输入公司名称
     */
    handleInputCompanyNameFun() {
      this.companyName = this.companyName.trim();
      if (!this.companyName) return;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getContactList(this.companyName, 2);
      }, 250)
    },

    /**
     * @name 输入姓名
     */
    handleInputUserNameFun() {
     this.name = this.name.trim();
      if (!this.name) return;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getContactList(this.name, 1);
      }, 250)
    },

    /**
     * @name 姓名blur事件
     */
    handleBlurUserNameFun() {
      setTimeout(() => {
        this.suggests = []
      }, 300);
    },

    /**
     * @name 公司名称失去焦点
     */
    handleBlurCompanyNameFun() {
      setTimeout(() => {
        this.companySuggests = []
      }, 300);
    },

    /**
     * @name 获取suggesst列表
     */
    getContactList(name, type) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
          get({
            url: get_signal_sign_person_list + '?contactType=1&name=' + name + '&contactType=' + type,
            success: res => {
              if (type == 1) {
                this.suggests = res
              }

              if (type == 2) {
                this.companySuggests = res
              }
            },
            fail: err => {
              console.log(err);
            }
          });
        }, 500)
    },

    /**
     * @name select person suggest
     */
    handleSelectPersonSuggestFun(item) {
      this.name = item.name
      this.phone = item.phone
      this.suggests = []
    },

    /**
     * @name select company suggest
     */
    handleSelectCompanySuggestFun(item) {
      this.companyName = item.name
      this.companySuggests = []
    },

    /**
     * @name 撤回
     */
    handleBackFun() {
      uni.navigateBack(-1);
    },

    /**
     * @name 确认
     */
    handleConfirmFun() {
      if (!this.companyName) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请填写公司名称'
          });
        }, 50);
      }

      if (!this.name) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请填写经办人姓名'
          });
        }, 50);
      }

      if (!this.phone) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请填写经办人账号'
          });
        }, 50);
      }

      if (!util.isTelCode(this.phone)) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请填写正确手机号'
          });
        }, 50);
      } // 编辑态获取填写的人的认证状态


      if (this.index > -1) {
        uni.showLoading({
          title: '获取认证信息中'
        });
        let companyAuthStatus = -1;
        let personAuthStatus = -1;
				get({
          url: company_message + '?companyName=' + this.companyName,
          success: res => {
            console.log(res);
            companyAuthStatus = res;
            get({
              url: person_message + '?name=' + this.name + '&phone=' + this.phone,
              success: data => {
                personAuthStatus = data;
                uni.redirectTo({
                  url: '/pages/template/useTemplate/index?origin=company&operate=edit&index=' + this.index + '&companyName=' + this.companyName + '&name=' + this.name + '&phone=' + this.phone + '&id=' + this.id + '&personAuthStatus=' + personAuthStatus + '&companyAuthStatus=' + companyAuthStatus
                });
              },
              fail: err => {
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
          fail: err => {
            setTimeout(() => {
              uni.showToast({
                title: err
              });
            }, 50);
          },
          complete: () => {
            uni.hideLoading();
          }
        });
      } else {
        uni.redirectTo({
          url: '/pages/template/useTemplate/index?origin=company&operate=add&index=' + this.index + '&companyName=' + this.companyName + '&name=' + this.name + '&phone=' + this.phone + '&id=' + this.id
        });
      }
    }

  }
};
</script>
<style>
@import "./index.css";
</style>
