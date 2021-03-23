<template>
	<view>
		<view class="certificate-detail-box">

			<view style="display:flex; justify-content:space-between">
				<view class="certificate-title">存证名称</view>
				<view style="display:flex; justify-content:flex-end;">
					<view class="certificate-detail-preview" @tap="showSlideMenu">更多操作</view>
				</view>
			</view>
			<view class="certificate-detail-items">
				<view class="certificate-detail-item">
					<view class="certificate-detail-item-name">存证名称</view>
					<view class="certificate-detail-item-value">{{dataList.name || ''}}</view>
				</view>
				<view class="certificate-detail-item">
					<view class="certificate-detail-item-name">存证类型</view>
					<view class="certificate-detail-item-value">{{dataList.fileType ==1 ? "文本" : dataList.fileType==2 ? "图片" : dataList.fileType == 3 ? "语音" : dataList.fileType == 4 ?" 视频": "签署存证"}}</view>
				</view>
				<view class="certificate-detail-item">
					<view class="certificate-detail-item-name">存证渠道</view>
					<view class="certificate-detail-item-value">手机端</view>
				</view>
				<view class="certificate-detail-item">
					<view class="certificate-detail-item-name">存证方式</view>
					<view class="certificate-detail-item-value">{{dataList.uploadMethod ==1 ? "上传":"拍摄"}}</view>
				</view>
				<view class="certificate-detail-item">
					<view class="certificate-detail-item-name">存证时间</view>
					<view class="certificate-detail-item-value">{{formatTimeConvert(dataList.gmtCreate, 0)}}</view>
				</view>
				<view class="certificate-detail-item">
					<view class="certificate-detail-item-name">存证状态</view>
					<view class="certificate-detail-item-value">{{dataList.status ==0 ? "出证中...":dataList.status==1?"出证成功":"出证失败"}}</view>
				</view>
			</view>
			<view class="certificate-title">文件信息</view>
			<view class="certificate-detail-file">
				<view v-if="dataList.fileType === 1" class="certificate-detail-file-text">{{textContext}}</view>
				<image @tap.stop="checkImage" mode="aspectFit" v-if="dataList.fileType === 2" class="certificate-detail-file-content-picture"
				 :data-src="dataList.filePath" :src="dataList.filePath"></image>
				<view v-if="dataList.fileType === 3" class="add-certificate-voice">
					<audio :src="dataList.filePath" :name="dataList.name" author id="myAudio" @tap="handlePlayFun" @ended="playToEndFun"
					 controls></audio>
				</view>
				<video v-if="dataList.fileType === 4" id="videoBox" class="certificate-detail-file-content-video"
				 :src="dataList.filePath" @Error="videoError"></video>
				<view class="pdf-file" v-if="dataList.fileType === 5" @tap="previewCertificate">
					<image src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/file.png" class="file-image"></image>
					<text>{{dataList.fileName}}</text>
				</view>
			</view>
			<view style="display:flex; justify-content:space-between">
				<view class="certificate-title">证书信息</view>

			</view>
			<view class="certificate-detail-items">
				<view class="certificate-detail-item">
					<view class="certificate-detail-item-name">存证hash</view>
				</view>
				<view class="certificate-detail-item">
					<view class="certificate-detail-item-value">{{dataList.hash || ''}}</view>
				</view>
			</view>
			<view style="height:20rpx; width=100%; background:#F7F8F9"></view>
			<view class="certificate-detail-items">
				<view class="certificate-detail-item">
					<view class="certificate-detail-item-name">认证时间</view>
					<view class="certificate-detail-item-value">{{formatTimeConvert(dataList.gmtModified, 0)}}</view>
				</view>
				<view class="certificate-detail-item">
					<view class="certificate-detail-item-name">证书状态</view>
					<view class="certificate-detail-item-value">{{dataList.status ==0 ? "出证中...":dataList.status==1?"出证成功":"出证失败"}}</view>
				</view>
			</view>
			<!-- 关联合同 -->
			<view class="certificate-title" v-if="dataList.evidenceType == 1 && contractList.length > 0">关联合同</view>
			<view class="certificate-detail-items" v-if="dataList.evidenceType == 1">
				<view v-for="(item, index) in contractList" :key="index" class="certificate-detail-item">
					<view class="certificate-detail-item-name undeContranct" :data-contractid="item.id" @tap="goContractDetail">{{ item.contractTitle }}</view>
				</view>
			</view>
		</view>

		<!-- 证据链菜单 -->
		<halfSlideItem ref="evidence">
			<view class="slide-menu_list">
				<view class="slide-menu_item" @tap="previewCertificate">查看证书</view>
				<view class="slide-menu_item" @tap="goChainListPage" v-if="dataList.evidenceType == 1">查看证据链</view>
			</view>
		</halfSlideItem>
		<!-- <view class='empty-data placeholder-color' wx:if="{{dataList.length <= 0}}">暂无数据</view> -->
	</view>
