let isLoading = false
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function toast(msg = "成功", icon = "success") {
      wx.showToast({
            title: msg,
            icon: icon,
            duration: 2000
      })
}
function openAlert(content = "提示", callback) {
  wx.showModal({
    content: content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        if (callback){
          callback()
        }
      }
    }
  });
}
function openConfirm(title,content, success,cancel) {
  wx.showModal({
    title: title,
    content: content,
    confirmText: "确定",
    cancelText: "取消",
    success: function (res) {
      console.log(res);
      if (res.confirm) {
        if(success){
          success();
        }
        console.log('用户点击主操作')
      } else {
        if (cancel){
          cancel()
        }
        console.log('用户点击辅助操作')
      }
    }
  });
}
function showLoading(msg = '加载中..') {
      if (!isLoading) {
            wx.showLoading({
                  title: msg
            })
            isLoading = true
      }
}

function hideLoading() {
      if (isLoading) {
            wx.hideLoading()
            isLoading = false
      }
}
function myget(path, success) {
      var prefix=getApp().globalData.server.prefix
      // console.log(prefix)
      wx.showLoading({
            title: '加载中...',
      })
      wx.request({
            url: prefix+path,
            method: "GET",
            success: function (res) {
                  // console.log("wx ajax:", res)
                  success(res)
            },
            complete: function () {
                  wx.hideLoading()
            }
      })
}
function post_form(path, data, success) {
      var prefix = getApp().globalData.server.prefix
      // console.log(prefix)
      wx.showLoading({
            title: '加载中...',
      })
      wx.request({
            url: prefix+path,
            method: "POST",
            data: data,
            header: {
                  "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                  // console.log("wx ajax:", res)
                  success(res)
            },
            complete: function () {
                  wx.hideLoading()
            }
      })
}
function post_json(path, data, success,loading = true) {
      var prefix = getApp().globalData.server.prefix
      if(loading){
            wx.showLoading({
                  title: '加载中...',
            })
      }
      wx.request({
            url: prefix+path,
            method: "POST",
            data: JSON.stringify(data),
            header: {
                  "content-type": "application/json"
            },
            success: function (res) {
                  if(loading){
                        wx.hideLoading() 
                  }
                  // console.log("wx ajax:", res)
                  success(res)
            },
            complete: function () {
                  //wx.hideLoading()
            }
      })
}



function login(callback){
      // 登录
      wx.login({
            success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  console.log("login get code=:", res.code)

                  var app_id = this.globalData.config.app_id
                  var app_secret = this.globalData.config.app_secret

                  var prefix = this.globalData.server.prefix
                  var url = prefix + '/api/wechat/get_session_key?'
                  var params = "appid=" + app_id + "&secret=" + app_secret + "&js_code=" + res.code + "&grant_type=authorization_code";

                  wx.showLoading({
                        title: '登录中...',
                  })
                  wx.request({
                        url: url + params,
                        method: "GET",
                        success: function (res) {
                              console.log(res)
                              if (res.errMsg == "request:ok") {
                                    var obj = JSON.parse(res.data);
                                    wx.setStorageSync("session_key", obj.session_key)
                                    wx.setStorageSync("openid", obj.openid)
                              }
                        },
                        complete: function () {
                              wx.hideLoading()
                              callback()
                        }
                  })
            }
      })
}

function get_history(callback){
      var openid=wx.getStorageSync("openid")      
      console.log(openid)
      post_json("/api/JiaHua/get_history",{openid:openid},function(res){
            callback(res)
      });
}
function get_advice_products(dataObj,success){
      post_json("/api/jiahua/get_advice_products",dataObj,success);
}

module.exports = {
  formatTime,toast,openAlert,openConfirm,showLoading,hideLoading
}
