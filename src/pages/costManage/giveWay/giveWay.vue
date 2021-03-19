<template>
<view class="give-way--page">
	<view class="way-list">
		<view v-for="(item, index) in ways" :key="index" class="list-item" @tap="handleSelectShareWayFun(item)">
			<view class="l-part">
				<view class="icon">
					<image :src="item.icon"></image>
				</view>
				<view class="desc">{{item.label}}</view>
			</view>
			<view class="r-part one one-apparrow-right"></view>
			<button open-type="share" class="share-btn" v-if="index == 0">分享</button>
		</view>
	</view>
</view>
</template>

<script>
import { get, postBody } from '@api/request.js'
import { share_card, cancel_hare_card } from '@api/cost.js'

export default {
  data() {
    return {
			ways: [
				// #ifdef  MP-WEIXIN
				{
			  icon: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/friends.png',
			  label: '微信好友',
			  type: 1
			}, 
			// #endif
			
			// #ifdef  MP-ALIPAY
			{
			  icon: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/zfb_icon.png',
			  label: '支付宝好友',
			  type: 1
			},
			// #endif
			{
			  icon: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/shanqian_icon.png',
			  label: '闪签用户',
			  type: 2
			}],
      origin: 'card',
      id: '',
      wxShareId: '',
      money: 0,
      // 单个价格
      count: 0,
      // 个数
      shareIcon: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/cost/share_icon.png',
      isWxShare: false
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    if (options.origin) {
      this.origin = options.origin
    }

    if (options.id) {
      this.id = options.id
    }

    if (options.money) {
      this.money = options.money
    }

    if (options.count) {
      this.count = options.count
    }

    this.shareCardFun();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('show');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('hide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (!this.isWxShare) {
      this.cancelShareFun();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
		// #ifdef  MP-WEIXIN
		let shareSettings = {
			title: `${this.money}元礼品卡，点击即可领取`,
			path: `/pages/costManage/receiveCard/receiveCard?gifCardId=${this.wxShareId}`,
			imageUrl: this.shareIcon, // 分享封面图
		  success: res => {
		    console.error('分享成功', res);
		    setTimeout(() => {
		      uni.showToast({
		        icon: 'none',
		        title: '分享成功'
		      });
		    }, 50);
		  },
		  fail: error => {
		    console.error('分享失败', error);
		    setTimeout(() => {
		      uni.showToast({
		        icon: 'none',
		        title: '分享失败'
		      });
		    }, 50);
		    this.cancelShareFun();
		  }
		};
		console.log(shareSettings, 9999)
		return shareSettings
		// #endif
		
		// #ifdef  MP-ALIPAY
		return {
			title: `${this.money}元礼品卡，点击即可领取`,
			path: `/pages/costManage/receiveCard/receiveCard?gifCardId=${this.wxShareId}`,
			imageUrl: this.shareIcon, // 分享封面图
		  success: res => {
		    console.error('分享成功', res);
		    setTimeout(() => {
		      uni.showToast({
		        icon: 'none',
		        title: '分享成功'
		      });
		    }, 50);
		  },
		  fail: error => {
		    console.error('分享失败', error);
		    setTimeout(() => {
		      uni.showToast({
		        icon: 'none',
		        title: '分享失败'
		      });
		    }, 50);
		    this.cancelShareFun();
		  }
		};
		// #endif
		
    
  },
  methods: {
    handleSelectShareWayFun(item) {
      // 1:好友 2:闪签用户 
      switch (Number(item.type)) {
        case 1:
          console.log('分享到好友');
          this.isWxShare = true
          break;

        case 2:
          this.cancelShareFun(() => {
            uni.navigateTo({
              url: '/pages/costManage/giving/giving?origin=' + this.origin + '&id=' + this.id + '&money=' + this.money
            });
          });
          break;

        default:
          break;
      }
    },

    /**
     * @name 获取分享id
     */
    shareCardFun() {
      uni.showLoading({
        icon: 'none',
        title: '加载中'
      });
      let options = {
        shareId: this.id,
        mode: this.origin == 'give' ? 'buy' : 'rechargeCard',
        shareNum: this.count,
        shareMoney: this.money
      };
      postBody({
        url: share_card,
        params: options,
        success: res => {
          console.log(res);
          this.wxShareId = res
        },
        fail: err => {
          console.log(err);
        },
        complete: () => {
          console.log('完成了');
          uni.hideLoading();
        }
      });
    },

    /**
     * @name 取消分享
     */
    cancelShareFun(callback) {
      get({
        url: cancel_hare_card + this.wxShareId,
        success: res => {
          console.log(res);
        },
        fail: err => {
          console.log(err);
        },
        complete: () => {
          console.log('complete');
        }
      });
      typeof callback == 'function' && callback();
    }

  }
};
</script>
<style>
@import "./giveWay.css";
</style>
