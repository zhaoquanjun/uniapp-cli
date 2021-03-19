<template>
<view class="page">
    <view class="fadeIn">
        <view class="weui-half-screen-dialog">
            <view class="weui-half-screen-dialog__bd">
                <view v-for="(item, index) in menuList" :key="index" class="meun-list__item" :data-item="item" :data-type="item.type" @tap.stop="openMenu">
                  <image :src="item.imgUrl" mode="aspectFit"></image>
                  <text>{{item.name}}</text>
                </view>
            </view>
        </view>
    </view>
</view>
</template>

<script>

export default {
  data() {
    return {
      dialog1: false,
      menuList: [{
        type: 'image',
        imgUrl: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/image.png',
        id: '1',
        name: '图片存证'
      }, {
        type: 'text',
        imgUrl: "/static/resource/image/evidenceManage/text.png",
        id: '5',
        name: '文件存证'
      }, {
        type: 'voice',
        imgUrl: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/voice.png',
        id: '3',
        name: '语音存证'
      }, {
        type: 'video',
        imgUrl: 'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/video.png',
        id: '4',
        name: '视频存证'
      }]
    };
  },

  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isShow: {
      handler: function (newVal, oldVal) {
        console.log(newVal, oldVal);
        if (newVal !== oldVal) {
          this.dialog1 = newVal
        }
      },
      immediate: true
    }
  },
  methods: {
    close: function () {
      this.dialog1 = false
    },

    open1() {
      this.dialog1 = true
      this.$emit('isShowChange', {
        detail: this.data.dialog1
      });
    },

    openMenu(e) {
      var type = e.currentTarget.dataset.type; // 视频

      console.log(type);

      if (type == 'video') {
        uni.navigateTo({
          url: '/pages/evidence/videoRecord/videoRecord?type=' + type
        });
      } else {
        uni.navigateTo({
          url: '/evidence/addCertificate/addCertificate?type=' + type
        });
      }
    }

  }
};
</script>
<style>
@import "./home-half-screen-dialog .css";
</style>
