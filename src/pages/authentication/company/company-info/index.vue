<template>
<view class="company-info">
    <view class="type-select-header">
        <text class="type-text">企业基本信息</text>
    </view>
    <view class="upload-container">
        <view class="title">
            多合一营业执照
            <view class="line"></view>
        </view>
        <view class="upload-bottom">
            <view class="left" @tap.stop="chooseImage">
                <image :src="businessImage" v-if="businessImage"></image>
                <text class="iconfont iconadd" v-if="!businessImage"></text>
            </view>
            <view class="right">
                <view style="tip">1.请确保营业执照勿遮挡、缺边</view>
                <view style="tip">2.请确保图片中所有字体清晰可见</view>
                <view style="tip">3.图片大小不超过8M</view>
            </view>
        </view>
    </view>
    <view class="base-info-container">
        <view class="field-item">
            <label class="name">企业类型</label>
            <picker @change="bindPickerChange" range-key="label" v-model="companyTypeIndex" :range="companyTypes">
                <label class="value-select">
                    {{companyTypes[companyTypeIndex].label}}
                    <text class="iconfont iconicon_down_arrow"></text>
                </label>
            </picker>

        </view>
        <view class="field-item">
            <label class="name">企业名称</label>
            <input class="value-input" placeholder="请输入" v-model="companyName" />
        </view>
        <view class="field-item">
            <label class="name">统一社会信用代码</label>
            <input class="value-input" placeholder="请输入" v-model="creditCode" />
        </view>
        <view class="field-item">
            <label class="name">法定代表人姓名</label>
            <input class="value-input" placeholder="请输入" v-model="legalPersonName" />
        </view>
    </view>

    <view class="bottom-btn-container">
        <text class="back" @tap.stop="back">返回</text>
        <text class="next" @tap.stop="next" :style="'background:' + (ishighLight ? '#464646' : '#B7B7B7')">下一步</text>
    </view>

</view>
</template>

<script>
import { postBody, upload } from '@api/request.js'
import { businessLicenseUpload, companyAuth, companyHandle } from '@api/authen.js'
import { create_seal, upload_company_seal } from '@api/seal.js'
import { mapMutations, mapState } from 'vuex'
const FXQ = require("@u/FXQ");

