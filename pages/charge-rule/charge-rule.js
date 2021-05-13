// pages/charge-rule/charge-rule.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: "",
        wList: [],
        dList: [],
        bList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id
        });
        if(options.type){
            this.getTypeWlist();
        }else{
            this.getDlist();
            this.getWlist();
        }    
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
    getTypeWlist(){
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/address/express/rule`,
            data: {
                addressId: this.data.id,
            },
            name: "user",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        wList: res.data.mathFucResultBeansWeight,
                        bList: res.data.expressDistrictBeans,
                    })
                };
            }
        });
    },
    getWlist(){
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/address/delivery/weight/rule`,
            data: {
                addressId: this.data.id,
            },
            name: "user",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        wList: res.data.mathFucResultBeansWeight
                    })
                };
            }
        });
    },
    getDlist(){
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/address/delivery/district/rule`,
            data: {
                addressId: this.data.id,
            },
            name: "user",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        dList: res.data.mathFucResultBeansDistrict
                    })
                };
            }
        });
    },
})