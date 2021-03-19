<template>
<view :class="'slider-picker--area ' + (wrapperShow ? 'wrapper-show' : '')">
  <view class="mask" @tap="hide"></view>
  <view :class="'slider-box ' + (contentShow ? 'content-show' : '')">
    <view v-for="(item, index) in sliderList" :key="index" :class="'slider-item ' + (index == sliderList.length - 1 ? 'bor' : '')" @tap="handleSelectSliderValueFun" :data-value="item.value" :data-index="index">{{item.label}}</view>
		<view class="cancel" @tap="hide">取消</view>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {
      wrapperShow: false,
      contentShow: false
    };
  },

  components: {},
  props: {
    sliderList: {
      type: Array,
      default: []
    }
  },
  methods: {
    show() {
      this.wrapperShow = true
      setTimeout(() => {
        this.contentShow =true
      }, 200);
    },

    hide() {
      this.contentShow = false
      setTimeout(() => {
        this.wrapperShow = false
      }, 200);
    },

    handleSelectSliderValueFun(e) {
      let value = e.currentTarget.dataset.index;
      this.$emit('selectWay', {
        detail: value
      });
    }

  }
};
</script>
<style>
@import "./mpSliderPicker.css";
</style>
