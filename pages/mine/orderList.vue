<template>
	<view class="page">
		<scroll-view class="scroll-h" :scroll-x="true" :show-scrollbar="false">
		    <view v-for="(item,index) in tabBars" :key="index" class="uni-tab-item" @tap="tabTap(index)">
		        <text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{item.name}}</text>
		    </view>
		</scroll-view>
		<view class="list">
			<view class="item" v-for="(item,index) in OrderList" :key="index">
				<view v-if="!IsPay(item)">
					<view class="item-1">
						待支付<text class="red">请及时支付{{tabIndex ===2?'差价':''}}</text>
					</view>
					<view class="item-2">
						<view class="time">{{item.CreateTime}}</view>
						<!-- <view class="address-1">{{item.MailingRegion}} {{item.MailingAddress}}</view> -->
						<view class="address-1">{{item.MailingAddress}}</view>
						<view class="address-1-1">{{item.MailingAddress2 ? item.MailingAddress2 : ''}}</view>
						<view class="name-1">{{item.MailingPersonName}} {{item.MailingPhone}}</view>
						<!-- <view class="address-2">{{item.ReceiptRegion}} {{item.ReceiptAddress}}</view> -->
						<view class="address-2">{{item.ReceiptAddress}}</view>
						<view class="address-2-1">{{item.ReceiptAddress2 ? item.ReceiptAddress2 : ''}}</view>
						<view class="name-2">{{item.ReceiptPersonName}} {{item.ReceiptPhone}}</view>
					</view>
					<view class="item-3">
						<view v-if="item.Status==10" class="btn-cancel" @tap="btnCancel(item.ID)">取消订单</view>
						<view v-if="item.Status==20||item.Status==30||item.Status==40||item.Status==50" class="btn-cancel">查看物流</view>
						<view class="btn-pay" @tap="btnPay(item.ID)">立即支付</view>
						<view class="clr"></view>
					</view>
				</view>
				<view v-else>
					<view class="item-1">
						{{GetStatus(item)}}<text class="gray">{{GetStatusText(item.Status)}}</text>
					</view>
					<view class="item-2">
						<view class="time">{{item.CreateTime}}<text>{{GetPayText(item)}}  </text></view>
						<view class="address-1">{{item.MailingAddress}}</view>
						<view class="address-1-1">{{item.MailingAddress2 ? item.MailingAddress2 : ''}}</view>
						<view class="name-1">{{item.MailingPersonName}} {{item.MailingPhone}}</view>
						<view class="address-2">{{item.ReceiptAddress}}</view>
						<view class="address-2-1">{{item.ReceiptAddress2 ? item.ReceiptAddress2 : ''}}</view>
						<view class="name-2">{{item.ReceiptPersonName}} {{item.ReceiptPhone}}</view>
					</view>
					<view class="item-3">
						<view v-if="item.Status==10" class="btn-cancel" @tap="btnCancel(item.ID)">取消订单</view>
						<view v-if="item.Status==20||item.Status==30||item.Status==40||item.Status==50" class="btn-cancel" @tap="btnLook(item.ID)">查看物流</view>
						<view class="btn-detail" @tap="btnDetails(item.ID)">查看订单</view>
						<view class="clr"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import VerifyHelper from "@/common/verify.js"
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				tabIndex: 0,
				tabBars: [
					{name: '全部',type: '0'}, 
					{name: '待支付',type: 'unpaid'}, 
					{name: '待揽件',type: '10'}, 
					{name: '寄送中',type: '40'},
					{name: '已完成',type: '50'}, 
					{name: '已取消',type: '-1'},
				],
				PageIndex:1,
				PageSize:20,
				OrderList:[],
				type:''
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			btnLook(id){
				uni.navigateTo({
					url:'/pages/mine/logistics?id='+id
				})
			},
			btnDetails(id){
				uni.navigateTo({
					url:'/pages/mine/orderDetail?id='+id
				})
			},
			btnPay(orderid){
				uni.navigateTo({
					url:'/pages/index/orderPay?orderid='+orderid
				})
			},
			tabTap(index) {
				let _self = this;
				_self.OrderList=[];
				_self.tabIndex=index;
				this.loadData();
			},
			loadData(){
				let _self = this;
				if(_self.tabIndex>=_self.tabBars.length) _self.tabIndex=0;
				let _type = _self.tabBars[_self.tabIndex].type;
				let _url = _self.GetUrlByType(_type);
				_self.Get(_url,'',_self.userInfo.accessToken,function(res){
					if(res.Status) {
						for (var i=0;i<res.Data.rows.length;i++) {
							_self.OrderList.push(res.Data.rows[i]);
						}
					}
				},'biz')
			},
			GetUrlByType(type){
				let _self = this;
				switch(type){
					default:
					case '0':
						return '/api/Order/GetUserOrderListPage?SortField=CreateTime&IsDescending=true&AllOrderStatus=true&PageIndex='+_self.PageIndex+'&PageSize='+_self.PageSize;
					break;
					case '-1':
					case '10':
					case '20':
					case '30':
					case '40':
					case '50':
						return '/api/Order/GetUserOrderListPage?SortField=CreateTime&IsDescending=true&AllOrderStatus=false&Status='+type+'&PageIndex='+_self.PageIndex+'&PageSize='+_self.PageSize;
					break;
					case 'unpaid':
						return '/api/Order/GetUnpaidOrderListPage?SortField=CreateTime&IsDescending=true&AllOrderStatus=true&PageIndex='+_self.PageIndex+'&PageSize='+_self.PageSize;
					break;
				}
			},
			GetStatus(item){
				if(item.Status==61){
					return '退款完成';
				}
				else if(item.Status==60){
					return '退款中';
				}
				else if(item.Status==-1){
					return '已取消';
				}
				else if(item.Status==10){
					return '待揽件';
				}
				else if(item.Status==20){
					return '已揽件';
				}
				else if(item.Status==30){
					return '待派送';
				}
				else if(item.Status==40){
					return '派送中';
				}
				else if(item.Status==50){
					return '已签收';
				}
				else if(item.Status==-2){
					return '强制取消';
				}
				return ''
			},
			GetStatusText(Status){
				if(Status==61){
					return '已退款';
				}
				else if(Status==60){
					return '订单退款';
				}
				else if(Status==-1){
					return '订单取消';
				}
				else if(Status==10){
					return '等待接单';
				}
				else if(Status==20){
					return '寄送中';
				}
				else if(Status==30){
					return '寄送中';
				}
				else if(Status==40){
					return '寄送中';
				}
				else if(Status==50){
					return '完成';
				}
				else if(Status==-2){
					return '订单取消';
				}
				return ''
			},
			GetPayText(item){
				if(item.Status==-1||item.Status==60||item.Status==61) return ''
				else{
					if(item.FareArrivePay) return '到付';
					else return '已支付';
				}
			},
			IsPay(item){
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
			}
		},
		onLoad(option) {
			let _self = this;
			let _type = option.status;
			if(!VerifyHelper.IsNull(_type)){
				for (var i=0;i<_self.tabBars.length;i++) {
					if(_self.tabBars[i].type ==_type){
						_self.tabIndex = i;
					}
				}
			}
			_self.OrderList=[];
			_self.loadData();
		},
	}
