// pages/cart/cart.js
/*1. 获取用户的收货地址
    1.绑定点击事件
    2. 调用小程序内置 api 获取用户的收货地址 
    
    3. 获取 用户对小程序所授予 获取地址的权限状态 scope
      1. 假设 用户获取受过地址的提示 确定 authSetting  scope.address
        scope值 true 直接调用 获取收货地址
      2. 假设 不选确定
        scope值 false
        1. 诱导用户自己打开授权设置页面 当用户重新给予 获取收货地址权限
      3. 假设 用户没有调用过 收货地址的api
        scope值 undefined  直接调用 获取收货地址
    4. 把获取到的收货地址存入本地的存储中
  2. 页面加载完毕
    0. onLoad onShow
    1. 获取本地存储中的地址数据
    2. 把数据 设置给data中的一个变量
  3. onShow
    0. 回到了商品详情页面第一次添加商品的时候手动添加了属性
    1. 获取缓存中的购物车数组
    2. 把购物车充填到data中
  4. 全选的实现 数据实现
    1. onShow 获取缓存中的购物车数据
    2. 根据购物车中的商品数据 所有的商品都被选中 checked = true 全选被选中
  5. 总价格和总数量
    1.都需要这个商品被选中我们才那它来计算
    2. 获取购物车数组
    3. 遍历
    4. 判断商品是否被选中
    5. 总价格 《= 商品单价 * 商品数量
    6. 总数量 《= 商品数量
    7. 把计算后的价格和数量 设置回data中即可
  6. 商品的选中
      1. 绑定change 事件
      2. 获取被修改的商品对象
      3. 商品对象的选中状态取反
      4. 重新填充会data中缓存中
      5. 重新计算 全选 总价格 总数量
  7.全选和反选 
    1. 全选复选框要绑定事件
    2. 获取data中的全选变量 allChecked
    3. 直接取反 allChecked=!allChecked
    4. 当购物车的数量 =1 同时 用户点击 “-”
      弹窗提示(showModal) 询问用户是否删除
      1. 确定 直接执行删除
      2. 取消 什么都不做
    4. 遍历购物车数组 让里面所有的 商品 选中状态跟随 allChecked 改变
    5. 把购物车数组 和 allChecked 重新设置到data 吧购物车重新设置回 缓存中
  8. 商品数量的编辑
    1. “+”， “-” 绑定同一个点击事件区分的关键 自定义属性
      1. “+”， “+1”
      2. “-“， ”-1”
    2. 传递被点击的商品id goods_id
    3. 获取data中的购物车数组 来获取被修改对象
    4. 直接修改商品对象的数量 num
    5. 把cart数组 重新设置回缓存中 和data中 this.setCart
*/
 import { getSetting, chooseAddress, openSetting, showModal} from "../../utils/asyncWx.js";
 import regeneratorRuntime from "../../lib/runtime/runtime";

Page({
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNumber:0

  },
  onShow(){
    //1. 获取缓存中的收货地址信息
    const address=wx.getStorageSync("address");
    //1. 获取缓存中的购物车数据
    //2. 给data赋值
    const cart=wx.getStorageSync("cart");
    this.setCart(cart);
    this.setData({address});
      

  },

  //点击收货地址
  async handleChooseAddress(){
    //获取权限状态
    try{
  

      //1, 获取权限状态
      const res1=await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //2. 判断权限状态
      if(scopeAddress === false){
      // 先引导用户打开授权页面
        await openSetting();
      }

      let address = await chooseAddress();
      address.all = address.cityName + address.countyName
      + address.countyName + address.detailInfo;
      //5. 存入缓存中
      wx.setStorageSync("address", address);
        

  }
  catch(error){
    console.log(error);
  }

  },

  //商品的选中
  handleItemCheck(e){
    //1. 获取被修改的商品的id
    const goods_id=e.currentTarget.dataset.id;
    //2. 获取购物车数组
    let cart = this.data.cart;
    //3. 找到被修改对象
    let index = cart.findIndex(v=>v.goods_id===goods_id);
    //4. 选中状态取反
    cart[index].checked = !cart[index].checked;
    
    this.setCart(cart);
    
  },
  // 商品的全选功能
  handleCheckAll(){

    //2. 获取data中的全选变量 allChecked
    let allChecked=this.data.allChecked;
    let cart=this.data.cart;
    //3. 直接取反 allChecked=!allChecked
    allChecked = !allChecked;
    //4. 遍历购物车数组 让里面所有的 商品 选中状态跟随 allChecked 改变
    cart.forEach(v=>v.checked=allChecked);
    //5. 把购物车数组 和 allChecked 重新设置到data 吧购物车重新设置回 缓存中
    this.setCart(cart);
  },

  //商品数量的编辑功能
  async handleNumberChange(e){
      
    //1. 获取传递过来的参数
    const {sign,id}=e.currentTarget.dataset;
    //2. 获取购物车数组
    let {cart}=this.data;
    //3. 找到需要修改的商品索引
    const index = cart.findIndex(v=>v.goods_id===id);
    //判断是否要删除
    if(cart[index].num===1 && sign===-1){
      //4.1弹窗提示
      const res = await showModal({content:"Would you like to detele this item from your cart?"});
      if (res.confirm) {
        cart.splice(index,1);
        this.setCart(cart);
      }

    }else{
      //4. 进行修改数量
      cart[index].num += sign;
      //5. 设置回缓存和data中
      this.setCart(cart);
    }

  },

  //设置购物车状态同时 重新计算底部工具栏数据 全选 总价格 购买数量
  setCart(cart){
    //6. 重新计算

    let allChecked=true;
    // 1. 计算总价、总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice += v.goods_price * v.num;
        totalNum+=v.num;

      }else{
        allChecked=false;
      }
    })
    //判断数组是否为空、
    allChecked=cart.length!=0?allChecked:false;
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    });
    wx.setStorageSync("cart",cart);

  }
})