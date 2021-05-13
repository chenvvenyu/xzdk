App({
    public: {
        userInfo: "", //用户微信信息：头像，昵称，性别等...
        bindFlag: false,
        inviteCode: "", //邀请码
        // server: "http://192.168.2.195:9018/",
        server: "https://xztc.zjxiangzhi.com/",
        // server: "http://192.168.2.145:8443/",
        server_task: "task/",
        server_user: "user/",
        server_appliance: "appliance/",
        server_express: "express/",
        server_aorder: "aorder/",
        token: "",
        userLocation: {
            key: "M7DBZ-HAP34-SH4UX-D3Y6X-5S5XV-MNBNJ",
            common: {
                address: "",
                districtId: 330212,
                district: "鄞州区",
                cityId: 330200,
                city: "宁波市",
                provinceId: 330000,
                province: "浙江省",
                name: "",
                lng: "121.547",
                lat: "29.8172",
            },
            rawData: "", //原始数据
        },
        firstShow: true,
        refresh: true, //首页数据是否刷新
        pageCode: new Map([
            //页面简易代码，用于分享和二维码进入
            ['a', {
                title: "首页",
                patch: "/pages/index/index",
                code: "a",
                p: "index",
            }],
            ['b', {
                title: "查快递",
                patch: "/pages/lookup/lookup",
                code: "b",
                p: "lookup",
            }],
            ['c', {
                title: "我的",
                patch: "/pages/my/my",
                code: "b",
                p: "my",
            }]
        ]),
    },
    share: {
        app: "",
        list: [
            "pages/index/index",
            "pages/shop/shop",
            "pages/product-detail/product-detail",
        ],
        mapData: new Map(),
        sharePage() {
            let pages = getCurrentPages(); //获取加载的页面
            let currentPage = pages[pages.length - 1]; //获取当前页面的对象
            let url = `/pages/start/start?p=${currentPage.route.split('/')[2]}`; //当前页面url
            let par = this.app.getPagePar(currentPage.options);
            let code = this.app.public.otherInfo.inviteCode;
            currentPage.onShareAppMessage = function () {
                return {
                    title: '分享给朋友测试',
                    path: `${url}&${par.str}${code?'&c='+code:''}`
                };
            };
        },
        monitor(example) {
            //监听
            let that = this;
            this.app = example;
            for (let i in this.list) {
                that.mapData.set(that.list[i], true);
            };
            //路由监听
            wx.onAppRoute((router) => {
                let path = router.path;
                if (that.mapData.get(path)) {
                    that.sharePage();
                    wx.showShareMenu({
                        withShareTicket: true,
                        menus: ['shareAppMessage'], //shareTimeline 朋友圈
                    })
                };
            });
        },
    },
    onLaunch: function (options) {
        //设置是否保持常亮状态。仅在当前小程序生效，离开小程序后设置失效
        // wx.setKeepScreenOn({
        //     keepScreenOn: true
        // });
        // this.share.monitor(this);

    },
    onHide() {
        //切换后台断开socket
        this.public.refresh = true;
    },
    getUserLocation() {
        let that = this;
        //获取用户地址信息-坐标+详细地址
        wx.getLocation({
            type: 'gcj02',
            success(obj) {
                //获取用户详细地址
                that.getLocationDetail(obj.latitude, obj.longitude, res => {});
            }
        });
    },
    onShow() {
        //切换前台重连socket
        //小程序版本更新检测
        if (wx.canIUse("getUpdateManager")) {
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate((res) => {
                console.log('onCheckForUpdate====', res);
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function () {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function (res) {
                                console.log('success====', res)
                                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate();
                                }
                            }
                        })
                    });
                    updateManager.onUpdateFailed(function () {
                        // 新的版本下载失败
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                        })
                    })
                };
            });
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用更新小程序版本功能，请升级到最新微信版本后重试。'
            })
        };
    },

    /**
     * 封装公用的请求函数
     */
    loadingShow: true,
    closeLoading: "",
    clickLock: false,
    ajaxWx(obj) {
        let that = this;
        if (this.closeLoading) {
            clearTimeout(this.closeLoading);
        };
        if (this.loadingShow) {
            if (obj.tip) {
                wx.showLoading({
                    title: obj.tip,
                    mask: true,
                });
                this.loadingShow = false;
            };
        };
        //防止连点
        if (this.clickLock) {
            return;
        } else {
            if (obj.type == "post") this.clickLock = true;
        };
        //  obj:{
        //      type:get|post,
        //      url:接口地址,
        //      contentType:application/x-www-form-urlencoded|application/json
        //      data:提交的数据,
        //      success:返回处理结果的函数,
        //      tip:提示信息
        //      isBack: yes|no 是否返回上一页
        //      name: //接口类型
        //  }
        var contentType = "";
        var subData = "";
        if (obj.contentType == "json") {
            contentType = "application/json";
            subData = JSON.stringify(obj.data); //json字符串
        } else {
            contentType = "application/x-www-form-urlencoded";
            subData = obj.data;
        };
        let isBack = obj.isBack ? obj.isBack : "yes";
        let newHeader = {
            "content-type": contentType,
        };
        if (that.public.token) {
            newHeader['Authorization'] = `Bearer ${that.public.token}`
        };
        wx.request({
            method: obj.type,
            url: `${that.public.server}${obj.name}${obj.url}`,
            header: newHeader,
            data: subData,
            success: function (res) {
                that.clickLock = false;
                if (res.statusCode == 200) {
                    if (res.data.code == "000000") {
                        //成功
                        if (obj.success) obj.success(res.data);
                    } else if (res.data.sub_code == "040005") {
                        //未登录
                        if (isBack == "yes") {
                            that.notLogin();
                        } else {
                            //报错不返回上一页
                            wx.showModal({
                                title: "提示",
                                content: `${res.data.sub_mesg}`,
                                showCancel: false,
                                success(con) {

                                }
                            });
                        }
                        if (obj.fail) obj.fail(res);
                    } else {
                        //报错并返回结果
                        wx.showModal({
                            title: `提示`,
                            content: `${res.data.sub_mesg}`,
                            showCancel: false,
                        });
                        obj.success(res.data);
                    };
                } else {
                    wx.showModal({
                        title: `错误：${res.statusCode}`,
                        content: `接口${obj.url}`,
                        showCancel: false,
                    });
                }
            },
            fail: function (res) {
                console.log("接口连接错误");
                console.log(res);
                if (obj.fail) obj.fail(res);
            },
            complete: function (res) {
                if (obj.complete) obj.complete(res);
                if (!that.loadingShow) {
                    if(obj.type == "post"){
                        that.closeLoading = setTimeout(() => {
                            wx.hideLoading();
                            that.closeLoading = "";
                        }, 2000);
                    }else{
                        wx.hideLoading();
                        that.closeLoading = "";
                    };
                    that.loadingShow = true;
                };
            }
        });
    },
    notLogin() {
        let that = this;
        //未登录
        wx.showModal({
            title: '提示',
            content: '您还未登录，请先登录！',
            success(res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '/pages/authorize/authorize',
                    });
                } else if (res.cancel) {
                    that.naviBack()
                };
            }
        });
    },
    naviBack() {
        let pages = getCurrentPages();
        if (pages.length > 1) {
            wx.navigateBack({
                delta: 1,
            });
        } else {
            console.log("当前页没有可以返回的页面");
            wx.reLaunch({
                url: '/pages/index/index'
            });
        };
    },
    bindValue(a, b) {
        //对象名
        let objName = a.currentTarget.dataset['name'];
        //input值
        let val = a.detail.value;
        b.setData({
            [objName]: val
        });
    },
    judgeMobile(mobile) {
        //手机号码判断
        let res = /^1(3|4|5|6|7|8|9)[0-9]{9}/.test(mobile);
        if (!res) {
            wx.showToast({
                title: '手机号码无效',
                icon: "none",
                mask: true,
                duration: 2000
            });
        };
        return res;
    },
    checkTime(i) {
        //将0-9的数字前面加上0，例1变为01    
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    },
    getPagePar(obj) {
        console.log("--------------------------------------")
        console.log("传入", obj);
        if (obj.scene) {
            console.log(`<<二维码进入>>`);
            let scene = decodeURIComponent(obj.scene).split(",");
            let par = {
                obj: {},
                str: "",
                type: "code",
            };
            for (let i in scene) {
                par.obj[scene[i].split("_")[0]] = scene[i].split("_")[1];
                par.str = `${par.str}${scene[i].split('_')[0]}=${scene[i].split('_')[1]}&`;
            };
            par.str = par.str.replace(/[&]$/, "");
            console.log("导出", par);
            console.log("--------------------------------------")
            return par;
        } else if (obj.p) {
            console.log(`<<分享进入>>`);
            let par = {
                obj: obj,
                str: "",
                type: "share",
            };
            for (let i in obj) {
                par.str = `${par.str}${i}=${obj[i]}&`;
            };
            par.str = par.str.replace(/[&]$/, "");
            console.log("导出", par);
            console.log("--------------------------------------")
            return par;
        } else {
            console.log(`没有参数的处理`);
            let par = {
                obj: obj,
                str: "",
                type: "none",
            };
            for (let i in obj) {
                par.str = `${par.str}${i}=${obj[i]}&`;
            };
            par.str = par.str.replace(/[&]$/, "");
            console.log("--------------------------------------")
            return par;
        };
    },
    getLocationDetail(lat, lng, back) {
        wx.request({
            url: 'https://apis.map.qq.com/ws/geocoder/v1/',
            data: {
                location: `${lat},${lng}`,
                key: this.public.userLocation.key
            },
            success: res => {
                //根据坐标获取地址
                if (res.statusCode == 200) {
                    let city = res.data.result.address_component.city;
                    this.public.userLocation.rawData = res.data.result;
                    let code = res.data.result.ad_info.adcode + "";
                    this.public.userLocation.common = {
                        address: res.data.result.address,
                        districtId: code,
                        district: res.data.result.ad_info.district,
                        cityId: code.substring(0, 4) + "00",
                        city: res.data.result.ad_info.city,
                        provinceId: code.substring(0, 2) + "0000",
                        province: res.data.result.ad_info.province,
                        name: res.data.result.ad_info.name,
                        lng: lng,
                        lat: lat,
                    };
                    back(res.data.result);
                }
            }
        });
    },
    dataGrouping(obj) {
        //obj.arr:原始数组
        //obj.sign:分组标签
        //obj.that:页面实例this
        //obj.name:页面对象
        //数据分组
        let newList = {};
        obj.arr.map((x, y) => {
            let list = newList[x[obj.sign]];
            if (list) {
                list.push(x);
            } else {
                newList[x[obj.sign]] = [x];
            }
        });
        let arr = [];
        for (let i in newList) {
            arr.push({
                name: i,
                list: newList[i]
            });
        };
        obj.that.setData({
            [obj.name]: arr
        });
        // return newList;
    },
    dateFtt(fmt, date) {
        var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "[hH]+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
})