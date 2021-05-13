<template>
	<view class="container-warp">
		<view class="icon">
			<image mode="widthFix" src="../../static/images/cg_icon_03.jpg"></image>
		</view>
		<view class="text">
			<view class="title-1" >充值成功</view>
		</view>
		<view class="operation-box">
			<button type="primary" @tap="btnSubmit" class="btnSubmit">返回大厅</button>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				
			};
		},
		methods:{
			btnSubmit:function(){
				uni.reLaunch({
					url:'/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	page{background-color: #FFFFFF;
		.container-warp{width: 690upx;margin: 0 30upx;
			.icon{margin-top: 120upx;text-align: center;
				image{width: 280upx;}
			}
			.text{text-align: center;
				.title-1{font-size: 48upx;margin-top: 30upx;}
				.title-2{font-size: 36upx;margin-top: 50upx;}
				.title-3{margin-top: 50upx;}
			}
			.operation-box{margin-top: 80upx;
				.btnSubmit{border-radius: 50upx;height: 100upx;line-height: 100upx;background-color: #fd790c;
						color: #FFFFFF;}
			}
		}
	}
</style>
