<template>
	<view class="page">
		<view class="uni-form-item uni-column">
		    <view class="title">旧密码</view>
		    <view class="uni-input-wrapper">
		        <input class="uni-input" password="true" v-model="Oldpwd" placeholder="请输入旧密码" />
		    </view>
		</view>
		<view class="uni-form-item uni-column">
		    <view class="title">新密码</view>
		    <view class="uni-input-wrapper">
		        <input class="uni-input" password="true" v-model="pwd" placeholder="请输入新密码" />
		    </view>
		</view>
		<view class="uni-form-item uni-column">
		    <view class="title">确认密码</view>
		    <view class="uni-input-wrapper">
		        <input class="uni-input" password="true" v-model="againPwd" placeholder="请输入确认密码" />
		    </view>
		</view>
		<!-- <view class="uni-form-item uni-column">
		    <view class="title">短信验证码</view>
		    <view class="uni-input-wrapper">
		        <input class="uni-input" v-model="code" placeholder="请输入短信验证码" />
		        <text class="uni-icon">发送验证码</text>
		    </view>
		</view> -->
		<view class="uni-form-item uni-column">
			<view class="btn" @tap="btnSubmit">确认修改</view>
		</view>
		
	</view>
</template>

<script>
	import VerifyHelper from "@/common/verify.js"
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				Oldpwd:'',
				pwd:'',
				againPwd:'',
				code:'',
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			btnSubmit(){
				let _self = this;
				if(VerifyHelper.IsNull(_self.pwd)){
					_self.showMsg('新密码不能为空！')
					return;
				}
				if(_self.pwd.length<6 || _self.pwd.length>32)
				{
					_self.showMsg('密码长度错误，6-32字符')
					return;
				}
				if(VerifyHelper.IsNull(_self.againPwd)){
					_self.showMsg('确认密码不能为空！')
					return;
				}
				if(_self.pwd!=_self.againPwd){
					_self.showMsg('两次密码不一致，请重新输入！')
					return;
				}
				let _param = {
					"passwordOld": _self.Oldpwd,
					"passwordNew": _self.pwd
				}
				_self.POST('/api/User/ModifyPassword',_param,_self.userInfo.accessToken,function(res){
					if(res.Status){
						uni.showToast({
							icon:'success',
							title:'修改成功'
						})
					}
					else _self.showMsg(res.Message);
				})
			}
		},
		onLoad(){
			
		},
	}
</script>

<style>
	.page{padding-top:100upx}
	.uni-form-item .title{font-size:32upx;padding:10upx 40upx}
	.uni-input-wrapper{display:flex;margin:0 40upx;flex-direction:row;flex-wrap:nowrap;border-bottom:1px solid #e6e6e6}
	.uni-input{height:80upx;line-height:60upx;padding:0 20upx 0 0;flex:1}
	.uni-icon{font-size:28upx;height:80upx;line-height:80upx}
	.tip{text-align: center;color: #999;font-size: 34upx;margin-top: 90upx;}
	.btn{height: 100upx;width: 670upx;margin: 40upx;border-radius: 50upx;background: linear-gradient(120deg, #3399FE 0%, #3399FE 100%);color: #FFFFFF;font-size: 36upx;line-height: 100upx;box-shadow: 0 0 20upx #ccc;text-align: center;}
</style>
