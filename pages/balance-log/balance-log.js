// pages/balance-log/balance-log.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        wdata: "",
        getUrl: `${app.public.server_user}/api/v1/user/wallet/log/query`,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let wdata = {};
        this.setData({
            wdata: wdata,
        });
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
        this.selectComponent("#bottomLoad").getList();
    },
    getList(res) {
        let list = this.data.list;
        list.push(...res.detail.list);
        this.setData({
            list: list,
        });
    },
})