<template>
	<view class="page bg-white">
		<view class='header'>
			<image src='/static/images/logo-1.png'></image>
		</view>
		<view class='content'>
			<view>申请获取以下权限</view>
			<text>获得你的公开信息(昵称，头像、地区等)</text>
		</view>
		<view class="btn-view">
			<button class="btn" open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="GetUserInfo">授权登录</button>
			<button class="btn" style="background: #fff;margin-top: 40rpx;" @tap="goToBack">暂不登录</button>
		</view>
	</view>
</template>

<script>
	var _self;
	import {mapMutations} from 'vuex';
	export default {
		data() {
			return {
				goto:''
			}
		},
		methods: {
			// 映射两个状态到页面示例中，可以直接访问，实时获取Mutations的值
			...mapMutations(['saveID','login','setUserType']),
			//获取用户信息
			GetUserInfo(e) {
				let _self = this
				uni.showLoading({
				    title: '授权中'
				});
				uni.login({//获取code
					provider: 'weixin',
					success(loginRes) {
						uni.getUserInfo({//获取用户信息
							provider: 'weixin',
							success(infoRes) {
								_self.Decode(loginRes.code,infoRes.encryptedData,infoRes.iv);
							},
							fail() {
								uni.hideLoading();
							}
						});
					},
					fail() {
						uni.hideLoading();
					}
				});
			},
			Decode(code,encryptedData,iv){
				let _self=this;
				let postData={
					code:code,
				}
				_self.POST('/api/Pay/GetAppletsOpenidUnionid',postData,'',function(res){
					let unionId = res.Data.unionid;
					let openId = res.Data.openid;
					uni.setStorageSync('unionId',unionId);
					uni.setStorageSync('openId',openId);
					_self.saveID({unionId:unionId,openId:openId});
					_self.LoginByUnionID(unionId,openId);
				},'applets','application/x-www-form-urlencoded')
			},
			LoginByUnionID(unionId,openId){
				let _self=this;
				let mobile = uni.getStorageSync('mobile');
				_self.POST('/api/Auth/LoginByUnionID',{unionId:unionId,openIdApplets:openId,mobile:mobile},'',function(result){
					if(result.Status){
						_self.Get('/api/User/GetUserByUnionID',{},result.Data.accessToken,function(result2){
							if(result2.Status){
								//console.log('result2###',result2);
								result2.Data.accessToken=result.Data.accessToken;
								result2.Data.refreshToken=result.Data.refreshToken;
								result2.Data.OpenID=openId;
								_self.login(result2.Data);
								_self.setUserType(result2.Data.UserType)
								uni.setStorageSync('accessToken',result.Data.accessToken);
								uni.setStorageSync('refreshToken',result.Data.refreshToken);
								uni.setStorageSync('login',result2.Data);
								uni.setStorageSync('fullname',result2.Data.FullName);
								uni.setStorageSync('mobile',result2.Data.Mobile);
								uni.setStorageSync('headurl',result2.Data.HeadUrl);
								uni.setStorageSync('UserId',result2.Data.ID)
								_self.showMsg("登录成功！");
								uni.reLaunch({url:'/pages/index/index'});
							}
							else{
								uni.showToast({
									icon:'none',
									title:result2.Message
								})
							}
						},'biz');
					}
					else{
						uni.navigateTo({url: '/pages/login/inputPhone'});
					}
				},'auth','application/x-www-form-urlencoded');
			},
			goToBack(){
				console.log('goToBack')
					uni.reLaunch({
						url:"/pages/index/index"
					})
			}
		},
		onLoad() {

		},
	}
</script>

<style>
	.page{height: 100vh;}
	.header{margin:0 50upx 90upx 50upx;border-bottom:1px solid #ccc;text-align:center;width:650upx;height:400upx;line-height:450upx;padding-top: 50upx;}
	.header image{width:300upx;height:300upx}
	.content{margin-left:50upx;margin-bottom:90upx}
	.content text{display:block;color:#9d9d9d;margin-top:40upx}
	.btn-view{padding: 30upx;}
	.btn{width: 100%;background: linear-gradient(120deg, #3399FE 0%, #3399FE 100%);}
</style>
