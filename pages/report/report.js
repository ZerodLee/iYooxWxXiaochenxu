// pages/report/report.js
import { Http } from '../../utils/http'
import { url } from '../../utils/static/urls'

const util = require('../../utils/util.js')

const app = getApp()
const http = new Http()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options.data){
      util.openAlert('当前无数据！',function(){
        wx.navigateBack()
      })
    }
    let data = JSON.parse(options.data)
    data.forEach((item,index) => {
      //console.log(item,index)
      item.index = index
      if(item.selected){
        item.result = (item.answer == item.selected)?'right':'wrong'
      }else{
        item.result = ''
      }
      
    });
    console.log(data)
    this.setData({
      data:data
    })
  },
  check(e){
    util.openAlert('查看更多请下载尚课啦app~')
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
  
  }
})