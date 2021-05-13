<template>
	<view class="page">
		<view class="uni-list">
			<uni-list-item v-for="(item,index) in list" :key="index" :title="item.Reamrk"
			:note="item.CreateTime" :text="item.Amount"  :textClass="item.ChangeType==1?'uni-text-yellow':'uni-text-gray'" :showText="true" :show-arrow="false" />
			<view class="noItem" v-if="list.length<1">暂无记录</view>
		</view>
	</view>
</template>

<script>
	import VerifyHelper from "@/common/verify.js"
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	import {mapState} from 'vuex';
	export default {
		components: {uniListItem},
		data() {
			return {
				PageIndex:1,
				PageSize:20,
				list:[]
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			LoadData(){
				let _self = this;
				if(!_self.hasLogin || VerifyHelper.IsNull(_self.userInfo.accessToken)) return;
				let _param = {
					PageIndex:_self.PageIndex,
					PageSize:_self.PageSize
				}
				_self.Get('/api/BalanceLog/GetUserBalanceLogListPage',_param,_self.userInfo.accessToken,function(res){
					if(res.Status && res.Data!=null){
						let _data = res.Data.rows;
						if(_data!=null && _data.length>0) _self.list=_data;
					}
				})
			}
		},
		onLoad(){
			this.LoadData();
		},
	}
</script>

<style>
	.uni-list:before,.uni-list:after{height: 0 !important;}
	.uni-list-item__content-title,.uni-list-item__extra text{font-size: 38upx !important;}
	.uni-list-item__container{padding: 60upx 30upx 30upx 30upx  !important;}
	.uni-list-item__container:after{right: 30upx !important;}
	.noItem{text-align: center;padding: 50upx 0;}
	
	.uni-list-item__content-title,.uni-list-item__extra text {
		font-size: 36rpx !important;
	}
	.uni-text-yellow,.uni-text-gray{font-size: 40upx !important;}
</style>
