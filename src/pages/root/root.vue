<template>
	<view>
		<!--pages/root/root.wxml-->
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		onReady: function() {
			//判断用户登陆状态
			this.loadUserInfo()
			let pageUrl = "/pages/pm/pmHome";
			if (!this.userToken) {
				pageUrl = "/pages/account/login/login";
				return void uni.redirectTo({
					url: pageUrl
				});
			} else {
				uni.switchTab({
					url: pageUrl
				});
			}
		},
		computed: {
			...mapState({
				userToken: state => state.userToken
			})
		},
		methods: {
			...mapMutations(['loadUserInfo'])
		}
	};
</script>
