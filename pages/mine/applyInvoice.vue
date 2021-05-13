<template>
	<view class="page">
		<view class="uni-list">
			<uni-list-item @tap="goAction(0)" title="开具发票" />
			<uni-list-item @tap="goAction(1)" title="发票抬头" />
		</view>
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	export default {
		components: {uniListItem},
		data() {
			return {
				
			}
		},
		methods: {
			goAction(index){
				if(index==0){
					this.showMsg("开具发票");
				}
				else if(index==1){
					this.showMsg("发票抬头");
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
