<template>
	<view class="balance-list--page">
		<view class="header-wrapper">
			<view class="header-tab">
				<view v-for="(item, index) in tabs" :key="index" :class="'tab-item ' + ( activeName == item.type ? 'active' : '' )"
				 @tap="handleSwitchTabFun" :data-type="item.type">{{item.name}}</view>
				<view :class="'active-bg ' + (activeName == 2 ? 'second' : activeName == 3 ? 'third' : '')"></view>
			</view>
		</view>
		<view class="content">
			<scroll-view class="scroll-area" scroll-y="true" scroll-anchoring="true" @scrolltolower="handleScrollToBottmFun">
				<view class="pay-list balance-list" v-if="activeName == 1">
					<template v-if="payList.length > 0">
						<view v-for="(item, index) in payList" :key="index" class="list-item">
							<view class="top">
								<view class="name">{{item.consumptionTypeText}}</view>
								<view class="money">- {{item.consumptionMoney}}</view>
							</view>
							<view class="bot">
								<view class="time">支出时间：{{item.consumptionTime}}</view>
								<view class="type">{{item.deductionName}}</view>
							</view>
						</view>
					</template>
					<view class="empty-tips" v-else>暂无数据</view>
				</view>
				<view class="income-list balance-list" v-if="activeName == 2">
					<template v-if="incomeList.length > 0">
						<view v-for="(item, index) in incomeList" :key="index" class="list-item">
							<view class="top">
								<view class="name">{{item.consumptionTypeText}}</view>
								<view class="money">+ {{item.consumptionMoney}}</view>
							</view>
							<view class="bot">
								<view class="time">收入时间：{{item.consumptionTime}}</view>
								<view class="type">{{item.deductionName}}</view>
							</view>
						</view>
					</template>
					<view class="empty-tips" v-else>暂无数据</view>
				</view>
				<view class="useful list" v-if="activeName == 3">
					<view class="title-label"><text class="prefix">*</text> 可使用</view>
					<template v-if="useful.length">
						<view v-for="(item, index) in useful" :key="index" :class="'card-item ' + (item.couponType == 1 ? 'vip' : item.couponType == 2 ? 'shanqian' : item.couponType == 3 ? 'lawyer' : '')">
							<view class="header">
								<view class="top">
									<view class="card-type">
										<image :src="item.couponType == 1 ? vipCard : item.couponType == 2 ? shanqianCard : item.couponType == 3 ? lawyerCard : ''"
										 :style="'width: ' + (item.couponType == 1 ? '76rpx' : (item.couponType == 2 || item.couponType == 3) ? '28rpx' : '') + '; height: ' + (item.couponType == 1 ? '36rpx' : (item.couponType == 2 || item.couponType == 3) ? '30rpx' : '')"
										 mode="aspectFit"></image>
										<text class="tit">{{item.couponType == 1 ? "无限使用卡" : item.couponType == 2 ? "闪签充值卡" : item.couponType == 3 ? "法律服务卡" : ""}}</text>
									</view>
									<view class="card-origin">{{item.sourceType == 1 ? "平台赠送" : item.sourceType == 2 ? "好友赠送" : item.sourceType == 3 ? "账户充值" : ""}}</view>
								</view>
								<view class="bot">
									<view class="card-amount">面值：¥ {{item.amount}}元</view>
									<view class="card-time">{{item.invalidTime}} 到期</view>
								</view>
								<image class="bg-iamge" :src="item.couponType == 1 ? vipBg : item.couponType == 2 ? shanqianBg : item.couponType == 3 ? lawyerBg : ''"
								 mode="aspectFit"></image>
							</view>
							<view class="content">
								<view class="detail">
									<view class="balance" v-if="item.couponType != 1">
										<view class="space">余额</view>
										<view class="money">¥ {{item.balance}}</view>
									</view>
									<view class="desc">{{item.couponType == 1 ? '适用于闪签平台全部服务，不可转赠' : item.couponType == 2 ? '适用于闪签平台全部服务、法律咨询服务，可转赠' : item.couponType == 3 ? '适用于法律咨询服务，不可转赠' : ''}}</view>
								</view>
								<view class="btns">
									<view class="view-detail-btn btn" :data-item="item" @tap="handleViewDetailFun">消费明细</view>
									<view class="send-btn btn" :data-item="item" @tap="handleSendFun">
										<image class="icon" :src="sendIcon" mode="aspectFit"></image>
										<text>赠送好友</text>
									</view>
								</view>
							</view>
						</view>
					</template>
					<view class="empty-tips" v-else>暂无数据</view>
				</view>
				<view class="send list" v-if="activeName == 3">
					<view class="title-label"><text class="prefix">*</text> 已使用</view>
					<template v-if="send.length > 0">
						<view v-for="(item, index) in send" :key="index" :class="'card-item ' + (item.couponType == 1 ? 'vip' : item.couponType == 2 ? 'shanqian' : item.couponType == 3 ? 'lawyer' : '')">
							<view :class="'header ' + (item.receive == 1 ? 'overdue' : '')">
								<view class="top">
									<view class="card-type">
										<image :src="(item.receive == 1 && item.couponType == 1) ? vipOverdueCard : (item.receive == 1 && item.couponType == 2) ? shanqianOverdueCard : (item.receive == 1 && item.couponType == 3) ? lawyerOverdueCard : (item.receive == 0 && item.couponType == 1) ? vipCard : (item.receive == 0 && item.couponType == 2) ? shanqianCard : (item.receive == 1 && item.couponType == 3) ? lawyerOverdueCard : ''"
										 :style="'width: ' + (item.couponType == 1 ? '76rpx' : (item.couponType == 2 || item.couponType == 3) ? '28rpx' : '') + '; height: ' + (item.couponType == 1 ? '36rpx' : (item.couponType == 2 || item.couponType == 3) ? '30rpx' : '')"
										 mode="aspectFit"></image>
										<text class="tit">{{item.couponType == 1 ? "无限使用卡" : item.couponType == 2 ? "闪签充值卡" : item.couponType == 3 ? "法律服务卡" : ""}}</text>
									</view>
									<view class="card-origin">{{item.sourceType == 1 ? "平台赠送" : item.sourceType == 2 ? "好友赠送" : item.sourceType == 3 ? "账户充值" : ""}}</view>
								</view>
								<view class="bot">
									<view class="card-amount">面值：¥ {{item.amount}}元</view>
									<view class="card-time">{{item.invalidTime}} 到期</view>
								</view>
								<image class="bg-iamge" :src="item.receive == 1 ? overdueBg : (item.receive == 0 && item.couponType == 1) ? vipBg : (item.receive == 0 && item.couponType == 2) ? shanqianBg : (item.receive == 1 && item.couponType == 3) ? lawyerBg : ''"
								 mode="aspectFit"></image>
							</view>
							<view :class="'content ' + (item.receive == 1 ? 'overdue' : '')">
								<view class="receive-header">
									<image class="receive-icon" :src="receiveIcon" mode="aspectFit"></image>
									<text class="header-tit">领取信息</text>
								</view>
								<view class="receive-details" v-if="item.recipientPhone">
									<view class="details-item" v-if="item.recipientCompanyName">企业名称：<text class="value">{{ item.recipientCompanyName }}</text></view>
									<view class="details-item">领取人手机号：<text class="value">{{ item.recipientPhone }}</text></view>
									<view class="details-item">领取时间：<text class="value">{{ item.recipientTime }}</text></view>
								</view>
								<view class="empty" v-if="!item.recipientPhone">暂无领取信息</view>
								<image class="receive-status" :src="item.receive == 0 ? waitReceiveIcon : item.receive == 1 ? alreadyReceiveIcon : ''"
								 mode="aspectFit" :style="'width: ' + (item.receive == 0 ? '190rpx' : item.receive == 1 ? '190rpx' : '') + '; height: ' + (item.receive == 0 ? '94rpx' : item.receive == 1 ? '190rpx' : '') + '; bottom: ' + (item.receive == 0 ? '82rpx' : item.receive == 1 ? '20rpx' : '')"></image>
							</view>
						</view>
					</template>
					<view class="empty-tips" v-else>暂无数据</view>
				</view>
				<view :class="'loading ' + (isRefresh ? 'show' : '')">加载中...</view>
			</scroll-view>
		</view>
		<view class="btn-groups">
			<view class="recharge btn" @tap="handleReadyToChargeFun">账户充值</view>
			<view class="send btn" @tap="handleReadyToSendFun">赠送好友</view>
		</view>
	</view>
