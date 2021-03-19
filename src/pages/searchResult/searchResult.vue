<template>
  <view>
    <!--pages/searchResult/searchResult.wxml-->
    <view class="contract-search">
      <search
        @inputChanged="inputSearchFun"
        @cancelClicked="cancleSearchFun"
        :timeSearch="true"
        :isShowCancel="true"
      ></search>
    </view>
    <view class="recent-search" v-if="contracts.length > 0">搜索结果</view>
    <view
      v-for="(item, index) in contracts"
      :key="index"
      class="contract"
      style="border-bottom:2rpx solid #F5F5F5FF;"
      :data-item="item"
      :data-index="index"
      @tap="pushToDetail"
    >
      <view
        class="contract-introduce"
        style="border-bottom:2rpx solid #ffffff;"
      >
        <view class="contract-title">
          <searchHighlightTextView
            highlight="highlight"
            :text="item.contractTitle"
            :keyword="keyName"
          ></searchHighlightTextView>
        </view>
        <view class="contract-right">
          <view
            class="status-icon"
            :style="'background: ' + item.bgStyle + ';'"
          ></view>
          <view class="contract-state">{{ item.statusText }}</view>
        </view>
      </view>
      <view class="contract-related">
        <view class="contract-sponsor">发起方：{{ item.initiatorName }} </view>
        <view class="contract-signatory">签署方：{{ item.signNames }} </view>
      </view>
      <view class="contract-other">
        <view class="time">{{ item.gmtModified }} </view>
      </view>
    </view>
    <view class="empty-data placeholder-color" v-if="contracts.length <= 0"
      >暂无相关合同</view
    >
  </view>
</template>

<script>
import { get } from '@api/request.js'
import { get_contract_list } from '@api/contract.js'
var utils = require('@u/utils.js')
import search from '@c/search/search'
import searchHighlightTextView from '@c/searchHighlightTextView/searchHighlightTextView'

export default {
  data() {
    return {
      searchType: 0,
      searchParams: '',
      contracts: [],
      timer: null,
      currentContractTitle: '',
      keyName: '',
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
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  /* onReady: function () {
    },*/

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getContractsFun()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  onShareAppMessage() {},
  /**
   *
   */
  methods: {
    /**
     * @name 获取当前合同状态值
     * @param {status} 当前状态
     */
    getCurrentContractStatusFun(status) {
      switch (status) {
        case 1:
          return {
            name: '签署中',
            bg: 'red',
          }
          break

        case 2:
          return {
            name: '已完成',
            bg: 'red',
          }
          break

        case 3:
          return {
            name: '已拒绝',
            bg: 'red',
          }
          break

        case 4:
          return {
            name: '已撤销',
            bg: '#396FFF',
          }
          break

        case 5:
          return {
            name: '草稿',
            bg: '#02B449  ',
          }
          break

        case 6:
          return {
            name: '已失效',
            bg: '#02B449',
          }
          break

        case 7:
          return {
            name: '填写中',
            bg: 'red',
          }
          break

        case 8:
          return {
            name: '已废除',
            bg: '#C7C7C7',
          }
          break

        default:
          break
      }
    },

    /**
     * @name 搜索
     * @param {*} e 事件源
     */
    inputSearchFun: function(e) {
      this.keyName = e.detail
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getContractsFun(e.detail)
      }, 300)
    },

    /**
     * @name 取消搜索
     */
    cancleSearchFun() {
      ;(this.pageIndex = 0), this.getContractsFun()
    },

    /**
     * 获取文件列表
     * 根据currnetIndex
     * 状态（ 0:全部合同,1:我发起的,2:待自己处理,3:待他人处理,4:已完成,5:已失效,6:已拒签,7:抄送我的,8:草稿箱）
     */
    getContractsFun: function(title) {
      var url = get_contract_list
      var params = {
        searchType: 0,
        contractTitle: title ? title : '',
        pageIndex: 0,
        pageSize: 10,
      }
      get({
        url: url,
        params: params,
        success: (res) => {
          console.log(res)
          var contracts = res.data
          contracts.map((it) => {
            let result = this.getCurrentContractStatusFun(it.status)
            console.log(result, 999)
            it.gmtModified = this.formatTimeConvert(it.gmtModified, 0)
            it.statusText = result.name
            it.bgStyle = result.bg
          }),
            (this.contracts = contracts)
        },
        fail: err => {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: err
            })
          }, 50)
        },
      })
    },
    formatDateFun: data => {
      data.forEach((e) => {
        e.gmtModified = this.formatTimeConvert(e.gmtModified, 0)
      })
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
        return y + '-' + m + '-' + d
      } else {
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
      }
    },

    /**
     * 跳转到详情
     */
    pushToDetail: function(e) {
      const contractId = e.currentTarget.dataset.item.id
      uni.navigateTo({
        url:
          '/pages/contract/sign/next/signConfirm/signConfirm?contractId=' +
          contractId,
      })
    },
  },
}
</script>
<style>
@import './searchResult.css';
</style>
