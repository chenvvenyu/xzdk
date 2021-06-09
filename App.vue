<script>
	import Vue from 'vue';
	import {mapState,mapMutations} from 'vuex';
	import VerifyHelper from "@/common/verify.js";
	export default {
		onLaunch: function() {
			this.GetUserInfo();
			this.getMenuInfo();
			this.getAppState();
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		},
		computed:{
			...mapState(['hasLogin','userInfo','unionId','openId'])
		},
		methods:{
			// 映射login状态到页面示例中，可以直接访问，实时获取Mutations的值
			...mapMutations(['login','setMenuInfo','setUserType']),
			//获取微信数据
			GetUserInfo() {
				let _self=this;
				uni.login({//获取code
					provider: 'weixin',
					success(loginRes) {
						wx.getSetting({//判断是否授权
							success(settingRes) {
								if (settingRes.authSetting['scope.userInfo']) {//已授权直接获取用户信息
									uni.getUserInfo({//获取用户信息
										provider: 'weixin',
										success(infoRes) {
											_self.Decode(loginRes.code,infoRes.encryptedData,infoRes.iv);
										},
										fail(infoRes) {
											uni.reLaunch({url:"/pages/login/login"});
										}
									});
								}
								else{//未授权等待用户主动授权
									let openId = uni.getStorageSync('openId');
									let unionId = uni.getStorageSync('unionId');
									if(!VerifyHelper.IsNull(openId)){
										_self.LoginByUnionID(unionId,openId);
									}else{
										uni.reLaunch({url:"/pages/login/login"});
									}
								}
							}
						});						
					}
				});
			},
			Decode(code,encryptedData,iv){
				let _self=this;
				let postData={
					code:code,
				}
				_self.POST('/api/Pay/GetAppletsOpenidUnionid',postData,'',function(res){
					uni.setStorageSync('unionId',res.Data.unionid);
					uni.setStorageSync('openId',res.Data.openid);
					_self.LoginByUnionID(res.Data.unionid,res.Data.openid);
				},'applets','application/x-www-form-urlencoded')
				
			},
			LoginByUnionID(unionId,openId){
				let _self=this;
				let mobile = uni.getStorageSync('mobile');
				_self.POST('/api/Auth/LoginByUnionID',{unionId:unionId,openIdApplets:openId,mobile:mobile},'',function(result){
					if(result.Status){
						//console.log('result1',result)
						_self.Get('/api/User/GetUserByUnionID',{},result.Data.accessToken,function(result2){
							if(result2.Status){
								result2.Data.accessToken=result.Data.accessToken;
								result2.Data.refreshToken=result.Data.refreshToken;
								result2.Data.OpenID=openId;
								uni.setStorageSync('accessToken',result.Data.accessToken);
								uni.setStorageSync('refreshToken',result.Data.refreshToken);
								uni.setStorageSync('login',result2.Data);
								_self.setUserType(result2.Data.UserType)
								uni.setStorageSync('fullname',result2.Data.FullName);
								uni.setStorageSync('mobile',result2.Data.Mobile);
								uni.setStorageSync('headurl',result2.Data.HeadUrl);
								uni.setStorageSync('UserId',result2.Data.ID)
								_self.login(result2.Data);
								//uni.reLaunch({url:'/pages/index/index'});
							}
							//else uni.reLaunch({url:"/pages/login/login"});
						},'biz');
					}
					else{
						_self.getPage()
					}
					//else uni.reLaunch({url:"/pages/login/login"});
				},'auth','application/x-www-form-urlencoded');
			},
			//获取微信小胶囊信息
			getMenuInfo(){
				let MenuInfo = uni.getMenuButtonBoundingClientRect();
				this.setMenuInfo(MenuInfo);
			},
			//获取小程序版本
			getAppState(){
				 if (wx.canIUse("getUpdateManager")) {
				            const updateManager = wx.getUpdateManager();
				            updateManager.onCheckForUpdate((res) => {
				                console.log('onCheckForUpdate====', res);
				                if (res.hasUpdate) {
				                    updateManager.onUpdateReady(function () {
				                        wx.showModal({
				                            title: '更新提示',
				                            content: '新版本已经准备好，是否重启应用？',
				                            success: function (res) {
				                                if (res.confirm) {
				                                    updateManager.applyUpdate();
				                                }
				                            }
				                        })
				                    });
				                    updateManager.onUpdateFailed(function () {
				                        // 新的版本下载失败
				                        wx.showModal({
				                            title: '已经有新版本了哟~',
				                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
				                        })
				                    })
				                };
				            });
				        } else {
				            wx.showModal({
				                title: '提示',
				                content: '当前微信版本过低，无法使用更新小程序版本功能，请升级到最新微信版本后重试。'
				            })
				        }
			},
			//获取页面栈
			 getPage(){
				const page = getCurrentPages()[0].route
				if(page == 'pages/mine/mine'){
					uni.setStorageSync('mine',1)
					uni.reLaunch({
					    url:'/pages/login/login',
						
					});
				}
			}
		}

	}
</script>

<style>
	@import url("/common/uni.css");
	/*每个页面公共css */
	*{margin: 0;padding: 0;}
	.container-warp{min-height: 100vh;height:auto;}
	.fl{float: left;}
	.fr{float: right;}
	.clr{clear: both;}
</style>