</script>

<style>
	.clr{clear: both;}
	.page{
		min-width: 100vw;
		min-height: 100vh;
		background-color: #F5F5F5;
	}
	.scroll-h {
		width: 750upx;
		height: 80upx;
		flex-direction: row;
		white-space: nowrap;
		box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);
		background-color: #FFFFFF;
	}
	.uni-tab-item {
		display: inline-block;
		flex-wrap: nowrap;
		padding-left: 34upx;
		padding-right: 34upx;
	}
	.uni-tab-item-title {
	    color: #555;
	    font-size: 30upx;
	    height: 80upx;
	    line-height: 80upx;
	    flex-wrap: nowrap;
	    white-space: nowrap;
	}
	.uni-tab-item-title-active {
	    color: #000000;
		border-bottom: 4upx solid #3399FE;
	}
	.list{
		padding: 20upx;
	}
	.item{
		width: 100%;
		background-color: #FFFFFF;
		box-shadow: 1upx 1upx 10upx rgba(0, 0, 0, 0.1);
		margin-bottom: 20upx;
		padding: 30upx;
		box-sizing: border-box;
	}
	.item-1{
		font-size: 36upx;color: #000000;line-height: 36upx;font-weight: bold;border-bottom: 1upx solid #F5F5F5;padding-bottom: 30upx;
	}
	.item-1 text{font-size: 28upx;margin-left: 40upx;padding-left: 20upx;font-weight: 300;position: relative;}
	.item-1 text:before{
		position: absolute;width: 2upx;left: 0;top: 0;bottom: 0;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
	}
	.item-1 .red{color:#DC535F;}
	.item-1 .red:before{background-color: #DC535F;}
	.item-1 .gray{color:#888888;}
	.item-1 .gray:before{background-color: #888888;}
	
	.time{line-height:60upx;color: #888888;font-size: 24upx;}
	.time text{float: right;color: #000000;}
	.address-1,.address-1-1,.address-2,.address-2-1{font-size: 30upx;padding-left: 30upx;line-height: 1.2;position: relative;}
	.address-1:before,.address-2:before{
		position: absolute;width: 10upx;height: 10upx;left: 0;top: 13upx;
		content: '';
		background-color: #DC535F;
		border-radius: 50%;
	}
	.address-1:before{background-color: #222222;}
	.name-1,.name-2{font-size: 28upx;color: #888888;margin-left: 30upx;line-height: 1.2;}
	.address-2{margin-top: 40upx;}
	.item-2{border-bottom: 1upx solid #F5F5F5;padding-bottom: 30upx;margin-bottom: 30upx;}
	.btn-cancel{float: left;color: #333;font-size: 30upx;line-height: 80upx;}
	.btn-pay{float: right;height: 80upx;width: 300upx;line-height: 80upx;border-radius: 40upx;background: #FFFFFF;border: 1px solid #666666;color: #333;font-size: 30upx;box-shadow: 0 0 20upx #ccc;text-align: center;}
	.btn-detail{float: right;height: 80upx;width: 300upx;line-height: 80upx;border-radius: 40upx;color: #333;font-size: 30upx;text-align: center;border:1upx solid #888888}
	
</style>
