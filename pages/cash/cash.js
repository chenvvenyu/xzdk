// pages/cash/cash.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: 1,
        bank: "",
        balance: 0,
        amount: "", //提现金额
        realName: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getBank();
        this.setData({
            balance: options.balance,
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let that = this;
        //获取缓存的用户地址
        wx.getStorage({
            key: 'bank',
            success(res) {
                console.log(res);
                that.setData({
                    bank: res.data,
                });
                wx.removeStorage({
                    key: 'bank',
                    success: function(res) {
                        console.log("银行卡缓存数据已移除");
                    },
                });
            }
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    amountCheck(e) {
        let amount = e.detail.value * 1;
        let b = this.data.balance * 1;
        if (amount > b) {
            amount = b;
        };
        if (amount == 0) {
            amount = "";
        };
        this.setData({
            amount: amount + "",
        });
    },
    nameInput(e){
        let realName = e.detail.value;
        this.setData({
            realName: realName
        });
    },
    tab(e) {
        let tab = e.currentTarget.dataset.tab;
        this.setData({
            tab: tab,
        })
    },
    getBank() {
        app.ajaxWx({
            type: "get",
            url: `${app.public.server_user}api/v1/user/bank/query`,
            data: {
                page: 1,
                pageSize: 1
            },
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        bank: res.data.list[0],
                    });
                };
            }
        });
    },
    cashAll() {
        let b = this.data.balance;
        this.setData({
            amount: b + "",
        });
    },
    sub() {
        let type = this.data.tab;
        let that = this;
        if (!this.data.amount) {
            wx.showToast({
                title: '请输入提现金额',
                icon: 'none',
                mask: true,
                duration: 2000
            });
            return false;
        };
        app.ajaxWx({
            type: "post",
            url: `${app.public.server_user}/api/v1/user/cash/out/apply`,
            data: {
                type: type,
                amount: this.data.amount,
                bankId: type == 1 ? this.data.bank.id : "",
                realName: type == 2 ? this.data.realName : "",
            },
            success: res => {
                if (res.code == "000000") {
                    wx.showModal({
                        title: '申请成功',
                        content: `您已经申请提现${that.data.amount}元，请等待通过！通过后金额将直接汇入您的账户！`,
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {
                                wx.navigateBack({
                                    delta: 1
                                });
                            }
                        }
                    }); 
                };
            }
        });
    }
})