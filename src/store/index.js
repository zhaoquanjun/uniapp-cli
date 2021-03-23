import Vue from 'vue'
import Vuex from 'vuex'
import { get } from '@api/request'
import { get_user_info } from '@api/account'
import { get_pay_url } from '@api/cost.js'
import tools from '@u/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userToken: '', // token
    authCode: '', // 用户code - 支付宝独有
    userId: '', // 用户userId
    userName: '', // 用户userName
    userType: 1, // 1:个人用户 2:企业用户/律所
    isAuth: false, // 是否认证授权
    avatar: '', // 头像
    phone: '', // 手机号
    memberType: 1, // 1:没有加入任何企业 2:企业普通成员 3:企业管理员
    hasShowOverdueModal: false, // 是否已经做过过期提醒
    userAccount: '', // 用户账户，大概率是手机号
    currentUser: null, // 用户信息
  },
  getters: {
    // 是否登录了
    hasLogin(state) {
      return !!state.userToken
    },
    // 是否认证了
    hasAuth(state) {
      return state.isAuth
    },
    // 当前用户名称
    currentUserName(state) {
      if (!state.userToken) return '未登录'
      if (!!state.userToken) {
        if (state.userType == 2) return state.currentUser.companyName
        if (state.userType == 1) return state.currentUser.name
      }
    }
  },
  mutations: {
    setData(state, value) {
      state.currentUser = value
    },
    // 登录成功
    loginSuccess(state, result) {
      state.userToken = result.token
      state.userId = result.userId
      state.userName = result.companyId ? result.companyName : result.name
      state.userType = result.userType ?? 2 // 存折就是个人 不存在就按企业律所算
      state.isAuth = (result.companyId && result.authStatus == 1 || result.auth == 1) ? true : false
      state.phone = result.phone ?? ''
      state.avatar = result.avatar ?? ''
      state.userAccount = result.account ?? ''
      state.currentUser = result
      console.log(state.currentUser, 9999, result)
      uni.setStorageSync('userToken', result.token)
      uni.setStorageSync('userId', result.userId)
      uni.setStorageSync('userName', result.companyId ? result.companyName : result.name)
      uni.setStorageSync('userType', result.userType)
      uni.setStorageSync('isAuth', result.auth == 1 ? true : false)
      uni.setStorageSync('phone', result.phone ?? '')
      uni.setStorageSync('avatar', result.avatar ?? '')
      uni.setStorageSync('currentUser', result)
      uni.setStorageSync('userAccout', result.account ?? '')
    },
    // 支付宝获取authcode
    getUserAuthCode(state, callback) {
      my.getAuthCode({
        scopes: 'auth_user',
        success: (res) => {
          state.authCode = res.authCode
          console.log(state.authCode, 9999)
          typeof callback == 'function' && callback()
        },
      })
    },
    // 从本地加载用户信息
    loadUserInfo(state) {
      state.userToken = uni.getStorageSync('userToken')
      state.userId = uni.getStorageSync('userId')
      state.userName = uni.getStorageSync('userName')
      state.userType = uni.getStorageSync('userType')
      state.isAuth = uni.getStorageSync('isAuth')
      state.phone = uni.getStorageSync('phone')
      state.avatar = uni.getStorageSync('avatar')
      state.userAccount = uni.getStorageSync('userAccount')
      state.currentUser = uni.getStorageSync('currentUser')
    },
    // 重置过期窗口显示隐藏默认值
    resetOverdueModalValue(state, value) {
      state.hasShowOverdueModal = value
    },
    // 更新state某些数据
    updateStateAttr(state, result) {
      console.log(result)
      for (var key in result) {
        console.log(key)
        state[key] = result[key]
        uni.setStorageSync(key, result[key])
      }
    },
    // 清空state数据
    clearState(state) {
      Object.keys(state).forEach(key => {
        if (typeof state[key] == 'string') {
          state[key] = ''
        } else if (typeof state[key] == 'boolean') {
          state[key] = false
        } else {
          state[key] = null
        }
      })
    },
  },
  actions: {
    // 更新用户信息
    updateUserInfo: async ({ commit, state }, callback) => {
      return await new Promise((resolve, reject) => {
        get({
          url: get_user_info,
          success: (data) => {
            if (!data) return
            commit('loginSuccess', data)
            typeof callback == 'function' && callback()
          },
        })
      })
    },
    /**
     * @name h5 支付
     * @param {Object} options value: 金额 desc：描述 rechargeType：充值类型（0:礼品卡1:账户余额）；origin: 0:pc; 1:手机端;
     */
    getH5PayUrl(options) {
      if (tools.getCurrentBrowserEnv() == 'others') {
        return void uni.showModal({
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
    // 登录
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
    // 退出登录
    quitLogin() {
      uni.clearStorageSync()
      this.commit('clearState')
      // #ifdef H5
      uni.reLaunch({
        url: '/pages/account/hlogin/hlogin',
      })
      // #endif

      // #ifndef H5
      uni.switchTab({
        url: '/pages/pm/pmHome',
      })
      // #endif
    },
  },
})

export default store
