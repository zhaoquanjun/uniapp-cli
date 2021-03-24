<template>
	<view class="entrance-page">
		<view class="entrance-point" v-for="(item, index) in entrances" :key="index" @tap="_handleEnterPoint(item)">
			<view class="inner">
				<text>{{ item.label }}</text>
				<text class="iconfont iconright-arrow"></text>
			</view>
		</view>
	</view>
</template>

<script>
	
	import { mapGetters } from 'vuex'
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
		computed: {
			...mapGetters(['hasLogin'])
		},
		methods: {
			_handleEnterPoint(item) {
				if (!this.hasLogin) {
					// #ifdef  H5
					uni.reLaunch({
						url: '/pages/account/hlogin/hlogin'
					})
					// #endif

					// #ifndef  H5
					uni.reLaunch({
						url: '/pages/account/login/login'
					})
					// #endif
					
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
			},
		}
	};
</script>
<style>
	@import "./index.css";
</style>
