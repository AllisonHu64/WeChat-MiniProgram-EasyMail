/*
 1. 发送请求获取数据
 2. 点击轮播图 预览大图功能
    1. 给轮播图绑定点击事件
    2. 调用小程序的 API  previewImage
  3. 点击加入购物车
    1. 绑定点击事件
    2. 获取缓存中的购物车数据 数组格式
    3. 先判断 当前的商品手否已经存在于购物车
    4. 已存在 修改购物车商品数据 执行购物车数量++ 重新把购物车数组 填充会缓存中
    5. 不存在购物车的数组中直接给购物车数组添加一个新元素 新元素 带上购买数量属性 重新把购物车数组 填充会缓存中
    6. 弹出提示
 */
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({

  /**
   * Page initial data
   */
  data: {
    goodsObj:{}

  },
  //商品对象
  GoodsInfo:{},

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const {goods_id} = options;
    this.getGoodsDetail(goods_id)

  },
  //获取商品的详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/detail", data:{goods_id}});
    this.GoodsInfo = goodsObj;
    console.log(goodsObj);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.data.message.goods_name,
        goods_price:goodsObj.data.message.goods_price,
        // iphone 部分手机不识别 webp图片格式
        // 最好找到后台 进行修改
        // 临时自己改 确保后台存在 1.webp => 1.jpg
        goods_introduce:goodsObj.data.message.goods_introduce.replace(/.webp/g,'.jpg'),
        pics:goodsObj.data.message.pics
      }
    })
  },
  //点击轮播图 放大 预览
  // 1. 先构造要预览的图片数组
  handlePreview(e){
    //console.log("点击");
    const urls= this.GoodsInfo.data.message.pics.map(v=>v.pics_mid);
    // 2.接收传递过来的url
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      
      current,
      urls
    });
      
  },
  handleCartAdd(){
    //1. 获取缓存中的购物车 数组
    let cart=wx.getStorageSync("cart")||[];
    // 2. 判断商品对象时候勋在与购物车数组中
    let index=cart.findIndex(v=>v.goods_id==this.GoodsInfo.data.message.goods_id);
    if(index===-1){
      //3. 不存在 第一次添加
      this.GoodsInfo.data.message.num = 1;
      this.GoodsInfo.data.message.checked = true;
      cart.push(this.GoodsInfo.data.message);
    }else{
      //4. 已经存在购物车数据 执行num++
      cart[index].num++;
    }

    //5. 把购物车重新添加到缓存中
    wx.setStorageSync("cart", cart);

    //6. 弹窗提示
    wx.showToast({
      title: 'Added to cart',
      icon: 'success',
      // True 防止用户手抖了 疯狂点击按钮
      mask: true
    });
      

      
  }

})