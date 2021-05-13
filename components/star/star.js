// components/star/star.js
Component({
    options: {
        //去除组件样式隔离(页面样式影响组件,组件不影响页面)
        styleIsolation: 'apply-shared'
    },
    /**
     * 组件的属性列表
     */
    properties: {
        mode: {
            //模式 read-only,click
            type: String,
            value: "click",
        },
        inIndexA: {
            //索引1
            type: String,
            value: 1,
        },
        inIndexB: {
            //索引2
            type: String,
            value: 1,
        },
        inStar: {
            //初始数量值
            type: String,
            value: 1,
        },
        inMaxStar: {
            //最大星星数0-10
            type: Number,
            value: 5,
        },
        inMinStar: {
            //最小星星数
            type: Number,
            value: 0,
        },
        inMarginRight: {
            //右距离
            type: String,
            value: "5rpx",
        },
        inFontSize: {
            //图标大小
            type: String,
            value: "50rpx",
        },
        inStarColor: {
            //选中的图标颜色
            type: String,
            value: "#FD9526",
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        score: "",
        starList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },

    /**
     * 组件的方法列表
     */
    methods: {
        select(e) {
            if (this.data.mode == "click") {
                let x = e.currentTarget.dataset.score;
                if (x == this.data.score) {
                    this.setData({
                        score: x - 1,
                    });
                } else {
                    this.setData({
                        score: x,
                    });
                };
                this.returnScore();
            };
        },
        returnScore(){
            this.triggerEvent('backData', {
                score: this.data.score
            });
        }
    },
    lifetimes: {
        ready() {
            this.setData({
                score: this.data.inStar
            });
        }
    },
})
