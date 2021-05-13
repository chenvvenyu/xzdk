// pages/help-order-detail/help-order-detail.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        includePoints: [],
        markers: [],
        id: "",
        type: "",
        pageData: "",
        coupon: [],
        couponsId: "",
        qrCode: "",
        cancelList: [
            "临时有事，需要取消订单。",
            "不想下单了。",
            "没人接单。",
            "其他原因。",
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.id = options.id;
        this.data.type = options.type;
        this.getDetail();
        this.getCoupon()
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
    getQRcode(){
        let qrCode = `${app.public.server}order/api/v1/user/order/qr/pay?expressOrderId=${this.data.id}&payType=WXSCAN`;
        this.setData({
            qrCode: qrCode,
        })
    },
    prevCode(){
        let url = this.data.qrCode;
        wx.previewImage({
            current: url,
            urls: [url]
        })
    },
    saveImgSetting() {
        //用户授权
        let that = this;
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success: () => {
                            // 同意授权
                            that.saveImage();
                        },
                        fail: (res) => {
                            console.log(res);
                        }
                    })
                } else {
                    // 已经授权了
                    that.saveImage();
                }
            },
            fail: (res) => {
                console.log(res);
            }
        })
    },
    saveImage() {
        let url = this.data.qrCode;
        wx.getImageInfo({
            src: url,
            success: (res) => {
                let path = res.path;
                wx.saveImageToPhotosAlbum({
                    filePath: path,
                    success(res) {
                        console.log(res);
                    },
                    fail: (res) => {
                        console.log(res);
                    }
                })
            },
            fail: (res) => {
                console.log(res);
            }
        })
    },
    getDetail() {
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
                    let inc = [{
                            latitude: res.data.expressAddressDTO.mailLat,
                            longitude: res.data.expressAddressDTO.mailLng
                        },
                        {
                            latitude: res.data.expressAddressDTO.toLat,
                            longitude: res.data.expressAddressDTO.toLng
                        }
                    ];
                    let mar = [{
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
                    let map = wx.createMapContext('map');
                    //缩放视野展示所有坐标点
                    map.includePoints({
                        points: this.data.includePoints,
                        padding: ["50", "50", "50", "50"]
                    });
                };
            }
        });
    },
    orderDel(e) {
        let that = this;
        let cancelList = this.data.cancelList;
        let index = e.detail.value;
        app.ajaxWx({
            type: "post",
            url: `/api/v1/user/order/cancel`,
            data: {
                orderId: this.data.id,
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
                    setTimeout(function(){
                        app.naviBack();
                    },1500)
                    
                };
            }
        });
    },
    getCoupon() {
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/coupon/current/express/list`,
            data: {
                expressOrderId: this.data.id,
            },
            name: "user",
            success: res => {
                if (res.code == "000000") {
                    let data = res.data;
                    data.map(e => {
                        if (e.couponDTO.calculationType == 1) {
                            //1:折扣 2:满减
                            e.name = `${e.couponDTO.discount*10}折券`;
                        } else if (e.couponDTO.calculationType == 2) {
                            if (e.couponDTO.taskAmount > 0) {
                                e.name = `满${e.couponDTO.taskAmount}元，减${e.couponDTO.couponAmount}元`
                            } else {
                                e.name = `通用券，减${e.couponDTO.couponAmount}元`
                            }

                        };
                    });
                    this.setData({
                        coupon: data,
                    })
                };
            }
        });
    },
    pickerCoupon(e) {
        //优惠券选择
        let val = e.detail.value;
        this.setData({
            couponsId: val + "",
        });
    },
    pay() {
        // if(this.data.coupon.length >0 && !this.data.couponsId){

        // }
        if (this.data.couponsId) {
            app.ajaxWx({
                type: "post",
                url: `/api/v1/user/order/choose/coupon`,
                data: {
                    expressOrderId: this.data.id,
                    userCouponId: this.data.coupon[this.data.couponsId].userCouponId
                },
                name: "order",
                success: res => {
                    if (res.code == "000000") {
                        wx.navigateTo({
                            url: `/pages/order-pay/order-pay?id=${this.data.id}`,
                        })
                    };
                }
            });
        } else {
            wx.navigateTo({
                url: `/pages/order-pay/order-pay?id=${this.data.id}`,
            })
        };
    }
})