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
				<view class="cont-row">寄件方式：{{OrderData.expedited?'当日达':'次日达'}}</view>
				<view class="cont-row">订单金额：{{OrderData.cost}} 元</view>
				<view class="cont-row">保价费：{{OrderData.valuationAmount}} 元</view>
				<view class="cont-row">物品分类：{{OrderData.goodsInfo}}</view>
				<view class="cont-row">代收货款：{{OrderData.goodsPrice}} 元</view>
				<view class="cont-row" v-if="userType===0">优&nbsp;惠&nbsp;券：{{coupon.Amount+ ' '+coupon.Name}} | <label style="border: 1px solid #888888;padding: 0px 10px;border-radius: 10px;height: 30px;font-size: 14px;margin-left: 10px;" @click="btnUse">使用</label></view>
				<view class="cont-row">物品重量：{{OrderData.weight}} kg</view>
				<view class="cont-row">物品件数：{{OrderData.goodsCount}} 件</view>
			</view>
		</view>
		<view class="foot-bar">
			<view style="padding: 10px 15px;">
				<view class="fl">{{OrderData.cost - coupon.Amount - OrderData.DiscountAmount + (OrderData.isValuation?OrderData.valuationAmount:0)}}元</view>
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
				totalMoney:0,
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo','userType'])
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
				let _url2 = '/api/Region/GetMajorUserConfig/'+uni.getStorageSync('UserId')
				_self.Get(this.userType === 0?_url:_url2,'',_self.userInfo.accessToken,(res)=>{
					if(res.Status && res.Data){
						let {
							_startWeight,
							_startPrice,
							_exceedWeightPrice1,
							_levelPriceDis,
							_exceedWeightRange1,
							_exceedWeightRange2,
							_exceedWeightRange3,
							_exceedWeightFixedPrice1,
							_exceedWeightFixedPrice2,
							_exceedWeightFixedPrice3
						}=_self.getCoefficient(res.Data)
						let _weight = Number(_self.OrderData.weight);//物品重量
						let _exceedWeight = _weight-_startWeight;//续重 = 物品重量 - 起始重量						
						
						let _exceedPrice = 0;//续费价格
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
						console.log("大客户处理前:"+_self.totalMoney)
						//大客户处理
						if(this.userType === 1){
							res.Data.PriceType === 1 && _self.OrderData.expedited === true&&!_self.OrderData.fareArrivePay
							?_self.OrderData.DiscountAmount = _self.totalMoney*(1-res.Data.PriceDis)
							:res.Data.PriceType === 2?_self.totalMoney = res.Data.PriceFix
							:''
						}
						console.log("大客户折扣价:"+_self.OrderData.DiscountAmount)
						_self.OrderData.PriceDis = res.Data.PriceDis;
						_self.OrderData.startWeight = _startWeight;
						_self.OrderData.startPrice = _startPrice;
						_self.OrderData.exceedPrice = _exceedWeightPrice1;
						_self.OrderData.exceedWeight = _exceedPrice == 0 ? 0 : _exceedWeight;
						_self.totalMoney = _self.totalMoney.toFixed(2);
						_self.OrderData.startWeight =_startWeight;
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
				console.log(_self.OrderData)
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
				// _self.OrderData.cost = _self.totalMoney - _self.coupon.Amount
				uni.showModal({
					title:'提示',
					content:'请再次确认订单信息！',
					cancelColor:'#FF3333',
					success: function (res) {
						if (res.confirm) {
							_self.POST('/api/Order/CreateOrder',_self.OrderData,_self.userInfo.accessToken,function(res){
								if(res.Status){
									if(_self.OrderData.fareArrivePay == true||_self.userType === 1){
										uni.reLaunch({
											url:'/pages/index/loadSuccess'
										})
									}
									else {
										uni.reLaunch({
											url:'/pages/index/orderPay?orderid='+res.Data.OrderID
										})
									}
								}else{
									_self.showMsg(`${res.Message}`);
								}
								uni.removeStorageSync('express')
							},'biz')
						} 
					}
				})
			},
			//计算相关系数
			getCoefficient(data){
				//this.OrderData.expedited 0:今日达 1:次日达
				let {expedited} =this.OrderData
				console.log(expedited?1:0)
				let info={
					_startWeight:expedited?data.Weight:data.NextdayFirstWeight,//起始重量
					_startPrice:expedited?data.Price:data.NextdayPrice,//起步价格
					_exceedWeightPrice1:expedited?data.ExceedWeightPrice1:data.NextdayWeightPrice,//续重价格
					_levelPriceDis:data.PriceDis,//会员系数
					_exceedWeightRange1:expedited?data.ExceedWeightRange1:data.NextdayWeightRange1,//重量区间1
					_exceedWeightRange2:expedited?data.ExceedWeightRange2:data.NextdayWeightRange2,//重量区间2
					_exceedWeightRange3:expedited?data.ExceedWeightRange3:data.NextdayWeightRange3,//重量区间3
					_exceedWeightFixedPrice1:expedited?data.ExceedWeightFixedPrice1:data.NextdayWeightFixedPrice1,//价格区间1
					_exceedWeightFixedPrice2:expedited?data.ExceedWeightFixedPrice2:data.NextdayWeightFixedPrice2,//价格区间1
					_exceedWeightFixedPrice3:expedited?data.ExceedWeightFixedPrice3:data.NextdayWeightFixedPrice3,//价格区间3
				}
				return info
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
			console.log(_self.OrderData)
			_self.OrderData.valuationAmount = _self.OrderData.isValuation?
			_self.OrderData.ValuationPrice>1000?_self.OrderData.ValuationPrice*0.01:5:0
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
		.container-warp{width: 690upx;margin: 0 30upx;padding-bottom: 120rpx;
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
	.item{
		padding:20rpx 40rpx;
		display: flex;
		justify-content: space-between;
		.item_left{
			display: flex;
			align-items: center;
			.item_icon{
				width: 30rpx;
				margin-right: 10rpx;
			}
		}
	}
</style>
