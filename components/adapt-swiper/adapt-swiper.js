// components/adapt-swiper/adapt-swiper.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        autoplay: {
            type: Boolean,
            value: true,
        },
        circular: {
            type: Boolean,
            value: true,
        },
        dots: {
            type: Boolean,
            value: true,
        },
        color: {
            type: String,
            value: "#ffffff",
        },
        activeColor: {
            type: String,
            value: "#ffa74f",
        },
        imgList: {
            type: Array,
            value: [],
        },
        imgField: {
            type: String,
            value: "imgUrl",
        },
        viewWidth: {
            type: Number,
            value: 0,
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        current: 0,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        imageLoad(e) {
            let imgWidth = e.detail.width;
            let imgHeight = e.detail.height;
            //宽高比  
            let ratio = imgWidth / imgHeight;
            let viewHeight = this.data.viewWidth / ratio;
            let y = e.currentTarget.dataset.y;
            let list = this.data.list;
            list[y].ratio = ratio;
            list[y].viewHeight = viewHeight;
            this.setData({
                list: list,
            });
        },
        bindchange(e) {
            this.setData({
                current: e.detail.current
            })
        },
    },
    lifetimes: {
        ready() {
            this.setData({
                list: this.data.imgList,
            })
        }
    },
    observers: {
        //数据监听器
        "imgList"(obj){
            //传入数据改变则初始化组件数据
            if (obj){
                this.setData({
                    list: [],
                });
                setTimeout(_=>{
                    this.setData({
                        list: this.data.imgList,
                    })
                },100)  
            };   
        }
    }
})