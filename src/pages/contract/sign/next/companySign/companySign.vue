<template>
<view class="pageContent">
	<view class="item">
		<view class="item-title">输入信息</view>
		<view class="item-Content">
			<view class="message">
				<text>公司</text>
				<input type="text" v-model="companyName" @input="bindKeyInput($event, 'companyName')" @blur="handleBlurFun" placeholder="请输入" />
			</view>
			<view :class="'search-result--list ' + (searchCompanyResultList.length > 0 ? 'show' : '')">
				<view v-for="(item, index) in searchCompanyResultList" :key="index" class="list-item" @tap="handleSelectCompanyDataFun(item)" :data-name="item.name">{{item.name}}</view>
			</view>
		</view>
		<view class="item-Content">
			<view class="message">
				<text>经办人姓名</text>
				<input type="text" v-model="userName" @input="bindKeyInput($event, 'userName')" @blur="handleBlurFun" placeholder="请输入" />
			</view>
			<view :class="'search-result--list ' + (searchPersonResultList.length > 0 ? 'show' : '')">
				<view v-for="(item, index) in searchPersonResultList" :key="index" class="list-item" @tap="handleSelectPersonDataFun(item)" >{{item.name}} - {{item.phone}}</view>
			</view>
		</view>
    <view class="item-Content">
			<view class="message">
				<text>经办人手机号</text>
				<input type="text" v-model="userPhone" @input="bindKeyInput($event, 'userPhone')" maxlength="11" placeholder="请输入手机号" />
			</view>
		</view>
	</view>
  	<view class="item">
		<view class="item-title">签署要求</view>
		<view class="item-Content">
			<view class="othermessage" @tap.stop="checkedTap1">
        <radio v-model="checked1" :checked="checked1"></radio>
				<view style="margin-left:8rpx; padding-top:8rpx">企业章</view>
			</view>
		</view>
		<view class="item-Content">
			<view class="othermessage" @tap.stop="checkedTap2">
        <radio value="r2" :checked="checked2"></radio>
				<view style=" margin-left:8rpx; padding-top:8rpx">法人代表章</view>
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
import { company_message, person_message } from '@api/account.js'

export default {
  data() {
    return {
      ishighLight: false,
      checked1: true,
      checked2: false,
      chapter: [],
      sealType: '',
      companyName: '',
      userName: '',
      userPhone: '',
      companyAuth: '',
      personAuth: '',
      searchPersonResultList: [],
      searchCompanyResultList: [],
      timer: null
    };
  },
  methods: {
    checkedTap1() {
      this.checked1 = !this.checked1
    },
    checkedTap2() {
      this.checked2 = !this.checked2
    },

    getPersonContactList(name) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
          get({
            url: get_signal_sign_person_list + '?contactType=1&name=' + name,
            success: res => {
              this.searchPersonResultList = res
            },
            fail: err => {
              console.log(err);
            }
          });
        }, 500)
    },

    getCompanyContactList(name) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
          get({
            url: get_signal_sign_person_list + '?contactType=2&name=' + name,
            success: res => {
              console.log(res);
              this.searchCompanyResultList = res
            },
            fail: err => {
              console.log(err);
            }
          });
        }, 500)
    },

    handleSelectPersonDataFun(item) {
      setTimeout(() => {
        this.userName = item.name
        this.userPhone = item.phone
        this.searchPersonResultList = []
      }, 200);
      setTimeout(() => {
        this.ishighLight = this.setCanNextFun()
      }, 300);
    },

    handleSelectCompanyDataFun(item) {
      setTimeout(() => {
        this.companyName = item.name;
        this.searchCompanyResultList = []
      }, 200);
      setTimeout(() => {
        this.ishighLight = this.setCanNextFun();
      }, 300);
    },

    handleBlurFun() {
      setTimeout(() => {
        this.searchPersonResultList = []
        this.searchCompanyResultList = []
      }, 200);
    },

    setCanNextFun() {
      let flag = false;
      if (this.companyName != '' && this.userPhone != '' && this.userName != '') flag = true;
      return flag;
    },

    back() {
      uni.navigateBack({});
    },

    hasRepeatCompany() {
      let company = uni.getStorageSync('signMans');
      let flag = true;

      if (company.length > 0) {
        for (var i = 0; i < company.length; i++) {
          const item = company[i];

          if (item.companyName && this.companyName == item.companyName && item.userName == this.userName && item.userPhone == this.userPhone) {
            flag = false;
          }
        }
      }

      return flag;
    },

    next() {
      if (!this.hasRepeatCompany()) return void setTimeout(() => {
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
          url: company_message,
          params: {
            "companyName": this.companyName
          },
          success: res => {
            resolve(res);
          }
        });
      });
      let promise2 = new Promise((resolve, reject) => {
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
      Promise.all([promise1, promise2]).then(res => {
        let isPersonAuth = false;
        let isCompannyAuth = false;
        let sealsArr = [];
        let sealStr = '';

        if (res[1] == '1') {
          isPersonAuth = true;
        }

        if (res[0] == '1') {
          isCompannyAuth = true;
        }

        if (this.checked1 == true) {
          sealsArr.push(2);
          sealStr += '企业章，';
        }

        if (this.checked2 == true) {
          sealsArr.push(3);
          sealStr += '法人代表章';
        }

        const item = {
          companyName: this.companyName,
          userName: this.userName,
          userPhone: this.userPhone,
          processType: 2,
          sealName: sealStr,
          sealType: sealsArr.join(),
          status: 1,
          relationType: '2',
          isCompanyAuth: isCompannyAuth,
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

    bindKeyInput(e, type) {
      if (type == 'companyName') {
        if (this.companyName) {
          this.getCompanyContactList(this.companyName);
        } else {
          this.searchCompanyResultList = []
        }
      }

      if (type == 'userName') {
        if (this.userName) {
          this.getPersonContactList(this.userName);
        } else {
          this.searchPersonResultList = []
        }
      }

      if (type == 'userPhone') {
        this.userPhone = this.userPhone.replace(/[^\d.]/g, "")
      }

      this.ishighLight = this.setCanNextFun()
    }

  }
};
</script>
<style>
@import "./companySign.css";
</style>
