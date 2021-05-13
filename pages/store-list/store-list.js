// pages/store-list/store-list.js
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tabList: [
            //order: true-从大到小,下箭头.false-从小到大,上箭头.
            {
                type: "distance",
                order: true,
                title: "距离",
            },
            {
                type: "total_sale",
                order: true,
                title: "销量"
            },
            {
                type: "score",
                order: true,
                title: "评价"
            },
        ],
        tab: "distance",
        pageData: "",
        wdata: "",
        list: [],
        getUrl: `${app.public.server_product}api/v1/business/query`,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let wdata = {
            userLat: app.public.userLocation.common.lat,
            userLng: app.public.userLocation.common.lng,
            indexCategoryId: options.id,
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
    setKeyword(e) {
        let keyword = e.detail.value;
        let wdata = this.data.wdata;
        wdata.businessName = keyword;
        this.setData({
            wdata: wdata,
            list: [],
        });
    },
    getList(res) {
        let list = this.data.list;
        list.push(...res.detail.list);
        list.map(e=>{
            e.apartDistance = parseInt(e.apartDistance/1000);
        });
        this.setData({
            list: list,
        });
    },
})