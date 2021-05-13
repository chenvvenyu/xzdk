// pages/buyForMe-sub/buyForMe-sub.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        recommendList: [1, 2, 2, 3, 4, 1, 1, 1, 1, 1, 1, 1, 1],
        tabVa: 1,
        buyWhat: "",
        subData: {
            buyRemark: "", //购买备注
            categoryId: 0, //分类ID
            confirm: "2", //是否阅读
            cost: "", //商品估价
            distance: 0, //附近2000
            endAddressId: "", //收货ID
            expressBusinessType: 3, //3指定 4附近
            fee: "", //实际跑腿费用
            lat: "",
            lng: "",
            mailAddress: "", //地址中文
            orderType: 2,
            totalBonus: 0,
            confirm: 1,
            planAmount: "",
        },
        collect: {
            name: "收件人信息",
            address: "请输入收件人信息"
        },
        defaultDis: "",
        amount: 0,
        priceShow: false,
        tips: "跑腿费",
        infoDetail: "",
        lastPrice: 0,
        couponType: "none",
        couponValue: 0,
        couponsId: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取默认的就近购买范围 默认为2000m
        app.ajaxWx({
            type: "get",
            url: `/api/v1/sysconfig/param/getByParamKey`,
            data: {
                paramKey: "default_distance",
            },
            name: "appliance",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        defaultDis: res.data.paramValue,
                    })
                };
            },
        });
        this.getCoupon();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    priceShowFn(){
        this.setData({
            priceShow: !this.data.priceShow
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        wx.getStorage({
            key: 'address-collect',
            success(res) {
                console.log(res);
                that.setData({
                    collect: res.data,
                });
                that.calculation();
                wx.removeStorage({
                    key: 'address-collect',
                    success: function (res) {
                        console.log("收件人地址缓存数据已移除");
                    },
                });
            }
        });
        
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    bindValue(e) {
        app.bindValue(e, this);
    },
    getNum(res) {
        this.setData({
            "subData.totalBonus": res.detail.num
        });
        this.endPrice();
    },
    calculation() {
        let tab = this.data.tabVa;
        if (this.data.collect.addressId) {
            this.setData({
                tips: "正在计算跑腿费..."
            });
            //1指定地点购买 2就近购买
            if (tab == 1 && this.data.subData.lat) {
                app.ajaxWx({
                    type: "get",
                    url: `/api/v1/user/address/calculation/buytome/fee/location`,
                    data: {
                        endAddressId: this.data.collect.addressId,
                        lat: this.data.subData.lat,
                        lng: this.data.subData.lng,
                        cost: 0,
                        type: 1,
                        weight: 1,
                    },
                    name: "user",
                    success: res => {
                        if (res.code == "000000") {
                            this.setData({
                                tips: "跑腿费",
                                "subData.distance": res.data.paramValue,
                                "subData.fee": res.data.amount,
                                amount: res.data.amount
                            });
                            this.endPrice();
                        };
                    },
                });
            } else if(tab == 2 && this.data.defaultDis) {
                this.setData({
                    tips: "正在计算跑腿费..."
                });
                app.ajaxWx({
                    type: "get",
                    url: `/api/v1/user/address/calculation/buytome/fee/distance`,
                    data: {
                        endAddressId: this.data.collect.addressId,
                        cost: 0,
                        distance: this.data.defaultDis ? this.data.defaultDis : 2000,
                        type: 1,
                        weight: 1,
                    },
                    name: "user",
                    success: res => {
                        if (res.code == "000000") {
                            this.setData({
                                tips: "跑腿费",
                                "subData.distance": res.data.distance,
                                "subData.fee": res.data.amount,
                                amount: res.data.amount
                            });
                            this.endPrice();
                        };
                    },
                });
            };
            
        }
    },
    tabFn(e) {
        //购买方式切换
        this.setData({
            tabVa: e.currentTarget.dataset.x,
        })
    },
    getCoupon() {
        //calculationType:1 折扣 2满减（抵扣）
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/coupon/current/express/type/list`,
            data: {
                type: 2,
            },
            name: "user",
            success: res => {
                if (res.code == "000000") {
                    res.data.map(e=>{
                        if(e.couponDTO.calculationType == 1){
                            e.str = `${e.couponDTO.discount*10}折券`;
                        }else if(e.couponDTO.calculationType == 2){
                            e.str = `${e.couponDTO.couponAmount}元券（满${e.couponDTO.taskAmount}元可用）`;
                        };
                    });
                    res.data.unshift({
                        str: "不使用优惠券"
                    })
                    this.setData({
                        coupon: res.data,
                    });
                };
            }
        });
    },
    endPrice(){
        //计算最终价格
        let lastPrice = 0;
        let amount = this.data.amount;
        let couponType = this.data.couponType;
        let couponValue = this.data.couponValue;
        let reward = this.data.reward;
        if(couponType == 1){
            //折扣
            lastPrice = (amount*couponValue).toFixed(1);
        }else{
            //满减
            if((amount - couponValue) < 0){
                lastPrice = 0;
            }else{
                lastPrice = (amount - couponValue).toFixed(1);
            }
        };
        this.setData({
            lastPrice: lastPrice,
        });
    },
    pickerCoupon(e) {
        //优惠券选择
        let val = e.detail.value;
        let list = this.data.coupon;
        let couponValue = 0;
        if(val == 0){
            this.setData({
                couponType: 'none',
                couponsId: "",
                couponValue: 0
            });
        }else{
            if(list[val].couponDTO.calculationType == 1){
                couponValue = list[val].couponDTO.discount*1;
            }else if(list[val].couponDTO.calculationType == 2){
                couponValue = list[val].couponDTO.couponAmount*1;
            };
            this.setData({
                couponType: list[val].couponDTO.calculationType,
                couponsId: val + "",
                couponValue: couponValue
            });
        };
        this.endPrice();
    },
    choiceLoaction() {
        //打开地图选择地址
        let that = this;
        let location = "";
        if (this.data.subData.lat && this.data.subData.lng) {
            location = this.data.subData;
        } else {
            location = app.public.userLocation.common;
        };
        wx.chooseLocation({
            latitude: location.lat,
            longitude: location.lng,
            success: res => {
                console.log('success:', res);
                that.setData({
                    "subData.mailAddress": res.name,
                    "subData.lat": res.latitude,
                    "subData.lng": res.longitude,
                });
                console.log(that.data.subData)
                that.calculation();
            },
            fail: res => {
                console.log('fail:', res);
            },
        })
    },
    isAgree() {
        //是否同意服务协议
        this.setData({
            agree: !this.data.agree
        });
        this.calculation();
    },
    sub() {
        //下单快递
        let subData = this.data.subData;
        let collect = this.data.collect;
        subData.endAddressId = collect.addressId;
        subData.cost = subData.planAmount;
        subData.couponId = this.data.couponsId?this.data.coupon[this.data.couponsId].couponId: ""
        if (collect.name == "收件人信息") {
            wx.showToast({
                title: '请填写收件人地址',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        let agree = this.data.agree;
        if (!agree) {
            wx.showToast({
                title: '请同意快件服务协议',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        if(!subData.buyRemark){
            wx.showToast({
                title: '请填写需要购买的物品',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        if(this.data.tabVa==1 && !subData.lat){
            wx.showToast({
                title: '请选择购买的地点',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        if(this.data.tabVa == 2){
            subData.expressBusinessType = 4;
        }
        app.ajaxWx({
            type: "post",
            url: `/api/v1/user/order/created/buy/to/me`,
            data: subData,
            contentType: "json",
            name: "order",
            success: res => {
                if (res.code == "000000") {
                    wx.showToast({
                        title: '下单成功',
                        icon: 'success',
                        duration: 1500,
                        mask: true,
                    });
                    setTimeout(function(){
                        wx.redirectTo({
                            url: `/pages/order-pay/order-pay?id=${res.data}`,
                        })
                    },1500)
                    // wx.navigateTo({
                    //   url: `/pages/help-order-detail/help-order-detail?id=${res.data}`,
                    // })
                };
            }
        });
    }
})