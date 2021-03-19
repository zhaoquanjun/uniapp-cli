<template>
<view class="add-person--page">
  <view class="title">输入信息</view>
  <view class="value-list">
    <view class="list-item">
      <text class="sub-tit">姓名</text>
      <input type="text" placeholder="请输入" :value="name" @input="handleInputUserNameFun" @blur="handleBlurUserNameFun"></input>
      <view :class="'suggest-list ' + (suggests ? 'show': '')">
        <view v-for="(item, index) in suggests" :key="index" class="item" :data-item="item" @tap.stop="handleSelectSuggestFun(item)">{{item.name}} - {{item.phone}}</view>
      </view>
    </view>
    <view class="list-item">
      <text class="sub-tit">账号</text>
      <input type="number" maxlength="11" :value="phone" placeholder="请输入" @input="handleInputUserPhoneFun"></input>
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
import { person_message } from '@api/account.js'
const util = require("@u/utils");

export default {
  data() {
    return {
      suggests: [],
      // suggest列表
      timer: null,
      // 定时器
      name: '',
      phone: '',
      id: '',
      // 模版id 
      canNext: false,
      index: -1 // 当前编辑的索引

    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.id = options.id
    this.index = options.index
    this.name = options.name || ''
    this.phone = options.phone || ''
    this.canNext = options.name && options.phone
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
     * @name 输入姓名
     */
    handleInputUserNameFun(e) {
      const name = e.detail.value.trim();
      if (!name) return;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.name = name
        this.canNext = name && this.phone ? true : false
        this.getContactList(name);
        }, 250)
    },

    /**
     * @name 输入电话
     */
    handleInputUserPhoneFun(e) {
      const phone = e.detail.value;
      if (!phone) return;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.phone = phone
        this.canNext = this.name && phone ? true : false  
      }, 250)
    },

    /**
     * @name 姓名blur事件
     */
    handleBlurUserNameFun() {
      setTimeout(() => {
        this.suggests = []
      }, 250);
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
              this.suggests = res
            },
            fail: err => {
              console.log(err);
            }
          });
        }, 500)
    },

    /**
     * @name select suggest
     */
    handleSelectSuggestFun(item) {
      this.name = item.name
      this.phone = item.phonephone
      this.suggests = []
      this.canNext = item.name && item.phone ? true : false
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
      if (!this.name) {
        setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请填写姓名'
          });
        }, 50);
        return false;
      }

      if (!this.phone) {
        setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请填写账号'
          });
        }, 50);
        return false;
      }

      if (!util.isTelCode(this.phone)) {
        setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请填写正确手机号'
          });
        }, 50);
        return false;
      } // 编辑态获取填写的人的认证状态


      if (this.index > -1) {
        uni.showLoading({
          title: '获取认证信息中'
        });
        get({
          url: person_message + '?name=' + this.name + '&phone=' + this.phone,
          success: res => {
            console.log(res);
            uni.redirectTo({
              url: '/pages/template/useTemplate/index?origin=person&operate=edit&index=' + this.index + '&name=' + this.name + '&phone=' + this.phone + '&id=' + this.id + '&personAuthStatus=' + res
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
      } else {
        uni.redirectTo({
          url: '/pages/template/useTemplate/index?origin=person&operate=add&index=' + this.index + '&name=' + this.name + '&phone=' + this.phone + '&id=' + this.id
        });
      }
    }

  }
};
</script>
<style>
@import "./index.css";
</style>
