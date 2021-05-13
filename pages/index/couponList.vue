<template>
	<view class="warp">
		<view class="no-coupon" style="margin-top: 15px;">
			<button type="primary" style="background-color: #3399FE;color:#FFFFFF" @click="btnNocoupon">不使用优惠券</button>
		</view>
		<view class="coupon-item uni-flex uni-row" v-for="(item,index) in couponList" :key="index" @click="btnSelect(index)" v-if="!item.IsUsed">
			<view class="money">￥{{item.Amount}}</view>
			<view class="content">
				<view class="title">{{item.Name}}</view>
				<view class="no">NO：{{item.No}}</view>
				<view class="datetime">过期时间：{{item.ExpiredTime}}</view>
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
				serachParam:{
					UserID:'',
					PageIndex:1,
					PageSize:20
				},
				totalPage : 1,
				couponList:[]
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},		
		methods:{
			//获取优惠券列表
			DataLoad(){
				let _self = this;
				_self.serachParam.UserID = _self.userInfo.ID
				_self.Get('/api/Coupon/GetCouponPage',_self.serachParam,_self.userInfo.accessToken,function(res){
					console.log(res)
					_self.totalPage = Math.ceil( res.Data.totalNumber / _self.serachParam.PageSize )
					if(res.Status){
						_self.couponList = res.Data.rows;
					}
				})
			},
			btnSelect(index){
				let _self = this;
				if(!_self.couponList || _self.couponList.length<1 || index>=_self.couponList.length || _self.couponList[index].IsUsed) return;
				let pages = getCurrentPages();  //获取所有页面栈实例列表
				let prevPage = pages[pages.length-2];  //上一页页面实例
				prevPage.$vm.LoadCoupon(_self.couponList[index]);
				uni.navigateBack({delta:1})
			},
			btnNocoupon(index){
				let _self = this;
				let pages = getCurrentPages();  //获取所有页面栈实例列表
				let prevPage = pages[pages.length-2];  //上一页页面实例
				prevPage.$vm.LoadCoupon();
				uni.navigateBack({delta:1})
			}
		},
		onLoad:function(){
			this.DataLoad()
		},
	}
</script>

<style lang="less">
	.warp{
		width: 690upx;margin: 0 30upx;
		.coupon-item{
			border: 1px solid #e0e0e0;box-sizing: border-box;
			border-radius: 30upx;height: 190upx;padding:10upx;
			margin: 20upx 10upx;
			.money{width: 150upx;height: 150upx;line-height: 150upx;font-size: 30px;color: #FF3333;}
			.content{width: 500upx;
				.title{font-size: 36upx;color: #F0AD4E;font-weight: bold;}
				.no,.datetime{color: #888888;font-size: 26upx;}
			}
		}
		
	}
</style>
