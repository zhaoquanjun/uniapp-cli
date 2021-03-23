<template>
  <view>
    <view class="pageContent">
      <view class="pageHeader">
        <view class="theme-title">{{ themeTitle }}</view>
        <view class="input-name-box">
          <textarea
            name="content"
            maxlength="100"
            @input="textInput"
            placeholder="请不要包括特殊字符，且长度不要超过100字"
          >
          </textarea>
          <!--  #ifdef MP-WEIXIN -->
          <text class="input-tip">{{ contractTitle.length }}/100</text>
          <!--  #endif -->
        </view>
      </view>

      <view class="file-content">
        <text class="file-title">{{ fileTitle }}</text>
        <view class="file-view" @tap.stop="checkFileAction">
          <image
            src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/file.png"
            class="file-image"
          ></image>
          <text class="file-name text-apostrophe">{{ fileName }}</text>
          <text class="file-format text-apostrophe"></text>
        </view>
      </view>

      <view class="file-signer">
        <text class="linkman-title">{{ linkmanTitle }}</text>
        <view class="linkman-add-sponsor">
          <text class="sponsor">{{ sponsor }}</text>
        </view>
      </view>
      <button
        class="nextButton"
        style="background-color:#464646"
        v-if="ishighLight"
        @tap.stop="launchSignAction"
      >
        {{ signText }}
      </button>
      <button class="nextButton" v-if="!ishighLight" style="background:#B7B7B7">
        {{ signText }}
      </button>
    </view>

    <view :class="'user-dialog ' + (showDialog ? 'user-dialog--show' : '')">
      <view class="user-dialog__mask" @tap="toggleDialog"></view>
      <view class="user-dialog__container">
        <view class="userSwitch">
          切换身份
        </view>
        <scroll-view scroll-y nowrap style="height:540rpx">
          <view
            v-for="(item, index) in companyList"
            :key="index"
            class="userList"
            @tap="chooseSponsor"
            :data-item="item"
            :data-index="index"
          >
            <image
              src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/account/user.png"
              class="userList-icon"
            ></image>
            <view class="userList-name">
              {{ item.companyName }}
            </view>
          </view>
        </scroll-view>
        <view class="scroll-under"> </view>
      </view>
    </view>
  </view>
</template>

<script>
import { get } from '@api/request.js'
import { companyList } from '@api/account.js'
require('@/prototype/prototype.js')
let utils = require('@u/utils.js')
import { mapState } from 'vuex'
export default {
  data() {
    return {
      showDialog: false,
      ishighLight: false,
      contractTitle: '',
      contractInfo: null,
      linkmans: [],
      themeTitle: '合同主题',
      theme: '',
      fileTitle: '合同文件',
      fileName: '',
      url: '',
      linkmanTitle: '发起方',
      signText: '下一步',
      isScanOpen: false,
      companyList: '',
      coverUrl: '',
      backfileName: '',
      filePath: '',
    }
  },
  onLoad(options) {
    this.fileName = options.fileName
    this.url = options.url
    this.coverUrl = options.coverUrl
    this.backfileName = options.backfileName
  },
  computed: {
    ...mapState({
      userName: (state) => state.userName,
      currentUser: state => state.currentUser,
      sponsor() {
        if (this.currentUser) {
          return this.currentUser.companyName ?? this.currentUser.name
        } else {
          return this.userName
        }
      }
    }),
  },
  methods: {
    chooseSponsor() {
      get({
        url: companyList,
        success: (res) => {
          let authcompanyList = []
          res.data.forEach((item) => {
            if (item.authStatus == 1) authcompanyList.push(item)
          })

          this.companyList = authcompanyList
        },
      })
      this.showDialog = !this.showDialog
    },
    toggleDialog() {
      this.showDialog = !this.showDialog
    },
    // 文字输入函数
    textInput(event) {
      let value = event.detail.value
      this.contractTitle = value
      this.getHighLight()
    },
    setDataFun(fileInfo) {
      this.fileName = fileInfo.fileName
      this.filePath = fileInfo.url
    },
    setLinkmanFun(linkmans) {
      this.linkmans = linkmans
    },
    bindKeyInput(e) {
      this.theme = e.detail.value
    },
    /**
     *打开文件
     */
    checkFileAction: function() {
      uni.showLoading({
        title: '下载中...',
      })
      var url = this.url
      this.openPdf(url)
    },
    // 打开pdf文件
    openPdf: function(url) {
      uni.downloadFile({
        url: url,
        success: res => {
          uni.hideLoading()
          uni.openDocument({
            filePath: res.tempFilePath,
            fileType: 'pdf',
            showMenu: true,
            success: function(res) {},
            fail: err => {
              console.log(err)
            },
          })
        },
        fail: err => {
          uni.hideLoading()
          console.log(err)
        },
        complete: () => {},
      })
    },
    launchSignAction() {
      const contractData = {
        contractTitle: this.contractTitle,
        fileName: this.fileName,
        url: this.url,
        coverUrl: this.coverUrl,
      }
      uni.setStorageSync('contractData', contractData)
      uni.navigateTo({
        url: '/pages/contract/sign/next/next',
      })
    },
    // 提交存证是否高亮函数
    getHighLight() {
      this.ishighLight = this.contractTitle && this.fileName
    },
  },
}
</script>
<style>
@import './launchSign.css';
</style>
