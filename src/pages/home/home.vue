<template>
	<!--pages/home/home.wxml-->
	<view>
		<view class="header-Bar">
			<view class="layout">
				<view class="currentName" @tap.stop="handleLaunchUserSwitchFun">
					<view class="_currentName">
						{{userName}}
					</view>
					<image class="select" src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/account/select.png"></image>
				</view>
				<view class="layout-middle"></view>
				<view class="search" @tap.stop="handleToSearchPageFun">
					<icon size="15" color="white" style="width:26rpx; height:26rpx; margin-left:44rpx;margin-top:18rpx" type="search"></icon>
					<!--<input type="text" value="{{searchValue}}" value="请输入合同名称"/>-->
					<view class="underSearch"></view>
				</view>
			</view>
			<view class="home-count-view">
				<view class="file-count-content-view" @tap="handleToViewContractForSelfFun">
					<text class="count-text global-title-color">{{mineSignCount}}</text>
					<text class="count-title global-content-color">待自己处理</text>
				</view>
				<view class="file-count-content-view-middle"></view>
				<view class="file-count-content-view" @tap="handleToViewContractForOthersFun">
					<text class="count-text global-title-color">{{otherSignCount}}</text>
					<text class="count-title global-content-color">待他人处理</text>
				</view>
			</view>
		</view>
		<!-- #ifndef MP-ALIPAY -->
		<view class="launchButton" @tap.stop="handleLaunchContractFun">
			从聊天文件发起签署
		</view>
		<!-- #endif -->
		
		<!-- #ifdef MP-ALIPAY -->
		<view class="launchButton" @tap.stop="handleLaunchContractFun">
			选择本地文件发起签署
		</view>
		<!-- #endif -->

		<!-- 存证部分 -->
		<home-add-dataStorge ref="homeadddataStorge"></home-add-dataStorge>
		<!-- 选择签署方式上滑slider -->
		<slider-picker ref="sliderPicker" :sliderList="sliderList" @selectWay="handleSliderOperateFun"></slider-picker>
		<!-- 未认证提示 -->
		<view class="warning" v-if="!hasAuth && isLogin" @tap.stop="authAction">
			<text class="warn-title" v-if="authType == 1">您的账号尚未实名认证</text>
			<text class="warn-title" v-if="authType == 2">企业尚未实名认证</text>
			<text class="warn-content">实名认证后可享受加便捷高效的电子合同服务</text>
		</view>
		<!-- 用户列表弹层 -->
		<view :class="'user-dialog ' + ( showDialog ? 'user-dialog--show' : '' )">
			<view class="user-dialog__mask" @tap="handleCloseUserDialogFun"></view>
			<view class="user-dialog__container">
				<view class="userSwitch">
					切换身份
					<view class="company">
						<image class="company-icon" src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/account/company.png"></image>
						<view class="company-add" @tap.stop="handleCreateCompanyFun">创建企业</view>
					</view>
				</view>
				<scroll-view scroll-y nowrap style="height:540rpx">
					<view v-for="(item, index) in userList" :key="index" class="userList" @tap="switchUser(item, index)">
						<image src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/account/user.png" v-if="item.authStatus"
						 class="userList-icon"></image>
						<image src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/account/person.png" v-if="item.auth==0||item.auth==1"
						 class="userList-icon"></image>
						<view class="userList-name">
							{{item.companyName ? item.companyName : item.name ? item.name : '未认证用户'}}
						</view>
						<view class="userList-state" v-if="item.authStatus" :style="'background:' + (item.authStatus== 1 ? 'rgba(62,180,168,0.1)' :item.authStatus== 2 ? '#FDF0E5':'#F4F4F4') + '; color:' + (item.authStatus== 1? '#3EB4A8' : item.authStatus== 2 ? '#ED6C00':'#919191')">
							{{item.authStatus=='1'?"已认证":item.authStatus== 2?"认证中":"未认证"}}</view>
						<view class="userList-state" v-if="item.auth==0||item.auth==1" :style="'background:' + (item.auth== 1 ? 'rgba(62,180,168,0.1)' : '#F4F4F4') + '; color:' + (item.auth== 1? '#3EB4A8' : '#919191')">
							{{item.auth=='1'?"已认证":"未认证"}}</view>
					</view>
				</scroll-view>
				<view class="scroll-under">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	import {
		get,
		upload
	} from '@api/request';
	import {
		get_user_info,
		companyList,
		get_contract_uploadFile,
		update_count
	} from '@api/account';
	import homeAddDataStorge from "@c/home-add-dataStorge/home-add-dataStorge";
	import sliderPicker from "@c/mpSliderPicker/mpSliderPicker";

	export default {
		data() {
			return {
				showDialog: false,
				mineSignCount: '0',
				otherSignCount: '0',
				hasAuth: false,
				fileName: '',
				userName: '',
				userList: [],
				sliderList: [{
					label: '发起文件签署',
					value: 1
				}, {
					label: '从合同模版发起签署',
					value: 2
				}],
				authType: 1 // 未认证状态 1:个人 2:企业 
					,
				isLogin: ""
			};
		},

		components: {
			homeAddDataStorge,
			sliderPicker
		},
		props: {},

		onLoad() {},

		onShow() {
			this.initUserStatusOnLoadingFun();
			app.globalData.getMiniAppUpdateStatus()
			console.log(this.$router)
		},

		onUnload() {},

		onShareAppMessage() {},

		methods: {
			/**
			 * @name 初始化用户信息
			 */
			initUserStatusOnLoadingFun() {
				// #ifdef H5
				const currentUser = JSON.parse(localStorage.getItem('currentUser'));
				// #endif
				
				// #ifndef H5
				const currentUser = uni.getStorageSync('currentUser');
				// #endif
				
				let name = ''
				
				console.log(currentUser)
				if (currentUser) {
					name = currentUser.companyId ? currentUser.companyName : (currentUser.name && currentUser.name !=
						'') ? currentUser.name : '未登录';
				} else {
					name = '未登录'
				}

				this.userName = name
				this.isLogin = app.globalData.isLoginIn()
				
				this.getCompanyUserInfoFun();
				this.getContractCountFun();
			},

			/**
			 * @name 获取个人信息
			 */
			getSignalUsersInfoFun() {
				uni.showLoading({
					title: '加载中'
				});
				get({
					url: get_user_info,
					success: res => {
						// #ifdef H5
						let currentUser = JSON.parse(localStorage.getItem('currentUser'));
						// #endif
						
						// #ifndef H5
						let currentUser = uni.getStorageSync('currentUser');
						// #endif
						
						const newArr = JSON.parse(JSON.stringify(this.userList));
						newArr.unshift(res);

						if (!currentUser) {
							// #ifdef H5
							localStorage.setItem('currentUser', JSON.stringify(res))
							// #endif
							
							// #ifndef H5
							uni.setStorageSync('currentUser', res);
							// #endif
							
							currentUser = res;
						}
						uni.setStorageSync('userAccount', res.account);
						this.userList = newArr
						this.userName = currentUser && currentUser.companyId ? currentUser.companyName : res.name ? res.name : '未认证用户'
						this.authType = 1
						this.hasAuth = currentUser.companyId && currentUser.authStatus == 1 || currentUser.auth == 1 ? true : false
						app.globalData.isAuth = currentUser.companyId && currentUser.authStatus == 1 || currentUser.auth == 1 ? true :
							false;
					},
					fail: err => {
						console.log(err)
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},

			/**
			 * @name 获取公司列表账户信息
			 */
			getCompanyUserInfoFun() {
				uni.showLoading({
					title: '加载中'
				});
				get({
					url: companyList,
					success: res => {
						const newArr = res.data;
						this.userList = newArr
						this.getSignalUsersInfoFun();
					},
					fail: err => {
						console.log(err)
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},

			/**
			 * @name 跳转搜索页
			 */
			handleToSearchPageFun: function() {
				if (!this.handleGetUserLoginStatusFun()) {
					app.globalData.login();
					return false;
				}

				if (app.globalData.checkHasAuth()) {
					uni.navigateTo({
						url: '/pages/searchResult/searchResult'
					});
				}
			},

			/**
			 * @name 关闭用户选择弹层
			 */
			handleCloseUserDialogFun() {
				this.showDialog = false
			},

			/**
			 * @name 发起用户切换
			 */
			handleLaunchUserSwitchFun() {
				if (!this.handleGetUserLoginStatusFun()) {
					return void app.globalData.login();
				}

				this.showDialog = true
			},

			/**
			 * 
			 * @name 切换用户
			 */
			switchUser: function(item, index) {
				// item.authStauts(企业认证状态) -> 1:已认证 2:认证中 3:已拒绝 4:未认证
				// item.auth(个人认证状态) -> 1:认证 2:未认证
				
				const name = item.companyId ? item.companyName : item.name;
				this.userName = name ? name : '未认证用户'
				this.showDialog = false
				this.authType = item.companyId ? 2 : 1
				this.hasAuth = item.companyId && item.authStatus == 1 || !item.companyId && item.auth == 1 ? true : false
				app.globalData.isAuth = item.companyId && item.authStatus == 1 || !item.companyId && item.auth == 1 ? true : false;
				
				// #ifdef  H5
				localStorage.setItem('currentUser', JSON.stringify(item))
				// #endif
				
				// #ifndef  H5
				uni.setStorageSync('currentUser', item);
				// #endif
				
				this.getContractCountFun();
			},

			/**
			 * @name 跳转创建企业
			 */
			handleCreateCompanyFun: function() {
				if (!this.handleGetUserLoginStatusFun()) {
					app.globalData.login();
					return false;
				}

				if (app.globalData.checkHasAuth()) {
					uni.navigateTo({
						url: '/pages/authentication/company/company-create/index'
					});
				}
			},

			/**
			 * @name 查看待自己处理合同
			 */
			handleToViewContractForSelfFun: function() {
				if (!this.handleGetUserLoginStatusFun()) {
					app.globalData.login();
					return false;
				}

				if (app.globalData.checkHasAuth()) {
					uni.navigateTo({
						url: '/pages/contract/contractList/contractList?searchType=2&pageTitle=待自己处理'
					});
				}
			},

			/**
			 * @name 查看待他人处理合同
			 */
			handleToViewContractForOthersFun: function() {
				if (!this.handleGetUserLoginStatusFun()) {
					app.globalData.login();
					return false;
				}

				if (app.globalData.checkHasAuth()) {
					uni.navigateTo({
						url: '/pages/contract/contractList/contractList?searchType=3&pageTitle=待他人处理'
					});
				}
			},

			/**
			 * @name 发起合同签署操作
			 */
			handleLaunchContractFun() {
				// 未登陆直接前往登陆
				if (!this.handleGetUserLoginStatusFun()) {
					app.globalData.login();
					return false;
				}
				
				if (app.globalData.checkHasAuth()) {
					this.$refs.sliderPicker.show();
				}
			},

			/**
			 * @name 上滑菜单操作
			 */
			handleSliderOperateFun(e) {
				switch (Number(e.detail)) {
					case 0:
					// #ifdef  MP-WEIXIN
					this.handleLaunchByfileFun();
					// #endif
					
					// #ifdef  MP-ALIPAY
					uni.navigateTo({
						url: '/pages/contract/contractSelect/contractSelect'
					})
					// #endif
					
					// #ifdef  H5
					uni.navigateTo({
						url: '/pages/contract/contractSelect/contractSelect'
					})
					// #endif
						break;

					case 1:
						this.handleLaunchByTemplateFun();
						break;

					default:
						break;
				}

				this.$refs.sliderPicker.hide();
			},

			/**
			 * @name 通过文件上传发起合同
			 */
			handleLaunchByfileFun() {
				uni.chooseMessageFile({
					count: 1,
					type: 'file',
					success: res => {
						const uploadFileName = res.tempFiles[0].name;
						const newfilename = res.tempFiles[0].name + ""; // 校验文件格式

						if (newfilename.indexOf(".pdf") == -1 && newfilename.indexOf(".doc") == -1) {
							setTimeout(() => {
								uni.showToast({
									title: '文件格式必须为.pdf或.doc',
									icon: "none",
									duration: 2000,
									mask: true
								});
							}, 50);
							return false;
						} // 校验文件大小


						if (res.tempFiles[0].size > 5242880) {
							setTimeout(() => {
								uni.showToast({
									title: '文件大小不能超过5MB',
									icon: "none",
									duration: 2000,
									mask: true
								});
							}, 50);
							return false;
						}

						upload({
							url: get_contract_uploadFile,
							//url
							filePath: res.tempFiles[0].path,
							// filePath
							key: 'file',
							//filename
							success: res => {
								uni.navigateTo({
									url: '/pages/contract/sign/launchSign/launchSign?fileName=' + uploadFileName + '&url=' + res.url +
										'&coverUrl=' + res.coverUrl + '&backfileName=' + res.fileName
								});
							},
							fail: function(err) {
								setTimeout(() => {
									uni.showToast({
										title: err,
										icon: 'none'
									});
								}, 50);
							}
						});
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

			/**
			 * @name 通过合同模版发起合同
			 */
			handleLaunchByTemplateFun() {
				console.log(77777)
				uni.navigateTo({
					url: '/pages/template/contractTemplate/contractTemplate'
				});
			},

			/**
			 * @name 获取合同信息
			 */
			getContractCountFun() {
				get({
					url: update_count,
					success: data => {
						this.otherSignCount =  data == 'undefined' ? 0 : data.otherContractCount
						this.mineSignCount = data == 'undefined' ? 0 : data.myContractCount
					},
					fail: err => {
						console.log(err)
					}
				});
			},

			/**
			 * 进行实名认证
			 */
			authAction: function() {

				// #ifdef H5
				const company_id = JSON.parse(localStorage.getItem('currentUser')).companyId;
				// #endif

				// #ifndef H5
				const company_id = uni.getStorageSync('currentUser').companyId;
				// #endif

				if (company_id == undefined) {
					uni.navigateTo({
						url: "/pages/authentication/personal/personal-auth-type/index"
					});
				} else {
					uni.navigateTo({
						url: "/pages/authentication/company/company-auth-type/index"
					});
				}
			},

			/**
			 * @name 获取用户登陆状态
			 */
			handleGetUserLoginStatusFun() {
				return app.globalData.isLoginIn();
			}

		}
	};
</script>
<style>
	@import "./home.css";
</style>
