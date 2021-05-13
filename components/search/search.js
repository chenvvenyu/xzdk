// components/search/search.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        width: {
            type: String,
            value: "700rpx",
        },
        height: {
            type: String,
            value: "60rpx",
        },
        background: {
            type: String,
            value: "#f5f5f5",
        },
        color: {
            type: String,
            value: "#000",
        },
        placeholder: {
            type: String,
            value: "请输入搜索关键词",
        },
        boxBg: {
            type: String,
            value: "255,255,255,1",
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        searchKey: "",
    },

    /**
     * 组件的方法列表
     */
    methods: {
        toway(e) {
            //双向绑定
            let name = e.currentTarget.dataset['name'];
            let val = e.detail.value;
            this.setData({
                [name]: val
            });
        },
        setSearchKey(e){
            let key = e.detail.value;
            this.setData({
                searchKey: key
            });
        },
        transmitKey(){
            //数据传递返回给父层,查询绑定在自定义事件'backData'下的函数
            var myEventDetail = {
                searchKey: this.data.searchKey
            }; // detail对象，提供给事件监听函数
            var myEventOption = {
                bubbles: false, //事件是否冒泡
                composed: false, //事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
                capturePhase: false, //事件是否拥有捕获阶段
            } // 触发事件的选项
            this.triggerEvent('backData', myEventDetail, myEventOption);
        },
    }
})
