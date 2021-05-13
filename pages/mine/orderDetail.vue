<template>
	<view class="page">
		<view class="con-address uni-flex uni-row">
			<view class="address-icon">
				<image src="/static/images/ji_03.jpg"></image>
			</view>
			<view class="address-des">
				<view class="address-sou">
					<view class="title">{{OrderInfo.order.MailingRegion}} {{OrderInfo.order.MailingAddress}}</view>
					<view class="text">{{OrderInfo.order.MailingPersonName}} {{OrderInfo.order.MailingPhone}}</view>
				</view>
				<view class="address-tag">
					<view class="title">{{OrderInfo.order.ReceiptRegion}} {{OrderInfo.order.ReceiptAddress}}</view>
					<view class="text">{{OrderInfo.order.ReceiptPersonName}} {{OrderInfo.order.ReceiptPhone}}</view>
				</view>
			</view>
		</view>
		<view class="order-info">
			<view class="text">订单编号：{{OrderInfo.order.OrderNO}}</view>
			<view class="text">订单金额：{{OrderInfo.order.Cost}} 元</view>
			<view class="text">寄送方式：{{OrderInfo.order.Expedited?'特快':'普快'}}</view>
			<view class="text">物品分类：{{OrderInfo.order.GoodsInfo}}</view>
			<view class="text">代收货款：{{OrderInfo.order.GoodsPrice}} 元</view>
			<view class="text">货物件数：{{OrderInfo.order.GoodsCount}} 件</view>
			<view class="text">货物重量：{{OrderInfo.order.Weight}} 千克</view>
			<view class="text">下单时间：{{OrderInfo.order.CreateTime}}</view>
		</view>
		<view class="btn-view">
			<view class="btn-cancel" v-if="OrderInfo.order.Status==10" @tap="btnCancel(OrderInfo.order.ID)">取消订单</view>
			<view class="btn-pay" v-if="!IsPay(OrderInfo.order)" @tap="btnPay(OrderInfo.order.ID)">立即支付</view>
			<view class="clr"></view>
		</view>
		<view>
			<button @tap="btnLog(OrderInfo.order.ID)" style="background-color: #3399fe;" class="btnSubmit" type="primary">跟踪日志</button>
		</view>
	</view>
</template>

<script>
	import VerifyHelper from "@/common/verify.js"
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				Orderid:'',
				OrderInfo:{}
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			loadData(){
				let _self = this;
				let _param = {
					id:_self.Orderid
				}
				_self.Get('/api/Order/GetOrder',_param,_self.userInfo.accessToken,function(res){
					if(res.Status) {
						_self.OrderInfo = res.Data
					}
				},'biz')
			},
			IsPay(item){
				if(item==null || item==undefined) return;
				if(item.FareArrivePay&&item.Status!=-1&&item.Status!=60&&item.Status!=61) return true;
				if(item.Status!=-1&&item.Status!=60&&item.Status!=61&&!item.FareArrivePay){
					 if(item.PayNumber==0) return false;
					 else{
						 if(item.Cost-item.CouponPrice-item.RealAmount>0) return false;
						 else return true;
					 }
				}
				else return true;
			},
			btnPay(orderid){
				uni.navigateTo({
					url:'/pages/index/orderPay?orderid='+orderid
				})
			},
			btnCancel(id){
				let _self = this;
				uni.showModal({
					title:'提示',
					content:'确认取消该订单？',
					cancelColor:'#FF3333',
					success: function (res) {
						if (res.confirm) {
							_self.POST('/api/Pay/CancelOrderAndRefundAmount',{"orderId":id},_self.userInfo.accessToken,function(res){
								if(res.Status){
									_self.OrderList=[];
									_self.loadData();
									uni.showToast({
										icon:"success",
										title:'订单取消成功'
									})
								}
								else _self.showMsg(res.Message);
							},'repay','application/x-www-form-urlencoded')
						} 
					}
				})
			},
			btnLog(orderid){
				uni.navigateTo({
					url:'/pages/mine/logList?id='+orderid
				})
			}
		},
		onLoad(option) {
			let _self = this;
			let _id = option.id;
			if(!VerifyHelper.IsNull(_id)) {
				_self.Orderid = _id;
				_self.loadData();
			}
			else{
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style>
	.page{min-width: 100vw;min-height: 100vh;background-color: #F5F5F5;padding: 30upx;box-sizing: border-box;}
	.con-address,.order-info{padding: 30upx;background-color: #FFFFFF;box-shadow: 0 0 20upx #ccc;border-radius: 20upx;}
	.con-address .address-icon image{width: 54upx;height: 216upx;}
	.con-address .address-des{padding-left: 40upx;}
	.address-des .title{font-size: 30upx;font-weight: bold;}
	.address-des .text{font-size: 28upx;color: #888888;}
	.address-sou{margin-bottom: 20upx;}
	.order-info{margin-top: 30upx;}
	.order-info .text{line-height: 60upx;}
	.btn-cancel{float: left;color: #333;font-size: 30upx;line-height: 80upx;border-radius: 40upx;text-align: center;border:1upx solid #888888;width: 250upx;}
	.btn-pay{float: right;height: 80upx;width: 350upx;line-height: 80upx;border-radius: 40upx;background: linear-gradient(120deg, #3399FE 0%, #3399FE 100%);color: #333;font-size: 30upx;box-shadow: 0 0 20upx #ccc;text-align: center;}
	.btn-detail{float: right;height: 80upx;width: 300upx;line-height: 80upx;border-radius: 40upx;color: #333;font-size: 30upx;text-align: center;border:1upx solid #888888}
	.btn-view{margin : 30upx 0;}
	.clr{clear: both;}
	.btnSubmit {
		margin: 30upx 0;
		border-radius: 50upx;
		height: 100upx;
		line-height: 100upx;
		background-color: #3399FE;
		color: #FFFFFF;
	}
</style>
