(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/chooseAddress"],{"147d":function(e,n,t){"use strict";t.r(n);var r=t("c15e"),o=t("f96a");for(var a in o)"default"!==a&&function(e){t.d(n,e,(function(){return o[e]}))}(a);t("8d00");var i,s=t("f0c5"),u=Object(s["a"])(o["default"],r["b"],r["c"],!1,null,null,null,!1,r["a"],i);n["default"]=u.exports},"2c86":function(e,n,t){"use strict";(function(e){t("03cd");r(t("66fd"));var n=r(t("147d"));function r(e){return e&&e.__esModule?e:{default:e}}e(n.default)}).call(this,t("543d")["createPage"])},"4a49":function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=a(t("7a58")),o=t("2f62");function a(e){return e&&e.__esModule?e:{default:e}}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){u(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function u(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}var c=function(){t.e("components/uni-segmented-control/uni-segmented-control").then(function(){return resolve(t("3fbe"))}.bind(null,t)).catch(t.oe)},d=function(){t.e("components/uni-search-bar/uni-search-bar").then(function(){return resolve(t("1b91"))}.bind(null,t)).catch(t.oe)},f={components:{uniSegmentedControl:c,uniSearchBar:d},data:function(){return{items:["寄件区域","常用地址"],current:0,activeColor:"#3399FE",styleType:"button",AreaList:[],RegionInfo:{RegionID:-1,Region:"",Address:"",Phone:"",Name:""},AddressList:[],PageIndex:1,PageSize:50,AreaIndex:-1}},computed:s({},(0,o.mapState)(["hasLogin","userInfo"])),methods:{LoadData:function(){var e=this;e.Get("/api/Region/GetRegionListPage?SortField=Sort&All=true&Enable=true&IsDescending=false&PageIndex="+e.PageIndex+"&PageSize="+e.PageSize,"",e.userInfo.accessToken,(function(n){n.Status&&(e.AreaList=n.Data.rows)})),e.Get("/api/User/GetCommonlyUsedContact","",e.userInfo.accessToken,(function(n){n.Status&&(e.AddressList=n.Data)}))},onClickItem:function(e){this.current!==e.currentIndex&&(this.current=e.currentIndex)},search:function(e){var n=this,t="/api/Region/GetRegionListPage?SortField=Sort&All=true&Enable=true&IsDescending=false&PageIndex="+n.PageIndex+"&PageSize="+n.PageSize;r.default.IsNull(e.value)||(t+="&Keyword="+e.value),n.Get(t,"",n.userInfo.accessToken,(function(e){e.Status&&(n.AreaList=e.Data.rows)}))},AreaClick:function(e){var n=this;n.AreaIndex=e},btnSureArea:function(){var n=this;if(n.AreaIndex<0||n.AreaIndex>n.AreaList.length)n.showMsg("请选择区域！");else{var t=getCurrentPages(),r=t[t.length-2];n.RegionInfo.RegionID=n.AreaList[n.AreaIndex].ID,n.RegionInfo.Region=n.AreaList[n.AreaIndex].Name,r.$vm.PageReload(n.RegionInfo,"area"),e.navigateBack({delta:1})}},AddressClick:function(n){var t=this;if(!(n<0||n>t.AddressList.length)){var r=getCurrentPages(),o=r[r.length-2];t.RegionInfo.RegionID=t.AddressList[n].RegionID,t.RegionInfo.Region=t.AddressList[n].RegionName,t.RegionInfo.Address=t.AddressList[n].Address,t.RegionInfo.Phone=t.AddressList[n].Phone,t.RegionInfo.Name=t.AddressList[n].FullName,o.$vm.PageReload(t.RegionInfo,"address"),e.navigateBack({delta:1})}}},onLoad:function(e){this.LoadData()}};n.default=f}).call(this,t("543d")["default"])},"8d00":function(e,n,t){"use strict";var r=t("91a5"),o=t.n(r);o.a},"91a5":function(e,n,t){},c15e:function(e,n,t){"use strict";t.d(n,"b",(function(){return o})),t.d(n,"c",(function(){return a})),t.d(n,"a",(function(){return r}));var r={uniSegmentedControl:function(){return t.e("components/uni-segmented-control/uni-segmented-control").then(t.bind(null,"3fbe"))},uniSearchBar:function(){return t.e("components/uni-search-bar/uni-search-bar").then(t.bind(null,"1b91"))}},o=function(){var e=this,n=e.$createElement;e._self._c},a=[]},f96a:function(e,n,t){"use strict";t.r(n);var r=t("4a49"),o=t.n(r);for(var a in r)"default"!==a&&function(e){t.d(n,e,(function(){return r[e]}))}(a);n["default"]=o.a}},[["2c86","common/runtime","common/vendor"]]]);