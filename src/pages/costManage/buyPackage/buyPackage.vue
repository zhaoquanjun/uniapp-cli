<template>
	<view class="buy-card--page">
		<view class="buy-amount--section">
			<view class="amount-list">
				<view class="list-area">
					<view :class="'list-item ' + (rechargeValue == item.price ? 'active' : '')" v-for="(item, index) in packages" :key="index"
					 @tap="_handleSelectValue(item)">
						<view class="item-title">
							<view class="item-desc">{{ item.amount }}份合同（{{ item.setMealLife }}年有效期）</view>
							<view class="youhui" v-if="item.remark">{{item.remark}}</view>
						</view>
						<view class="item-value">
							<view class="cur-value">
								<text class="prefix">¥ </text> {{item.price}}
							</view>
							<view class="origin-value" v-if="item.originPrice">
								<text class="prefix">¥ </text> {{item.originPrice}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="title">支付方式</view>
		<view class="way-select--area">
			<view class="pay-way">
				<checkbox-group @change="handleChangeSelectStatus">
					<view class="card way">
						<label class="flex-box">
							<view class="item-l">
								<image class="card" src="http://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/shanqian_card.png"
								 mode="aspectFit"></image>
								<text class="name">礼品卡</text>
								<text class="amount">（¥{{accountInfo.card}}）</text>
							</view>
							<view class="item-r">
								<text class="amount" v-if="checkedStatus.card">支付 {{payInfo.card}}元</text>
								<checkbox value="card" color="#ed6c00" :checked="checkedStatus.card" />
							</view>
						</label>
					</view>
					<view class="account way">
						<label class="flex-box">
							<view class="item-l">
								<image src="http://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/shanqian_icon.png" mode="aspectFit"
								 alt="" />
								<text class="name">账户余额</text>
								<text class="amount">（¥{{accountInfo.account}}）</text>
							</view>
							<view class="item-r">
								<text class="amount" v-if="checkedStatus.account">支付 {{payInfo.account}}元</text>
								<checkbox value="account" color="#ed6c00" :checked="checkedStatus.account" />
							</view>
						</label>
					</view>
					<view class="third way">
						<label class="flex-box">
							<view class="item-l">
								<!-- #ifdef MP-WEIXIN -->
								<image class="wx" src="http://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/wx_icon.png" mode="aspectFit"></image>
								<text class="name">微信支付</text>
								<!-- #endif -->
								<!-- #ifdef MP-ALIPAY -->
								<image class="wx" src="http://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/zfb_icon.png" mode="aspectFit"></image>
								<text class="name">支付宝支付</text>
								<!-- #endif -->
							</view>
							<view class="item-r">
								<text class="amount" v-if="checkedStatus.third">支付 {{payInfo.third}}元</text>
								<checkbox value="third" color="#ed6c00" :checked="checkedStatus.third" />
							</view>
						</label>
					</view>
				</checkbox-group>
			</view>
		</view>
		<view :class="'confirm-btn ' + (!canNext ? 'not-allowed' : '')" @tap="_handleConfirmBuy">确认购买</view>
	</view>
</template>

<script>
	import {
		get,
		postBody
	} from '@api/request'
	import {
		get_account_and_card_info,
		get_package_list,
		buy_package,
		get_wx_pay_params,
		get_zfb_pay_params
	} from '@api/cost.js'

	const app = getApp()

	export default {
		data() {
			return {
				packages: [],
				accountInfo: {
					card: 0,
					account: 0
				},
				payInfo: {
					card: 0,
					account: 0,
					third: 0
				},
				checkedStatus: {
					card: true,
					account: true,
					third: false
				},
				packageId: '',
				selectWays: ['card', 'account'],
				activeIndex: 0,
				rechargeValue: 100, // 实时金额
				total: Number(100).toFixed(2), // 总额
				canNext: false
			}
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this._getPackagesList()
		},
		methods: {
			/**
			 * @name 能否购买
			 */
			_setCanNextValue() {
				let value = false
				if (this.total == 0 || Number(this.payInfo.card) + Number(this.payInfo.account) + Number(this.payInfo
						.third) < Number(this.rechargeValue)) {
					value = false
				} else {
					value = true
				}
				this.canNext = value
			},
			/**
			 * @name 获取账户余额以及礼品卡余额
			 */
			_getAccountAndCardInfo() {
				get({
					url: get_account_and_card_info,
					success: res => {
						let pay = {
							card: 0,
							account: 0,
							third: 0
						}
						if (res.couponBalance && Number(res.couponBalance) > 0) {
							pay.card = Number(res.couponBalance) > Number(this.rechargeValue) ? Number(this.rechargeValue) : Number(res.couponBalance)
						}
						if (!res.couponBalance && Number(res.expenseBalance) > 0) {
							pay.account = Number(res.expenseBalance) > Number(this.rechargeValue) ? Number(this.rechargeValue) : Number(res.expenseBalance)
						}
						this.accountInfo = {
								card: Number((res.couponBalance / 100).toFixed(2)),
								account: Number((res.expenseBalance / 100).toFixed(2))
							}
							this.payInfo = pay
						this._setCanNextValue()
					},
					fail: err => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err
							})
						}, 50)
					}
				})
			},
			/**
			 * @name 获取套餐列表
			 */
			_getPackagesList() {
				get({
					url: get_package_list,
					success: res => {
						res = res.filter(item => {
							return item.price / 100 <= 1000
						})
						res.map(it => {
							if (it.price) it.price = Number((it.price / 100).toFixed(2))
							if (it.originPrice) it.originPrice = Number((it.originPrice / 100).toFixed(2))
						})
						this.packages = res
						this.rechargeValue = Number(res[0].price.toFixed(2))
						this.total = Number(res[0].price.toFixed(2))
						this.packageId = res[0].id
						this._getAccountAndCardInfo()
					},
					fail: err => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err
							})
						}, 50)
					}
				})
			},
			/**
			 * @name 选择支付方式
			 */
			handleChangeSelectStatus(value) {
				this.selectWays = value.detail.value
				this._setCheckedStatus()
				this._setPaymentAmount()
			},
			/**
			 * @name 选择充值金额
			 */
			_handleSelectValue(item) {
				this.rechargeValue = Number(item.price)
				this.total = Number(item.price)
				this.packageId = item.id
				this._setPaymentAmount()
			},
			/**
			 * @name 设置选中状态
			 */
			_setCheckedStatus() {
				let o = JSON.parse(JSON.stringify(this.checkedStatus))
				o.card = this.selectWays.some(item => {
					return item == 'card'
				}) ? true : false
				o.account = this.selectWays.some(item => {
					return item == 'account'
				}) ? true : false
				o.third = this.selectWays.some(item => {
					return item == 'third'
				}) ? true : false

				this.checkedStatus = o
			},
			/**
			 * @name 设置支付金额
			 */
			_setPaymentAmount() {
				let o = {
					card: 0,
					account: 0,
					third: 0
				}
				// 选中礼品卡
				if (this.selectWays.some(item => {
						return item == 'card'
					})) {
					if (Number(this.accountInfo.card) > Number(this.rechargeValue)) {
						o.card = Number(this.rechargeValue)
					} else {
						o.card = Number(this.accountInfo.card)
					}
				}
				// 选中账户余额
				if (this.selectWays.some(item => {
						return item == 'account'
					})) {
					if (this.selectWays.some(item => {
							return item == 'card'
						})) {
						if (Number(this.rechargeValue) > Number(this.accountInfo.card)) {
							o.account = Number(this.rechargeValue) - Number(this.accountInfo.card) > Number(this.accountInfo.account) ?
								Number(this.accountInfo.account) : Number((Number(this.rechargeValue) - Number(this.accountInfo.card)).toFixed(2))
						}
					} else {
						o.account = Number(this.accountInfo.account) > Number(this.rechargeValue) ? Number(this.rechargeValue) :
							Number(this.accountInfo.account)
					}
				}
				// 选中第三方支付
				if (this.selectWays.some(item => {
						return item == 'third'
					})) {
					o.third = this.rechargeValue
					if (this.selectWays.some(item => {
							return item == 'card'
						})) {
						if (Number(this.accountInfo.card) >= Number(this.rechargeValue)) {
							o.third = 0
						} else {
							o.third = Number((Number(this.rechargeValue) - Number(this.accountInfo.card)).toFixed(2))
						}
					}
					if (this.selectWays.some(item => {
							return item == 'account'
						})) {
						if (Number(o.third) - Number(this.accountInfo.account) > 0) {
							o.third = Number((Number(o.third) - Number(this.accountInfo.account)).toFixed(2))
						} else {
							o.third = 0
						}
					}
				}
				this.payInfo = o
				this._setCanNextValue()
			},
			/**
			 * @name 确认购买
			 */
			_handleConfirmBuy() {
				if (!this.canNext) return
				uni.showLoading({
					title: '支付中',
				})
				if (this.selectWays.some(item => {
						return item == 'third'
					}) && Number(this.payInfo.third) > 0) {

					// #ifdef MP-WEIXIN
					this._getWxPayParams()
					// #endif

					// #ifdef  MP-ALIPAY
					this._getZfbPayParams()
					// #endif
					
					// #ifdef  H5
					app.globalData.getH5PayUrl({
						value: this.total,
						desc: '购买礼品卡',
						rechargeType: 1,
						origin: 1
					});
					// #endif

				} else {
					this._accountPayForPackage()
				}
			},
			/**
			 * @name 账户购买
			 */
			_accountPayForPackage() {
				let options = {
					accountPay: this.selectWays.some(item => {
						return item == 'card'
					}),
					contractSetMealId: this.packageId,
					couponPay: this.selectWays.some(item => {
						return item == 'account'
					}),
					thirdPay: this.selectWays.some(item => {
						return item == 'third'
					})
				}
				postBody({
					url: buy_package,
					params: options,
					success: () => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: '套餐购买成功，可返回费用管理查看',
							})
						}, 50)
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/costManage/costManage',
							})
						}, 2000)
					},
					fail: err => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err,
							})
						}, 50)
					}
				})
			},
			/**
			 * @name 创建订单获取微信支付参数
			 */
			_getWxPayParams() {
				uni.showLoading({
					title: '创建订单中',
				})
				get({
					url: get_wx_pay_params + '?amount=' + this.total + '&body=购买套餐&rechargeType=1',
					success: res => {
						console.log(res)
						this._payByWx(res)
					},
					fail: err => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err,
							})
						}, 50)
					},
					complete: () => {
						uni.hideLoading()
					}
				})
			},
			/**
			 * @name 创建订单获取支付宝支付参数
			 */
			_getZfbPayParams() {
				uni.showLoading({
					title: '创建订单中'
				});
				get({
					url: get_zfb_pay_params,
					params: {
						amount: this.total,
						body: '购买套餐',
						rechargeType: 3,
						authCode: app.globalData.authCode
					},
					success: res => {
						this._payByZfb(res);
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
			_payByWx(data) {
				if (this.rechargeValue) {
					uni.requestPayment({
						'timeStamp': data.timeStamp,
						'nonceStr': data.nonceStr,
						'package': data.package,
						'signType': data.signType,
						'paySign': data.paySign,
						'success': () => {
							this._accountPayForPackage()
						},
						'fail': err => {
							uni.showToast({
								icon: 'none',
								title: err,
							})
						},
						'complete': () => {}
					})
				}
			},
			/**
			 * @name 支付宝支付
			 * @param {Object} data 订单号
			 */
			_payByZfb(data) {
				if (this.rechargeValue) {
					my.tradePay({
						tradeNO: data,
						success: () => {
							this._accountPayForPackage()
						},
						fail: err => {
							uni.showToast({
								icon: 'none',
								title: err,
							})
						},
					});
				}
			}
		}

	}
</script>

<style>
	@import './buyPackage.css';
</style>
