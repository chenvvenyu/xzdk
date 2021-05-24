<template>
	<view class="container-warp">
		<view class="top-left" @tap="btnMime" :style="{top:menuInfo.top +'px !important'}">
			<image :src="HeadUrlDeal(userInfo.HeadUrl)"></image>
		</view>
		<view class="top-right" @tap="btnOrder" hidden="true">
			<image src="/static/images/dt_false_zc_03.png"></image>
		</view>

		<swiper class="banner-index" autoplay="1" interval="3000" duration="2000">
			<swiper-item v-for="(item,index) in banerImg" :key="index">
				<image class="img" :src="item.Url" mode="aspectFill"></image>
			</swiper-item>
		</swiper>

		<view class="content-block-size">
			<view class="cont_block">
				<view class="con-address">
					<view class="address-item">
						<view class="uni-flex uni-row">
							<view class="tag">寄</view>
							<view class="content">
								<view class="address-sou" @tap="btnAddress1('mailing',0)">
									<view class="title">{{PostData.mailingAddress}}</view>
									<view class="title">{{PostData.mailingAddress2}}</view>
									<view class="title" hidden='true'>{{PostData.mailingAddress3}}</view>
									<view class="text">{{PostData.mailingPersonName}} {{PostData.mailingPhone}}</view>
								</view>
							</view>
							<view class="btn">
								<view class="box" text="常用地址" @tap="btnAddress('mailing',0)">
									常用<br />
									地址
									<!--<uni-icons type="location" size="30"></uni-icons>-->
								</view>
							</view>
						</view>
					</view>
					<view class="address-item">
						<view class="uni-flex uni-row">
							<view class="tag" style="background-color: rgb(223,57,67);">收</view>
							<view class="content">
								<view class="address-sou" @tap="btnAddress1('receipt',0)">
									<view class="title">{{PostData.receiptAddress}}</view>
									<view class="title">{{PostData.receiptAddress2}}</view>
									<view class="text">{{PostData.receiptPersonName}} {{PostData.receiptPhone}}</view>
								</view>
							</view>
							<view class="btn">
								<view class="box" text="常用地址" @tap="btnAddress('receipt',1)">
									常用<br />
									地址
									<!--<uni-icons type="location" size="30"></uni-icons>-->
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="!IsShowOutlet" class="content-block-size">
			<view class="cont_block">
				<view class="jj_title">选择寄件方式</view>
				<view class="jj-type">
					<view @tap="TypeClick(true)" class="type-item" :class="{'type-active':PostData.expedited}">
						<view class="title">当日达</view>
						<view class="image">
							<image mode="widthFix" src="../../static/images/dt_fast_03.png"></image>
						</view>
						<view class="tag"
							:style="{'background-color':PostData.expedited? '#3399FE':'#f7f7f7','color':PostData.expedited? '#ffffff':'#222222'}">
							省时</view>
					</view>
					<view @tap="TypeClick(false)" class="type-item" :class="{'type-active':!PostData.expedited}">
						<view class="title">次日达</view>
						<view class="image">
							<image mode="widthFix" src="../../static/images/dt_people_03.png"></image>
						</view>
						<view class="tag"
							:style="{'background-color':!PostData.expedited? '#3399FE':'#f7f7f7','color':!PostData.expedited? '#ffffff':'#222222'}">
							省钱</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="!IsShowOutlet" class="agreement-box">
			<label class="radio" style="margin-right: 30rpx;" @tap="agreementChange">
				<radio value="r1" color="#3399FE" :checked="Agreement" />
				我已阅读并同意<text @click.stop="GoWebview('userAgreement')">《服务协议》</text>和<text
					@click.stop="GoWebview('pivacyPolicy')">《隐私政策》</text>
			</label>
			<button @tap="btnSubmit" class="btnSubmit" type="primary">确定</button>
		</view>

		<view v-if="ShadeShow" class="shade" @tap="shadeClick">
			<view class="shade-content" @tap.stop="">
				<view class="title">物品信息</view>
				<view class="goodsInfo-box">
					<view class="goodsInfo-item fl" :class="{'goods-active':GoodsIndex==index}"
						v-for="(item,index) in GoodsList" :key="index" @tap="GoodsItemClick(index)">
						{{item}}
					</view>
					<view class="clr"></view>
				</view>
				<view class="money-box">
					<view style="margin-bottom: 10px;">
						<view class="fl">付款方式</view>
						<view class="fr">
							<label class="radio" style="margin-right: 30rpx;" @tap="FareArrivePayChange(true)">
								<radio value="r1" color="#3399FE" :checked="PostData.fareArrivePay" />
								到付
							</label>
							<label class="radio" style="margin-right: 30rpx;" @tap="FareArrivePayChange(false)">
								<radio value="r1" color="#3399FE" :checked="!PostData.fareArrivePay" />
								寄付
							</label>
						</view>
						<view class="clr"></view>
					</view>
					<view>
						<view class="fl">代收货款</view>
						<view class="form_swithch">
							<view class="text">无</view>
							<switch :checked="moneyRadio" @change="MoneyRadioChange()" color="#3399FE" />
							<view class="text" :class="{select:moneyRadio}">有</view>
							<!-- <label class="radio" style="margin-right: 30rpx;" @tap="MoneyRadioChange(false)">
								<radio value="r1" color="#3399FE" :checked="!moneyRadio" />
								无
							</label>
							<label class="radio" style="margin-right: 30rpx;" @tap="MoneyRadioChange(true)">
								<radio value="r1" color="#3399FE" :checked="moneyRadio" />
								有
							</label> -->
						</view>
						<view class="clr"></view>
					</view>
					<view class="money-1">
						<view class="fl uni-text-gray">代收货款金额</view>
						<view class="fr">
							<input class="input-money" type="number" placeholder="货款金额"
								:style="{'background-color':moneyRadio?'#ffffff':'#aaa','border':'1upx solid #aaa'}"
								:disabled="!moneyRadio" v-model="PostData.goodsPrice" />
						</view>
						<view class="clr"></view>
					</view>
					<view class="money-1">
						<view class="fl uni-text-gray" style="color: #000000;">物品件数</view>
						<view class="fr position">
							<!-- <picker-view mode="selector" value="1" :range="goodsCountList">
								<view class="picker"></view>
							</picker-view> -->
							<input class="input-money" type="number" min="0" placeholder="物品件数"
								style="border:1upx solid #aaa" v-model="PostData.goodsCount" />
							<view class="unit">件</view>
						</view>
						<view class="clr"></view>
					</view>
					<view class="money-1">
						<view class="fl uni-text-gray" style="color: #000000;">物品重量</view>
						<view class="fr position">
							<input class="input-money" type="number" min="3" maxlength="300" max="300"
								placeholder="物品重量" style="border:1upx solid #aaa" v-model="PostData.weight" />
							<view class="unit">kg</view>
						</view>
						<view class="clr"></view>
					</view>
				</view>
				<!-- <view>
					<input type="number" min="3" max="300" v-model="PostData.weight" placeholder="" />
					<view style="font-size: 32upx;margin: 30upx 0;text-align: center;">{{PostData.weight}}千克</view>
					<slider value="3" @changing="sliderChange" activeColor="#e9e9e9" min="3" max="30" />
				</view> -->
				<button @tap="btnLoad" class="btnSubmit" type="primary">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import VerifyHelper from "@/common/verify.js"
	var bmap = require('../../common/bmap-wx.js');
	import {
		mapState
	} from 'vuex';
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import BMapLib from '../../common/utilofMap.js'
	var BMap
	var _timeInterval;
	var IntervalTimes = 0;
	export default {
		components: {
			uniIcons
		},
		data() {
			return {
				locationAddr: {},
				timeArray: ['8:00~9:00', '8:00~9:00', '8:00~9:00', '8:00~9:00'],
				timeIndex: 0,
				ShadeShow: false,
				IsShowOutlet: false,
				OutletList: [],
				Agreement: false,
				moneyRadio: false,
				locationPoint: {
					latitude: 0,
					longitude: 0
				},
				PostData: {
					"mailingLng": "", //寄件地址经度
					"mailingLat": "", //寄件地址纬度
					"mailingRegionID": 0, //寄件区域ID
					"mailingRegion": "", //寄件区域名称
					"mailingProvince": "", //寄件省
					"mailingCity": "", //寄件市
					"mailingDistrict": "", //寄件县/区
					"mailingAddress": "从哪儿寄出?", //寄件定位名称
					"mailingAddress2": '', //寄件地址
					"mailingAddress3": '', //定位地址
					"mailingPersonName": "点击填写寄件人信息", //寄件人
					"mailingPhone": "", //寄件人电话
					"receiptLng": "", //收件地址经度
					"receiptLat": "", //收件地址纬度
					"receiptRegionID": 0, //收件区域ID
					"receiptRegion": '', //收件区域名称
					"receiptProvince": '', //收件省
					"receiptCity": "", //收件市
					"receiptDistrict": "", //收件县/区
					"receiptAddress": "要寄到哪儿?", //收件定位名称
					"receiptAddress2": "", //收件地址
					"receiptAddress3": "", //定位地址
					"receiptPersonName": "点击填写收件人信息", //收件人姓名
					"receiptPhone": "", //收件人电话
					"remark": "", //备注
					"isProcuration": false, //是否代收货款
					"weight": NaN, //总重量kg
					"startWeight": 0, //起步重量
					"startPrice": 0, //起步价
					"exceedWeight": 0, //续重（kg）
					"exceedPrice": 0, //续重金额
					"cost": 0, //快递费用（起步价+续重*续重单价）
					"goodsPrice": 0, //货款金额
					"couponID": 0, //优惠券ID
					"clientPlatform": 2, //客户端枚举 0.苹果 1.安卓 2.小程序 3.公众号 4.IPad 5.安卓Pad 6.PC客户端,7.管理端
					"fareArrivePay": false, //运费是否到付
					"expedited": true, //是否加急
					"valet": false, //是否代客
					"goodsInfo": "货物", //货品信息
					"goodsCount": NaN, //货品件数
					"haulDistance": 0 //运送距离（千米）
				},
				GoodsList: ['货物', '文件', '样品', '生鲜', '服装', '首饰', '数码', '其它'],
				GoodsIndex: 0,
				banerImg: [],
				polygons: [],
				AddressDesc: '',
				AddressTitle: '',
				reAddressDesc: '',
				reAddressTitle: '',
				regionList: [],
				goodsCountList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
					26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
					51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
					76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
					100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
					120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139,
					140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159,
					160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179,
					180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199,
					200
				],
				weightList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
					27, 28, 29, 30, 31, 32, 33, 34, 35,
					36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
					61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
					71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
					96, 97, 98, 99, 100, 101, 102, 103, 104,
					105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124,
					125, 126, 127, 128, 129, 130, 131, 132, 133,
					134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153,
					154, 155, 156, 157, 158, 159, 160, 161, 162,
					163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182,
					183, 184, 185, 186, 187, 188, 189, 190, 191, 192,
					193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212,
					213, 214, 215, 216, 217, 218, 219, 220, 221, 222,
					223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242,
					243, 244, 245, 246, 247, 248, 249, 250, 251, 252,
					253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272,
					273, 274, 275, 276, 277, 278, 279, 280, 281, 282,
					283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300
				]

			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'menuInfo'])
		},
		methods: {
			HeadUrlDeal: function(headurl) {
				if (VerifyHelper.IsNull(headurl)) return '/static/images/dt_false_dl.png';
				return headurl;
			},
			//默认寄件信息
			GetDefaultContact() {
				BMap = new bmap.BMapWX();
				uni.getLocation({
					type: 'gcj02',
					success(res) {

						//console.log(res);

						// 发起regeocoding检索请求
						BMap.regeocoding({
							location: res.latitude + ',' + res.longitude,
							success: function(data) {

								//console.log(data.originalData.result);
								let _obj = data.originalData.result.pois[0];

								//console.log(_obj);
								if (_obj) {

									let _address = _obj.name
									let _address2 = ""
									let _address3 = _obj.addr

									//_desc = _desc.replace("浙江省金华市婺城区","").replace("浙江省金华市义乌市","").replace("浙江省金华市义乌","")
									//_desc = _desc.replace("金华市婺城区","").replace("金华市义乌市","")					  

									_self.PostData.mailingLng = _obj.point.x
									_self.PostData.mailingLat = _obj.point.y
									_self.PostData.mailingAddress = _address
									_self.PostData.mailingAddress2 = _address2
									_self.PostData.mailingAddress3 = _address3
									//_self.PostData.mailingPersonName = _self.userInfo.FullName
									//_self.PostData.mailingPhone = _self.userInfo.Mobile
								}
							}
						});
					}
				})

				let _self = this

				_timeInterval = setInterval(function() {

					//console.log(_timeInterval);
					if (IntervalTimes >= 20) {
						clearInterval(_timeInterval)
					} else {
						if (_self.userInfo.accessToken) {

							_self.PostData.mailingPersonName = _self.userInfo.FullName != '' ? _self.userInfo
								.FullName : ""
							_self.PostData.mailingPhone = _self.userInfo.Mobile

							clearInterval(_timeInterval)
						} else IntervalTimes++
					}

				}, 200)


				/*
				_timeInterval = setInterval(function(){
					if(IntervalTimes>=10) {
						
						uni.getLocation({
							type:'gcj02',
							success(res) {
								// 发起regeocoding检索请求
								BMap.regeocoding({ 
									location:res.latitude+','+res.longitude,
								    success: function(data) { 
										let _obj = data.wxMarkerData;
										if(_obj && _obj.length>0){
											// console.log('address',_obj[0].address)
											// console.log('desc',_obj[0].desc)
											let _address = _obj[0].address
											let _desc = _obj[0].desc
											_address = _address.replace("浙江省金华市婺城区","").replace("浙江省金华市义乌市","").replace("浙江省金华市义乌","")
											_desc = _desc.replace("浙江省金华市婺城区","").replace("浙江省金华市义乌市","").replace("浙江省金华市义乌","")
											// console.log('address',_address)
											// console.log('desc',_desc)
											 _self.PostData.mailingLng = _obj[0].longitude
											 _self.PostData.mailingLat = _obj[0].latitude
											 _self.AddressTitle = _address;
											 _self.AddressDesc = _desc;
											 _self.PostData.mailingAddress = _address
											 _self.PostData.mailingAddress2 = _desc
											let polygons=[]
											_self.Get('/api/Region/GetRegionListByAddress?district='+_obj[0].district,'',_self.userInfo.accessToken,function(res){
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
									}
								}); 
							}
						})
						clearInterval(_timeInterval)
					}
					else{
						if(_self.userInfo.accessToken){
							_self.Get('/api/User/GetCommonlyUsedContactPageList?Type=2&PageSize=1&Range=1',{},_self.userInfo.accessToken,function(dataObj){
								if(dataObj.Status && dataObj.Data && dataObj.Data.rows.length>0) 
								{
									let data = dataObj.Data.rows[0]
									
									console.log('常用地址临时判断');
									console.log('data',data)
									_self.type = 'mailing';
									_self.currDistrict(function(){
										_self.locationAddr = {
											'address':data.Address,
											'name':data.Address2 ? data.Address2 : '',
											'latitude':data.Lat,
											'longitude':data.Lng
										}
										_self.CheckIsPtInPoly(function(){
											_self.PostData.mailingRegionID = data.RegionID;
											_self.PostData.mailingRegion = data.RegionName;
											_self.AddressTitle = data.Address;
											_self.AddressDesc = data.Address2 ? data.Address2 : '';
											_self.PostData.mailingDesc = data.Address2 ? data.Address2 : '';
											_self.PostData.mailingDesc1 = data.Address2 ? data.Address2 : '';
											_self.PostData.mailingAddress = data.Address;
											_self.PostData.mailingAddress2 = data.Address2 ? data.Address2 : '';
											_self.PostData.mailingPhone = data.Phone;
											_self.PostData.mailingPersonName = data.FullName;
											_self.PostData.mailingProvince = data.Province;
											_self.PostData.mailingCity = data.City;
											_self.PostData.mailingDistrict = data.District;
											_self.PostData.mailingLng = data.Lng;
											_self.PostData.mailingLat = data.Lat;
										});
									});
									
								}
								else{
									BMap = new bmap.BMapWX({
									    ak: 'IXdwLyG2iKCxo6WrR7hcCU3Tqj3UPfDe' 
									}); 
									uni.getLocation({
										type:'gcj02',
										success(res) {
											// 发起regeocoding检索请求
											BMap.regeocoding({ 
												location:res.latitude+','+res.longitude,
											    success: function(data) { 
													let _obj = data.wxMarkerData;
													if(_obj && _obj.length>0){
														let _address = _obj[0].address
														let _desc = _obj[0].desc
														_address = _address.replace("浙江省金华市婺城区","").replace("浙江省金华市义乌市","").replace("浙江省金华市义乌","")
														_desc = _desc.replace("浙江省金华市婺城区","").replace("浙江省金华市义乌市","").replace("浙江省金华市义乌","")
														
														console.log('定位临时判断');
														_self.type = 'mailing';
														_self.currDistrict(function(){
															_self.locationAddr = {
																'address':_address,
																'name':_desc,
																'latitude':_obj[0].latitude,
																'longitude':_obj[0].longitude
															}
															_self.CheckIsPtInPoly(function(){
																_self.PostData.mailingLat = _obj[0].latitude
																_self.PostData.mailingLng = _obj[0].longitude
																_self.AddressTitle = _address
																_self.AddressDesc = _desc
																_self.PostData.mailingAddress = _address
																_self.PostData.mailingAddress2 = _desc
																_self.PostData.mailingDesc = _desc
																_self.PostData.mailingDesc1 = _desc
															});
														});
														
													}
												}
											}); 
										}
									})
								}
							})
							clearInterval(_timeInterval)
						}
						else IntervalTimes++
					}
				},500)
				
				
				*/
			},

			//付款方式(到付，寄付)
			FareArrivePayChange(value) {
				let _self = this;
				_self.PostData.fareArrivePay = value
			},

			GoWebview(type) {
				if (VerifyHelper.IsNull(type)) return
				uni.navigateTo({
					url: 'webView?type=' + type
				})
			},

			//提交下一步
			btnSubmit: function() {
				let _self = this;
				//_self.showMsg('2021.1.29-2.21，\n春节期间，暂停收派！');
				//return;

				if (!_self.hasLogin) {
					uni.showModal({
						title: '登录提示',
						content: '检测到您未登录，是否立即登录！',
						confirmText: '立即登录',
						confirmColor: '#3399FE',
						cancelText: '暂不登录',
						cancelColor: '#666666',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login?goto=/pages/index/index'
								});
							}
						}
					})
				}
				if (!_self.Agreement) {
					_self.showMsg('请阅读并同意《服务协议》和《隐私政策》！');
					return;
				}

				if (!VerifyHelper.IsDouble(_self.PostData.mailingLng) || !VerifyHelper.IsDouble(_self.PostData
						.mailingLat)) {
					_self.showMsg('请选择寄件定位或填写地址！');
					return;
				}

				if (!VerifyHelper.IsDouble(_self.PostData.receiptLng) || !VerifyHelper.IsDouble(_self.PostData
						.receiptLat)) {
					_self.showMsg('请选择收件定位或填写地址！');
					return;
				}



				/*
				if (Number(_self.PostData.mailingRegionID < 1)) {
					_self.showMsg('寄件区域未开通');
					return;
				}
				if (!VerifyHelper.IsInt(_self.PostData.mailingRegionID) || VerifyHelper.IsNull(_self.PostData.mailingRegion) ||
					Number(_self.PostData.mailingRegionID < 1)) {
					_self.showMsg('请选择寄件区域！');
					return;
				}
				*/

				if (VerifyHelper.IsNull(_self.PostData.mailingPersonName)) {
					_self.showMsg('请填写寄件人姓名！');
					return;
				}
				if (VerifyHelper.IsNull(_self.PostData.mailingPhone)) {
					_self.showMsg('请填写寄件人电话！');
					return;
				}

				/*				
				if (!VerifyHelper.IsInt(_self.PostData.receiptRegionID) || VerifyHelper.IsNull(_self.PostData.receiptRegion) ||
					Number(_self.PostData.receiptRegionID < 1)) {
					_self.showMsg('请选择收件区域！');
					return;
				}
				*/

				if (VerifyHelper.IsNull(_self.PostData.receiptPersonName)) {
					_self.showMsg('请填写收件人姓名！');
					return;
				}
				if (VerifyHelper.IsNull(_self.PostData.receiptPhone)) {
					_self.showMsg('请填写收件人电话！');
					return;
				}

				//判断寄件区域
				_self.Get('/api/Region/GetRegionByCoordinate?lng=' + _self.PostData.mailingLng + '&lat=' + _self
					.PostData.mailingLat, '', _self.userInfo.accessToken,
					function(res) {
						console.log(res);
						if (res.Status) {
							_self.PostData.mailingRegionID = res.Data.ID
							_self.PostData.mailingRegion = res.Data.Name
							_self.PostData.mailingProvince = res.Data.Province
							_self.PostData.mailingCity = res.Data.City
							_self.PostData.mailingDistrict = res.Data.District


							//判断收件区域
							_self.Get('/api/Region/GetRegionByCoordinate?lng=' + _self.PostData.receiptLng +
								'&lat=' + _self.PostData.receiptLat, '', _self.userInfo.accessToken,
								function(res) {
									console.log(res);
									if (res.Status) {
										_self.PostData.receiptRegionID = res.Data.ID
										_self.PostData.receiptRegion = res.Data.Name
										_self.PostData.receiptProvince = res.Data.Province
										_self.PostData.receiptCity = res.Data.City
										_self.PostData.receiptDistrict = res.Data.District

										// 进行下一步
										_self.ShadeShow = true;
									} else {
										_self.PostData.receiptRegionID = 0
										_self.PostData.receiptRegion = ""
										_self.showMsg('收件区域未开通！');
										return;

									}
								})
						} else {
							_self.PostData.mailingRegionID = 0
							_self.PostData.mailingRegion = ""

							_self.showMsg('寄件区域未开通！');

						}
					}, 'biz', 'application/json', true)


				return;


			},

			//选择重量
			sliderChange(e) {
				let _self = this;
				_self.PostData.weight = e.detail.value;
			},

			//订单列表
			btnOrder() {
				let _self = this;
				if (!_self.hasLogin) {
					uni.showModal({
						title: '登录提示',
						content: '检测到您未登录，是否立即登录！',
						confirmText: '立即登录',
						confirmColor: '#3399FE',
						cancelText: '暂不登录',
						cancelColor: '#666666',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login?goto=/pages/mine/mine'
								});
							}
						}
					})
				} else {
					uni.navigateTo({
						url: '/pages/mine/orderList'
					})
				}
			},

			//用户中心
			btnMime: function() {
				let _self = this;
				if (!_self.hasLogin) {
					uni.showModal({
						title: '登录提示',
						content: '检测到您未登录，是否立即登录！',
						confirmText: '立即登录',
						confirmColor: '#3399FE',
						cancelText: '暂不登录',
						cancelColor: '#666666',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login?goto=/pages/mine/mine'
								});
							}
						}
					})
				} else {
					uni.navigateTo({
						// url: '/pages/index/couponList'
						url: '/pages/mine/mine'
					})
				}
			},

			//是否同意用户协议《服务条款》与《隐私条款》
			agreementChange: function() {
				let _self = this;
				_self.Agreement = !_self.Agreement;
			},

			//代收货款
			MoneyRadioChange: function() {
				let _self = this;
				_self.moneyRadio = !_self.moneyRadio;
				_self.PostData.isProcuration = !_self.PostData.isProcuration;
				if (value == false) {
					_self.PostData.goodsPrice = 0;
				}
			},

			// 临时地址
			btnAddress1(type, curr) {
				let _self = this
				let _item = {};
				_self.type = type
				if (type == 'receipt') {
					_item = {
						Lng: _self.PostData.receiptLng,
						Lat: _self.PostData.receiptLat,
						Province: _self.PostData.receiptProvince,
						City: _self.PostData.receiptCity,
						District: _self.PostData.receiptDistrict,
						Address: _self.PostData.receiptAddress == '要寄到哪儿?' ? '' : _self.PostData.receiptAddress,
						Address2: _self.PostData.receiptAddress2,
						Address3: _self.PostData.receiptAddress3,
						FullName: _self.PostData.receiptPersonName == '点击填写收件人信息' ? '' : _self.PostData
							.receiptPersonName,
						Phone: _self.PostData.receiptPhone,
						RegionID: _self.PostData.receiptRegionID,
						RegionName: _self.PostData.receiptRegion,
					}
					console.log('_item', _item)
					if (!VerifyHelper.IsInt(_self.PostData.receiptRegionID) || Number(_self.PostData.receiptRegionID) <
						1) {
						console.log('收件操作')
						// uni.chooseLocation({
						//     success: function (res) {
						//         // console.log('位置名称：' + res.name);
						//         // console.log('详细地址：' + res.address);
						//         // console.log('纬度：' + res.latitude);
						//         // console.log('经度：' + res.longitude);
						// 		let address = res.address;
						// 		if(address.indexOf("义乌") == -1){
						// 			return uni.showToast({
						// 						icon:'none',
						// 						title:'该区域未开通服务'
						// 					});
						// 		}
						// 		_self.currDistrict(function(){
						// 			_self.locationAddr = res
						// 			_self.CheckIsPtInPoly();
						// 		});
						//     }
						// });
						uni.navigateTo({
							url: 'address?address=' + encodeURIComponent(JSON.stringify(_item)) + '&type=' + type
						})
						return;
					}
				} else {
					console.log('mailing')

					console.log(_self);
					console.log(_self.PostData);
					_item = {
						Lng: _self.PostData.mailingLng,
						Lat: _self.PostData.mailingLat,
						Province: _self.PostData.mailingProvince,
						City: _self.PostData.mailingCity,
						District: _self.PostData.mailingDistrict,
						Address: _self.PostData.mailingAddress, //_self.AddressTitle,
						Address2: _self.PostData.mailingAddress2 ? _self.PostData.mailingAddress2 : '',
						Address3: _self.PostData.mailingAddress3 ? _self.PostData.mailingAddress3 : '',
						FullName: _self.PostData.mailingPersonName == '点击填写寄件人信息' ? '' : _self.PostData
							.mailingPersonName,
						Phone: _self.PostData.mailingPhone,
						RegionID: _self.PostData.mailingRegionID,
						RegionName: _self.PostData.mailingRegion,
					}
					if (!VerifyHelper.IsInt(_self.PostData.mailingRegionID) || Number(_self.PostData.mailingRegionID) <
						1) {
						uni.navigateTo({
							url: 'address?address=' + encodeURIComponent(JSON.stringify(_item)) + '&type=' + type
						})
						return;
						// uni.chooseLocation({
						//     success: function (res) {
						//         // console.log('位置名称：' + res.name);
						//         // console.log('详细地址：' + res.address);
						//         // console.log('纬度：' + res.latitude);
						//         // console.log('经度：' + res.longitude);
						// 		let address = res.address;
						// 		if(address.indexOf("义乌") == -1){
						// 			return uni.showToast({
						// 						icon:'none',
						// 						title:'该区域未开通服务'
						// 					});
						// 		}
						// 		_self.currDistrict(function(){
						// 			_self.locationAddr = res
						// 			_self.CheckIsPtInPoly();
						// 		});
						//     }
						// });
						// return;
					}
				}
				uni.navigateTo({
					url: 'address?address=' + encodeURIComponent(JSON.stringify(_item)) + '&type=' + type
				})
			},

			// 常用地址
			btnAddress: function(type, curr) {
				let _self = this;
				if (!_self.hasLogin) {
					uni.showModal({
						title: '登录提示',
						content: '检测到您未登录，是否立即登录！',
						confirmText: '立即登录',
						confirmColor: '#3399FE',
						cancelText: '暂不登录',
						cancelColor: '#666666',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login?goto=/pages/index/index'
								});
							}
						}
					})
				} else {
					//if(curr == 1){
					return uni.navigateTo({
						//url: '/pages/index/newMapAddress?curr='+curr+'&type='+type,
						url: '/pages/mine/addressList?curr=' + curr + '&type=' + type
					})
					//}
				}
			},

			/*
			CheckIsPtInPoly(callback){
				let _self = this
				if(!_self.polygons || _self.polygons.length<1){
					console.log('未获取到polygons')
					return uni.showToast({
								icon:'none',
								title:'该区域未开通服务'
							})
				}
				let _res = false
				for(let i=0;i<_self.polygons.length;i++){
					// _res = (BMapLib.IsPtInPoly1({lat:_self.locationAddr.latitude,lng:_self.locationAddr.longitude},_self.polygons[i].points))
					_res = (BMapLib.IsPtInPoly(_self.locationAddr.latitude,_self.locationAddr.longitude,_self.polygons[i].points))
					if(_res===true){
						let _address = _self.locationAddr.address
						_address = _address.replace("浙江省金华市义乌市","")
						let _item = {
							City:_self.regionList[i].City,
							District:_self.regionList[i].District,
							RegionID:_self.regionList[i].ID,
							Lat:_self.locationAddr.latitude,
							Lng:_self.locationAddr.longitude,
							RegionName:_self.regionList[i].Name,
							Province:_self.regionList[i].Province,
							Address:_self.locationAddr.name,
							Desc:_address
						}
						if(_self.type == 'mailing'){
							_self.PostData.mailingAddress = _self.locationAddr.name
							_self.PostData.mailingAddress2 = _address
						}else{
							_self.PostData.receiptAddress = _self.locationAddr.name
							_self.PostData.receiptAddress2 = _address
						}
						console.log('address',_address)
						if(callback){
							callback();
							return;
						}
						uni.navigateTo({
							url:'address?address='+JSON.stringify(_item)+'&type='+_self.type
						})
						return
					}else{
						if(_self.type == 'mailing'){
							_self.PostData.mailingAddress = ''
							_self.PostData.mailingAddress2 = ''
						}else{
							_self.PostData.receiptAddress = ''
							_self.PostData.receiptAddress2 = ''
						}
					}
				}
				uni.showToast({
					icon:'none',
					title:'该区域未开通服务'
				})
				return;
			},
			
			currDistrict:function(callback,jwd_type="RangeGCJ02"){
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
								let _range=JSON.parse(res.Data[i][jwd_type])
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

			PageReload: function(data, type = 'mailing', title = '', desc = '') {
				let _self = this;
				if (data != null) {
					if (type == 'receipt') {
						_self.type = 'receipt';

						console.log(data);

						_self.reAddressTitle = data.Address;
						_self.reAddressDesc = data.Address2;
						_self.PostData.receiptLng = data.Lng;
						_self.PostData.receiptLat = data.Lat;
						_self.PostData.receiptProvince = data.Province;
						_self.PostData.receiptCity = data.City;
						_self.PostData.receiptDistrict = data.District;
						_self.PostData.receiptAddress = data.Address;
						_self.PostData.receiptAddress2 = data.Address2;
						_self.PostData.receiptAddress3 = data.Address3;
						_self.PostData.receiptPersonName = data.Name;
						_self.PostData.receiptPhone = data.Phone;
						_self.PostData.receiptRegionID = data.RegionID;
						_self.PostData.receiptRegion = data.Region;

						return;

						/*
						
						_self.currDistrict(function(){
							_self.locationAddr = {
								'address':data.Address,
								'name':data.Address2,
								'latitude':data.Lat,
								'longitude':data.Lng
							}
				
							_self.CheckIsPtInPoly(function(){
								_self.reAddressTitle = data.Address;
								_self.reAddressDesc = data.Address2;
								_self.PostData.receiptRegionID = data.RegionID;
								_self.PostData.receiptRegion = data.Region;
								_self.PostData.receiptAddress = data.Address;
								_self.PostData.receiptAddress2 = data.Address2;
								_self.PostData.receiptDesc = data.Desc;
								_self.PostData.receiptDesc1 = data.Desc1;
								_self.PostData.receiptPhone = data.Phone;
								_self.PostData.receiptPersonName = data.Name;
								_self.PostData.receiptProvince = data.Province;
								_self.PostData.receiptCity = data.City;
								_self.PostData.receiptDistrict = data.District;
								_self.PostData.receiptLng = data.Lng;
								_self.PostData.receiptLat = data.Lat;
							});
						});
						
						*/

					} else {
						_self.type = 'mailing';

						//console.log(data);

						_self.AddressTitle = data.Address;
						_self.AddressDesc = data.Address2;
						_self.PostData.mailingLng = data.Lng;
						_self.PostData.mailingLat = data.Lat;
						_self.PostData.mailingProvince = data.Province;
						_self.PostData.mailingCity = data.City;
						_self.PostData.mailingDistrict = data.District;
						_self.PostData.mailingAddress = data.Address;
						_self.PostData.mailingAddress2 = data.Address2;
						_self.PostData.mailingAddress3 = data.Address3;
						_self.PostData.mailingPersonName = data.Name;
						_self.PostData.mailingPhone = data.Phone;
						_self.PostData.mailingRegionID = data.RegionID;
						_self.PostData.mailingRegion = data.Region;

						return;

						/*
						_self.currDistrict(function(){
							_self.locationAddr = {
								'address':data.Address,
								'name':data.Address2,
								'latitude':data.Lat,
								'longitude':data.Lng
							}
							
							_self.CheckIsPtInPoly(function(){
								_self.AddressTitle = title;
								_self.AddressDesc = desc;
								_self.PostData.mailingRegionID = data.RegionID;
								_self.PostData.mailingRegion = data.Region;
								_self.PostData.mailingAddress = data.Address;
								_self.PostData.mailingAddress2 = data.Address2;
								_self.PostData.mailingDesc = data.Desc;
								_self.PostData.mailingDesc1 = data.Desc1;
								_self.PostData.mailingPhone = data.Phone;
								_self.PostData.mailingPersonName = data.Name;
								_self.PostData.mailingProvince = data.Province;
								_self.PostData.mailingCity = data.City;
								_self.PostData.mailingDistrict = data.District;
								_self.PostData.mailingLng = data.Lng;
								_self.PostData.mailingLat = data.Lat;
							});
						});
						*/
					}
				}
			},

			TypeClick: function(value) {
				let _self = this;
				_self.PostData.expedited = value;
			},
			shadeClick: function() {
				let _self = this;
				_self.ShadeShow = false;
			},
			GoodsItemClick: function(index) {
				let _self = this;
				if (index > _self.GoodsList.length - 1) {
					_self.GoodsIndex = -1;
					_self.PostData.goodsInfo = '';
					return;
				}
				_self.GoodsIndex = index;
				_self.PostData.goodsInfo = _self.GoodsList[index];
			},
			btnLoad: function() {
				let _self = this;
				if (VerifyHelper.IsNull(_self.PostData.goodsInfo)) {
					_self.showMsg('请选择物品信息！');
					return;
				}

				if (!VerifyHelper.IsInt(_self.PostData.goodsCount) || Number(_self.PostData.goodsCount) < 1 || Number(
						_self.PostData.goodsCount) > 10) {
					_self.showMsg('物品件数范围1-10！');
					return;
				}
				if (!VerifyHelper.IsInt(_self.PostData.weight) || Number(_self.PostData.weight) < 1 || Number(_self
						.PostData.weight) > 300) {
					_self.showMsg('物品重量范围2-300！');
					return;
				}
				// _self.PostData.mailingLat =Number(_self.PostData.mailingLat).toFixed(5)
				// _self.PostData.mailingLng = Number(_self.PostData.mailingLng).toFixed(5)
				// _self.PostData.receiptLat = Number(_self.PostData.receiptLat).toFixed(5)
				// _self.PostData.receiptLng = Number(_self.PostData.receiptLng).toFixed(5)
				_self.PostData.haulDistance = BMapLib.GetDistance(_self.PostData.mailingLat, _self.PostData.mailingLng,
					_self.PostData.receiptLat, _self.PostData.receiptLng)

				uni.navigateTo({

					url: '/pages/index/orderConfirm?data=' + encodeURIComponent(JSON.stringify(_self.PostData))
				})
			},
			getData: function() {
				let t = this;
				t.Get("/api/Home/GetBanners", {}, '', function(res) {
					if (res.Status) {
						t.banerImg = res.Data;
					}
				}, 'applets');
			}
		},
		onLoad: function(option) {
			uni.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline']
			})
			let _self = this
			let _goto = option.goto;
			let leader = option.mobile ? option.mobile : 0
			uni.setStorageSync('leader', leader)
			if (!VerifyHelper.IsNull(_goto)) {
				uni.navigateTo({
					url: _goto
				})
			}
			this.getData();
			_self.GetDefaultContact();
		},
		onShareAppMessage(res) {
			let _self = this;
			let Mobile = uni.getStorageSync('login').Mobile
			if (!VerifyHelper.IsNull(Mobile)) {
				console.log('path', '/pages/index/index?mobile=' + Mobile)
				return {
					title: '享指优选,配送到家',
					path: '/pages/index/index?mobile=' + Mobile
				}
			} else {
				return {
					title: '享指优选,配送到家',
					path: '/pages/index/index'
				}
			}

		},
		onShareTimeline(res) {

		},
		bindPickerChange: function(e) {
			this.timeIndex = e.target.value
		},
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		// background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAFvCAYAAAAVGU4qAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA2QzkyNkI2QzUwOTExRUFBM0Y1QjFEOTcyRURCRTREIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA2QzkyNkI3QzUwOTExRUFBM0Y1QjFEOTcyRURCRTREIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDZDOTI2QjRDNTA5MTFFQUEzRjVCMUQ5NzJFREJFNEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDZDOTI2QjVDNTA5MTFFQUEzRjVCMUQ5NzJFREJFNEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7cyp5bAAH2r0lEQVR42uy9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');
		background-size: 100%;
		background-color: #F7F7F7;
		background-repeat: no-repeat;
	}

	.container-warp {
		width: 750upx;
	}

	.top-left,
	.top-right {
		position: absolute;
		z-index: 999;
		top: 56upx;
	}

	.top-left {
		left: 50upx;
	}

	.top-right {
		right: 50upx;
	}

	.top-left image,
	.top-right image {
		width: 90upx;
		height: 90upx;
		background-repeat: unset;
		border-radius: 45upx;
	}

	.top-center image {
		width: 340upx;
		height: 40upx;
	}

	.content-block-size {
		border-radius: 30upx;
		background-color: #FFFFFF;
		margin: 10px 30upx;
		width: 690upx;
		// padding: 0 20upx;
	}

	.cont_block {
		padding: 20upx;
	}

	.con-menu {
		padding: 40upx 0;
		border-bottom: 1px solid #e0e0e0;
	}

	.con-menu .menu-text {
		width: 50%;
		text-align: center;
		font-size: 20px;
	}

	.con-menu .menu-text .menu-active::before {
		height: 2px;
	}

	.con-menu .menu-text .menu-active {
		border-bottom: 3px solid #3399FE;
		margin-top: 2px;
	}

	.con-address {
		padding: 0;
	}

	.con-address .address-icon image {
		width: 25px;
		height: 100px;
	}

	.address-item:last-child {
		margin-bottom: 0;
	}

	.address-item {
		margin-bottom: 30upx;
		padding: 30upx;
		border-radius: 30upx;
		border: 1px solid #f0f0f0;

		.tag {
			font-size: 28upx;
			font-weight: bold;
			margin-right: 30upx;
			width: 46rpx;
			height: 46rpx;
			line-height: 46rpx;
			box-sizing: border-box;
			background-color: #3399FE;
			text-align: center;
			color: #fff;
			font-size: 24rpx;
			border-radius: 10rpx;
			margin-top: 8rpx;
		}

		.content {
			width: 70%;
			box-sizing: border-box;
			padding-right: 5%;
			border-right: 1px solid #f0f0f0;

			.title {
				font-size: 14px;
				font-weight: bold;
			}

			.text {
				font-size: 13px;
				color: #888888;
			}
		}

		.btn {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-direction: row;

			.box {
				padding-left: 30upx;
				width: 100%;
				font-size: 12px;
				box-sizing: border-box;
			}
		}
	}

	.jj_title {
		font-size: 16px;
		color: #888888;
	}

	.jj-type {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 30upx 0;

		.type-item {
			height: 220upx;
			width: 240upx;
			overflow: hidden;
			border: 4upx solid #F5F5F5;
			border-radius: 20upx;
			box-sizing: border-box;
			margin: 0 15upx;
			text-align: center;
			position: relative;

			.tag {
				font-size: 26upx;
				position: absolute;
				right: 0;
				top: 0;
				width: 70upx;
				height: 50upx;
				text-align: center;
				line-height: 50upx;
				background-color: #F5F5F5;
			}

			.title {
				font-size: 36upx;
				height: 60upx;
				line-height: 60upx;
			}

			.title-1 {
				font-size: 30upx;
			}

			.title-2 {
				font-size: 22upx;
				color: #888888;
			}

			.image {
				height: 160upx;

				image {
					margin-top: 10upx;
					width: 144upx;
				}
			}
		}

		.type-active {
			border-color: #3399FE;
			border-bottom-width: 12upx;
		}
	}

	.agreement-box {
		margin: 10upx 30upx 0;
		width: 690upx;

		text {
			color: #007AFF;
			font-size: 26upx;
		}

		.btnSubmit {
			margin: 30upx 0;
			border-radius: 50upx;
			height: 100upx;
			line-height: 100upx;
			background-color: #3399FE;
			color: #FFFFFF;
		}
	}

	.outlet-item {
		padding: 50upx 0;

		.outlet-info {
			height: 50upx;
			line-height: 50upx;
			margin-bottom: 10px;

			.logo {
				width: 50upx;
				height: 50upx;
				margin-right: 30upx;
			}

			.logo image {
				width: 50upx;
				height: 50upx;
			}

			.fullname {
				font-size: 36upx;
				font-weight: 200;
				line-height: 50upx;
			}
		}

		.address {
			color: #888888;
		}
	}

	.shade {
		background: rgba($color: #000000, $alpha: 0.5);
		z-index: 999;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;

		.shade-content {
			background-color: #FFFFFF;
			min-height: 200upx;
			width: 750upx;
			position: absolute;
			bottom: 0;
			right: 0;
			left: 0;

			.title {
				font-size: 32upx;
				font-weight: bold;
				padding-left: 30upx;
				margin: 30upx 0
			}

			.goodsInfo-box {
				margin: 15upx;

				.goodsInfo-item {
					width: 150upx;
					height: 150upx;
					margin: 15upx;
					border: 1upx solid #F5F5F5;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: center;
					line-height: 1.2;
					font-size: 32upx;
				}

				.goods-active {
					border-color: #3399FE;
					background-color: #EBF5FF;
				}
			}

			.pay-type-item {
				height: 52upx;
				line-height: 52upx;
				padding: 0 30upx;
				border-radius: 26upx;
				color: #808080;
				border: 1px solid #C0C0C0;
				margin-right: 30upx;
			}

			.pay-type-select {
				color: #3399FE;
				border-color: #EBF5FF;
			}

			.money-box {
				margin: 30upx;
				width: 650upx;
				border: 1upx solid #F5F5F5;
				padding: 20upx;

				.money-1 {
					margin-top: 20upx;
				}

				.uni-text-gray {
					height: 60upx;
					line-height: 60upx;
				}

				.input-money {
					height: 52upx;
					line-height: 52upx;
					padding-left: 20upx;
					border-radius: 26upx;
					border: 1upx solid #aaa;
					width: 200upx;
				}
			}

			.btnSubmit {
				margin: 50upx 0;
				border-radius: 50upx;
				height: 100upx;
				line-height: 100upx;
				background-color: #3399FE;
				color: #FFFFFF;
			}
		}
	}

	.banner-index {
		width: 750rpx;
		height: 570rpx;

		.img {
			width: 100%;
			height: 100%;
		}
	}

	.form_swithch {
		float: right;
		width: 42%;
		display: flex;
		justify-content: center;

		switch {
			transform: scale(0.7, 0.7)
		}

		.text {
			margin: 0 10rpx;
			color: #BEBEBE;
		}

		.select {
			color: #3399FE;
		}
	}

	.position {
		position: relative;

		.unit {
			position: absolute;
			right: 10rpx;
			top: 0rpx;
		}
	}
</style>
