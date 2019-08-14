let util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 监听元素的列表 
    spyEls: ["#lv1", "#lv2", "#lv3"],
    // 查询后的列表值
    queryList: [],
    // 选中的元素Id
    spyActiveId: "lv1",
    // nav元素的高度
    navHeight: 0,
    // nav元素的offsettop
    navTop: 0,
    navFixed:false,
    windowHeight:0


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取 设备高度getSystemInfo 
    wx.getSystemInfo({
      success: (res) => {
       // console.log(res.windowHeight);
        var windowHeight = res.windowHeight;
        this.setData({
          windowHeight
        })
      }
    });

    // nav的高度
    util.queryAll("#nav", (res) => {
      var arrs = res[0];
      var navHeight = arrs[0] && arrs[0].height || 0;
      var navTop = arrs[0] && arrs[0].top || 0;
      this.setData({
        navHeight,
        navTop
      });
    });

    // 获取监听元素列表值
    util.queryAll(this.data.spyEls.join(","), (res) => {
      var arrs = res[0];
      var queryList = arrs.slice(0, arrs.length);
      this.setData({
        queryList
      });

    });

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

  },

  // 页面滚动监听
  onPageScroll(e) {
    var top = e.scrollTop;

    // 滚动监听
    // 从大到小排序
    // var list = this.data.queryList.sort((a, b) => b.top - a.top);
    // top = top + this.data.navHeight + 1;
    // // 加+1px 因为rpx 计算会偏差1px
    // for (let item of list) {
    //   if (top >= item.top) {
    //     this.setData({
    //       spyActiveId: item.id
    //     });
    //     break;
    //   }
    // }

      // nav滚动定位
      if (top >=this.data.navTop) {
        this.setData({
          navFixed: true
        });

      }else{
        this.setData({
          navFixed: false
        });
       }
  },

  // 点击切换tab
  switchTab(e) {

    var id = e.currentTarget.dataset.id;
    var newsList = this.data.queryList.find(item => item.id == id);
    var top = newsList.top - this.data.navHeight + 1;
    // 加+1px 因为rpx 计算会偏差1px
    wx.pageScrollTo({
      scrollTop: top,
      duration: 400
    })

  }

})