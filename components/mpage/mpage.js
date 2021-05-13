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
            value: {},
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        show: 1, //0:加载中,1:加载更多,2:没有更多了
        subData: {}, //请求分页的相关参数
        childrenPage: 1, //当前页数
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getList() {
            this.setData({
                show: 0
            });
            app.ajaxWx({
                type: "get",
                url: this.data.url,
                data: this.data.subData,
                tip: "加载中...",
                success: res => {
                    if (res.status == 0) {
                        if (res.data.totalCount == 0) {
                            this.setData({
                                show: 2
                            })
                        } else {
                            if (res.data.list.length < this.data.pageSize) {
                                this.setData({
                                    show: 2
                                })
                            } else {
                                this.setData({
                                    show: 1
                                })
                            };
                            //数据传递返回给父层,查询绑定在自定义事件'backData'下的函数
                            var myEventDetail = res.data;
                            this.triggerEvent('backData', myEventDetail, );
                            //页数+1,并且更新subData
                            let x = this.data.childrenPage + 1;
                            this.setData({
                                childrenPage: x,
                                "subData.page": x
                            });
                        }
                    };
                },
                fail: res => {
                    this.setData({
                        show: 2
                    });
                },
            });
        },
        loading() {
            wx.showToast({
                title: '请稍等,加载中..',
                icon: 'none',
                duration: 2000,
                mask: true,
            });
        },
        nomore() {
            wx.showToast({
                title: '没有更多了!',
                icon: 'none',
                duration: 2000,
                mask: true,
            });
        }
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
        "wdata"(obj) {
            //传入数据改变则初始化组件数据
            if (obj) {
                let subData = obj;
                subData.page = 1;
                subData.pageSize = this.data.pageSize;
                this.setData({
                    subData: obj,
                    childrenPage: 1,
                });
                this.getList();
            };
        }
    }
})