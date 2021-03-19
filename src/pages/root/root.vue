<template>
	<view>
		<!--pages/root/root.wxml-->
	</view>
</template>

<script>
	var app = getApp();

	export default {
		data() {
			return {};
		},

		components: {},
		props: {},
		onReady: function() {
			//判断用户登陆状态
			app.globalData.loadUserInfo();
			var userToken = app.globalData.getUserToken();
			var pageUrl = "/pages/pm/pmHome";

			if (!userToken || userToken.length == 0) {
				pageUrl = "/pages/account/login/login";

				uni.redirectTo({
					url: pageUrl
				});
				return false
			} else {
				uni.switchTab({
					url: pageUrl
				});
			}
		},
		methods: {}
	};
</script>
