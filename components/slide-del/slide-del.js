// components/slide-del/slide-del.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        //框架高度
        frameH: {
            type: Number,
            value: 200,
        },
        //框架宽度
        frameW: {
            type: Number,
            value: 750,
        },
        //其他按钮
        oaTitle: {
            type: String,
            value: "",
        },
        //索引1
        indexA: {
            type: String,
            value: "",
        },
        //索引2
        indexB: {
            type: String,
            value: "",
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        moveData: {
            xStart: "",
            yStart: "",
        },
        x: 170,
    },
    /**
     * 生命周期
     */
    lifetimes: {
        attached(){
            this.setData({
                x: this.data.oaTitle ? 340 : 170
            })
        },
        ready(){
            
        },
    },
    /**
     * 组件的方法列表
     */
    methods: {
        moveSt(e) {
            //滑动开始
            let moveData = this.data.moveData;
            moveData.xStart = e.changedTouches[0].clientX;
            moveData.yStart = e.changedTouches[0].clientY;
            this.setData({
                moveData: moveData,
            });
        },
        moveEnd(e) {
            //滑动结束
            let moveData = this.data.moveData;
            let xEnd = e.changedTouches[0].clientX;
            let yEnd = e.changedTouches[0].clientY;
            let oaTitle = this.data.oaTitle;
            let x = this.data.x;
            if (Math.abs(moveData.yStart - yEnd) > 100) {
                console.log("上下滑动");
                return false;
            };
            if (moveData.xStart > xEnd) {
                // console.log("左滑动，显示删除按钮");
                if (Math.abs(moveData.xStart - xEnd) > (oaTitle?100:50)) {
                    // console.log("滑动超过一半");
                    //数据传递返回给父层,查询绑定在自定义事件'backData'下的函数
                    var myEventDetail = "restore"; // detail对象，提供给事件监听函数
                    var myEventOption = {
                        bubbles: false, //事件是否冒泡
                        composed: false, //事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
                        capturePhase: false, //事件是否拥有捕获阶段
                    } // 触发事件的选项
                    this.triggerEvent('slideEnd', myEventDetail, myEventOption);
                    x = 0;
                }
            };
            if (moveData.xStart < xEnd) {
                // console.log("右滑动，关闭删除按钮");
                x = oaTitle? 340:170;
            };
            this.setData({
                x: x,
            });
        },
        restoreX(){
            this.setData({
                x: this.data.oaTitle ? 340 : 170,
            })
        },
        del(){
            //数据传递返回给父层,查询绑定在自定义事件'backData'下的函数
            var myEventDetail = {
                indexA: this.data.indexA,
                indexB: this.data.indexB,
            }; // detail对象，提供给事件监听函数
            var myEventOption = {
                bubbles: false, //事件是否冒泡
                composed: false, //事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
                capturePhase: false, //事件是否拥有捕获阶段
            } // 触发事件的选项
            this.triggerEvent('del', myEventDetail, myEventOption);
            // this.slideRestore();   
        },
        oaAction(){
            //数据传递返回给父层,查询绑定在自定义事件'backData'下的函数
            var myEventDetail = {
                indexA: this.data.indexA,
                indexB: this.data.indexB,
            }; // detail对象，提供给事件监听函数
            var myEventOption = {
                bubbles: false, //事件是否冒泡
                composed: false, //事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
                capturePhase: false, //事件是否拥有捕获阶段
            } // 触发事件的选项
            this.triggerEvent('oa', myEventDetail, myEventOption);
            this.slideRestore();   
        },
        slideRestore(){
            //滑动复位
            this.setData({
                x: this.data.oaTitle ? 340 : 170,
            });
        }
    }
})
