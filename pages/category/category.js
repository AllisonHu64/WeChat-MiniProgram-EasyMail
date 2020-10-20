// pages/category/category.js
import { request } from "../../request/index.js";
Page({

  /**
   * Page initial data
   */
  data: {
    //左边菜单栏
    leftMenuList:[],
    // 右侧商品数据
    rightContent:[],
    //被点击的左侧的菜单
    currentIndex:0,
    //右侧内容的滚动条距离
    scrollTop:0


  },

  //接口返回数组
  Cates:[],
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    /* 
    0. web 中的本地存储和小程序的本地存储的去呗
      1. 写程序的方式不一样了
        web: localStorage.setItem("key","value") localStorage.getItem("key")
        小程序： wxSetStorageSync("key","val"); wx.getStorageSync("key")
      2. 存的时候 有没有做累心转化
      web: 不管存入什么累心， 都会调用tostring
      小程序： 不存在类型转换
    1. 先判断一下本地存储中有没有就得数据
      {time:Data.now(),data:[...]}
    2. 没有旧数据 直接发送新请求
    3. you旧数据 同时 就得数据也没有过期 就使用本地春促中的旧数据即可
    */

    // 1 获取本地存储中的数据 （小程序中也是存在本地存储 技术）
    const Cates=wx.getStorageSync("cates");
    // 2 判断
    if(!Cates){
      //不存在 发送请求
      this.getCates();
    }
    else{
      // 有就得数据 定义过期时间 10s 改为 5min
      if (Date.now()-Cates.time>1000*10) {
        this.getCates();
      }
      else{
        //可以使用就得数据

        console.log("旧数据");
        this.Cates=Cates.data;
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        // 构造右侧的商品数据
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })

      }
    }
  },

  // 获取分类数据
  getCates(){
    request({
      url : "https://api-hmugo-web.itheima.net/api/public/v1/categories"
    }).then(res=>{
      this.Cates=res.data.message;

      // 把接口的数据存入本地存储中
      wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});
        
      // 构造左边的大菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      // 构造右侧的商品数据
      let rightContent=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })

    })
    
  },
  //左侧菜单的点击事件
  handleItemTap(e){
    /*
    1. 获取被点击的标题上的index
    2. 给data中的currentIndex 赋值
    3. 根据不同的索引来渲染右侧的商品内容
    */
   const {index}=e.currentTarget.dataset;
   let rightContent=this.Cates[index].children;
   this.setData({
    currentIndex:index,
    rightContent,
    //重新设置 右侧内用的scroll-view标签的距离顶部的距离
    scrollTop:0
  })
  }

})