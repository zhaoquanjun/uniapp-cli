<template>
<!--pages/contract/sign/next/next.wxml-->
<view class="pageContent">
	<view class="item">
		<view class="item-title">签署方</view>
		<view class="item-content">
			<view class="addCompany" @tap="companySign">
				<image class="addSign" src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/contract/addsign.png"></image>
				<view>添加企业</view>
			</view>
			<view style="width:2rpx;height:28rpx;background-color:#D8D8D8"></view>
			<view class="addPerson" @tap="personSign">
				<image class="addSign" src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/contract/addsign.png"></image>
				<view>添加个人</view>
			</view>
		</view>
		<view class="listbox">
			<view class="list-copy" :hidden="!showCopy" :style="'top:' + copyItem.top + 'px;'">
				<view class="info" v-if="copyItem.relationType=='2'">
					<view style="display:flex; justify-content:space-between">
						<view class="name-wrapper" style="display:flex;">
							<view class="index" v-if="isSort">{{copyItem.index + 1}}</view>
							<view class="name">{{copyItem.companyName}}</view>
							<view class="companyAuth" v-if="copyItem.isCompanyAuth" style="background:rgba(62,180,168,0.1); color:#3EB4A8">已认证</view>
							<view class="companyAuth" v-else style="background:#F4F4F4; color:#666666">未认证</view>
						</view>
						<text class="iconfont iconbaseline-close-px" :data-item="item" data-type="delete" :data-index="index" @tap.stop="deleteSign"></text>
					</view>
					<view class="phone">{{copyItem.userName}} {{copyItem.userPhone}}
						<view class="personAuth" v-if="copyItem.isPersonAuth" style="background:rgba(62,180,168,0.1); color:#3EB4A8">已认证</view>
						<view class="personAuth" v-else style="background:#F4F4F4; color:#666666">未认证</view>
					</view>
					<view class="chapter">{{copyItem.sealName}}</view>
				</view>
				<view class="info" v-if="copyItem.relationType=='1'">
					<view style="display:flex; justify-content:space-between">
						<view class="name-wrapper" style="display:flex;">
							<view class="index" v-if="isSort">{{copyItem.index + 1}}</view>
							<view class="name">{{copyItem.userName}}</view>
							<view class="personAuth" v-if="copyItem.isPersonAuth" style="background:rgba(62,180,168,0.1); color:#3EB4A8">已认证</view>
							<view class="personAuth" v-else style="background:#F4F4F4; color:#666666">未认证</view>
						</view>
						<text class="iconfont iconbaseline-close-px" :data-item="item" data-type="delete" :data-index="index" @tap.stop="deleteSign"></text>
					</view>
					<view class="phone">{{copyItem.userPhone}}</view>
					<view class="chapter">{{copyItem.sealName}}</view>
				</view>
			</view>

			<view v-for="(item, index) in signMans" :key="index" class="list" v-if="isSort" :data-index="index" @touchstart="dragStart" @touchmove="dragMove" @touchend="dragEnd">
				<view class="info" v-if="item.relationType=='2'">
					<view style="display:flex; justify-content:space-between">
						<view class="name-wrapper" style="display:flex;">
							<view class="index" v-if="isSort">{{index+1}}</view>
							<view class="name">{{item.companyName}}</view>
							<view class="companyAuth" v-if="item.isCompanyAuth" style="background:rgba(62,180,168,0.1); color:#3EB4A8">已认证</view>
							<view class="companyAuth" v-else style="background:#F4F4F4; color:#666666">未认证</view>
						</view>
						<text class="iconfont iconbaseline-close-px" :data-item="item" data-type="delete" :data-index="index" @tap.stop="deleteSign"></text>
					</view>
					<view class="phone">{{item.userName}} {{item.userPhone}}
						<view class="personAuth" v-if="item.isPersonAuth" style="background:rgba(62,180,168,0.1); color:#3EB4A8">已认证</view>
						<view class="personAuth" v-else style="background:#F4F4F4; color:#666666">未认证</view>
					</view>
					<view class="chapter">{{item.sealName}}</view>
				</view>
				<view class="info" v-if="item.relationType=='1'">
					<view style="display:flex; justify-content:space-between">
						<view class="name-wrapper" style="display:flex;">
							<view class="index" v-if="isSort">{{index+1}}</view>
							<view class="name">{{item.userName}}</view>
							<view class="personAuth" v-if="item.isPersonAuth" style="background:rgba(62,180,168,0.1); color:#3EB4A8">已认证</view>
							<view class="personAuth" v-else style="background:#F4F4F4; color:#666666">未认证</view>
						</view>
						<text class="iconfont iconbaseline-close-px" :data-item="item" data-type="delete" :data-index="index" @tap.stop="deleteSign"></text>
					</view>
					<view class="phone">{{item.userPhone}}</view>
					<view class="chapter">{{item.sealName}}</view>
				</view>
			</view>
			<view v-for="(item, index) in signMans" :key="index" class="list" v-if="!isSort" :data-index="index">
				<view class="info" v-if="item.relationType=='2'">
					<view style="display:flex; justify-content:space-between">
						<view class="name-wrapper" style="display:flex;">
							<view class="name">{{item.companyName}}</view>
							<view class="companyAuth" v-if="item.isCompanyAuth" style="background:rgba(62,180,168,0.1); color:#3EB4A8">已认证</view>
							<view class="companyAuth" v-else style="background:#F4F4F4; color:#666666">未认证</view>
						</view>
						<text class="iconfont iconbaseline-close-px" :data-item="item" data-type="delete" :data-index="index" @tap="deleteSign"></text>
					</view>
					<view class="phone">{{item.userName}} {{item.userPhone}}
						<view class="personAuth" v-if="item.isPersonAuth" style="background:rgba(62,180,168,0.1); color:#3EB4A8">已认证</view>
						<view class="personAuth" v-else style="background:#F4F4F4; color:#666666">未认证</view>
					</view>
					<view class="chapter">{{item.sealName}}</view>
				</view>
				<view class="info" v-if="item.relationType=='1'">
					<view style="display:flex; justify-content:space-between">
						<view class="name-wrapper" style="display:flex;">
							<view class="name">{{item.userName}}</view>
							<view class="personAuth" v-if="item.isPersonAuth" style="background:rgba(62,180,168,0.1); color:#3EB4A8">已认证</view>
							<view class="personAuth" v-else style="background:#F4F4F4; color:#666666">未认证</view>
						</view>
						<text class="iconfont iconbaseline-close-px" :data-item="item" data-type="delete" :data-index="index" @tap="deleteSign"></text>
					</view>
					<view class="phone">{{item.userPhone}}</view>
					<view class="chapter">{{item.sealName}}</view>
				</view>
			</view>
			<view style="background:#ffffff; padding:0rpx 48rpx">
				<view class="sort" v-if="signMans.length>1">
					<switch style="zoom:.6" color="#ED6C00" @change="switchChange"></switch>
					<text style="margin-right:16rpx">签署顺序</text>
				</view>
			</view>
		</view>
	</view>
	<view class="item">
		<view class="item-title">抄送方</view>
		<view class="item-content">
			<view class="addCompany" @tap="companyLink">
				<image class="addSign" src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/contract/addsign.png"></image>
				<view>添加企业</view>
			</view>
			<view style="width:2rpx;height:28rpx;background-color:#D8D8D8"></view>
			<view class="addPerson" @tap="personLink">
				<image class="addSign" src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/contract/addsign.png"></image>
				<view>添加个人</view>
			</view>
		</view>
		<view class="listbox">
			<view v-for="(item, index) in linkMans" :key="index" class="list" :data-index="index" style="height:148rpx">
				<!-- 企业 -->
				<view class="info" v-if="item.relationType=='2'">
					<view style="display:flex; justify-content:space-between">
						<view class="name-wrapper" style="display:flex;">
							<view class="name">{{item.companyName}}</view>
							<view class="companyAuth" v-if="item.isCompanyAuth" style="background:rgba(62,180,168,0.1); color:#3EB4A8">已认证</view>
							<view class="companyAuth" v-else style="background:#F4F4F4; color:#666666">未认证</view>
						</view>
						<text class="iconfont iconbaseline-close-px" :data-item="item" data-type="delete" :data-index="index" @tap="deleteLink"></text>
					</view>
					<view class="phone">{{item.userName}} {{item.userPhone}}
						<view class="personAuth" v-if="item.isPersonAuth" style="background:rgba(62,180,168,0.1); color:#3EB4A8">已认证</view>
						<view class="personAuth" v-else style="background:#F4F4F4; color:#666666">未认证</view>
					</view>
				</view>
				<!-- 个人 -->
				<view class="info" v-if="item.relationType=='1'">
					<view style="display:flex; justify-content:space-between">
						<view class="name-wrapper" style="display:flex;">
							<view class="name">{{item.userName}}</view>
							<view class="personAuth" v-if="item.isPersonAuth" style="background:rgba(62,180,168,0.1); color:#3EB4A8">已认证</view>
							<view class="personAuth" v-else style="background:#F4F4F4; color:#666666">未认证</view>
						</view>
						<text class="iconfont iconbaseline-close-px" :data-item="item" data-type="delete" :data-index="index" @tap="deleteLink"></text>
					</view>
					<view class="phone">{{item.userPhone}}</view>
				</view>
			</view>
		</view>

	</view>
	<view class="item">
		<view class="item-title">其他设置</view>
		<view class="item-otherContent">
			<view class="item-time">
				<text>签署截止时间</text>
				<view style="display:flex; justify-content:flex-end; color:#999999; font-size:30rpx;align-items:center;">
					<picker mode="date" :value="signingDeadline"  @change="bindDateChange1">
						<view class="pickDate">
							<input type="date" disabled="true" name="addtime" :value="signingDeadline" placeholder="请选择" />
						</view>
					</picker>
					<text class="iconfont iconright-arrow"></text>
				</view>
			</view>
		</view>
		<view class="item-otherContent">
			<view class="item-time">
				<text>合同终止时间</text>
				<view style="display:flex; justify-content:flex-end; color:#999999; font-size:30rpx;align-items:center;">
					<picker mode="date" :value="fileTermination" @change="bindDateChange2">
						<view class="pickDate">
							<input type="date" disabled="true" name="addtime" :value="fileTermination" placeholder="请选择" />
						</view>
					</picker>
					<text class="iconfont iconright-arrow"></text>
				</view>
			</view>
		</view>
	</view>

	<view class="bottom-btn-container">
		<text class="back" @tap.stop="back">保存至草稿箱</text>
		<text class="next" v-if="!ishighLight" style="background:#999999">立即发起签署</text>
		<text class="next" @tap.stop="next" v-if="ishighLight" style="background:#464646">立即发起签署</text>
	</view>
