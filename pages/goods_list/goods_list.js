/*
1.用户上划页面 滚动条触底 开始加载下一页数据
  1. 滚动条触底时间
  2. 判断还有没有下一页数据
    1. 获取总页数
    2. 获取当前页码
  3. 有 加载
    1. 当前页码++
    2. 重新发送请求
    3. 数据请求回来 要对data 当中 数组
       进行拼接 而不是全部替换
  4. 无 提示
2. 下拉刷新页面
  1. 触发下拉事件 需要再页面的jason文件中开启一个配置项
    找到触发下拉刷新事件
  2. 重制 数据数组
  3. 重制页码 设置为1
  4. 重新发送请求
  5. 数据请求回来 手动的关闭等待效果
 */
// pages/goods_list/goods_list.js
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({

  /**
   * Page initial data
   */
  data: {
    tabs:[
      {
        id:0,
        value:"Recommand",
        isActive:true
      },
      {
        id:1,
        value: "Most Sold",
        isActive:false
      },
      {
        id:2,
        value:"Sort by Price",
        isActive:false
      }
    ],
    goodsList:[]

  },

  // 接口要的参数
  QuesryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },

  //总页数
  totalPages:1,
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.QuesryParams.cid=options.cid;
    this.getGoodsList();
  },

  // 获取商品列表的数据
  async getGoodsList(){
    const res = await request({url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/search", data:this.QuesryParams});
    //获取总条数
    const total=res.data.message.total;
    //计算总页数
    this.totalPages=Math.ceil(total/this.QuesryParams.pagesize);
    
    this.setData({
      goodsList:[...this.data.goodsList,...res.data.message.goods]
    })
    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
  },
  
  //标题点击事件 从子组件传递过来的
  handleTabsItemChange(e){
    //获取被点击的标题索引
    const {index} = e.detail;
    // 修改原数组
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 赋值到data中
    this.setData({
      tabs
    })

  },

  //页面上划 滚动条触底
  onReachBottom(){
    // 判断有没有下一页
    if (this.QuesryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: 'No more items'
      });
        
    } else {
      this.QuesryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 触发下拉刷新
  onPullDownRefresh(){
    //1 重置数组
    this.setData({
      goodsList:{}
    })
    // 重制页码
    this.QuesryParams.pagenum=1;
    // 重新发请求
    this.getGoodsList();
  }
})