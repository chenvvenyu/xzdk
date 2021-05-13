// pages/goods-info/goods-info.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        num: 1,
        list: [],
        inputValue: "",
        img: "/static/img/base/img-add.png",
        id: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.id = options.id;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    addList(e) {
        let val = e.detail.value;
        let list = this.data.list;
        list.push(val);
        this.setData({
            list: list,
            inputValue: "",
        })
    },
    delList(e) {
        let y = e.currentTarget.dataset.y;
        let list = this.data.list;
        list.splice(y, 1);
        this.setData({
            list: list,
        });
    },
    minus() {
        let num = this.data.num;
        if (num == 1) {
            return;
        } else {
            this.setData({
                num: num - 1,
            })
        };
    },
    plus() {
        let num = this.data.num;
        this.setData({
            num: num + 1,
        })
    },
    choiceImg(e) {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // imgList.push(...res.tempFilePaths)
                // that.setData({
                //     imgList: imgList
                // });
                that.uploadImg(res.tempFilePaths[0]);
            }
        })
    },
    uploadImg(file) {
        let that = this;
        let url = app.public.server;
        wx.uploadFile({
            url: `${url}appliance/api/v1/cloud/oos/upload`,
            filePath: file,
            formData: {
                prefix: "upimg"
            },
            name: 'file',
            success: (val) => {
                console.log(val)
                that.setData({
                    img: JSON.parse(val.data).data,
                })
            }
        });
    },
    delImg(){
        console.log(1)
        this.setData({
            img: "/static/img/base/img-add.png",
        })
    },
    sub(){
        if(this.data.list.length == 0){
            wx.showToast({
                title: '请填写物品名称',
                icon: 'none',
                duration: 1500,
                mask: true,
            });
            return false;
        };
        let name = this.data.list.join(",");
        let goodsData = {
            images: [this.data.img == '/static/img/base/img-add.png'?'':this.data.img],
            expressName: name,
            weight: this.data.num,
        };
        wx.setStorage({
            key: `goodsData`,
            data: goodsData,
        });
        wx.navigateBack({
            delta: 1
        });
    },
    goTo(){
        wx.navigateTo({
          url: `/pages/charge-rule/charge-rule?id=${this.data.id}&type=kd`,
        })
    }
})