<template>
<view>
<!--pages/pm/stamp/addCachet/addCachet.wxml-->

<view v-for="(data, index) in dataMap" :key="index" class="input-view" :data-index="index">
  <text class="title">{{data.title}}</text>
  <input class="input" :data-index="index" @input="bindKeyInput" :placeholder="data.placeholder" auto-focus></input>
</view>

<text class="stamp-title">印章颜色</text>


<view class="color-view">
       <view v-for="(colorData, index) in colors" :key="index" :data-index="index" class="color" :style="'border:' + (selectIndex==index?'3rpx '+colorData.rgb+' solid':'')" @tap.stop="chooseColor">
           <view class="color-content" :style="'background-color:' + colorData.rgb"></view> 
       </view>
</view>


 <button class="submit global-yellow-color" @tap.stop="createCachet">创建</button>
</view>
</template>

<script>
import { post } from '@api/request.js'
import { create_company_cachet_url } from '@api/seal.js'

export default {
  data() {
    return {
      cachetColor: '',
      topText: '',
      centerText: '',
      belowText: '',
      dataMap: [{
        title: '企业名称',
        placeholder: '请输入企业名称'
      }, {
        title: '中联',
        placeholder: '请输入中联'
      }, {
        title: '下联',
        placeholder: '请输入下联'
      }],
      colors: [{
        color: '255,0,0',
        rgb: '#FF0000'
      }, {
        color: '0,0,0',
        rgb: '#000'
      }, {
        color: '0,122,255',
        rgb: '#007AFF'
      }],
      selectIndex: 0
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  onShareAppMessage() {},

  methods: {
    chooseColor: function (e) {
      var index = e.currentTarget.dataset.index;
      var colorData = this.colors[index];
      this.cachetColor = colorData.color
      this.selectIndex = index
    },
    bindKeyInput: function (e) {
      var index = e.currentTarget.dataset.index;

      if (index == 0) {
        this.topText = e.detail.value
      } else if (index == 1) {
        this.centerText = e.detail.value
      } else {
        this.belowText = e.detail.value
      }
    },
    createCachet: function () {
      var topText = this.topText;
      var centerText = this.centerText;
      var belowText = this.belowText;

      if (topText.length == 0 || centerText.length == 0 || belowText.length == 0) {
        setTimeout(() => {
          uni.showToast({
            icon: 'none',
            title: '请先完善印章信息'
          });
        }, 50);
        return;
      }

      var colors = this.cachetColor.split(',');
      uni.showLoading({
        title: '绘制中'
      });
      post({
        url: create_company_cachet_url,
        params: {
          head: this.topText,
          center: this.centerText,
          foot: this.belowText,
          red: colors[0],
          green: colors[1],
          blue: colors[2]
        },
        success: function (data) {
          uni.hideLoading();
          uni.navigateBack({
            delta: getCurrentPages.length - 1
          });
        },

        fail(msg) {
          uni.hideLoading();
          setTimeout(() => {
            uni.showToast({
              icon: 'none',
              title: msg
            });
          }, 50);
        }

      });
    }
  }
};
</script>
<style>
@import "./addCachet.css";
</style>
