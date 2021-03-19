<template>
	<view class="login-verify--page">
		<verify-code ref="code"></verify-code>
	</view>
</template>

<script>
	import {
		get,
		post
	} from '@api/request.js'

	import {
		login_url,
		get_register_sms_code_url,
		zfb_login
	} from '@api/account.js'

	import {
		get_gift_card_from_wx,
		get_gift_card_status
	} from '@api/cost.js'

	import verifyCode from '@c/verifycode/verifycode'

	const app = getApp()

	export default {
		data() {
			return {
				openId: '',
				unionId: '',
				phone: '',
				originType: null,
				isCard: false,
				cardId: '',
				mode: ''
			};
		},

		components: {
			verifyCode
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			if (options.originType != null) {
				this.originType = options.originType
			}

			if (options.isCard) {
				this.isCard = true
			}

			if (options.cardId) {
				this.cardId = options.cardId
			}

			this.phone = options.phone
			this.openId = options.openId || ''
			this.unionId = options.unionId || ''

			setTimeout(() => {
				this.verifycode = this.$refs.code;
				this.sendPhoneCodeFun(this.phone); //弹出verifycode
				this.verifycode.showView({
					userPhone: this.phone,
					inputSuccess: (phoneCode, callback) => {
						// #ifdef  MP-WEIXIN
						this.wxLoginFun(this.phone, phoneCode);
						// #endif

						// #ifdef  MP-ALIPAY
						this.zfbLogin(this.phone, phoneCode);
						// #endif
						// this.verifycode.clearCode();
					},
					againSend: () => {
						//重新发送
						this.sendPhoneCodeFun(phone);
					}
				});
			}, 500)

		},

		onShareAppMessage() {},

		methods: {
			/**
			 * 微信登陆
			 */
			wxLoginFun(phone, code) {
				uni.hideLoading();
				uni.showLoading({
					title: '登陆中...'
				});

				post({
					url: login_url,
					params: {
						phone: phone,
						phoneCode: code,
						openId: this.openId,
						unionId: this.unionId
					},
					success: data => {
						//存储用户数据
						var app = getApp();
						app.globalData.loginSuccess(data.token, data.userId, data.name, data.userType, data.auth, data.phone, data.icon,
							data.joinCompany, data.userCompanyType);
						uni.hideLoading(); //判断登陆来源

						var originType = this.originType;

						if (this.isCard) {
							this.getGiftCardStatusFun(this.getGiftCardFun);
						} else if (originType == "auth") {
							uni.navigateBack({
								delta: 3
							});
						} else {
							// 进入首页
							uni.reLaunch({
								url: '/pages/home/home'
							});
						}
					},
					fail: function(msg) {
						uni.hideLoading();
						setTimeout(() => {
							uni.showToast({
								title: msg,
								icon: "none"
							});
						}, 50);
					}
				});
			},

			/**
			 * @name 支付宝登录
			 * @param {Object} phone 电话
			 * @param {Object} code 验证码
			 */
			zfbLogin(phone, code) {
				uni.hideLoading();
				uni.showLoading({
					title: '登陆中...'
				});

				app.globalData.getUserAuthCode(() => {
					post({
						url: zfb_login,
						params: {
							phone: phone,
							phoneCode: code,
							authCode: app.globalData.authCode,
						},
						success: data => {
							//存储用户数据
							var app = getApp();
							app.globalData.loginSuccess(data.token, data.userId, data.name, data.userType, data.auth, data.phone, data.icon,
								data.joinCompany, data.userCompanyType);
							uni.hideLoading(); //判断登陆来源

							var originType = this.originType;

							if (this.isCard) {
								this.getGiftCardStatusFun(this.getGiftCardFun);
							} else if (originType == "auth") {
								uni.navigateBack({
									delta: 3
								});
							} else {
								// 进入首页
								uni.reLaunch({
									url: '/pages/home/home'
								});
							}
						},
						fail: function(msg) {
							uni.hideLoading();
							setTimeout(() => {
								uni.showToast({
									title: msg,
									icon: "none"
								});
							}, 50);
						}
					});
				})
			},
			/**
			 * 发送验证码
			 */
			sendPhoneCodeFun(userPhone) {
				uni.showLoading({
					title: '验证码发送中'
				});
				get({
					url: get_register_sms_code_url + '/' + userPhone,
					success: data => {
						uni.hideLoading()
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: '发送成功,请注意查收'
							});
						}, 50);

						this.verifycode.clearCode();
						this.verifycode.sendSuccess();
					},
					fail: err => {
						uni.hideLoading();
						setTimeout(() => {
							uni.showToast({
								title: err,
								icon: "none"
							});
						}, 50);
					}
				});
			},

			/**
			 * @name 领取礼品卡
			 */
			getGiftCardFun() {
				uni.showLoading({
					title: '领取中'
				});
				get({
					url: get_gift_card_from_wx + this.cardId,
					success: () => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: '礼品卡领取成功'
							});
						}, 50);
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/costManage/accountCard/accountCard?type=1'
							});
						}, 1500);
					},
					fail: err => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err
							});
						}, 50);
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/home/home'
							});
						}, 21500);
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},

			/**
			 * @name 获取礼品卡状态
			 */
			getGiftCardStatusFun(callback) {
				get({
					url: get_gift_card_status + this.cardId,
					success: res => {
						console.log(res);

						if (!res) {
							setTimeout(() => {
								uni.showToast({
									icon: 'none',
									title: '礼品卡已被领取'
								});
							}, 50);
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/home/home'
								});
							}, 1500);
						} else {
							typeof callback == 'function' && callback();
						}
					},
					fail: err => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err
							});
						}, 50);
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/home/home'
							});
						}, 1500);
					}
				});
			}

		}
	};
</script>
<style>
	@import "./loginVerify.css";
</style>
