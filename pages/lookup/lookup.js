// pages/lookup/lookup.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: 1,
        wdata: "",
        list: [],
        popShow: false,
        testL: [1,2,3,4],
        cancelList: [
            "临时有事，需要取消订单。",
            "不想下单了。",
            "没人接单。",
            "其他原因。",
        ],
        searchKey: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //订单状态 0：待接单 1：待上门（取件） 3：运输中（已揽件） 4：运输中（到站点） 5：派件（从站点出发）（分配快递员） 6：派件中 7：完成 
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
        if(this.data.wdata.orderType){
            this.setData({
                wdata: this.data.wdata,
                list: [],
            });
        }else{
            this.setData({
                wdata: {
                    orderType: 1
                },
                list: [],
            });
        }
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
    searchFn(e){
        let value = e.detail.value;
        let wdata = this.data.wdata;
        wdata.waybillNumber = value;
        this.setData({
            wdata: wdata,
            list: [],
            searchKey: "",
        });
    },
    tabFn(e) {
        let x = e.currentTarget.dataset.x;
        let wdata = this.data.wdata;
        wdata.orderType = x;
        this.setData({
            tab: x,
            wdata: wdata,
            list: [],
        });
    },
    getList(res) {
        let list = this.data.list;
        list.push(...res.detail.list);
        this.setData({
            list: list,
        });
    },
    toDetail(e){
        let id = e.currentTarget.dataset.id;
        let type = e.currentTarget.dataset.type;
        if(type == "1"){
            //快递
            wx.navigateTo({
              url: `/pages/express-order-detail/express-order-detail?id=${id}&type=${type}`,
            })
        };
        if(type == "2"){
            //跑腿
            wx.navigateTo({
                url: `/pages/express-order-detail/express-order-detail?id=${id}&type=${type}`,
            })
        }
    },
    orderDel(e){
        let id = e.currentTarget.dataset.id;
        let y = e.currentTarget.dataset.y;
        let that = this;
        let cancelList = this.data.cancelList;
        let index = e.detail.value;
        app.ajaxWx({
            type: "post",
            url: `/api/v1/user/order/cancel`,
            data: {
                orderId: id,
                reason: cancelList[index],
            },
            name: "order",
            tip: "稍等...",
            success: res => {
                if (res.code == "000000") {
                    wx.showToast({
                        title: '取消成功',
                        icon: 'success',
                        duration: 1500,
                        mask: true,
                    });
                    let list = that.data.list;
                    list[y].expressDTO.transportStatus = 13;
                    list[y].payStatus = "CANCEL";
                    list[y].payStatusStr = "CANCEL";
                    that.setData({
                        list: list,
                    });
                };
            }
        });
        // wx.showModal({
        //     title: '提示',
        //     content: '是否确定去掉订单',
        //     success(obj) {
        //         if (obj.confirm) {
                    
        //         } else if (obj.cancel) {
        //             console.log('用户点击取消')
        //         }
        //     },
        // });
        
    }
})