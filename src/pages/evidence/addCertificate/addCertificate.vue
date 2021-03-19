<template>
	<view>
		<!-- 添加存证页面 start -->
		<view class="add-certificate-box" v-if="!isVoiceRecord">
			<form @submit="addCertificateSubmit">
				<view class="certificate-content-item">
					<!-- 上传图片 start -->
					<view class="certificate-content-item--image" v-if="type==='image'">
						<view class="h1">上传图片</view>
						<view class="add-certificate-image">
							<view class="add-certificate-image--item">
								<image class="image-add" mode="aspectFit" :src="addCertificateImageUrl || 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/add.png'"
								 @tap.stop="tapAddImage"></image>
								<view v-if="addCertificateImageUrl" class="iconfont iconbaseline-close-px" @tap.stop="tapDeleteImage"></view>
							</view>
						</view>
					</view>
					<!-- 上传图片 end -->

					<!-- 上传音频 start -->
					<view class="certificate-content-item--voice" v-if="type==='voice'">
						<view class="h1">{{addCertificateVoice ?'语音文件' : '上传语音'}} </view>
						<view @tap.stop="openVoiceRecord" v-if="!addCertificateVoice" class="input-name">录制语音
							<view class="icon-right one-arrow-right"></view>
						</view>
						<view v-if="addCertificateVoice" class="add-certificate-voice">
							<view class="add-certificate-voice-progress">
								<text :class="'add-certificate-voice-progress--btn iconfont ' + (isPlay ? 'iconicon_bofang' : 'iconbofang' )"
								 @tap.stop="playVoice"></text>
								<text class="add-certificate-voice-progress--start">{{showVideoPlayTime}}</text>
								<view class="add-certificate-voice-progress--loading">
									<view class="add-certificate-voice-progress--width" :style="'width:' + ((videoPlayTime * 100000 / duration) + '%')"></view>
								</view>
								<text class="add-certificate-voice-progress--end">{{showDurationTime}}</text>
							</view>
							<!--  #ifndef  MP-ALIPAY -->
							<view class="size">音频大小：{{addFileInfo.size}}<text v-if="addFileInfo.size">M</text></view>
							<!--  #endif -->
							<view class="add-certificate-voice-delete one-close" @tap.stop="tapDeleteVoice"></view>
						</view>
					</view>
					<!-- 上传音频 end -->

					<!-- 上传文件 start -->
					<view class="certificate-content-item--file" v-if="type==='file'">
						<view class="h1" style="margin-top:32rpx">选择文件</view>
						<view class="file-size" v-if="addFileInfo.size">文件大小：{{addFileInfo.size}}<text>M</text></view>
						<view class="upload-btn" @tap="handleChooseFileFun">选择上传文件</view>
					</view>
					<!-- 上传文件 start -->

				</view>
				<!-- 命名文件 start -->
				<view class="certificate-content-item">
					<view class="h1">命名文件</view>
					<input class="input-name" :value="nameValue" @input="nameInput" name="name" maxLength="20" placeholder="最多20个字符，命名不能出现字符有：/：*？#”<>|。"></input>
				</view>
				<!-- 命名文件 end -->
				<!-- 存证类型 start -->
				<view class="certificate-content-item">
					<view class="h1">存证类型</view>
					<view class="sign-certificate-type">
						<radio-group name="type">
							<label>
								<radio value="2" checked></radio>
								<text class="label-text">司法存证</text>
								<view class="label-detail">安全可信存证、国家授权时间、数据直连司法、司法效力</view>
							</label>
						</radio-group>
					</view>
				</view>
				<!-- 存证类型 end -->
				<!-- 说明 start -->
				<view class="certificate-content-item">
					<view class="add-certificate-description">
						<view class="title"> 说明</view>
						<view> 1. 一次仅支持上传一个文件；</view>
						<view> 2. 所选文件将按照国密SM3算法计算Hash；</view>
						<view> 3. 链上不存储原文件，仅存储Hash。</view>
						<view v-if="type==='file'"> 4. 建议上传文件大小不超过1G。</view>
						<view v-if="type==='voice'"> 4. 建议上传音频时长不超过两个小时，录制时长最长支持十分钟。</view>
					</view>
				</view>
				<!-- 说明 end -->
				<!-- 提交按钮 -->
				<button class="certificate-submit" form-type="submit">{{ formId ? '保存' : '立即出证' }}</button>
			</form>
		</view>
		<!-- 添加存证页面 end -->

		<!-- 声音录制页面 start -->
		<view class="voice-record-box" v-if="type==='voice' && isVoiceRecord">
			<view class="voice-record-content">
				<view class="voice-record-time">{{showTime||'00:00:00'}}</view>
				<view class="voice-record-time-text">{{time ? '正在录音… 点击按钮暂停录音自动保存':'点击按钮开始录音'}}</view>
				<view :class="' ' + (recording? 'voice-record-btn voice-record-btn-loading':'voice-record-btn')">
					<view class="voice-record-btn-center" @tap.stop="longPressBtn"></view>
				</view>
			</view>
		</view>
		<!-- 声音录制页面 end -->
	</view>
