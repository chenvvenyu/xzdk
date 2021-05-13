<template>
	<view class="container-warp">
		<view class="title">编辑个人信息</view>
		<view class="content-box">
			<view class="uni-input-group">
				<view class="uni-input-row">
					<!-- <image src="/static/images/sj_town_03.png" mode="" style="margin-top: 40rpx;"></image> -->
					<text style="letter-spacing:unset;">真实姓名</text>
					<input class="uni-input" v-model="fullName" placeholder="填写您的真实姓名" maxlength="16" />
				</view>
			</view>
			<view class="operation-box">
				<button type="primary" @tap="btnSubmit" class="btnSubmit">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import VerifyHelper from "@/common/verify.js"
	import {mapState,mapMutations} from 'vuex';
	export default{
		data() {
			return {
				fullName:''
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		methods:{
			btnSubmit:function(){
				let _self = this;
				if(VerifyHelper.IsNull(_self.fullName)){
					_self.showMsg('请填写真实姓名');
					return;
				}
								
				_self.POST('/api/User/UpdateFullname',{fullname:_self.fullName},_self.userInfo.accessToken,function(res){
					console.log(res);
					if(res.Status){
						//_self.showMsg("修改成功！");						
						uni.showToast({
							icon:'success',
							title:'修改成功'
						});
						
						uni.setStorageSync('fullname',_self.fullName);
						
						_self.userInfo.FullName = _self.fullName
							
						setTimeout(function(){
							uni.navigateBack({
								delta:1
							})
						},1000)
						
					}
					else {
						_self.showMsg("修改失败！");						
					}
				},'biz','application/x-www-form-urlencoded');
			}
		},
		onLoad:function(option){
			let _self = this;
			_self.fullName = _self.userInfo.FullName
		}
		
	}
</script>

<style lang="scss">
	page{background-color: #FFFFFF;width: 690upx;margin: 0 30upx;
		.uni-input{padding: 0 !important;}
		.title{font-size: 20px;font-weight: bold;padding-top: 40rpx;}
		.content-box{margin:0 20upx;padding-top: 50upx;
			.uni-input-group{
				position: unset;
				border-top: 1rpx solid #eee;
				.uni-input-row{padding: 40upx 0;position: unset;border-bottom: 1rpx solid #eee;}
				.uni-input-row image,.uni-input-row input{
					width: 50upx;
					height: 50upx;
					line-height: 50upx;
				}
				.uni-input-row text{
					width: 150upx;
					height: 50upx;
					line-height: 50upx;
					margin-top: 0;
					letter-spacing: 14rpx;
					font-weight: bolder;
					border-right: 1rpx solid #eee;;
				}
				.uni-input-row input{margin-left: 20upx;font-size: 28upx;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
			}
			.agreement-box {margin: 40upx 0;padding: 0 30upx;font-size: 32upx;color: #666666;}
			.operation-box{margin-top: 60upx;
				.btnSubmit{border-radius: 50upx;height: 100upx;line-height: 100upx;background: linear-gradient(120deg, #329AFF 0%, #329AFF 100%);
						color: #FFFFFF;font-size: 40upx;}
			}
		}
		
		
	}
	
</style>