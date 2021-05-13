<template>
	<view class="page">
		<view class="uni-list">
			<uni-list-item v-for="(item,index) in list" :key="index" @tap="goAction(index)" :thumb="item.img" :title="item.text" />
		</view>
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	import {mapState,mapMutations} from 'vuex';
	export default {
		components: {uniListItem},
		data() {
			return {
				list:[
					{img:"/static/images/icon-1.png",text:"联系客服"},
					{img:"/static/images/icon-2.png",text:"关于享指特快"},
					{img:"/static/images/sj_name_07.png",text:"编辑个人信息"},
					// {img:"/static/images/icon-3.png",text:"退出当前账号"}
				]
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},	
		methods: {
			...mapMutations(['login']),
			goAction(index){
				let _self = this;
				if(index==0){
					// uni.navigateTo({url: '/pages/mine/question'});
					uni.makePhoneCall({
					    phoneNumber: '400 689 8588' //仅为示例
					});
				}
				else if(index==1){
					uni.navigateTo({
						url:'../index/webView?type=aboutCompany'
					})
				}
				else if(index==2){
					uni.navigateTo({
						url:'../mine/user'
					})
				}
			}
		},
		onLoad(){
			
		},
	}
</script>

<style>
	.uni-list{margin-top: 100upx;}
	.uni-list:before,.uni-list:after{height: 0 !important;}
	.uni-list-item__icon-img{height: 60upx !important;width: 60upx !important;}
	.uni-list-item__content-title{font-size: 38upx !important;}
	.uni-list-item__container{padding: 60upx 30upx !important;}
	.uni-list-item__container:after{right: 30upx !important;}
</style>
