<template>
	<view class="container-warp">
		<view class="content-box">
			<view class="logo-box">
				<image src="../../static/images/logo-1.png"></image>
				<text class="title">手机号码绑定</text>
			</view>
			<view class="input-box">
				<input type="number" v-model="Mobile" maxlength="11" placeholder="请输入手机号码"/>
			</view>
			<view class="agreement-box">
				<label class="radio" style="margin-right: 30rpx;" @tap="agreementChange">
					<radio value="r1" color="#3399FE" :checked="Agreement" />
					我已阅读并同意<text>《用户协议》</text>和<text>《隐私政策》</text>
				</label>
			</view>
			<view class="operation-box">
				<button type="primary" @tap="sendSMS" class="sendSMS">发送验证码</button>
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
				goUrl:'',
				Agreement:false,
				Mobile:''
			};
		},
		computed:{
			...mapState(['hasLogin'])
		},		
		methods:{
			...mapMutations(['login']),
			agreementChange:function(){
				let _self = this;
				_self.Agreement=!_self.Agreement;
			},
			sendSMS:function(){
				let _self = this;
				if(!VerifyHelper.IsPhone(_self.Mobile)){
					uni.showToast({
						title:'请输入正确的手机号码！',
						icon:'none'
					})
					return;
				}
				if(!_self.Agreement){
					uni.showToast({
						title:'请阅读并同意《用户协议》和《隐私政策》！',
						icon:'none'
					})
					return;
				}
				let _param = {
					mobile:_self.Mobile,
					scene:6,
					sendClient:2
				}
				_self.POST('/api/Sms/Do',_param,'',function(dataObj){
					if(dataObj.Status){
						uni.navigateTo({
							url:'/pages/login/inputCode?mobile='+_self.Mobile+'&goto='+_self.goUrl
						})
					}
					else{
						uni.showToast({
							icon:'none',
							title:dataObj.Message
						})
					}
				},'passport')
			}
		},
		onLoad:function(option){
			let _self = this;
			// _self.goUrl=option.goto;
			// if(_self.hasLogin) uni.reLaunch({
			// 	url:VerifyHelper.IsNull(_self.goUrl)?"/pages/index/index":_self.goUrl
			// })
		}
	}
</script>

<style lang="scss">
	page{background-color: #FFFFFF;
		.content-box{width: 690upx;margin: 0 30upx;
			.logo-box{margin: 100upx 0;text-align: center;display: flex;
					  flex-direction: column;justify-content: space-around ;align-items: center;
				image{width: 168upx;height: 186upx;}
				.title{font-size: 58upx;margin-top: 50upx;}
				.des{color: #888888;font-size: 32upx;}
			}
			.input-box{padding:0 30upx;
				input{border-bottom: 1px solid #aaaaaa;height: 80upx;line-height: 80upx;font-size: 32upx;}
			}
			.agreement-box{padding:0 40upx;margin: 80upx 0;
				text{color: #007AFF;font-size: 26upx;}
			}
			.operation-box{
				.sendSMS{border-radius: 50upx;height: 100upx;line-height: 100upx;background-color: #3399FE;
						color: #FFFFFF;}
			}
		}
	}
</style>
