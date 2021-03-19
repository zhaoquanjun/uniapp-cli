<template>
	<view>
		<view class="evidence-manager--area">
			<view class="content">
				<view class="search-area">
					<search @inputChanged="changeSearchParamsFun" @cancelClicked="clearSearchParamsFun" :isShowCancel="true"
					 :timeSearch="true"></search>
				</view>
				<scroll-view class="scroll-area" scroll-y="true" scroll-anchoring="true" refresher-enabled="true"
				 :refresher-triggered="isTriggered" @refresherrefresh="pullDownRefreshFun" @scrolltolower="getMoreDataFun">
					<view class="sign-area list-area" v-if="activeName == 'sign' && signs.length > 0">
						<view v-for="(item, index) in signs" :key="index" class="list-item" @tap="viewDetailH5(item)">
								<view class="item-detail">
									<view class="title">{{item.name}}</view>
									<view class="type">存证类型：{{ item.evidenceType == 1 ? '签署存证' : item.evidenceType == 2 ? '数据存证' : item.evidenceType == 3 ? '电函回执存证' : item.evidenceType == 5 ? '电子律师函签署存证' : ''  }}</view>
									<view :class="'time ' + (item.status != 1 ? 'hidden' : '')">存证时间：{{item.gmtModified}}</view>
								</view>
								<view class="contract-operate" @tap.stop="showChainsMenu(item)">
									<view class="contract-operate_item"></view>
									<view class="contract-operate_item"></view>
									<view class="contract-operate_item"></view>
								</view>
								<view class="item-status">
									<view :class="'status-icon ' + (item.status == 1 ? 'success' : item.status == 99 ? 'fail' : '')"></view>
									<view>{{item.status == 0 ? '存证中...' : item.status == 1 ? '存证成功' : item.status == 99 ? '存证失败' : ''}}</view>
								</view>
							</view>
						</view>
						<view class="empty" v-else>
							<text>暂无数据</text>
						</view>
				</scroll-view>
			</view>
		</view>
		<mp-halfScreenDialog ref="mphalfScreenDialog"></mp-halfScreenDialog>

		<!-- 证据链菜单 -->
		<halfSlideItem ref="operate">
			<view class="slide-menu_list">
				<view :class="'slide-menu_item ' + ( activeItme && activeItme.status == 1 ? '' : 'noUseSlide' )" @tap="previewContractChain">查看存证证书</view>
				<view class="slide-menu_item" @tap="addChainFromList">关联合同</view>
				<view class="slide-menu_item" @tap="_handleContactProject">关联项目</view>
				<view class="slide-menu_item" @tap="handleStartDownloadFun" v-if="canDownload">下载源文件</view>
			</view>
		</halfSlideItem>
	</view>
</template>

