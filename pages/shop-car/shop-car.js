// pages/shop-car/shop-car.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        this.getShopCarProducts();
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
    getShopCarProducts() {
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/cart/list`,
            name: "user",
            success: res => {
                if (res.code == "000000" && res.data) {
                    this.setData({
                        list: res.data,
                    });
                    this.totalPrice();
                };
            },
        });
    },
    totalPrice(y) {
        //总价计算
        let list = this.data.list;
        list.map(e => {
            e.totalPrice = 0;
            e.proAmount = 0;
            e.userCartDTOList.map(x => {
                e.proAmount = (e.proAmount + x.productDTO.price * x.num).toFixed(2) * 1;
            });
            e.totalPrice = (e.totalPrice + e.proAmount).toFixed(2) * 1;
        });
        this.setData({
            list: list,
        })
    },
    getNum(res) {
        let list = this.data.list;
        let y = res.detail.a;
        let j = res.detail.b;
        let num = res.detail.num;
        //购物车数量修改
        app.ajaxWx({
            type: "post",
            url: `/api/v1/user/cart/update`,
            data: {
                userCartId: list[y].userCartDTOList[j].userCartId,
                num: num,
            },
            contentType: "json",
            name: "user",
            tip: "请稍等...",
            success: res => {
                if (res.code == "000000") {
                    list[y].userCartDTOList[j].num = num;
                    this.setData({
                        list: list,
                    });
                    this.totalPrice();
                } else {
                    this.selectComponent("#quantity" + list[y].userCartDTOList[j].userCartId).originalNum();
                };
            }
        });
    },
    delPro(res) {
        let y = res.detail.indexA;
        let j = res.detail.indexB;
        let list = this.data.list;
        //删除商品
        app.ajaxWx({
            type: "post",
            url: `/api/v1/user/cart/update`,
            data: {
                userCartId: list[y].userCartDTOList[j].userCartId,
                num: 0,
            },
            contentType: "json",
            name: "user",
            tip: "请稍等...",
            success: res => {
                if (res.code == "000000") {
                    if (list[y].userCartDTOList.length == 1) {
                        list.splice(y, 1);
                    } else {
                        list[y].userCartDTOList.splice(j, 1);
                    }
                    this.setData({
                        list: list,
                    });
                };
            }
        });
    },
    delStore(e) {
        let y = e.currentTarget.dataset.y;
        //删除对应购物车
        let list = this.data.list;
        app.ajaxWx({
            type: "post",
            url: `${app.public.server_product}api/v1/user/shopping/cart/del`,
            data: {
                businessId: list[y].businessId,
            },
            success: res => {
                if (res.code == "000000") {
                    list.splice(y, 1);
                    this.setData({
                        list: list,
                    });
                };
            }
        });
    },
    sub(e) {
        let y = e.currentTarget.dataset.y;
        let list = this.data.list;
        let proSub = [];
        list[y].userCartDTOList.map(e => {
            proSub.push({  
                purchaseQuantity: e.num,
                userCartId: e.userCartId,
            });
        });
        proSub = JSON.stringify(proSub);
        wx.navigateTo({
            url: `/pages/order-sub/order-sub?pro=${proSub}`,
        });
    }
})