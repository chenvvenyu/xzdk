<template>
	<view class="warp">
		<view class="log-item" v-for="(item,index) in logList" :key="index">
			<view class="title">{{item.Context}}</view>
			<view class="time">{{item.CreateTime}}</view>
		</view>
		<view class="Tips" v-if="logList.length == 0">
			暂无相关订单
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
			LoadData(id,type){
				let _self = this;
				let _param = {
					id:id
				}
				_self.Get(type?'/api/Order/GetOrderLog':'/api/Order/GetOrder',_param,type?'':_self.userInfo.accessToken,function(res){
					if(res.Status) {
						_self.logList = res.Data.logs?res.Data.logs:res.Data.rows
					}
				},type?'admin':'biz')
			}
		},
		onLoad(param) {
			this.LoadData(param.id,param.type)
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
	.Tips{
		width: 100%;
		text-align: center;
		padding: 30vh 0;
	}
</style>
