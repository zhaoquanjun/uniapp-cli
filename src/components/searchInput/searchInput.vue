<template>
<!--components/searchInput/searchInput.wxml-->
<view class="search-input-box">
  <view class="search-input" :style="'margin-right:' + (isShowCancel ? '100rpx' : '0rpx')">
    <image @tap="searchClicked" class="icon-search" src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/component/search_icon.png"></image>
    <view>
      <input placeholder-style="color:#B2B2B2" placeholder="请输入搜索内容" @input="inputChanged" :disabled="isDisableInput" :focus="isAutoFocus" :value="inputValue"></input>
    </view>
  </view>
  <view class="cancel-button" :hidden="!(isShowCancel && inputValue)" @tap="cancelClicked">取消</view>
</view>
</template>

<script>

export default {
  data() {
    return {
      inputValue: ''
    };
  },

  components: {},
  props: {
    isShowCancel: {
      type: Boolean,
      default: false
    },
    isAutoFocus: {
      type: Boolean,
      default: false
    },
    isDisableInput: {
      type: Boolean,
      default: false
    },
    timeSearch: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    searchClicked: function () {
      this.$emit('searchClicked', {
        detail: this.data.inputValue
      });
    },
    inputChanged: function (e) {
      var text = e.detail.value;
      this.inputValue = text

      if (this.timeSearch) {
        this.$emit('inputChanged', {
          detail: text
        });
      }
    },
    cancelClicked: function (e) {
      this.inputValue = ''
      this.searchClicked();
      this.$emit('cancelClicked');
    }
  }
};
</script>
<style>
@import "./searchInput.css";
</style>
