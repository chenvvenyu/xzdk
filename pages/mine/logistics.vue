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
			<uni-steps :options="list2" active-color="#3399FE" :active="active" direction="column" />
		</view>
	</view>
</template>

<script>
	import VerifyHelper from "@/common/verify.js"
	import {mapState} from 'vuex';
	import uniSteps from '@/components/uni-steps/uni-steps.vue';
	export default {
		components: {uniSteps},
		data() {
			return {
				Orderid:'',
				active:0,
				OrderInfo:{},
				list2: []
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
				_self.list2=[];
				_self.Get('/api/Order/GetOrder',_param,_self.userInfo.accessToken,function(res){
					if(res.Status) {
						_self.OrderInfo = res.Data
						for(var i = 0;i<res.Data.logs.length;i++){
							_self.list2.push({title: res.Data.logs[i].Context,desc: res.Data.logs[i].CreateTime})
						}
					}
				},'biz')
			},
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

</style>
