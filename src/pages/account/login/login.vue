<template>
	<view>

		<!-- #ifdef MP-WEIXIN -->
		<button class="btn" v-if="!isBindOpenId" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信账号快速登陆</button>
		<button class="btn" v-if="isBindOpenId" @tap.stop="handleLoginByPhoneFun">微信账号快速登陆</button>
		<!-- #endif -->

		<!-- #ifdef MP-ALIPAY -->
		<!-- canIUseAuthButton -->
		<button class="btn" v-if="!isBindOpenId" open-type="getAuthorize" @getAuthorize="getPhoneNumber" @error="onAuthError"
		 scope='phoneNumber'>
			支付宝账号快速登陆
		</button>
		<button class="btn" v-if="isBindOpenId" @tap.stop="handleLoginByPhoneFun">支付宝账号快速登陆</button>
		<!-- #endif -->

		<view class="mark-view" :hidden="!isShowMark">
			<view class="mark-content-view global-shadow">
				<input class="mark-phone-input" @input="bindKeyInput" placeholder="请输入手机号码" v-model="loginPhone" type="number" />
				<view class="mark-btn" @tap.stop="bindPhoneAction">确认绑定此号码</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		get,
		post,
		postBody
	} from '@api/request';
	import {
		get_phone_wx_code,
		get_phone_zfb_code,
		decode_phone,
		get_zfb_phone
	} from '@api/account';

	export default {
		data() {
			return {
				wxCode: '',
				openId: '',
				unionId: '',
				loginPhone: '',
				isShowMark: false,
				isBindOpenId: false,
				bandPhone: ''
			};
		},
		onLoad: function(options) {},
		onShow: function() {
			this.getRegisterStatusFun();
		},

		onShareAppMessage() {},

		methods: {
			onAuthError(e) {
				console.log(e, 'error')
			},
			/**
			 * @name 微信登陆
			 * @param {*} callback 回调
			 */
			loginWxFun(callback) {
				uni.login({
					success: res => {
						if (res.code) {
							this.wxCode = res.code
							typeof callback == 'function' && callback();
						} else {
							setTimeout(() => {
								// #ifdef  MP-WEIXIN
								uni.showToast({
									icon: 'none',
									title: '请先授权微信登陆'
								});
								// #endif

								// #ifdef  MP-ALIPAY
								uni.showToast({
									icon: 'none',
									title: '请先授权支付宝登陆'
								});
								// #endif
							}, 50);
						}
					},
					fail: function() {
						setTimeout(() => {
							// #ifdef  MP-WEIXIN
							uni.showToast({
								icon: 'none',
								title: '请先授权微信登陆'
							});
							// #endif

							// #ifdef  MP-ALIPAY
							uni.showToast({
								icon: 'none',
								title: '请先授权支付宝登陆'
							});
							// #endif
						}, 50);
					}
				});
			},

			/**
			 * @name 获取注册状态
			 */
			getRegisterStatusFun() {
				const canNavigate = false;
				this.loginWxFun(() => {
					this.getUserRegisterInfoFun(canNavigate);
				});
			},

			/**
			 * @name 通过手机号登陆
			 */
			handleLoginByPhoneFun() {
				const canNavigate = true;
				this.loginWxFun(() => {
					this.getUserRegisterInfoFun(canNavigate);
				});
			},

			/**
			 * 根据code获取用户是否已经注册
			 */
			getUserRegisterInfoFun(canNavigate) {
				if (!this.isBindOpenId) {
					get({
						url: get_phone_wx_code + '/' + this.wxCode,
						success: data => {
							if (data.isRegister) {
								this.bandPhone = data.phone
								this.openId = data.openId
								this.unionId = data.unionId
								this.isBindOpenId = true

								if (canNavigate) {
									uni.navigateTo({
										url: "/pages/account/loginVerify/loginVerify?phone=" + this.bandPhone + "&unionId=" + this.unionId +
											"&openId=" + this.openId + "&originType=" + this.originType
									});
								}
							} else {
								this.isBindOpenId = false
							}
						},
						fail: err => {
							setTimeout(() => {
								uni.showToast({
									icon: 'none',
									title: '登陆信息获取失败：' + err
								});
							}, 50);
							this.isBindOpenId = false
						}
					});
				} else {
					if (canNavigate) {
						uni.navigateTo({
							url: "/pages/account/loginVerify/loginVerify?phone=" + this.bandPhone + "&unionId=" + this.unionId +
								"&openId=" + this.openId + "&originType=" + this.originType
						});
					}
				}
			},
			/**
			 * @name 获取手机号以及微信信息
			 * @param {*} e 
			 */
			getWxPhoneFun(e) {
				post({
					url: decode_phone,
					params: {
						encrypted: e.detail.encryptedData,
						iv: e.detail.iv,
						code: this.wxCode,
						wxAppType: 2
					},
					success: data => {
						//判断用户是否已经注册
						this.bandPhone = data.phone
						this.loginPhone = data.phone
						this.openId = data.openId
						this.unionId = data.unionId
						this.isBindOpenId = true
						uni.navigateTo({
							url: "/pages/account/loginVerify/loginVerify?phone=" + data.phone + "&unionId=" + data.unionId + "&openId=" +
								data.openId
						});
					},
					fail: msg => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: msg
							});
						}, 50);
					}
				});
			},
			/**
			 * @name 通过按钮获取参数，请求后台获取手机号以及微信信息
			 */
			getPhoneNumber(e) {
				// #ifdef  MP-WEIXIN
				if ("getPhoneNumber:ok" != e.detail.errMsg) {
					setTimeout(() => {
						uni.showToast({
							icon: 'none',
							title: '快捷登陆失败'
						});
					}, 50);
					return;
				}
				this.loginWxFun(() => {
					this.getWxPhoneFun(e);
				});
				// #endif



				// #ifdef  MP-ALIPAY
				my.getPhoneNumber({
					scopes: "auth_user",
					success: res => {
						var response = JSON.parse(res.response);
						console.log(response, 3333)
						this._getZfbPhone(response); // 调取这个自定义方法 
					},
					fail: err => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err
							})
						}, 50)
					}
				});
				// #endif


			},

			bindKeyInput(e) {
				if (this.loginPhone.length > 11) {
					this.loginPhone = this.loginPhone.substr(0, 11);
				}
			},

			/**
			 * 绑定手机号码
			 */
			bindPhoneAction: function() {
				uni.navigateTo({
					url: "/pages/account/loginVerify/loginVerify?phone=" + this.loginPhone + "&unionId=" + this.unionId +
						"&openId=" + this.openId
				});
			},
			/**
			 * @name 获取支付宝手机号
			 * @param {Object} data 支付宝手机号加密数据
			 */
			_getZfbPhone(data) {
				uni.showLoading({
					title: '获取手机号中...'
				})
				postBody({
					url: get_zfb_phone,
					params: JSON.parse(JSON.stringify(data)),
					success: res => {
						uni.navigateTo({
							url: "/pages/account/loginVerify/loginVerify?phone=" + res
						});
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
						uni.hideLoading()
					}
					
				})
			}
		}
	};
</script>
<style>
	@import "./login.css";
</style>
