<template>
  <view class="project-detail--page" v-if="projectDetail">
    <view class="project-info section">
      <view class="title">{{ projectDetail.name }}</view>
      <view class="time-status">
        <text
          :class="
            'status ' +
              (projectDetail.status == 1
                ? 'going'
                : projectDetail.status == 2
                ? 'complete'
                : '')
          "
          >{{
            projectDetail.status == 1
              ? '进行中'
              : projectDetail.status == 2
              ? '已完成'
              : ''
          }}</text
        >
        <text class="time"
          >创建时间：{{
            projectDetail.gmtCreate
              ? formatTimeConvert(projectDetail.gmtCreate, 1)
              : ''
          }}</text
        >
      </view>
      <view class="desc">
        <view
          class="words"
          v-if="
            projectDetail.description ||
              projectDetail.status == 2 ||
              !projectDetail.creator
          "
          @tap="_handleAddDesc"
          >{{ projectDetail.description || '' }}</view
        >
        <view class="empty" v-else @tap="_handleAddDesc"
          >点击添加项目描述 <text class="iconfont iconbi"></text
        ></view>
      </view>
    </view>
    <view class="project-members section" @tap="_handleViewMembers">
      <text class="text">项目成员</text>
      <text class="iconfont iconright-arrow"></text>
    </view>
    <scroll-view
      class="evidence-list section"
      scroll-y="true"
      scroll-anchoring="true"
      refresher-enabled="true"
      @scrolltolower="getMoreDataFun"
    >
      <view class="title">证据列表</view>
      <view v-if="evidences.length > 0">
        <view class="item" v-for="(item, index) in evidences" :key="index">
          <view class="content">
            <view class="title">{{
              item.evidenceType == 2 ? item.name : item.fileName
            }}</view>
            <view class="time">{{
              item.gmtCreate ? formatTimeConvert(item.gmtCreate, 1) : ''
            }}</view>
          </view>
          <view
            class="more"
            @tap="_handleOperateMore(item)"
            v-if="item.status !== 2"
          >
            <text class="iconfont iconmore"></text>
          </view>
        </view>
      </view>
      <view class="ev-empty" v-else>暂无关联证据</view>
    </scroll-view>
    <slider-picker
      ref="sliderPicker"
      :sliderList="sliders"
      @selectWay="_handleOperateItem"
    />
  </view>
</template>

<script>
import { get } from '@api/request.js'

import {
  get_project_detail,
  get_contact_evidence,
  remove_evidence_form_project,
} from '@api/evidence.js'

import sliderPicker from '@c/sliderPicker/sliderPicker'
export default {
  data() {
    return {
      isCreator: false,
      status: 1,
      projectId: '',
      projectDetail: null,
      evidences: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      activeId: '',
      sliders: [
        {
          label: '查看证据',
          value: 1,
        },
        {
          label: '从项目中移除',
          value: 1,
        },
      ],
    }
  },
  components: {
    sliderPicker,
  },
  onLoad(options) {
    this.projectId = options.id
  },
  onShow() {
    this._getProjectDetail()
    this._getContactEvidence()
  },
  onPullDownRefresh() {
    this._getProjectDetail()
    this._getContactEvidence()
  },
  methods: {
    /**
     * @name 获取项目详情
     */
    _getProjectDetail() {
      get({
        url: get_project_detail,
        params: {
          projectId: this.projectId,
        },
        success: (res) => {
          console.log(res)
          this.projectDetail = res
          this.isCreator = res.creator
          this.status = res.status
          this.sliders =
            res.creator && res.status !== 2
              ? [
                  {
                    label: '查看证据',
                    value: 1,
                  },
                  {
                    label: '从项目中移除',
                    value: 1,
                  },
                ]
              : [
                  {
                    label: '查看证据',
                    value: 1,
                  },
                ]
        },
        fail: (err) => {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: err,
            })
          })
        },
      })
    },
    /**
     * @name 获取项目关联证据
     * @param {type} type 类型 1: 初始加载 2:加载更多
     */
    _getContactEvidence(type = 1) {
      get({
        url: get_contact_evidence,
        params: {
          projectId: this.projectId,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
        success: (res) => {
          let arr = []
          if (type == 1) arr = res.data
          if (type == 2) arr = [...this.evidences, ...res.data]
          this.evidences = arr
          this.total = res.totalCount
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
     * @name 添加项目描述
     */
    _handleAddDesc() {
      console.log(this.isCreator, this.status)
      if (!this.isCreator || this.status == 2) return
      if (this.projectDetail && this.projectDetail.description)
        uni.setStorageSync('projectDesc', this.projectDetail.description)
      uni.navigateTo({
        url: '/pages/evidence/projectDetail/addDesc/index?id=' + this.projectId,
      })
    },
    /**
     * @name 查看成员
     */
    _handleViewMembers() {
      if (this.projectDetail && this.projectDetail.projectUsers)
        uni.setStorageSync('projectMembers', this.projectDetail.projectUsers)
      uni.navigateTo({
        url: '/pages/evidence/projectMembers/index',
      })
    },
    /**
     * @name 加载更多
     */
    getMoreDataFun() {
      if (this.evidences.length < this.total) {
        this.pageIndex = Number(this.pageIndex) + 1
        this._getContactEvidence(2)
      }
    },
    /**
     * @name 更多操作
     */
    _handleOperateMore(item) {
      this.$refs.sliderPicker.show()
      this.activeId = item.id
    },
    /**
     * @name 上拉菜单操作
     */
    _handleOperateItem(e) {
      switch (Number(e.detail)) {
        case 0:
          uni.navigateTo({
            url:
              '/pages/evidence/certificateDetail/certificateDetail?id=' +
              this.activeId,
          })
          break
        case 1:
          this._removeItem()
          break
        default:
          break
      }
      this.$refs.sliderPicker.hide()
    },
    /**
     * @name 从项目中移除证据
     */
    _removeItem() {
      get({
        url: remove_evidence_form_project,
        params: {
          projectId: this.projectId,
          evidenceId: this.activeId,
        },
        success: (res) => {
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: '移除成功',
            })
          }, 50)
          this.pageIndex = 1
          this._getContactEvidence()
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
  },
}
</script>

<style>
@import './index.css';
</style>
