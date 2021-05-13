<template>
	<view class="container-warp">
		<view class="tab-box">
			<uni-segmented-control :current="current" :values="items" :style-type="styleType" :active-color="activeColor" @clickItem="onClickItem" />
		</view>
		<view class="content">
			<view v-if="current === 0">
				<view class="area-box">
					<view >
						<uni-search-bar radius="100" @confirm="search"/>
					</view>
					<view class="area-row">
						<view @tap="AreaClick(index)" v-for="(item,index) in AreaList" :key="index" class="fl area-item" :class="{'area-active':AreaIndex==index}">{{item.Name}}</view>
					</view>
					<view class="btnSureArea" @tap="btnSureArea">确 定</view>
				</view>
			</view>
			<view v-if="current === 1">
				<view class="address-box">
					<view class="address-row" @tap="AddressClick(index)" v-for="(item,index) in AddressList" :key="index">
						<view class="person uni-row uni-flex">
							<view class="name">{{item.FullName}}</view>
							<view class="phone">{{item.Phone}}</view>
						</view>
						<view class="des">{{item.RegionName}} {{item.Address}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import VerifyHelper from "@/common/verify.js"
	import {mapState,mapMutations} from 'vuex';
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	export default{
		components: {uniSegmentedControl,uniSearchBar},
		data() {
			return {
				items: ['寄件区域', '常用地址'],
				current: 0,
				activeColor: '#3399FE',
				styleType: 'button',
				AreaList:[],
				RegionInfo:{
					RegionID:-1,
					Region:'',
					Address:'',
					Phone:'',
					Name:''},
				AddressList:[],
				PageIndex:1,
				PageSize:50,
				AreaIndex:-1
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		methods:{
			LoadData:function(){
				let _self = this;
				_self.Get('/api/Region/GetRegionListPage?SortField=Sort&All=true&Enable=true&IsDescending=false&PageIndex='+_self.PageIndex+'&PageSize='+_self.PageSize,'',_self.userInfo.accessToken,function(res){
					if(res.Status){
						_self.AreaList = res.Data.rows;
					}
				});
				_self.Get('/api/User/GetCommonlyUsedContact','',_self.userInfo.accessToken,function(res){
					if(res.Status){
						_self.AddressList = res.Data;
					}
				})
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			search(keyword) {
				let _self = this;
				let _url = '/api/Region/GetRegionListPage?SortField=Sort&All=true&Enable=true&IsDescending=false&PageIndex='+_self.PageIndex+'&PageSize='+_self.PageSize
				if(!VerifyHelper.IsNull(keyword.value))_url+='&Keyword='+keyword.value;
				_self.Get(_url,'',_self.userInfo.accessToken,function(res){
					if(res.Status){
						_self.AreaList = res.Data.rows;
					}
				});
			},
			AreaClick:function(index){
				let _self = this;
				_self.AreaIndex = index;
			},
			btnSureArea:function(){
				let _self = this;
				if(_self.AreaIndex<0 || _self.AreaIndex>_self.AreaList.length){
					_self.showMsg('请选择区域！');
					return;
				}
				let pages = getCurrentPages();  //获取所有页面栈实例列表
				let prevPage = pages[pages.length-2];  //上一页页面实例
				_self.RegionInfo.RegionID = _self.AreaList[_self.AreaIndex].ID;
				_self.RegionInfo.Region = _self.AreaList[_self.AreaIndex].Name;
				prevPage.$vm.PageReload(_self.RegionInfo,'area');
				uni.navigateBack({delta:1})
			},
			AddressClick:function(index){
				let _self = this;
				if(index<0 || index>_self.AddressList.length)return;
				let pages = getCurrentPages();  //获取所有页面栈实例列表
				let prevPage = pages[pages.length-2];  //上一页页面实例
				_self.RegionInfo.RegionID = _self.AddressList[index].RegionID;
				_self.RegionInfo.Region = _self.AddressList[index].RegionName;
				_self.RegionInfo.Address = _self.AddressList[index].Address;
				_self.RegionInfo.Phone = _self.AddressList[index].Phone;
				_self.RegionInfo.Name = _self.AddressList[index].FullName;
				prevPage.$vm.PageReload(_self.RegionInfo,'address');
				uni.navigateBack({delta:1})
			}
		},
		onLoad:function(option){
			this.LoadData();
		}
	}
</script>

<style lang="scss">
	page{background-color: #FFFFFF;width: 690upx;margin: 0 30upx;
		.tab-box{margin-top: 30upx;}
		.content{margin-top: 10upx;
			.area-box{
				.area-row{margin-top: 20upx;
					.area-item{
						width: 150upx;height: 150upx;box-sizing: border-box;border: 1upx solid #eaeaea;
						text-align: center;color: #333333;margin: 10upx;font-size: 26upx;
						display: flex;align-items: center;justify-content: center;line-height: 1.2;  
					}
					.area-active{
						border-color: #3399FE;
						border-top-width: 6upx;
						border-top-color:#3399FE;
						border-bottom-width: 6upx;
						border-bottom-color:#3399FE;
					}
				}
				.btnSureArea{position: fixed;width: 500upx;height: 80upx;border-radius: 40upx;
							 text-align: center;bottom: 50upx;background-color: #3399FE;font-size: 32upx;
							 line-height: 80upx;left: 125upx;color: #FFFFFF;
				}
			}
			.address-box{margin-top: 10upx;
				.address-row{border-bottom: 1upx solid #F5F5F5;padding: 20upx 0;
					.person{height: 60upx;
						.name{color: #222222;font-size: 32upx;font-weight: bold;line-height: 60upx;margin-right: 20upx;}
						.phone{color: #666666;font-size: 28upx;line-height: 60upx;}
					}
					.des{color: #888888;height: 40upx;line-height: 40upx;}
				}
			}
		}
	}
</style>
