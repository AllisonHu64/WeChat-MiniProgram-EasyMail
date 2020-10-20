// 0 引用来用来发送请求方法 一定要把路径补全
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //导航数组
    catesList: [
      {
        name: "category",
        image_src: "/icons/cate.png",
        open_type: "switchTab",
        navigator_url: "/pages/category/index"
      },

      {
        name: "discounts",
        image_src: "/icons/instant.png",
        open_type: "switchTab",
        navigator_url: "/pages/category/index"

      },

      {
        name: "grocery",
        image_src: "/icons/grocery.png",
        open_type: "switchTab",
        navigator_url: "/pages/category/index"

      },

      {
        name: "maternal products",
        image_src: "/icons/maternal.png",
        open_type: "switchTab",
        navigator_url: "/pages/category/index"

      }
    ],
    //楼层数据
    floorList: []
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1. 发送异步骑牛来获取轮播图数据
    // 优化手段可以通过es6的promise
    
    this.getFloorList();
  },


  //获取 楼层数据

  getFloorList(){
    request({url:'https://api-hmugo-web.itheima.net/api/public/v1/home/floordata'})
    .then(result=>{
        this.setData({
          floorList: result.data.message
        })
      }
      )
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})