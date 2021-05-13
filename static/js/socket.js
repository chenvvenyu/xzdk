// var app = getApp();
const ws = {
    app: "",
    //socket实例
    socket: "",
    //socket:URl
    url: "",
    //重连间隔
    reconnectTime: 10000,
    //初始化socket
    init(callBack) {
        if (callBack.getMessage) ws.getMessage = callBack.getMessage;
        if (callBack.initBack) ws.initBack = callBack.initBack;
        ws.url = `${ws.app.public.socket}api/v1/socket?mobile=${ws.app.public.storeLoginInfo.mobile}&pwd=${ws.app.public.storeLoginInfo.pwd}`;
        if (ws.socket) {
            //已有链接
            console.log("已有链接");
        } else {
            ws.connect();
        };
    },
    //消息返回，回调函数callBack
    getMessage: "",
    //socket创建成功，回调函数
    initBack: "",
    //发送消息
    setMessage(obj, type) {
        if (ws.socket && ws.socket.readyState == 1) {
            let subData = JSON.stringify({
                message: obj,
                type: type,
            });
            ws.socket.send({
                data: subData,
                success: res => {
                    if (type == 1) {
                        console.log("发送成功");
                    }
                },
                fail: (res) => {
                    console.log(res)
                }
            });
        };
    },
    //每隔40秒发送一次心跳包，保持socket在线
    heartTime: "",
    sendHeartbeat() {
        if(ws.socket){
            if (ws.heartTime) {
                clearInterval(ws.heartTime);
            };
            ws.heartTime = setInterval(_ => {
                let subData = JSON.stringify({
                    message: 1,
                    type: 99,
                });
                ws.socket.send({
                    data: subData,
                    success: res => {
                        console.log("心跳发送");
                    },
                    fail: (res) => {
                        console.log(res)
                    }
                });
            }, 40000);
        }else{
            if (ws.heartTime) {
                clearInterval(ws.heartTime);
            };
        };
    },
    //创建websocket链接
    connect() {
        ws.socket = wx.connectSocket({
            url: ws.url,
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                console.log('websocket已创建');
            },
            fail(res) {
                wx.showToast({
                    title: '连接失败',
                    icon: 'none',
                    duration: 1500,
                    mask: true,
                });
                ws.reconnect();
            }
        });
        ws.socket.onOpen(_ => {
            console.log('websocket已打开');
            if (ws.initBack) ws.initBack(true);
            ws.sendHeartbeat();
            ws.socket.onMessage(res => {
                console.log("接受数据", JSON.parse(res.data));
                ws.getMessage(JSON.parse(res.data));
            });
            ws.socket.onClose(res => {
                console.log(`websocket已断开,code:${res.code}原因:${res.reason}`);
                clearInterval(ws.heartTime);
                ws.socket = "";
                if (res.code != 1000) {
                    ws.reconnect();
                };
            });
        });
        ws.socket.onError(res => {
            console.log("error:", res);
        });
    },
    //重新链接
    reconnect() {
        console.log("正在重连");
        setTimeout(ws.connect, ws.reconnectTime)
    },
    //关闭链接
    close() {
        if (ws.socket) {
            ws.socket.close({
                code: 1000,
                reason: "主动关闭",
            });
        };
    }
};
module.exports = ws;