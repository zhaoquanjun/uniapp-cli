<script>
import { get, post } from './api/request.js'
import { get_user_info, upload_local } from './api/account.js'
import { get_pay_url } from './api/cost.js'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      userToken: (state) => state.userToken,
      hasShowOverdueModal: (state) => state.hasShowOverdueModal,
    }),
    ...mapGetters(['hasLogin']),
  },
  //当小程序启动，或从后台进入前台显示，会触发 onShow
  onShow: function(options) {
    //由于onShow中会调用getApp，但是这时候app还未加载成功
    this.$store.commit('loadUserInfo')
  },
  //当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
  onError: function(msg) {
    console.log(msg)
  },
  methods: {
    // 重新设置过期弹窗的默认显示隐藏值
    resetOverdueModalValueFunc(value) {
      // #ifdef  H5
      this.$store.dispatch('resetOverdueModalValue', value)
      // #endif

      // #ifndef  H5
      this.$vm.$store.dispatch('resetOverdueModalValue', value)
      // #endif
      
    },
    // 推出登录
    quitLoginFunc() {
      // #ifdef  H5
      this.$store.dispatch('quitLogin')
      // #endif

      // #ifndef  H5
      this.$vm.$store.dispatch('quitLogin')
      // #endif
      
    },
    // 更新用户信息
    updateUserInfoFunc(callback) {
      // #ifdef  H5
      this.$store.dispatch('updateUserInfo', callback)
      // #endif

      // #ifndef  H5
      this.$vm.$store.dispatch('updateUserInfo', callback)
      // #endif
      
    },
  },
}
</script>

<style>
@import '@/font/iconfont.css';
</style>
