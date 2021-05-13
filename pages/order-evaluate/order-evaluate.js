// pages/order-evaluate/order-evaluate.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: "",
        content: "",
        anonymous: false,
        score: 5,
        scoreStr: ["不会再来","非常不满意","不满意","一般","满意","非常满意"],
        imgList: [],
        subData: {
            "courierId": "", 
            "expressId": "", 
            "images": "", 
            "message": "",
            "scout": "",
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id,
            "subData.id": options.id,
        });
        this.getOrderDetail();
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
    bindValue(e) {
        app.bindValue(e, this);
    },
    getOrderDetail() {
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
                    this.setData({
                        content: res.data,
                    });
                };
            }
        });
    },
    anonymousSub(){
        this.setData({
            anonymous: !this.data.anonymous
        });
    },
    getScore(res){
        this.setData({
            score: res.detail.score
        });
    },
    delImg(e) {
        //删除图片
        let y = e.currentTarget.dataset.y;
        let list = this.data.imgList;
        list.splice(y, 1);
        this.setData({
            imgList: list,
        })
    },
    choiceImg(e) {
        let that = this;
        let count = this.data.imgList.legnth;
        let imgList = this.data.imgList;
        wx.chooseImage({
            count: 9 - count,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                imgList.push(...res.tempFilePaths)
                that.setData({
                    imgList: imgList
                });
            }
        })
    },
    uploadImg(y) {
        if (y == this.data.imgList.length) {
            this.sub();
            return false;
        };
        let that = this;
        let url = app.public.server;
        let file = this.data.imgList[y];
        let name = `imgList[${y}]`;
        wx.uploadFile({
            url: `${url}appliance/api/v1/cloud/oos/upload`,
            filePath: file,
            formData: {
                prefix: "upimg"
            },
            name: 'file',
            success: (val) => {
                let upSuccAll = JSON.parse(val.data);
                if (upSuccAll.code == "000000") {
                    this.setData({
                        [name]: upSuccAll.data,
                    });
                    this.uploadImg(y + 1);
                } else {
                    wx.showModal({
                        title: '提示',
                        content: upSuccAll.error,
                        showCancel: false,
                        success(res1) {
                            that.uploadImg(y + 1);
                        }
                    });
                };
            }
        });
    },
    subImg() {
        let imgList = this.data.imgList;
        if (imgList.length > 0) {
            wx.showLoading({
                title: '上传图片',
                mask: true,
            });
            this.uploadImg(0);
        } else {
            this.sub();
        };
    },
    sub() {
        let content = this.data.content;
        let subData = {
            courierId: content.courierId,
            expressId: content.expressOrderId,
            images: "",
            message: this.data.subData.message,
            score: this.data.score,
        };
        subData.images = this.data.imgList.join(",");
        if(!subData.message){
            subData.message = "速度快、服务好，推荐给大家";
        };
        app.ajaxWx({
            type: "post",
            url: `/api/v1/express/expresscomment/save`,
            data: subData,
            contentType: "json",
            name: "order",
            success: res => {
                if (res.code == "000000") {
                    wx.showToast({
                        title: '感谢您的评价。',
                        icon: 'success',
                        duration: 2000,
                        mask: true,
                    });
                    setTimeout(res => {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 2000);
                };
            }
        });
    }
})