<template>
	<view>
		<view>
			<view class="money">￥{{topupMoney}}</view>
			<view class="title">支付金额</view>
		</view>
		<view class="btn">
			<button type="primary" @click="Topup">立即支付</button>
		</view>
	</view>
</template>

<script>
	import VerifyHelper from '../../common/verify.js'
	import {mapState,mapMutations} from 'vuex';
	export default{
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		data(){
			return{
				topupMoney:0
			}
		},
		onLoad(option){
			let _self = this;
			if(!_self.hasLogin){
				uni.showModal({
					title:'登录提示',
					content:'检测到您未登录，是否立即登录！',
					confirmText:'立即登录',
					confirmColor:'#fd790c',
					cancelText:'暂不登录',
					cancelColor:'#666666',
					success: function (res) {
						if (res.confirm) {
							uni.navigateTo({
								url:'/pages/login/login?goto=/page/mine/topup'
							});
						} 
					}
				})
			}
			let _money = option.value;
			if(!VerifyHelper.IsNumber(_money) || Number(_money)<=0){
				uni.navigateBack({
					'delta':1
				})
				return;
			}
			_self.topupMoney = parseFloat(_money);
		},
		methods:{
			Topup(){
				let _self = this;
				uni.showLoading({
					"title":'请稍后...'
				})
				_self.POST('/api/Order/RechargeCreateBalanceLog',{"clientPlatform":2,"amount":_self.topupMoney,"payPlatform":1},_self.userInfo.accessToken,function(res){
					if(res.Status){
						_self.POST('/api/Pay/Recharge',{"rechargeNo":res.Data,"money":_self.topupMoney,"openId":_self.userInfo.OpenID},_self.userInfo.accessToken,function(result){
							uni.hideLoading();
							if(result.Status){
								let data=JSON.parse(result.Data);
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: data.timeStamp,
									nonceStr: data.nonceStr,
									package: data.package,
									signType: data.signType,
									paySign: data.paySign,
									success: _res => {
										if(_res.errMsg=="requestPayment:ok"){
											uni.reLaunch({
												url:'/pages/mine/topupSuccess'
											})
										}
										else{
											uni.showToast({
												icon:'none',
												title:"支付失败！"
											})
										}
									},
									// 取消支付
									fail: () => { 
										uni.showToast({
											icon:'none',
											title:"取消支付！"
										})
									},								
								});
							}
							else{
								uni.showToast({
									icon:'none',
									title:result.Message
								})
							}
						},'applets','application/x-www-form-urlencoded')
					}
					else _self.showMsg(res.Message)
				},'biz')
			}
		}
	}
</script>

<style>
	.money,.title,.btn{text-align: center;}
	.title{color: #666666;}
	.money{font-weight: bold;font-size: 24px;margin-top: 50upx;}
	.btn button{width: 500upx;margin-top: 100upx;background-color: #fd790c;color: #FFFFFF;}
</style>
