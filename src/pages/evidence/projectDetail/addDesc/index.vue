<template>
	<view class="add-desc--page">
		<textarea class="textarea" :value="desc" placeholder-style="color: #666;" maxlength="200" auto-focus placeholder="请填写项目描述" @input="_handleInput" />
		<view class="tips">{{ desc.length }}/200 字</view>
		<view :class="'btn ' + (desc.length > 0 ? 'active' : '')" @tap="_updateProjectDesc">保存</view>
	</view>
</template>

<script>
	import {
		postBody
	} from '@api/request.js'
	
	import {
		update_project_desc
	} from '@api/evidence.js'
	
	export default {
		data() {
			return {
				desc: '',
				projectId: ''
			}
		},
		onLoad(options) {
			this.projectId = options.id
		},
		onShow() {
			const desc = uni.getStorageSync('projectDesc') || ''
			this.desc = desc
		},
		methods: {
			_updateProjectDesc() {
				if (!this.desc) {
					setTimeout(() => {
						uni.showToast({
							icon: 'none',
							title: '请填写项目描述'
						})
					}, 50)
					return false
				}
				postBody({
					url: update_project_desc,
					params: {
						id: this.projectId,
						description: this.desc
					},
					success: res => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: '保存成功'
							})
						}, 50)
						setTimeout(() => {
							uni.navigateBack(-1)
						}, 1500)
					},
					fail: err => {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: err
							})
						}, 50)
					}
				})
			},
			_handleInput(e) {
				this.desc = e.detail.value
			}
		}
	}
</script>

<style>
	@import './index.css'
</style>
