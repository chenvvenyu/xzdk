<template>
	<view class="container-warp">
		<view class="content-box">
			<view class="logo-box">
				<text class="title">输入验证码</text>
				<text class="des">已发送验证码至{{MobileDeal(Mobile)}}</text>
			</view>
			<view class="input-box">
				<input type="number" v-model="Code" maxlength="11" placeholder="请输入验证码"/>
			</view>
			<view class="sendSMS-box">
				<text class="cust" v-if="CustTime>0">{{CustTime}}秒后可重新发送短信</text>
				<text v-else type="primary" @tap="sendSMS" class="sendSMS">重新发送</text>
			</view>
			<view class="operation-box">
				<button type="primary" @tap="btnSubmit" class="btnSubmit">确 定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import VerifyHelper from "@/common/verify.js"
	import {mapMutations,mapState} from 'vuex';
	export default{
		data() {
			return {
				Mobile:'',
				goUrl:'',
				Code:'',
				CustTime:60,
				intervalID:0,
				UserInfo:{}
			};
		},	
		computed:{
			...mapState(['unionId','userInfo','openId'])
		},
		methods:{
			...mapMutations(['login']),
			MobileDeal:function(mobile){
				if(!VerifyHelper.IsPhone(mobile)) return '';
				return mobile.substring(0,3)+'****'+mobile.substring(7,11);
			},
			sendSMS:function(){
				let _self = this;
				if(!VerifyHelper.IsPhone(_self.Mobile)){
					uni.reLaunch({
						url:'/pages/login/login'
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
						uni.showToast({
							icon:'none',
							title:'验证码已发送，请注意查收！'
						})
						_self.Code='';
						_self.CustTime=60;
						_self.intervalID = setInterval(function(){
							if(_self.CustTime>0)_self.CustTime--;
							else {
								_self.CustTime=0;
								clearInterval(_self.intervalID);
							}
						},1000)
					}
					else{
						uni.showToast({
							icon:'none',
							title:dataObj.Message
						})
					}
				},'passport')
			},
			btnSubmit:function(){
				let _self = this;
				if(VerifyHelper.IsNull(_self.Code) || _self.Code.length!=6){
					uni.showToast({
						icon:'none',
						title:'请输入6位短信验证码！'
					})
					return;
				}
				let _param = {
					mobile: _self.Mobile,
					code: _self.Code,
					platform: 2
				}
				_self.POST('/api/Auth/LoginV3',_param,'',function(dataObj){
					if(dataObj.Status){
						_self.UserInfo = dataObj.Data;
						_self.UserInfo.mobile = _self.Mobile
						_self.POST('/api/User/BindUnionID',{unionId:_self.unionId,openIdApplets:_self.openId,mobile:_self.Mobile},_self.UserInfo.accessToken,function(result){
							if(result.Status){
								// 111
								let mobile = uni.getStorageSync('mobile');
								_self.POST('/api/Auth/LoginByUnionID',{unionId:_self.unionId,openIdApplets:_self.openId,mobile:mobile},'',function(result1){
									if(result1.Status){
										_self.UserInfo.accessToken = result1.Data.accessToken;
										_self.UserInfo.refreshToken = result1.Data.refreshToken;
										_self.Get('/api/User/GetUserByUnionID',{},_self.UserInfo.accessToken,function(result2){
											if(result2.Status){
												//console.log('result2',result2);
												result2.Data.accessToken=_self.UserInfo.accessToken;
												result2.Data.refreshToken=_self.UserInfo.refreshToken;
												result2.Data.OpenID=_self.openId;
												result2.Data.UnionID=_self.unionId;
												_self.login(result2.Data);
												uni.setStorageSync('accessToken',_self.UserInfo.accessToken);
												uni.setStorageSync('refreshToken',_self.UserInfo.refreshToken);
												uni.setStorageSync('fullname',result2.Data.FullName);
												uni.setStorageSync('mobile',result2.Data.Mobile);
												uni.setStorageSync('headurl',result2.Data.HeadUrl);
												uni.setStorageSync('login',result2.Data);
												_self.showMsg("绑定成功！");
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
								// 111
							}
							else{
								uni.showToast({
									icon:'none',
									title:result.Message
								});
								_self.CustTime=0;
							}
							
						},'biz','application/x-www-form-urlencoded');
					}
					else{
						uni.showToast({
							icon:'none',
							title:dataObj.Message
						})
					}
				},'auth')
			}
		},
		onLoad:function(option){
			 let _self = this;
			_self.goUrl = option.goto;
			if(_self.goUrl=='undefined') _self.goUrl='';
			_self.Mobile = option.mobile;
			_self.intervalID = setInterval(function(){
				if(_self.CustTime>0)_self.CustTime--;
				else {
					_self.CustTime=0;
					clearInterval(_self.intervalID);
				}
			},1000)
		}
	}
</script>

<style lang="scss">
	page{background-color: #FFFFFF;
		.content-box{width: 690upx;margin: 0 30upx;
			.logo-box{margin: 100upx 0;text-align: center;display: flex;
					  flex-direction: column;justify-content: space-around ;align-items: center;
				.title{font-size: 58upx;margin-top: 50upx;}
				.des{color: #888888;font-size: 32upx;}
			}
			.input-box{padding:50upx;
				input{border-bottom: 1px solid #aaaaaa;height: 80upx;line-height: 80upx;font-size: 32upx;}
			}
			.sendSMS-box{text-align: right;padding-right: 50upx;margin-top: 30upx;
				.cust{color: #FF5000;}
				.sendSMS{color: #007AFF;text-decoration: underline;}
			}
			.operation-box{margin-top: 80upx;
				.btnSubmit{border-radius: 50upx;height: 100upx;line-height: 100upx;background-color: #3399FE;
						color: #FFFFFF;}
			}
		}
	}
</style>
