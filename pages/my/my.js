// pages/my/my.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bindFlag: false,
        userInfo: "",
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
         //检测用户是否绑定
         if (app.public.bindFlag) {
            this.setData({
                bindFlag: true,
            });
            if (app.public.userInfo) {
                this.setData({
                    userInfo: app.public.userInfo,
                })
            }else{
                this.getUserInfo();
            };
        };
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
    scanCode() {
        let that = this;
        wx.scanCode({
            onlyFromCamera: true,
            success(res) {
                let result = JSON.parse(res.result);
                app.ajaxWx({
                    type: "post",
                    url: `/api/v1/user/exclusive/user/save`,
                    data: {
                        courierId: result.body.courierId,
                    },
                    name: "order",
                    contentType: "json",
                    success: res => {
                        if (res.code == "000000") {
                            wx.showModal({
                                title: "提示",
                                content: `绑定成功`,
                                showCancel: false,
                                success(con) {

                                }
                            });
                        };
                    }
                });
            }
        })
    },
    getUserInfo() {
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/weixinuser/current/info`,
            data: {},
            name: "user",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        userInfo: res.data,
                    });
                    app.public.userInfo = res.data;
                };
            }
        });
    }
})