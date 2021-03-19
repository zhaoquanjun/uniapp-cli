<template>
	<view class="h-login--page">
		<view class="login-content">
			<view class="logo-area">
				<image :src="loginIcon" mode=""></image>
			</view>
			<view class="account-area">
				<view class="label">手机号</view>
				<view class="value">
					<view class="input-wrapper">
						<input type="number" placeholder="请输入手机号" maxlength="11" v-model="phone">
					</view>
				</view>
				<view class="label yzm">验证码</view>
				<view class="value">
					<view class="input-wrapper code">
						<input type="number" maxlength="6" placeholder="请输入验证码" v-model="yzm">
					</view>
					<view class="getcode-btn" @tap.stop="getYzmCode">{{ getCodeBtnWords }}</view>
				</view>
				<view class="login-btn" @tap="login">登录</view>
			</view>
		</view>
		<view class="circle"></view>
	</view>
</template>

<script>
	const app = getApp();
	import utils from '@u/utils.js'
	import {
		get,
		post
	} from '@api/request'
	import {
		h5_get_yzm_code,
		h5_login
	} from '@api/account.js'
	export default {
		data() {
			return {
				phone: "",
				yzm: "",
				timer: null,
				time: 60,
				getCodeBtnWords: "获取验证码",
				loginIcon: require('@s/pm/miniH5_login.png')
			}
		},
		onLoad: function() {},
		onShow: function() {},
		methods: {
			/**
			 * @name 规范输入手机号
			 */
			_handleFormatPhoneNumber(val) {
				this.phone = val.replace(/[^\d.]/g, "");
			},
			/**
			 * @name 规范输入验证码
			 */
			_handleFormatYzmCode(val) {
				this.yzm = val.replace(/[^\d.]/g, "");
			},
			/**
			 * @name 获取验证码
			 */
			getYzmCode() {
				if (utils.isTelCode(this.phone) && !this.timer) {
					get({
						url: h5_get_yzm_code + this.phone,
						success: res => {
							setTimeout(() => {
								uni.showToast({
									icon: 'none',
									title: '验证码发送成功，请注意查收'
								});
							}, 50);
							this.timer && clearInterval(this.timer);
							this.timer = setInterval(() => {
								if (this.time > 1) {
									this.time--;
									this.getCodeBtnWords = this.time + "s后再次获取";
								} else {
									clearInterval(this.timer);
									this.timer = null;
									this.time = 60;
									this.getCodeBtnWords = "获取验证码";
								}
							}, 1000);
						},
						fail: () => {
							setTimeout(() => {
								uni.showToast({
									icon: 'none',
									title: '获取验证码失败'
								});
							}, 50);
						}
					})

				} else {
					if (!this.timer) {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: '请输入正确手机号'
							});
						}, 50);
					}
				}
			},
			/**
			 * @name 登录
			 */
			login() {
				let path = "";
				post({
					url: h5_login,
					params: {
						phone: this.phone,
						phoneCode: this.yzm
					},
					success: res => {
						this.setlocalStorage({
							token: res.token,
							userAccout: res.account,
							userId: res.userId,
							phone: res.phone,
							currentUser: JSON.stringify(res)
						});
						console.log(res)
						app.globalData.loginSuccess(res.token, res.userId, res.name, res.userType, res.auth, res.phone, res.icon, res.joinCompany, res.userCompanyType);
						uni.reLaunch({
						  url: '/pages/home/home'
						});
					},
					fail: err => {
						uni.showToast({
							icon: 'none',
							title: err
						})
					}
				})
			},
			/**
			 * @name 批量设置本地缓存
			 * @param {Object} obj 要设置的对象集合
			 */
			setlocalStorage(obj) {
				for (var k in obj) {
					localStorage.setItem(k, obj[k]);
				}
			}
		},
		destroyed() {
			this.timer && clearInterval(this.timer);
		},
	}
</script>

<style>
	@import "./hlogin.css";
</style>
