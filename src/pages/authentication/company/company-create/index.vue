<template>
  <view class="company-create-info">
    <view class="base-info-container">
      <view class="field-item">
        <label class="name">企业名称</label>
      </view>
      <view class="field-item">
        <input
          class="value-input"
          placeholder="请输入企业名称，请确保与营业执照上的名称一致"
          v-model="companyName"
        />
      </view>
    </view>
    <view class="tip">
      提示：创建企业并实名成功后，将自动成为该企业管理员，并生成对应企业名称的公章
    </view>

    <view class="bottom-btn-container">
      <text
        class="next"
        @tap.stop="next"
        :style="'background:' + (ishighLight ? '#464646' : '#B7B7B7')"
        >确认</text
      >
    </view>
  </view>
</template>

<script>
import { get } from '@api/request.js'
import { createCompany } from '@api/authen.js'

export default {
  data() {
    return {
      companyName: '',
    }
  },
  onShareAppMessage() {},
  computed: {
    ishighLight() {
      return !!this.companyName
    },
  },
  methods: {
    next() {
      let mgs = []

      if (!this.companyName) {
        mgs.push('企业名称')
      }

      if (mgs.length) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: mgs.join('、') + '不能为空',
          })
        }, 50)
      }

      uni.showLoading({
        title: '加载中',
      })
      get({
        url: `${createCompany}?companyName=${this.companyName}`,
        success: (res) => {
          uni.hideLoading()
          uni.navigateTo({
            url: `/pages/authentication/company/company-auth-type/index?companyId=${res}`,
          })
        },
        fail: (err) => {
          uni.hideLoading()
          setTimeout(() => {
            uni.showToast({
              title: err,
              icon: 'none',
            })
          }, 50)
        },
      })
    },
  },
}
</script>
<style>
@import './index.css';
</style>
