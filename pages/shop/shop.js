// pages/shop/shop.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        test: [1,1,1,1,1,1,1,1,1],
        pageData: "",
        banner3: [],
        banner4: [],
        wdata: "",
        list: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getShop();
        this.getBannerList(3);
        this.getBannerList(4);
        let wdata = {
            userLat: app.public.userLocation.common.lat,
            userLng: app.public.userLocation.common.lng,
        };
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
        if(list.length > 0){
            list.map(e=>{
                e.apartDistance = parseInt(e.apartDistance/1000);
            });
            this.setData({
                list: list,
            });
        }
    },
    getShop(){
        app.ajaxWx({
            type: "get",
            url: `/api/v1/shop/index`,
            data: {
                userLat: app.public.userLocation.common.lat,
                userLng: app.public.userLocation.common.lng,
            },
            name: "shop",
            success: res => {
                if (res.code == "000000") {
                    if(res.data.businessDTO != null){
                        res.data.businessDTO.apartDistance = parseInt(res.data.businessDTO.apartDistance/1000);
                    };
                    this.setData({
                        pageData: res.data,
                    })
                };
            }
        });
    },
    getBannerList(type){
        let name = `banner${type}`;
        //首页轮播图
        app.ajaxWx({
            type: "get",
            url: `/api/v1/appliance/ad/list`,
            data: {
                seat: type,
            },
            name: "appliance",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        [name]: res.data.list,
                    });
                };
            }
        });
    }
})