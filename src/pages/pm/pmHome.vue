<template>
	<!--pages/pm/pmHome.wxml-->
	<view>
		<view class="pm-home">
			<view class="header">
				<view class="person-box" v-if="userToken">
					<!-- #ifdef MP-WEIXIN -->
					<open-data type="userAvatarUrl" class="avatar"></open-data>
					<!-- #endif -->

					<!-- #ifdef MP-ALIPAY -->
					<image class="avatar" :src="userAvatar || defaultAvatar" background-size="cover"></image>
					<!-- #endif -->

					<!-- #ifdef H5 -->
					<image class="avatar" :src="userAvatar || defaultAvatar" background-size="cover"></image>
					<!-- #endif -->
					<view class="info-box">
						<view class="userName">
							<view>
								<!-- #ifdef MP-WEIXIN -->
								<open-data type="userNickName" class="name"></open-data>
								<!-- #endif -->

								<!-- #ifdef MP-ALIPAY -->
								<view class="name">{{username}}</view>
								<!-- #endif -->

								<!-- #ifdef H5 -->
								<view class="name">{{username}}</view>
								<!-- #endif -->

								<view class="phone">{{userPhone}}</view>
							</view>
							<view class="auth-btn" @tap.stop="authAction" v-if="isAuth*1">已认证</view>
							<view class="auth-btn" @tap.stop="authAction" v-if="!isAuth*1">未认证</view>
						</view>
					</view>
				</view>
				<view class="person-box" v-else>
					<image :src="defaultAvatar" class="avatar"></image>
					<view class="info-box" style="margin-top:40rpx">
						<view class="userName">
							<view class="name">未登入</view>
						</view>
					</view>
				</view>
			</view>

			<view class="userinfo-bg-view">
				<view class="home-userinfo-view">
					<view v-for="(item, index) in items" :key="index">
						<view class="user-content-cell" v-if="item.hasAuth" :data-index="index" @tap.stop="tapItem">
							<image :src="item.icon" class="item-icon" mode="aspectFit"></image>
							<view class="user-content-cell-text global-title-color">{{item.name}}</view>
							<view class="iconfont iconright-arrow"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--收款方式菜单 -->
		<slider-picker ref="sliderPicker" :sliderList="sliderList" @selectWay="handleSliderOperateFun"></slider-picker>
		<button v-if="!userToken" class="login-btn" @tap.stop="login">立即登录</button>
		<wechatUserInfo :show="wechatUserInfoShow" @getWechatUserInfo="getWechatUserInfo"></wechatUserInfo>
	</view>
</template>

