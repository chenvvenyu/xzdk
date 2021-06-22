<template>
	<view class="container-warp">
		<view class="title-box">
			<view class="money">￥{{price}}</view>
			<view class="des">支付金额</view>
		</view>
		<view class="paytype-box">
			<view class="type-item uni-flex uni-row" v-for="(item,index) in PayTypeList" :key="index" @tap="PayTypeChange(index)">
				<view class="logo"><image :src="item.logo"></image></view>
				<view class="name">{{item.name}}</view>
				<view class="radio">
					<label class="radio" style="margin-right: 30rpx;">
						<radio value="r1" color="#3399FE" :checked="PayTypeIndex==index" />
					</label>
				</view>
			</view>
		</view>
		<view class="operation-box">
			<button type="primary" @tap="btnSubmit" class="btnSubmit">确 定</button>
		</view>
		<view v-if="ShowPassword" class="password-box">
			<view class="pwd-content">
				<view class="head uni-flex uni-row">
					<view class="close" @tap="btnCancel">×</view>
					<view class="title">支付密码</view>
				</view>
				<view class="input-list">
					<input class="txtPassword" type="text" password="·" v-model="PayPassword" placeholder="支付密码" />
				</view>
				<view class="uni-flex uni-row">
					<button @tap="btnPay" class="btnPay" type="default">支付</button>
					<button @tap="btnCancel" class="btnCancel" type="default">取消</button>
				</view>
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
				OrderID:-1,
				PayTypeIndex:-1,
				ShowPassword:false,
				PayPassword:'',
				OrderInfo:{
					
				},
				price:0,
				PayTypeList:[
					{logo:'/static/images/zf_weixin_06.png',name:'微信',type:'wechat'},
					{logo:'/static/images/zf_yuer_07.png',name:'余额',type:'balance'},
					// {logo:'/static/images/zf_fukuan_07.png',name:'揽件时付款',type:'wechat'},
					// {logo:'/static/images/zf_daofu_07.png',name:'到付',type:'arrive'}
				]
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},		
		methods:{
			btnCancel:function(){
				let _self = this;
				_self.ShowPassword = false;
				_self.PayPassword='';
			},
			btnPay:function(){
				let _self = this;
				if(VerifyHelper.IsNull(_self.PayPassword)){
					_self.showMsg('请输入支付密码！');
					return;
				}
				let _param={
					password: _self.PayPassword
				}
				_self.POST('/api/User/CheckPayPassword',_param,_self.userInfo.accessToken,function(res){
					if(res.Status && res.Data==true){
						_param={
							orderNo:_self.OrderInfo.order.OrderNO,
							client:2,
							payPassword:_self.PayPassword
						}
						_self.POST('/api/Order/BalancePay',_param,_self.userInfo.accessToken,function(res){
							if(res.Status){
								uni.reLaunch({
									url:'/pages/index/loadSuccess'
								})
							}
							else _self.showMsg(res.Message);
						},'biz','application/x-www-form-urlencoded')
					}
					else _self.showMsg('密码错误！');
				},'biz')
			},
			LoadData:function(){
				let _self = this;
				_self.Get('/api/Order/GetOrder?id='+_self.OrderID,'',_self.userInfo.accessToken,function(res){
					if(res.Status){
						_self.OrderInfo = res.Data;
						_self.price = _self.OrderInfo.coupon?
						_self.OrderInfo.order.Cost-_self.OrderInfo.coupon.Amount+_self.OrderInfo.order.ValuationAmount:
						_self.OrderInfo.order.Cost+_self.OrderInfo.order.ValuationAmount
					}
				},'biz')
			},
			PayTypeChange:function(index){
				let _self = this;
				if(index>_self.PayTypeList.length-1) return;
				_self.PayTypeIndex = index;
			},
			btnSubmit:function(){
				let _self = this;
				if(!VerifyHelper.IsInt(_self.PayTypeIndex) || Number(_self.PayTypeIndex)<0){
					_self.showMsg('请选择支付方式');
					return;
				}
				if(_self.PayTypeIndex>_self.PayTypeList.length-1) return;
				let _type = _self.PayTypeList[_self.PayTypeIndex].type;
				switch(_type){
					default:
						_self.showMsg('请选择支付方式');
						return;
					break;
					case 'wechat':{ //微信
						//拉起支付
						let _param={
							openId:_self.userInfo.OpenID,
							orderId:_self.OrderID
						}
						_self.POST('/api/Pay/Wechat',_param,_self.userInfo.accessToken,function(result){
							console.log(result)
							if(result.Status){
								let data=JSON.parse(result.Data);
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: data.timeStamp,
									nonceStr: data.nonceStr,
									package: data.package,
									signType: data.signType,
									paySign: data.paySign,
									success: res => {
										if(res.errMsg=="requestPayment:ok"){
											uni.reLaunch({
												url:'/pages/index/loadSuccess'
											})
										}
										else{
											uni.showToast({
												icon:'none',
												title:"支付失败！"
											})
										}
										
									},
									fail: () => {
										uni.showToast({
											icon:'none',
											title:"取消支付！"
										})
									},
																		
								});
							}
							else{
								uni.showToast({
									icon:'none',
									title:res.Message
								})
							}
						},'applets','application/x-www-form-urlencoded')
					}break;
					case 'balance': { //余额
						let _self = this;
						if(VerifyHelper.IsNull(_self.OrderInfo.order.OrderNO)) return;
						_self.ShowPassword = true;
					}break;
					case 'arrive':{ //到付
						let _param = {
							"id": _self.OrderInfo.order.ID,
							"mailingPersonName": _self.OrderInfo.order.MailingPersonName,
							"mailingPhone": _self.OrderInfo.order.MailingPhone,
							"mailingAddress": _self.OrderInfo.order.MailingAddress,
							"mailingRegionID": _self.OrderInfo.order.MailingRegionID,
							"mailingRegion": _self.OrderInfo.order.MailingRegion,
							"receiptPersonName": _self.OrderInfo.order.ReceiptPersonName,
							"receiptPhone": _self.OrderInfo.order.ReceiptPhone,
							"receiptAddress": _self.OrderInfo.order.ReceiptAddress,
							"receiptRegionID": _self.OrderInfo.order.ReceiptRegionID,
							"receiptRegion": _self.OrderInfo.order.ReceiptRegion,
							"remark": _self.OrderInfo.order.Remark,
							"isProcuration": _self.OrderInfo.order.IsProcuration,
							"weight": _self.OrderInfo.order.Weight,
							"startWeight": _self.OrderInfo.order.StartWeight,
							"startPrice": _self.OrderInfo.order.StartPrice,
							"exceedWeight": _self.OrderInfo.order.ExceedWeight,
							"exceedPrice": _self.OrderInfo.order.ExceedPrice,
							"cost": _self.price,
							"goodsPrice": _self.OrderInfo.order.GoodsPrice,
							"couponID": _self.OrderInfo.order.CouponID,
							"fareArrivePay": true,
							"expedited": _self.OrderInfo.order.Expedited,
							"goodsInfo": _self.OrderInfo.order.GoodsInfo
						}
						_self.POST('/api/Order/UpdateOrder',_param,_self.userInfo.accessToken,function(res){
							if(res.Status){
								uni.reLaunch({
									url:'/pages/index/loadSuccess'
								})
							}
						},'biz')
					}break;
				}
			}
		},
		onLoad:function(option){
			let _self = this;
			_self.OrderID = option.orderid;
			if(VerifyHelper.IsNull(_self.OrderID)) {
				uni.showModal({
					title:'错误提示',
					content:'发生未知错误，请到订单中心查看该订单信息！',
					success() {
						uni.reLaunch({
							url:'/pages/index/index'
						})
					}
				})
			}
			_self.LoadData();
		}
	}
