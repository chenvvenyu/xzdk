// pages/recharge/recharge.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        amountList: [],
        tab: 0,
        otherAmount: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAll();
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
    getAll() {
        app.ajaxWx({
            type: "get",
            url: `/api/v1/recharge/list`,
            name: "appliance",
            success: res => {
                if (res.code == "000000" && res.data.list.length > 0) {
                    this.setData({
                        amountList: res.data.list,
                    });
                };
            }
        });
    },
    inAmount(e) {
        let val = e.detail.value;
        this.setData({
            otherAmount: val,
        });
    },
    tab(e) {
        let tab = e.currentTarget.dataset.tab;
        this.setData({
            tab: tab,
        });
    },
    sub() {
        let amountList = this.data.amountList;
        let tab = this.data.tab;
        app.ajaxWx({
            type: "post",
            url: `/api/v1/user/order/recharge/save`,
            data: {
                "amount": amountList[tab].amount,
                "rechargeType": 1,
            },
            contentType: "json",
            name: "order",
            success: res => {
                if (res.code == "000000") {
                    this.pay(res.data);
                };
            }
        });
    },
    pay(id) {
        app.ajaxWx({
            type: "post",
            url: `/api/v1/user/order/recharge/pay`,
            data: {
                orderId: id,
                payType: "WXMINIAPP",
            },
            contentType: "json",
            name: "order",
            success: res => {
                if (res.code == "000000") {
                    this.wxPay(res.data.jsonObject);
                }
            }
        });
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
                                url: "/pages/order/order"
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
})