<template>
<!--components/slideitem/slideitem.wxml-->
<view class="slide-item" :style="'height: ' + cellHeight" :data-row="row">
  <view class="item-inner item-content clearfix" @touchstart="disabled == 'false' ? 'touchS' : ''" @touchmove="disabled == 'false' ? 'touchM' : ''" @touchend="disabled == 'false' ? 'touchE' : ''" :style="slideStyle + ';background-color: ' + itemColor" @tap.stop="selectAction">
    <!-- 这里是组件的内部节点 -->
    <slot></slot>
  </view>
  <view class="item-inner del" :style="'line-height: ' + cellHeight" :data-indexpath="section + '-' + row" @tap="delItem">删除</view>
</view>

<!-- wxml内调用方式 
itemColor: cell背景色
deleteItemEvent:绑定删除事件
slideItemEvent:绑定左滑动打开
cellHeight:cell高度

<view wx:for="{{cellDataArray}}" wx:for-item="cellData" wx:key="{{index}}">
  <slideitem id="slideitem-{{index}}" 
           row="{{index}}"
           section="{{自定义section}}"
           itemColor="#fff"
           bind:deleteItemEvent='deleteAction' 
           bind:slideItemEvent='slideAction' 
           cellHeight="80rpx">
      <内部放入自定义视图>
  </slideitem>
</view>
-->
<!-- js文件绑定方法
  deleteAction: function(e){
    //拿到角标
    var row = e.detail.row;
    //删除逻辑
  },
  slideAction: function(e){
    //拿到角标
    var row = e.detail.row;
    //获取角标cell
    var slideSender = this.selectComponent("#slideitem-"+row);
    //在data中定义lastSlideSender 属性,用户记录上一个打开的cell
    var lastSlideSender = this.data.lastSlideSender;
    //如果存在已经打开的cell则关闭
    if (lastSlideSender != null && lastSlideSender != slideSender){
      lastSlideSender.restoreSalid();
    }
    this.setData({
      lastSlideSender: slideSender
    })
  } -->
</template>

<script>

export default {
  data() {
    return {
      slideStyle: "left:0rpx",
      delBtnWidth: 180,
      isOpen: false,
      startX: ""
    };
  },

  components: {},
  props: {
    itemColor: {
      type: String,
      default: '#fff'
    },
    cellHeight: {
      type: String,
      default: '120rpx'
    },
    row: {
      type: Number,
      default: 0
    },
    section: {
      type: Number,
      default: 0
    },
    disabled: {
      type: String,
      default: 'false'
    }
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持

  },
  methods: {
    //------------------左滑删除逻辑-------------------
    touchS: function (e) {
      if (e.touches.length == 1) {
        this.startX = e.touches[0].clientX
      }
    },
    touchM: function (e) {
      if (e.touches.length == 1) {
        //手指移动时水平方向位置
        var moveX = e.touches[0].clientX; //手指起始点位置与移动期间的差值

        var disX = this.startX - moveX;
        var delBtnWidth = this.delBtnWidth;
        var txtStyle = "";

        if (disX == 0 || disX < 0) {
          //如果移动距离小于等于0，文本层位置不变
          txtStyle = "left:0rpx";
        } else if (disX > 0) {
          //移动距离大于0，文本层left值等于手指移动距离
          txtStyle = "left:-" + disX + "rpx";

          if (disX >= delBtnWidth) {
            //控制手指移动距离最大值为删除按钮的宽度
            txtStyle = "left:-" + delBtnWidth + "rpx";
          }
        }

        this.slideStyle = txtStyle
        this.isOpen = txtStyle == "left:0rpx" ? false : true
      }
    },
    touchE: function (e) {
      if (e.changedTouches.length == 1) {
        //手指移动结束后水平位置
        var endX = e.changedTouches[0].clientX; //触摸开始与结束，手指移动的距离

        var disX = this.startX - endX;
        var delBtnWidth = this.delBtnWidth; //如果距离小于删除按钮的1/2，不显示删除按钮

        var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";

        if (txtStyle != "left:0rpx") {
          this.$emit('slideItemEvent', {
            detail: {
              row: this.data.row,
              section: this.data.section
            }
          });
        }
        this.slideStyle = txtStyle
        this.isOpen = txtStyle == "left:0rpx" ? false : true
      }
    },
    //点击删除按钮事件
    delItem: function (e) {
      this.slideStyle = "left:0rpx"
      this.$emit('deleteItemEvent', {
        detail: {
          row: this.data.row,
          section: this.data.section
        }
      });
    },
    restoreSalid: function () {
      this.slideStyle = "left:0rpx"
    },
    selectAction: function () {
      console.log(this.isOpen);

      if (this.isOpen == true) {
        this.restoreSalid();
      } else {
        this.$emit('selectItemEvent', {
          detail: {
            row: this.data.row,
            section: this.data.section
          }
        });
      }
    }
  }
};
</script>
<style>
@import "./slideitem.css";
</style>