</view>
</template>

<script>
import { get, postBody } from '@api/request.js'
import { get_contract_detail, get_contract_launch } from '@api/contract.js'
import { company_message, person_message } from '@api/account.js'
import avatar from "@c/avatar/avatar";

export default {
  data() {
    return {
      currentDate: '',
      ishighLight: false,
      isSign: false,
      isLink: false,
      isSort: false,
      userOrder: 0,
      signingDeadline: '',
      //签署截止时间
      fileTermination: '',
      //文件终止时间
      showCopy: false,
      copyItem: {
        top: 0,
        companyName: '',
        userName: '',
        userPhone: '',
        chapter: '',
        signType: '',
        personAuth: '',
        companyAuth: ''
      },
      replace: {
        companyName: '',
        userName: '',
        userPhone: '',
        chapter: '',
        signType: '',
        personAuth: '',
        companyAuth: ''
      },
      signMans: [],
      linkMans: [],
      startX: 0,
      startY: 0,
      contractId: ''
    };
  },

  components: {
    avatar
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let signs = uni.getStorageSync('signMans') ? uni.getStorageSync('signMans') : [];
    let links = uni.getStorageSync('linkMans') ? uni.getStorageSync('linkMans') : [];
    const currentUser = uni.getStorageSync('currentUser');
    const isdraft = options.isdraft;
    this.contractId = options.contractId

    if (isdraft) {
      this.getDetailDataFun(options.contractId);
    } else {
      let self = {
        userName: uni.getStorageSync('userName'),
        userPhone: uni.getStorageSync('userAccount'),
        isPersonAuth: true,
        processType: 2,
        status: 1
      };

      if (!currentUser.companyId) {
        self.sealName = '手绘章，个人模版章';
        self.sealType = [1, 4].join();
        self.relationType = 1;
      } else {
        self.companyName = currentUser.companyName;
        self.isCompanyAuth = true;
        self.sealName = '企业章，法人代表章';
        self.sealType = [2, 3].join();
        self.relationType = 2;
      }

      let flag = true;

      if (signs && signs.length > 0) {
        for (var i = 0; i < signs.length; i++) {
          if (signs[i].userName == self.userName || signs[i].userPhone == self.userPhone) {
            flag = false;
          }
        }
      }

      if (flag) {
        signs.push(self);
      }

      this.signMans = signs
      this.linkMans = links

      uni.setStorageSync('signMans', signs);
      
      this.ishighLightFun();
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
  onHide: function () {
    uni.removeStorageSync('companySign');
    uni.removeStorageSync('personSign');
    uni.removeStorageSync('personLink');
    uni.removeStorageSync('companyLink');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    uni.removeStorageSync('signMans');
    uni.removeStorageSync('linkMans');
  },

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
    checkAuthFun({
      type,
      companyName,
      name,
      phone,
      callback
    }) {
      let promise1 = new Promise((resolve, reject) => {
        get({
          url: company_message,
          params: {
            "companyName": companyName
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
            "name": name,
            "phone": phone
          },
          success: res => {
            resolve(res);
          }
        });
      });
      let arr = type == 1 ? [promise2] : [promise2, promise1];
      Promise.all(arr).then(res => {

        if (typeof callback == 'function') {
          if (type == 1) {
            callback(res == 1);
          } else {
            callback(res[0] == 1, res[1] == 1);
          }
        }
      });
    },

    ishighLightFun (e) {
      this.ishighLight = !!this.signMans.length

      setTimeout(() => {
        this.ishighLightFun();
      }, 1000);
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

    /**
     * @name 获取合同详情
     */
    getDetailDataFun(id) {

      get({
        url: get_contract_detail,
        params: {
          id: id
        },
        success: res => {
          console.log(res);
          let signArr = [],
              linkArr = [];
          this.signingDeadline = res.contractSubject.signingDeadline ? this.formatTimeConvert(res.contractSubject.signingDeadline, 0) : ''
          this.fileTermination = res.contractSubject.fileTermination ? this.formatTimeConvert(res.contractSubject.fileTermination, 0) : ''
          res.contractFlowTasks.map(it => {
            // 签署
            if (it.processType == 2) {
              // 个人
              if (it.relationType == 1) {
                this.checkAuthFun({
                  type: 1,
                  name: it.userName,
                  phone: it.userPhone,
                  callback: isAuth => {
                    const signalItem = {
                      userName: it.userName,
                      userPhone: it.userPhone,
                      processType: it.processType,
                      sealName: this.getSealNameFun(it.sealType.split(',')),
                      sealType: it.sealType,
                      relationType: it.relationType,
                      status: it.status,
                      isPersonAuth: isAuth
                    };
                    signArr.push(signalItem);
                  }
                });
              } // 公司


              if (it.relationType == 2) {
                this.checkAuthFun({
                  type: 2,
                  companyName: it.companyName,
                  name: it.userName,
                  phone: it.userPhone,
                  callback: (person, company) => {
                    console.log(company, person);
                    const companyItem = {
                      companyName: it.companyName,
                      userName: it.userName,
                      userPhone: it.userPhone,
                      processType: it.processType,
                      sealName: this.getSealNameFun(it.sealType.split(',')),
                      sealType: it.sealType,
                      relationType: it.relationType,
                      status: it.status,
                      isPersonAuth: person,
                      isCompanyAuth: company
                    };
                    signArr.push(companyItem);
                  }
                });
              }
            } // 抄送


            if (it.processType == 4) {
              // 个人
              if (it.relationType == 1) {
                this.checkAuthFun({
                  type: 1,
                  name: it.userName,
                  phone: it.userPhone,
                  callback: isAuth => {
                    const signalItem = {
                      userName: it.userName,
                      userPhone: it.userPhone,
                      processType: it.processType,
                      sealName: this.getSealNameFun(it.sealType.split(',')),
                      sealType: it.sealType,
                      relationType: it.relationType,
                      status: it.status,
                      isPersonAuth: isAuth
                    };
                    linkArr.push(signalItem);
                  }
                });
              } // 公司


              if (it.relationType == 2) {
                this.checkAuthFun({
                  type: 2,
                  companyName: it.companyName,
                  name: it.userName,
                  phone: it.userPhone,
                  callback: (person, company) => {
                    console.log('company, ', person, company);
                    const companyItem = {
                      companyName: it.companyName,
                      userName: it.userName,
                      userPhone: it.userPhone,
                      processType: it.processType,
                      sealName: this.getSealNameFun(it.sealType.split(',')),
                      sealType: it.sealType,
                      relationType: it.relationType,
                      status: it.status,
                      isPersonAuth: person,
                      isCompanyAuth: company
                    };
                    linkArr.push(companyItem);
                  }
                });
              }
            }
          });
          setTimeout(() => {
            this.signMans = signArr
            this.linkMans = linkArr
            this.ishighLightFun();
          }, 300);
        },
        fail: function (err) {
          console.log(err);
        }
      });
    },

    getSealNameFun(arr) {
      let str = '';
      arr.forEach(it => {
        switch (it) {
          case '1':
            str += str == '' ? '手绘章' : ',手绘章';
            break;

          case '2':
            str += str == '' ? '企业章' : ',企业章';
            break;

          case '3':
            str += str == '' ? '法人代表章' : ',法人代表章';
            break;

          case '4':
            str += str == '' ? '模版章' : ',模版章';
            break;

          default:
            break;
        }
      });
      return str;
    },

    companySign() {
      uni.navigateTo({
        url: '/pages/contract/sign/next/companySign/companySign'
      });
    },

    personSign() {
      uni.navigateTo({
        url: '/pages/contract/sign/next/personSign/personSign'
      });
    },

    companyLink() {
      uni.navigateTo({
        url: '/pages/contract/sign/next/companyLink/companyLink'
      });
    },

    personLink() {
      uni.navigateTo({
        url: '/pages/contract/sign/next/personLink/personLink'
      });
    },

    //日期
    bindDateChange1(e) {
      this.signingDeadline = e.detail.value
    },

    bindDateChange2(e) {
      this.fileTermination = e.detail.value
    },

    back() {
      let arr1 = [...this.signMans, ...this.linkMans]

      const contractData = uni.getStorageSync('contractData');
      
      uni.showLoading({
        title: '加载中'
      });
      postBody({
        url: get_contract_launch,
        params: {
          "contractSubject": {
            "contractTitle": contractData.contractTitle,
            "fileTermination": this.fileTermination,
            "signingDeadline": this.signingDeadline,
            "userOrder": this.userOrder,
            "status": 5,
            "id": this.contractId
          },
          "contractFiles": [{
            "fileName": contractData.fileName,
            "filePath": contractData.url,
            "coverUrl": contractData.coverUrl
          }],
          "contractFlowTasks": arr1
        },
        success: data => {
          console.log(data);
          uni.hideLoading({});
          setTimeout(() => {
            uni.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000 //持续的时间
            });
          }, 50);
          uni.reLaunch({
            url: '/pages/contract/contractList/contractList?searchType=8&pageTitle=草稿箱'
          });
        },
        fail: function (err) {
          uni.hideLoading();
          setTimeout(() => {
            uni.showToast({
              title: err,
              icon: 'none',
              duration: 2000 //持续的时间

            });
          }, 50);
        }
      });
    },

    dragStart(e) {
      let copyItem = this.copyItem;
      const i = e.currentTarget.dataset.index;
      const query = uni.createSelectorQuery();
      copyItem.index = e.currentTarget.dataset.index;
      copyItem.companyName = this.signMans[i].companyName;
      copyItem.userName = this.signMans[i].userName;
      copyItem.userPhone = this.signMans[i].userPhone;
      copyItem.sealName = this.signMans[i].sealName;
      copyItem.isPersonAuth = this.signMans[i].isPersonAuth;
      copyItem.relationType = this.signMans[i].relationType;
      this.startX = e.changedTouches[0].clientX
      this.startY = e.changedTouches[0].clientY

      query.select('.listbox').boundingClientRect((rect) => {
        copyItem.top = e.changedTouches[0].clientY - rect.top - 30;
        this.copyItem = copyItem
      }).exec();
    },
    dragMove(e) {
      var query = uni.createSelectorQuery();
      var copyItem = this.copyItem;
      query.select('.listbox').boundingClientRect((rect) => {
        copyItem.top = e.changedTouches[0].clientY - rect.top - 30;

        if (copyItem.top < -60) {
          copyItem.top = -60;
        } else if (copyItem.top > rect.height) {
          copyItem.top = -60;
        }
        this.copyItem = copyItem
        this.showCopy = true
      }).exec();
    },
    dragEnd(e) {
      var i = e.currentTarget.dataset.index;
      var query = uni.createSelectorQuery();
      var copyItem = this.copyItem;
      var signMans = this.signMans;
      console.log(signMans);

      if (e.target.dataset.type == 'delete') {
        this.deleteSign(e);
      } else {
        if ((Math.abs(e.changedTouches[0].clientY - this.startY) > 10 || Math.abs(e.changedTouches[0].clientX - this.startX) > 10) && e.target.dataset.type != 'delete') {
          query.select('.listbox').boundingClientRect(function (rect) {
            copyItem.top = e.changedTouches[0].clientY - rect.top - 30;

            if (copyItem.top < -60) {
              copyItem.top = -60;
            } else if (e.changedTouches[0].clientY > rect.height) {
              copyItem.top = -60;
            }

            var target = parseInt(copyItem.top / 60);
            var replace = this.replace;

            if (target >= 0) {
              replace.companyName = signMans[target].companyName;
              replace.userPhone = signMans[target].userPhone;
              replace.userName = signMans[target].userName;
              replace.chapter = signMans[target].chapter;
              replace.personAuth = signMans[target].personAuth;
              replace.companyAuth = signMans[target].companyAuth;
              replace.signType = signMans[target].signType;
              replace.relationType = signMans[target].relationType;
              signMans[target].companyName = signMans[i].companyName;
              signMans[target].userPhone = signMans[i].userPhone;
              signMans[target].userName = signMans[i].userName;
              signMans[target].personAuth = signMans[i].personAuth;
              signMans[target].chapter = signMans[i].chapter;
              signMans[target].companyAuth = signMans[i].companyAuth;
              signMans[target].signType = signMans[i].signType;
              signMans[target].relationType = signMans[i].relationType;
              signMans[i].companyName = replace.companyName;
              signMans[i].userName = replace.userName;
              signMans[i].userPhone = replace.userPhone;
              signMans[i].chapter = replace.chapter;
              signMans[i].personAuth = replace.personAuth;
              signMans[i].companyAuth = replace.companyAuth;
              signMans[i].signType = replace.signType;
              signMans[i].relationType = replace.relationType;
            }

            this.signMans = signMans
          }).exec();
        }
      }

      setTimeout(() => {
        this.showCopy = false
      }, 20);
    },
    switchChange: function (e) {
      console.log(e.detail.value);
      this.isSort = e.detail.value
      this.userOrder = this.isSort ? 1 : 0
    },
    deleteSign: function (e) {
      var index = e.currentTarget.dataset.index;
      let copySigns = JSON.parse(JSON.stringify(this.signMans));
      copySigns.splice(index, 1);
      this.signMans = copySigns

      if (this.signMans.length < 2) this.isSort = false

      uni.setStorageSync('signMans', this.signMans);

    },
    deleteLink: function (e) {
      var index = e.currentTarget.dataset.index;
      let copyLinks = JSON.parse(JSON.stringify(this.linkMans));
      copyLinks.splice(index, 1);
      this.linkMans = copyLinks

      uni.setStorageSync('linkMans', this.linkMans);
    },
    next(e) {
      var arr1 = this.signMans;
      var arr2 = this.linkMans;
      arr1 = arr1.concat(arr2);
      const contractData = uni.getStorageSync('contractData');
      uni.showLoading({});
      postBody({
        url: get_contract_launch,
        params: {
          "contractSubject": {
            "contractTitle": contractData.contractTitle,
            "fileTermination": this.fileTermination,
            "signingDeadline": this.signingDeadline,
            "userOrder": this.userOrder,
            "status": 1
          },
          "contractFiles": [{
            "fileName": contractData.fileName,
            "filePath": contractData.url,
            "coverUrl": contractData.coverUrl
          }],
          "contractFlowTasks": arr1
        },
        success: data => {
          uni.hideLoading({});
          uni.navigateTo({
            url: '/pages/contract/sign/next/signConfirm/signConfirm?contractId=' + data
          });
        },
        fail: err => {
          setTimeout(() => {
            uni.showToast({
              title: err,
              icon: 'none'
            });
          }, 50);
        }
      });
    },

    onInput(event) {
      this.currentDate = event.detail
    }

  }
};
</script>
<style>
@import "./next.css";
</style>
