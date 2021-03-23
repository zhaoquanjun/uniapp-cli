<template>
  <view class="dialog-section">
    <image
      src="https://shouyiner-prod.oss-cn-beijing.aliyuncs.com/wxapp/shanqian/component/newadd.png"
      class="add-btn"
      @tap.stop="open"
    ></image>
    <view class="fadeIn" v-if="wrapperShow">
      <view class="mask" @tap="close"></view>
      <view :class="'dialog-content ' + (contentShow ? 'show' : '')">
        <view class="list-wrapper">
          <view
            v-for="(item, index) in menuList"
            :key="index"
            class="meun-list__item"
            @tap.stop="openMenu(item)"
          >
            <image :src="item.imgUrl" mode="aspectFit"></image>
            <text>{{ item.name }}</text>
          </view>
        </view>
        <view class="cancel-btn" @tap="close">取消</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      wrapperShow: false,
      contentShow: false,
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
  computed: {
    ...mapGetters(['hasLogin', 'hasAuth']),
    ...mapState({
      currentUser: (state) => state.currentUser,
    }),
  },
  methods: {
    close: function() {
      this.contentShow = false
      setTimeout(() => {
        this.wrapperShow = false
      }, 250)
    },

    open() {
      this.wrapperShow = true
      setTimeout(() => {
        this.contentShow = true
      }, 250)
    },

    openMenu(item) {
      if (!this.hasLogin) {
        return void uni.switchTab({
          url: '/pages/pm/pmHome',
        })
      }

      if (!this.hasAuth && this.currentUser.companyId) {
        uni.showModal({
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
        return false
      }

      if (!this.hasAuth && !this.currentUser.companyId) {
        uni.showModal({
          title: '立即进行个人实名认证',
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
                url: '/pages/authentication/personal/person-auth-type/index',
              })
            }
          },
        })
        return false
      }
      this.close()
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
            url:
              '/pages/evidence/addCertificate/addCertificate?type=' + item.type,
          })
          // #endif

          // #ifdef H5
          uni.navigateTo({
            url:
              '/pages/evidence/addCertificate/addCertificate?type=' + item.type,
          })
          // #endif
        } else {
          uni.navigateTo({
            url:
              '/pages/evidence/addCertificate/addCertificate?type=' + item.type,
          })
        }
      }
    },
  },
}
</script>
<style>
@import './half-screen-dialog.css';
</style>
