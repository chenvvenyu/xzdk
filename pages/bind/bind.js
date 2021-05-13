// pages/bind/bind.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        getCodeFont: "获取验证码",
        subData: {
            userNo : "",
            verify: "",
            inviteCode: "",
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            "subData.inviteCode": app.public.otherInfo.inviteCode
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

    },
    twobind(e) {
        app.twowayObj(e, this);
    },
    getCode() {
        //获取验证码
        let mobile = this.data.subData.userNo;
        if (!app.judgeMobile(mobile)) {
            return false;
        };
        if (this.data.getCodeFont == "获取验证码"){
            app.ajaxWx({
                type: "get",
                url: "api/v1/user/verify/getVerifyCode",
                data: {
                    mobile: mobile,
                    type: 0, //0注册，1修改密码，2登录
                },
                success: res => {
                    if (res.status == "0") {
                        this.codeCountdown(60)
                    };
                }
            });
        };
    },
    codeCountdown(time) {
        let that = this;
        if (time == 0) {
            this.setData({
                getCodeFont: "获取验证码",
            });
            return false;
        };
        this.setData({
            getCodeFont: time - 1,
        });
        setTimeout(() => {
            this.codeCountdown(time - 1);
        }, 1000)
    },
    sub(){
        let subData = this.data.subData;
        if(!subData.userNo){
            wx.showToast({
                title: '请输入正确的手机号码',
                mask: true,
                duration: 2000
            });
            return false;
        };
        if (!subData.verify) {
            wx.showToast({
                title: '请输入验证码',
                mask: true,
                duration: 2000
            });
            return false;
        };
        app.ajaxWx({
            type: "post",
            url: "api/v1/user/verify/bindMobile",
            data: this.data.subData,
            success: res => {
                if (res.status == "0") {
                    app.public.userInfo = res.data.userBase;
                    app.public.token = res.data.tokenId;
                    app.public.bindFlag = true;
                    wx.showToast({
                        title: '绑定成功',
                        icon: "success",
                        mask: true,
                        duration: 2000,
                    });
                    setTimeout(() => {
                        // wx.reLaunch({
                        //     url: '/pages/index/index'
                        // });
                        app.naviBack();
                    }, 2000);
                }
            }
        });
    }
})