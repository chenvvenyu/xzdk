(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/mine/orderList"],{"0c4a":function(t,e,a){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=u(a("7a58")),n=a("2f62");function u(t){return t&&t.__esModule?t:{default:t}}function s(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,r)}return a}function i(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?s(Object(a),!0).forEach((function(e){o(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function o(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var c={data:function(){return{tabIndex:0,tabBars:[{name:"全部",type:"0"},{name:"待支付",type:"unpaid"},{name:"待揽件",type:"10"},{name:"寄送中",type:"40"},{name:"已完成",type:"50"},{name:"已取消",type:"-1"}],PageIndex:1,PageSize:20,OrderList:[]}},computed:i({},(0,n.mapState)(["hasLogin","userInfo"])),methods:{btnLook:function(e){t.navigateTo({url:"/pages/mine/logistics?id="+e})},btnDetails:function(e){t.navigateTo({url:"/pages/mine/orderDetail?id="+e})},btnPay:function(e){t.navigateTo({url:"/pages/index/orderPay?orderid="+e})},tabTap:function(t){var e=this;e.OrderList=[],e.tabIndex=t,this.loadData()},loadData:function(){var t=this;t.tabIndex>=t.tabBars.length&&(t.tabIndex=0);var e=t.tabBars[t.tabIndex].type,a=t.GetUrlByType(e);t.Get(a,"",t.userInfo.accessToken,(function(e){if(e.Status)for(var a=0;a<e.Data.rows.length;a++)t.OrderList.push(e.Data.rows[a])}),"biz")},GetUrlByType:function(t){var e=this;switch(t){default:case"0":return"/api/Order/GetUserOrderListPage?SortField=CreateTime&IsDescending=true&AllOrderStatus=true&PageIndex="+e.PageIndex+"&PageSize="+e.PageSize;case"-1":case"10":case"20":case"30":case"40":case"50":return"/api/Order/GetUserOrderListPage?SortField=CreateTime&IsDescending=true&AllOrderStatus=false&Status="+t+"&PageIndex="+e.PageIndex+"&PageSize="+e.PageSize;case"unpaid":return"/api/Order/GetUnpaidOrderListPage?SortField=CreateTime&IsDescending=true&AllOrderStatus=true&PageIndex="+e.PageIndex+"&PageSize="+e.PageSize}},GetStatus:function(t){return 61==t.Status?"退款完成":60==t.Status?"退款中":-1==t.Status?"已取消":10==t.Status?"待揽件":20==t.Status?"已揽件":30==t.Status?"待派送":40==t.Status?"派送中":50==t.Status?"已签收":-2==t.Status?"强制取消":""},GetStatusText:function(t){return 61==t?"已退款":60==t?"订单退款":-1==t?"订单取消":10==t?"等待接单":20==t||30==t||40==t?"寄送中":50==t?"完成":-2==t?"订单取消":""},GetPayText:function(t){return-1==t.Status||60==t.Status||61==t.Status?"":t.FareArrivePay?"到付":"已支付"},IsPay:function(t){return!(!t.FareArrivePay||-1==t.Status||60==t.Status||61==t.Status)||(!(-1!=t.Status&&60!=t.Status&&61!=t.Status&&!t.FareArrivePay)||0!=t.PayNumber&&!(t.Cost-t.CouponPrice-t.RealAmount>0))},btnCancel:function(e){var a=this;t.showModal({title:"提示",content:"确认取消该订单？",cancelColor:"#FF3333",success:function(r){r.confirm&&a.POST("/api/Pay/CancelOrderAndRefundAmount",{orderId:e},a.userInfo.accessToken,(function(e){e.Status?(a.OrderList=[],a.loadData(),t.showToast({icon:"success",title:"订单取消成功"})):a.showMsg(e.Message)}),"repay","application/x-www-form-urlencoded")}})}},onLoad:function(t){var e=this,a=t.status;if(!r.default.IsNull(a))for(var n=0;n<e.tabBars.length;n++)e.tabBars[n].type==a&&(e.tabIndex=n);e.OrderList=[],e.loadData()}};e.default=c}).call(this,a("543d")["default"])},"371a":function(t,e,a){"use strict";a.r(e);var r=a("c8a5"),n=a("8896");for(var u in n)"default"!==u&&function(t){a.d(e,t,(function(){return n[t]}))}(u);a("7221");var s,i=a("f0c5"),o=Object(i["a"])(n["default"],r["b"],r["c"],!1,null,null,null,!1,r["a"],s);e["default"]=o.exports},7221:function(t,e,a){"use strict";var r=a("e3a5"),n=a.n(r);n.a},8896:function(t,e,a){"use strict";a.r(e);var r=a("0c4a"),n=a.n(r);for(var u in r)"default"!==u&&function(t){a.d(e,t,(function(){return r[t]}))}(u);e["default"]=n.a},a06a:function(t,e,a){"use strict";(function(t){a("03cd");r(a("66fd"));var e=r(a("371a"));function r(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,a("543d")["createPage"])},c8a5:function(t,e,a){"use strict";var r;a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return u})),a.d(e,"a",(function(){return r}));var n=function(){var t=this,e=t.$createElement,a=(t._self._c,t.__map(t.OrderList,(function(e,a){var r=t.__get_orig(e),n=t.IsPay(e),u=n?t.GetStatus(e):null,s=n?t.GetStatusText(e.Status):null,i=n?t.GetPayText(e):null;return{$orig:r,m0:n,m1:u,m2:s,m3:i}})));t.$mp.data=Object.assign({},{$root:{l0:a}})},u=[]},e3a5:function(t,e,a){}},[["a06a","common/runtime","common/vendor"]]]);