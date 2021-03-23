const tools = {
  // 获取小程序是否更新版本了
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
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
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
  //获取当前浏览器环境
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
  // 未认证弹窗
  showAuthDialog() {
    const modalInfo = {
      title: state.currentUser.companyId
        ? '立即进行企业实名认证'
        : '立即进行个人实名认证',
      url: state.currentUser.companyId
        ? '/pages/authentication/company/company-auth-type/index'
        : '/pages/authentication/personal/personal-auth-type/index',
    }
    return void uni.showModal({
      title: modalInfo.title,
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
            url: modalInfo.url,
          })
        }
      },
    })
  },
}

export default tools
