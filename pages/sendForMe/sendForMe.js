// pages/sendForMe/sendForMe.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        multiArray: [],
        nowTimeList: [],
        multiArrayValue: [0, 0, 0],
        multiIndex: "",
        startDate: "立即取件",
        includePoints: [],
        markers: [],
        send: {
            name: "寄件人信息",
            address: "请输入寄件人信息"
        }, //寄件人
        collect: {
            name: "收件人信息",
            address: "请输入收件人信息"
        }, //收件人
        agree: false, //是否同意
        goodsData: "", //物品信息
        orderDate: "", //上门时间
        cost: 0,
        estimateNum: 0,
        amount: 0,
        insuredFee: 0,
        reward: 0,
        distance: 0,
        tips: "跑腿费",
        typeList: [
            {
                label: "其他",
            },
            {
                label: "文件"
            },
            {
                label: "美食"
            },
            {
                label: "蛋糕"
            },
            {
                label: "手机"
            },
            {
                label: "鲜花"
            },
            {
                label: "钥匙"
            },
        ],
        typeChoice: "-1",
        weightList: [],
        weightChoice: "",
        popShow: false,
        priceShow: false,
        infoDetail: "",
        couponType: "none",
        couponValue: 0,
        couponsId: "",
        orderId: "",
        qrCode: "",
        codeShow: false,
        lastPrice: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let nowHours = parseInt(app.dateFtt("h", new Date()));
        let multiArray = [
            ['今天', '明天'],
            ["立即取件"],
            ["00分", "10分", "20分", "30分", "40分", "50分"]
        ];
        for (let i = (nowHours + 1); i < 25; i++) {
            multiArray[1].push(`${i}时`);
        };
        this.setData({
            nowTimeList: multiArray,
            multiArray: multiArray,
            orderDate: app.dateFtt("yyyy-MM-dd hh:mm:ss", new Date()),
        });
        this.getCoupon();
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
        //获取缓存的用户地址
        wx.getStorage({
            key: 'address-send',
            success(res) {
                console.log(res);
                let inc = that.data.includePoints;
                inc[0] = {
                    latitude: res.data.lat,
                    longitude: res.data.lng
                };
                let mar = that.data.markers;
                mar[0] = {
                    id: 1,
                    latitude: res.data.lat,
                    longitude: res.data.lng,
                };
                that.setData({
                    send: res.data,
                    includePoints: inc,
                    markers: mar,
                });
                that.getWeightRule();
                that.mapInclu();
                that.estimate();
                wx.removeStorage({
                    key: 'address-send',
                    success: function (res) {
                        console.log("寄件人地址缓存数据已移除");
                    },
                });
            }
        });
        wx.getStorage({
            key: 'address-collect',
            success(res) {
                console.log(res);
                let inc = that.data.includePoints;
                inc[1] = {
                    latitude: res.data.lat,
                    longitude: res.data.lng
                };
                let mar = that.data.markers;
                mar[1] = {
                    id: 2,
                    latitude: res.data.lat,
                    longitude: res.data.lng,
                };
                that.setData({
                    collect: res.data,
                    includePoints: inc,
                    markers: mar,
                });
                that.mapInclu();
                that.estimate();
                wx.removeStorage({
                    key: 'address-collect',
                    success: function (res) {
                        console.log("收件人地址缓存数据已移除");
                    },
                });
            }
        });
        
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
    getWeightRule(){
        // http://xztc.zjxiangzhi.com/user/api/v1/user/address/delivery/weight/rule?addressId=5
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/address/delivery/weight/rule`,
            data: {
                addressId: this.data.send.addressId,
            },
            name: "user",
            success: res => {
                if (res.code == "000000") {
                    this.setData({
                        weightChoice: res.data.mathFucResultBeansWeight[0].fuc.conditionMax,
                        weightList: res.data.mathFucResultBeansWeight
                    })
                };
            }
        });
    },
    confirm(){
        if(this.data.typeChoice < 0){
            wx.showToast({
                title: '请选择物品类型',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        let goodsData = {
            expressName: this.data.typeList[this.data.typeChoice].label,
            weight: this.data.weightChoice,
        };
        this.setData({
            goodsData: goodsData,
        });
        this.popShowFn();
        this.estimate();
    },
    goodsInfoFn(){
        if(this.data.send.addressId && this.data.collect.addressId){
            this.popShowFn(); 
        }else{
            wx.showToast({
                title: '请先选择寄收地址',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
        };
    },
    popShowFn(){
        this.setData({
            popShow: !this.data.popShow
        })
    },
    priceShowFn(){
        this.setData({
            priceShow: !this.data.priceShow
        })
    },
    codeShowFn(){
        this.setData({
            codeShow: !this.data.codeShow
        })
    },
    typeChoiceFn(e){
        let val = e.currentTarget.dataset.y;
        this.setData({
            typeChoice: val
        })
    },
    weightChoiceFn(e){
        let val = e.currentTarget.dataset.value;
        this.setData({
            weightChoice: val
        })
    },
    getNum(res) {
        this.setData({
            reward: res.detail.num
        });
        this.endPrice();
    },
    mapInclu() {
        let map = wx.createMapContext('map');
        //缩放视野展示所有坐标点
        map.includePoints({
            points: this.data.includePoints,
            padding: ["30", "30", "50", "30"]
        })
    },
    timeTap(e) {
        //点击触发
    },
    columnChange(e) {
        //列的值改变时触发
        let multiArray = [
            ['今天', '明天'],
            ["00时", "01时", "02时", "03时", "04时", "05时", "06时", "07时", "08时", "09时", "10时", "11时", "12时", "13时", "14时", "15时", "16时", "17时", "18时", "19时", "20时", "21时", "22时", "23时"],
            ["00分", "10分", "20分", "30分", "40分", "50分"]
        ];
        let nowTimeList = this.data.nowTimeList;
        let multiArrayValue = this.data.multiArrayValue;
        if (e.detail.column == 0) {
            if (e.detail.value == 0) {
                this.setData({
                    multiArray: nowTimeList,
                })
            } else {
                this.setData({
                    multiArray: multiArray,
                });
            };
            multiArrayValue[e.detail.column] = e.detail.value;
            multiArrayValue[1] = 0;
            multiArrayValue[2] = 0;
        } else if (e.detail.column == 1) {
            multiArrayValue[e.detail.column] = e.detail.value;
            multiArrayValue[2] = 0;
        } else if (e.detail.column == 2) {
            multiArrayValue[e.detail.column] = e.detail.value;
        };
        this.setData({
            multiArrayValue: multiArrayValue,
        });
    },
    timeChange(e) {
        //最终结果确认时触发
        let time = new Date();
        let val = e.detail.value;
        let list = this.data.multiArray;
        let date, dateStr, hour, hourStr, minute, minuteStr;
        //日期
        if (list[0][val[0]] == "今天") {

        } else if (list[0][val[0]] == "明天") {
            time.setDate(time.getDate() + 1)
        } else if (list[0][val[0]] == "后天") {
            time.setDate(time.getDate() + 2)
        };
        date = app.dateFtt("yyyy-MM-dd", time);
        dateStr = list[0][val[0]];
        //小时
        hour = app.checkTime(parseInt(list[1][val[1]]));
        hourStr = list[1][val[1]];
        //分钟
        minute = `${val[2]}0`;
        minuteStr = list[2][val[2]];
        if (val[0] == 0 && val[1] == 0) {
            this.setData({
                startDate: `立即取件`,
                // orderDate: app.dateFtt("yyyy-MM-dd hh:mm:ss", new Date()),
            });
        }else{
            this.setData({
                startDate: `${dateStr}-${hourStr}-${minuteStr}`,
                orderDate: `${date} ${hour}:${minute}:00`,
            });
        };
        console.log("str:", this.data.startDate);
        console.log("date:", this.data.orderDate);
        this.estimate();
    },
    estimate() {
        //运费计算
        if (this.data.send.addressId && this.data.collect.addressId && this.data.goodsData.weight) {
            this.setData({
                tips: "正在计算跑腿费..."
            });
            app.ajaxWx({
                type: "get",
                url: `/api/v1/user/address/calculation/delivery/fee/rule`,
                data: {
                    cost: 0,
                    endAddressId: this.data.collect.addressId,
                    startAddressId: this.data.send.addressId,
                    weight: this.data.goodsData.weight,
                    date: this.data.orderDate,
                    type: "1",
                },
                name: "user",
                success: res => {
                    if (res.code == "000000") {
                        let amountD = 0;
                        res.data.freightCalculation.mathFucResultBeansDistrict.map(e=>{
                            amountD = amountD + e.amount*1
                        });
                        let amountW = 0;
                        let maxW = 0;
                        let minW = 0;
                        res.data.freightCalculation.mathFucResultBeansWeight.map(e=>{
                            amountW = amountW + e.amount*1;
                            maxW = e.fuc.conditionMax;
                            minW = e.fuc.conditionMin;
                        });
                        this.setData({
                            tips: "跑腿费",
                            amount: amountD + amountW,
                            distance: res.data.distance,
                            infoDetail: {
                                dis: res.data.distance,
                                amountD: amountD,
                                maxW: maxW,
                                minW: minW,
                                amountW: amountW,
                            }
                        });
                        this.endPrice();
                    };
                }
            });
        }
    },
    getCoupon() {
        //calculationType:1 折扣 2满减（抵扣）
        app.ajaxWx({
            type: "get",
            url: `/api/v1/user/coupon/current/express/type/list`,
            data: {
                type: 2,
            },
            name: "user",
            success: res => {
                if (res.code == "000000") {
                    res.data.map(e=>{
                        if(e.couponDTO.calculationType == 1){
                            e.str = `${e.couponDTO.discount*10}折券`;
                        }else if(e.couponDTO.calculationType == 2){
                            e.str = `${e.couponDTO.couponAmount}元券（满${e.couponDTO.taskAmount}元可用）`;
                        };
                    });
                    res.data.unshift({
                        str: "不使用优惠券"
                    })
                    this.setData({
                        coupon: res.data,
                    });
                };
            }
        });
    },
    endPrice(){
        //计算最终价格
        let lastPrice = 0;
        let amount = this.data.amount;
        let couponType = this.data.couponType;
        let couponValue = this.data.couponValue;
        let reward = this.data.reward;
        if(couponType == 1){
            //折扣
            lastPrice = (amount*couponValue + reward).toFixed(1);
        }else{
            //满减
            if((amount - couponValue) < 0){
                lastPrice = reward.toFixed(1);
            }else{
                lastPrice = ((amount - couponValue) + reward).toFixed(1);
            }
        };
        this.setData({
            lastPrice: lastPrice,
        });
    },
    pickerCoupon(e) {
        //优惠券选择
        let val = e.detail.value;
        let list = this.data.coupon;
        let couponValue = 0;
        if(val == 0){
            this.setData({
                couponType: 'none',
                couponsId: "",
                couponValue: 0
            });
        }else{
            if(list[val].couponDTO.calculationType == 1){
                couponValue = list[val].couponDTO.discount*1;
            }else if(list[val].couponDTO.calculationType == 2){
                couponValue = list[val].couponDTO.couponAmount*1;
            };
            this.setData({
                couponType: list[val].couponDTO.calculationType,
                couponsId: val + "",
                couponValue: couponValue
            });
        };
        this.endPrice();
    },
    
    isAgree() {
        //是否同意服务协议
        this.setData({
            agree: !this.data.agree
        });
        // this.estimate();
    },
    sub() {
        //下单快递
        let send = this.data.send;
        if (send.name == "寄件人信息") {
            wx.showToast({
                title: '请填写寄件人地址',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        let collect = this.data.collect;
        if (collect.name == "收件人信息") {
            wx.showToast({
                title: '请填写收件人地址',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        let goodsData = this.data.goodsData;
        if (!goodsData) {
            wx.showToast({
                title: '请选择物品信息',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        let agree = this.data.agree;
        if (!agree) {
            wx.showToast({
                title: '请同意快件服务协议',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        let orderDate = this.data.orderDate;
        if (this.data.startDate == "立即取件") {
            orderDate = app.dateFtt("yyyy-MM-dd hh:mm:ss", new Date());
        };
        let subData = {
            expressInfoForms: [{
                endAddressId: collect.addressId,
                expressName: goodsData.expressName,
                images: goodsData.images,
                weight: goodsData.weight,
                cost: 0,
                amount: this.data.amount,
                insuredFee: 0,
                totalBonus: this.data.reward,
                distance: this.data.distance,
                confirm: 1,
            }],
            startAddressId: send.addressId,
            insuredStatus: 2,
            mailType: 1,
            pickUpTime: orderDate,
            orderType: 1,
            insuredFee: 0,
            fastStatus: 2,
            couponId: this.data.couponsId?this.data.coupon[this.data.couponsId].couponId: ""
        };
        app.ajaxWx({
            type: "post",
            url: `/api/v1/user/order/created/delivery`,
            data: subData,
            contentType: "json",
            name: "order",
            success: res => {
                if (res.code == "000000") {
                    wx.showToast({
                        title: '下单成功',
                        icon: 'success',
                        duration: 1500,
                        mask: true,
                    });
                    this.setData({
                        orderId: res.data
                    });
                    setTimeout(function(){
                        wx.redirectTo({
                            url: `/pages/order-pay/order-pay?id=${res.data}`,
                        })
                        // wx.navigateTo({
                        //     url: `/pages/help-order-detail/help-order-detail?id=${res.data}`,
                        // })
                    },1500);
                };
            }
        });
    },
    getQRcode(){
        let qrCode = `${app.public.server}order/api/v1/user/order/qr/pay?expressOrderId=${this.data.orderId}&payType=WXSCAN`;
        this.setData({
            qrCode: qrCode,
            codeShow: true,
        })
    },
    df(){
        //下单快递
        if(this.data.orderId){
            this.setData({
                codeShow: true,
            });
            return false;
        };
        let send = this.data.send;
        if (send.name == "寄件人信息") {
            wx.showToast({
                title: '请填写寄件人地址',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        let collect = this.data.collect;
        if (collect.name == "收件人信息") {
            wx.showToast({
                title: '请填写收件人地址',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        let goodsData = this.data.goodsData;
        if (!goodsData) {
            wx.showToast({
                title: '请选择物品信息',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        let agree = this.data.agree;
        if (!agree) {
            wx.showToast({
                title: '请同意快件服务协议',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        let orderDate = this.data.orderDate;
        if (this.data.startDate == "立即取件") {
            orderDate = app.dateFtt("yyyy-MM-dd hh:mm:ss", new Date());
        };
        let subData = {
            expressInfoForms: [{
                endAddressId: collect.addressId,
                expressName: goodsData.expressName,
                images: goodsData.images,
                weight: goodsData.weight,
                cost: 0,
                amount: this.data.amount,
                insuredFee: 0,
                totalBonus: this.data.reward,
                distance: this.data.distance,
                confirm: 1,
            }],
            startAddressId: send.addressId,
            insuredStatus: 2,
            mailType: 1,
            pickUpTime: orderDate,
            orderType: 1,
            insuredFee: 0,
            fastStatus: 2,
        };
        app.ajaxWx({
            type: "post",
            url: `/api/v1/user/order/created/delivery`,
            data: subData,
            contentType: "json",
            name: "order",
            success: res => {
                if (res.code == "000000") {
                    // wx.showToast({
                    //     title: '下单成功',
                    //     icon: 'success',
                    //     duration: 1500,
                    //     mask: true,
                    // });
                    this.setData({
                        orderId: res.data
                    });
                    this.getQRcode();
                };
            }
        });
    }
})