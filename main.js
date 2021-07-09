import Vue from 'vue'
import App from './App'
import store from './store'

Vue.config.productionTip = false

App.mpType = 'app'

//时间字符串转yyyy-mm-dd hh:mm:ss
Vue.prototype.stringToDateTime = function(str,year="-",month="-",day="") {
	if (str == null || str.length < 19) return "";
	return str.substring(0,4)+year+str.substring(5,7)+month+str.substring(8,10)+day+" "+str.substring(11,19);
}
//时间字符串转yyyy-mm-dd
Vue.prototype.stringToDate = function(str,year="-",month="-",day="") {
	if (str == null || str.length < 10) return "";
	return str.substring(0,4)+year+str.substring(5,7)+month+str.substring(8,10)+day;
}
//时间字符串转HH:mm
Vue.prototype.stringToHour = function(str) {
	if (str == null || str.length < 16) return "";
	return str.substring(11,16);
}

//提示框
Vue.prototype.showMsg= (title, duration=2000, mask=false, icon='none')=>{
	if(Boolean(title) === false) return;
	uni.showToast({title,duration,mask,icon});
}

Vue.prototype.POST=function(url,data,token,callback,type='biz',content='application/json'){
	//是否为测试
	let test = false
	let _request = test?'http://192.168.8.104:8085':'https://biz.zjxztc.com',t = this;
	if(type=='auth') _request = test?'http://192.168.8.104:8084':'https://auth.zjxztc.com';
	else if(type=='passport') _request = test?'http://192.168.8.104:8087':'https://passport.zjxztc.com';
	else if(type=='applets') _request = test?'http://192.168.8.104:8083':'https://applets.zjxztc.com'
	else if(type=='repay') _request = test?'http://192.168.8.104:8089':'https://repay.zjxztc.com'
	else if(type=='admin') _request = test?'http://192.168.8.104:8082':'https://admin.zjxztc.com'
	uni.request({
		url: _request+url,
		method: 'POST',
		header: {'content-type': content,'Authorization':'Bearer '+token},
		data: data,
		async:false,//同步属性设置为true 
		complete:(res)=> {
			uni.hideLoading();
			if(res.statusCode==200)
			{
				callback(res.data);
			}
			else if(res.statusCode==401){
				let accessToken = uni.getStorageSync('accessToken'),refreshToken = uni.getStorageSync('refreshToken');
				if(!accessToken || !refreshToken){
					  uni.reLaunch({
							  url:'/pages/login/login.vue'
							})
				}else{
					uni.request({
						url:  test?'http://192.168.8.104:8083/api/Auth/RefreshToken':'https://auth.zjxztc.com/api/Auth/RefreshToken',
						method: 'POST',
						header: {'content-type': 'application/json'},
						data:  {
								  "accessToken": accessToken,
								  "refreshToken": refreshToken
								},
						async:false,//同步属性设置为true 
						complete:(res1)=> {
							if(res1.statusCode!=200||typeof(res1.data)!="object"||res1.data.Status == false){
								  uni.reLaunch({
										  url:'/pages/login/login.vue'
										})
							}
							else{
								accessToken = res1.data.Data.accessToken;
								refreshToken = res1.data.Data.refreshToken;
								t.userInfo.accessToken = accessToken;
								t.userInfo.refreshToken = refreshToken;
								uni.setStorageSync('accessToken',accessToken);
								uni.setStorageSync('refreshToken',refreshToken);
								uni.request({
									url: _request+url,
									method: 'POST',
									header: {'content-type': content,'Authorization':'Bearer ' + accessToken},
									data: data,
									async:false,//同步属性设置为true 
									complete:(res2)=>{
										if(res2.statusCode==200){
											callback(res2.data);
										}
										else{
											this.showMsg("服务器异常!");
										}
									}
								})
							}
						}
					});
				}
			}
			else if(res.statusCode==500){
				this.showMsg("服务器错误，请重试!");
			}
			else{
				console.log(res)
				this.showMsg("未知错误，请重试!");
			}
		}
	});
}

Vue.prototype.Get=function(url,data,token,callback,type='biz',content='application/json',async=false){
	//是否为测试
	let test = false
	let _request = test?'http://192.168.8.104:8085':'https://biz.zjxztc.com',t = this;
	if(type=='auth') _request = test?'http://192.168.8.104:8084':'https://auth.zjxztc.com';
	else if(type=='passport') _request = test?'http://192.168.8.104:8087':'https://passport.zjxztc.com';
	else if(type=='applets') _request = test?'http://192.168.8.104:8083':'https://applets.zjxztc.com'
	else if(type=='repay') _request = test?'http://192.168.8.104:8089':'https://repay.zjxztc.com'
	else if(type=='admin') _request = test?'http://192.168.8.104:8082':'https://admin.zjxztc.com'
	uni.request({
		url: _request+url,
		method: 'Get',
		header: {'content-type': content,'Authorization':'Bearer '+token},
		data: data,
		async:async,//同步属性设置为true 
		complete:(res)=> {
			uni.hideLoading();
			if(res.statusCode==200)
			{
				callback(res.data);
			}
			else if(res.statusCode==401){
				let accessToken = uni.getStorageSync('accessToken'),refreshToken = uni.getStorageSync('refreshToken');
				if(!accessToken || !refreshToken){
					  uni.reLaunch({
							  url:'/pages/login/login.vue'
							})
				}else{
					uni.request({
						url: test?'http://192.168.8.104:8083/api/Auth/RefreshToken':'https://auth.zjxztc.com/api/Auth/RefreshToken',
						method: 'POST',
						header: {'content-type': 'application/json'},
						data:  {
								  "accessToken": accessToken,
								  "refreshToken": refreshToken
								},
						async:async,//同步属性设置为true 
						complete:(res1)=> {
							if(res1.statusCode!=200||typeof(res1.data)!="object"||res1.data.Status == false){
								  uni.reLaunch({
										  url:'/pages/login/login.vue'
										})
							}
							else{
								accessToken = res1.data.Data.accessToken;
								refreshToken = res1.data.Data.refreshToken;
								t.userInfo.accessToken = accessToken;
								t.userInfo.refreshToken = refreshToken;
								uni.setStorageSync('accessToken',accessToken);
								uni.setStorageSync('refreshToken',refreshToken);
								uni.request({
									url: _request+url,
									method: 'Get',
									header: {'content-type': content,'Authorization':'Bearer ' + accessToken},
									data: data,
									async:async,//同步属性设置为true 
									complete:(res2)=>{
										if(res2.statusCode==200)
										{
											callback(res2.data);
										}
										else{
											this.showMsg("服务器异常!");
										}
									}
								})
							}
						}
					});
				}
			}
			else{
				this.showMsg("服务器异常!");
			}
		}
	});
}

Vue.prototype.RefreshToken=function(accessToken,refreshToken,userInfo){
	let test = false
	uni.request({
		url: test?'http://192.168.8.104:8083/api/Auth/RefreshToken':'https://auth.zjxztc.com/api/Auth/RefreshToken',
		method: 'POST',
		header: {'content-type': 'application/json'},
		data: data,
		async:false,//同步属性设置为true 
		complete:(res)=> {
			if(res.statusCode!=200||typeof(res.data)!="object"){
				
			}
			else{
				userInfo.accessToken=res.data.Data.accessToken;
				userInfo.refreshToken=res.data.Data.refreshToken;
			}
		}
	});
}

const app = new Vue({
	store,
    ...App
})
app.$mount()