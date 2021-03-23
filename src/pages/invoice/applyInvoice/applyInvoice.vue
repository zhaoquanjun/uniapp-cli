<template>
<view class="pay-detail--page">
  <view class="title">合同主题</view>
  <view class="desc">{{contractTitle}}</view>
  <view class="title">填写发票申请</view>
  <view class="info-list">
    <view class="list-item">
      <view class="label">抬头类型</view>
      <view class="value" style="width: 80%;">
        <radio-group @change="handleSelectTypeFun">
          <label v-for="(item, index) in checkList" :key="index" style="margin-left: 16rpx;">
            <radio :value="item.value" :checked="item.checked"></radio>
            <text>{{item.label}}</text>
          </label>
        </radio-group>
      </view>
    </view>
    <view class="list-item">
      <view class="label">开票方</view>
      <view class="value">{{companyInfo.sellerCompanyName}}</view>
    </view>
    <view class="list-item" v-if="checked ==2">
      <view class="label">发票企业名称</view>
      <view class="value">
        <input type="text" data-key1="companyInfo" v-model="companyInfo.buyerName" placeholder="请输入" />
      </view>
    </view>
    <view class="list-item" v-if="checked ==2">
      <view class="label">纳税人识别号</view>
      <view class="value">
        <input type="number" data-key1="companyInfo" v-model="companyInfo.buyerTaxNo" placeholder="请输入" />
      </view>
    </view>
    <view class="list-item gap">
      <view class="label">发票类型</view>
      <view :class="'value select-area ' + (isDown ? 'down' : 'up')" @tap="handleSelectInvoiceTypeFun">
        {{invoiceTypeValue.label ? invoiceTypeValue.label : '请选择'}}</view>
    </view>
    <view v-if="invoiceTypeValue.value == 's'">
      <view class="list-item">
        <view class="label">地址</view>
        <input type="text" v-model="invoiceValue.buyerAddress" placeholder="请输入" />
      </view>
      <view class="list-item">
        <view class="label">电话</view>
        <input type="number" v-model="invoiceValue.buyerPhone" placeholder="请输入" />
      </view>
      <view class="list-item">
        <view class="label">开户行</view>
        <input type="text" v-model="invoiceValue.buyerBank" placeholder="请输入" />
      </view>
      <view class="list-item">
        <view class="label">开户账号</view>
        <input type="number" v-model="invoiceValue.buyerBankNo" placeholder="请输入" />
      </view>
    </view>
    <view class="list-item gap">
      <view class="label">发票推送方式</view>
      <view :class="'value select-area ' + (isDown ? 'down' : 'up')" @tap="handleSelectPostWayFun">
        {{postWayValue.label ? postWayValue.label : '请选择'}}</view>
    </view>
    <view class="list-item" v-if="postWayValue.value == '1' || postWayValue.value == '2'">
      <view class="label">手机号</view>
      <input type="number" v-model="postvalue.pushPhone" placeholder="请输入" />
    </view>
    <view class="list-item" v-if="postWayValue.value == '0' || postWayValue.value == '2'">
      <view class="label">邮箱</view>
      <input type="text" v-model="postvalue.pushEmail" placeholder="请输入" />
    </view>
  </view>
  <view class="btn-wrapper">
    <view class="confirm-btn" @tap="handleConfirmFun">申请开票</view>
  </view>
  <slider-picker ref="sliderPicker" :sliderList="list" @selectWay="handleSelectItemFun"></slider-picker>
</view>
</template>

<script>
import { get, postBody } from '@api/request.js'
import { get_invouce_info, get_seller_companyName, apply_invoice } from '@api/invoice.js'
const util = require("@u/utils");
import sliderPicker from "@c/sliderPicker/sliderPicker";

