// pages/home2/home2.js
var util=require("../../utils/util.js")
const app=getApp()
Page({

      /**
       * 页面的初始数据
       */
      data: {
            banner:{
                  title:'001',
                  src:'../../asset/img/banner.png',
                  mode:'widthFix'
            },
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {

      },
      goAbout: function (event) {
        wx.navigateTo({
          url: '../about/about'
        })
      },
      goProduct:function(event){
            wx.navigateTo({
              url: '../product/product'
            })
      },
      goCourse:function(event){
            wx.navigateTo({
              url: '../zeren/zeren'
            })
      },
      goCertification:function(event){
            wx.navigateTo({
              url: '../rongyu/rongyu'
            })
      },
      goKeqian:function(event){
            wx.navigateTo({
              url: '../keqian/keqian'
            })
      },
      goKehou:function(event){
            wx.navigateTo({
              url: '../kehou/kehou'
            })
      },
      goLearn:function(event){
            wx.navigateTo({
              url: '../xuexi/xuexi'
            })
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