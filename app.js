App({
      onLaunch: function () {
            // 展示本地存储能力
            //var logs = wx.getStorageSync('logs') || []
            //logs.unshift(Date.now())
            //wx.setStorageSync('logs', logs)

            var openid = wx.getStorageSync("openid")
            // console.log(openid)
            if (openid) {
                  console.log("openid=", wx.getStorageSync("openid"))
                  console.log("session_key=", wx.getStorageSync("session_key"))
            }
            else {
                  //登录
                  wx.login({
                        success: res => {
                              // 发送 res.code 到后台换取 openId, sessionKey, unionId
                              console.log("login get code=:", res.code)

                              var app_id = this.globalData.config.app_id
                              var app_secret = this.globalData.config.app_secret

                              var prefix=this.globalData.server.prefix
                              // console.log("on launch ",prefix)
                              // return
                              var url = prefix+'/api/JiaZhang/auth_weixin_certificate'
                              var params = "?appid=" + app_id + "&secret=" + app_secret + "&js_code=" + res.code + "&grant_type=authorization_code";                              

                              wx.showLoading({
                                    title: '登录中...',
                              })
                              wx.request({
                                    url: url,//+params
                                    method: "POST",
                                    data:{app_id:app_id,app_secret:app_secret,code:res.code},
                                    success: function (res) {
                                          console.log(res)
                                          if (res.errMsg == "request:ok") {
                                                var obj = res.data//JSON.parse(res.data);
                                                wx.setStorageSync("session_key", obj.session_key)
                                                wx.setStorageSync("openid", obj.openid)
                                                console.log('openid',obj.openid)
                                          }
                                    },
                                    complete: function () {
                                          wx.hideLoading()
                                    }
                              })

                        }
                  })
            }

            // 获取用户信息 代码必须写在这里！！！ 还有一个地方是哪个页面需要用户信息，哪个页面再去调用！
            wx.getSetting({
                  success: res => {
                        console.log(res)
                        if (res.authSetting['scope.userInfo']) {
                              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                              wx.getUserInfo({
                                    success: res => {
                                          // 可以将 res 发送给后台解码出 unionId
                                          console.log("app.js getUserInfo")
                                          this.globalData.userInfo = res.userInfo
                                          console.log(res.userInfo)

                                          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                          // 所以此处加入 callback 以防止这种情况
                                          if (this.userInfoReadyCallback) {
                                                this.userInfoReadyCallback(res)
                                          }
                                    }
                              })
                        }
                  }
            })

      },
      globalData: {
            userInfo: null,
            config: {
                  app_id: "wx002e7118463df11c",
                  app_secret: "0f1e6281728fbc42c954901e5fb15927",
                  
            },
            server:{
                  prefix:"https://www.sunvke.com"
              // prefix: "https://www.xuansheng123.com"
            }
      }
})