<template>
  <view class="add-person--page">
    <view class="title">输入信息</view>
    <view class="value-list">
      <view class="list-item">
        <text class="sub-tit">姓名</text>
        <input
          type="text"
          placeholder="请输入"
          v-model="name"
          @input="_handleChangeName"
          @blur="handleBlurUserNameFun"
        />
        <view :class="'suggest-list ' + (suggests ? 'show' : '')">
          <view
            v-for="(item, index) in suggests"
            :key="index"
            class="item"
            @tap.stop="handleSelectSuggestFun(item)"
            >{{ item.name }} - {{ item.phone }}</view
          >
        </view>
      </view>
      <view class="list-item">
        <text class="sub-tit">账号</text>
        <input
          type="number"
          maxlength="11"
          v-model="phone"
          placeholder="请输入"
        />
      </view>
    </view>
    <view class="btn-group">
      <view class="cancel" @tap="handleBackFun">撤回</view>
      <view
        :class="'confirm ' + (canNext ? 'canNext' : '')"
        @tap="handleConfirmFun"
        >确定</view
      >
    </view>
  </view>
</template>

<script>
import { get } from '@api/request.js'
import { get_signal_sign_person_list } from '@api/template.js'
import { person_message } from '@api/account.js'
const util = require('@u/utils')

export default {
  data() {
    return {
      suggests: [], // suggest列表
      timer: null, // 定时器
      name: '',
      phone: '',
      id: '', // 模版id
      index: -1, // 当前编辑的索引
    }
  },
  onLoad: function(options) {
    this.id = options.id
    this.index = options.index
    this.name = options.name || ''
    this.phone = options.phone || ''
  },
  onShareAppMessage: function() {},
  computed: {
    canNext() {
      return this.name && this.phone
    },
  },
  methods: {

    /**
     * @name 姓名chang事件
     */
    _handleChangeName() {
      if (this.name.trim()) {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.getContactList(this.name)
        }, 200)
      }
    },
    /**
     * @name 姓名blur事件
     */
    handleBlurUserNameFun() {
      setTimeout(() => {
        this.suggests = []
      }, 300)
    },

    /**
     * @name 获取suggesst列表
     */
    getContactList(name, type) {
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        get({
          url:
            get_signal_sign_person_list +
            '?contactType=1&name=' +
            name +
            '&contactType=' +
            type,
          success: (res) => {
            this.suggests = res
          },
          fail: (err) => {
            console.log(err)
          },
        })
      }, 500)
    },

    /**
     * @name select suggest
     */
    handleSelectSuggestFun(item) {
      this.name = item.name
      this.phone = item.phone
      this.suggests = []
    },

    /**
     * @name 撤回
     */
    handleBackFun() {
      uni.navigateBack(-1)
    },

    /**
     * @name 确认
     */
    handleConfirmFun() {
      if (!this.name) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请填写姓名',
          })
        }, 50)
      }

      if (!this.phone) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请填写账号',
          })
        }, 50)
      }

      if (!util.isTelCode(this.phone)) {
        return void setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请填写正确手机号',
          })
        }, 50)
      } // 编辑态获取填写的人的认证状态

      if (this.index > -1) {
        uni.showLoading({
          title: '获取认证信息中',
        })
        get({
          url: person_message + '?name=' + this.name + '&phone=' + this.phone,
          success: (res) => {
            console.log(res)
            uni.redirectTo({
              url:
                '/pages/template/useTemplate/index?origin=person&operate=edit&index=' +
                this.index +
                '&name=' +
                this.name +
                '&phone=' +
                this.phone +
                '&id=' +
                this.id +
                '&personAuthStatus=' +
                res,
            })
          },
          fail: (err) => {
            setTimeout(() => {
              uni.showToast({
                icon: 'none',
                title: err,
              })
            }, 50)
          },
          complete: () => {
            uni.hideLoading()
          },
        })
      } else {
        uni.redirectTo({
          url:
            '/pages/template/useTemplate/index?origin=person&operate=add&index=' +
            this.index +
            '&name=' +
            this.name +
            '&phone=' +
            this.phone +
            '&id=' +
            this.id,
        })
      }
    },
  },
}
</script>
<style>
@import './index.css';
</style>
