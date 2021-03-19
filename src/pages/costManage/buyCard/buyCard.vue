<template>
	<view class="buy-card--page">
		<view class="buy-amount--section section">
			<view class="amount-list">
				<view class="label">面值金额</view>
				<view class="list-area">
					<view v-for="(item, index) in amountList" :key="index" :class="'list-item ' + (selectActive == item.value && valueStatus == 'select' ? 'active' : '')"
					 @tap="handleSelectValueFun(item)">{{item.label}}元
					</view>
				</view>
			</view>
			<view class="amount-input--area">
				<input :placeholder="placeholders[activeIndex]" type="number" @input="handleInputValueFun" @focus="handleFocusFun"></input>
				<view class="prefix">元</view>
			</view>
		</view>
		<view class="total-way--seciton section">
			<view class="select-count--area item">
				<view class="label">购买数量</view>
				<view class="count-area">
					<input placeholder="请输入礼品卡个数" type="number" :value="count" @input="handleCountValueFun" @blur="handleBlurCountFun"></input>
					<view class="prefix">个</view>
				</view>
			</view>
			<view class="total--area item">
				<view class="label">总金额</view>
				<view class="value">¥ {{total}}</view>
			</view>
			<view class="way-select--area item">
				<view class="label">购买方式</view>
				<view class="way-select--area" @tap="handleSelectWayFun">
					<view class="select-value">{{selectList[activeIndex].label}}</view>
					<view class="trangle"></view>
				</view>
			</view>
		</view>
		<slider-picker ref="sliderPicker" :sliderList="selectList" @selectWay="handleSelectPayWayFun"></slider-picker>
		<view class="confirm-btn" @tap="handleConfirmBuyFun">确认购买</view>
	</view>
</template>

