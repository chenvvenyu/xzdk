<template>
	<view class="page">
		<uni-collapse class="uni-collapse">
			<uni-collapse-item v-for="(item, index) in list" :key="index" :open="item.open" :show-animation="true" :title="'Q：'+item.q">
				<view class="content">A：{{ item.a }}</view>
			</uni-collapse-item>
		</uni-collapse>
		<view class="phone" @tap="makePhoneCall">客服电话：{{phone}}</view>
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	export default {
		components: {uniCollapse,uniCollapseItem,},
		data() {
			return {
				phone:"18667852676",
				list:[
					{q:"我是一个问题1",a:"1我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题2",a:"2我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题3",a:"3我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题4",a:"4我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题5",a:"5我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题6",a:"6我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题7",a:"7我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题8",a:"8我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题1",a:"1我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题2",a:"2我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题3",a:"3我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题4",a:"4我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题5",a:"5我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题6",a:"6我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题7",a:"7我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题8",a:"8我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题1",a:"1我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题2",a:"2我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题3",a:"3我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题4",a:"4我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题5",a:"5我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题6",a:"6我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题7",a:"7我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题8",a:"8我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题1",a:"1我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题2",a:"2我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题3",a:"3我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题4",a:"4我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题5",a:"5我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题6",a:"6我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题7",a:"7我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题8",a:"8我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"},
					{q:"我是一个问题9",a:"9我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案我是问题的小答案"}
				]
			}
		},
		methods: {
			//打电话
			makePhoneCall(){
				uni.makePhoneCall({phoneNumber: this.phone});
			},
		},
		onLoad(){
			
		},
	}
</script>

<style>
	.uni-collapse-cell__title{background-color:#FFFFFF}
	.content{padding:30upx;background:#FFFFFF}
	.phone{z-index: 999;position:fixed;left: 0;right: 0;bottom: 0;height: 150upx;background-color: #FFFFFF;text-align: center;font-size: 40upx;line-height: 150upx;}
	.page{padding-bottom: 160upx;}
</style>