<script>
	// pages/pm/pmHome.js
	var app = getApp();
	import {
		get,
		put
	} from '@api/request.js'
	import {
		update_usericon
	} from '@api/account.js'
	import icon from "@c/icon/icon";
	import avatar from "@c/avatar/avatar";
	import wechatUserInfo from "@c/wechatUserInfo/wechatUserInfo";
	import halfSlideItem from "@c/halfSlideItem/halfSlideItem";
	import sliderPicker from "@c/sliderPicker/sliderPicker";

	export default {
		data() {
			return {
				items: [{
						icon: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/seal_icon.png',
						name: '印章管理',
						hasAuth: true
					},
					{
						icon: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/cost_icon.png',
						name: '费用管理',
						hasAuth: true
					},
					{
						icon: "http://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/invoice_apply_icon.png",
						name: '发票申请',
						hasAuth: true
					}, {
						icon: "http://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/invoice_apply_icon.png",
						name: '收款',
						hasAuth: true
					}
				],
				sliderList: [{
					label: '销售模版发起收款',
					value: 0
				}, {
					label: '独立收款',
					value: 1
				}],
				isShowReceiptMethod: false,
				isAdmin: false,
				wechatUserInfoShow: false,
				waitAffirmCount: 0,
				unreadContractMessageCount: 0,
				username: '',
				userPhone: '',
				userToken: '',
				userAvatar: '',
				isAuth: false,
				defaultAvatar: require('@s/pm/av.png')
			};
		},

		components: {
			icon,
			avatar,
			wechatUserInfo,
			halfSlideItem,
			sliderPicker
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			if (options.navigateUrl != null) {
				var navigateUrl = options.navigateUrl.replace(':', "?");
				navigateUrl = navigateUrl.replace('#', '=');
				uni.navigateTo({
					url: navigateUrl
				});
			}

			// #ifdef MP-ALIPAY
			my.getAuthCode({
				scopes: 'auth_user',
				success: (res) => {
					console.log(res, 1111)
					app.globalData.authCode = res.authCode
					my.getAuthUserInfo({
						success: (userInfo) => {
							this.userAvatar = userInfo.avatar
							this.username = userInfo.nickName
							app.globalData.userName = userInfo.nickName
							app.globalData.userAvatar = userInfo.avatar
						}
					});
				},
			});
			// #endif
		},
		onShow: function() {
			var isAdmin = app.globalData.memberType == 3 ? true : false;
			this.isAdmin = isAdmin
			this.init();
			
			if (!app.globalData.isLoginIn()) {
				this.items = []
				return;
			}

			const currentUser = uni.getStorageSync('currentUser');
			let list = this.items; // 费用管理部分 - 只有法人和管理员可查看

			if (currentUser.companyId && currentUser.roleTypes && !currentUser.roleTypes.includes('1') && !currentUser.roleTypes
				.includes('2') || currentUser.companyId && currentUser.roleTypes == null || !app.globalData.isLoginIn()) {
				list[1].hasAuth = false;
			} else {
				list[1].hasAuth = true;
			}


			if (currentUser.companyId && currentUser.payStatus != 2 || !currentUser.companyId) {
				list[3].hasAuth = false;
			} else {
				list[3].hasAuth = true;
			}

			this.items = list
		},

		onShareAppMessage() {},

		methods: {
			init() {
				this.username = app.globalData.userName
				this.userPhone = app.globalData.phone
				this.userToken = app.globalData.userToken
				this.isAuth = app.globalData.isAuth
			},

			login: function() {
				uni.redirectTo({
					url: '/pages/root/root'
				});
			},

			tapItem: function(e) {
				if (!app.globalData.isLoginIn()) {
					app.globalData.login();
					return false;
				}

				var index = e.currentTarget.dataset.index;
				var pageURI = '';

				switch (Number(index)) {
					case 0:
						pageURI = "/pages/pm/stamp/stampManager";
						break;

					case 1:
						pageURI = "/pages/costManage/costManage";
						break;

					case 2:
						pageURI = '/pages/invoice/invoice';
						break;

					case 3:
						this.selectReceipMathod();
						break;

					default:
						pageURI = "";
						break;
				}
				console.log(pageURI)

				if (index != 3) {
					uni.navigateTo({
						url: pageURI
					});
				}
			},

			/**
			 * getWechatUserInfo
			 */
			getUserInfo() {
				uni.getSetting({
					success: res => {
						if (res.authSetting['scope.userInfo']) {
							// 已经授权，可以直接调用 getUserInfo 获取头像昵称
							uni.getUserInfo({
								success: res => {
									this.getWechatUserInfo({
										detail: res.userInfo
									});
								},
								fail: function() {
									this.wechatUserInfoShow = true
								}
							});
						} else {
							this.wechatUserInfoShow = true
						}
					}
				});
			},
			getWechatUserInfo: data => {
				this.wechatUserInfoShow = false
				put({
					url: update_usericon,
					params: {
						iconUrl: data.detail.avatarUrl,
						nickname: data.detail.nickName
					},
					success: function() {
						app.globalData.updateUserIcon(data.detail.avatarUrl);
					}
				});
			},

			authAction: function() {
				if (!this.isAuth) {
					uni.navigateTo({
						url: "/pages/authentication/personal/personal-auth-type/index"
					});
				}
			},

			/**
			 * @desc 显示收款方式
			 */
			selectReceipMathod() {
				this.$refs.sliderPicker.show();
			},

			/**
			 * @name 上滑事件
			 * @param {*} e 事件源
			 */
			handleSliderOperateFun(e) {
				switch (e.detail) {
					case 0:
						uni.navigateTo({
							url: '/pages/collection/templateCollection/templateCollection?isTemplate=1'
						});
						break;

					case 1:
						uni.navigateTo({
							url: '/pages/collection/dirctCollection/dirctCollection?isTemplate=0'
						});
						break;

					default:
						break;
				}

				this.$refs.sliderPicker.hide();
			}

		}
	};
</script>
<style>
	@import "./pmHome.css";
</style>
