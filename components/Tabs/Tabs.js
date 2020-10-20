// components/Tabs/Tabs.js
Component({
  /**
   * Component properties
   */
  properties: {

    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    //点击事件
    handleItemTap(e){
      //获取点击的索引
      const {index} = e.currentTarget.dataset;
      // 触发父组件中的事件自定义
      this.triggerEvent("tabsItemChange",{index});

    }

  }
})
