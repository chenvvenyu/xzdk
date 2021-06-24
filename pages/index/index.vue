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
			<view class="<strong>shade-content</strong>" @tap.stop="">
				<view class="title">物品信息</view>
				<view class="goodsInfo-box">
					<view class="goodsInfo-item fl" :class="{'goods-active':GoodsIndex==index}"
						v-for="(item,index) in GoodsList" :key="index" @tap="GoodsItemClick(index)">
						{{item}}
					</view>
					<view class="clr"></view>
				</view>
				<view class="money-box">
					<view>
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
					<view class="money-1">
						<view class="fl">代收货款</view>
						<view class="form_swithch">
							<label class="radio" style="margin-right: 30rpx;" @tap="MoneyRadioChange(false,'isProcuration')">
								<radio value="r1" color="#3399FE" :checked="!isProcuration" />
								无
							</label>
							<label class="radio" style="margin-right: 30rpx;" @tap="MoneyRadioChange(true,'isProcuration')">
								<radio value="r1" color="#3399FE" :checked="isProcuration" />
								有
							</label>
						</view>
						<view class="clr"></view>
					</view>
					<view class="money-1">
						<view class="fl uni-text-gray">代收货款金额</view>
						<view class="fr">
							<input class="input-money" type="number" placeholder="货款金额"
								:style="{'background-color':isProcuration?'#ffffff':'#aaa','border':'1upx solid #aaa'}"
								:disabled="!isProcuration" v-model="PostData.goodsPrice" />
						</view>
						<view class="clr"></view>
					</view>
					<view class="money-1">
						<view class="fl">保价</view>
						<view class="form_swithch">
							<label class="radio" style="margin-right: 30rpx;" @tap="MoneyRadioChange(false,'isValuation')">
								<radio value="r1" color="#3399FE" :checked="!isValuation" />
								否
							</label>
							<label class="radio" style="margin-right: 30rpx;" @tap="MoneyRadioChange(true,'isValuation')">
								<radio value="r1" color="#3399FE" :checked="isValuation" />
								是
							</label>
						</view>
						<view class="clr"></view>
					</view>
					<view class="money-1">
						<view :class="isValuation?'fl':'fl uni-text-gray'">保价金额</view>
						<view class="fr">
							<input class="input-money" type="number" placeholder="保价金额"
								:style="{'background-color':isValuation?'#ffffff':'#aaa','border':'1upx solid #aaa'}"
								:disabled="!isValuation" v-model="PostData.ValuationPrice" />
						</view>
						<view class="clr"></view>
					</view>
					<view class="money-1">
						<view class="fl uni-text-gray" style="color: #000000;">物品件数</view>
						<view class="fr position">
							<input class="input-money" type="number" min="0" placeholder="物品件数"
								style="border:1upx solid #aaa" v-model="PostData.goodsCount" />
							<!-- <view class="unit">件</view> -->
						</view>
						<view class="clr"></view>
					</view>
					<view class="money-1">
						<view class="fl uni-text-gray" style="color: #000000;">物品重量</view>
						<view class="fr position">
							<input class="input-money" type="number" min="3" maxlength="300" max="300"
								placeholder="物品重量" style="border:1upx solid #aaa" v-model="PostData.weight" />
							<!-- <view class="unit">kg</view> -->
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
				isProcuration: false,
				isValuation:false,
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
					"weight": 1, //总重量kg
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
					"goodsCount": 1, //货品件数
					"haulDistance": 0 ,//运送距离（千米）,
					"ValuationPrice":0,//保价金额
					"isValuation":false//是否保价
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
			MoneyRadioChange: function(value,type) {
				let _self = this;
				_self[type] = value;
				_self.PostData[type] = value;
				if (value == false) {
					type === 'isProcuration'?
					_self.PostData.goodsPrice = 0:
					_self.PostData.ValuationPrice = 0
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
						_self.PostData.goodsCount) > 20) {
					_self.showMsg('物品件数范围1-10！');
					return;
				}
				if (!VerifyHelper.IsInt(_self.PostData.weight) || Number(_self.PostData.weight) < 1 || Number(_self
						.PostData.weight) > 200) {
					_self.showMsg('物品重量范围1-200！');
					return;
				}
				if(_self.PostData.goodsPrice ===0 && _self.PostData.isProcuration){
					_self.showMsg("请输入代收货款金额")
					return
				}
				if((_self.PostData.ValuationPrice == 0||_self.PostData.ValuationPrice >5000) && _self.PostData.isValuation){
					_self.showMsg("保价范围1-5000！")
					return
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
				margin: 30upx 0 0 0
			}

			.goodsInfo-box {
				margin: 15upx;

				.goodsInfo-item {
					width: 150upx;
					height: 110upx;
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
