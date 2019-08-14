
// 单项加载
function getList(self, app, url, data, fn, refresh) {
  data.page = data.page <= 0 ? 1 : data.page;
 

  // 最后一页
  if (self.data.isloadEnd) {
    return;
  }

  // 不重复加载
  if (self.data.isLoadOne) {
    self.setData({
      isLoadOne: false
    });
  } else {
    return;
  }

  // 显示 正在加载
  self.setData({
    isShowLoading: true

  });
  //console.log(data);
  // ajax
  wx.request({
    url: app.baseUrl + url,
    data: data,
    method: 'POST',
    success(res) {
    //  console.log(res)
      var resData = res.data;
      // 不重复加载
      self.setData({
        isLoadOne: true
      });

      // 是否下拉刷新页面
      if (refresh) {
        // 停止下拉刷新
        wx.stopPullDownRefresh();
      }

      if (typeof resData==="object" &&resData.pagestutas == 0) {
        self.setData({
          isShowLoading: false,
          isRefresh: false,
          isloadEnd: true
        });

      } else {
        self.setData({
          isShowLoading: true
        });
      }

      var page = self.data.page + 1;
      self.setData({
        page: page
      });

      var list = resData.data;
     // console.log("list:",list)
      if (typeof fn === "function") {
        fn(list);
      }


    },
    header:{
      'content-type': 'application/json' // 默认值
    },
    fail() {
      // 停止下拉刷新
      wx.stopPullDownRefresh();
      self.setData({
        isLoadOne: true,
        isShowLoading: false,
        isRefresh: true,
        isloadEnd: false

      });

    }
  });

}

// 多项加载数据
function getTabList(tabVal, self, app, url, data, fn, refresh) {

  var tab = tabVal + ".";
  var tabObj = self.data[tabVal];
  //console.log(tabObj)
  tabObj.page = tabObj.page <= 0 ? 1 : tabObj.page;

  // 最后一页
  if (tabObj.isloadEnd) {
    return;
  }

  // 不重复加载
  if (tabObj.isLoadOne) {
    self.setData({
      [tab + "isLoadOne"]: false

    });
  } else {
    return;
  }

  // 显示 正在加载
  self.setData({
    [tab + "isShowLoading"]: true

  });

  // ajax
  wx.request({
    url: app.url + url,
    data: data,
    method: 'POST',
    success(res) {
      var resData = res.data;

      // console.log("res", res)
      //console.log("pagestutas", resData.pagestutas);
      // 不重复加载
      self.setData({
        [tab + "isLoadOne"]: true
      });

      // 是否下拉刷新页面
      if (refresh) {
        // 停止下拉刷新
        wx.stopPullDownRefresh();
      }


      if (resData.pagestutas == 0) {
        self.setData({
          [tab + "isShowLoading"]: false,
          [tab + "isRefresh"]: false,
          [tab + "isloadEnd"]: true
        });

      } else {
        self.setData({
          [tab + "isShowLoading"]: true
        });
      }

      var page = tabObj.page + 1;
      self.setData({
        [tab + "page"]: page
      });

      var list = resData.data;
      if (typeof fn === "function") {
        //console.log("list",list)
        fn(list);
      }

    },
    fail() {
      // 停止下拉刷新
      wx.stopPullDownRefresh();
      self.setData({
        [tab + "isLoadOne"]: true,
        [tab + "isShowLoading"]: false,
        [tab + "isRefresh"]: true,
        [tab + "isloadEnd"]: false

      });

    }
  });

}

function toDate(value, fmt) {
  fmt = typeof fmt !== "string" ? "yyyy-MM-dd HH:mm:ss" : fmt;
  var txts = value.toString().replace("/Date(", "").replace(")/", "");
  var times = Number(txts);
  times = isNaN(times) ? new Date(value).getTime() : times;
  var dt = new Date(Number(times.toString()));
  var o = {
    "M+": dt.getMonth() + 1,
    "d+": dt.getDate(),
    "H+": dt.getHours(),
    "m+": dt.getMinutes(),
    "s+": dt.getSeconds(),
    "q+": Math.floor((dt.getMonth() + 3) / 3),
    "S": dt.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    }
  }
  return fmt
};

