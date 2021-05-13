// pages/coupon/coupon.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.getWaitCoupon();
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
    getWaitCoupon() {
        //获取用户待领优惠券取列表
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/coupon/wait/receive/coupon/list`,
            name: "user",
            success: res => {
                if (res.code == "000000") {
                    res.data.map(x => {
                        x.date = x.endTime.substring(0, 10)
                    });
                    this.setData({
                        list: res.data,
                    });
                };
            }
        });
    },
    receive(e) {
        //单张领取
        let couponId = e.currentTarget.dataset.id;
        app.ajaxWx({
            type: "post",
            url: `/api/v1/user/coupon/save`,
            data: [{
                couponId: couponId
            }],
            contentType: "json",
            name: "user",
            tip: "领取中...",
            success: res => {
                if (res.code == "000000") {
                    this.getWaitCoupon();
                };
            }
        });
    },
    receiveAll() {
        //一键领取
        let list = [];
        this.data.list.map(x => {
            list.push({
                couponId: x.couponId
            });
        });
        app.ajaxWx({
            type: "post",
            url: `/api/v1/user/coupon/save`,
            data: list,
            contentType: "json",
            name: "user",
            tip: "领取中...",
            success: res => {
                if (res.code == "000000") {
                    this.getWaitCoupon();
                };
            }
        });
    },
})