(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/newMapAddress"],{1698:function(e,t,n){"use strict";(function(e){n("03cd");r(n("66fd"));var t=r(n("fdb8b"));function r(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])},2682:function(e,t,n){"use strict";n.r(t);var r=n("718d"),s=n.n(r);for(var o in r)"default"!==o&&function(e){n.d(t,e,(function(){return r[e]}))}(o);t["default"]=s.a},"418c":function(e,t,n){},"718d":function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=i(n("7a58")),s=i(n("96cd")),o=n("2f62");function i(e){return e&&e.__esModule?e:{default:e}}function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var u,l=function(){n.e("components/uni-search-bar/uni-search-bar").then(function(){return resolve(n("1b91"))}.bind(null,n)).catch(n.oe)},g=function(){n.e("components/uni-segmented-control/uni-segmented-control").then(function(){return resolve(n("3fbe"))}.bind(null,n)).catch(n.oe)},f=n("55c6"),p={components:{uniSegmentedControl:g,uniSearchBar:l},data:function(){return{busyFlag:!1,items:["地图选址","常用地址"],type:"mailing",current:-1,AddressList:[],markerPoint:[{latitude:29.08624,longitude:119.5715}],locationAddr:{latitude:29.08624,longitude:119.5715,address:"",desc:""},addressComponent:{adcode:"",city:"",city_level:0,country:"",country_code:0,country_code_iso:"",country_code_iso2:"",direction:"",distance:"",district:"",province:"",street:"",street_number:"",town:"",town_code:""},regionList:[],polygons:[],currDistrict:"",PostData:{latitude:0,longitude:0,province:"",city:"",district:"",regionID:0,region:""},searchAddress:[]}},computed:a({},(0,o.mapState)(["hasLogin","userInfo"])),watch:{currDistrict:function(){var e=this;e.polygons=[],e.Get("/api/Region/GetRegionListByAddress?district="+e.addressComponent.district,"",e.userInfo.accessToken,(function(t){if(t.Status)if(t.Data&&t.Data.length>0){e.regionList=t.Data;for(var n=0;n<t.Data.length;n++){var r={points:[],strokeWidth:1,strokeColor:"#000000",fillColor:"#ffffff"},s=JSON.parse(t.Data[n].RangeGCJ02);if(s&&s.length>0)for(var o=0;o<s.length;o++){var i={latitude:s[o].lat,longitude:s[o].lng};r.points.push(i)}e.polygons.push(r)}}else e.polygons=[],e.regionList=[]}),"biz")}},methods:{MapSearch:function(e){if(!r.default.IsNull(e.value)){var t=this;u.suggestion({query:e.value,region:t.addressComponent.city,success:function(e){if(t.searchAddress=[],e.result||e.result.length>0){for(var n=0;n<e.result.length;n++)(r.default.IsNull(t.addressComponent.city)||e.result[n].city==t.addressComponent.city)&&t.searchAddress.push({latitude:e.result[n].location.lat,longitude:e.result[n].location.lng,address:e.result[n].address,desc:e.result[n].name,city:e.result[n].city,district:e.result[n].district,province:e.result[n].province});t.searchAddress&&t.searchAddress.length>0&&(t.markerPoint=[],t.markerPoint.push({latitude:t.searchAddress[0].latitude,longitude:t.searchAddress[0].longitude}),t.locationAddr.latitude=t.searchAddress[0].latitude,t.locationAddr.longitude=t.searchAddress[0].longitude,t.locationAddr.address=t.searchAddress[0].address,t.locationAddr.desc=t.searchAddress[0].desc,t.currDistrict=t.searchAddress[0].district,t.addressComponent.province=t.searchAddress[0].province,t.addressComponent.city=t.searchAddress[0].city,t.addressComponent.district=t.searchAddress[0].district)}},fail:function(){t.searchAddress=[]}})}},onClickItem:function(e){this.current!==e.currentIndex&&(this.current=e.currentIndex)},DataLoad:function(){var e=this;e.AddressList=[],e.Get("/api/User/GetCommonlyUsedContact","",e.userInfo.accessToken,(function(t){if(t.Status&&t.Data&&t.Data.length>0)for(var n=t.Data,r=0;r<n.length;r++)"receipt"==e.type?1==n[r].Type&&e.AddressList.push(n[r]):2==n[r].Type&&e.AddressList.push(n[r])}))},AddressClick:function(t){var n=this;if(!(t<0||t>n.AddressList.length)){var r=n.AddressList[t],s=(r.Address2&&r.Address2,{Lng:r.Lng,Lat:r.Lat,Address:r.Address,Address2:r.Address2,Address3:r.Address3,Name:r.FullName,Phone:r.Phone,Province:r.Province,City:r.City,District:r.District,RegionID:r.RegionID,Region:r.RegionName}),o=getCurrentPages(),i=o[o.length-2];i.$vm.PageReload(s,n.type,r.Address,r.Address2),e.navigateBack({delta:1})}},touchend:function(){var t=this;t.searchAddress=[],e.createMapContext("map",this).getCenterLocation({success:function(e){u.regeocoding({location:e.latitude+","+e.longitude,success:function(e){var n=e.wxMarkerData;n&&n.length>0&&(t.locationAddr.latitude=n[0].latitude,t.locationAddr.longitude=n[0].longitude,t.locationAddr.address=n[0].address,t.locationAddr.desc=n[0].desc,t.searchAddress.push(t.locationAddr),t.addressComponent=e.originalData.result.addressComponent,t.markerPoint=[],t.markerPoint.push({latitude:t.locationAddr.latitude,longitude:t.locationAddr.longitude}),t.currDistrict=t.addressComponent.district)}})}})},CheckIsPtInPoly:function(t){var n=this;if(n.markerPoint=[],n.markerPoint.push({latitude:n.searchAddress[t].latitude,longitude:n.searchAddress[t].longitude}),n.locationAddr.latitude=n.searchAddress[t].latitude,n.locationAddr.longitude=n.searchAddress[t].longitude,n.locationAddr.address=n.searchAddress[t].address,n.locationAddr.desc=n.searchAddress[t].desc,n.addressComponent.province=n.searchAddress[t].province,n.addressComponent.city=n.searchAddress[t].city,n.addressComponent.district=n.searchAddress[t].district,!n.polygons||n.polygons.length<1)e.showToast({icon:"none",title:"该区域未开通服务"});else{for(var r=!1,o=0;o<n.polygons.length;o++)if(r=s.default.IsPtInPoly(n.locationAddr.latitude,n.locationAddr.longitude,n.polygons[o].points),!0===r){var i={City:n.regionList[o].City,District:n.regionList[o].District,RegionID:n.regionList[o].ID,Lat:n.regionList[o].Lat,Lng:n.regionList[o].Lng,RegionName:n.regionList[o].Name,Province:n.regionList[o].Province,Address:n.locationAddr.address,Desc:n.locationAddr.desc};return void e.navigateTo({url:"address?address="+JSON.stringify(i)+"&type="+n.type})}e.showToast({icon:"none",title:"该区域未开通服务"})}}},onLoad:function(t){var n=this;u=new f.BMapWX;var s=t.curr;n.DataLoad(),n.type=t.type,e.getLocation({type:"gcj02",success:function(e){u.regeocoding({location:e.latitude+","+e.longitude,success:function(e){var t=e.wxMarkerData;n.markerPoint=[],t&&t.length>0&&(n.locationAddr.latitude=t[0].latitude,n.locationAddr.longitude=t[0].longitude,n.locationAddr.address=t[0].address,n.locationAddr.desc=t[0].desc,n.searchAddress.push(n.locationAddr),n.addressComponent=e.originalData.result.addressComponent,n.markerPoint.push({latitude:n.locationAddr.latitude,longitude:n.locationAddr.longitude}),n.currDistrict=n.addressComponent.district)},fail:function(){n.markerPoint=[],n.markerPoint.push({latitude:29.08624,longitude:119.5715})}})}}),!r.default.IsInt(s)||s<0||s>n.items.length?n.current=0:n.current=Number(s)}};t.default=p}).call(this,n("543d")["default"])},"8ee8":function(e,t,n){"use strict";var r=n("418c"),s=n.n(r);s.a},aeb8:function(e,t,n){"use strict";n.d(t,"b",(function(){return s})),n.d(t,"c",(function(){return o})),n.d(t,"a",(function(){return r}));var r={uniSearchBar:function(){return n.e("components/uni-search-bar/uni-search-bar").then(n.bind(null,"1b91"))},uniSegmentedControl:function(){return n.e("components/uni-segmented-control/uni-segmented-control").then(n.bind(null,"3fbe"))},uniIcons:function(){return n.e("components/uni-icons/uni-icons").then(n.bind(null,"b6ed"))}},s=function(){var e=this,t=e.$createElement;e._self._c},o=[]},fdb8b:function(e,t,n){"use strict";n.r(t);var r=n("aeb8"),s=n("2682");for(var o in s)"default"!==o&&function(e){n.d(t,e,(function(){return s[e]}))}(o);n("8ee8");var i,d=n("f0c5"),a=Object(d["a"])(s["default"],r["b"],r["c"],!1,null,"5d3714ae",null,!1,r["a"],i);t["default"]=a.exports}},[["1698","common/runtime","common/vendor"]]]);