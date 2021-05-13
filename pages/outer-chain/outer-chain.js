// pages/outher-chain/outer-chain.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        options: "",
        link: "",
        show: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //console.log(decodeURIComponent(options.link));
        this.setData({
            options: options,
            link: decodeURIComponent(`https://xztc.zjxiangzhi.com/html/admin/xy/index.html?r=${Math.random()}`),
        });
        setTimeout(_=>{
            this.setData({
                show: true,
            });
        },500)
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
    webSuccess(){
        console.log(1)
    }
})