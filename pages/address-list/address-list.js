// pages/address-list/address-list.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        choice: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.choice){
            //order为订单地址，send为寄快递寄件人地址，collect为寄快递收件人地址
            this.setData({
                choice: options.choice,
            });
        };
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
        this.getList();
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
    getList(){
        //获取地址列表
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/address/list`,
            data: {
                page: 1,
                pageSize: 100,
            },
            name: "user",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        list: res.data.list,
                    });
                };
            }
        });
    },
    choiceAddress(e){
        let x = e.currentTarget.dataset.x;
        let choice = this.data.choice;
        wx.setStorage({
            key: `address-${choice}`,
            data: x,
        });
        wx.navigateBack({
            delta: 1
        });
    },
    del(e){
        let y = e.currentTarget.dataset.y;
        let a = e.currentTarget.dataset.a;
        let that = this;
        if (a.defaultStatus == 1) {
            wx.showToast({
                title: '默认地址无法删除',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        wx.showModal({
            title: '提示',
            content: '是否确定删除该地址',
            success(obj) {
                if (obj.confirm) {
                    app.ajaxWx({
                        type: "delete",
                        url: `/api/v1/user/address/remove`,
                        data: {
                            id: a.addressId,
                        },
                        name: "user",
                        tip: "稍等...",
                        success: res => {
                            if (res.code == "000000") {
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 1500,
                                    mask: true,
                                });
                                let list = that.data.list;
                                list.splice(y, 1);
                                that.setData({
                                    list: list,
                                });
                            }
                        }
                    });
                } else if (obj.cancel) {
                    console.log('用户点击取消')
                }
            },
        });
    },
    setDefault(e){
        let y = e.currentTarget.dataset.y;
        let id = e.currentTarget.dataset.id;
        app.ajaxWx({
            type: "post",
            url: `/api/v1/user/address/update/default/status`,
            data: {
                id: id,
                defaultStatus: 1
            },
            name: "user",
            tip: "稍等...",
            success: res => {
                if (res.code == "000000") {
                    let list = this.data.list
                    list.map( (e)=>{
                        e.defaultStatus = 2;
                        return e;
                    });
                    list[y].defaultStatus = 1;
                    this.setData({
                        list: list
                    });
                };
            }
        });
    }
})