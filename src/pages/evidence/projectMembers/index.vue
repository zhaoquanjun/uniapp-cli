<template>
  <view class="project-members--page">
    <view class="creator-area" v-if="creator">
      <view class="title">创建者</view>
      <view class="item" v-for="(item, index) in creator" :key="index">
        <view class="wrapper">
          <view class="avator">
            <image
              :src="avatar"
              mode="aspectFit"
            ></image>
          </view>
          <view class="info">
            <text class="name">{{ item.userName }}</text>
            <text class="phone">{{ item.phone }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="members-area" v-if="members.length > 0">
      <view class="title">成员</view>
      <view class="item" v-for="(item, index) in members" :key="index">
        <view class="wrapper">
          <view class="avator">
            <image
              :src="avatar"
              mode="aspectFit"
            ></image>
          </view>
          <view class="info">
            <text class="name">{{ item.userName }}</text>
            <text class="phone">{{ item.phone }}</text>
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
      creator: null,
      members: [],
      avatar: require('@s/pm/av.png')
    }
  },
  onShow() {
    console.log(1111)
    this._getMembers()
  },
  methods: {
    _getMembers() {
      const members = uni.getStorageSync('projectMembers')
      this.creator = members.filter((item) => {
        return item.creator == 1
      })
      this.members = members.filter((item) => {
        return item.creator !== 1
      })
    },
  },
}
</script>

<style>
@import './index.css';
</style>