<script>
	import {
		get
	} from '@api/request.js'
	import {
		buy_card_by_account,
		get_wx_pay_params,
		get_zfb_pay_params
	} from '@api/cost.js'
	import sliderPicker from "@c/sliderPicker/sliderPicker";

	const app = getApp()

	export default {
		data() {
			return {
				amountList: [{
					// 选择金额列表
					label: 100,
					value: 100
				}, {
					label: 500,
					value: 500
				}, {
					label: 1000,
					value: 1000
				}],

				selectList: [{
						label: '账户余额',
						value: 'account'
					},
					// #ifdef  MP-WEIXIN
					{
						label: '微信支付',
						value: 'wx'
					},
					// #endif

					// #ifdef  MP-ALIPAY
					{
						label: '支付宝支付',
						value: 'wx'
					},
					// #endif
					
					// #ifdef  H5
					{
						label: '第三方支付',
						value: 'wx'
					},
					// #endif
				],

				origin: 'buy',
				activeIndex: 0,
				valueStatus: 'select',
				// 金额填写方式
				rechargeValue: 100,
				// 实时金额
				total: Number(100).toFixed(2),
				// 总额
				selectActive: 100,
				// 面值数值选择
				count: 1,
				// 购买数量
				timer: null,
				placeholders: ['请输入10或10以上的金额', '请输入10～1000整数']
			};
		},

		components: {
			sliderPicker
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			if (options.origin) {
				this.origin = options.origin
			}

		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {
			if (this.timer) clearTimeout(this.timer)
		},
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
		methods: {
			/**
			 * @name 选择支付方式
			 */
			handleSelectPayWayFun(e) {
				this.activeIndex = e.detail
				this.$refs.sliderPicker.hide();
			},

			/**
			 * @name 选择充值金额
			 */
			handleSelectValueFun(item) {
				this.selectActive = item.value
				this.rechargeValue = item.value
				this.total = (item.value * this.count).toFixed(2)
				this.valueStatus = 'select'
			},

			/**
			 * @name 输入充值金额
			 */
			handleInputValueFun(e) {
				const value = e.detail.value;
				this.rechargeValue = value
				this.total = (this.count * value).toFixed(2)
				return value;
			},

			/**
			 * @name 输入数量
			 */
			handleCountValueFun(e) {
				const value = e.detail.value;
				this.count = value
				this.total = this.rechargeValue ? (this.rechargeValue * value).toFixed(2) : '0.00'
				return value;
			},

			/**
			 * @name input 获取焦点
			 */
			handleFocusFun() {
				if (this.valueStatus == 'select') {
					this.selectActive = -1
					this.rechargeValue = ''
					this.valueStatus = 'input'
					this.total = 0
				}
			},

			/**
			 * @name 选择支付方式
			 */
			handleSelectWayFun() {
				this.$refs.sliderPicker.show();
			},

			/**
			 * @name 确认购买
			 */
			handleConfirmBuyFun() {
				if (this.rechargeValue && Number(this.rechargeValue) >= 10) {
					uni.showLoading({
						title: '支付中'
					});

					if (this.activeIndex == 0) {
						get({
							url: buy_card_by_account + `?amount=${this.total}&goods=${this.rechargeValue}&goodsNum=${this.count}`,
							success: res => {
								console.log(res);
								setTimeout(() => {
									uni.showToast({
										icon: 'none',
										title: '礼品卡购买成功，已存至【礼品卡 - 可使用】清单中',
										duration: 3000
									});
								}, 50);
								this.timer = setTimeout(() => {
										if (this.origin == 'give') {
											uni.navigateTo({
												url: '/pages/costManage/giveWay/giveWay?origin=' + this.origin + '&id=' + res + '&money=' + this.rechargeValue +
													'&count=' + this.count
											});
										}

										if (this.origin == 'buy') {
											uni.redirectTo({
												url: '/pages/costManage/accountCard/accountCard?type=1&origin=result'
											});
										}
									}, 2000)
							},
							fail: err => {
								console.log(err);
								uni.showModal({
									title: '购买失败',
									content: this.activeIndex == 0 ? "账户余额不足，礼品卡购买失败，您可以先充值再购买礼品卡，或者直接使用微信支付购买" : "购买失败",
									showCancel: false,
									confirmText: '我知道了'
								});
							},
							complete: () => {
								uni.hideLoading();
							}
						});
					}

					if (this.activeIndex == 1) {
						// #ifdef MP-WEIXIN
						this.getWxPayParamsFun();
						// #endif

						// #ifdef  MP-ALIPAY
						app.globalData.getUserAuthCode(this.getZfbPayParamsFun)
						// #endif

						// #ifdef  H5
						app.globalData.getH5PayUrl({
							value: this.total,
							desc: '购买礼品卡',
							rechargeType: 0,
							origin: 2,
							goods: this.rechargeValue,
							goodsNum: this.count,
						});
						// #endif

					}
				} else {
					setTimeout(() => {
						uni.showToast({
							icon: 'none',
							title: '购买金额不能小于10元'
						});
					}, 50);
				}
			},

			/**
			 * @name 创建订单获取微信支付参数
			 */
			getWxPayParamsFun() {
				uni.showLoading({
					title: '创建订单中'
				});
				get({
					url: get_wx_pay_params,
					params: {
						amount: this.total,
						body: '微信支付',
						rechargeType: 0,
						goods: this.rechargeValue,
						goodsNum: this.count,
						authCode: app.globalData.authCode
					},
					success: res => {
						console.log(res);
						this.payByWxFun(res);
					},
					fail: err => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err
							});
						}, 50);
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},

			/**
			 * @name 创建订单获取支付宝支付参数
			 */
			getZfbPayParamsFun() {
				uni.showLoading({
					title: '创建订单中'
				});
				get({
					url: get_zfb_pay_params,
					params: {
						amount: this.total,
						body: '支付宝支付',
						rechargeType: 0,
						goods: this.rechargeValue,
						goodsNum: this.count,
						authCode: app.globalData.authCode
					},
					success: res => {
						console.log(res);
						this.payByZfbFun(res);
					},
					fail: err => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err
							});
						}, 50);
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},

			/**
			 * @name 微信支付
			 */
			payByWxFun(data) {
				if (this.rechargeValue) {
					uni.requestPayment({
						'timeStamp': data.timeStamp,
						'nonceStr': data.nonceStr,
						'package': data.package,
						'signType': data.signType,
						'paySign': data.paySign,
						'success': res => {
							setTimeout(() => {
								uni.showToast({
									icon: 'none',
									title: '支付成功'
								});
							}, 50);
							this.timer = setTimeout(() => {
									if (this.origin == 'give') {
										uni.navigateTo({
											url: '/pages/costManage/giveWay/giveWay?origin=' + this.origin + '&id=' + res + '&money=' + this.rechargeValue +
												'&count=' + this.count
										});
									}

									if (this.origin == 'buy') {
										uni.redirectTo({
											url: '/pages/costManage/costManage'
										});
									}
								}, 2000)
						},
						'fail': err => {
							console.log(err);
						},
						'complete': () => {}
					});
				}
			},
			/**
			 * @name 支付宝支付
			 */
			payByZfbFun(data) {
				if (this.rechargeValue) {
					my.tradePay({
						tradeNO: data,
						success: res => {
							setTimeout(() => {
								uni.showToast({
									icon: 'none',
									title: '支付成功'
								});
							}, 50);
							this.timer = setTimeout(() => {
									if (this.origin == 'give') {
										uni.navigateTo({
											url: '/pages/costManage/giveWay/giveWay?origin=' + this.origin + '&id=' + res + '&money=' + this.rechargeValue +
												'&count=' + this.count
										});
									}

									if (this.origin == 'buy') {
										uni.redirectTo({
											url: '/pages/costManage/accountCard/accountCard?type=1'
										});
									}
								}, 2000)
						},
						fail: err => {
							setTimeout(() => {
								uni.showToast({
									icon: 'none',
									title: err
								});
							}, 50);
						},
					});
				}
			},
			/**
			 * @name H5支付
			 */
			payByH5Fun() {}
		}
	};
</script>
<style>
	@import "./buyCard.css";
</style>
