<template>
<view class="type-select">
	<view class="types-select-container" v-if="isLogin">
		<view v-if="items.length > 0">
			<view v-for="(item, index) in items" :key="index" class="type-item" @tap="goPage" :data-type="item.type" :data-name="item.name" :data-index="index">
				<text>{{item.name}}</text>
				<view class="count">
					<text class="item-count">{{item.count}}</text>
					<text class="iconfont iconright-arrow"></text>
				</view>
			</view>
		</view>
		<view v-else>
			<view class="is-nocontent">
				<text>暂无数据</text>
			</view>
		</view>
	</view>
	<view class="is-nologin" v-else>
		<text>请先登录</text>
	</view>
</view>
</template>

<script>
import { get } from '@api/request.js'
import { get_all_contract_list } from '@api/contract.js'
const app = getApp();

export default {
  data() {
    return {
      items: [],
      isLogin: true
    };
  },

  components: {},
  props: {},

  onLoad() {
    this.isLogin = app.globalData.isLoginIn()
  },

  onShow() {
    this.getContractDataAndCount();
  },

  onShareAppMessage() {},

  methods: {
    goPage(e) {
      if (!app.globalData.isLoginIn()) {
        uni.switchTab({
          url: '/pages/pm/pmHome'
        });
        return false;
      }

      const type = e.currentTarget.dataset.type;
      const name = e.currentTarget.dataset.name;
			
			// #ifdef  H5
			const currentUser = JSON.parse(uni.getStorageSync('currentUser'));
			// #endif
			
			// #ifndef  H5
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

      uni.navigateTo({
        url: `/pages/contract/contractList/contractList?searchType=${type}&pageTitle=${name}`
      });
    },

    getContractDataAndCount() {
      get({
        url: get_all_contract_list,
        success: res => {
          this.items = res
        }
      });
    }

  }
};
</script>
<style>
@import "./index.css";
</style>
