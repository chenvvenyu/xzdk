<template>
	<view class="container">
		<image src="../../static/images/logo-2.png" mode="widthFix" class="icon"></image>
		<view class="input_box">
			<input type="number" v-model="OrderNO" placeholder="请输入运单号" maxlength="30" focus="true"/>
		</view>
		<view class="btn" @tap="inquiry">
			查询
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				OrderNO:""
			}
		},
		methods: {
			inquiry(){
				this.OrderNO?
				uni.navigateTo({
					url:`/pages/mine/logList?id=${this.OrderNO}`,
				}):
				uni.showToast({
					title:"请输入运单号",
					icon:"none"
				})
			}
		}
	}
</script>

<style>
.container{
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}
.icon{
	margin-top: 10vh;
	width: 60vw;
	height: auto;
}
.input_box{
	margin-top: 5vh;
	width: 70vw;
	height: 80rpx;
	border: 4rpx #329AFF solid;
	border-radius: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}
.input_box>input{
	width: 80%;
}
.btn{
	margin-top: 5vh;
	background-color: #329AFF;
	color: #FFFFFF;
	width: 300rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	border-radius: 40rpx;
}
</style>
