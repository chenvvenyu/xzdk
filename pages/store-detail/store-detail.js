// pages/store-detail/store-detail.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        storeTab: 1,
        pageData: "", //店铺信息
        add: [], //广告列表
        list: [], //店铺产品列表
        listIndex: 0, //产品列表tab
        totalNum: 0, //店铺购物车总量
        totalPrice: 0, //店铺购物车总价
        shopCartList: [], //购物车产品列表
        options: "", //页面参数
        commentList: [],
        wdata: "",
        getUrl: `${app.public.server_product}api/v1/comment/query`,
        canScroll: false,
        backTopShow: false,
        height: 0,
        rightScrollLoaction: "right0",
        id: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        this.setData({
            options: options,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {
        // this.getStorePorduct(this.data.options.id);
        let wdata = {
            businessId: this.options.id
        };
        this.setData({
            wdata: wdata,
        });
        this.getStoreDetail(this.options.id);
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
        if (this.data.storeTab == 1) {
            this.setData({
                canScroll: true,
            });
        };
        if (this.data.storeTab == 2) {
            this.selectComponent("#bottomLoad").getList();
        };
    },
    onPageScroll(e) {
        //页面滚动函数
        let x = e.scrollTop;
        if (x > 50 && !this.data.backTopShow) {
            this.setData({
                backTopShow: true,
            });
        };
        if (x <= 50 && this.data.backTopShow) {
            this.setData({
                backTopShow: false,
            });
            if (this.data.canScroll) {
                this.setData({
                    canScroll: false,
                });
            }
        };
    },
    backTop() {
        //返回顶部
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
        });
        this.setData({
            canScroll: false,
        });
    },
    listTab(e) {
        let y = e.currentTarget.dataset.y;
        this.setData({
            rightScrollLoaction: `right${y}`
        })
    },
    rightScroll(e) {
        //scroll-view滚动
        let top = e.detail.scrollTop;
        let index = this.data.listIndex;
        let list = this.data.list;
        let flag = top - this.data.height > 0;
        this.data.height = top;
        if (flag && top >= list[index + 1 == list.length ? index : index + 1].top) {
            if (index + 1 == list.length) return true;
            // console.log("x:", list[index + 1 == list.length ? index : index + 1].top);
            // console.log("y:", top)
            //向下滑动
            this.setData({
                listIndex: list[index + 1 == list.length ? index : index + 1].index,
            });
        } else if (!flag && top < list[index].top) {
            //向上滑动
            this.setData({
                listIndex: list[index - 1 <= 0 ? 0 : index - 1].index,
            });
        }
    },
    storeTabFn(e) {
        let x = e.currentTarget.dataset.index;
        this.setData({
            storeTab: x,
            commentList: []
        })
    },
    call(e) {
        let x = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: x
        })
    },
    getStoreComment(res) {
        let list = this.data.commentList;
        res.detail.list.map(e => {
            let a = e.createTime.substring(0, 10);
            let b = e.createTime.substring(11, 19);
            e.time = `${a} ${b}`;
            e.imgs = e.imgs ? e.imgs.split(",") : []
        });
        list.push(...res.detail.list);
        this.setData({
            commentList: list,
        });
    },
    preview(e) {
        //图片预览
        let list = this.data.commentList;
        let y = e.currentTarget.dataset.y;
        let j = e.currentTarget.dataset.j;
        wx.previewImage({
            current: list[y].imgs[j], // 当前显示图片的http链接
            urls: list[y].imgs // 需要预览的图片http链接列表
        });
    },
    previewStore(e) {
        //图片预览
        let list = e.currentTarget.dataset.img;
        let y = e.currentTarget.dataset.y;
        wx.previewImage({
            current: list[y], // 当前显示图片的http链接
            urls: list // 需要预览的图片http链接列表
        });
    },
    getStoreDetail(id) {
        //获取店铺详情
        app.ajaxWx({
            type: "get",
            url: `/api/v1/shop/business/get`,
            data: {
                id: id,
            },
            name: "shop",
            success: res => {
                if (res.code == "000000") {
                    // res.data.addImg = res.data.promotedProduct.split(",")[0];
                    // res.data.addId = res.data.promotedProduct.split(",")[1];
                    res.data.categoryDTOList.map((e, y, arr) => {
                        if (e.productDTOList) {
                            e.productDTOList.map(x => {
                                x.num = 0;
                            });
                        };
                        e.index = y;
                    });
                    this.setData({
                        list: res.data.categoryDTOList,
                        pageData: res.data,
                    }, obj => {
                        let list = this.data.list;
                        let query = wx.createSelectorQuery();
                        let titleHeight = "";
                        let itemHeight = "";
                        query.select('.sd-fr-title').boundingClientRect(res => {
                            titleHeight = res.height;
                        });
                        query.select('.sd-fr-item').boundingClientRect(res => {
                            console.log(res);
                            itemHeight = res.height;
                        }).exec(res => {
                            list.map((x, y, a) => {
                                if (y == 0) {
                                    x.top = 0;
                                    x.height = x.productDTOList.length * itemHeight;
                                } else {
                                    x.top = a[y - 1].top + a[y - 1].height;
                                    x.height = 50 + (x.productDTOList ? x.productDTOList.length : 0) * itemHeight
                                };
                            });
                            this.setData({
                                list: list,
                            });
                        });
                    });
                    this.getCarTotalNum(id);
                };
            },
        });
    },
    getCarTotalNum(id) {
        let that = this;
        let list = this.data.list;
        console.log(list);
        //获取购物车数量
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/cart/findListBusinessId`,
            data: {
                businessId: this.data.options.id,
            },
            name: "user",
            success: res => {
                if (res.code == "000000" && res.data && res.data.length > 0) {
                    list.map(x => {
                        if (x.productDTOList) {
                            x.productDTOList.map(y => {
                                res.data.map(i => {
                                    if (y.productId == i.productId) {
                                        y.num = i.num;
                                    };
                                });
                            });
                        };
                    });
                    that.setData({
                        shopCartList: res.data,
                        list: list,
                    });
                    that.calculateTotal();
                };
            },
        });
    },
    calculateTotal() {
        //计算总商品数量
        let list = this.data.shopCartList;
        let totalNum = 0;
        let totalPrice = 0;
        list.map(e => {
            if (e.productDTO && e.num) {
                totalNum = totalNum * 1 + e.num * 1;
                totalPrice = (totalPrice * 1 + e.num * e.productDTO.price).toFixed(2);
            };
        });
        this.setData({
            totalNum: totalNum,
            totalPrice: totalPrice
        });
    },
    addLinkTo(e) {
        //类型:1,普通商品;2,拼团商品;3,商户;4,外链;5,普通文章
        let y = e.currentTarget.dataset.y;
        let data = this.data.add;
        let type = data[y].type;
        if (type == 1) {
            wx.navigateTo({
                url: `/pages/product-detail/product-detail?id=${data[y].content}`,
            });
        } else if (type == 2) {
            //暂无
        } else if (type == 3) {
            wx.navigateTo({
                url: `/pages/store-detail/store-detail?id=${data[y].content}`,
            });
        } else if (type == 4) {
            let link = encodeURIComponent(data[y].content);
            wx.navigateTo({
                url: `/pages/web-view/web-view?link=${link}`,
            });
        } else if (type == 5) {
            wx.navigateTo({
                url: `/pages/news/news?id=${data[y].id}`,
            });
        } else if (type == 6) {
            //充值
            wx.navigateTo({
                url: `/pages/recharge/recharge`,
            });
        } else {
            console.log("没有类型")
        }
    },
    getNum(res) {
        console.log(res);
        let y = res.detail.b;
        let listIndex = res.detail.a;
        let num = res.detail.num;
        let list = this.data.list;
        let shoppingCartDTO = {
            businessId: this.data.options.id,
            productId: list[listIndex].productDTOList[y].productId,
            num: num,
        };
        if (res.detail.operation == "plus") {
            //数量加
            app.ajaxWx({
                type: "post",
                url: `/api/v1/user/cart/save`,
                data: shoppingCartDTO,
                contentType: "json",
                name: "user",
                tip: "请稍等...",
                success: res => {
                    if (res.code == "000000") {
                        list[listIndex].productDTOList[y].num = num;
                        this.setData({
                            list: list,
                        });
                        this.getCarTotalNum();
                    } else {
                        this.selectComponent(`#quantity${listIndex}${y}`).originalNum();
                    };
                },
            });
        } else {
            let carId = "";
            let car = this.data.shopCartList;
            car.map(m=>{
                if(m.productId == list[listIndex].productDTOList[y].productId){
                    carId = m.userCartId;
                }
            });
            //数量减
            app.ajaxWx({
                type: "post",
                url: `/api/v1/user/cart/update`,
                data: {
                    userCartId: carId,
                    // productId: list[listIndex].productDTOList[y].id,
                    num: num,
                },
                contentType: "json",
                name: "user",
                tip: "请稍等...",
                success: res => {
                    if (res.code == "000000") {
                        list[listIndex].productDTOList[y].num = num;
                        this.setData({
                            list: list,
                        });
                        this.getCarTotalNum();
                    } else {
                        this.selectComponent(`#quantity${listIndex}${y}`).originalNum();
                    };
                },
            });
        };
    },
    sub() {
        let list = this.data.shopCartList;
        let proSub = [];
        list.map(e => {
            proSub.push({  
                purchaseQuantity: e.num,
                userCartId: e.userCartId,
            });
        });
        proSub = JSON.stringify(proSub);
        wx.navigateTo({
            url: `/pages/order-sub/order-sub?pro=${proSub}`,
        });
    },
    buy() {
        let store = this.data.pageData
        let proSub = {
            businessId: store.id,
            entityList: []
        };
        let subList = [];
        app.ajaxWx({
            type: "get",
            url: `${app.public.server_product}api/v1/user/shopping/cart/query`,
            data: {
                businessId: store.id
            },
            success: res => {
                if (res.code == "000000" && res.data.list && res.data.list.length > 0) {
                    subList = res.data.list[0].cartDTOS;
                    subList.map(e => {
                        proSub.entityList.push({
                            id: e.id,
                            productId: e.productId,
                            quantity: e.num
                        });
                    });
                    proSub = JSON.stringify(proSub);
                    wx.navigateTo({
                        url: `/pages/order-sub/order-sub?pro=${proSub}`,
                    });
                };
            },
        });
    }
})