export default {
  data() {
    return {
      businessImage: null,
      companyName: '',
      companyId: '',
      creditCode: '',
      companyTypeIndex: 0,
      legalPersonName: '',
      companyTypes: [{
          label: '请选择',
          value: 0
        }, {
        label: '企业',
        value: 1
      }, {
        label: '个体工商户',
        value: 2
      }, {
        label: '律所',
        value: 6
      }, {
        label: '其他组织',
        value: 5
      }],
      query: {},
    };
  },
  onLoad(option) {
    this.query = option
  },

  onShow() {
    let arr = []
    if (this.query.type == 'legent') {
      arr = [{
          label: '请选择',
          value: 0
        }, {
          label: '企业',
          value: 1
        }, {
          label: '个体工商户',
          value: 2
        }]
    } else {
      arr = [{
          label: '请选择',
          value: 0
        }, {
          label: '企业',
          value: 1
        }, {
          label: '个体工商户',
          value: 2
        }, {
          label: '律所',
          value: 6
        }, {
          label: '其他组织',
          value: 5
        }]
    }
    this.companyTypes = arr
  },
  computed: {
    ...mapState({
      currentUser: state => state.currentUser
    }),
    ishighLight() {
      return !(!this.companyName || !this.creditCode || !this.legalPersonName || !this.businessImage || !this.companyTypeIndex)
    }
  },
  methods: {
    ...mapMutations(['updateStateAttr']),
    uploadImage(tmpUrl) {
      uni.showLoading({
        title: '识别中...'
      });
      upload({
        url: businessLicenseUpload,
        filePath: tmpUrl,
        key: 'businessImage',
        success: res => {
          uni.hideLoading();
          this.companyName = res.companyName
          this.creditCode = res.creditCode
          this.legalPersonName = res.legalPersonName
        },
        fail: err => {
          uni.hideLoading();
          setTimeout(() => {
            uni.showToast({
              title: err,
              icon: 'none'
            });
          }, 50);
        }
      });
    },

    bindPickerChange(e) {
      this.companyTypeIndex = e.detail.value
    },

    chooseImage() {
      uni.chooseImage({
        count: 1,
        // 默认9
        sizeType: ['compressed'],
        // 可以指定是原图还是压缩图，默认二者都有
        success: res => {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFilePaths = res.tempFilePaths;
          this.businessImage = tempFilePaths[0]
          this.uploadImage(tempFilePaths[0]);
        }
      });
    },

    next() {
      let mgs = [];
			if (!this.companyName) {
			  mgs.push('企业名称');
			}

      if (!this.creditCode) {
        mgs.push('统一社会信用代码');
      }
			
			if (!this.legalPersonName) {
			  mgs.push('法定代表人姓名');
			}
			
			if (this.companyTypeIndex == 0) {
				mgs.push('企业类型');
			}

      if (this.query.type == 'legent' && !/^9+/.test(this.creditCode)) {
        return void setTimeout(() => {
					wx.showModal({
					  title: '提示',
					  content: '法人认证统一社会信用代码需为9开头，非9请走代理人认证',
						showCancel: false,
					  success: res => {
					    if (res.confirm) {
					      console.log('用户点击确定')
					    } else if (res.cancel) {
					      console.log('用户点击取消')
					    }
					  }
					})
        }, 50);
      }

      if (mgs.length) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: mgs.join('、') + '不能为空'
          });
        }, 50);
      }

      let params = {
        companyType: this.companyTypes[this.companyTypeIndex].value,
        companyName: this.companyName,
        creditCode: this.creditCode,
        legalPersonName: this.legalPersonName,
        companyId: this.currentUser.companyId || this.query.companyId,
        authChannel: 2
      };
      uni.showLoading({
        title: '加载中'
      }); // 法人

      if (this.query.type == 'legent') {
        postBody({
          url: companyAuth,
          params,
          success: () => {
            const newUser = Object.assign({}, this.currentUser, params);
            this.getSealBase64Fun();
            uni.hideLoading();
            this.updateStateAttr({currentUser: newUser})
            uni.navigateTo({
              url: '/pages/authentication/company/auth-result/index?result=s'
            });
          },
          fail: err => {
            uni.hideLoading();
            setTimeout(() => {
              uni.showToast({
                title: err,
                icon: 'none'
              });
            }, 50);
          }
        });
      } else {
        postBody({
          url: companyHandle,
          params,
          success: () => {
            uni.hideLoading();
            let newUser = JSON.parse(JSON.stringify(this.currentUser))
            newUser.authStatus = 1;
            this.updateStateAttr({currentUser: newUser, isAuth: true})
            uni.setStorageSync('companyInfoApply', params);
            uni.navigateTo({
              url: '/pages/authentication/company/company-pay-info/index'
            });
          },
          fail: () => {
            uni.hideLoading();
            uni.navigateTo({
              url: '/pages/authentication/company/auth-result/index?result=f'
            });
          }
        });
      }
    },

    back() {
      uni.navigateBack();
    },

    /**
     * @name 生成base
     */
    getSealBase64Fun() {
      FXQ.FXQ.companySeal(this.company.companyName || '公司名字', 0, 0, '', '  ', this.createSealFun);
    },

    /**
     * @name 生成印章
     */
    createSealFun(base64) {
      postBody({
        url: create_seal,
        params: {
          base64String: base64
        },
        success: res => {
          this.uploadCompanySealFun(res);
        },
        fail: err => {
          console.log(err);
        }
      });
    },

    /**
     * @name 上传印章
     * @param {*} url path
     */
    uploadCompanySealFun(data) {
      let options = {
        name: "公司印章",
        url: data.url,
        auto: true
      };
      postBody({
        url: upload_company_seal + '?auto=' + true,
        params: options,
        success: () => {
          console.log('印章制作完成');
        },
        fail: error => {
          uni.hideLoading();
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: error
            });
          }, 50);
        }
      });
    }

  }
};
</script>
<style>
@import "./index.css";
</style>