const list = {

  // min value
  min: function(data) {
    data = data || [];
    if (data.constructor !== Array) {
      throw new Error("参数必须是个数组");
    }
    var _array_min = 0;
    var isOne = true;
    for (var i = 0; i < data.length; i++) {
      var _temp = 0;

      if (typeof data[i] !== "number") {

        //  is not a number
        var _num = Number(data[i]);
        _temp = isNaN(_num) ? 0 : _num;

      } else {

        //  is a number
        _temp = data[i];
      }

      if (isOne) {
        _array_min = _temp;
        isOne = false;

      } else {
        // set value number
        if (_temp < _array_min) {
          _array_min = _temp;
        }

      }

    }

    return _array_min;
  },

  // max value
  max: function(data) {
    data = data || [];
    if (data.constructor !== Array) {
      throw new Error("参数必须是个数组");
    }
    var _array_max = 0;

    var isOne = true;
    for (var i = 0; i < data.length; i++) {
      var _temp = 0;

      if (typeof data[i] !== "number") {

        //  is not a number
        var _num = Number(data[i]);
        _temp = isNaN(_num) ? 0 : _num;

      } else {

        //  is a number
        _temp = data[i];
      }

      if (isOne) {
        _array_max = _temp;
        isOne = false;

      } else {
        // set value number
        if (_temp > _array_max) {
          _array_max = _temp;
        }

      }

    }

    return _array_max;
  },

  // data where
  where: function(data, fn) {
    data = data || [];
    if (data.constructor !== Array) {
      throw new Error("第一个参数必须是个数组，第二是回调函数");
    }
    var _arrs = [];
    if (data.constructor === Array) {

      if (typeof fn !== "function") {
        return data;
      }
      for (var i = 0; i < data.length; i++) {

        if (fn(data[i])) {
          _arrs.push(data[i]);
        }

      }

    }

    return _arrs
  },

  // data map
  map: function(data, fn) {
    data = data || [];
    var arrs = [];
    if (data.constructor !== Array) {
      throw new Error("第一个参数必须是个数组，第二是回调函数");
    }

    if (data.constructor === Array) {

      if (typeof fn !== "function") {
        return data;
      }

      for (var i = 0; i < data.length; i++) {

        arrs[i] = fn(data[i]) || data[i];

      }

    }

    return arrs;

  },

  //  data first
  first: function(data) {
    data = data || [];
    if (data.constructor !== Array) {
      throw new Error("参数必须是个数组");
    }
    if (data.length > 0) {
      return data[0];
    } else {
      return null;
    }
  },

  //  data last
  last: function(data) {
    data = data || [];
    if (data.constructor !== Array) {
      throw new Error("参数必须是个数组");
    }
    if (data.length > 0) {
      return data[data.length - 1];
    } else {
      return null;
    }
  },

  //  data  slice
  slice: function(data, startIndex, endIndex) {
    data = data || [];

    if (data.constructor !== Array) {
      throw new Error("参数必须是个数组");
    }
    if (data.length > 0) {
      startIndex = typeof startIndex === "number" ? startIndex : 0;
      endIndex = typeof endIndex === "number" ? endIndex : 0;
      var _arrs = [];
      for (var i = startIndex; i < data.length; i++) {

        if (i < endIndex) {
          _arrs.push(data[i]);
        }

      }

      return _arrs;

    } else {
      return [];
    }
  },

  //  sort
  sort: function(data, fn) {
    data = data || [];

    if (data.constructor !== Array) {
      throw new Error("参数必须是个数组");
    }
    if (data.length > 0) {

      Array.prototype.sort.call(data, fn);

      return data;

    } else {
      return [];
    }
  },

  //  reverse
  reverse: function(data) {
    data = data || [];

    if (data.constructor !== Array) {
      throw new Error("参数必须是个数组");
    }
    if (data.length > 0) {

      Array.prototype.reverse.call(data);

      return data;

    } else {
      return [];
    }
  },

  //  sum
  sum: function(data) {
    data = data || [];

    if (data.constructor !== Array) {
      throw new Error("参数必须是个数组");
    }
    var _sum = 0;
    if (data.length > 0) {

      for (var i = 0; i < data.length; i++) {

        var _num = Number(data[i]);
        _num = isNaN(_num) ? 0 : _num;
        _sum = _sum + _num;

      }

      return _sum;

    } else {
      return 0;
    }
  },

  //  avg
  avg: function(data) {
    data = data || [];

    if (data.constructor !== Array) {
      throw new Error("参数必须是个数组");
    }
    var _sum = 0;
    if (data.length > 0) {

      for (var i = 0; i < data.length; i++) {

        var _num = Number(data[i]);
        _num = isNaN(_num) ? 0 : _num;
        _sum = _sum + _num;

      }

      return _sum / data.length;

    } else {
      return 0;
    }
  },

  //  splice
  splice: function(data, startIndex, endIndex) {
    data = data || [];

    if (data.constructor !== Array) {
      throw new Error("参数必须是个数组");
    }
    var _sum = 0;
    if (data.length > 0) {

      Array.prototype.splice.call(data, startIndex, endIndex);

      return data;

    } else {
      return [];
    }
  },

  //  not repeat
  notRepeat: function(data) {
    data = data || [];
    if (data.constructor !== Array) {
      throw new Error("参数必须是个数组");
    }

    if (data.length <= 0) {
      return [];
    }
    var temp = [];
    temp.push(data[0]);
    for (var i = 1; i < data.length; i++) {

      var test = data[i];
      var isOk = true;
      for (var y = 0; y < temp.length; y++) {

        var test2 = temp[y];
        if (test === test2) {

          isOk = false;
          break;
        }

      }

      if (isOk) {
        temp.push(test);
      }

    }

    return temp;

  },
  // index
  index: function(data, fn) {
    data = data || [];
    if (data.constructor !== Array) {
      throw new Error("参数必须是个数组");
    }

    if (data.length <= 0) {
      return [];
    }

    if (typeof fn === "function") {
      for (var i = 0; i < data.length; i++) {
        if (fn(data[i])) {
          return i;
        }
      }
    }
    return -1;

  }

}

