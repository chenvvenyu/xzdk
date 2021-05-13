<template>
	<view class="page">
		<uni-segmented-control :current="tabindex" :values="items" @clickItem="onClickItem" style-type="text" active-color="#fd790c"></uni-segmented-control>
		<view class="list" v-if="AddressList && AddressList.length>0">
			<view class="uni-flex" v-for="(item,index) in AddressList" :key="index">
				<view class="uni-flex-item-3" @tap="AddressClick(index)">
					<view class="title"><text class="tag" v-if="item.IsDefault">默认</text>{{item.FullName}} {{item.Phone}}</view>
					<view class="content">{{item.Address}}</view>
					<view class="content">{{item.Address2?item.Address2:''}}</view>
				</view>
				<view class="uni-flex-item-1">
					<view class="edit" @tap="Edit(index)">
						<image class="img" src="/static/images/grzx_bianji_03.png" mode=""></image>
						<view class="txt">编辑</view>
					</view>
					<view class="delete" @tap="Delete(item.ID)">
						<image class="img" src="/static/images/grzx_del_03.png" mode=""></image>
						<view class="txt">删除</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="null-data">暂无数据</view>
		<view class="fixed">
			<view class="btn" @tap="Edit(-1)">添加{{btnText}}地址</view>
		</view>
	</view>
</template>

