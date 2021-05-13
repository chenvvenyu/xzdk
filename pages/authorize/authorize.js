// pages/authorize/authorize.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isAuthorize: true,
        isBind: false,
        subData: {
            encryptedData: "",
            iv: "",
            jsCode: "",
            loginType: "miniapp",
        },
        newCode: "",
        codeTimes: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
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
        //登录第一步
        this.getCode(this.wxlogin);
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
    getCode(fn) {
        //获取code
        wx.login({
            success: res => {
                this.setData({
                    "subData.jsCode": res.code,
                    codeTimes: this.data.codeTimes + 1
                });
                console.log(`第${this.data.codeTimes}个code[${res.code}]`);
                if (fn) {
                    fn();
                };
            }
        });
    },
    wxlogin() {
        //服务器登录
        app.ajaxWx({
            type: "post",
            url: `/api/v1/user/weixinuser/wxlogin`,
            contentType: "json",
            data: this.data.subData,
            name: "user",
            tip: "正在登录",
            success: res => {
                if (res.code == "000000") {
                    if (res.data.code == "0000") {
                        app.public.bindFlag = true;
                        app.public.userInfo = JSON.parse(res.data.accessToken.userInfo);
                        app.public.token = res.data.accessToken.access_token;
                        app.naviBack();
                    } else if (res.data.code == "0001") {
                        app.public.bindFlag = false;
                        app.public.userInfo = "";
                        app.public.token = "";
                    };
                    if (this.data.codeTimes > 1) {
                        this.setData({
                            isAuthorize: false,
                            isBind: true,
                        })
                    }
                };
            },
            complete: res => {
                this.getCode();
            }
        });
    },
    getUserProfile() {
        // 获取用户信息的iv和encryptedData
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                this.setData({
                    "subData.encryptedData": res.encryptedData,
                    "subData.iv": res.iv
                });
                this.wxlogin();
            }
        });
    },
    getPhone(e) {
        //获取绑定的手机号码
        if (e.detail.errMsg == "getPhoneNumber:ok") {
            app.ajaxWx({
                type: "post",
                url: `/api/v1/user/weixinuser/wxbingding`,
                contentType: "json",
                tip: "绑定中...",
                data: {
                    "encryptedData": e.detail.encryptedData,
                    "iv": e.detail.iv,
                    "jsCode": this.data.subData.jsCode,
                    "loginType": "miniapp"
                },
                name: "user",
                success: obj => {
                    if (obj.code == "000000") {
                        console.log(obj.code)
                        if (obj.data.code == "0000") {
                            app.public.userInfo = JSON.parse(obj.data.accessToken.userInfo);
                            app.public.token = obj.data.accessToken.access_token;
                            app.public.bindFlag = true;
                            wx.showToast({
                                title: '绑定成功',
                                icon: 'success',
                                duration: 2000,
                            });
                            setTimeout(app.naviBack, 2000);
                        } else if (obj.data.code == "0001") {
                            app.public.userInfo = "";
                            app.public.token = "";
                            app.public.bindFlag = false;
                            wx.showModal({
                                title: `提示`,
                                content: `绑定失败，请重新授权并绑定`,
                                showCancel: false,
                                success: res => {
                                    that.setData({
                                        isAuthorize: true,
                                        isBind: false,
                                    });
                                }
                            });
                        };
                    };
                }
            })
        }
    }
})