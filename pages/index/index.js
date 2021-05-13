// pages/index/index.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        menuList: [{
                title: "同城当日达",
                describe: "1小时内取件",
                describe2: "平均4小时达",
                url: "/pages/send-express/send-express",
                src: "/static/img/index-1.png",
                open: true,
            },
            // {
            //     title: "批量寄",
            //     describe: "便捷寄多个快递",
            //     url: "/pages/send-express/send-express",
            //     src: "/static/img/index-2.png",
            // },
            {

                title: "特快专送",
                describe: "文件/数码/鲜花",
                describe2: "平均1小时达",
                url: "/pages/sendForMe/sendForMe",
                src: "/static/img/index-3.png",
                open: false,
            },
            {
                title: "帮我买",
                describe: "美食/医药/饮品",
                describe2: "极速贴心服务",
                url: "/pages/buyForMe-sub/buyForMe-sub",
                src: "/static/img/index-4.png",
                open: false,
            },
            // {
            //     title: "帮我取",
            //     describe: "钥匙/发票/衣服"
            // },
            // {
            //     title: "商城",
            //     describe: "美食/商品/果蔬",
            //     url: "/pages/shop/shop",
            //     src: "/static/img/index-5.png",
            //     open: true,
            // },
        ],
        bannerListt: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getBannerList();
        
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
        if (app.public.bindFlag) {
            this.getWaitCoupon();
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
    noOpenFn() {
        wx.showToast({
            title: '功能暂未开放',
            icon: 'none',
            duration: 2000
        })
    },
    getBannerList() {
        //首页轮播图
        app.ajaxWx({
            type: "get",
            url: `/api/v1/appliance/ad/list`,
            data: {
                seat: 1, //1是首页2个人中心
            },
            name: "appliance",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        bannerListt: res.data.list
                    })
                };
            }
        });
    },
    getWaitCoupon() {
        //获取用户待领优惠券取列表
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/coupon/wait/receive/coupon/list`,
            name: "user",
            success: res => {
                if (res.code == "000000") {
                    if (res.data.length > 0) {
                        wx.showModal({
                            title: '提示',
                            content: '您有可领取的优惠券，是否领取！',
                            success(res) {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '/pages/wait-coupon/wait-coupon',
                                    });
                                } else if (res.cancel) {

                                };
                            }
                        });
                    }
                };
            }
        });
    },
})