export default {
  data() {
    return {
      operate: 1,
      isDown: true,
      checked: '1', // 申请方 默认为1 1:个人 2:企业
      checkList: [{
        label: '个人/非企业单位',
        value: '1',
        checked: true
      }, {
        label: '企业单位',
        value: '2'
      }],
      invoiceTypeValue: {
        label: '增值税普通发票',
        value: 'p'
      },
      postWayValue: {
        label: '不推送',
        value: '-1'
      },
      contractTitle: '',
      id: '',
      companyInfo: {
        sellerCompanyName: '',
        // 开票方
        buyerName: '',
        // 发票企业名称
        buyerTaxNo: '' // 纳税人识别号

      },
      invoiceValue: {
        buyerAddress: '',
        buyerPhone: '',
        buyerBank: '',
        buyerBankNo: ''
      },
      postvalue: {
        pushPhone: '',
        pushEmail: ''
      },
      list: [],
      invoiceType: [{
        label: '增值税普通发票',
        value: 'p'
      }, {
        label: '增值税专用发票',
        value: 's'
      }],
      postWay: [{
        label: '不推送',
        value: '-1'
      }, {
        label: '推送到邮箱',
        value: '0'
      }, {
        label: '推送到手机',
        value: '1'
      }, {
        label: '推送到邮箱和手机',
        value: '2'
      }],
      searchType: '',
      pageTitle: '',
      key1: "",
      buyerType: '2'
    };
  },

  components: {
    sliderPicker
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const isCompany = uni.getStorageSync('currentUser');
    this.contractTitle = options.title
    this.id = options.id
    this.searchType = options.searchType
    this.pageTitle = options.pageTitle
    this.getSellerNameFun();

    if (isCompany) {
      this.checked = 2
      this.checkList = [{
          label: '个人/非企业单位',
          value: '1'
        }, {
          label: '企业单位',
          value: '2',
          checked: true
        }]
      this.getInvoiceInfoFun();
    }
  },

  onShareAppMessage: function () {},
  methods: {
    /**
     * @name 选择发票抬头
     */
    handleSelectTypeFun(e) {
      this.checked = e.detail.value
    },

    /**
     * @name 选择发票类型呼出slider事件
     */
    handleSelectInvoiceTypeFun() {
      this.operate = 1
      this.list = this.invoiceType
      this.isDown = false
      this.$refs.sliderPicker.show();
    },

    /**
     * @name 发票推送方式呼出slider事件
     */
    handleSelectPostWayFun() {
      this.operate = 2
      this.list = this.postWay
      this.isDown = false
      this.$refs.sliderPicker.show();
    },

    /**
     * @name slider 点击事件
     */
    handleSelectItemFun(e) {
      if (this.operate == 1) {
        switch (e.detail) {
          case 0:
            this.invoiceTypeValue = this.list[0]
            break;

          case 1:
            this.invoiceTypeValue = this.list[1]
            break;

          default:
            break;
        }
      }

      if (this.operate == 2) {
        switch (e.detail) {
          case 0:
            this.postWayValue = this.list[0]
            break;

          case 1:
            this.postWayValue = this.list[1]
            break;

          case 2:
            this.postWayValue = this.list[2]
            break;

          case 3:
            this.postWayValue = this.list[3]
            break;

          default:
            break;
        }
      }

      this.isDown = true
      this.$refs.sliderPicker.hide();
    },

    /**
     * @name 获取开票方信息
     */
    getSellerNameFun() {
      uni.showLoading({
        title: '加载中'
      });
      get({
        url: get_seller_companyName + '/' + this.id,
        success: res => {
          let sellerInfo = JSON.parse(JSON.stringify(this.companyInfo));
          sellerInfo.sellerCompanyName = res;
          this.companyInfo = sellerInfo
          console.log(res);
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
     * @name 获取收票方信息
     */
    getInvoiceInfoFun() {
      uni.showLoading({
        title: '加载中'
      });
      get({
        url: get_invouce_info,
        success: res => {
          if (res) {
            let companyInfo = JSON.parse(JSON.stringify(this.companyInfo));
            let invoiceInfo = JSON.parse(JSON.stringify(this.invoiceValue));
            invoiceInfo.buyerAddress = res.address;
            invoiceInfo.buyerPhone = res.phone;
            invoiceInfo.buyerBank = res.bank;
            invoiceInfo.buyerBankNo = res.bankNo;
            companyInfo.buyerName = res.companyName;
            companyInfo.buyerTaxNo = res.taxNo;
            this.invoiceValue = invoiceInfo
            this.companyInfo = companyInfo
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
     * @name 申请开票
     */
    handleConfirmFun() {
      uni.showLoading({
        title: '加载中'
      });
      let options = {
        contractSubjectId: this.id,
        sellerCompanyName: this.companyInfo.sellerCompanyName,
        pushMode: this.postWayValue.value,
        buyerType: this.checked
      };

      if (this.checked == 2) {
        if (!this.companyInfo.buyerName) {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '请填写发票企业名称'
            });
          }, 50);
          return false;
        }

        if (!this.companyInfo.buyerTaxNo) {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '请填写纳税人识别号'
            });
          }, 50);
          return false;
        }

        options.buyerName = this.companyInfo.buyerName;
        options.buyerTaxNo = this.companyInfo.buyerTaxNo;
      }

      if (this.invoiceTypeValue.value == 's') {
        if (!this.invoiceValue.buyerAddress) {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '请填写收票方地址'
            });
          }, 50);
          return false;
        }

        if (!this.invoiceValue.buyerPhone) {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '请填写收票方电话'
            });
          }, 50);
          return false;
        }

        if (!this.invoiceValue.buyerBank) {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '请填写收票方开户行'
            });
          }, 50);
          return false;
        }

        if (!this.invoiceValue.buyerBankNo) {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '请填写收票方开户行账号'
            });
          }, 50);
          return false;
        }

        options.buyerAddress = this.invoiceValue.buyerAddress;
        options.buyerPhone = this.invoiceValue.buyerPhone;
        options.buyerBank = this.invoiceValue.buyerBank;
        options.buyerBankNo = this.invoiceValue.buyerBankNo;
      }

      if (this.postWayValue.value == 0) {
        if (!this.postvalue.pushEmail) {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '请填写推送邮箱'
            });
          }, 50);
          return false;
        }

        options.pushEmail = this.postvalue.pushEmail;
      }

      if (this.postWayValue.value == 1) {
        if (!this.postvalue.pushPhone) {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '请填写推送手机号'
            });
          }, 50);
          return false;
        }

        if (!util.isTelCode(this.postvalue.pushPhone)) {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '请填写正确的推送手机号'
            });
          }, 50);
          return false;
        }

        options.pushPhone = this.postvalue.pushPhone;
      }

      if (this.postWayValue.value == 2) {
        if (!this.postvalue.pushEmail) {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '请填写推送邮箱'
            });
          }, 50);
          return false;
        }

        if (!this.postvalue.pushPhone) {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '请填写推送手机号'
            });
          }, 50);
          return false;
        }

        if (!util.isTelCode(this.postvalue.pushPhone)) {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '请填写正确的推送手机号'
            });
          }, 50);
          return false;
        }

        options.pushEmail = this.postvalue.pushEmail;
        options.pushPhone = this.postvalue.pushPhone;
      }

      postBody({
        url: apply_invoice,
        params: options,
        success: res => {
          console.log(res);
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '申请成功'
            });
          }, 50);
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/contract/contractList/contractList?searchType=' + this.searchType + '&pageTitle=' + this.pageTitle
            });
          }, 1000);
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
    }

  }
};
</script>
<style>
@import "./applyInvoice.css";
</style>
