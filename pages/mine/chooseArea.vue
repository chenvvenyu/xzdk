<template>
	<view class="page">
		<view class="search-bar">
			<uni-search-bar :radius="34" @confirm="MapSearch" placeholder="小区/街道/建筑名"></uni-search-bar>
		</view>
		<view class="content">
			<view class="map-box" @touchend="touchend">
				<map class="map" id="map" ref="map" style="width: 100%; height: 300px;" :latitude="locationAddr.latitude" :longitude="locationAddr.longitude" :markers="markerPoint"></map>
				<image class="address-tag" src="../../static/images/addressTag.png" mode="aspectFit"></image>
			</view>
			<view class="mapAddress">
				<view class="item" @click="CheckIsPtInPoly(index)" v-for="(item,index) in searchAddress" :key="index">
					<view class="street"><uni-icons type="location" size="16"></uni-icons>{{item.address}}</view>
					<view class="detail">{{item.desc}}</view>
				</view>
				<view v-if="(!searchAddress || searchAddress.length<1)" class="address-row" style="color: #888888;text-align: center;padding: 15px;font-weight: bold;">
					当前区域没有检索的内容
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import VerifyHelper from '@/common/verify.js'
	import BMapLib from '../../common/utilofMap.js'
	import {
		mapState
	} from 'vuex'
	var bmap = require('../../common/bmap-wx.js');
	var BMap
	export default {
	    components: {uniSearchBar},
	    data() {
	        return {
				busyFlag : false,
				markerPoint:[{latitude:29.08624,longitude:119.5715}],
				locationAddr:{latitude:29.08624,longitude:119.5715,address:'',desc:''},
				addressComponent:{
					adcode: "",
					city: "",
					city_level: 0,
					country: "",
					country_code: 0,
					country_code_iso: "",
					country_code_iso2: "",
					direction: "",
					distance: "",
					district: "",
					province: "",
					street: "",
					street_number: "",
					town: "",
					town_code: ""
				},
				regionList:[],
				polygons:[],
				currDistrict:'',
				PostData: {
					"latitude": 0,//地址经度
					"longitude": 0,//地址纬度
					"province": "",//地址省
					"city": "",//地址市
					"district": "",//地址县/区
					"regionID": 0, //区域ID
					"region": "", //区域名称
				},
				searchAddress:[]
	        }
	    },
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		watch:{
			currDistrict:function(){
				let _self = this;
				_self.Get('/api/Region/GetRegionListByAddress?district='+_self.addressComponent.district,'',_self.userInfo.accessToken,function(res){
					console.log('/api/Region/GetRegionListByAddress?district='+_self.addressComponent.district)
					console.log(res)
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
						}
						else{
							_self.polygons=[]
							_self.regionList=[]
						}
					}
				},'biz')
			}
		},
	    methods: {
			// 搜索
			MapSearch(data){
				if(VerifyHelper.IsNull(data.value)) return
				let _self = this
				// 发起POI检索请求 
				BMap.suggestion({ 
					"query": data.value,
					"region":_self.addressComponent.city,
					success: function(res){
						_self.searchAddress=[]
						if(res.result || res.result.length>0){
							for(let i =0;i<res.result.length;i++){
								if(!VerifyHelper.IsNull(_self.addressComponent.city) && res.result[i].city!=_self.addressComponent.city) continue
								_self.searchAddress.push({
									latitude:res.result[i].location.lat,
									longitude:res.result[i].location.lng,
									address:res.result[i].address,
									desc:res.result[i].name,
									city:res.result[i].city,
									district:res.result[i].district,
									province:res.result[i].province,
									})
							}
							if(_self.searchAddress && _self.searchAddress.length>0){
								_self.markerPoint[0].latitude=_self.searchAddress[0].latitude;
								_self.markerPoint[0].longitude=_self.searchAddress[0].longitude;
								_self.locationAddr.latitude = _self.searchAddress[0].latitude
								_self.locationAddr.longitude = _self.searchAddress[0].longitude
								_self.locationAddr.address = _self.searchAddress[0].address
								_self.locationAddr.desc = _self.searchAddress[0].desc
								_self.currDistrict = _self.searchAddress[0].district;
								_self.addressComponent.province = _self.searchAddress[0].province
								_self.addressComponent.city = _self.searchAddress[0].city
								_self.addressComponent.district = _self.searchAddress[0].district
							}
							
						}
					},fail:function(){
						_self.searchAddress=[]
					}
				}); 
			},
			touchend(){
				let _self = this;
				uni.createMapContext("map",this).getCenterLocation({
					success(res){
						// 发起regeocoding检索请求 
						BMap.regeocoding({ 
							location:res.latitude+','+res.longitude,
						    success: function(data) { 
								let _obj = data.wxMarkerData;
								if(_obj && _obj.length>0){
									 _self.locationAddr.latitude = _obj[0].latitude
									 _self.locationAddr.longitude = _obj[0].longitude
									 _self.locationAddr.address = _obj[0].address
									 _self.locationAddr.desc = _obj[0].desc
									 _self.addressComponent = data.originalData.result.addressComponent
									 _self.markerPoint[0].latitude=_self.locationAddr.latitude;
									 _self.markerPoint[0].longitude=_self.locationAddr.longitude;
									 _self.currDistrict = _self.addressComponent.district;
								}
							}
						}); 
					}
				})
			},
			CheckIsPtInPoly(index){
				let _self = this
				_self.markerPoint[0].latitude=_self.searchAddress[index].latitude;
				_self.markerPoint[0].longitude=_self.searchAddress[index].longitude;
				_self.locationAddr.latitude = _self.searchAddress[index].latitude
				_self.locationAddr.longitude = _self.searchAddress[index].longitude
				_self.locationAddr.address = _self.searchAddress[index].address
				_self.locationAddr.desc = _self.searchAddress[index].desc
				// _self.currDistrict = _self.searchAddress[index].district;
				_self.addressComponent.province = _self.searchAddress[index].province
				_self.addressComponent.city = _self.searchAddress[index].city
				_self.addressComponent.district = _self.searchAddress[index].district
				if(!_self.polygons || _self.polygons.length<1){
					uni.showToast({
						icon:'none',
						title:'该区域未开通服务'
					})
					return
				}
				let _res = false
				for(let i=0;i<_self.polygons.length;i++){
					_res = (BMapLib.IsPtInPoly(_self.locationAddr.latitude,_self.locationAddr.longitude,_self.polygons[i].points))
					if(_res===true){
						let _item = {
							City:_self.regionList[i].City,
							District:_self.regionList[i].District,
							RegionID:_self.regionList[i].ID,
							Lat:_self.regionList[i].Lat,
							Lng:_self.regionList[i].Lng,
							RegionName:_self.regionList[i].Name,
							Province:_self.regionList[i].Province,
							Address:_self.locationAddr.address,
							Desc:_self.locationAddr.desc
						}
						let pages = getCurrentPages();  //获取所有页面栈实例列表
						let prevPage = pages[pages.length-2];  //上一页页面实例
						prevPage.$vm.PageReload(_item,_self);
						uni.navigateBack({delta:1})
						return
					}
				}
				uni.showToast({
					icon:'none',
					title:'该区域未开通服务'
				})
			}
	    },
		onLoad(option) {
			let _self = this
			BMap = new bmap.BMapWX(); 
			uni.getLocation({
				type:'gcj02',
				success(res){
					// 发起regeocoding检索请求
					BMap.regeocoding({ 
						location:res.latitude+','+res.longitude,
					    success: function(data) { 
							let _obj = data.wxMarkerData;
							if(_obj && _obj.length>0){
								 _self.locationAddr.latitude = _obj[0].latitude
								 _self.locationAddr.longitude = _obj[0].longitude
								 _self.locationAddr.address = _obj[0].address
								 _self.locationAddr.desc = _obj[0].desc
								 _self.searchAddress.push(_self.locationAddr)
								 _self.addressComponent = data.originalData.result.addressComponent
								 _self.markerPoint[0].latitude=_self.locationAddr.latitude;
								 _self.markerPoint[0].longitude=_self.locationAddr.longitude;
								 _self.currDistrict = _self.addressComponent.district
							}
						}
					}); 
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		*{box-sizing: border-box;}
		.search-bar{margin: 20upx 0;padding: 0 30upx;}
		.content{
			margin-top: 20upx;
			.map-box{
				position: relative;z-index: 9999;
				.address-tag{position: absolute;left: 50%;top: 50%;width: 32px;height: 32px;margin-top: -32px;margin-left: -16px;}
			}
			.mapAddress{
				background-color: #FFFFFF;border-bottom : 1px solid #f0f0f0;
				width: 100%;border-top: 1px solid #f0f0f0;
				min-height: 200px;padding: 0 30upx;
				.item{padding: 20upx 0;border-bottom: 1px solid #f0f0f0;
					.street{font-size: 15px;font-weight: bold;}
					.detail{color: #888888;font-size: 13px;}
				}
			}
			.address-box{margin-top: 10upx;padding: 0 30upx;
				.address-row{border-bottom: 1upx solid #F5F5F5;padding: 20upx 0;
					.person{height: 60upx;
						.name{color: #222222;font-size: 32upx;font-weight: bold;line-height: 60upx;margin-right: 20upx;}
						.phone{color: #666666;font-size: 28upx;line-height: 60upx;}
					}
					.des{color: #888888;height: 40upx;line-height: 40upx;}
				}
			}
		}
	}
</style>
