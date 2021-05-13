<template>
	<view class="warp">
		<view class="log-item" v-for="(item,index) in logList" :key="index">
			<view class="title">{{item.Context}}</view>
			<view class="time">{{item.CreateTime}}</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default{
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		data(){
			return{
				logList:[]
			}
		},
		methods:{
			LoadData(id){
				let _self = this;
				let _param = {
					id:id
				}
				_self.Get('/api/Order/GetOrder',_param,_self.userInfo.accessToken,function(res){
					if(res.Status && res.Data.logs && res.Data.logs.length>0) {
						_self.logList = res.Data.logs
					}
				},'biz')
			}
		},
		onLoad(param) {
			let _id = param.id;
			if(_id && _id.length>0) this.LoadData(param.id)
			else{
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.warp{
		width: 690upx;margin: 0 30upx;
		.log-item{
			padding: 30upx 0;
			border-bottom: 1px solid #e0e0e0;
			.title{font-size: 14px;}
			.time{font-size: 13px;color: #666666;}
		}
	}
</style>
