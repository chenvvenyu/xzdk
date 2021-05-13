// pages/cash-log-detail/cash-log-detail.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: "",
        pageData: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id,
        });
        this.getDetail();
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
    getDetail(){
        let id = this.data.id;
        app.ajaxWx({
            type: "get",
            url: `${app.public.server_user}/api/v1/user/cash/out/details`,
            data: {
                id: id,
            },
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        pageData: res.data,
                        parameter: res.data.parameter,
                    });
                };
            }
        });
    }
})