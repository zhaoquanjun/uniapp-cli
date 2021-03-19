<template>
	<view class="contact-project--page">
		<view class="search-area">
			<search @inputChanged="inputSearchFun" @cancelClicked="cancleSearchFun" :timeSearch="true" :isShowCancel="true"></search>
		</view>
		<view class="list-area">
			<view class="selected-num">已选：{{ checkList.length }}</view>
			<scroll-view class="project-list--area" scroll-y="true" scroll-anchoring="true" refresher-enabled="true"
			 :refresher-triggered="isTriggered" @refresherrefresh="pullDownRefreshFun" @scrolltolower="getMoreDataFun">
				<checkbox-group @change="handleChangeSelectStatus">
					<view class="item" v-for="(item, index) in list" :key="index">
						<label class="flex-box">
							<view class="icon">
								<image :src="folderIcon" mode="aspectFit"></image>
							</view>
							<view class="content">
								<view class="title">{{ item.name }}</view>
								<view class="time">项目创建时间：{{ item.gmtCreate ? formatTimeConvert(item.gmtCreate, 1) : '' }}</view>
							</view>
							<checkbox class="radio" :value="item.id" color="#ed6c00" />
						</label>
					</view>
				</checkbox-group>
				<view class="end">已显示全部搜索结果</view>
			</scroll-view>
		</view>
		<view :class="'btn ' + (len > 0 ? 'active' : '')" :data-len="len" @tap="_contactProject">确认关联</view>
	</view>
</template>

<script>
	import {
		get,
		postBody
	} from '@api/request.js'

	import {
		get_evidence_can_contact_projects,
		evidence_contact_project
	} from '@api/evidence.js'

	import search from "@c/search/search";

	export default {
		data() {
			return {
				evidenceId: '',
				list: [],
				len: 0, // 解决动态class不能实时读取选中列表长度的问题
				checkList: [],
				isTriggered: false,
				folderIcon: require('@s/evidence/file-icon.png')
			}
		},
		components: {
			search
		},
		onLoad(options) {
			this.evidenceId = options.id
		},
		onShow() {
			this._getProjectLists()
		},
		methods: {
			/**
			 * @name 获取项目列表
			 */
			_getProjectLists(callback) {
				get({
					url: get_evidence_can_contact_projects,
					params: {
						evidenceId: this.evidenceId
					},
					success: res => {
						this.list = res
						typeof callback == 'function' && callback()
					},
					fail: err => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err
							})
						}, 50)
					}
				})
			},
			/**
			 * @name 选择数据
			 */
			handleChangeSelectStatus(e) {
				this.checkList = e.detail.value
				this.len = e.detail.value.length
			},
			/**
			 * @name 关联证据
			 */
			_contactProject() {
				if (this.checkList.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '请选择要关联的数据'
					})
					return false
				}
				postBody({
					url: evidence_contact_project,
					params: {
						certificateEvidenceId: this.evidenceId,
						projectIds: this.checkList
					},
					success: res => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: '关联成功'
							})
						}, 50)
						setTimeout(() => {
							uni.navigateBack(-1)
						}, 1500)
					},
					fail: err => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err
							})
						}, 50)
					}
				})
			},
			/**
			 * @name 清空搜索条件
			 */
			cancleSearchFun() {},
			/**
			 * @name 清空搜索条件
			 */
			inputSearchFun() {},
			/**
			 * @name 下拉刷新
			 */
			pullDownRefreshFun() {
				console.log('容器下拉了');
				this.isTriggered = true
				this._getProjectLists(() => {
					this.isTriggered = false
				})
			},
			/**
			 * @name 获取更多
			 */
			getMoreDataFun() {},

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
		}
	}
</script>

<style>
	@import './index.css'
</style>
