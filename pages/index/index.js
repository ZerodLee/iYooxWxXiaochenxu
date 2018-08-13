//index.js
//获取应用实例
import { Http } from '../../utils/http'
import { url } from '../../utils/static/urls'

const util = require('../../utils/util.js')

const app = getApp()
const http = new Http()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    classes:[],
    classesIndex:0,
    selectedClass:'',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // http.getRequest(url.phoneInfo,{tel:'15623642771'}).then(res =>{
    //   console.log(res)
    // })
    let that = this
    http.postRequest(url.getClasses,{}).then(res =>{
      console.log('11',res)
      if(res.data.code > 0){
        let classes = res.data.data
        that.setData({
          classes:classes
        })
      }else{
        util.openAlert('网路请求异常！')
      }
    }).catch(res =>{
      console.log(res)
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  bindClassChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      classesIndex: e.detail.value
    })
  },
  getUserInfo: function(e) {
    console.log(e)

    var demo=this.data.motto

    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
