<template>
<view class="give-settings">
	<view class="header">
		<view class="border"></view>
		<view class="title">礼品卡信息</view>
	</view>
	<view class="card-detail settings-section">
		<view class="item">
			<view class="label">卡片类型</view>
			<view class="value">{{cardType == 1 ? "无限使用卡" : cardType == 2 ? "闪签充值卡" : cardType == 3 ? "法律服务卡" : ""}}</view>
		</view>
		<view class="item">
			<view class="label">卡片余额</view>
			<view class="value">¥{{balance}}</view>
		</view>
		<view class="item">
			<view class="label">有效期至</view>
			<view class="value">{{time}}</view>
		</view>
	</view>
	<view class="settings-area settings-section">
		<view class="item">
			<view class="label">赠送金额</view>
			<view class="value">
				<input placeholder="请输入整数金额" type="number" v-model="money" />
				<view class="prefix">元</view>
			</view>
		</view>
		<view class="item">
			<view class="label">赠送个数</view>
			<view class="value">
				<view class="count-area">
					<input placeholder="请输入礼品卡个数" type="number" v-model="count" @blur="handleBlurCountFun" />
					<view class="prefix">个</view>
				</view>
			</view>
		</view>
		<view class="item">
			<view class="label">赠送总金额</view>
			<view class="value">¥{{total}}元</view>
		</view>
	</view>
	<view class="confirm-btn" @tap="handleConfirmSendFun">赠送</view>
</view>
</template>

<script>

export default {
  data() {
    return {
      origin: 'card',
      id: '',
      balance: 0,
      // 卡片余额
      cardType: 1,
      // 卡片类型
      time: '',
      // 有效期
      count: 1,
      // 个数
      money: 0 //

    };
  },
  onLoad: function (options) {
    if (options.origin) {
      this.origin = options.origin
    }

    if (options.id) {
      this.id = options.id
    }

    if (options.balance) {
      this.balance = options.balance
    }

    if (options.type) {
      this.cardType = options.type
    }

    if (options.time) {
      this.time = options.time
    }
  },
  onShareAppMessage: function () {},
  computed: {
    total() {
      return this.money ? (this.money * value).toFixed(2) : '0.00'
    }
  },
  methods: {

    /**
     * @name 输入数量失去焦点
     */
    handleBlurCountFun() {
      if (this.count > 500) this.count = 500;
    },

    /**
     * @name 赠送
     */
    handleConfirmSendFun() {
      if (Number(this.total) > Number(this.balance)) {
        setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '赠送金额不能超过卡余额'
          });
        }, 50);
        return false;
      }

      if (this.money < 10) {
        setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '不能赠送小于10元的礼品卡'
          });
        }, 50);
        return false;
      }

      uni.navigateTo({
        url: `/pages/costManage/giveWay/giveWay?id=${this.id}&money=${this.money}&count=${this.count}`
      });
    },

    /**
     * @name 格式化时间
     * @params {num} 0:y-m-d 1:y-m-d-h-m-s
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
        return y + "年" + m + "月" + d + "日";
      } else {
        return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
      }
    }

  }
};
</script>
<style>
@import "./giveSettings.css";
</style>
