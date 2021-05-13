// pages/address-edit/address-edit.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        location: ["浙江省","宁波市","鄞州区"], //城市
        isDefault: false, //如果修改地址为默认地址时，无法取消默认
        type: "", //add:新增，edit:修改
        subData: {
            provinceId: "330000", //省
            cityId: "330200", //市
            regionId: "330212", //区
            address: "", //详细地址
            addressText: "", //门牌号
            lat: "",
            lng: "",
            name: "",
            mobile: "",
            defaultStatus: false,
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            type: options.type,
        });
        if (this.data.type == "edit") {
            //修改
            app.ajaxWx({
                type: "get",
                url: `/api/v1/user/address/get`,
                data: {
                    id: options.id,
                },
                name: "user",
                success: res => {
                    if (res.code == "000000") {
                        let x = res.data.address.split(",")[0].split("-");
                        res.data.defaultStatus = res.data.defaultStatus == 1 ? true : false;
                        res.data.address = res.data.address.split(",")[1];
                        this.setData({
                            subData: res.data,
                            location: x,
                            isDefault: res.data.defaultStatus,
                        });
                    };
                }
            });
        }
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
    pickerAddress(e) {
        console.log(e)
        //地址选择
        let name = e.currentTarget.dataset.name;
        let val = e.detail.value;
        let code = e.detail.code;
        let data = this.data.subData;
        if (code[0] == data.provinceId && code[1] == data.cityId && code[2] == data.regionId) {
            //如果地址选择未有变化
            return;
        };
        this.setData({
            "subData.provinceId": code[0],
            "subData.cityId": code[1],
            "subData.regionId": code[2],
            // "subData.address": `${val[0]}-${val[1]}-${val[2]}`,
            [name]: val
        });
    },
    choiceLoaction() {
        //打开地图选择地址
        let that = this;
        let location = "";
        if (this.data.subData.lat && this.data.subData.lng) {
            location = this.data.subData;
        } else {
            location = app.public.userLocation.common;
        };
        wx.chooseLocation({
            latitude: location.lat,
            longitude: location.lng,
            success: res => {
                console.log('success:', res);
                that.setData({
                    "subData.address": res.name,
                    "subData.lat": res.latitude,
                    "subData.lng": res.longitude,
                });
            },
            fail: res => {
                console.log('fail:', res);
            },
        })
    },
    isDefault(e) {
        //选择默认
        let x = e.detail.value;
        this.setData({
            "subData.defaultStatus": x,
        });
    },
    sub() {
        let subData = this.data.subData;
        let location = this.data.location;
        let type = this.data.type;
        let that = this;
        console.log(subData);
        console.log(location);
        for (let i in subData) {
            if (subData[i].length == 0) {
                console.log(i);
                wx.showToast({
                    title: '请填写所有项目',
                    icon: 'none',
                    mask: true,
                    duration: 2000
                })
                return false;
            };
        };
        // if (!app.judgeMobile(subData.mobile)) {
        //     return false;
        // };
        subData.defaultStatus = subData.defaultStatus ? 1 : 2;
        subData.address = `${location[0]}-${location[1]}-${location[2]},${subData.address}`;
        if (type == "add") {
            app.ajaxWx({
                type: "post",
                url: `/api/v1/user/address/save`,
                data: subData,
                contentType: "json",
                name: "user",
                tip: "稍等...",
                success: res => {
                    if (res.code == "000000") {
                        wx.showToast({
                            title: '添加成功',
                            icon: 'success',
                            mask: true,
                            duration: 2000
                        });
                        setTimeout(() => {
                            wx.navigateBack({
                                delta: 1
                            });
                        }, 2000);
                    };
                }
            });
        } else {
            app.ajaxWx({
                type: "post",
                url: `/api/v1/user/address/update`,
                data: subData,
                contentType: "json",
                name: "user",
                tip: "稍等...",
                success: res => {
                    if (res.code == "000000") {
                        wx.showToast({
                            title: '修改成功',
                            icon: 'success',
                            mask: true,
                            duration: 2000
                        });
                        
                    };
                }
            });
        };
    }
})