<template>
<!--pages/contract/sign/next/personSign/personSign.wxml-->
<view class="pageContent">
	<view class="item">
		<view class="item-title">输入信息</view>
		<view class="item-Content">
			<view class="message">
				<text>姓名</text>
				<input type="text" :value="userName" @input="bindKeyInput" @blur="handleBlurFun" placeholder="请输入" data-field="userName"></input>
			</view>
			<view :class="'search-result--list ' + (searchResultList.length > 0 ? 'show' : '')">
				<view v-for="(item, index) in searchResultList" :key="index" class="list-item" @tap="handleSelectDataFun" :data-name="item.name" :data-phone="item.phone">{{item.name}} - {{item.phone}}</view>
			</view>
		</view>
		<view class="item-Content">
			<view class="message">
				<text>手机号</text>
				<input type="text" :value="userPhone" maxlength="11" @input="bindKeyInput" placeholder="请输入" data-field="userPhone"></input>
			</view>
		</view>
	</view>
	<view class="item">
		<view class="item-title">签署要求</view>
		<view class="item-Content">
			<view class="othermessage" @tap.stop="checkedTap1">
					<radio value="r1" :checked="checked1"></radio>
					<view style=" margin-left:8rpx; padding-top:8rpx">手绘章</view>
			</view>
		</view>
		<view class="item-Content">
			<view class="othermessage" @tap.stop="checkedTap2">
					<radio value="r2" :checked="checked2"></radio>
					<view style=" margin-left:8rpx; padding-top:8rpx">个人模版章</view>
			</view>
		</view>
	</view>

	<view class="bottom-btn-container">
		<text class="back" @tap.stop="back">返回</text>
		<text class="next" v-if="!ishighLight" style="background:#999999">确定</text>
		<text class="next" @tap.stop="next" v-if="ishighLight" style="background:#464646">确定</text>
	</view>
</view>
</template>

<script>

import { get } from '@api/request.js'
import { get_signal_sign_person_list } from '@api/contract.js'
import { person_message } from '@api/account.js'

export default {
  data() {
    return {
      ishighLight: false,
      checked1: true,
      checked2: true,
      chapter: [],
      userName: '',
      userPhone: '',
      searchResultList: [],
      timer: null
    };
  },

  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
    checkedTap1: function () {
     this.checked1 = !this.checked1
    },
    checkedTap2: function () {
      this.checked2 = !this.checked2
    },

    back() {
      uni.navigateBack({});
    },

    hasRepeatPserson() {
      let person = uni.getStorageSync('signMans');
      let flag = true;

      if (person.length > 0) {
        for (var i = 0; i < person.length; i++) {
          const item = person[i];

          if (this.userName == item.userName && item.userPhone == this.userPhone && !item.companyName) {
            flag = false;
          }
        }
      }

      return flag;
    },

    next() {
      if (!this.hasRepeatPserson()) {
        setTimeout(() => {
          uni.showToast({
            title: '你已添加该签署方信息',
            icon: 'none'
          });
        }, 50);
        return false;
      }

      if (!/^1[345789]\d{9}$/.test(this.userPhone)) {
        setTimeout(() => {
          uni.showToast({
            title: '请输入正确的账号',
            icon: 'none'
          });
        }, 50);
        return false;
      }

      var that = this;
      let promise1 = new Promise(function (resolve, reject) {
        get({
          url: person_message,
          params: {
            "name": that.userName,
            "phone": that.userPhone
          },
          success: function (res) {
            resolve(res);
          }
        });
      });
      Promise.all([promise1]).then(res => {
        let isPersonAuth = false;
        let sealsArr = [];
        let sealStr = '';

        if (res[0] == '1') {
          isPersonAuth = true;
        }

        if (this.checked1 == true) {
          sealsArr.push(1);
          sealStr += '手绘章，';
        }

        if (this.checked2 == true) {
          sealsArr.push(4);
          sealStr += '个人模版章';
        }

        const item = {
          userName: this.userName,
          userPhone: this.userPhone,
          processType: 2,
          sealName: sealStr,
          sealType: sealsArr.join(),
          relationType: 1,
          status: 1,
          isPersonAuth: isPersonAuth
        };
        let signs = uni.getStorageSync('signMans');
        signs.push(item);
        uni.setStorageSync('signMans', signs);
        uni.redirectTo({
          url: '/pages/contract/sign/next/next'
        });
      });
    },

    bindKeyInput(e) {
      if (e.target.dataset.field == 'userName') {
        this.userName = e.detail.value

        if (e.detail.value) {
          this.getContactList(e.detail.value);
        } else {
          this.searchResultList = []
        }
      } else {
        this.userPhone = e.detail.value.replace(/[^\d.]/g, "")
      }

      this.ishighLight = this.setCanNextFun()
    },

    getContactList(name) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
          get({
            url: get_signal_sign_person_list + '?contactType=1&name=' + name,
            success: res => {
              this.searchResultList = res
            },
            fail: err => {
              console.log(err);
            }
          });
        }, 500)
    },

    handleSelectDataFun(e) {
      setTimeout(() => {
        this.userName = e.target.dataset.name
        this.userPhone = e.target.dataset.phone
        this.searchResultList = []
      }, 200);
      setTimeout(() => {
        this.ishighLight = this.setCanNextFun()
      }, 300);
    },

    handleBlurFun() {
      setTimeout(() => {
        this.searchResultList = []
      }, 200);
    },

    setCanNextFun() {
      let flag = false;
      if (this.userPhone != '' && this.userName != '') flag = true;
      return flag;
    }

  }
};
</script>
<style>
@import "./personSign.css";
</style>
