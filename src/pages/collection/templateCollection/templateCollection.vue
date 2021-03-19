<template>
  <view>
    <!--pages/home/templateCollection/templateReceipt.wxml-->
    <view class="contract-search">
      <search
        @inputChanged="inputSearchFun"
        @cancelClicked="cancleSearchFun"
        :timeSearch="true"
        :isShowCancel="true"
      ></search>
    </view>
    <scroll-view
      scroll-y="true"
      refresher-enabled="true"
      lower-threshold="0"
      scroll-anchoring="true"
      :refresher-triggered="isPullingDown"
      class="template-list"
      @refresherrefresh="handlePullDownFun"
      @scrolltolower="handleToBottomFun"
    >
      <view
        v-for="(item, index) in payTemplates"
        :key="index"
        class="payTemplate"
        :data-name="item.name"
        :data-amount="item.amount"
        :data-id="item.id"
        @tap="templateSelect"
      >
        <view class="template-content">
          <view class="template-content-top">
            <view class="template-title">
              <searchHighlightTextView
                highlight="highlight"
                :text="item.name"
                :keyword="keyName"
              >
              </searchHighlightTextView>
            </view>
            <view class="template-right">
              <text class="price">¥ {{ item.amount }}</text>
              <text class="iconfont iconright-arrow"></text>
            </view>
          </view>
          <view class="update-time">模板更新时间：{{ item.gmtModified }}</view>
        </view>
      </view>
      <view class="bottom-loading" v-if="isLoadingMore">加载中...</view>
    </scroll-view>

    <view
      class="touch-bottom--tips"
      v-if="total <= saleTemplates.length && total > 0"
    >
      <view class="line"></view>
      <text class="words">没有更多了</text>
      <view class="line"></view>
    </view>
  </view>
</template>

<script>
import { get } from '@api/request.js'
import { get_pay_template_list } from '@api/collection.js'
const utils = require('@u/utils.js')
import search from '@c/search/search'
import searchHighlightTextView from '@c/searchHighlightTextView/searchHighlightTextView'

export default {
  data() {
    return {
      payTemplates: [],
      timer: null,
      keyName: '',
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      isTemplate: 1,
      isPullingDown: false,
      isLoadingMore: false,
    }
  },

  components: {
    search,
    searchHighlightTextView,
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.isTemplate = options.isTemplate
    this.getTemplate()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    /**
     * @name 获取模版列表数据
     * @params {*} name 模版名称 - 模糊搜索
     */
    getTemplate() {
      var params = {
        name: this.keyName || '',
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      }
      get({
        url: get_pay_template_list,
        params: params,
        success: (res) => {
          let templateMessage = res.data
          templateMessage.map((it) => {
            it.gmtModified = this.formatTimeConvert(it.gmtModified, 1)
            it.amount = (it.amount / 100).toFixed(2)
          })
          this.payTemplates = [...this.payTemplates, ...templateMessage]
          this.total = res.totalCount
          this.isPullingDown = false
          this.isLoadingMore = false
        },
        fail: (err) => {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: err,
            })
          }, 50)
        },
      })
    },

    /**
     * @name 下拉刷新
     */
    handlePullDownFun() {
      this.pageIndex = 1
      this.pageSize = 10
      this.total = 0
      this.payTemplates = []
      this.isPullingDown = true
      this.getTemplate()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    handleToBottomFun() {
      if (this.total <= this.contractTemplates.length) return
      this.pageIndex = this.pageIndex + 1
      this.isLoadingMore = true
      this.getTemplate()
    },

    /**
     * @name 时间格式化
     * @param {*} timestamp
     * @param {*} num
     */
    formatTimeConvert(timestamp, num) {
      timestamp = timestamp + ''
      timestamp = timestamp.length == 10 ? timestamp * 1000 : timestamp
      var date = new Date(Number(timestamp))
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      var h = date.getHours()
      h = h < 10 ? '0' + h : h
      var minute = date.getMinutes()
      var second = date.getSeconds()
      minute = minute < 10 ? '0' + minute : minute
      second = second < 10 ? '0' + second : second

      if (num == 0) {
        return y + '年' + m + '月' + d + '日'
      } else {
        return (
          y + '年' + m + '月' + d + '日' + ' ' + h + ':' + minute + ':' + second
        )
      }
    },

    /**
     * @name 选择模版
     */
    templateSelect(e) {
      const templateName = e.currentTarget.dataset.name
      const templateAmount = e.currentTarget.dataset.amount
      const templateId = e.currentTarget.dataset.id
      uni.navigateTo({
        url: `/pages/collection/dirctCollection/dirctCollection?templateName=${templateName}&templateAmount=${templateAmount}&isTemplate=${this.isTemplate}&templateId=${templateId}`,
      })
    },

    /**
     * @name 搜索
     * @param {*} e 事件源
     */
    inputSearchFun: function(e) {
      this.keyName = e.detail
      this.pageIndex = 1
      this.total = 0
      if (this.timer) clearTimeout(this.timer)
      this,
        (timer = setTimeout(() => {
          this.getTemplate(e.detail)
        }, 300))
    },

    /**
     * @name 取消搜索
     */
    cancleSearchFun() {
      this.keyName = ''
      this.pageIndex = 1
      this.payTemplates = []
      this.getTemplate()
    },
  },
}
</script>
<style>
@import './templateCollection.css';
</style>
