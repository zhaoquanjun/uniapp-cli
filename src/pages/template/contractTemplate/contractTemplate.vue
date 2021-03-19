<template>
<view>
<!--pages/contract/contractList/contractTemplate/contractTemplate.wxml-->
<view class="contract-search">
	<search @inputChanged="inputSearchFun" @cancelClicked="cancleSearchFun" :timeSearch="true" :isShowCancel="true"></search>
</view>
<view v-for="(item, index) in contractTemplates" :key="index" class="contract-template" @tap="templateSelect" :data-id="item.id">
	<image :src="icon" mode="aspectFit" class="img"></image>
	<view class="template-content">
		<view class="template-title">
			<searchHighlightTextView highlight="highlight" :text="item.name" :keyword="keyName"></searchHighlightTextView>
		</view>
		<view class="update-time">模板更新时间：{{item.gmtModified}}</view>
	</view>
</view>
<view class="touch-bottom--tips" v-if="total <= contractTemplates.length && total > 0">
	<view class="line"></view>
	<text class="words">已经到底了</text>
	<view class="line"></view>
</view>
</view>
</template>

<script>
import { get } from '@api/request.js'
import { get_templateList } from '@api/template.js'
const utils = require("@u/utils.js");
import search from "@c/search/search";
import searchHighlightTextView from "@c/searchHighlightTextView/searchHighlightTextView";

export default {
  data() {
    return {
      icon: require('@s/template/icon.png'),
      contractTemplates: [],
      timer: null,
      keyName: '',
      pageIndex: 1,
      pageSize: 10,
      total: 0
    };
  },

  components: {
    search,
    searchHighlightTextView
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTemplate();
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
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.pageIndex = 1
    this.pageSize = 10
    this.total = 0
    this.contractTemplates = []
    this.getTemplate();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.total <= this.contractTemplates.length) return;
    this.pageIndex = this.pageIndex + 1
    this.getTemplate();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    /**
     * @name 获取模版列表数据
     * @params {*} name 模版名称 - 模糊搜索
     */
    getTemplate() {
      var params = {
        searchType: 0,
        name: this.keyName || '',
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      get({
        url: get_templateList,
        params: params,
        success: res => {
          let templateMessage = res.results;
          templateMessage.filter(it => it.status == 1);
          templateMessage.map(it => {
            it.gmtModified = this.formatTimeConvert(it.gmtModified, 1);
          });
          this.contractTemplates = [...this.contractTemplates, ...templateMessage]
          this.total = res.total
        },
        fail: err => {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: err
            });
          }, 50);
        }
      });
    },

    /**
     * @name 时间格式化
     * @param {*} timestamp 
     * @param {*} num 
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
        return y + '年' + m + '月' + d + '日';
      } else {
        return y + '年' + m + '月' + d + '日' + ' ' + h + ':' + minute + ':' + second;
      }
    },

    /**
     * @name 选择模版
     */
    templateSelect(e) {
      const id = e.currentTarget.dataset.id;
      uni.navigateTo({
        url: '/pages/template/useTemplate/index?id=' + id
      });
    },

    /**
     * @name 搜索
     * @param {*} e 事件源 
     */
    inputSearchFun: function (e) {
      console.log(e);
      this.keyName = e.detail
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getTemplate(e.detail);
      }, 300)
    },

    /**
     * @name 取消搜索
     */
    cancleSearchFun() {
      this.keyName = ''
      this.getTemplate(this.keyName);
    }

  }
};
</script>
<style>
@import "./contractTemplate.css";
</style>
