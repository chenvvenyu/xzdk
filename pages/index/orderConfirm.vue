<template>
	<view class="container-warp">
		<view class="content-block-size">
			<view class="cont_block">
				<view class="con-address uni-flex uni-row">
					<view class="address-icon">
						<image src="../../static/images/ji_03.jpg"></image>
					</view>
					<view class="address-des">
						<view class="address-sou">
							<view class="title">{{OrderData.mailingAddress}}</view>
							<view class="title">{{OrderData.mailingAddress2 ? OrderData.mailingAddress2 : ''}}</view>
							<view class="title" hidden='true'>{{OrderData.mailingAddress3 ? OrderData.mailingAddress3 : ''}}</view>
							<view class="text">{{OrderData.mailingPersonName}} {{OrderData.mailingPhone}}</view>
						</view>
						<view class="address-tag">
							<view class="title">{{OrderData.receiptAddress}}</view>
							<view class="title">{{OrderData.receiptAddress2 ? OrderData.receiptAddress2 : ''}}</view>
							<view class="title" hidden='true'>{{OrderData.receiptAddress3 ? OrderData.receiptAddress3 : ''}}</view>
							<view class="text">{{OrderData.receiptPersonName}} {{OrderData.receiptPhone}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view  class="content-block-size">
			<view class="cont_block">
				<view class="cont-row">寄件方式：{{OrderData.expedited?'特快':'标快'}}</view>
				<view class="cont-row">订单金额：{{OrderData.cost}} 元</view>
				<view class="cont-row">物品分类：{{OrderData.goodsInfo}}</view>
				<view class="cont-row">代收货款：{{OrderData.goodsPrice}} 元</view>
				<view class="cont-row">优&nbsp;惠&nbsp;券：{{coupon.Amount+ ' '+coupon.Name}} | <label style="border: 1px solid #888888;padding: 0px 10px;border-radius: 10px;height: 30px;font-size: 14px;margin-left: 10px;" @click="btnUse">使用</label></view>
				<view class="cont-row">物品重量：{{OrderData.weight}} kg</view>
				<view class="cont-row">物品件数：{{OrderData.goodsCount}} 件</view>
			</view>
		</view>
		<view class="foot-bar">
			<view style="padding: 10px 15px;">
				<view class="fl">{{OrderData.cost - coupon.Amount}}元</view>
				<view class="fr">
					<button @tap="btnLoad" :disabled="btnDisable" :class="{btnDisable:btnDisable}" class="btnSubmit" type="primary">下单</button>
				</view>
				<view class="clr"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import VerifyHelper from "@/common/verify.js"
	import {mapState} from 'vuex';
	export default{
		data() {
			return {
				Agreement:false,
				btnDisable:false,
				OrderData:{
					
				},
				coupon:{Amount:0,Name:'',couponId:0},
				totalMoney:0
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},		
		methods:{
			btnUse(){
				uni.navigateTo({
					url:'couponList'
				})
			},
			LoadCoupon(data){
				let _self = this
				if(!data){
					_self.coupon.Amount = 0
					_self.coupon.couponId = 0
					_self.coupon.Name = ''
					return
				}
				if(_self.totalMoney<data.Amount){
					uni.showToast({
						icon:'none',
						title:'优惠券总价不能大于运费！'
					})
					_self.coupon.Amount = 0
					_self.coupon.couponId = 0
					_self.coupon.Name = ''
					return
				}
				if(data.IsUsed){
					uni.showToast({
						icon:'none',
						title:'该优惠券已经使用！'
					})
					_self.coupon.Amount = 0
					_self.coupon.couponId = 0
					_self.coupon.Name = ''
					return
				}
				_self.coupon.Amount = data.Amount
				_self.coupon.couponId = data.couponId
				_self.coupon.Name = data.Name
				_self.OrderData.couponID = data.couponId
			},
			agreementChange:function(){
				let _self = this;
				_self.Agreement=!_self.Agreement;
			},
			LoadData:function(){
				let _self = this;
				let _url = '/api/Region/GetRegionConfig?startRegionID='+_self.OrderData.mailingRegionID+'&endRegionID='+_self.OrderData.receiptRegionID;
				_self.Get(_url,'',_self.userInfo.accessToken,function(res){
					if(res.Status && res.Data){
						let _data = res.Data;
						
						let _weight = _self.OrderData.weight;//物品重量
						// if(_weight>=200) _weight=200;
						let _startWeight = _data.Weight;//起始重量
						let _startPrice = _data.Price;//起始价格
						let _exceedWeight = _weight-_startWeight;//续重 = 物品重量 - 起始重量
						let _exceedWeightPrice1 = _data.ExceedWeightPrice1;//续重每千克多少钱
						
						let _exceedWeightPrice2 = _data.ExceedWeightPrice2;//(废弃)
						let _urgentPrice = _data.UrgentPrice //加急费用(废弃)
						
						let _urgentCoefficient = _data.UrgentCoefficient //加急系数
						let _levelPriceDis = _data.PriceDis//会员折扣系数
						
						let _exceedWeightRange1 = _data.ExceedWeightRange1;//重量区间1
						let _exceedWeightRange2 = _data.ExceedWeightRange2;//重量区间2 
						let _exceedWeightRange3 = _data.ExceedWeightRange3;//重量区间3
						let _exceedWeightFixedPrice1 = _data.ExceedWeightFixedPrice1;//价格区间1
						let _exceedWeightFixedPrice2 = _data.ExceedWeightFixedPrice2;//价格区间2
						let _exceedWeightFixedPrice3 = _data.ExceedWeightFixedPrice3;//价格区间3
						
						 
						let _exceedPrice = 0;//续费价格
						console.log('_weight',_weight)
						if(_weight > _exceedWeightRange3){//超过重量区间3
							_self.totalMoney = _exceedWeightFixedPrice3 + _exceedPrice
							console.log('重量超过'+_exceedWeightRange3+'千克,订单价格:'+_self.totalMoney+'元')
						}else if(_exceedWeightRange2 < _weight && _weight <= _exceedWeightRange3){
							_self.totalMoney = _exceedWeightFixedPrice2 + _exceedPrice
							console.log('重量在'+_exceedWeightRange2+'千克-'+_exceedWeightRange3+'千克之间,订单价格:'+_self.totalMoney+'元')
						}else if(_exceedWeightRange1 < _weight && _weight <= _exceedWeightRange2){
							_self.totalMoney = _exceedWeightFixedPrice1 + _exceedPrice
							console.log('重量在'+_exceedWeightRange1+'千克-'+_exceedWeightRange2+'千克之间,订单价格:'+_self.totalMoney+'元')
						}else if(_startWeight < _weight && _weight <= _exceedWeightRange1){
							_exceedPrice = _exceedWeight * _exceedWeightPrice1;//续重价格
							_self.totalMoney = _startPrice + _exceedPrice//订单价格 = 起始价格 + 续重价格
							console.log('重量在'+_startWeight+'千克-'+_exceedWeightRange1+'千克之间,订单价格:'+_self.totalMoney+'元')
						}else{
							_self.totalMoney = _startPrice
							console.log('重量'+_weight+'千克,订单价格:'+_self.totalMoney+'元')
						}
						
						_self.OrderData.startWeight=_startWeight;
						_self.OrderData.startPrice = _startPrice;
						_self.OrderData.exceedPrice=_exceedPrice;
						_self.OrderData.exceedWeight= _exceedPrice == 0 ? 0 : _exceedWeight;
						
						//_self.OrderData.expedited 0:标快 1:特快
						_self.totalMoney =_self.OrderData.expedited ?  _self.totalMoney*_urgentCoefficient*_levelPriceDis : _self.totalMoney*_levelPriceDis;
						_self.totalMoney = _self.totalMoney.toFixed(2);
						_self.OrderData.startWeight=_startWeight;
						_self.OrderData.cost = _self.totalMoney;
					}
					else{
						uni.showToast({
							icon:'none',
							title:'数据获取失败！'
						})
						_self.btnDisable = true
					}
				})
			},
			btnLoad:function(){
				let _self = this;
				if(!VerifyHelper.IsInt(_self.OrderData.weight) || Number(_self.OrderData.weight)<1){
					_self.showMsg('请重新选择物品重量！');
					return;
				}
				if(!VerifyHelper.IsNumber(_self.totalMoney) || Number(_self.totalMoney)<=0){
					_self.showMsg('运费计算错误，请重新操作！');
					return;
				}
				if(_self.totalMoney<_self.coupon.Amount){
					uni.showToast({
						icon:'none',
						title:'优惠券总价不能大于运费！'
					})
					_self.coupon.Amount = 0
					_self.coupon.couponId = 0
					_self.coupon.Name = ''
					return
				}
				_self.OrderData.cost = _self.totalMoney - _self.coupon.Amount
				uni.showModal({
					title:'提示',
					content:'请再次确认订单信息！',
					cancelColor:'#FF3333',
					success: function (res) {
						if (res.confirm) {
							_self.POST('/api/Order/CreateOrder',_self.OrderData,_self.userInfo.accessToken,function(res){
								if(res.Status){
									if(_self.OrderData.fareArrivePay == true){
										uni.reLaunch({
											url:'/pages/index/loadSuccess'
										})
									}
									else {
										uni.reLaunch({
											url:'/pages/index/orderPay?orderid='+res.Data.OrderID
										})
									}
								}
							},'biz')
						} 
					}
				})
			}
		},
		onLoad:function(option){
			let _self = this;
			let _data = decodeURIComponent(option.data)
			if(VerifyHelper.IsNull(_data)) {
				uni.navigateBack({
					delta:1
				});
				return;
			}
			_self.OrderData = JSON.parse(_data);
			if(VerifyHelper.IsNull(_self.OrderData)) {
				uni.navigateBack({
					delta:1
				});
				return;
			}
			_self.LoadData();
		}
	}
</script>

<style lang="scss">
	page{background-color: #F5F5F5;
		.container-warp{width: 690upx;margin: 0 30upx;
			.content-block-size{border-radius: 30upx;background-color: #FFFFFF;margin: 10px 0;
				.cont_block{padding: 20upx 40upx;
					.con-address{padding: 40upx 0;
						.address-icon image{width: 25px;height: 100px;}
						.address-des{padding-left: 40upx;}
					}
					.address-des{
						.title{font-size: 14px;font-weight: bold;}
						.text{font-size: 13px;color: #888888;}
						.address-sou .text{height: 100upx;}
					}
					.cont-row{line-height: 2;font-size: 30upx;}
				}
			}
			.foot-bar{background-color: #FFFFFF;position: fixed;bottom: 0;left: 0;right: 0;
				.radio-box{margin-top: 10upx;text-align: center;margin-bottom: 30upx;
					.radio text{color: #007AFF;font-size: 26upx;}
				}
				.fl,.fr{height: 100upx;line-height: 100upx;}
				.fl{font-size: 36upx;font-weight: bold;padding-left: 30upx;}
				.btnSubmit{margin: 10upx;border-radius: 40upx;height: 80upx;line-height: 80upx;
						   background-color: #3399FE;color: #FFFFFF;width: 300upx;
				}
				.btnDisable{background-color: #888888;}
			}
		}
	}
</style>
