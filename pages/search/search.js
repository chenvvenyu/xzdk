// pages/search/search.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        includePoints: [],
        markers: [],
        map: "",
        rewardList:[
            {
                value: 5,
                selectStatus: false,
            },
            {
                value: 10,
                selectStatus: false,
            },
            {
                value: 20,
                selectStatus: false,
            }
        ],
        id: "",
        type: "",
        pageData: "",
        test: [1,1,1,1],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.id = options.id;
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
        //XZ8000130793
    },
    searchFn(e){
        let value = e.detail.value;
        this.setData({
            searchKey: value,
        });
        this.getD();
    },
    getLog(id){
        app.ajaxWx({
            type: "get",
            url: `/api/v1/order/logistics/log/express/allList`,
            data: {
                expressId: id,
            },
            name: "order",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        logList: res.data,
                    })
                };
            }
        });
    },
    getDetail(id){
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/order/get`,
            data: {
                orderId: id,
            },
            name: "order",
            tip: "加载中...",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        pageData: res.data,
                    });
                    if(res.data.expressType == 1){
                        this.getLog(res.data.expressId);
                    };
                };
            }
        });
    },
    getD(){
        app.ajaxWx({
            type: "get",
            url: `/api/v1/order/logistics/log/queryByWaybillNumber`,
            data: {
                waybillNumber: this.data.searchKey,
            },
            name: "order",
            tip: "加载中...",
            success: res => {
                if (res.code == "000000") {
                    this.getDetail(res.data.expressOrderId);
                };
            }
        });
    }
})