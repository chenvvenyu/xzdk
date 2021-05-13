// pages/my-balance/my-balance.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: "",
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
        this.getBlance();
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
                        pageData: res.data,
                    });
                };
            }
        });
    }
})