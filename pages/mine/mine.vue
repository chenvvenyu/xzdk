<template>
	<view class="page container-warp">
		<view class="head uni-flex">
			<view class="uni-flex-item-3">
				<view class="fullname">{{userInfo.FullName}}</view>
				<view class="phone">{{userInfo.Mobile?MobileDeal(userInfo.Mobile):'请登录'}}</view>
				<view class="txt">个人版</view>
			</view>
			<view class="uni-flex-item-1" @tap="UserEdit">
				<image class="headurl" :src="HeadUrlDeal(userInfo.HeadUrl)"></image>
			</view>
		</view>
		<uni-list-item title="订单中心" showText="true" text="全部" @tap="GoOrder" />
		<uni-grid :column="4" :show-border="false" :square="false" @change="OrderChange">
			<uni-grid-item v-for="(item,index) in OrderList" :key="index">
				<image class="uni-grid-image" :src="'/static/images/'+item.image" mode="aspectFit" />
				<text class="uni-grid-text">{{item.text}}</text>
				<view v-if="item.badge" class="uni-grid-dot">
					<uni-badge :text="item.badge" type="error" />
				</view>
			</uni-grid-item>
		</uni-grid>
		<uni-list-item title="我的服务" :showArrow="false" />
		<uni-grid :column="4" :show-border="false" :square="false" @change="ActionChange">
			<uni-grid-item v-for="(item,index) in ActionList" :key="index">
				<image class="uni-grid-image" :src="'/static/images/'+item.image" mode="aspectFit" />
				<text class="uni-grid-text">{{item.text}}</text>
			</uni-grid-item>
		</uni-grid>
		<!-- <view class="uni-padding">
			<image class="image" src="/static/images/img-1.png" mode=""></image>
		</view> -->
	</view>
</template>

<script>
	import uniGrid from '@/components/uni-grid/uni-grid.vue';
	import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	import uniBadge from '@/components/uni-badge/uni-badge.vue';
	import VerifyHelper from "@/common/verify.js"
	import {mapState,mapMutations} from 'vuex';
	export default {
		components: {uniGrid,uniGridItem,uniListItem,uniBadge},
		data() {
			return {
				OrderList:[
					{image:"icon-5.png",text:"待支付",type:'unpaid'},
					{image:"icon-4.png",text:"待揽件",type:'10'},
					{image:"icon-6.png",text:"寄送中",type:'40'},
					{image:"icon-9.png",text:"已完成",type:'50'},
				],
				ActionList:[
					{image:"icon-7.png",text:"我的钱包",url:"/pages/mine/wallet",login:true},
					{image:"icon-10.png",text:"常用地址",url:"/pages/mine/addressList?curr=0",login:true},
					{image:"icon-yhq.png",text:"优惠券",url:"/pages/mine/myCoupon",login:true},
					{image:"icon-8.png",text:"设置中心",url:"/pages/mine/config",login:false},
					{image:"icon-15.png",text:"查看物流",url:"/pages/mine/logisticsInquiry",login:false}
				],
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			LoadData(){
				let _self = this;
			},
			MobileDeal:function(mobile){
				if(!VerifyHelper.IsPhone(mobile)) return '';
				return mobile.substring(0,3)+'****'+mobile.substring(7,11);
			},
			HeadUrlDeal:function(headurl){
				if(VerifyHelper.IsNull(headurl)) return '/static/images/logo-1.png';
				return headurl;
			},
			OrderChange(e){
				let index = e.detail.index;
				this.userInfo.ID?
				uni.navigateTo({url: '/pages/mine/orderList?status='+this.OrderList[index].type}):
				this.tologin()
			},
			GoOrder(){
				this.userInfo.ID?
				uni.navigateTo({url: '/pages/mine/orderList'}):
				this.tologin()
			},
			ActionChange(e){
				let url= this.ActionList[e.detail.index].url;
				let loginState = this.ActionList[e.detail.index].login
				this.userInfo.ID||!loginState?
				uni.navigateTo({url: url}):
				this.tologin()
			},
			UserEdit(){
				this.userInfo.ID?
				uni.navigateTo({
					url:"/pages/mine/user"
				}):
				this.tologin()
			},
			tologin(){
				uni.showModal({
					title:"提示",
					content:"请登陆",
					success:(res)=>{
						res.confirm?
						uni.navigateTo({
							url:"/pages/login/login"
						}):
						''
					}
				})
			}
		},
		onLoad() {
			//let _self = this;
			//console.log(_self.userInfo);
		},
	}
</script>


<style>
	.head{padding: 40upx;margin-top: 40upx;}
	.head .uni-flex-item-1{text-align: right;}
	.head .fullname {font-size: 32upx;}
	.head .headurl{width: 120upx;height: 120upx;margin-top: 10upx; border-radius: 60px;}
	.head .phone{font-size: 50upx;height: 70upx;line-height: 70upx;}
	.head .txt{background: linear-gradient(120deg, #329AFF 0%, #329AFF 100%);color:white; width: 200upx;height: 70upx;line-height: 70upx;border-radius: 35upx;text-align: center;}
	.uni-grid-image {width: 80upx;height: 80upx;}
	.uni-grid-text{font-size: 30upx;}
	.uni-grid-dot{position: absolute;top: 5px;right: 15px;}
	.uni-list-item__container{padding: 30upx !important;}
	.uni-list-item__container:after{height: 0 !important;}
	.uni-list-item__content-title,.uni-list-item__extra{font-size: 38upx !important;}
	.uni-icon{font-size: 50upx !important;}
	.image{width: 690upx;height: 170upx;}
	.uni-badge{font-size: 15px !important;}
</style>
