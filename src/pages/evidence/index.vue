<template>
	<view class="entrance-page">
		<!--  #ifdef  H5 -->
		<view class="entrance-point" v-for="(item, index) in entrances" :key="index" @tap="_handleEnterPoint(item)">
		<!--  #endif -->
		
		<!--  #ifndef  H5 -->
		<view class="entrance-point" v-for="(item, index) in entrances" :key="index" :data-value="item.value" @tap="_handleEnterPoint">
		<!--  #endif -->
			<view class="inner">
				<text>{{ item.label }}</text>
				<text class="iconfont iconright-arrow"></text>
			</view>
		</view>
	</view>
</template>

<script>
	
	const app = getApp()
	export default {
		data() {
			return {
				entrances: [
					{
						label: '项目管理',
						value: 1
					},
					{
						label: '文件存证',
						value: 2
					}
				]
			};
		},
		onShareAppMessage() {},

		methods: {
			
			// #ifdef  H5
			_handleEnterPoint(item) {
				if (!app.globalData.isLoginIn()) {
					uni.reLaunch({
						url: '/pages/account/hlogin/hlogin'
					})
				}
				switch(Number(item.value)) {
					case 1:
						uni.navigateTo({
							url: '/pages/evidence/projectManage/index'
						})
						break
					case 2:
						uni.navigateTo({
							url: '/pages/evidence/evidenceList/index'
						})
						break
					default:
						break
				}
			}
			// #endif
			
			// #ifndef  H5
			_handleEnterPoint(e) {
				if (!app.globalData.isLoginIn()) {
					uni.reLaunch({
						url: '/pages/account/login/login'
					})
				}
				switch(Number(e.currentTarget.dataset.value)) {
					case 1:
						uni.navigateTo({
							url: '/pages/evidence/projectManage/index'
						})
						break
					case 2:
						uni.navigateTo({
							url: '/pages/evidence/evidenceList/index'
						})
						break
					default:
						break
				}
			}
			// #endif
		}
	};
</script>
<style>
	@import "./index.css";
</style>
