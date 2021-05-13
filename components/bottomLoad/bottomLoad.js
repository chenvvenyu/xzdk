// pages/components/mpage/mpage.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        page: {
            type: Number,
            value: 1,
        },
        pageSize: {
            type: Number,
            value: 10,
        },
        url: {
            type: String,
            value: "1",
        },
        wdata: {
            type: Object,
            value: {}
        },
        name: {
            type: String,
            value: "",
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        show: 1, //0:加载中,1:加载更多,2:没有更多了
        subData: {}, //请求分页的相关参数
        childrenPage: 1, //当前页数
        allLoad: false,//全部加载完毕
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getList() {
            if (this.data.show == 2 && this.data.allLoad){
                return false;
            };
            this.setData({
                show: 0
            });
            app.ajaxWx({
                type: "get",
                url: this.data.url,
                data: this.data.subData,
                tip: "加载中...",
                name: this.data.name,
                success: res => {
                    if (res.code == "000000") {
                        if (res.data.totalCount == 0) {
                            this.setData({
                                show: 2,
                                allLoad: true,
                            });
                        } else {
                            if (res.data.list.length < this.data.pageSize) {
                                this.setData({
                                    show: 2,
                                    allLoad: true,
                                });
                            } else {
                                this.setData({
                                    show: 1
                                });
                            };
                            //数据传递返回给父层,查询绑定在自定义事件'backData'下的函数
                            var myEventDetail = res.data; // detail对象，提供给事件监听函数
                            var myEventOption = {
                                bubbles: false, //事件是否冒泡
                                composed: false, //事件是否可以穿越组件边界
                                capturePhase: false, //事件是否拥有捕获阶段
                            } // 触发事件的选项
                            this.triggerEvent('backData', myEventDetail, myEventOption);
                            //页数+1,并且更新subData
                            let x = this.data.childrenPage + 1;
                            this.setData({
                                childrenPage: x,
                                "subData.page": x
                            });
                        }
                    };
                },
            });
        },
    },
    ready() {
        //组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
        let that = this;
        let y = {};
        if (this.data.wdata){
            y = this.data.wdata;
        };
        y.page = this.data.childrenPage;
        y.pageSize = this.data.pageSize;
        this.setData({
            childrenPage: this.data.page,
            subData: y,
        });
    },
    observers: {
        //数据监听器
        "wdata"(obj){
            //传入数据改变则初始化组件数据
            if (obj){
                let subData = obj;
                subData.page = 1;
                subData.pageSize = this.data.pageSize;
                this.setData({
                    subData: obj,
                    childrenPage: 1,
                    allLoad: false,
                });
                this.getList();
            };   
        }
    }
})