</script>

<style lang="scss">
	page{background-color: #FFFFFF;
		.container-warp{width: 690upx;margin: 0 30upx;
			.title-box{;margin: 80upx 0;
				.money{text-align: center;font-size: 60upx;font-weight: bold;line-height: 1.2;}
				.des{color: #888888;font-size: 24upx;text-align: center;line-height: 1.2;}
			}
			.paytype-box{
				.type-item{border-bottom: 1upx solid #f0f0f0;padding: 20upx 0;
					.logo{width: 60upx;height: 60upx;
						image{width: 60upx;height: 60upx;}
					}
					.name{width: 480upx;margin-left: 30upx;height: 60upx;line-height: 60upx;}
					.radio{text-align: right;width: 130upx;height: 60upx;line-height: 60upx;}
				}
			}
			.operation-box{margin-top: 80upx;
				.btnSubmit{border-radius: 50upx;height: 100upx;line-height: 100upx;background-color: #3399FE;
						color: #FFFFFF;}
			}
			.password-box{position: fixed;left: 0;right: 0;top: 0;bottom: 0;background: rgba(0,0,0,0.5);
						  z-index: 99;display: flex;align-items: center;justify-content: center;
				.pwd-content{width: 600upx;background-color: #FFFFFF;border-radius: 20upx;overflow: hidden;
					.head{border-bottom: 1upx solid #f0f0f0;height: 80upx;line-height: 80upx;text-align: center;
							margin-bottom: 50upx;
						.close{width: 80upx;height: 80upx;line-height: 80upx;font-weight: bold;}
						.title{width: 480upx;text-align: center;line-height: 80upx;font-size: 32upx;}
					}		 
					.input-list{text-align: center;margin: 50upx 0;
						.txtPassword{width: 400upx;border-bottom: 1upx solid #f0f0f0;text-align: center;margin-left: 100upx;height: 60upx;line-height: 60upx;font-size: 32upx;}
					}
					.btnCancel,.btnPay{
						margin-bottom: 50upx;height: 80upx;border-radius: 40upx;width: 200upx;line-height: 80upx;
						font-size: 32upx;color: #333333;
					}
					.btnPay{
						background-color:#3399FE;
					}
				}
			}
		}
		
	}
</style>
