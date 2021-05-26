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
				<view class="uni-input-row">
					<label class="radio" style="margin-right: 30rpx;" @tap="MoneyRadioChange">
						<radio value="r1" color="#3399FE" :checked="IsDefault" />
						默认地址
					</label>
				</view>
				<view style="display: flex;align-items: center;">
					<textarea v-model="AreaV" style="border: 1px solid #C0C0C0;width: 80%;height: 100px;padding: 30rpx;box-sizing: border-box;" cursor-spacing="50" placeholder="在此粘贴信息(支持语音输入)，点击自动智能识别（推荐格式：地址<换行/空格>手机号<换行/空格>姓名）"></textarea>
					<view @tap="clickConfirm" style="width: 20%;text-align: center;background-color:#3399FE;color: #fff;height: 100px;display: flex;flex-direction: column;justify-content: center;">
						<view>智能</view>
						<view>识别</view>
					</view>
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
	import BMapLib from "../../common/utilofMap.js"
	var bmap = require('../../common/bmap-wx.js');
	export default{
		data() {
			return {
				Title:'编辑',
				ID:'',
				Lng:'',
				Lat:'',
				Address:'',
				Address2:'',
				Address3:'',
				Name:'',
				Phone:'',
				Province:'',
				City:'',
				District:'',
				IsDefault:false,
				type:2,
				polygons:[],
				is_location:false,
				RegionID:0,
				Region:'',
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		methods:{
			MoneyRadioChange(){
				this.IsDefault = !this.IsDefault
			},
			
			// geocoding检索请求 
			GetGeo(addr){
				//console.log(addr);
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
			
			// 智能识别
			clickConfirm:function(){
				let t = this
				let v = t.AreaV
				let arr = []
				if(v){
					let is_Phone = false
					
					// 连续的字符串
					var regex = /[1][3-9]\d{9}/g
					//regex.test(v); 
					//console.log(regex.test(v))
					var result = v.match(regex);
					
					if (result !=null && result.length > 0) {
						v = v.replace(result[0],','+result[0]+',')
					}
					else {
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
					if(arr[0].length < arr[1].length){
						t.Name = arr[0]
						t.Address2 = arr[1]
						t.is_location = true
					}
					if(arr[0].length > arr[1].length){
						t.Name = arr[1]
						t.Address2 = arr[0]
						t.Lat = 0
						t.is_location = true
					}
					
					t.GetGeo(t.Address2);
				}
			},
			
			//选择定位
			ChooseArea:function(){
				// uni.navigateTo({
				// 	url:'/pages/mine/chooseArea'
				// })
				let _self = this;
				if(_self.Lat.length == 0){
					console.log('新增')
					uni.chooseLocation({
					    success: function (res) {
					        //console.log('纬度：' + res.latitude);
					        //console.log('经度：' + res.longitude);
					        //console.log('位置名称：' + res.name);
					        //console.log('详细地址：' + res.address);
							
							
							_self.Lng = res.longitude
							_self.Lat = res.latitude
							_self.Address = res.name
							//_self.Address2 = ""
							_self.Address3 = res.address
							_self.RegionID = 0
							_self.Region = ''
							_self.location = true
							
							/*
							if(address.indexOf("义乌") == -1){
								_self.Address = '';
								return uni.showToast({
											icon:'none',
											title:'该区域未开通服务'
										});
							}
							
							_self.currDistrict(function(){
								res.address = res.address.substr(9)
								console.log('详细地址1：' + res.address);
								_self.locationAddr = res
								_self.CheckIsPtInPoly();
							});
							*/
					    }
					});
				}else{
					uni.chooseLocation({
						latitude:_self.Lat,
						longitude:_self.Lng,
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
								res.address = res.address.substr(9)
								console.log('详细地址1：' + res.address);
								_self.locationAddr = res
								_self.CheckIsPtInPoly();
							});
							*/
					    }
					});
				}
				return;
			},
			
			// 判断区域
			CheckIsPtInPoly:function(){
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
						_self.is_location = false
						_self.RegionID = _self.regionList[i].ID
						_self.Region = _self.regionList[i].Name
						_self.Address = _self.locationAddr.name
						//_self.Address2 = ''
						_self.Address3 = _self.locationAddr.address
						_self.Province = _self.regionList[i].Province
						_self.City = _self.regionList[i].City 
						_self.District = _self.regionList[i].District
						_self.Lat = _self.locationAddr.latitude
						_self.Lng = _self.locationAddr.longitude
						return
					}
				}
				_self.Address = ''
				uni.showToast({
					icon:'none',
					title:'该区域未开通服务'
				})
			},
			
			// 根据城市读取区域
			currDistrict:function(callback){
				console.log('currDistrict')
				let _self = this;
				_self.Get('/api/Region/GetRegionListByAddress?district='+'宁波市','',_self.userInfo.accessToken,function(res){
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
			
			// 回传
			PageReload:function(data){
				let _self = this;
				if(data!=null){
					_self.Lng = data.Lng;
					_self.Lat = data.Lat;
					_self.Address = data.Address;
					_self.Address2 = data.Address2;
					_self.Address3 = data.Address3;
					_self.Province = data.Province;
					_self.City = data.City;
					_self.District = data.District;
					_self.IsDefault  = data.IsDefault;
					_self.RegionID = data.RegionID;
					_self.Region = data.RegionName;
				}
			},
			
			// 保存
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
					_self.showMsg('请选择区域');
					return;
				}
				if(_self.is_location == true){
					_self.showMsg('请选择位置！');
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
					_self.showMsg('请输入联系人电话！');
					return;
				}
				
				if(!VerifyHelper.IsPhone(_self.Phone) && !VerifyHelper.IsFixPhone(_self.Phone)){
					//_self.showMsg('请输入11位手机号码');
					_self.showMsg('请输入有效的电话号码');
					return;
				}
				
				let _url = Number(_self.ID) <= 0 ?'/api/User/CreateCommonlyUsedContact':'/api/User/UpdateCommonlyUsedContact';
				let _Address = _self.Address ? _self.Address : ''
				// _Address = _Address.replace("浙江省金华市义乌市","").replace("浙江省","").replace("浙江","").replace("金华市","").replace("金华","").replace("义乌市","").replace("义乌","")
				let _Address2 = _self.Address2 ? _self.Address2 : ''
				let _Address3 = _self.Address3 ? _self.Address3 : ''
				//_Address2 = _Address2.replace("浙江省金华市义乌市","")
				
				let _param = {
					"id": _self.ID,
				  fullName: _self.Name,
				  phone: _self.Phone,
				  address: _Address,
				  address2:_Address2,
				  address3:_Address3,
				  regionID: _self.RegionID,
				  regionName: _self.Region,
				  remark: "",
				  province:_self.Province,
				  city:_self.City,
				  district:_self.District,
				  lng:_self.Lng,
				  lat:_self.Lat,
				  IsDefault:_self.IsDefault
				}
				if(Number(_self.ID) <= 0){
					_param.type = _self.type
				}
				_self.POST(_url,_param,_self.userInfo.accessToken,function(res){
					if(res.Status){
						_self.showMsg('操作成功！');
						let pages = getCurrentPages();  //获取所有页面栈实例列表
						
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
						
						if(pages[pages.length-3].route == "pages/index/index")
						{
							let type = _self.type === '2' ? 'mailing' : 'receipt'	
							let prevPage = pages[pages.length-3];  //上一页页面实例					
							prevPage.$vm.PageReload(_item,type,_self.Address,_self.Address2);
							uni.navigateBack({delta:2})
						}
						else
						{
							let prevPage = pages[pages.length-2];  //上一页页面实例
							prevPage.$vm.loadData();
							uni.navigateBack({delta:1})
						}
					}
					else _self.showMsg(res.Message);
				})
			}
		},
		
		onLoad:function(option){
			let _self = this;
			let _data = option.data;
			_self.type = option.type;
			
			console.log(_self.type);
			
			if(!VerifyHelper.IsNull(_data)){
				let _item = JSON.parse(decodeURIComponent(_data));
				console.log('_item',_item)
				_self.ID=_item.ID
				_self.RegionID=_item.RegionID
				_self.Region=_item.Region
				_self.Address=_item.Address
				_self.Address2=_item.Address2
				_self.Address3=_item.Address3
				_self.Phone=_item.Phone
				_self.Name=_item.FullName
				_self.Province=_item.Province
				_self.City=_item.City
				_self.District=_item.District
				_self.Lng=_item.Lng
				_self.Lat=_item.Lat
				_self.IsDefault  = _item.IsDefault
			}
			if(!VerifyHelper.IsInt(_self.ID) || Number(_self.ID)<0){
				_self.Title='添加';
				_self.ID = -1;
			}
			else _self.Title='编辑';
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
					width: 60upx;
					height: 60upx;
					line-height: 60upx;
				}
				.uni-input-row input{margin-left: 20upx;font-size: 32upx;}
			}
			.agreement-box {margin: 40upx 0;padding: 0 30upx;font-size: 32upx;color: #666666;}
			.operation-box{margin-top: 60upx;
				.btnSubmit{border-radius: 50upx;height: 100upx;line-height: 100upx;background-color: #3399FE;
						color: #FFFFFF;font-size: 40upx;}
			}
		}	
	}
</style>
