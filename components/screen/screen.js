// components/screen/screen.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        list: [],
        screenShow: false,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        displayChange(){
            let x = !this.data.screenShow
            this.setData({
                screenShow: x,
            });
        },
        selectThis(e) {
            let y = e.currentTarget.dataset.y;
            let j = e.currentTarget.dataset.j;
            let list = this.data.list;
            list[y].children[j].select = !list[y].children[j].select;
            this.setData({
                list: list,
            });
        },
        reset() {
            let list = this.data.list;
            list.map(e => {
                e.children.map(i => {
                    i.select = false;
                });
            });
            this.setData({
                list: list,
            });
        },
        complete() {
            let list = this.data.list;
            let backData = {};
            list.map(e=>{
                backData[e.parameterName] = [];
                e.children.map(i=>{
                    if(i.select){
                        backData[e.parameterName].push(i.id);
                    };
                });
            });
            for (let i in backData){
                if (backData[i].length == 0){
                    // delete backData[i]
                    backData[i] = "";
                }else{
                    backData[i] = backData[i].join(",");
                };
            };
            //数据传递返回给父层,查询绑定在自定义事件'backData'下的函数
            var myEventDetail = backData; // detail对象，提供给事件监听函数
            var myEventOption = {
                bubbles: false, //事件是否冒泡
                composed: false, //事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
                capturePhase: false, //事件是否拥有捕获阶段
            } // 触发事件的选项
            this.triggerEvent('backData', myEventDetail, myEventOption);
            this.displayChange();
        }
    },
    /**
     * 生命周期
     */
    lifetimes: {
        attached() {

        },
        ready() {
            app.ajaxWx({
                type: "get",
                url: "api/v1/alcohol/parameter/dictionary/query",
                success: res => {
                    if (res.status == 0) {
                        let data = res.data.list;
                        let list = [];
                        let arr = [];
                        data.map(e => {
                            let index = arr.indexOf(e.parameterId);
                            e.select = false;
                            if (index < 0) {
                                arr.push(e.parameterId);
                                let obj = {
                                    parameterId: e.parameterId,
                                    pname: e.pname,
                                    parameterName: e.parameterName,
                                    children: [e]
                                }
                                list.push(obj);
                            } else {
                                list[index].children.push(e);
                            }
                        });
                        this.setData({
                            list: list,
                        });
                    };
                }
            });
        },
    },
})