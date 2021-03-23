<template>
<view class="search">
    <image @tap="searchClicked" class="icon-search" src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/component/search_icon.png"></image>
    <input class="search-input" placeholder-style="color:#B2B2B2" placeholder="请输入文件名称" @input="inputChanged" :disabled="isDisableInput" :focus="isAutoFocus" v-model="inputValue" />
		<view class="cancel-button" @tap="cancelClicked" v-if="inputValue.length > 0">
			<text class="iconfont iconbaseline-close-px"></text>
		</view>
		
  </view>
</template>

<script>

export default {
  data() {
    return {
      timer: null,
      inputValue: ''
    };
  },
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
        detail: this.inputValue
      });
    },
    inputChanged(e) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
          if (this.timeSearch) {
            this.$emit('inputChanged', {
              detail: this.inputValue
            });
          }
        }, 300)
      
    },
    cancelClicked(e) {
      this.inputValue = ''
      this.$emit('cancelClicked');
    }
  }
};
</script>
<style>
@import "./search.css";
</style>
