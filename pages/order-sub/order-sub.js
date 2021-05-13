// pages/order-sub/order-sub.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tablewareList: [1, 2, 3, 4, 5],
        tablewareIndex: 0,
        pageData: "",
        options: "",
        proSub: "", //来源页面传入的用于生成订单信息的产品信息
        coupon: "", //优惠券列表
        couponsId: "", //选取的优惠券
        realPrice: 0, //实付金额
        description: "", //备注
        time: "",
        deliveryType: "1", //1外卖2自提
        remark: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            proSub: JSON.parse(options.pro),
        });
        this.getOrderInfo();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        
        //获取缓存的用户地址
        wx.getStorage({
            key: 'address-orderSub',
            success(res) {
                console.log(res);
                that.setData({
                    "pageData.userAddressInfo": res.data,
                });
                that.paotuifei();
                wx.removeStorage({
                    key: 'address-orderSub',
                    success: function(res) {
                        console.log("地址缓存数据已移除");
                    },
                });
                // that.getCoupon();
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
    paotuifei(){
        //跑腿费从新计算
        app.ajaxWx({
            type: "get",
            url: `/api/v1/product/order/updateAddress/calculate/freight`,
            data: {
                businessId: this.data.pageData.businessDTO.businessId,
                userAddressId: this.data.pageData.userAddressInfo.addressId,
            },
            // contentType: "json",
            name: "order",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        "pageData.userBearFreight": res.data,
                    });
                    // if(res.data.userAddressDTO){
                    //     this.getCoupon();
                    // }; 
                };
            },
        });
    },
    choiceDeliveryType(e){
        let type = e.currentTarget.dataset.type;
        this.setData({
            deliveryType: type,
        });
    },
    twobind(e) {
        app.bindValue(e, this);
    },
    bindTimeChange(e){
        let x = e.detail.value;
        //开始时间-用于预约订单
        let myDate = new Date();
        let starDate = myDate.getFullYear() + "-" + app.checkTime((myDate.getMonth() + 1)) + "-" + app.checkTime(myDate.getDate());
        this.setData({
            time: `${starDate} ${x}`,
        })
    },
    getOrderInfo(){
        //获取订单信息
        app.ajaxWx({
            type: "post",
            url: `/api/v1/product/order/previewProductOrder`,
            data: this.data.proSub,
            contentType: "json",
            name: "order",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        pageData: res.data,
                    });
                    // if(res.data.userAddressDTO){
                    //     this.getCoupon();
                    // }; 
                };
            },
        });
    },
    getCoupon() {
        let address = this.data.pageData.userAddressDTO;
        let that = this;
        app.ajaxWx({
            type: "get",
            url: `${app.public.server_user}/api/v1/user/coupon/query`,
            data: {
                provinceId: address.provinceId,
                cityId: address.cityId,
                districtId: address.districtId,
                status: 2,
                limitAmount: this.data.pageData.realAmount,
            },
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        coupon: res.data.list,
                    });
                    if (res.data.list.length > 0) {
                        //选取最大面额的一张优惠券
                        let coupon = res.data.list;
                        let max = coupon[0].reliefAmount;
                        let y = 0;
                        coupon.forEach((item, index) => {
                            max = max > item.reliefAmount ? max : item.reliefAmount;
                            y = max > item.reliefAmount ? y : index;
                        });
                        this.setData({
                            couponsId: y + "",
                        });
                    };
                    this.countPrice();
                };
            }
        });
    },
    pickerCoupon(e) {
        //优惠券选择
        let val = e.detail.value;
        this.setData({
            couponsId: val + "",
        });
        this.countPrice();
    },
    clearCoupon() {
        //清除优惠券
        this.setData({
            couponsId: "",
        });
        this.countPrice();
    },
    tablewareChange(e){
        //优惠券选择
        let val = e.detail.value;
        this.setData({
            tablewareIndex: val + "",
        });
    },
    countPrice() {
        //价格计算
        let r = this.data.pageData.realAmount; //实际付款金额
        let c = 0; //优惠券抵扣金额
        if (this.data.couponsId) {
            //优惠券计算
            c = this.data.coupon[this.data.couponsId].reliefAmount;
            if ((r - c) > 0) {
                console.log("优惠券抵扣金额未超过实付金额");
                r = r - c;
            } else {
                console.log("优惠券抵扣金额超过实际付款金额,禁止使用酒币");
                r = 0;
            };
        };
        //----
        this.setData({
            realPrice: r.toFixed(2),
        })
    },
    sub() {
        let pageData = this.data.pageData;
        if (!pageData.userAddressInfo) {
            wx.showToast({
                title: '无收货地址',
                image: "/static/img/warn.png",
                mask: true,
                duration: 2000
            });
            return false;
        };
        let proSub = this.data.proSub;
        // let coupon = this.data.coupon;
        // let couponsId = this.data.couponsId;
        // let timeD = this.data.time ? new Date(this.data.time + ":00") : "";
        let subData = {
            addressId: pageData.userAddressInfo.addressId,
            previewProductOrderForms: proSub,
            productOrderForm: {
                // businessBearFreight: pageData.businessBearFreight,
                businessId: pageData.businessDTO.businessId,
                couponId: "",
                isOpenInvoice: 0,
                remark: this.data.remark,
                // userBearFreight: pageData.userBearFreight, 
            },
        };
        //创建真实订单
        app.ajaxWx({
            type: "post",
            url: `/api/v1/product/order/creatProductOrder`,
            data: subData,
            contentType: "json",
            name: "order",
            success: res => {
                if (res.code == "000000") {
                    wx.redirectTo({
                        url: `/pages/order-pay/order-pay?id=${res.data.productOrderId}&t=pro`,
                    });
                    //1待支付,2待接单,3待配送,4配送中,5待评价,6已完成,7已取消,8已超时
                    // if(res.data.status == 1){
                    //     wx.redirectTo({
                    //         url: `/pages/order-pay/order-pay?id=${res.data.id}`,
                    //     });
                    // };
                    // if(res.data.status == 2){
                    //     app.public.orderTabN = 2;
                    //     wx.redirectTo({
                    //         url: '/pages/order-list/order-list',
                    //     });
                    // }
                };
            }
        });
    }
})