function computerMonth(year, month) {

  var endMonth = 12,
    space = 4,
    arrs = [];

  var max = month + space;
  var m = month;
  var temp = 0;


  for (var i = month; i < max; i++) {
    var y = year;
    if (i <= endMonth) {
      m = i;
    } else {
      m = ++temp;
      y++;

    }
    var lastDate = createDateCount(y, m);
    var dateList = createDateList(y, m);

    arrs.push({
      y,
      m,
      lastDate,
      dateList

    });
  }
  //  console.log(arrs);

  return arrs;
}

function createDateCount(y, m) {
  var d = 1;
  switch (m) {
    case 1:
      d = 31;
      break;
    case 2:
      d = 30;
      if (y % 400 == 0 || (y % 4 == 0 && y % 100 != 0)) {
        //document.write(num + "是闰年。");
        d = 29;
      } else {
        //document.write(num + "是平年。");
        d = 28;
      }

      break;
    case 3:
      d = 31;
      break;
    case 4:
      d = 30;
      break;
    case 5:
      d = 31;
      break;
    case 6:
      d = 30;
      break;
    case 7:
      d = 31;
      break;
    case 8:
      d = 31;
      break;
    case 9:
      d = 30;
      break;
    case 10:
      d = 31;
      break;
    case 11:
      d = 30;
      break;
    case 12:
      d = 31;
      break;
  }

  return d;

}

// 创建天数
function createDateList(y, m) {
  var count = createDateCount(y, m);
  var list = [10, 20];
  list.push(count);
  return list;

}

module.exports = {
  getList,
  getTabList,
  toDate,
  list,
  computerMonth,
  createDateCount

}