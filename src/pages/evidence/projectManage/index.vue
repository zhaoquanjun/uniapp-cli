<template>
	<view class="project-manage--page">
		<view class="search-header--area">
			<view class="inner-wrapper">
				<view class="select-area" @tap="_handleShowSelects">
					<text class="value">{{ activeItem.label }}</text>
					<text :class="'iconfont iconsanjiaodown ' + (selectsShow ? 'up' : '')"></text>
				</view>
				<view class="input-area" @tap="_handleShowInput">
					<text class="iconfont iconsousuo"></text>
				</view>
			</view>
			<view :class="'select-box ' + (selectsShow ? 'selectShow' : '')">
				<view :class="'item ' + (item.value == activeItem.value ? 'active' : '')" v-for="(item, index) in selects" :key="index"
				 @tap.stop="_handleSelectType(item)">
					<view class="inner">
						<text class="label">{{ item.label }}</text>
						<text class="iconfont iconduihao" v-show="item.value == activeItem.value"></text>
					</view>
				</view>
			</view>
			<view :class="'input-section ' + (inputShow ? 'inputShow' : '')">
				<view class="section-l">
					<input type="text" placeholder-style="color:#666" :value="searchValue" placeholder="请输入项目名称" :focus="inputShow" @input="_handleInput" />
					<text class="iconfont iconsousuo prefix"></text>
				</view>
				<text class="cancel" @tap="_handleHideInput">取消</text>
			</view>
		</view>
		<scroll-view :class="'project-list--area ' + (!inputShow ? 'bot' : '')" scroll-y="true" scroll-anchoring="true" refresher-enabled="true"
		 :refresher-triggered="isTriggered" @refresherrefresh="pullDownRefreshFun" @scrolltolower="getMoreDataFun">
			<view v-if="list.length > 0">
				<view class="project-item" v-for="(item, index) in list" :key="index" @tap="_handleViewDetail(item)">
					<view class="file-icon">
						<image :src="folderIcon" mode="aspectFit"></image>
					</view>
					<view class="content">
						<view class="title">{{ item.name }}</view>
						<view class="desc">
							<text :class="'status ' + (item.status == 1 ? 'going' : item.status == 2 ? 'complete' : '')">{{ item.status == 1 ? '进行中' : item.status == 2 ? '已完成' : '' }}</text>
							<text class="time">创建时间：{{ formatTimeConvert(item.gmtCreate, 1) }}</text>
						</view>
					</view>
					
					<view class="more" @tap.stop="_handleMoreOperate(item)" v-if="item.status !== 2 && item.creator">
						<text class="iconfont iconmore"></text>
					</view>
					
				</view>
			</view>
			<view v-else class="empty">暂无数据</view>
		</scroll-view>
		<view class="create-btn" @tap="_handleCreateProject" v-show="!inputShow">新建项目</view>
		<view class="create-project--dialog" v-show="dialogShow">
			<view :class="'content-wrapper ' + (dialogShow ? 'dialog-show' : '')">
				<view class="dialog-title">新建项目</view>
				<view class="dialog-content">
					<input type="text" :value="newTitle" maxlength="100" :focus="dialogShow" placeholder="请输入项目名称" placeholder-style="color:#666" @input="_handleInputNewTitle" />
				</view>
				<view class="dialog-footer">
					<view class="btn cancel" @tap.stop="_handleCancelDialog">退出</view>
					<view class="btn confirm" @tap.stop="_handleConfirmDialog">确定</view>
				</view>
			</view>
			<view class="dialog-mask" @tap.stop="_handleCancelDialog"></view>
		</view>
		
		<view class="header-mask" v-show="selectsShow" @tap="_handleHideSelects"></view>
		<slider-picker ref="sliderPicker" :sliderList="sliders" @selectWay="_handleOperateItem" />
	</view>
</template>

