//app.js
App({
  onLaunch: function () {

    // this.localtion();

    // // 获取注册用户信息
    // this.isUserReg(null, function (user) {
    //   wx.showToast({
    //     title: '~网络加载失败~',
    //     duration: 1000,
    //     icon: 'none'
    //   });
    // });

  },

  baseUrl: "https://weixin.sujin1688.com/",
  imgUrl: "https://weixin.sujin1688.com/sjbjadmin",
  filterUrl: "https://weixin.sujin1688.com/",

  isInit: false, // 初始化第一次 
  isLoadOne:true, // 第一次加载
  isLink: true,
  addr: {
    city: "全国",
    province: "全国"
  },
  replace(txt) {
    txt = txt || "";
    return txt.replace(/市|特别行政区/, "");
  },
  // user info
  user: {
    openid: "",
    isLogin: false,
    userInfo: {}, // 微信本地用户信息
    userid: 0

  },

  // 默认定位属性
  localtionAddr: {
    province: "",
    city: "",
    showCity: ""
  },

  searchVal: "",
  isSearch: false, // 是否是查询页跳转

  // 初始化定位
  initLocaltion(self) {
    self.setData({
      city: this.addr.city,
      province: this.addr.province,
      showCity: this.replace(this.addr.city),
    });
  },

  // 设置定位
  setLocaltion(self, fn) {

    if (self.data.city.trim() != this.addr.city.trim()) {
      self.setData({
        city: this.addr.city,
        showCity: this.replace(this.addr.city),
        province: this.addr.province
      });

      // 回调函数
      if (typeof fn === "function") {
        fn(self);
      }

    }
  },

  // 全局初始化定位
  localtion(fn) {

    // 检查本地存值
    var localtion = wx.getStorageSync("localtionShop");
    if (localtion) {

      var data = JSON.parse(localtion);
      this.addr.city = data.city;
      this.addr.province = data.province;
      if (typeof fn === "function") {
        fn(data);
      }
      return;
    } else {
      if (typeof fn === "function") {
        fn({
          isOnly: false
        });
      }
    }

  },

  /* 1.获取 UserInfo 信息
    2.本地用户登录 
  */
  saveUserInfo(userinfo, fn) {

    this.getOpenid((openid) => {

      // 根据openid 把本地userinfo用户信息存在服务端
      wx.request({
        url: this.baseUrl + 'sjbj/index.php/user/weixin/getuserinfo',
        method: "POST",
        data: {
          openid_xcx: openid,
          userinfo: userinfo
        },
        success: (res) => {

          var data = res.data;
          if (typeof fn === "function") {
            fn(data);
          }

        },
        fail: (res) => {


          wx.hideLoading();
          wx.showToast({
            title: '~网络加载失败~',
            duration: 3000,
            icon: 'none'
          });

          if (typeof fn === "function") {
            fn(res);
            return;
          }

        },

      })
    });
  },

  // getOpenid 全局为一次执行  bl为true重新init执行
  getOpenid(fn) {

    //  1.微信用户登录
    wx.login({

      success: (res) => {
        var code = res.code;
        if (code) {
          // console.log(code)
          // 2.发送请求 获取openid
          wx.request({
            method: 'POST',
            url: this.baseUrl + "sjbj/index.php/user/weixin/get_openid", //接口地址
            data: {
              code: res.code
            },
            success: (res) => {

              this.user.openid = res.data.openid;
              // console.log("openid:" + this.user.openid);
              if (typeof fn === "function") {
                fn(this.user.openid);
                return;
              }

            },
            fail: () => {

              wx.hideLoading();
              wx.showToast({
                title: '~网络加载失败~',
                duration: 3000,
                icon: 'none'
              });

              if (typeof fn === "function") {
                fn();
                return;
              }
            },

          });
        }

      },
      fail: () => {

        wx.hideLoading();
        wx.showToast({
          title: '~网络加载失败~',
          duration: 3000,
          icon: 'none'
        });

      }
    })

  },

  // 获取本地用户信息 ,fn函数是成功的回调
  getLocalUserInfo(fn) {
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userInfo"
    wx.getSetting({
      success: (res) => {

        // 没有授权
        if (!res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '/pages/auth/auth',
          });
          return;

        } else {

          // 已经授权了 必须是在用户已经授权的情况下调用
          wx.getUserInfo({
            success: (res) => {
              var userInfo = res.userInfo
              this.user.userInfo = userInfo;
              if (typeof fn === "function") {
                fn(this.user.userInfo);
              }
            }
          })


        }

      }
    });
  },

  // 小程序判断用户是否注册
  isUserReg(fn, bl, err) {

    var isOne = false;
    var errFn = null;
    if (arguments.length === 2 && typeof bl === "boolean") {
      isOne = bl;
    }
    if (arguments.length === 2 && typeof bl === "function") {
      errFn = bl;
    }

    if (arguments.length === 3) {
      isOne = bl||false;
      errFn = err;
    }

    if (this.isInit && !isOne) {
      if (typeof fn === "function") {
        fn(this.user);
        return;
      }
    }

    //  1.微信用户登录
    wx.login({

      success: (res) => {
        var code = res.code;
        if (code) {

          // console.log(code)
          // 2.发送请求 获取openid
          wx.request({
            method: 'POST',
            url: this.baseUrl + "sjbj/index.php/user/weixin/get_openid", //接口地址
            data: {
              code: res.code
            },
            success: (res) => {

              this.isInit = true;
              this.user.openid = res.data.openid;

              // 根据openid 
              wx.request({
                url: this.baseUrl + 'sjbj/index.php/user/user/getUser',
                method: "POST",
                data: {
                  openid_xcx: res.data.openid,

                },
                success: (res) => {
                  this.isInit = true;
                  if (res.data.status === 1) {
                    this.user.isLogin = true;
                    this.user.userInfo = res.data.data;
                    this.user.userid = res.data.data.user.id;

                  } else {
                    this.user.isLogin = false;
                    this.user.userInfo = {};

                  };

                  if (typeof fn === "function") {
                    fn(this.user);
                  }
                 // console.log("isUserReg:", this.user);

                },
                fail: (res) => {

                  this.isInit = false;
                  wx.hideLoading();
                  if (typeof errFn === "function") {
                    errFn(this.user);
                  }
                  return;
                },

              })

            },
            fail: () => {
              this.isInit = false;
              wx.hideLoading();
              if (typeof errFn === "function") {
                errFn(this.user);
              }
              return;
            },

          });
        }

      },
      fail: (res) => {

        this.isInit = false;
        wx.hideLoading();
        if (typeof errFn === "function") {
          errFn(this.user);
        }
        return;
      }
    })

  },


})