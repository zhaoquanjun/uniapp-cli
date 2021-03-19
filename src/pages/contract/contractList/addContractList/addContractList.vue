<template>
  <view class="add-contract-list">
    <!--pages/contract/contractList/addContractList/addContractList.wxml-->
    <view class="pl-search">
      <search
        @inputChanged="inputSearchFun"
        @cancelClicked="cancleSearchFun"
        :timeSearch="true"
        :isShowCancel="true"
      ></search>
    </view>
    <view class="list-wrapper_title">已选：{{ selectList.length }}</view>
    <scroll-view
      class="list-wrapper"
      scroll-y="true"
      scroll-anchoring="true"
      scroll-with-animation="true"
      @scrolltolower="scrollToBottom"
    >
      <checkbox-group @change="getSelectList">
        <view
          v-for="(item, index) in contracts"
          :key="index"
          class="contract"
          :data-index="index"
          :data-item="item"
        >
          <view class="checkbox-wrap">
            <checkbox :value="item.id">
              <view class="checkbox-content">
                <view class="contract-introduce">
                  <view class="contract-title">
                    <searchHighlightTextView
                      highlight="highlight"
                      :text="item.contractTitle"
                      :keyword="searchParams"
                    ></searchHighlightTextView>
                    <text v-if="searchType == 2"
                      >（{{ item.approve == 1 ? '待审批' : '待签署' }}）</text
                    >
                  </view>
                  <view class="contract-right">
                    <view
                      class="status-icon"
                      :style="'background: ' + item.bgStyle + ';'"
                    ></view>
                    <view class="contract-state">{{
                      searchType == 2 && item.approve == 1
                        ? '待审批'
                        : searchType == 2 && item.approve != 1
                        ? '待签署'
                        : item.statusText
                    }}</view>
                  </view>
                </view>
                <view class="contract-related">
                  <view class="contract-sponsor"
                    >发起方：{{ item.initiatorName }}
                  </view>
                  <view class="contract-signatory"
                    >签署方：{{ item.signNames }}
                  </view>
                </view>
                <view class="contract-other">
                  <view class="contract-updatetime">更新时间 </view>
                  <view class="contract-updatetime-middle"></view>
                  <view class="time">{{ item.gmtModified }} </view>
                </view>
              </view>
            </checkbox>
          </view>
        </view>
      </checkbox-group>
    </scroll-view>
    <view class="empty-data placeholder-color" v-if="contracts.length <= 0"
      >暂无数据</view
    >

    <button class="launchButton" @tap="saveContractEvidenceRel">
      确定添加
    </button>
  </view>
</template>

<script>
import { get, postBody } from '@api/request.js'
import {
  findNoRelatedContractSubject,
  saveEvidenceContractRel,
} from '@api/contract.js'
var utils = require('@u/utils.js')
import search from '@c/search/search'
import searchHighlightTextView from '@c/searchHighlightTextView/searchHighlightTextView'
import halfSlideItem from '@c/halfSlideItem/halfSlideItem'

export default {
  data() {
    return {
      searchType: 0,
      pageIndex: 0,
      pageSize: 10,
      searchParams: '',
      contracts: [],
      timer: null,
      canScroll: true,
      selectList: [],
      pageId: null,
    }
  },

  components: {
    search,
    searchHighlightTextView,
    halfSlideItem,
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.pageId = options.id
  },

  /**
   * @desc 下拉刷新
   */
  onPullDownRefresh() {
    this.getChainsFun(true)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getChainsFun(true)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  methods: {
    /**
     * 获取列表
     */
    getChainsFun(isSearch) {
      var params = {
        contractTitle: this.searchParams ? this.searchParams : '',
        certificateEvidenceId: this.pageId,
      }
      get({
        url: findNoRelatedContractSubject,
        params: params,
        success: res => {
          var contracts = res
          this.canScroll = !!res.length
          contracts.map((it) => {
            it.gmtModified = this.formatTimeConvert(it.gmtModified, 1)
          })
          this.contracts = isSearch ? contracts : [...this.contracts, ...contracts]
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

    /**
     * @name 搜索
     * @param {*} e 事件源
     */
    inputSearchFun: function(e) {
      if (this.timer) clearTimeout(this.timer)
      this.searchParams = e.detail
      this.pageIndex = 0
      this.timer = setTimeout(() => {
        this.getChainsFun(true)
      }, 300)
    },

    /**
     * @name 取消搜索
     */
    cancleSearchFun() {
			this.searchParams = ''
      this.getChainsFun(true)
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
     * @name 滑动触底
     */
    scrollToBottom() {},

    /**
     * @desc 获取选中的值
     */
    getSelectList(e) {
			this.selectList = e.detail.value
    },

    /**
     * @desc 添加证据链关联
     */
    saveContractEvidenceRel() {
      if (this.selectList.length == 0) {
        return
      }

      const params = {
        certificateEvidenceId: this.pageId,
        contractSubjectIds: [...this.selectList],
      }
      postBody({
        url: saveEvidenceContractRel,
        params: params,
        success: (res) => {
          this.getChainsFun()
          uni.showModal({
            title: '提交成功',
            content: '',
            showCancel: false,
            success: (data) => {
              if (data.confirm) {
                uni.navigateBack({})
              }
            },
          })
        },
        fail: (err) => {
          console.log(err)
        },
      })
    },
  },
}
</script>
<style>
@import './addContractList.css';
</style>