<script>
	import {
		get
	} from '@api/request.js'
	import {
		certificate_record_list
	} from '@api/evidence.js'
	var util = require("@u/utils");
	const app = getApp();
	import search from "@c/search/search";
	import mpHalfScreenDialog from "@c/half-screen-dialog/half-screen-dialog";
	import halfSlideItem from "@c/halfSlideItem/halfSlideItem";

	export default {
		data() {
			return {
				tabs: [{
					name: '签署存证',
					type: 'sign'
				}, {
					name: '数据存证',
					type: 'data'
				}],
				signs: [],
				pageIndex: 1,
				total: 0,
				activeName: 'sign',
				searchParams: '',
				pageSize: 10,
				isTriggered: false,
				// 是否容器下拉刷新
				activeItme: null,
				canDownload: "",
				pdfUrl: ""
			};
		},

		components: {
			search,
			mpHalfScreenDialog,
			halfSlideItem
		},
		props: {},

		onLoad() {},

		onShow() {
			this.pageIndex = 1
			this.getPageDataFun(1);
		},

		onReady() {
			this.dialog = this.$refs.mphalfScreenDialog;
		},

		onHide() {
			this.dialog && this.dialog.close();
		},
		onPullDownRefresh() {
			// #ifdef  MP-ALIPAY
			console.log('容器触顶了');
			this.isTriggered = true
			this.pageIndex = 1
			this.getPageDataFun(1, () => {
				this.isTriggered = false
			});
			// #endif
		},

		onShareAppMessage() {},

		methods: {
			/**
			 * @name 前往关联项目
			 */
			_handleContactProject() {
				uni.navigateTo({
					url: '/pages/evidence/contactProject/index?id=' + this.activeItme.id
				})
				this.$refs.operate.close()
			},
			/**
			 * @name 滚动容器下啦刷新
			 */
			pullDownRefreshFun() {
				console.log('容器下拉了');
				this.isTriggered = true
				this.pageIndex = 1
				this.getPageDataFun(1, () => {
					this.isTriggered = false
				});
			},
			/**
			 * @name 获取数据
			 * @param {*} type 获取方式 1: 下拉 初始 2: 触底
			 * @param {*} callback 回调函数
			 */
			getPageDataFun(type, callback) {
				if (!app.globalData.isLoginIn()) return;
				const url = certificate_record_list + '?currentPage=' + this.pageIndex + '&pageSize=' + this.pageSize + (this.searchParams ?
					'&name=' + this.searchParams : '');
				uni.showLoading({
					title: '加载中...'
				});
				get({
					url: url,
					success: res => {
						uni.hideLoading({});
						if (typeof callback == 'function') setTimeout(() => {
							callback(res);
						});

						if (res.results && res.results.length > 0) {
							res.results.map(it => {
								return it.gmtModified = util.formatTime(it.gmtModified, 'Y-M-D h:m:s');
							});
						}

						const arr = type == 1 ? res.results : this.signs.concat(res.results);
						this.signs = arr
						this.total = res.total
					}
				});
			},

			/**
			 * @name 触底加载更多
			 */
			getMoreDataFun() {
				console.log('加载更多')
				if (this.signs.length < this.total) {
					this.pageIndex = parseInt(this.pageIndex) + 1
					this.getPageDataFun(2);
				}
			},

			/**
			 * @name 模糊搜索
			 * @param {*} msg 返回搜索字段
			 */
			changeSearchParamsFun(msg) {
				this.searchParams = msg.detail
				this.getPageDataFun(1);
			},

			/**
			 * @name 情况搜索条件
			 */
			clearSearchParamsFun() {
				this.searchParams = ''
				this.getPageDataFun(1);
			},
			/**
			 * @name 查看详情
			 */
			viewDetailH5(item) {
				uni.navigateTo({
					url: '/pages/evidence/certificateDetail/certificateDetail?id=' + item.id
				});
			},
			/**
			 * @desc 显示证据链弹窗
			 */
			showChainsMenu(item) {
				this.activeItme = item
				this.canDownload = (item.fileType == '1' || item.fileType == '4') && item.evidenceType == 2 ? true : false
				this.$refs.operate.open()
			},

			/**
			 * @desc 从证据列表添加
			 */
			addChainFromList() {
				this.$refs.operate.close()
				uni.navigateTo({
					url: "/pages/contract/contractList/addContractList/addContractList?id=" + this.activeItme.id
				});
			},

			previewContractChain() {
				if (this.activeItme.status !== 1) {
					return;
				}

				var hash = this.activeItme.hash;
				if (!hash) return;
				var url = this.activeItme.url;
				uni.showLoading({
					title: '加载中'
				}); // 下载成功 打开pdf

				this.downloadPdfFun(url, 1);
				this.$refs.operate.close()
			},

			// 打开pdf文件
			downloadPdfFun(url, status) {
				uni.downloadFile({
					url: url,
					success: res => {
						console.log(res)
						uni.hideLoading();
						const filePath = res.tempFilePath;
						this.pdfUrl = filePath
						if (status) this.openPdfFun(filePath);
					},
					fail: err => {
						uni.hideLoading();
						console.log(err, 55555);
					},
					complete: () => {}
				});
			},

			openPdfFun(filePath) {
				console.log(filePath);
				uni.openDocument({
					filePath: filePath,
					fileType: 'pdf',
					showMenu: true,
					success: res => {
						console.log(res, 'success');
					},
					fail: err => {
						console.log(err, 'fail');
					},
					complete: () => {
						console.log('complete');
					}
				});
			},

			/**
			 * @name 下载源文件
			 */
			handleStartDownloadFun() {
				this.$refs.operate.close()
				this.gettingAuth(this.activeItme.filePath);
			},

			/**
			 * @name 获取下载到相册权限
			 * @param {*} filePath 下载路径
			 */
			gettingAuth(filePath) {
				uni.getSetting({
					success: res => {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success: () => {
									this.download(filePath);
								},
								// 拒绝授权时，则进入手机设置页面，可进行授权设置
								fail: () => {
									uni.openSetting({
										success: () => {
											console.log("openSetting success");
										},
										fail: () => {
											console.log("openSetting fail");
										}
									});
								}
							});
						} else {
							// 已授权则直接进行保存图片
							this.download(filePath);
						}
					},
					fail: err => {
						console.log(err);
					},
					complete: () => {
						console.log('complete');
					}
				});
			},

			/**
			 * @name 执行下载操作
			 * @param {*} filePath 下载路径
			 */
			download(filePath) {
				uni.showLoading({
					title: '下载中'
				});
				const type = filePath.slice(filePath.lastIndexOf('.') + 1);
				uni.downloadFile({
					url: filePath,
					success: res => {
						console.log(22222);

						if (type.toLowerCase() == 'png' || type.toLowerCase() == 'jpeg' || type.toLowerCase() == 'jpg') {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								// 此为图片路径
								success: res => {
									console.log(res, 3333);
									uni.hideLoading();
									setTimeout(() => {
										uni.showToast({
											icon: 'none',
											title: '已成功保存到相册'
										});
									}, 50);
								},
								fail: err => {
									console.log(err, 44444);
									setTimeout(() => {
										uni.showToast({
											icon: 'none',
											title: '下载失败'
										});
									}, 50);
								}
							});
						}

						if (type.toLowerCase() == 'mp4' || type.toLowerCase() == 'mov' || type.toLowerCase() == 'avi' || type.toLowerCase() ==
							'rmvb' || type.toLowerCase() == 'flv') {
							uni.saveVideoToPhotosAlbum({
								filePath: res.tempFilePath,
								success: res => {
									console.log(res.errMsg, '下载成功了');
									uni.hideLoading();
									setTimeout(() => {
										uni.showToast({
											icon: 'none',
											title: '已成功保存到相册'
										});
									}, 50);
								},
								fail: err => {
									console.log(err, '失败了');
									setTimeout(() => {
										uni.showToast({
											icon: 'none',
											title: '下载失败'
										});
									}, 50);
								}
							});
						}
					}
				});
			}

		}
	};
</script>
<style>
	@import "./index.css";
</style>
