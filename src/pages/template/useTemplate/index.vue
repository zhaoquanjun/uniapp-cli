<template>
<view class="use-template--page">
  <view class="title">合同主题</view>
  <view class="input-area">
    <input type="text" maxlength="100" v-model="templateData.name" v-if="templateData" />
    <text class="delete one one-close" @tap="handleClearContractTitleFun"></text>
  </view>
  <view class="title">合同文件</view>
  <view class="file-list">
    <view v-for="(item, index) in fileList" :key="index" class="file-item" :data-item="item" @tap.stop="handlePreviewFileFun(item)">
      <view class="l-wrapper">
        <view class="icon">
          <image :src="fileIcon" mode="aspectFit"></image>
        </view>
        <view class="name">{{item.fileName}}</view>
      </view>
      <text class="iconfont iconright-arrow arrow"></text>
    </view>
  </view>
  <view class="title">合同附件</view>
  <view class="file-list">
    <view v-for="(item, index) in attachment" :key="index" class="file-item" :data-item="item" @tap.stop="handlePreviewFileFun(item)">
      <view class="l-wrapper">
        <view class="icon">
          <image :src="fileIcon" mode="aspectFit"></image>
        </view>
        <view class="name">{{item.fileName}}</view>
      </view>
      <text class="iconfont iconright-arrow arrow"></text>
    </view>
  </view>
  <view class="title">参与方</view>
  <view class="sign-list" v-if="templateData">
    <view v-for="(item, index) in templateData.templateSigns" :key="index" class="sign-item">
      <view class="user-info">
        <view class="info">
          <view class="name-auth">
            <view class="name">{{item.relationType == 2 ? (item.companyName ? item.companyName : '待填写') : item.relationType == 1 ? (item.userName ? item.userName : '待填写') : '待填写'}}</view>
            <view :class="'auth-status ' + ((item.relationType == 2 && item.companyAuthStatus) || (item.relationType == 1 && item.personAuthStatus) ? 'authed' : 'unauth')">{{(item.relationType == 2 && item.companyAuthStatus) || (item.relationType == 1 && item.personAuthStatus) ? '已认证' : '未认证'}}</view>
          </view>
          <view class="phone-auth">
            <view class="phone"><text v-if="item.relationType == 2">{{item.userName ? item.userName : '待填写'}}</text> {{item.userPhone ? item.userPhone : ''}}</view><view :class="'auth-status ' + (item.personAuthStatus ? 'authed' : 'unauth')" v-if="(item.userName && item.relationType == 2)">{{item.personAuthStatus ? '已认证' : '未认证'}}</view>
          </view>
          <view class="seals">{{item.sealWords}}</view>
        </view>
        <view class="edit" v-if="item.templateUserType == 2" :data-item="item" :data-index="index" @tap="handleEditItemFun">
          <text>编辑</text><text class="one one-apparrow-right arrow"></text>
        </view>
      </view>
      <view class="order">
        <view class="sub-title">参与顺序</view>
        <view class="order-detail">
          <view class="fill item" v-if="item.hasFill && item.fillOrder > -1">
            填写
            <text class="order-words">{{item.fillOrder + 1}}</text>
          </view>
          <view class="sign item" v-if="item.hasSign && item.signOrder > -1">
            签署
            <text class="order-words">{{item.signOrder + 1}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
  <view class="title">抄送方</view>
  <view class="add-cc">
    <view class="add-btn" @tap="handleAddCompanyFun">
      <image class="addSign" mode="aspectFit" :src="addIcon"></image>
      添加企业
    </view>
    <view class="add-btn" @tap="handleAddPersonFun">
      <image class="addSign" mode="aspectFit" :src="addIcon"></image>
      添加个人
    </view>
  </view>
  <view class="cc-list" v-if="templateData">
    <view v-for="(item, index) in templateData.templateCcs" :key="index" class="cc-item">
      <view class="name-auth">
        <view class="name">{{item.relationType == 2 ? item.companyName : item.userName}}</view>
        <!-- <view class="auth-status {{(item.relationType == 2 && item.companyAuthStatus) || (item.relationType == 1 && item.personAuthStatus) ? 'authed' : 'unauth'}}">{{(item.relationType == 2 && item.companyAuthStatus) || (item.relationType == 1 && item.personAuthStatus) ? '已认证' : '未认证'}}</view> -->
      </view>
      <view class="phone"><text v-if="item.relationType == 2">{{item.userName}}</text> {{item.userPhone}}</view>
      <text class="delete one one-close" v-if="item.isNew" :data-index="index" @tap="handleDeleteCcsFun"></text>
    </view>
  </view>
  <view class="title">其他设置</view>
  <view class="other-setting">
    <view class="setting-item">
      <text class="sub-title">签署截止时间</text>
      <view class="date-picker">
        <picker mode="date" :value="signEndTime" :start="currentTime" end="2200" data-type="sign" @change="handleSelectDateFun">
          <view class="pickDate">
            <input type="date" disabled="true" name="addtime" :value="signEndTime" placeholder="请选择" />
          </view>
        </picker>
        <text class="iconfont iconright-arrow"></text>
      </view>
    </view>
    <view class="setting-item">
      <text class="sub-title">合同终止时间</text>
      <view class="date-picker">
        <picker mode="date" :value="fileEndTime" :start="currentTime" end="2200" data-type="file" @change="handleSelectDateFun">
          <view class="pickDate">
            <input type="date" disabled="true" name="addtime" :value="fileEndTime" placeholder="请选择" />
          </view>
        </picker>
        <text class="iconfont iconright-arrow"></text>
      </view>
    </view>
  </view>
  <view class="launch-btn" @tap="handleLaunchConfirmFun">发起签署</view>
</view>
</template>

<script>
import { get, postBody } from '@api/request.js'
import { get_template_detail, confirm_contract_launch_by_template } from '@api/template.js'
const util = require("@u/utils");
import { mapState } from 'vuex'
export default {
  data() {
    return {
      addIcon: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/contract/addsign.png',
      fileIcon: require('@s/template/file_icon.png'),
      templateData: null,
      fileList: [{
        name: '12312321'
      }],
      // 文件列表
      attachment: [],
      // 附件列表
      signEndTime: '',
      fileEndTime: '',
      id: '',
      // 模版id
      origin: '',
      //来源
      operate: '' // 当前操作类
      ,
      index: "",
      currentTime: "" // 当前时间
    };
  },
  onLoad: function (options) {
    // 初始化一个当下的时间点
    this.currentTime = this.formatTimeConvert(new Date().getTime(), 0)
    console.log(this.currentTime)
    let arr = [];
    this.id = options.id
    this.origin = options.origin || ''
    this.operate = options.operate || ''
    this.index = options.index || -1

    if (options.origin == 'person') {
      arr.push({
        userName: options.name,
        userPhone: options.phone,
        isNew: true,
        relationType: 1,
        personAuthStatus: options.personAuthStatus || -1
      });
    }

    if (options.origin == 'company') {
      arr.push({
        companyName: options.companyName,
        userName: options.name,
        userPhone: options.phone,
        isNew: true,
        relationType: 2,
        personAuthStatus: options.personAuthStatus || -1,
        companyAuthStatus: options.companyAuthStatus || -1
      });
    }

    this.getTemplateDetailFun(arr);
  },
  onShareAppMessage: function () {},
  computed: {
    ...mapState({
      currentUser: state => state.currentUser,
      userName: state => state.userName,
      userPhone: state => state.phone
    })
  },
  methods: {
    /**
     * @name 获取模版详情
     */
    getTemplateDetailFun(newArr) {
      uni.showLoading({
        title: '加载中'
      });
      get({
        url: get_template_detail + '?contractTemplateId=' + this.id,
        success: res => {
          console.log(res);
          res.templateSigns.forEach(it => {
            // 处理印章类型展示 - 转化为文字 - 汉字
            it.sealWords = this.conversionSealsFun(it.sealTypes);

            if (it.templateUserType == 1) {
             
              it.companyName = this.currentUser.companyName;
              it.userName = this.userName;
              it.userPhone = this.userPhone;
            }
          }); // 拿到缓存的所有抄送方

          if (this.origin) {

            let ccs = uni.getStorageSync('templateCcs');
            let signs = uni.getStorageSync('templateSigns'); // 新增抄送方

            this.operate == 'add' && ccs.push(newArr[0]);
            res.templateCcs = ccs; // 编辑参与方

            if (this.operate == 'edit') {
              signs[this.index].userName = newArr[0].userName;
              signs[this.index].userPhone = newArr[0].userPhone;
              signs[this.index].personAuthStatus = newArr[0].personAuthStatus;

              if (this.origin == 'company') {
                signs[this.index].companyName = newArr[0].companyName;
                signs[this.index].companyAuthStatus = newArr[0].companyAuthStatus;
              }
            }
            res.templateSigns = signs;
          }

          uni.setStorageSync('templateCcs', res.templateCcs);
          uni.setStorageSync('templateSigns', res.templateSigns);

          this.templateData = res
          this.fileList = res.contractTemplateFiles.filter(it => it.attachment == 0)
          this.attachment = res.contractTemplateFiles.filter(it => it.attachment == 1)
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
    /**
     * @name 清空合同主题
     */
    handleClearContractTitleFun() {
      let templateData = this.templateData;
      templateData.name = '';
      this.templateData = templateData
    },

    /**
     * @name 选择日期
     */
    handleSelectDateFun(e) {
      const type = e.currentTarget.dataset.type;
      switch (type) {
        case 'file':
          this.fileEndTime = e.detail.value
          break;
        case 'sign':
          this.signEndTime = e.detail.value
          break;
        default:
          break;
      }
    },

    /**
     * @name 转化印章类型为文字
     */
    conversionSealsFun(arr) {
      let str = '';
      arr.forEach(it => {
        switch (it) {
          case '1':
            str += '手绘章,';
            break;

          case '2':
            str += '企业章,';
            break;

          case '3':
            str += '法人代表章,';
            break;

          case '4':
            str += '模版章,';
            break;

          default:
            break;
        }
      });
      str = str.slice(0, str.length - 1);
      return str;
    },

    /**
     * @name 删除抄送方
     */
    handleDeleteCcsFun(e) {
      let templateData = this.templateData;
      templateData.templateCcs.splice(e.currentTarget.dataset.index, 1);
      this.templateData = templateData
    },

    /**
     * @name 抄送增加企业
     */
    handleAddCompanyFun() {
      uni.navigateTo({
        url: '/pages/template/addCompany/index?id=' + this.id
      });
    },

    /**
     * @name 抄送增加个人
     */
    handleAddPersonFun() {
      uni.navigateTo({
        url: '/pages/template/addPerson/index?id=' + this.id
      });
    },

    /**
     * @name 编辑参与方
     */
    handleEditItemFun(e) {
      const item = e.currentTarget.dataset.item;
      const index = e.currentTarget.dataset.index;
      let url = '/pages/template';

      if (item.relationType == 1) {
        url += '/addPerson/index?index=' + index + '&id=' + this.id + '&name=' + (item.userName ? item.userName : '') + '&phone=' + (item.userPhone ? item.userPhone : '');
      }

      if (item.relationType == 2) {
        url += '/addCompany/index?index=' + index + '&id=' + this.id + '&name=' + (item.userName ? item.userName : '') + '&phone=' + (item.userPhone ? item.userPhone : '') + '&companyName=' + (item.companyName ? item.companyName : '');
      }

      uni.navigateTo({
        url: url
      });
    },

    /**
     * @name 预览文件
     */
    handlePreviewFileFun(item) {
      uni.navigateTo({
        url: '/pages/template/preview/index?templateId=' + this.id + '&id=' + item.id
      });
    },

    /**
     * @name 发起合同签署
     */
    handleLaunchConfirmFun() {
      if (!this.checkSubmitInfosFun()) return;
      let signs = [],
          fills = [];
      this.templateData.templateSigns.forEach(it => {
        if (it.hasSign) {
          let newSign = JSON.parse(JSON.stringify(it));
          newSign.id = it.signId;
          signs.push(newSign);
        }

        if (it.hasFill) {
          let newFill = JSON.parse(JSON.stringify(it));
          newFill.id = it.fillId;
          fills.push(newFill);
        }
      });
      let saveParams = {
        createTime: this.templateData.createTime,
        fileTermination: this.fileEndTime,
        id: this.templateData.id,
        modifyTime: this.templateData.modifyTime,
        relationId: this.templateData.relationId,
        relationType: this.templateData.relationType,
        signingDeadline: this.signEndTime,
        status: this.templateData.status,
        name: this.templateData.name,
        userOrder: this.templateData.userOrder,
        contractTemplateFiles: this.templateData.contractTemplateFiles,
        templateCcs: this.templateData.templateCcs,
        templateFillers: fills,
        templateSigners: signs,
        contractSigners: signs
      };
      uni.showLoading({
        title: '发起中'
      });
      postBody({
        url: confirm_contract_launch_by_template,
        params: saveParams,
        success: res => {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '合同发起成功'
            });
          }, 50);
          let url = '';

          if (fills.length > 0) {
            url = '/pages/contract/fill/fill?contractId=' + res;
          } else {
            url = '/pages/contract/sign/next/signConfirm/signConfirm?contractId=' + res;
          }

          setTimeout(() => {
            uni.redirectTo({
              url: url
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
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    },

    /**
     * @name 校验发起信息
     */
    checkSubmitInfosFun() {
      if (this.templateData.name.length == 0) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请输入合同主题'
          });
        }, 50);
      }

      if (this.templateData.templateSigns.filter(item => item.relationType == 2).some(item => !item.companyName)) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '签署方企业名称不能为空'
          });
        }, 50);
      }

      if (this.templateData.templateSigns.some(item => !item.userName)) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '签署方经办人姓名不能为空'
          });
        }, 50);
      }

      if (this.templateData.templateSigns.some(item => !item.userPhone)) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '签署方经办人手机号不能为空'
          });
        }, 50);
      }

      const result1 = this.checkSignRepeatFun();
      // 抄送方校验
      if (!result1.flag) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: result1.msg
          });
        }, 50);
      } 


      if (this.templateData.templateCcs && this.templateData.templateCcs.length > 0) {
        const result2 = this.checkCcRepeatFun();

        if (!result2.flag) {
          return void setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: result2.msg
            });
          }, 50);
        }
      }
      return true;
    },

    /**
     * @name 检测签署人是否重复
     */
    checkSignRepeatFun() {
      let flag = true;
      let msg = "";
      let ar1 = [],
          ar2 = [],
          ar3 = [],
          ar4 = [];
      this.templateData.templateSigns.forEach(it => {
        if (it.relationType == 1 && it.templateUserType == 3) {
          ar1.push(it);
          ar3.push(it.userPhone);
        }

        if (it.relationType == 2 && it.templateUserType == 3) {
          ar2.push(it);
          ar4.push(it.userPhone);
        }
      });
      var repeat1 = ar1.filter(function (item, index) {
        return ar3.indexOf(item.userPhone) !== index;
      });
      var repeat2 = ar2.filter(function (item, index) {
        return ar4.indexOf(item.userPhone) !== index;
      });

      if (repeat1.length > 0) {
        flag = false;
        msg = '存在重复参与人，请删除重复用户' + repeat1[0].itemName + '后再尝试发起';
      }

      if (repeat2.length > 0) {
        flag = false;
        msg = '存在重复参与人，请删除重复用户' + repeat2[0].itemName + '后再尝试发起';
      }

      return {
        flag,
        msg
      };
    },

    /**
     * @name 检测抄送人是否重复
     */
    checkCcRepeatFun() {
      let flag = true;
      let msg = "";
      let ar1 = [],
          ar2 = [],
          ar3 = [],
          ar4 = [];
      this.templateData.templateCcs.forEach(it => {
        if (it.relationType == 1) {
          ar1.push(it);
          ar3.push(it.userPhone);
        }

        if (it.relationType == 2) {
          ar2.push(it);
          ar4.push(it.userPhone);
        }
      });
      var repeat1 = ar1.filter(function (item, index) {
        return ar3.indexOf(item.userPhone) !== index;
      });
      var repeat2 = ar2.filter(function (item, index) {
        return ar4.indexOf(item.userPhone) !== index;
      });
      console.log(repeat1[0], repeat2[0]);

      if (repeat1.length > 0) {
        flag = false;
        msg = '存在重复抄送人，请删除重复用户' + (repeat1[0].relationType == 1 ? repeat1[0].userName : repeat1[0].companyName) + '后再尝试发起';
      }

      if (repeat2.length > 0) {
        flag = false;
        msg = '存在重复抄送人，请删除重复用户' + (repeat2[0].relationType == 1 ? repeat2[0].userName : repeat2[0].companyName) + '后再尝试发起';
      }

      return {
        flag,
        msg
      };
    },
    /**
    * 
    * @param {*} timestamp 时间戳
    * @param {*} num 格式化类型
    */
    formatTimeConvert(timestamp, num) {
      timestamp = timestamp + '';
      timestamp = timestamp.length == 10 ? timestamp * 1000 : timestamp;
      var date = new Date(Number(timestamp));
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = date.getDate();
      d = d < 10 ? '0' + d : d;
      var h = date.getHours();
      h = h < 10 ? '0' + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;

      if (num == 0) {
        return y + '-' + m + '-' + d;
      } else {
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
      }
    },

  }
};
</script>
<style>
@import "./index.css";
</style>
