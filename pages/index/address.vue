<template>
	<view class="container-warp">
		<view class="title">{{Title}}</view>
		<view class="content-box">
			<view class="uni-input-group">
				<view class="uni-input-row" style="padding: 0rpx;">
					<image src="/static/images/sj_town_03.png" mode="" style="margin-top: 40rpx;"></image>
					<input class="uni-input" v-model="Address" placeholder="小区/写字楼/学校/地标建筑" disabled="false" maxlength="256" style="margin-top: 40rpx;" />
					<view @tap="ChooseArea" style="background-color: #3399FE;height: 130rpx;line-height:130rpx;color: #fff;font-size: 30rpx;text-align: center;width: 20%;">
						定位
					</view>
				</view>
				<view class="uni-input-row" hidden='true'>
					<image src="/static/images/sj_add_06.png" mode=""></image>
					<input class="uni-input" v-model="Address3" placeholder="定位地址" disabled="false" maxlength="256" />
				</view>
				<view class="uni-input-row">
					<image src="/static/images/sj_add_06.png" mode=""></image>
					<input class="uni-input" v-model="Address2" placeholder="填写具体地址(街道门牌号、单元、楼层)" maxlength="256" />
				</view>
				<view class="uni-input-row">
					<image src="/static/images/sj_name_07.png" mode=""></image>
					<input class="uni-input" v-model="Name" placeholder="联系人姓名" maxlength="16" />
				</view>
				<view class="uni-input-row">
					<image src="/static/images/sj_tel_07.png" mode=""></image>
					<input class="uni-input" v-model="Phone" type="number" placeholder="联系人电话" maxlength="12" />
				</view>
			</view>
			<view class="agreement-box">
				<label class="radio" style="margin-right: 30rpx;" @tap="agreementChange">
					<radio value="r1" color="#3399FE" :checked="Agreement" />
					添加到常用地址
				</label>
			</view>
			<view style="display: flex;align-items: center;">
				<textarea @confirm="autoConfirm" v-model="AreaV" style="border: 1px solid #C0C0C0;width: 80%;height: 100px;padding: 30rpx;box-sizing: border-box;" cursor-spacing="50" placeholder="在此粘贴信息(支持语音输入)，点击自动智能识别（推荐格式：地址<换行/空格>手机号<换行/空格>姓名）"></textarea>
				<view @tap="clickConfirm" style="width: 20%;text-align: center;background-color:#3399FE;color: #fff;height: 100px;display: flex;flex-direction: column;justify-content: center;">
					<view>智能</view>
					<view>识别</view>
				</view>
			</view>
			<view class="operation-box">
				<button type="primary" @tap="btnSubmit" class="btnSubmit">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import VerifyHelper from "@/common/verify.js?t=20201122"
	import {mapState,mapMutations} from 'vuex';
	import BMapLib from "../../common/utilofMap.js"
	var bmap = require('../../common/bmap-wx.js');
	export default{
		data() {
			return {
				Agreement:false,
				Type:'mailing',
				Title:'寄件人信息',
				
				Lng:'',
				Lat:'',
				Province:'',
				City:'',
				District:'',
				RegionID:0,
				Region:'',
				Address:'',   //定位信息
				Address2:'',  //手动填写详细地址
				Address3:'',  //定位信息关联地址
				Name:'',
				Phone:''
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		methods:{
			agreementChange:function(){
				let _self = this;
				_self.Agreement=!_self.Agreement;
			},
			ChooseArea:function(){
				// uni.navigateTo({
				// 	url: '/pages/index/newMapAddress?curr=0&type='+this.Type+'&name='+this.Name+'&phone='+this.Phone
				// })
				let _self = this;
				
				//console.log('经度：' + _self.Lng);
				//console.log('纬度：' + _self.Lat);
				
				if(_self.Lng > 0 && _self.Lat > 0){
					uni.chooseLocation({
						longitude:_self.Lng,
						latitude:_self.Lat,
					    success: function (res) {
					        //console.log('经度：' + res.longitude);
					        //console.log('纬度：' + res.latitude);
					        //console.log('定位名称：' + res.name);
					        //console.log('定位地址：' + res.address);
							
							_self.Lng = res.longitude
							_self.Lat = res.latitude
							_self.Address = res.name
							//_self.Address2 = ""
							_self.Address3 = res.address
							_self.RegionID = 0
							_self.Region = ''
							_self.location = false
							
							/*
							let address = res.address;
							
							if(address.indexOf("义乌") == -1){
								_self.Address = '';
								return uni.showToast({
											icon:'none',
											title:'该区域未开通服务1'
										});
							}
							_self.currDistrict(function(){
								//res.address = res.address.substr(9)
								console.log('定位地址：' + res.address);
								_self.locationAddr = res
								//_self.CheckIsPtInPoly();
							});
							*/
					    }
					});
				}else{
					console.log('定位当前位置');
					uni.chooseLocation({
					    success: function (res) {
					        //console.log('经度：' + res.longitude);
					        //console.log('纬度：' + res.latitude);
					        //console.log('定位名称：' + res.name);
					        //console.log('定位地址：' + res.address);
							
							_self.Lng = res.longitude
							_self.Lat = res.latitude
							_self.Address = res.name
							//_self.Address2 = ""
							_self.Address3 = res.address
							_self.RegionID = 0
							_self.Region = ''
							_self.location = false
							
							/*
							let address = res.address;
							if(address.indexOf("义乌") == -1){
								_self.Address = '';
								return uni.showToast({
											icon:'none',
											title:'该区域未开通服务'
										});
							}
							_self.currDistrict(function(){
								//res.address = res.address.substr(9)
								console.log('详细地址1：' + res.address);
								_self.locationAddr = res
								//_self.CheckIsPtInPoly();
							});
							*/
					    }
					});
				}
				return;
			},
			
			CheckIsPtInPoly(){
				console.log('CheckIsPtInPoly')
				let _self = this
				if(!_self.polygons || _self.polygons.length<1){
					_self.Address = '';
					return uni.showToast({
								icon:'none',
								title:'该区域未开通服务'
							})
				}
				let _res = false
				for(let i=0;i<_self.polygons.length;i++){
					_res = (BMapLib.IsPtInPoly(_self.locationAddr.latitude,_self.locationAddr.longitude,_self.polygons[i].points))
					if(_res===true){
						if(_self.Type=='receipt'){
							_self.Title='收件人信息';
						}else{
							_self.Title='寄件人信息';
						}
						
						_self.Lng = _self.locationAddr.longitude
						_self.Lat = _self.locationAddr.latitude
						_self.Province = _self.regionList[i].Province
						_self.City = _self.regionList[i].City 
						_self.District = _self.regionList[i].District
						_self.Address = _self.locationAddr.name
						_self.Address2 = ""
						_self.Address3 = _self.locationAddr.address
						_self.RegionID = _self.regionList[i].ID
						_self.Region = _self.regionList[i].Name
						_self.location = false
						return
					}
				}
				_self.Address = ''
				uni.showToast({
					icon:'none',
					title:'该区域未开通服务'
				})
			},
			
			// geocoding检索请求 
			GetGeo(addr){
				console.log(addr);
				if(VerifyHelper.IsNull(addr)){
					return;					
				}
				
				let _self = this;
				
				var BMap = new bmap.BMapWX();
				var city = '浙江省宁波市';
				// 发起geocoding检索请求 
				BMap.geocoding({ 
					address: city + addr,
					async:true,
				    success: function(data) { 
						console.log(data.result.location);								
						let _obj = data.result.location;
						if(_obj){
							 _self.Lng = _obj.lng
							 _self.Lat = _obj.lat
							 
							 _self.Address = _self.Address2;
							 _self.Address2 = '';
						}
					},
					fail: function(data){	
						console.log(data);	
						_self.showMsg('地址无效，请修改后重试');
						return;							
					}
				}); 
				
			},
			
			/*
			currDistrict:function(callback){
				console.log('currDistrict')
				let _self = this;
				_self.Get('/api/Region/GetRegionListByAddress?district='+'义乌市','',_self.userInfo.accessToken,function(res){
					if(res.Status){
						if(res.Data && res.Data.length>0){
							_self.regionList = res.Data
							for (let i=0;i<res.Data.length;i++) {
								let obj = {
									points:[],
									strokeWidth:1,
									strokeColor:'#000000',
									fillColor:'#ffffff'
								}
								let _range=JSON.parse(res.Data[i].RangeGCJ02)
								if(_range && _range.length>0){
									for(let j=0;j<_range.length;j++){
										let item={
											latitude:_range[j].lat,
											longitude:_range[j].lng
										}
										obj.points.push(item)
									}
								}
								_self.polygons.push(obj)
							}
							callback();
						}
						else{
							_self.polygons=[]
							_self.regionList=[]
						}
					}else{
						return uni.showToast({
							icon:'none',
							title:'网络信号太差，定位失败'
						})
					}
				},'biz')
				
			},
			*/
			
			// 填写智能识别
			autoConfirm:function(e){
				//console.log(e.detail.value);
				let v = e.detail.value
				let t = this
				let arr = []
				if(v){
					let is_Phone = false
					v = v.replace(/[\n，, ]+/g,',')
					console.log('v',v)
					v = v.split(',')
					for (var i = 0; i < v.length; i++) {
						if(VerifyHelper.IsPhone(v[i])){
							is_Phone = true
							t.Phone = v[i];
						}else{
							arr.push(v[i])
						}
					}
					
					if(!is_Phone){
						return	uni.showToast({
									icon:'none',
									title:'未识别出11位手机号码'
								});
					}
					console.log('arr',arr)
					if(arr[0].length < arr[1].length){
						t.Name = arr[0]
						t.Address2 = arr[1]
						t.location = true
					}
					if(arr[0].length > arr[1].length){
						t.Name = arr[1]
						t.Address2 = arr[0]
						t.location = true
					}
				}
			},	
			
			// 点击智能识别
			clickConfirm:function(){
				let t = this
				let v = t.AreaV
				
				let arr = []
				if(v){
					console.log(v)
					v = v.replace("收货人：",",")
					v = v.replace("收货地址：",",")
					v = v.replace("手机：",",") 
					console.log(v)
					
					let is_Phone = false
					
					
					// 连续的字符串
					var regex = /[1][3-9]\d{9}/g
					regex.test(v); 
					//console.log(regex.test(v))
					var result = v.match(regex);
					
					if (result !=null && result.length > 0) {
						v = v.replace(result[0],','+result[0]+',')
					}
					else {
						console.log("固定电话识别")
						var regex2 = /0?(579)?8[1-9]{7}/g
						var result2 = v.match(regex2);
						if (result2 !=null && result2.length > 0) {
							v = v.replace(result2[0],','+result2[0]+',')
						}
					}
					//console.log(v)
					v = v.replace(/[\n，, ]+/g,',')
					//console.log('v',v)
					v = v.split(',')
					for (var i = 0; i < v.length; i++) {
						if(VerifyHelper.IsPhone(v[i]) || VerifyHelper.IsFixPhone(v[i])){
							is_Phone = true
							t.Phone = v[i];
						}else{
							arr.push(v[i])
						}
					}
					if(!is_Phone){
						return	uni.showToast({
									icon:'none',
									title:'未识别出有效的电话号码'
								});
					}
					console.log('arr',arr)
					
					for (var i = 0; i < arr.length; i++) {
						if(arr[i] == '' || arr[i] == '浙江省' || arr[i] == '金华市' || arr[i] == '宁波市'){
							arr.splice(i,1);
							i--;
						}
					}
					
					console.log('arr',arr);
					
					var name ='';
					var addr = '';
					for (var i = 0; i < arr.length; i++) {
						console.log("curr:" + arr[i]);
						if(i == 0){
							name = arr[i];
							addr = arr[i];
						}
						
						for (var j = 0; j < arr.length; j++) {
							
							if(i != j){
								if(addr.length < arr[j].length)
								{
									addr = arr[j];
								}
								
								if(name.length > arr[j].length)
								{
									name = arr[j];
								}
								
								console.log('name:',name);
								console.log('addr:',addr);
								console.log('---------');
								t.Name = name;
								t.Address2 = addr;
								t.location = true;
							}
						}
					}
					
					/*
					if(arr[0].length < arr[1].length){
						t.Name = arr[0]
						t.Address2 = arr[1]
						t.location = true
					}
					if(arr[0].length > arr[1].length){
						t.Name = arr[1]
						t.Address2 = arr[0]
						t.location = true
					}
					*/
					
					t.GetGeo(t.Address2);
				}
			},
			
			PageReload:function(data,type='area'){
				let _self = this;
				if(data!=null){
					_self.RegionID = data.RegionID;
					_self.Region = data.Region;
					if(type=="address"){
						_self.Address = data.Address;
						_self.Phone = data.Phone;
						_self.Name = data.Name;
					}
				}
			},
			
			btnSubmit:function(){
				let _self = this;
				
				if(VerifyHelper.IsNull(_self.Lng) || VerifyHelper.IsNull(_self.Lat) || VerifyHelper.IsNull(_self.Address)){
					if(VerifyHelper.IsNull(_self.Address2)){
						_self.showMsg('请选择定位或填写地址');
						return;
					}
					else {
						_self.GetGeo(_self.Address2);
					}
				}
				
				/*
				if(!VerifyHelper.IsInt(_self.RegionID) || Number(_self.RegionID)<0 || VerifyHelper.IsNull(_self.Region) || VerifyHelper.IsNull(_self.Address)){
					_self.showMsg('请选择地点');
					return;
				}
				if(_self.location == true){
					_self.showMsg('请选择定位信息！');
					return;
				}
				if(VerifyHelper.IsNull(_self.Address2)){
					_self.showMsg('请填写街道门牌号、楼层！');
					return;
				}
				*/
			   
				if(VerifyHelper.IsNull(_self.Name)){
					_self.showMsg('请输入联系人姓名！');
					return;
				}
				
				if(_self.Phone.length == 0){
					_self.showMsg('请输入联系人电话');
					return;
				}
				
				console.log(VerifyHelper.IsFixPhone(_self.Phone))
				
				if(!VerifyHelper.IsPhone(_self.Phone) && !VerifyHelper.IsFixPhone(_self.Phone)){
					//_self.showMsg('请输入11位手机号码');
					_self.showMsg('请输入有效的电话号码');
					return;
				}
				
				
				let pages = getCurrentPages();  //获取所有页面栈实例列表
				let _tagiIndex = -1;
				let _thisIndex = -1;
				for (let i = 0;i<pages.length;i++) {
					if(pages[i].route == 'pages/index/index')_tagiIndex = i;
					if(pages[i].route == _self.$scope.route) _thisIndex = i;
				}
				let prevPage = pages[_tagiIndex];  //上一页页面实例
				
				console.log(_self);
				
				if(VerifyHelper.IsNull(_self.Lng) || VerifyHelper.IsNull(_self.Lng) || VerifyHelper.IsNull(_self.Address)){
					_self.showMsg('网络繁忙，请重试');
					console.log("空值，不能提交");
					return;		
				}
				else {
					console.log("可以返回提交");					
				}
				
				let _item={
					Lng:_self.Lng,
					Lat:_self.Lat,
					Province:_self.Province,
					City:_self.City,
					District:_self.District,
					RegionID:_self.RegionID,
					Region:_self.Region,
					Address:_self.Address,
					Address2:_self.Address2,
					Address3:_self.Address3,
					Name:_self.Name,
					Phone:_self.Phone,
				}
				prevPage.$vm.PageReload(_item,_self.Type,_self.Address,_self.Address2);
				
				if(_self.Agreement){
					let _param = {
					  lng:_self.Lng,
					  lat:_self.Lat,
					  province:_self.Province,
					  city:_self.City,
					  district:_self.District,
					  regionID: _self.RegionID,
					  regionName: _self.Region,
					  address: _self.Address,
					  address2:_self.Address2,
					  address3:_self.Address3,
					  fullName: _self.Name,
					  phone: _self.Phone,
					  remark: "",
					  IsDefault:false
					}
					if(_self.Type == 'receipt') _param.type = 1
					else _param.type = 2
					_self.POST('/api/User/CreateCommonlyUsedContact',_param,_self.userInfo.accessToken,function(res){})
				}
				
				uni.navigateBack({delta:(_thisIndex-_tagiIndex)})
			}
		},
		
		onLoad:function(option){
			let _self = this;
			_self.Type = option.type;
			//console.log('type',_self.Type);
			
			let _res = JSON.parse(decodeURIComponent(option.address))
			
			//console.log(_res);
			if(_self.Type=='receipt'){
				_self.Title='收件人信息';
			}
			
			_self.Lng=_res.Lng|| ''
			_self.Lat=_res.Lat|| ''
			_self.Address = _res.Address
			_self.Address2 = _res.Address2 ? _res.Address2 : _self.Address2
			_self.Address3 = _res.Address3 ? _res.Address3 : ''
			_self.Province=_res.Province|| ''
			_self.City=_res.City|| ''
			_self.District=_res.District|| ''
			_self.Name = _res.FullName || ''
			_self.Phone = (_self.Type!=='receipt' && (!_res.Phone || _res.Phone.length!=11)) ? _self.userInfo.Mobile:_res.Phone
			_self.RegionID = _res.RegionID
			_self.Region = _res.RegionName
		}
		
	}
</script>

<style lang="scss">
	page{background-color: #FFFFFF;width: 690upx;margin: 0 30upx;
		.uni-input{padding: 0 !important;}
		.title{font-size: 20px;font-weight: bold;}
		.content-box{margin:0 20upx;padding-top: 50upx;
			.uni-input-group{
				.uni-input-row{padding: 40upx 0;}
				.uni-input-row image,.uni-input-row input{
					width: 50upx;
					height: 50upx;
					line-height: 50upx;
				}
				.uni-input-row input{margin-left: 20upx;font-size: 28upx;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
			}
			.agreement-box {margin: 40upx 0;padding: 0 30upx;font-size: 32upx;color: #666666;}
			.operation-box{margin-top: 60upx;
				.btnSubmit{border-radius: 50upx;height: 100upx;line-height: 100upx;background-color: #3399FE;
						color: #FFFFFF;font-size: 40upx;}
			}
		}
		
		
	}
	
</style>
