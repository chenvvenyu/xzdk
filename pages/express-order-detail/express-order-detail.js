// pages/order-detail/order-detail.js
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
        this.data.type = options.type;
        
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
        this.getDetail();
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
    getDetail(){
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/order/get`,
            data: {
                orderId: this.data.id,
            },
            name: "order",
            tip: "加载中...",
            success: res => {
                if (res.code == "000000") {
                    let inc = [
                        {
                            latitude: res.data.expressAddressDTO.mailLat,
                            longitude: res.data.expressAddressDTO.mailLng
                        },
                        {
                            latitude: res.data.expressAddressDTO.toLat,
                            longitude: res.data.expressAddressDTO.toLng
                        }
                    ];
                    let mar = [
                        {
                            id: 1,
                            latitude: res.data.expressAddressDTO.mailLat,
                            longitude: res.data.expressAddressDTO.mailLng,
                        },
                        {
                            id: 2,
                            latitude: res.data.expressAddressDTO.toLat,
                            longitude: res.data.expressAddressDTO.toLng,
                        },
                    ];
                    this.setData({
                        pageData: res.data,
                        markers: mar,
                        includePoints: inc,
                    });
                    if(res.data.expressType == 1){
                        this.getLog(res.data.expressId);
                    };
                    let map = wx.createMapContext('map');
                    //缩放视野展示所有坐标点
                    map.includePoints({
                        points: this.data.includePoints,
                        padding: ["250","30","50","30"]
                    })
                };
            }
        });
    },
    choiceReward(e){
        let y = e.currentTarget.dataset.y;
        let list = this.data.rewardList;
        let name = `rewardList[${y}].selectStatus`;
        let st = !list[y].selectStatus;
        console.log(y)
        this.setData({
            [name]: st,
        });
    },
    orderDel(){
        app.ajaxWx({
            type: "post",
            url: `/api/v1/user/order/cancel`,
            data: {
                orderId: this.data.id,
            },
            name: "order",
            tip: "稍等...",
            success: res => {
                if (res.code == "000000") {
                    
                };
            }
        });
    }
})