</template>

<script module="tools" lang="wxs" src="@/utils/tools.wxs"></script>

<script>
	import {
		get
	} from '@api/request.js'
	import {
		evidence_detail,
		get_certificate_address,
		findContractSubject
	} from '@api/evidence.js'
	let utils = require("@u/utils.js");
	let app = getApp();
	let timer = null;
	let innerAudioContext = uni.createInnerAudioContext();
	let videoBox = null; // 存证类型icon的MAP
	// 存证类型icon的MAP
	let iconMap = {
		1: 'one-filetype-doc',
		2: 'one-filetype-image',
		3: 'one-filetype-music',
		4: 'one-filetype-video',
		5: 'one-contract'
	};
	import halfSlideItem from "../../../components/halfSlideItem/halfSlideItem";

	export default {
		data() {
			return {
				id: '', // 证据id
				contractId: "", // 合同id
				dataList: {},
				// 存证详情数据
				icon: 'one-filetype-image',
				// 存证类型icon
				duration: 0,
				//声音类型音频时长
				isPlay: false,
				// 声音是否播放
				videoPlayTime: 0,
				// 音频播放时间time
				showVideoPlayTime: '00:00:00',
				//音频播放显示时间
				textContext: '',
				// 文本内容
				pdfUrl: '',
				type: 'sign',
				audioContext: null,
				contractList: [],
				durationShow: ""
			};
		},

		components: {
			halfSlideItem
		},
		props: {},
		// 页面load加载数据
		onLoad: function(options) {
			this.id = options.id
			this.fetchRecords();
			this.getContractList();
		},

		onReady() {
			this.audioContext = uni.createAudioContext('myAudio')
		},

		methods: {
			handlePlayFun(e) {
				console.log(this.audioContext, this.audioContext._getAppStatus());
				this.audioContext.play();
				console.log(this.audioContext._getAppStatus());
			},

			playToEndFun(e) {
				this.audioContext.pause();
				this.audioContext.seek(0);
				this.audioContext.pause();
			},

			// 获取存证详情
			fetchRecords: function() {
				uni.showLoading({
					title: '加载中'
				});
				var url = evidence_detail + '?id=' + this.id;
				get({
					// get请求
					url: url,
					success: res => {
						let icon = iconMap[res.fileType];
						this.dataList = res || {}
						this.icon = icon
						this.contractId = res.filePath

						if (res.fileType === 5) {
							const url = get_certificate_address + "/" + this.dataList.id;
							uni.showLoading({
								title: '加载中'
							});
							get({
								url: url,
								success: res => {
									this.downloadPdfFun(res, 0);
								},
								fail: function(err) {
									setTimeout(() => {
										uni.showToast({
											icon: 'none',
											title: err
										})
									}, 50)
								},
								complete: () => {
									uni.hideLoading();
								}
							});
						}
					},
					fail: err => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err
							})
						}, 50)
					},
					complete:() => {
						uni.hideLoading();
					}
				});
			},

			checkImage: function(e) {
				wx.downloadFile({
					url: e.currentTarget.dataset.src,
					success: res => {
						console.log(res, 'dasdasdas')
						wx.previewImage({
							urls: [res.tempFilePath],
						})
					},
					fail: err => {
						console.log(err)
					}
				})
			},
			// 打开音频函数 试用innerAudioContext的api
			setVoice: function() {
				var url = this.dataList.filePath;
				innerAudioContext.src = url || '';
				setTimeout(() => {
					var _durationShow = this.showTime(innerAudioContext.duration); // 播放时间显示

					this.duration = innerAudioContext.duration
					this.durationShow =_durationShow
					innerAudioContext.onError(res => {
						console.log(res.errMsg);
					});
					innerAudioContext.onEnded(res => {
						innerAudioContext.stop();
						clearInterval(timer);
						this.isPlay = false
						this.videoPlayTime = 0
						this.showVideoPlayTime = '00:00:00'
					});
					innerAudioContext.onTimeUpdate(res => {
						if (innerAudioContext.duration && !this.duration) {
							_durationShow = this.showTime(innerAudioContext.duration);
							this.duration = innerAudioContext.duration
							this.durationShow = _durationShow
						}
					});
				}, 200);
			},
			// 音频显示函数
			showTime: function(time) {
				function formatShow(value) {
					return value < 10 ? '0' + value : value;
				}

				var sec = parseInt(time % 60);

				var _min = parseInt(time / 60);

				var min = parseInt(_min % 24);
				var hour = parseInt(_min / 24);
				hour = formatShow(hour);
				min = formatShow(min);
				sec = formatShow(sec);
				return hour + ':' + min + ':' + sec;
			},
			// 设置定时函数 显示播放时间
			setTime() {
				timer = setInterval(() => {
					let _time = this.videoPlayTime + 1;

					var _formatTime = this.showTime(_time);

					this.videoPlayTime = _time
					this.showVideoPlayTime = _formatTime
				}, 1000);
			},
			//播放声音函数
			playVoice() {
				if (this.isPlay) {
					innerAudioContext.pause();
					clearInterval(timer);
					innerAudioContext.onPause(() => {
						this.isPlay = false
					});
				} else {
					innerAudioContext.play();
					innerAudioContext.onPlay(() => {
						clearInterval(timer);
						this.isPlay = true

						this.setTime();
					});
				}
			},
			// 预览下载
			previewCertificate: function(e) {
				
				this.$refs.evidence.close()

				if (this.dataList.status !== 1) {
					setTimeout(() => {
						uni.showToast({
							title: '出证中，请稍后再试',
							icon: 'none'
						});
					}, 50);
					return;
				}

				var hash = this.dataList.hash;
				if (!hash) return;
				var url = get_certificate_address + "/" + this.dataList.id;
				uni.showLoading({
					title: '加载中'
				});

				get({
					url: url,
					success: res => {
						this.downloadPdfFun(res, 1);
					},
					fail: function(err) {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err
							})
						}, 50)
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},

			// 打开pdf文件
			downloadPdfFun(url, status) {
				console.log(url);
				uni.downloadFile({
					url: url,
					success: res => {
						uni.hideLoading();
						const filePath = res.tempFilePath;
						this.pdfUrl = filePath
						if (status) this.openPdfFun(filePath);
					},
					fail: function(res) {
						uni.hideLoading();
						console.log(res);
					},
					complete: function(res) {}
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
			 * @desc 获取关联合同
			 */
			getContractList() {
				const params = {
					certificateEvidenceId: this.id,
					pageIndex: 0,
					pageSize: 1000
				};
				get({
					url: findContractSubject,
					params: params,
					success: res => {
						this.contractList = res.data
					}
				});
			},

			/**
			 * @desc 跳转合同详情
			 */
			goContractDetail(e) {
				const contractId = e.currentTarget.dataset.contractid;
				uni.navigateTo({
					url: "/pages/contract/sign/next/contractDetail/contractDetail?contractId=" + contractId
				});
			},

			/**
			 * @desc 更多操作
			 */
			showSlideMenu() {
				this.$refs.evidence.open()
			},

			/**
			 * @desc 查看证据链
			 */
			goChainListPage() {
				this.$refs.evidence.close()
				uni.navigateTo({
					url: "/pages/contract/contractList/chains/chains?id=" + this.contractId
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

		}
	};
</script>
<style>
	@import "./certificateDetail.css";
</style>
