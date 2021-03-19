<template>
<view>
<view class="pageContent">
    <view class="pageHeader">
        <view class="theme-title">{{themeTitle}}</view>
        <view class="input-name-box">
            <textarea name="content" maxlength="100" @input="textInput" placeholder="请不要包括特殊字符，且长度不要超过100字">
          </textarea>
					<!--  #ifdef MP-WEIXIN -->
					<text class="input-tip">{{contractTitle.length}}/100</text>
					<!--  #endif -->
        </view>
    </view>

    <view class="file-content">
        <text class="file-title">{{fileTitle}}</text>
        <view class="file-view" @tap.stop="checkFileAction">
            <image src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/file.png" class="file-image"></image>
            <text class="file-name text-apostrophe">{{fileName}}</text>
            <text class="file-format text-apostrophe"></text>
        </view>
    </view>

    <view class="file-signer">
        <text class="linkman-title">{{linkmanTitle}}</text>
        <view class="linkman-add-sponsor">
            <text class="sponsor">{{sponsor}}</text>
        </view>
    </view>
    <button class="nextButton" style="background-color:#464646" v-if="ishighLight" @tap.stop="launchSignAction">{{signText}}</button>
    <button class="nextButton" v-if="!ishighLight" style="background:#B7B7B7">{{signText}}</button>
</view>

<view :class="'user-dialog ' + ( showDialog ? 'user-dialog--show' : '' )">
    <view class="user-dialog__mask" @tap="toggleDialog"></view>
    <view class="user-dialog__container">
        <view class="userSwitch">
            切换身份
        </view>
        <scroll-view scroll-y nowrap style="height:540rpx">
            <view v-for="(item, index) in companyList" :key="index" class="userList" @tap="chooseSponsor" :data-item="item" :data-index="index">
                <image src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/account/user.png" class="userList-icon"></image>
                <view class="userList-name">
                    {{item.companyName}}
                </view>
            </view>
        </scroll-view>
        <view class="scroll-under">
        </view>
    </view>
</view>
</view>
</template>

<script>
import { get } from '@api/request.js'
import { companyList } from '@api/account.js'
require("@/prototype/prototype.js");
let utils = require("@u/utils.js");
var app = getApp();

export default {
  data() {
    return {
      showDialog: false,
      ishighLight: false,
      contractTitle: '',
      contractInfo: null,
      sponsor: '',
      linkmans: [],
      themeTitle: "合同主题",
      theme: '',
      fileTitle: '合同文件',
      fileName: '',
      url: '',
      linkmanTitle: '发起方',
      signText: '下一步',
      isScanOpen: false,
      companyList: '',
      currentUser: '',
      coverUrl: "",
      backfileName: "",
      filePath: ""
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData);
    let userName = app.globalData.userName;
    this.fileName = options.fileName
    this.url = options.url
    this.coverUrl = options.coverUrl
    this.backfileName = options.backfileName

    // #ifdef  H5
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // #endif

    // #ifndef  H5
    let currentUser = uni.getStorageSync('currentUser');
    // #endif

    if (currentUser) {
      this.currentUser = currentUser
    } else {
      this.sponsor = userName
    }

    if (currentUser.name) {

      this.sponsor = currentUser.name
    }

    if (currentUser.companyName) {
      this.sponsor = currentUser.companyName
    }
  },
  onShow: function () {},

  onShareAppMessage() {},

  methods: {
    chooseSponsor: function () {
      var _this = this;

      get({
        url: companyList,
        success: res => {
          let authcompanyList = [];
          res.data.forEach(item => {
            if (item.authStatus == 1) authcompanyList.push(item);
          });

          this.companyList = authcompanyList
        }
      });
      this.showDialog = !this.showDialog
    },
    chooseCompany: function (e) {
      var temp = e.currentTarget.dataset.item;
      console.log(temp);
      this.sponsor = temp.companyName
      this.showDialog = false
    },
    toggleDialog: function () {
      this.showDialog = !this.showDialog
    },
    // 文字输入函数
    textInput: function (event) {
      let value = event.detail.value;
      this.contractTitle = value
      this.getHighLight();
    },
    setDataFun: function (fileInfo) {
      this.fileName = fileInfo.fileName
      this.filePath = fileInfo.url
    },
    setLinkmanFun: function (linkmans) {
      this.linkmans = linkmans
    },
    bindKeyInput: function (e) {
      this.theme = e.detail.value
    },

    /**
     *打开文件
     */
    checkFileAction: function () {
      uni.showLoading({
        title: '下载中...'
      });
      var url = this.url;
      this.openPdf(url);
    },
    // 打开pdf文件
    openPdf: function (url) {
      uni.downloadFile({
        url: url,
        success: function (res) {
          uni.hideLoading();
          var filePath = res.tempFilePath;
          uni.openDocument({
            filePath: filePath,
            fileType: 'pdf',
            showMenu: true,
            success: function (res) {},
            fail: function (res) {
              console.log(res);
            },
            complete: function (res) {
              console.log(res);
            }
          });
        },
        fail: function (res) {
          uni.hideLoading();
          console.log(res);
        },
        complete: function (res) {}
      });
    },
    launchSignAction: function () {
      const contractData = {
        contractTitle: this.contractTitle,
        fileName: this.fileName,
        url: this.url,
        coverUrl: this.coverUrl
      };
      uni.setStorageSync('contractData', contractData);
      uni.navigateTo({
        url: '/pages/contract/sign/next/next'
      });
    },
    // 提交存证是否高亮函数
    getHighLight: function () {
      this.ishighLight = (this.contractTitle && this.fileName) ? true : false
    }
  }
};
</script>
<style>
@import "./launchSign.css";
</style>
