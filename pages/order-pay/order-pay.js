// pages/order-pay/order-pay.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: "",
        balance: "",
        payType: 1,
        time: "",
        id: "",
        type: "WXMINIAPP",
        t: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        this.data.id = options.id;
        if(options.t){
            // this.data.t = true;
            this.setData({
                t: true
            })
        };
        this.getDetail();
        this.getBlance();
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
    getDetail() {
        let t = this.data.t;
        if(t){
            app.ajaxWx({
                type: "get",
                url: `/api/v1/product/order/get`,
                data: {
                    id: this.data.id,
                },
                name: "order",
                tip: "加载中...",
                success: res => {
                    if (res.code == "000000") {
                        this.setData({
                            pageData: res.data,
                        });
                    };
                }
            });
        }else{
            app.ajaxWx({
                type: "get",
                url: `/api/v1/user/order/get`,
                data: {
                    orderId: this.data.id,
                },
                name: "order",
                tip: "加载中...",
                success: res => {
                    if (res.code == "000000") {
                        this.setData({
                            pageData: res.data,
                        });
                    };
                }
            });
        }
        
    },
    getBlance() {
        //获取用户余额
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/account/current`,
            data: {
                type: 1,
            },
            name: "user",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        balance: res.data,
                    });
                };
            }
        });
    },
    choiceType(e) {
        let payType = e.currentTarget.dataset.type;
        let a = e.currentTarget.dataset.a;
        this.setData({
            payType: payType,
            type: a,
        });
    },
    createPay() {
        let payType = this.data.payType;
        let that = this;
        let t = this.data.t;
        if(t){
            app.ajaxWx({
                type: "post",
                url: `/api/v1/product/order/pay`,
                data: {
                    productOrderId: that.data.id,
                    payType: that.data.type,
                },
                contentType: "json",
                name: "order",
                tip: "支付中...",
                success: res => {
                    if (res.code == "000000") {
                        if (payType == 1) {
                            //微信支付
                            that.wxPay(res.data.jsonObject);
                        };
                        if (payType == 4) {
                            //余额支付
                            wx.showModal({
                                title: '提示',
                                content: `支付成功`,
                                showCancel: false,
                                success(res) {
                                    if (res.confirm) {
                                        wx.reLaunch({
                                            url: "/pages/lookup/lookup"
                                        });
                                    };
                                }
                            });
                            //this.linkTo();
                        };
                    }
                }
            })
        }else{
            app.ajaxWx({
                type: "post",
                url: `/api/v1/user/order/pay`,
                data: {
                    expressOrderId: that.data.id,
                    payType: that.data.type,
                },
                contentType: "json",
                name: "order",
                tip: "支付中...",
                success: res => {
                    if (res.code == "000000") {
                        if (payType == 1) {
                            //微信支付
                            that.wxPay(res.data.jsonObject);
                        };
                        if (payType == 4) {
                            //余额支付
                            wx.showModal({
                                title: '提示',
                                content: `支付成功`,
                                showCancel: false,
                                success(res) {
                                    if (res.confirm) {
                                        wx.reLaunch({
                                            url: "/pages/lookup/lookup"
                                        });
                                    };
                                }
                            });
                            //this.linkTo();
                        };
                    }
                }
            })
        }
        
    },
    wxPay(res) {
        let that = this;
        //微信支付
        console.log(res)
        wx.requestPayment({
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.packageValue,
            signType: res.signType,
            paySign: res.paySign,
            success(res) {
                wx.showModal({
                    title: '提示',
                    content: `支付成功`,
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            wx.reLaunch({
                                url: "/pages/lookup/lookup"
                            });
                        };
                    }
                });
                // that.linkTo();
            },
            fail(res) {
                console.log(res)
                wx.showModal({
                    title: '提示',
                    content: '支付失败',
                    showCancel: false,
                })
            }
        })
    },
    linkTo() {
        let type = this.data.pageData.type;
        wx.reLaunch({
            url: "/pages/lookup/lookup"
        });
    }
})