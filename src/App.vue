<script>
import { get, post } from './api/request.js'
import { get_user_info, upload_local } from './api/account.js'

import { get_pay_url } from './api/cost.js'

export default {
  //当小程序启动，或从后台进入前台显示，会触发 onShow
  onShow: function(options) {
    //由于onShow中会调用getApp，但是这时候app还未加载成功
    this.globalData.loadUserInfo()
  },
  //当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
  onError: function(msg) {
    console.log(msg)
  },
  globalData: {
    //以下可以自定义添加函数和全局数据
    userToken: null,
    authCode: '', // 用户code
    userId: '',
    userName: '',
    userType: 1,
    // 1:个人用户 2:企业用户
    isAuth: false,
    avatar: '',
    phone: '',
    lastUserInfoAuthDate: null,
    //上一次用户授权时间
    memberCompany: null,
    //对象类型
    memberType: 1,
    // 1:没有加入任何企业 2:企业普通成员 3:企业管理员
    env: 'dev',
    hasShowOverdueModal: false, // 是否已经做过过期提醒
    /**
     * @name 支付宝获取authcode
     * @param {Object} callback
     */
    getUserAuthCode(callback) {
      // #ifdef MP-ALIPAY
      my.getAuthCode({
        scopes: 'auth_user',
        success: (res) => {
          this.authCode = res.authCode
          console.log(this.authCode, 9999)
          typeof callback == 'function' && callback()
        },
      })
      // #endif
    },
    /**
     * @name 登陆成功保存全局数据
     * @param {Object} userToken
     * @param {Object} userId
     * @param {Object} userName
     * @param {Object} userType
     * @param {Object} isAuth
     * @param {Object} phone
     * @param {Object} avatar
     * @param {Object} memberCompany
     * @param {Object} memberType
     */
    loginSuccess: function(
      userToken,
      userId,
      userName,
      userType,
      isAuth,
      phone,
      avatar,
      memberCompany,
      memberType
    ) {
      console.log(
        userToken,
        userId,
        userName,
        userType,
        isAuth,
        phone,
        avatar,
        memberCompany,
        memberType,
        21121
      )
      this.userToken = userToken
      this.userId = userId
      this.userName = userName
      this.userType = userType
      this.isAuth = isAuth == 1 ? true : false
      this.phone = phone
      this.avatar = avatar
      this.memberType = memberType

      // #ifdef H5
      localStorage.setItem('userToken', userToken)
      localStorage.setItem('userId', userId)
      localStorage.setItem('userName', userName)
      localStorage.setItem('userType', userType)
      localStorage.setItem('isAuth', isAuth)
      localStorage.setItem('phone', phone)
      localStorage.setItem('avatar', avatar)
      localStorage.setItem('memberType', memberType)
      if (memberCompany != null) {
        this.memberCompany = memberCompany
        localStorage.setItem('memberCompany', JSON.stringify(memberCompany))
      } else {
        localStorage.setItem('memberCompany', '')
      }
      // #endif

      // #ifndef H5
      uni.setStorageSync('userToken', userToken)
      uni.setStorageSync('userId', userId)
      uni.setStorageSync('userName', userName)
      uni.setStorageSync('userType', userType)
      uni.setStorageSync('isAuth', isAuth)
      uni.setStorageSync('phone', phone)
      uni.setStorageSync('avatar', avatar)
      uni.setStorageSync('memberType', memberType)
      if (memberCompany != null) {
        this.memberCompany = memberCompany
        uni.setStorageSync('memberCompany', JSON.stringify(memberCompany))
      } else {
        uni.setStorageSync('memberCompany', '')
      }
      // #endif
    },
    /**
     * @name 加载用户信息
     */
    loadUserInfo: function() {
      // #ifdef H5
      this.userToken = localStorage.getItem('userToken')
      this.userId = localStorage.getItem('userId')
      this.userName = localStorage.getItem('userName')
      this.userType = localStorage.getItem('userType')
      this.isAuth = localStorage.getItem('isAuth') == 1 ? true : false
      this.phone = localStorage.getItem('phone')
      this.avatar = localStorage.getItem('avatar')
      this.lastUserInfoAuthDate = localStorage.getItem('lastUserInfoAuthDate')
      this.memberType = localStorage.getItem('memberType')
      var memberCompanyJson = localStorage.getItem('memberCompany')
      // #endif

      // #ifndef H5
      this.userToken = uni.getStorageSync('userToken')
      this.userId = uni.getStorageSync('userId')
      this.userName = uni.getStorageSync('userName')
      this.userType = uni.getStorageSync('userType')
      this.isAuth = uni.getStorageSync('isAuth') == 1 ? true : false
      this.phone = uni.getStorageSync('phone')
      this.avatar = uni.getStorageSync('avatar')
      this.lastUserInfoAuthDate = uni.getStorageSync('lastUserInfoAuthDate')
      this.memberType = uni.getStorageSync('memberType')
      var memberCompanyJson = uni.getStorageSync('memberCompany')
      // #endif

      if (memberCompanyJson && memberCompanyJson.length != 0) {
        this.memberCompany = JSON.parse(memberCompanyJson)
      }
    },
    /**
     * @name 检测当前小程序是否有版本更新
     */
    getMiniAppUpdateStatus() {
      //新版本更新
      if (uni.canIUse('getUpdateManager')) {
        //判断当前微信版本是否支持版本更新
        const updateManager = uni.getUpdateManager()
        updateManager.onCheckForUpdate((res) => {
          if (res.hasUpdate) {
            // 请求完新版本信息的回调
            updateManager.onUpdateReady(() => {
              uni.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: (res) => {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  }
                },
              })
            })
            updateManager.onUpdateFailed(() => {
              uni.showModal({
                // 新的版本下载失败
                title: '已经有新版本了哟~',
                content:
                  '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
              })
            })
          } else {
            console.log('没有版本更新诶～')
          }
        })
      } else {
        console.log('微信版本过低，升级后可以应用新版本')
      }
    },
    /**
     * 更新头像
     */
    updateUserIcon: function(avatar) {
      this.avatar = avatar
      var now = new Date()
      var nowTime = now.getTime()
      this.lastUserInfoAuthDate = nowTime

      // #ifdef H5
      localStorage.setItem('avatar', avatar)
      localStorage.setItem('lastUserInfoAuthDate', nowTime)
      // #endif

      // #ifndef H5
      uni.setStorageSync('avatar', avatar)
      uni.setStorageSync('lastUserInfoAuthDate', nowTime)
      // #endif
    },
    /**
     * @name 退出登陆
     */
    quitLogin: function() {
      this.userToken = null

      // #ifdef H5
      localStorage.clear()
      uni.reLaunch({
        url: '/pages/account/hlogin/hlogin',
      })
      // #endif

      // #ifndef H5
      uni.clearStorageSync()
      uni.switchTab({
        url: '/pages/pm/pmHome',
      })
      // #endif
    },
    /**
     * 是否登录中
     */
    isLoginIn: function() {
      return Boolean(this.userToken && this.userToken.length > 0)
    },
    /**
     * @name 登录
     */
    login() {
      // #ifdef H5
      uni.redirectTo({
        url: '/pages/account/hlogin/hlogin',
      })
      // #endif
      // #ifndef H5
      uni.redirectTo({
        url: '/pages/root/root',
      })
      // #endif
    },
    /**
     * 获取用户token
     */
    getUserToken() {
      return this.userToken
    },
    /**
     * 获取用户信息
     */
    updateUserInfo: function(callback) {
      get({
        url: get_user_info,
        success: (data) => {
          if (!data) return
          // #ifdef  H5
          const token = localStorage.getItem('userToken')
          // #endif

          // #ifndef  H5
          const token = uni.getStorageSync('userToken')
          // #endif

          this.loginSuccess(
            token,
            data.userId,
            data.name,
            data.userType,
            data.auth,
            data.phone,
            data.icon,
            data.joinCompany,
            data.userCompanyType
          )
          typeof callback == 'function' && callback()
        },
      })
    },
    /**
     * @name 校验是否认证了
     */
    checkHasAuth() {
      if (!this.isAuth) {
        // 未认证
        // #ifdef H5
        const companyId = JSON.parse(localStorage.getItem('currentUser'))
          .companyId
        // #endif
        // #ifndef H5
        const companyId = uni.getStorageSync('currentUser').companyId
        // #endif
        const modalInfo = {
          title: companyId ? '立即进行企业实名认证' : '立即进行个人实名认证',
          url: companyId
            ? '/pages/authentication/company/company-auth-type/index'
            : '/pages/authentication/personal/personal-auth-type/index',
        }
        uni.showModal({
          title: modalInfo.title,
          content: '实名认证后可享受加便捷高效的电子合同服务',
          showCancel: true,
          cancelText: '暂不认证',
          confirmText: '立即认证',
          success: function(res) {
            if (res.cancel) {
              const pages = getCurrentPages()

              if (pages.length > 1) {
                uni.navigateBack()
              }

              uni.hideLoading({})
            } else {
              uni.navigateTo({
                url: modalInfo.url,
              })
            }
          },
        })
        return false
      } else {
        return true
      }
    },
    /**
     * @name 获取当前浏览器环境
     */
    getCurrentBrowserEnv() {
      let env = 'other'
      // 判断微信还是支付宝
      if (/MicroMessenger/.test(window.navigator.userAgent)) {
        // 微信
        env = 'weixin'
      } else if (/AlipayClient/.test(window.navigator.userAgent)) {
        // 支付宝
        env = 'alipay'
      } else {
        env = 'others'
      }
      return env
    },
    /**
     * @name h5 支付
     * @param {Object} options value: 金额 desc：描述 rechargeType：充值类型（0:礼品卡1:账户余额）；origin: 0:pc; 1:手机端;
     */
    getH5PayUrl(options) {
      if (this.getCurrentBrowserEnv() == 'others') {
        uni.showModal({
          title: '提示',
          content:
            '此环境下暂不支持支付，请前往小程序、电脑端、或者在微信/支付宝中打开该页面进行支付',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              console.log('已经提醒用户～')
            }
          },
        })
        return false
      }
      let params = {
        amount: options.value,
        body: options.desc,
        rechargeType: options.rechargeType,
        origin: options.origin,
      }
      if (options.goods) {
        params.goods = options.goods
      }
      if (options.goodsNum) {
        params.goodsNum = options.goodsNum
      }
      uni.showLoading({
        title: '加载中...',
      })
      get({
        url: get_pay_url,
        params: params,
        success: (res) => {
          location.href = res.payUrl
        },
        fail: (err) => {
          setTimeout(() => {
            uni.showToast({
              icon: 'err',
              title: err,
            })
          })
        },
        complete: () => {
          uni.hideLoading()
        },
      })
    },
  },
  methods: {},
}
</script>

<style>
@import '@/font/iconfont.css';
</style>
