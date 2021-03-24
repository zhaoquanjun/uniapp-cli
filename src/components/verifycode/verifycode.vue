<template>
	<view :class="'wx-verify-bg ' + (isShow ? 'show' : '')">
		<view class="wx-mask"></view>
		<text class="verify-title">{{title}}</text>
		<text class="verify-content">{{content}}{{phone}}</text>
		<view class="verify-code-view" @tap.stop="openKeyboard">
			<view v-for="(code, index) in codes" :key="index" :class="'verify-input-view ' + (index==0?'verify-input-view-first':'')">
				<text class="verify-text">{{code}}</text>
			</view>
			<input :class="'key-input ' + (isFocus ? 'input-focus' : '')" type="number" maxlength="6" adjust-position="false" confirm-type="done" :focus="isFocus" v-model="inputValue"
			 @input="listenKeyInput" />
		</view>
		<text class="again-send-class" :style="'color:' + againSendTextColor" @tap.stop="againSendAction">{{againSendText}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false,
				isFocus: false,
				title: '请输入验证码',
				content: '已发送到手机号:',
				againSendText: '重新发送',
				phone: '',
				codes: ["", "", "", "", "", ""],
				inputValue: '',
				timeCount: 60,
				againSendTextColor: '#FF9F3D'
			};
		},

		components: {},
		props: {},
		options: {
			multipleSlots: true // 在组件定义时的选项中启用多slot支持

		},
		methods: {
			//展示
			showView({
				userPhone,
				inputSuccess,
				againSend
			}) {
				this.againSend = againSend;
				this.inputSuccess = inputSuccess;
				var mPhone = userPhone.substr(0, 3) + '****' + userPhone.substr(7);
				this.isShow = !this.isShow
				this.phone = mPhone
				this.isFocus = true
				this.codes = ["", "", "", "", "", ""]
			},
			
			/**
			 * 清除验证码
			 */
			clearCode() {
				this.codes = ["", "", "", "", "", ""]
				this.inputValue = ''
				this.$forceUpdate()
			},

			/**
			 * 点击输入框
			 */
			openKeyboard() {
				this.isFocus = true
			},

			/**
			 * 监听键盘输入
			 */
			listenKeyInput(e) {
				const textLength = this.inputValue.length
				var codeArray = new Array();
				for (var i = 0; i < (textLength > 6 ? 6 : textLength); i++) {
					var code = this.inputValue.substr(i, 1);
					codeArray[i] = code;
				}

				for (var i = codeArray.length; i < 6; i++) {
					codeArray.push("");
				}

				this.codes = codeArray

				if (textLength > 5) {
					var returnString = this.inputValue.substr(0, 6);
					this.inputSuccess(returnString,);
					return returnString;
				}
			},
			
			againSendAction() {
				if (this.timeCount != 60) return;
				this.againSend();
			},
			sendSuccess: function() {
				this.timer = setInterval(() => {
					var tCount = this.timeCount;
					tCount = tCount - 1;
					this.againSendText = tCount + '秒后重新发送'
					this.timeCount = tCount
					this.againSendTextColor = '#808080'

					if (tCount == 0) {
						clearInterval(this.timer);
						this.againSendText = '重新发送'
						this.timeCount = 60
						this.againSendTextColor = '#FF9F3D'
					}
				}, 1000);
			}
		}
	};
</script>
<style>
	@import "./verifycode.css";
</style>
