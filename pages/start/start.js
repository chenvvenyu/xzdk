const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        subData: {
            encryptedData: "",
            iv: "",
            jsCode: "",
            loginType: "miniapp",
        },
        seting: false, //设置
        options: "",
        isOpenLocation: true, //是否需要用户定位
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        this.setData({
            options: options,
        });
        if (options.code) {
            app.public.otherInfo.inviteCode = options.code;
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
        let that = this;
        if (this.data.isOpenLocation) {
            this.getSettingUserLocation();
        } else {
            this.login();
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
    getSettingUserLocation(){
        let that = this;
        //获取用户授权情况-检测地址位置授权
        wx.getSetting({
            success(res) {
                console.log(res.authSetting)
                if (!res.authSetting['scope.userLocation']) {
                    //未授权地理位置则开始授权
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success(val) {
                            that.getUserLocation();
                        },
                        fail(res) {
                            //地理位置授权被拒绝则打开授权设置按钮
                            that.setData({
                                seting: true,
                            });
                        }
                    });
                } else {
                    that.getUserLocation();
                };
            }
        });
    },
    getUserLocation() {
        let that = this;
        //获取用户地址信息-坐标+详细地址
        this.setData({
            seting: false,
        });
        wx.getLocation({
            type: 'gcj02',
            success(obj) {
                console.log(obj)
                if (obj.errMsg == "getLocation:ok") {
                    //获取用户详细地址
                    app.getLocationDetail(obj.latitude, obj.longitude, res => {
                        // 获取用户信息
                        that.login();
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '定位失败，请检查定位服务是否开启！',
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {

                            };
                        }
                    });
                };
            },
            fail(obj) {
                console.log("失败", obj);
                wx.showModal({
                    title: '提示',
                    content: '定位失败，请检查定位服务是否开启！',
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {};
                    }
                });
            }
        });
    },
    login(){
        //获取code
        wx.login({
            success: res => {
                this.data.subData.jsCode = res.code
                app.ajaxWx({
                    type: "post",
                    url: `/api/v1/user/weixinuser/wxlogin`,
                    contentType: "json",
                    data: this.data.subData,
                    name: "user",
                    tip: "正在登录",
                    success: res => {
                        if (res.code == "000000") {
                            if(res.data.code == "0000"){
                                app.public.bindFlag = true;
                                app.public.userInfo = JSON.parse(res.data.accessToken.userInfo);
                                app.public.token = res.data.accessToken.access_token;
                            }else if(res.data.code == "0001"){
                                app.public.bindFlag = false;
                                app.public.userInfo = "";
                                app.public.token = "";
                            };
                            this.linkTo();
                        };
                    }
                });
            }
        });
    },
    linkTo() {
        let link = app.getPagePar(this.data.options);
        let type = link.type;
        let pageData = link.obj;
        if(app.public.pageCode.get(link.obj.p)){
            pageData = app.public.pageCode.get(link.obj.p);
        };
        app.public.inviteCode = link.obj.c ? link.obj.c : '';
        if (type == "none") {
            wx.reLaunch({
                url: '/pages/index/index'
            });
        } else if (type == "code") {
            wx.reLaunch({
                url: `/pages/${pageData.p}/${pageData.p}?${link.str}`,
            });
        } else if (type == "share") {
            wx.reLaunch({
                url: `/pages/${pageData.p}/${pageData.p}?${link.str}`,
            });
        }
    }
})