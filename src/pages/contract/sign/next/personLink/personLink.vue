<template>
<view class="pageContent">
	<view class="item">
		<view class="item-title">输入信息</view>
		<view class="item-Content">
			<view class="message">
				<text>姓名</text>
				<input type="text" v-model="userName" @input="bindKeyInput($event, 'userName')" @blur="handleBlurFun" placeholder="请输入" />
			</view>
			<view class="search-result--list show">
				<view v-for="(item, index) in searchResultList" :key="index" class="list-item" @tap="handleSelectDataFun(item)">{{item.name}} - {{item.phone}}</view>
			</view>
		</view>
		<view class="item-Content">
			<view class="message">
				<text>手机号</text>
				<input type="text" v-model="userPhone" maxlength="11" @input="bindKeyInput($event, 'userPhone')" placeholder="请输入" />
			</view>
		</view>
	</view>

<view class="bottom-btn-container">
	<text class="back" @tap.stop="back">返回</text>
  <text class="next" :style="{background: ishighLight ? '#464646' : '#999'}" @tap.stop="next">确定</text>
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
      checked1: false,
      checked2: false,
      userName: '',
      userPhone: '',
      searchResultList: [],
      timer: null
    };
  },
  onShareAppMessage: function () {},
  computed: {
    ishighLight() {
      return this.userPhone && this.userName
    }
  },
  methods: {
    back() {
      uni.navigateBack({});
    },

    hasRepeatPserson() {
      let person = uni.getStorageSync('linkMans');
      let flag = true;

      if (person.length > 0) {
        for (var i = 0; i < person.length; i++) {
          const item = person[i];

          if (this.userName == item.userName && item.userPhone == this.userPhone && !this.companyName) {
            flag = false;
          }
        }
      }

      return flag;
    },

    next() {
      if (!this.hasRepeatPserson()) return void setTimeout(() => {
          uni.showToast({
            title: '你已添加该签署方信息',
            icon: 'none'
          });
        }, 50);

      if (!/^1[345789]\d{9}$/.test(this.userPhone)) return void setTimeout(() => {
          uni.showToast({
            title: '请输入正确的账号',
            icon: 'none'
          });
        }, 50);

      let promise1 = new Promise((resolve, reject) => {
        get({
          url: person_message,
          params: {
            "name": this.userName,
            "phone": this.userPhone
          },
          success: res => {
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
          processType: 4,
          sealName: sealStr,
          sealType: sealsArr.join(),
          relationType: 1,
          status: 1,
          isPersonAuth: isPersonAuth
        };
        let links = uni.getStorageSync('linkMans') ? uni.getStorageSync('linkMans') : [];
        links.push(item);
        uni.setStorageSync('linkMans', links);
        uni.redirectTo({
          url: '/pages/contract/sign/next/next'
        });
      });
    },

    bindKeyInput(e, type) {
      if (type == 'userName') {
       
        if (this.userName) {
          this.getContactList(this.userName);
        } else {
          this.searchResultList = []
        }
      } else {
        this.userPhone = this.userPhone.replace(/[^\d.]/g, "")
      }
    },

    getContactList(name) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
          get({
            url: get_signal_sign_person_list + '?contactType=1&name=' + name,
            success: res => {
              console.log(res);
              this.searchResultList = res
            },
            fail: err => {
              console.log(err);
            }
          });
        }, 500)
    },

    handleSelectDataFun(item) {
      setTimeout(() => {
        this.userName = item.name
        this.userPhone = item.phone
        this.searchResultList = []
      }, 200);
    },

    handleBlurFun() {
      setTimeout(() => {
        this.searchResultList = []
      }, 200);
    },

  }
};
</script>
<style>
@import "./personLink.css";
</style>
