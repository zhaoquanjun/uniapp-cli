<template>
<!--components/home-add-dataStorge/home-add-dataStorge.wxml-->
<view class="weui-half-screen-dialog__bd">
  <view class="item-header">
  <view style="display:flex; align-items: center;">
  <view class="label"></view>
  <view class="title">云公证</view>
  </view>
  <view class="checkAll" @tap.stop="skiptoEvidence">查看全部</view>
  </view>
  <view class="item-content">
	<view v-for="(item, index) in menuList" :key="index" class="meun-list__item" :data-item="item" :data-type="item.type" @tap.stop="openMenu">
		<image class="img" :src="item.imgUrl" mode="aspectFit"></image>
		<text class="words">{{item.name}}</text>
	</view>
  </view>
</view>
</template>

<script>
// components/home-add-dataStorge/home-add-dataStorge.js
const app = getApp();

export default {
  data() {
    return {
      dialog1: false,
      menuList: [{
        type: 'image',
        imgUrl: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/image.png',
        id: '1',
        name: '图片存证'
      }, {
        type: 'file',
        imgUrl: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/file.png',
        id: '5',
        name: '文件存证'
      }, {
        type: 'voice',
        imgUrl: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/voice.png',
        id: '3',
        name: '语音存证'
      }, {
        type: 'video',
        imgUrl: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/video.png',
        id: '4',
        name: '视频存证'
      }]
    };
  },

  components: {},
  props: {},
  methods: {
    openMenu(e) {
      if (!app.globalData.isLoginIn()) {
        uni.switchTab({
          url: '/pages/pm/pmHome'
        });
        return false;
      }

      const type = e.currentTarget.dataset.type;
			// #ifdef H5
			const currentUser = JSON.parse(localStorage.getItem('currentUser'));
			// #endif
			
			// #ifndef H5
			const currentUser = uni.getStorageSync('currentUser');
			// #endif
      
      let isAuth = false;

      if (currentUser.companyId && currentUser.authStatus == 1 || !currentUser.companyId && currentUser.auth == 1) {
        isAuth = true;
      }

      if (!isAuth && currentUser.companyId) {
        uni.showModal({
          title: '立即进行企业实名认证',
          content: '实名认证后可享受加便捷高效的电子合同服务',
          showCancel: true,
          cancelText: '暂不认证',
          confirmText: '立即认证',
          success: function (res) {
            if (res.cancel) {
              const pages = getCurrentPages();

              if (pages.length > 1) {
                uni.navigateBack();
              }

              uni.hideLoading({});
            } else {
              uni.navigateTo({
                url: "/pages/authentication/company/company-auth-type/index"
              });
            }
          }
        });
        return false;
      }

      if (!isAuth && !currentUser.companyId) {
        uni.showModal({
          title: '立即进行个人实名认证',
          content: '实名认证后可享受加便捷高效的电子合同服务',
          showCancel: true,
          cancelText: '暂不认证',
          confirmText: '立即认证',
          success: function (res) {
            if (res.cancel) {
              const pages = getCurrentPages();

              if (pages.length > 1) {
                uni.navigateBack();
              }

              uni.hideLoading({});
            } else {
              uni.navigateTo({
                url: "/pages/authentication/personal/person-auth-type/index"
              });
            }
          }
        });
        return false;
      }

      if (type == 'video') {
        uni.navigateTo({
          url: '/pages/evidence/videoRecord/videoRecord?type=' + type
        });
      } else {
				if (type == 'file') {
					// #ifdef MP-ALIPAY
					uni.navigateTo({
					  url: '/pages/evidence/fileRecord/fileRecord?type=' + type
					});
					// #endif
					
					// #ifdef MP-WEIXIN
					uni.navigateTo({
					  url: '/pages/evidence/addCertificate/addCertificate?type=' + type
					});
					// #endif
				} else {
					uni.navigateTo({
					  url: '/pages/evidence/addCertificate/addCertificate?type=' + type
					});
				}
       
      }
    },

    skiptoEvidence() {
      uni.navigateTo({
        url: '/pages/evidence/evidenceList/index'
      });
    }

  }
};
</script>
<style>
@import "./home-add-dataStorge.css";
</style>
