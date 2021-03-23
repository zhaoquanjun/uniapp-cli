<template>
	<view>
		<!--pages/pm/stamp/add/addStamp.wxml-->
		<canvas canvas-id="stampCanvas" id="stampCanvas" class="stamp-canvas" disable-scroll="false" @touchstart="touchStart"
		 @touchmove="touchMove">
			<!-- <image class="watermark" src="/static/pages/pm/stamp/add/watermark.png"></image> -->
		</canvas>
		<canvas class="stamp-canvas copy-canvas" canvas-id="myCanvas" ref="exportCanvas" id="myCanvas" style="z-index: -11; opacity: 0; visiblity: hidden;"></canvas>
		<view class="operation-btn-view">
			<view :class="'pen-btn ' + (color==='#000'?'active':'')" data-color="#000" @tap.stop="switchColor">
				<view class="pen" style="background-color:#000"></view>
			</view>
			<view :class="'pen-btn ' + (color==='#22ACF8'?'active':'')" data-color="#22ACF8" @tap.stop="switchColor">
				<view class="pen" style="background-color:#22ACF8"></view>
			</view>
			<view :class="'pen-btn ' + (color==='#FE4E51'?'active':'')" data-color="#FE4E51" @tap.stop="switchColor">
				<view class="pen" style="background-color:#FE4E51"></view>
			</view>
			<view class="line"></view>
			<image :src="pen1" :class="'pen-btn pen-size ' + (pen=='4'?'active-pen':'')" @tap.stop="switchPen"
			 data-pen="4"></image>
			<image :src="pen2" :class="'pen-btn pen-size ' + (pen=='6'?'active-pen':'')" @tap.stop="switchPen"
			 data-pen="6"></image>
			<image :src="pen3" :class="'pen-btn pen-size ' + (pen=='8'?'active-pen':'')" @tap.stop="switchPen"
			 data-pen="8"></image>
			<view class="clean-btn" @tap.stop="clearAction">
				<text class="clean-text">清除</text>
			</view>
			<view class="submit-btn" @tap.stop="submitAction">
				<text class="submit-text">提交</text>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		formData,
		postBody,
		upload
	} from '@api/request.js'
	import {
		upload_painted_wx_url,
		save_personnal_seal
	} from '@api/seal.js'

	import { mapState } from 'vuex'

	export default {
		data() {
			return {
				stampUrl: '',
				color: '#000',
				pen: '4',
				penSizeShow: false,
				pen1: require('@s/stamp/pen.png'),
				pen2: require('@s/stamp/pen1.png'),
				pen3: require('@s/stamp/pen2.png'),
			};
		},
		onShow: function() {
			setTimeout(() => {
				uni.showToast({
					icon: 'none',
					title: '请将手机横屏'
				});
			}, 50);
		},
		computed: {
			...mapState({
				userToken: state => state.userToken
			})
		},
		methods: {
			canvasIdErrorCallback: function(e) {
				console.error('canvas error:' + e.detail.errMsg);
			},
			//手指触摸动作开始
			touchStart: function(e) {
				//得到触摸点的坐标
				this.startX = e.changedTouches[0].x;
				this.startY = e.changedTouches[0].y;
				this.context = uni.createCanvasContext('stampCanvas');
				this.context.setStrokeStyle(this.color);
				this.context.setLineWidth(this.pen);
				this.context.setLineCap('round'); // 让线条圆润

				this.context.beginPath();
			},
			//手指触摸后移动
			touchMove: function(e) {
				var startX1 = e.changedTouches[0].x;
				var startY1 = e.changedTouches[0].y;
				this.context.moveTo(this.startX, this.startY);
				this.context.lineTo(startX1, startY1);
				this.context.stroke();
				this.startX = startX1;
				this.startY = startY1;
				this.context.draw(true); //只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>
			},
			switchPen: function(e) {
				console.log('切换font');
				var pen = e.currentTarget.dataset.pen;
				this.pen = pen
			},

			switchColor: function(e) {
				console.log('切换color');
				var color = e.currentTarget.dataset.color;
				this.color = color
			},
			clearAction: function() {
				console.log('清除');
				this.context.clearRect(0, 0, 750, 1334);
				this.context.draw();
			},
			/**
			 * @name 提交印章
			 */
			submitAction() {
				const query = uni.createSelectorQuery();
				query.select('#stampCanvas').boundingClientRect(rect => {
					const width = rect.width;
					const height = rect.height;
					uni.canvasToTempFilePath({
						canvasId: 'stampCanvas',
						x: 0,
						y: 0,
						width: width,
						height: height,
						success: res => {
							var tempFilePath = res.tempFilePath;
							const ctx = uni.createCanvasContext('myCanvas');
							ctx.fillStyle = '#fff';
							ctx.fillRect(0, 0, width, width);
							const ratio = width / height;
							ctx.rotate(-90 * Math.PI / 180);
							ctx.scale(ratio, 1);
							ctx.translate(-width * 1.5, 0);
							ctx.drawImage(tempFilePath, 0, 0, width, width);
							
							ctx.draw(true, () => {
								uni.canvasToTempFilePath({
									canvasId: 'myCanvas',
									x: 0,
									y: 0,
									width: width,
									height: width,
									success: res => {
										uni.showLoading({
											title: '',
											mask: true
										});
										
										upload({
											url: upload_painted_wx_url,
											filePath: res.tempFilePath,
											key: 'file',
											// file: file,
											success: data => {
												var header = {
													"token": this.userToken,
													"Content-Type": "application/json"
												};
												postBody({
													url: save_personnal_seal,
													header: header,
													params: {
														"name": "印章",
														"url": data.url,
														"originType": 1
													},
													success: res => {
														uni.navigateBack(-1);
													},
													fail: function(err) {
														setTimeout(() => {
															uni.showToast({
																icon: 'none',
																title: err
															})
														}, 500)
													}
												});
											},
											fail: err => {
												console.log(err, 4444);
												uni.hideLoading();
											}
										});

									}
								});
							});
						},
						fail(e) {
							console.log(e);
						}
					});
				}).exec();
			}
		}
	};
</script>
<style>
	@import "./addStamp.css";
</style>
