// pages/coupon/coupon.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: 1,
        wdata: "",
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
        this.getCoupon();
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
    tabFn(e) {
        let x = e.currentTarget.dataset.x;
        // wdata.status = x;
        this.setData({
            tab: x,
        });
        this.getCoupon();
    },
    getCoupon(){
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/coupon/list`,
            data: {
                couponState: this.data.tab,
            },
            name: "user",
            tip: "正在加载",
            success: res => {
                if (res.code == "000000") {
                    res.data.map(x => {
                        x.date = x.couponDTO.endTime.substring(0, 10)
                    });
                    this.setData({
                        list: res.data,
                    });
                };
            }
        });
    }
})