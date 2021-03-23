<template>
  <view class="weui-half-screen-dialog__bd">
    <view class="item-header">
      <view style="display:flex; align-items: center;">
        <view class="label"></view>
        <view class="title">云公证</view>
      </view>
      <view class="checkAll" @tap.stop="skiptoEvidence">查看全部</view>
    </view>
    <view class="item-content">
      <view
        v-for="(item, index) in menuList"
        :key="index"
        class="meun-list__item"
        @tap.stop="openMenu(item)"
      >
        <image class="img" :src="item.imgUrl" mode="aspectFit"></image>
        <text class="words">{{ item.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      dialog1: false,
      menuList: [
        {
          type: 'image',
          imgUrl:
            'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/image.png',
          id: '1',
          name: '图片存证',
        },
        {
          type: 'file',
          imgUrl:
            'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/file.png',
          id: '5',
          name: '文件存证',
        },
        {
          type: 'voice',
          imgUrl:
            'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/voice.png',
          id: '3',
          name: '语音存证',
        },
        {
          type: 'video',
          imgUrl:
            'https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/certificate/video.png',
          id: '4',
          name: '视频存证',
        },
      ],
    }
  },

  components: {},
  props: {},
  computed: {
    ...mapState({
      currentUser: (state) => state.currentUser,
    }),
    ...mapGetters(['hasLogin', 'hasAuth']),
  },
  methods: {
    openMenu(item) {
      if (!this.hasLogin) {
        return void uni.switchTab({
          url: '/pages/pm/pmHome',
        })
      }

      if (!this.hasAuth && this.currentUser.companyId) {
        return void uni.showModal({
          title: '立即进行企业实名认证',
          content: '实名认证后可享受加便捷高效的电子合同服务',
          showCancel: true,
          cancelText: '暂不认证',
          confirmText: '立即认证',
          success: (res) => {
            if (res.cancel) {
              if (getCurrentPages().length > 1) uni.navigateBack()
              uni.hideLoading({})
            } else {
              uni.navigateTo({
                url: '/pages/authentication/company/company-auth-type/index',
              })
            }
          },
        })
      }

      if (!this.hasAuth && !this.currentUser.companyId) {
        uni.showModal({
          title: '立即进行个人实名认证',
          content: '实名认证后可享受加便捷高效的电子合同服务',
          showCancel: true,
          cancelText: '暂不认证',
          confirmText: '立即认证',
          success: res => {
            if (res.cancel) {
              if (getCurrentPages().length > 1) uni.navigateBack()
              uni.hideLoading({})
            } else {
              uni.navigateTo({
                url: '/pages/authentication/personal/person-auth-type/index',
              })
            }
          },
        })
        return false
      }

      if (item.type == 'video') {
        uni.navigateTo({
          url: '/pages/evidence/videoRecord/videoRecord?type=' + item.type,
        })
      } else {
        if (item.type == 'file') {
          // #ifdef MP-ALIPAY
          uni.navigateTo({
            url: '/pages/evidence/fileRecord/fileRecord?type=' + item.type,
          })
          // #endif

          // #ifdef MP-WEIXIN
          uni.navigateTo({
            url: '/pages/evidence/addCertificate/addCertificate?type=' + item.type,
          })
          // #endif

          // #ifdef H5
          uni.navigateTo({
            url: '/pages/evidence/addCertificate/addCertificate?type=' + item.type,
          })
          // #endif

        } else {
          uni.navigateTo({
            url: '/pages/evidence/addCertificate/addCertificate?type=' + item.type,
          })
        }
      }
    },

    skiptoEvidence() {
      uni.navigateTo({
        url: '/pages/evidence/evidenceList/index',
      })
    },
  },
}
</script>
<style>
@import './home-add-dataStorge.css';
</style>
