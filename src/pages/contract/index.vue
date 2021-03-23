<template>
  <view class="type-select">
    <view class="types-select-container" v-if="hasLogin">
      <view v-if="items.length > 0">
        <view
          v-for="(item, index) in items"
          :key="index"
          class="type-item"
          @tap="goPage(item)"
        >
          <text>{{ item.name }}</text>
          <view class="count">
            <text class="item-count">{{ item.count }}</text>
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
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      items: [],
    }
  },
  onShow() {
    this.getContractDataAndCount()
  },

  onShareAppMessage() {},

  computed: {
    ...mapState({
      currentUser: (state) => state.currentUser,
    }),
    ...mapGetters(['hasLogin']),
  },

  methods: {
    goPage(item) {
      if (!this.hasLogin)
        return void uni.switchTab({
          url: '/pages/pm/pmHome',
        })

      let isAuth = false

      if (
        (this.currentUser.companyId && this.currentUser.authStatus == 1) ||
        (!this.currentUser.companyId && this.currentUser.auth == 1)
      )
        isAuth = true

      if (!isAuth && this.currentUser.companyId) {
        return void uni.showModal({
          title: '立即进行企业实名认证',
          content: '实名认证后可享受加便捷高效的电子合同服务',
          showCancel: true,
          cancelText: '暂不认证',
          confirmText: '立即认证',
          success: (res) => {
            if (res.cancel) {
              if (getCurrentPages().length > 1) uni.navigateBack()
              uni.hideLoading({})
            } else {
              uni.navigateTo({
                url: '/pages/authentication/company/company-auth-type/index',
              })
            }
          },
        })
      }

      if (!isAuth && !this.currentUser.companyId) {
        return void uni.showModal({
          title: '立即进行个人实名认证',
          content: '实名认证后可享受加便捷高效的电子合同服务',
          showCancel: true,
          cancelText: '暂不认证',
          confirmText: '立即认证',
          success: (res) => {
            if (res.cancel) {
              if (getCurrentPages().length > 1) uni.navigateBack()
              uni.hideLoading({})
            } else {
              uni.navigateTo({
                url: '/pages/authentication/personal/person-auth-type/index',
              })
            }
          },
        })
      }

      uni.navigateTo({
        url: `/pages/contract/contractList/contractList?searchType=${item.type}&pageTitle=${item.name}`,
      })
    },

    getContractDataAndCount() {
      get({
        url: get_all_contract_list,
        success: (res) => {
          this.items = res
        },
      })
    },
  },
}
</script>
<style>
@import './index.css';
</style>