</template>

<script>
	import {
		get
	} from '@api/request.js'
	import {
		get_balance_list,
		get_card_list
	} from '@api/cost.js'

	export default {
		data() {
			return {
				tabs: [{
					name: '支出明细',
					type: 1
				}, {
					name: '收入明细',
					type: 2
				}, {
					name: '礼品卡',
					type: 3
				}],
				activeName: 1,
				payList: [],
				incomeList: [],
				useful: [],
				send: [],
				payTotal: 0,
				incomeTotal: 0,
				usefulTotal: 0,
				sendTotal: 0,
				payPagination: {
					pageIndex: 1,
					pageSize: 10
				},
				incomePagination: {
					pageIndex: 1,
					pageSize: 10
				},
				isRefresh: false,
				origin: '',
				// 礼品卡部分
				vipBg: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/vip_bg.png',
				shanqianBg: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/shanqian_bg.png',
				lawyerBg: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/lawyer_bg.png',
				overdueBg: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/overdue_bg.png',
				vipCard: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/vip_card.png',
				shanqianCard: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/shanqian_card.png',
				lawyerCard: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/lawyer_card.png',
				vipOverdueCard: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/vip_overdue_card.png',
				lawyerOverdueCard: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/lawyer_overdue_card.png',
				shanqianOverdueCard: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/shanqian_overdue_card.png',
				sendIcon: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/send_icon.png',
				receiveIcon: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/receive_icon.png',
				waitReceiveIcon: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/wait_receive_icon.png',
				alreadyReceiveIcon: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/already_receive_icon.png',
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			if (options.type) {
				this.activeName = options.type
			}

			if (options.result) {
				this.origin = options.result
			}

			this.getBalanceListFun();
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
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			if (this.origin) {
				uni.redirectTo({
					url: '/pages/costManage/costManage'
				});
			}
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			if (this.activeName == 1) {
				let paypagination = this.payPagination;
				paypagination.pageIndex = 1;
				this.payPagination = paypagination
				this.getBalanceListFun();
			}

			if (this.activeName == 2) {
				let incomepagination = this.incomePagination;
				incomepagination.pageIndex = 1;
				this.incomePagination = incomepagination
				this.getBalanceListFun();
			}

			if (this.activeName == 3) {
				this.getCardListDataFun(1, 1);
				this.getCardListDataFun(2, 1);
			}

		},

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
			 * @name 获取列表数据
			 */
			getBalanceListFun() {
				let options = {
					consumptionDetailsType: this.activeName,
					pageSize: this.activeName == 1 ? this.payPagination.pageSize : this.incomePagination.pageSize,
					currentPage: this.activeName == 1 ? this.payPagination.pageIndex : this.incomePagination.pageIndex
				};
				uni.showLoading({
					title: '加载中'
				});
				get({
					url: get_balance_list,
					params: options,
					success: res => {
						res.results.forEach(it => {
							it.consumptionTime = this.formatTimeConvertFun(it.consumptionTime, 0);
							it.consumptionMoney = (it.consumptionMoney / 100).toFixed(2);
						});

						if (this.activeName == 1) {
							let arr = [...this.payList, ...res.results];
							this.payList = arr
							this.payTotal = res.total
						}

						if (this.activeName == 2) {
							let arr = [...this.incomeList, ...res.results];
							this.incomeListincomeList = arr
							this.incomeTotal = res.total
						}
					},
					fail: err => {
						console.log(err);
					},
					complete: () => {
						uni.hideLoading();
						if (this.isRefresh) this.isRefresh = false
					}
				});
			},

			/**
			 * @name 触底加载
			 */
			handleScrollToBottmFun() {
				if (!this.isRefresh) {
					if (this.activeName == 1) {
						if (this.payTotal == this.payList.length) return false;
						let pagination = this.payPagination;
						pagination.pageIndex = this.payPagination.pageIndex + 1;
						this.isRefresh = true
						this.payPagination = pagination
						this.getBalanceListFun();
					}

					if (this.activeName == 2) {
						if (this.incomeTotal == this.incomeList.length) return false;
						let pagination = this.incomePagination;
						pagination.pageIndex = this.incomePagination.pageIndex + 1;
						this.isRefresh = true
						this.incomePagination = pagination
						this.getBalanceListFun();
					}

				}
			},
			/**
			 * @name 获取卡片列表数据
			 */
			getCardListDataFun(searchType, pageIndex) {
				uni.showLoading({
					title: '加载中'
				});
				get({
					url: get_card_list + '?searchType=' + searchType + '&currentPage=' + pageIndex + '&pageSize=10000',
					success: res => {
						console.log(res);
						res.results.map(it => {
							it.recipientTime = it.recipientTime ? this.formatTimeConvertFun(it.recipientTime, 0) : '-';
							it.invalidTime = it.invalidTime ? this.formatTimeConvertFun(it.invalidTime, 0) : '-';
							it.balance = (it.balance / 100).toFixed(2);
							it.amount = (it.amount / 100).toFixed(2);
						});

						switch (Number(searchType)) {
							case 1:
								let useful = [...JSON.parse(JSON.stringify(this.useful))];

								if (this.useful.length < res.total) {
									this.useful = [...useful, ...res.results]
									this.usefulTotal = res.total

									if (this.useful.length < this.usefulTotal) {
										this.getCardListDataFun(1, (Number(pageIndex) + 1))
									}
								}
								break;

							case 2:
								let send = [...JSON.parse(JSON.stringify(this.send))];

								if (!this.sendGet || this.send.length < res.total) {
									this.send = [...send, ...res.results]
									this.sendTotal = res.total

									if (this.send.length < this.sendTotal) {
										this.getCardListDataFun(2, (Number(pageIndex) + 1))
									}
								}

								break;

							default:
								break;
						}
					},
					fail: err => {
						console.log(err);
					},
					complete: () => {
						uni.hideLoading();

						if (this.isRefresh) this.isRefresh = false
					}
				});
			},

			/**
			 * @name 切换tab
			 */
			handleSwitchTabFun(e) {
				const type = e.currentTarget.dataset.type;
				this.activeName = type

				switch (type) {
					case 1:
						this.getBalanceListFun();
						break;

					case 2:
						this.getBalanceListFun();
						break;

					case 3:
						this.getCardListDataFun(1, 1);
						this.getCardListDataFun(2, 1);
						break;


					default:
						break;
				}
			},

			/**
			 * @name 充值
			 */
			handleReadyToChargeFun() {
				uni.navigateTo({
					url: '/pages/costManage/recharge/recharge'
				});
			},

			/**
			 * @name 赠送好友
			 */
			handleReadyToSendFun() {
				uni.navigateTo({
					url: '/pages/costManage/buyCard/buyCard' + '?type=1' // 1:赠送 2:购买

				});
			},

			/**
			 * @name 赠送好友
			 */
			handleSendFun(e) {
				const item = e.currentTarget.dataset.item;
				uni.navigateTo({
					url: '/pages/costManage/giveSettings/giveSettings?origin=card&id=' + item.id + '&balance=' + item.balance +
						'&type=' + item.couponType + '&time=' + item.invalidTime
				});
			},

			/**
			 * @name 查看明细
			 */
			handleViewDetailFun(e) {
				const item = e.currentTarget.dataset.item;
				uni.navigateTo({
					url: '/pages/costManage/cardDetail/cardDetail?id=' + item.id
				});
			},

			/**
			 * @name 格式化时间
			 * @params num:0 YYYY-MM-DD
			 * @params num:1  YYYY-MM-DD hh:mm:ss
			 */
			formatTimeConvertFun(timestamp, num) {
				timestamp = timestamp + "";
				timestamp = timestamp.length == 10 ? timestamp * 1000 : timestamp;
				var date = new Date(Number(timestamp));
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? "0" + m : m;
				var d = date.getDate();
				d = d < 10 ? "0" + d : d;
				var h = date.getHours();
				h = h < 10 ? "0" + h : h;
				var minute = date.getMinutes();
				var second = date.getSeconds();
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;

				if (num == 0) {
					return y + "-" + m + "-" + d;
				} else {
					return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
				}
			}

		}
	};
</script>
<style>
	@import "./accountBalance.css";
</style>