</template>

<script module="tools" lang="wxs" src="@/utils/tools.wxs"></script>

<script>
	import {
		get,
		post,
		upload
	} from '@api/request.js'
	import {
		get_upload_policy,
		add_certificate_file,
		saveChainToContract
	} from '@api/evidence.js'
	let utils = require("@u/utils.js");
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	let timer = null;
	const titleMap = {
		text: {
			title: '文字存证',
			value: 1
		},
		image: {
			title: '图片存证',
			value: 2
		},
		voice: {
			title: '语音存证',
			value: 3
		},
		video: {
			title: '视频存证',
			value: 4
		},
		file: {
			title: '文件存证',
			value: 5
		}
	}; // 类型map
	// 类型map
	const typeMap = {
		image: 'addCertificateImageUrl',
		video: 'addCertificateVideo',
		voice: 'addCertificateVoice',
		file: 'addCertificateFile'
	};

	export default {
		data() {
			return {
				ishighLight: false,
				//
				type: '',
				//页面存证
				fileType: '',
				// 文件类型
				nameValue: '',
				// 存证名称
				typeValue: 2,
				//存证类型
				addCertificateImageUrl: '',
				// 图片存证url
				addCertificateText: '',
				// 文字存证文本
				addCertificateVoice: '',
				// 语音存证url
				addCertificateVideo: '',
				//视频存证url
				addCertificateFile: '',
				//新增文件url
				isVoiceRecord: false,
				// 是否是录制音频页面
				time: 0,
				// 录音时长
				showTime: 0,
				//录制音频的显示时间
				recording: false,
				// 音频是否正在录制
				duration: 0,
				// 音频录制时长
				isPlay: false,
				// 音频是否在播放
				videoPlayTime: 0,
				// 音频播放时间 number
				showVideoPlayTime: '00:00:00',
				// 音频播放显示时间
				showDurationTime: '00:00:00',
				// 音频总时长显示
				isLoading: false,
				// loading
				uploadMethod: 2,
				//上传方式
				addFileInfo: null,
				formId: null // 添加数据链的id,如果存证，则是添加数据链

			};
		},

		components: {},
		props: {},
		//页面加载函数
		onLoad: function(options) {
			let type = options.type;
			this.type = type
			this.fileType = titleMap[type].value
			this.formId = options.fromId
			uni.setNavigationBarTitle({
				title: titleMap[type].title
			});
		},

		onReady() {},

		methods: {
			// 名称输入函数
			nameInput: function(event) {
				let value = event.detail.value;
				this.nameValue = value
				this.getHighLight();
			},
			//添加图片
			tapAddImage() {
				uni.showActionSheet({
					itemList: ['拍照', '从相册选择'],
					success: res => {
						this.chooseImage(res.tapIndex == 0 ? 'camera' : 'album');
						this.uploadMethod = res.tapIndex == 0 ? 2 : 1
					}
				});
			},

			/**
			 * 选择图片
			 * sourceType camera album
			 */
			chooseImage: function(sourceType) {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: 'compressed',
					maxDuration: 10,
					sourceType: [sourceType],
					success: res => {
						const nameArr = res.tempFilePaths[0].slice(res.tempFilePaths[0].lastIndexOf('/') + 1).split('.');
						const nameStr = this.random_string() + '.' + nameArr[nameArr.length - 1];

						console.log(nameArr);
						let o = {
							path: res.tempFilePaths[0],
							name: nameStr,
							originName: res.tempFilePaths[0].slice(res.tempFilePaths[0].lastIndexOf('/') + 1)
						};

						// #ifdef MP-WEIXIN
						o.size = (res.tempFiles[0].size / 1024 / 1000).toFixed(2)
						// #endif

						this.addFileInfo = o
						let tempFilePaths = res.tempFilePaths;
						this.addCertificateImageUrl = tempFilePaths[0]
						this.getHighLight();
					}
				});
			},
			//删除图片
			tapDeleteImage() {
				this.addCertificateImageUrl = ''
				this.getHighLight();
			},

			// 校验文件是否支持上传
			checkAllowUploadFun(fileName) {
				const allowFileTypes = ['.doc', '.docx', '.pdf', '.bpm'];
				let flag = false;
				allowFileTypes.map(it => {
					if (fileName.indexOf(it) > -1) {
						flag = true;
					}
				});
				return flag;
			},

			// 选择文件
			handleChooseFileFun() {
				uni.chooseMessageFile({
					count: 1,
					type: 'file',
					success: res => {
						console.log(res);
						const nameArr = res.tempFiles[0].path.slice(res.tempFiles[0].path.lastIndexOf('/') + 1).split('.');
						const nameStr = this.random_string() + '.' + nameArr[nameArr.length - 1];
						let o = {
							size: (res.tempFiles[0].size / 1024 / 1000).toFixed(2),
							path: res.tempFiles[0].path,
							name: nameStr,
							originName: res.tempFiles[0].path.slice(res.tempFiles[0].path.lastIndexOf('/') + 1)
						};
						this.addFileInfo = o

						if (this.checkAllowUploadFun(res.tempFiles[0].name)) {
							this.addCertificateFile = res.tempFiles[0].path
							this.getHighLight();
						} else {
							setTimeout(() => {
								uni.showToast({
									title: '文件格式必须为pdf、doc、docx或者bpm',
									icon: "none",
									duration: 2000,
									mask: true
								});
							}, 50);
						}
					},

					fail(err) {
						setTimeout(() => {
							uni.showToast({
								title: err
							});
						}, 50);
					}

				});
			},

			//打开声音录制页面
			openVoiceRecord: function() {
				this.isVoiceRecord = true
			},

			// 点击录音 、点击录音保存
			longPressBtn() {
				clearInterval(timer);

				if (this.recording) {
					this.recording = false
					this.stop();
				} else {
					this.recording = true
					this.start();
				}
			},

			/**
			 * @name 开始录音
			 */
			start() {
				var that = this;
				const options = {
					duration: 60000,
					sampleRate: 16000,
					//采样率
					numberOfChannels: 1,
					//录音通道数
					encodeBitRate: 96000,
					//编码码率
					format: 'mp3',
					//音频格式，有效值 aac/mp3
					frameSize: 50 //指定帧大小，单位 KB

				}; //开始录音

				that.openInterval();
				recorderManager.start(options);
				recorderManager.onStart(function() {
					console.log('recorder start');
				}); //错误回调

				recorderManager.onError(res => {
					console.log(res);
				});
			},
			/**
			 * @name 停止录音
			 */
			stop() {
				var that = this;
				clearInterval(timer);
				recorderManager.stop();
				recorderManager.onStop(res => {
					that.tempFilePath = res.tempFilePath;
					console.log('停止录音', res);
					const {
						tempFilePath,
						duration,
						fileSize
					} = res;
					const nameArr = res.tempFilePath.slice(res.tempFilePath.lastIndexOf('/') + 1).split('.');
					const nameStr = this.random_string() + '.' + nameArr[nameArr.length - 1];
					let o = {
						size: (res.fileSize / 1024 / 1000).toFixed(2),
						path: res.tempFilePath,
						name: nameStr,
						originName: res.tempFilePath.slice(res.tempFilePath.lastIndexOf('/') + 1)
					};
					this.addCertificateVoice = tempFilePath
					this.isVoiceRecord = false
					this.addFileInfo = o

					// #ifdef  MP-ALIPAY
					this.duration = duration * 1000
					this.showDurationTime = this.showTimeFun(duration)
					// #endif

					// #ifndef  MP-ALIPAY
					this.duration = duration
					this.showDurationTime = this.showTimeFun(duration / 1000)
					// #endif
					innerAudioContext.src = tempFilePath;
					innerAudioContext.onError(res => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});
					innerAudioContext.onEnded(res => {
						innerAudioContext.stop();
						that.isPlay = false
						that.videoPlayTime = 0
						that.showVideoPlayTime = '00:00:00'
						clearInterval(timer);
					});
					innerAudioContext.onTimeUpdate(() => { // console.log(innerAudioContext)
					});
				});
			},
			/**
			 * @name 设置循环显示播放时长
			 */
			openInterval: function() {
				var that = this;
				timer = setInterval(function() {
					let _time = that.time + 1;

					var sec = parseInt(_time % 60);

					var _min = parseInt(_time / 60);

					var min = parseInt(_min % 24);
					var hour = parseInt(_min / 24);
					hour = formatShow(hour);
					min = formatShow(min);
					sec = formatShow(sec);
					this.time = _time
					this.showTime = hour + ':' + min + ':' + sec
				}, 1000);

				function formatShow(value) {
					return value < 10 ? '0' + value : value;
				}
			},
			/**
			 * @name 格式化时间 00:00:00
			 * @param {Object} time 事件
			 */
			showTimeFun: function(time) {
				console.log(time, 'shijianchangdu')

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
			/**
			 * @name 设置音频显示时间
			 */
			setTime() {
				timer = setInterval(() => {
					let _time = that.videoPlayTime + 1;

					var sec = parseInt(_time % 60);

					var _min = parseInt(_time / 60);

					var min = parseInt(_min % 24);
					var hour = parseInt(_min / 24);
					hour = formatShow(hour);
					min = formatShow(min);
					sec = formatShow(sec);
					this.videoPlayTime = _time
					this.showVideoPlayTime = hour + ':' + min + ':' + sec
				}, 1000);

				function formatShow(value) {
					return value < 10 ? '0' + value : value;
				}
			},
			/**
			 * @name 播放声音
			 */
			playVoice() {

				if (this.isPlay) {
					innerAudioContext.pause();
					innerAudioContext.onPause(() => {
						console.log('暂停播放');
						clearInterval(timer);
						this.isPlay = false
					});
				} else {
					innerAudioContext.play(); // this.setTime()

					innerAudioContext.onPlay(() => {
						console.log('开始播放');
						clearInterval(timer);
						this.isPlay = true
						this.setTime();
					});
				}
			},
			/**
			 * @name 获取随机串
			 * @param {Object} len 长度
			 */
			random_string(len) {
				len = len || 32;
				var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
				var maxPos = chars.length;
				var pwd = '';

				for (let i = 0; i < len; i++) {
					pwd += chars.charAt(Math.floor(Math.random() * maxPos));
				}

				return pwd;
			},
			/**
			 * @name 删除录制声音
			 */
			tapDeleteVoice() {
				innerAudioContext.stop();
				innerAudioContext.destroy();
				this.addCertificateVoice = ''
				this.time = this.showTime = this.duration = this.videoPlayTime = 0
				this.recording = false
				this.isPlay = false
				this.showVideoPlayTime = this.showDurationTime = '00:00:00'
				this.getHighLight();
			},
			/**
			 * @name 提交存证
			 * @param {Object} event 按钮事件源
			 */
			addCertificateSubmit(event) {
				let that = this;
				if (that.isLoading) return;
				let values = event.detail.value; //验证

				let typeMapName = typeMap[this.type];

				if (!utils.trim(values.name) || !values.type || !utils.trim(this[typeMapName])) {
					utils.showError('请完善信息后再上传');
					return;
				}

				var reg = /[/：\*\？#”<>|。]/;

				if (reg.test(values.name)) {
					utils.showError('含有特殊字符，请输入正确文件名称后再上传');
					return;
				}

				let filePath = this[typeMapName] || '';
				

				get({
					url: get_upload_policy + '?ossPrefixKey=' + "blockchain/",
					success: res => {
						uni.showLoading({
							title: '上传中'
						});
						console.log(res, '------------------====')
						// #ifdef MP-WEIXIN  
						upload({
							url: res.host,
							filePath: filePath,
							key: 'file', //filename
							name: 'file',
							formData: {
								'key': res.dir + this.addFileInfo.name,
								'policy': res.policy,
								'OSSAccessKeyId': res.accessid,
								'signature': res.signature,
								'success_action_status': '200'
							},
							success: () => {
								// success
								let certificateType = values.type;
								let certificateName = values.name;
								let formDataParmas = {
									'filePath': res.ossUrl + res.dir + this.addFileInfo.name,
									'fileName': this.addFileInfo.originName,
									'name': certificateName,
									'type': certificateType,
									'fileType': this.fileType,
									'uploadMethod': this.uploadMethod,
									'uploadChannel': 2
								};
								console.log(formDataParmas);

								if (that.formId) {
									that.saveChain(formDataParmas);
								} else {
									upload({
										url: add_certificate_file,
										filePath: filePath,
										key: 'file',
										formData: formDataParmas,
										success: () => {
											// success
											uni.hideLoading();
											uni.showModal({
												title: '提交成功',
												content: '',
												showCancel: false,
												success: data => {
													if (data.confirm) {
														// 此处对普通存证和数据链存证进行区分
														this.switchTabBarFun();
													}
												}
											});
										},
										fail: err => {
											uni.hideLoading();
											uni.showModal({
												title: '提交失败',
												content: '',
												cancelText: '关闭',
												confirmText: '继续提交',
												success: res => {
													if (res.confirm) {
														that.addCertificateSubmit();
													} else if (res.cancel) {
														this.switchTabBarFun();
													}
												}
											});
										}
									});
								}
							},
							fail: err => {
								console.log(err);
							}
						})
						// #endif

						// #ifdef MP-ALIPAY
						uni.uploadFile({
							url: res.host,
							fileType: 'image',
							fileName: 'file',
							filePath: filePath,
							formData: {
								key: res.dir + this.addFileInfo.name,
								policy: res.policy,
								OSSAccessKeyId: res.accessid,
								signature: res.signature,
								success_action_status: 200
							},
							headers: {
								"token": uni.getStorageSync('userToken'),
								"Content-Type": "multipart/form-data",
								"wx_app_type": 1
							},
							success: () => {
								// success
								let certificateType = values.type;
								let certificateName = values.name;
								let formDataParmas = {
									'filePath': res.ossUrl + res.dir + this.addFileInfo.name,
									'fileName': this.addFileInfo.originName,
									'name': certificateName,
									'type': certificateType,
									'fileType': this.fileType,
									'uploadMethod': this.uploadMethod,
									'uploadChannel': 2
								};
								console.log(formDataParmas);

								if (that.formId) {
									that.saveChain(formDataParmas);
								} else {
									uni.uploadFile({
										url: add_certificate_file,
										fileType: 'image',
										fileName: 'file',
										filePath: filePath,
										formData: formDataParmas,
										headers: {
											"token": uni.getStorageSync('userToken'),
											"Content-Type": "multipart/form-data",
											"wx_app_type": 1
										},
										success: res => {
											uni.hideLoading();
											uni.showModal({
												title: '提交成功',
												content: '',
												showCancel: false,
												success: data => {
													if (data.confirm) {
														// 此处对普通存证和数据链存证进行区分
														this.switchTabBarFun();
													}
												},
												fail: err => {
													uni.hideLoading();
													uni.showModal({
														title: '提交失败',
														content: '',
														cancelText: '关闭',
														confirmText: '继续提交',
														success: res => {
															if (res.confirm) {
																that.addCertificateSubmit();
															} else if (res.cancel) {
																this.switchTabBarFun();
															}
														}
													});
												}
											});
										}
									})
								}
							},
							fail: err => {
								console.log(err);
							}
						});
						// #endif

						// #ifdef H5
						
						upload({
							url: res.host,
							filePath: filePath,
							name: 'file',
							formData: {
								'key': res.dir + this.addFileInfo.name,
								'policy': res.policy,
								'OSSAccessKeyId': res.accessid,
								'signature': res.signature,
								'success_action_status': '200'
							},
							success: () => {
								// success
								let certificateType = values.type;
								let certificateName = values.name;
								let formDataParmas = {
									'filePath': res.ossUrl + res.dir + this.addFileInfo.name,
									'fileName': this.addFileInfo.originName,
									'name': certificateName,
									'type': certificateType,
									'fileType': this.fileType,
									'uploadMethod': this.uploadMethod,
									'uploadChannel': 2
								};
								console.log(formDataParmas);

								if (that.formId) {
									that.saveChain(formDataParmas);
								} else {
									upload({
										url: add_certificate_file,
										//url
										filePath: filePath,
										// filePath
										key: 'file',
										//filename
										formData: formDataParmas,
										// formDate
										success: () => {
											// success
											uni.hideLoading();
											uni.showModal({
												title: '提交成功',
												content: '',
												showCancel: false,
												success: data => {
													if (data.confirm) {
														// 此处对普通存证和数据链存证进行区分
														this.switchTabBarFun();
													}
												}
											});
										},
										fail: err => {
											uni.hideLoading();
											uni.showModal({
												title: '提交失败',
												content: '',
												cancelText: '关闭',
												confirmText: '继续提交',
												success: res => {
													if (res.confirm) {
														that.addCertificateSubmit();
													} else if (res.cancel) {
														this.switchTabBarFun();
													}
												}
											});
										}
									});
								}
							},
							fail: err => {
								console.log(err);
							}
						})
						// #endif

					},
					fail: err => {
						console.log(err);
						setTimeout(() => {
							uni.showToast({
								title: err
							});
						}, 50);
					}
				});
			},
			/**
			 * @name 返回存证列表页
			 */
			switchTabBarFun() {
				uni.redirectTo({
					url: '/pages/evidence/evidenceList/index'
				});
			},
			/**
			 * @name 提交存证是否高亮函数
			 */
			getHighLight: function() {
				let typeMapName = typeMap[this.type];
				let value = this[typeMapName];
				this.ishighLight = (value && this.nameValue) ? true : false
			},

			/**
			 * @desc 数据链存证保存
			 */
			saveChain(params) {
				post({
					url: saveChainToContract + '?contractSubjectId=' + this.formId + '&fileName=' + params.name + '&filePath=' +
						params.filePath + '&uploadMethod=' + params.uploadMethod + '&type=2&uploadChannel=2',
					success: res => {
						uni.navigateBack({});
					},

					fail(err) {
						setTimeout(() => {
							uni.showToast({
								title: err
							});
						}, 50);
					}

				});
			}

		}
	};
</script>
<style>
	@import "./addCertificate.css";
</style>
