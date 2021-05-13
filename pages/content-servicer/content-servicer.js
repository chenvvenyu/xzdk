// pages/content-servicer/content-servicer.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        subData: {
            expressOrderId: "",
            message: ""
        },
        list: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            "subData.expressOrderId": options.id
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
        this.getList();
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
    sub(){
        if(!this.data.subData.message){
            return;
        };
        let subData = this.data.subData;
        app.ajaxWx({
            type: "post",
            url: `/api/v1/order/message/board/save`,
            data: subData,
            contentType: "json",
            name: "order",
            tip: "稍等...",
            success: res => {
                if (res.code == "000000") {
                    wx.showToast({
                        title: '留言成功',
                        icon: 'success',
                        mask: true,
                        duration: 1500
                    });
                    this.setData({
                        "subData.message": "",
                    });
                    this.getList();
                };
            }
        });
    },
    getList(){
        app.ajaxWx({
            type: "get",
            url: `/api/v1/order/message/board/list`,
            data: {
                expressOrderId: this.data.subData.expressOrderId,
                page: 1,
                pageSize: 100,
            },
            name: "order",
            tip: "稍等...",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        list: res.data.list,
                    })
                };
            }
        });
    }
})