<script>
	import VerifyHelper from "@/common/verify.js"
	import {mapState,mapMutations} from 'vuex';
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	export default {
		components: {uniSegmentedControl},
		data() {
			return {
				AddressList:[],
				items: ['寄件地址','收件地址'],
				tabindex: 0,
				btnText:'寄件',
				type:'',
				curr:''
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			onClickItem(e){
				let _self=this;
				if (this.tabindex !== e.currentIndex) {
					this.tabindex = e.currentIndex;
					console.log('tabindex',this.tabindex);
					
					var _type = _self.tabindex===1?1:2;
					_self.btnText = this.tabindex===0?'寄件':'收件';
					_self.Get('/api/User/GetCommonlyUsedContactPageList?Type='+_type+'&PageSize=50',{},_self.userInfo.accessToken,function(dataObj){
						if(dataObj.Status && dataObj.Data && dataObj.Data.rows.length>0) {
							_self.AddressList = dataObj.Data.rows;
						}
						else _self.AddressList = []
					})
				}
			},
			Delete(id){
				let _self = this;
				uni.showModal({
					title:'提示',
					content:'确认删除当前信息？',
					cancelColor:'#FF3333',
					success: function (res) {
						if (res.confirm) {
							let _param={
								id:id
							}
							_self.POST('/api/User/DeleteCommonlyUsedContact',_param,_self.userInfo.accessToken,function(res){
								if(res.Status){
									_self.loadData();
									_self.showMsg('删除成功！')
								}
							},'biz','application/x-www-form-urlencoded')
						} 
					}
				})
			},
			Edit(index){
				let _self = this;
				var _type = _self.tabindex===1?1:2;
				// 编辑
				if(VerifyHelper.IsInt(index)&&Number(index)>-1 && index < _self.AddressList.length) {
					let _data = _self.AddressList[index]
					let _item = {
						ID:_data.ID,
						Lng:_data.Lng,
						Lat:_data.Lat,
						Province:_data.Province,
						City:_data.City,
						District:_data.District,
						Address:_data.Address,
						Address2:_data.Address2,
						Address3:_data.Address3,
						Phone :_data.Phone,
						FullName : _data.FullName,
						IsDefault :_data.IsDefault,
						RegionID:_data.RegionID,
						Region:_data.RegionName,
						}
					uni.navigateTo({
						url: '/pages/mine/addressEdit?data='+encodeURIComponent(JSON.stringify(_item))+'&type='+_type
					});
				}
				// 添加
				else uni.navigateTo({url: '/pages/mine/addressEdit?type='+_type+'&data='});
			},
			loadData(){
				let _self = this;
				
				var _type = this.tabindex === 0 ? 2 : 1;
				
				_self.Get('/api/User/GetCommonlyUsedContactPageList?Type='+_type+'&PageSize=50',{},_self.userInfo.accessToken,function(dataObj){
					if(dataObj.Status && dataObj.Data && dataObj.Data.rows.length>0) {
						_self.AddressList = dataObj.Data.rows;
					}
					else _self.AddressList = []
				})
			},
			ChooseArea:function(){
				uni.navigateTo({
					url:'/pages/index/chooseAddress'
				})
			},
			PageReload:function(data,type='area'){
				let _self = this;
				
				console.log('cur2:',this.curr);
				
				if(data!=null){
					_self.RegionID = data.RegionID;
					_self.Region = data.Region;
					if(type=="address"){
						_self.Address = data.Address;
						_self.Phone = data.Phone;
						_self.Name = data.Name;
					}
				}
			},
			
			//  点选地址
			AddressClick:function(index){
				let _self = this;
				if(index<0 || index>_self.AddressList.length) return;
				let _data = _self.AddressList[index]
				let _item={
					Lng:_data.Lng,
					Lat:_data.Lat,
					Address:_data.Address,
					Address2: _data.Address2,
					Address3: _data.Address3,
					Name:_data.FullName,
					Phone:_data.Phone,
					Province:_data.Province,
					City:_data.City,
					District:_data.District,
					RegionID:_data.RegionID,
					Region:_data.RegionName,
				}
				
				let pages = getCurrentPages();  //获取所有页面栈实例列表
				let _tagiIndex = -1;
				let _thisIndex = -1;
				for (let i = 0;i<pages.length;i++) {
					if(pages[i].route == 'pages/index/index')_tagiIndex = i;
					if(pages[i].route == _self.$scope.route) _thisIndex = i;
				}
				let prevPage = pages[_tagiIndex];  //上一页页面实例
				
				//console.log('_item',_item)
				//console.log('type',_self.type)
				prevPage.$vm.PageReload(_item,_self.type);
				uni.navigateBack({delta:(_thisIndex-_tagiIndex)})
			},
		},
		onLoad(option){
			this.type = option.type
			this.curr = option.curr
			
			if(this.curr == "1"){
				this.tabindex = 1;
				this.btnText = '收件'
			}
			else{
				this.tabindex = 0;
				this.btnText = '寄件';
			}
			
			this.loadData();
		},
	}
</script>

<style>
	.page{min-height: 100vh;width: 100vw;background-color: #F7F7F7;}
	.segmented-control{padding:0 30upx}
	.list{padding:30upx;margin-bottom: 140upx;}
	.null-data{text-align: center;
		padding: 30rpx;
		font-size: 16px;
		font-weight: bold;
	}
	.uni-flex{border: 1upx solid #e6e6e6;margin-bottom: 30upx;border-radius: 10upx;overflow: hidden;background-color: #FFFFFF;position: relative;}
	.uni-flex-item-3{border-right: 1upx solid #e6e6e6;}
	.title,.content{padding: 0 15upx;text-overflow: -o-ellipsis-lastline;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;}
	.title{font-size: 32upx;line-height: 70upx;-webkit-line-clamp: 2;line-clamp: 2;}
	.content{font-size: 28upx;line-height: 50upx;color: #8f8f94;-webkit-line-clamp: 3;line-clamp: 3;}
	.tag{color: #ff5000;background: #ffd6cc;padding: 0 10upx;margin-right: 10upx;}
	.edit,.delete{text-align: center;padding: 20upx 0;}
	.edit{border-bottom: 1upx solid #e6e6e6;}
	.img{width: 30upx;height: 30upx;}
	.txt{color: #8f8f94;line-height: 1;}
	.fixed{position: fixed;left: 0;right: 0;bottom: 0;height: 140upx;}
	.fixed .btn{
		background-color: #3399FE;
		color: #FFFFFF;
		height: 100upx;
		width: 670upx;
		margin:0 40upx 40upx 40upx;
		border-radius: 50upx;
		font-size: 36upx;
		line-height: 100upx;
		text-align: center;
	}
</style>
