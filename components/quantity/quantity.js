// components/quantity/quantity.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        inputNum: {
            //初始数量值
            type: Number,
            value: 1,
        },
        inputNumMax: {
            //数量最大值
            type: Number,
            value: 99,
        },
        inputNumMin: {
            //数量最小值
            type: Number,
            value: 1,
        },
        inputRedonly: {
            //是否只读
            type: Boolean,
            value: false,
        },
        a: {
            type: String,
            value: "",
        },
        b: {
            type: String,
            value: "",
        },
        c: {
            type: String,
            value: "",
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        number: "",
        outputNum: "",
        numMax: "",
        numMin: "",
    },

    /**
     * 组件的方法列表
     */
    methods: {
        originalNum() {
            //如果修改失败则复原数据
            this.setData({
                outputNum: this.data.number
            });
        },
        lastCheck() {
            if (this.data.outputNum < 1) {
                this.setData({
                    outputNum: 1,
                });
            };
            this.out();
        },
        numberVal(e) { //输入验证
            let val = 0;
            if (e.detail.value) val = parseInt(e.detail.value.replace(/[^0-9]/, ''));
            let x = 0;
            x = val > this.data.numMax ? this.data.numMax : val;
            x = x < this.data.numMin ? this.data.numMin : x;
            this.setData({
                outputNum: x,
                number: val,
            });
            this.out();
        },
        minus() {
            let outputNum = this.data.outputNum * 1 - 1;
            let number = this.data.outputNum * 1;
            let x = 0;
            if (outputNum <= this.data.numMin) {
                x = this.data.numMin;
            } else {
                x = outputNum > 0 ? outputNum : 0;
            };
            this.setData({
                outputNum: x,
                number: number,
            })
            this.out("minus");
        },
        plus() {
            let outputNum = this.data.outputNum * 1 + 1;
            let number = this.data.outputNum * 1;
            let x = outputNum > this.data.numMax ? this.data.numMax : outputNum;
            this.setData({
                outputNum: x,
                number: number,
            });
            this.out("plus");
        },
        out(operation) {
            //数据传递返回给父层,查询绑定在自定义事件'backData'下的函数
            var myEventDetail = {
                num: this.data.outputNum,
                operation: operation,
                a: this.data.a,
                b: this.data.b,
                c: this.data.c,
            }; // detail对象，提供给事件监听函数
            var myEventOption = {
                bubbles: false, //事件是否冒泡
                composed: false, //事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
                capturePhase: false, //事件是否拥有捕获阶段
            } // 触发事件的选项
            this.triggerEvent('backData', myEventDetail, myEventOption);
        },
    },
    observers: {
        //数据监听器
        "inputNum"(obj) {
            //传入数据改变则初始化组件数据
            if (obj) {
                this.setData({
                    outputNum: this.data.inputNum * 1,
                    number: this.data.inputNum * 1,
                    numMax: this.data.inputNumMax * 1,
                    numMin: this.data.inputNumMin * 1,
                });
            };
        }
    },
    ready() {
        //组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
        this.setData({
            outputNum: this.data.inputNum * 1,
            number: this.data.inputNum * 1,
            numMax: this.data.inputNumMax * 1,
            numMin: this.data.inputNumMin * 1,
        });
    },
})