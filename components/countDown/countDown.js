// components/countDown/countDown.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        date: {
            //目标时间
            type: String,
            value: "",
        },
        borderColor: {
            //倒计时box边框色
            type: String,
            value: "#fff",
        },
        backgroundColor: {
            //倒计时box背景色
            type: String,
            value: "#fff",
        },
        height: {
            //倒计时box高度
            type: String,
            value: "auto",
        },
        width: {
            //倒计时box宽度
            type: String,
            value: "auto",
        },
        fontSize: {
            //倒计时box字体大小
            type: String,
            value: "14px",
        },
        itemBG: {
            //倒计时item的背景色
            type: String,
            value: "#fff",
        },
        itemCo: {
            //倒计时item的字体色
            type: String,
            value: "#000",
        },
        mCo: {
            //倒计时item间隔的字体色
            type: String,
            value: "#000",
        },
        isSymbols:{
            type: Boolean,
            value: true,
        },
        index: {
            //索引
            type: String,
            value: "",
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        day: "00",
        hour: "00",
        minute: "00",
        second: "00",
        setTime: "",
    },

    /**
     * 组件的方法列表
     */
    methods: {
        checkTime(i) {
            //将0-9的数字前面加上0，例1变为01    
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        },
        getCountDownTime(m) {
            let that = this;
            if (m < 0) {
                that.setData({
                    day: "00",
                    hour: "00",
                    minute: "00",
                    second: "00",
                });
                //数据传递返回给父层,查询绑定在自定义事件'backData'下的函数
                var myEventDetail = {
                    time: "end",
                    index: this.data.index,
                }; // detail对象，提供给事件监听函数
                that.triggerEvent('backData', myEventDetail);
                return false;
            };
            //计算剩余的天数
            var days = parseInt(m / 1000 / 60 / 60 / 24, 10);
            //计算剩余的小时    
            var hours = parseInt(m / 1000 / 60 / 60 % 24, 10);
            //计算剩余的分钟    
            var minutes = parseInt(m / 1000 / 60 % 60, 10);
            //计算剩余的秒数   
            var seconds = parseInt(m / 1000 % 60, 10);
            days = that.checkTime(days)
            hours = that.checkTime(hours);
            minutes = that.checkTime(minutes);
            seconds = that.checkTime(seconds);
            that.setData({
                day: days,
                hour: hours,
                minute: minutes,
                second: seconds,
            });
            let setTime = setTimeout(function () {
                that.getCountDownTime(m - 1000);
            }, 1000);
            this.setData({
                setTime: setTime
            })
        },
    },
    ready() {
        //组件生命周期函数
        this.getCountDownTime(new Date(this.data.date) - new Date());
    },
    detached() {
        this.setData({
            setTime: "",
        })
    }
})