<script>
	import {
		get,
		postBody
	} from '@api/request.js'
	import {
		get_project_list,
		create_project,
		complete_project,
		delete_project
	} from '@api/evidence.js'
	
	import sliderPicker from "@c/sliderPicker/sliderPicker";
	export default {
		data() {
			return {
				sliders: [
					{
						label: '完成项目',
						value: 1
					},
					{
						label: '删除项目',
						value: 2
					}
				],
				selects: [{
						label: '全部',
						value: ''
					},
					{
						label: '进行中项目',
						value: 1
					},
					{
						label: '已完成项目',
						value: 2
					}
				],
				list: [],
				selectsShow: false,
				activeItem: { // 当前选中的展示项
					label: '全部',
					value: ''
				},
				inputShow: false, // 是否展开搜索
				searchValue: '', // 搜索字段
				status: '',
				pageIndex: 1,
				pageSize: 10,
				total: 0,
				newTitle: '', // 新建标题
				dialogShow: false, // 是否展示新建弹窗
				isTriggered: false, // 容器是否下拉刷新
				activeId: '', // 当前操作id
				folderIcon: require('@s/evidence/file-icon.png')
			}
		},
		components: {
			sliderPicker
		},
		onShow() {
			this._getProjectList()
		},
		methods: {
			/**
			 * @name 获取项目列表
			 * @param {type} type 加载类型 1：初始加载 2：加载更多
			 */
			_getProjectList(type = 1, callback) {
				if (type == 1) {
					this.pageIndex = 1
				}
				get({
					url: get_project_list,
					params: {
						status: this.status,
						name: this.searchValue,
						pageIndex: this.pageIndex,
						pageSize: this.pageSize
					},
					success: res => {
						let arr = []
						if (type == 1) {
							arr = res.data
						}
						if (type == 2) {
							const list = JSON.parse(JSON.stringify(this.list))
							arr = [...list, ...res.data]
						}
						this.list = arr
						this.total = res.totalCount
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
			_handleSelectType(item) {
				this.selectsShow = false
				this.activeItem = item
				this.status = item.value
				this._getProjectList(1)
			},
			/**
			 * @name 打开下拉框
			 */
			_handleShowSelects() {
				this.selectsShow = !this.selectsShow
			},
			/**
			 * @name 隐藏下拉框
			 */
			_handleHideSelects() {
				this.selectsShow = false
			},
			/**
			 * @name 展示搜索框
			 */
			_handleShowInput() {
				this.inputShow = true
				this.selectsShow = false
			},
			/**
			 * @name 隐藏搜索框
			 */
			_handleHideInput() {
				this.inputShow = false
				this.searchValue = ''
				this._getProjectList()
			},
			/**
			 * @name 输入搜索条件
			 */
			_handleInput(e) {
				this.searchValue = e.detail.value
				this._getProjectList()
			},
			/**
			 * @name 新建项目
			 */
			_handleCreateProject() {
				this.dialogShow = true
			},
			/**
			 * @name 关闭弹窗
			 */
			_handleCancelDialog() {
				this.dialogShow = false
				this.newTitle = ''
			},
			/**
			 * @name 确认新建
			 */
			_handleConfirmDialog() {
				if (!this.newTitle) {
					uni.showToast({
						icon: 'none',
						title: '请填写项目名称'
					})
					return false
				}
				postBody({
					url: create_project,
					params: {
						name: this.newTitle
					},
					success: res => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: '新建成功'
							})
						}, 50)
						this._getProjectList()
					},
					fail: err => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err
							})
						}, 50)
					},
					complete: () => {
						this.dialogShow = false
						this.newTitle = ''
					}
				})
			},
			/**
			 * @name 填写新建title
			 * @param {Object} e 事件源
			 */
			_handleInputNewTitle(e) {
				this.newTitle = e.detail.value
			},
			/**
			 * @name 滚动容器下啦刷新
			 */
			pullDownRefreshFun() {
				console.log('容器下拉了');
				this.isTriggered = true
				this._getProjectList(1, () => {
					this.isTriggered = false
				});
			},
			/**
			 * @name 触底加载更多
			 */
			getMoreDataFun() {
				if (this.total > this.list.length) {
					this.pageIndex = Number(this.pageIndex) + 1
					this._getProjectList(2)
				}
			},
			/**
			 * @name 更多操作
			 */
			_handleMoreOperate(item) {
				if (item.status == 2) return // 如果已完成 不需要任何操作
				this.activeId = item.id
				this.$refs.sliderPicker.show()
			},
			/**
			 * @name 上拉菜单操作
			 */
			_handleOperateItem(e) {
				switch(Number(e.detail)) {
					case 0:
						uni.showModal({
							title: '提示',
							content: '确认完成项目吗',
							success: res => {
								if (res.confirm) {
									get({
										url: complete_project,
										params: {
											projectId: this.activeId
										},
										success: res => {
											setTimeout(() => {
												uni.showToast({
													icon: 'none',
													title: '成功完成项目'
												})
											}, 50)
											this._getProjectList()
										},
										fail: err => {
											setTimeout(() => {
												uni.showToast({
													icon: 'none',
													title: err
												})
											}, 50)
										},
										complete: () => {
											this.$refs.sliderPicker.hide()
										}
									})
								} else {
									console.log('取消操作')
									this.$refs.sliderPicker.hide()
								}
							}
						})
						break
					case 1:
						uni.showModal({
							title: '提示',
							content: '确认删除项目吗',
							success: res => {
								if (res.confirm) {
									get({
										url: delete_project,
										params: {
											projectId: this.activeId
										},
										success: res => {
											setTimeout(() => {
												uni.showToast({
													icon: 'none',
													title: '成功删除项目'
												})
											}, 50)
											this._getProjectList()
										},
										fail: err => {
											setTimeout(() => {
												uni.showToast({
													icon: 'none',
													title: err
												})
											}, 50)
										},
										complete: () => {
											this.$refs.sliderPicker.hide()
										}
									})
								} else {
									console.log('取消操作')
									this.$refs.sliderPicker.hide()
								}
							}
						})
						break
					default:
						break
				}
				this.$refs.sliderPicker.hide()
			},
			/**
			 * @name 查看详情
			 */
			_handleViewDetail(item) {
				uni.navigateTo({
					url: '/pages/evidence/projectDetail/index?id=' + item.id
				})
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
		},
	}
</script>

<style>
	@import './index.css';
</style>
