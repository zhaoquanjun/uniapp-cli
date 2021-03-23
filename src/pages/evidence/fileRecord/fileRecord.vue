<template>
<view>
<web-view :src="webSrc" @message="getRecordVideoFun"></web-view>
</view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      env: 'dev',
      developmentSrc: 'https://dev.shanqian.cn/fileRecord',
      productionSrc: 'https://shanqian.cn/fileRecord',
      webSrc: '',
      fileType: '',
      queryStr: ''
    };
  },
  onLoad: function (options) {
    this.fileType = options.type
    if (options.fromId) {
      for (const key in options) {
        if (options.hasOwnProperty(key) && key != 'type') {
          this.queryStr += '&' + key + '=' + options[key];
        }
      }
    }
  },
  onShow() {
    this.webSrc = this[process.env.NODE_ENV + 'Src'] + '?fileType=' + this.fileType + '&token=' + this.token;
    if (this.currentUser.companyId) {
      this.webSrc += '&companyId=' + this.currentUser.companyId;
    }
    this.webSrc += this.queryStr;
  },
  computed: {
    ...mapState({
      userToken: state => state.userToken,
      currentUser: state => state.currentUser
    })
  },
  methods: {
    getRecordVideoFun(e) {
      console.log(e.detail.data[0].type)
    }

  }
};
</script>
<style>
@import "./fileRecord.css";
</style>
