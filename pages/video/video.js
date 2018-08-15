// pages/video/video.js
import { Http } from '../../utils/http'
import { url } from '../../utils/static/urls'

const polyv = require('../../utils/polyv.js')
const util = require('../../utils/util.js')
const http = new Http()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'',
    name:'',
    videoInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this

    let videoInfo = JSON.parse(options.videoInfo)
    console.log('videoInfo',videoInfo)
    that.setData({
      videoInfo:videoInfo
    })
    http.postRequest(url.getVideoUrl,{shipin_id:options.videoId,zhishidian_id:options.pointId}).then(res =>{
      console.log(res)

      if(!res.data.data.shipin_url){
        util.toast('视频获取失败！','none')
        return
      }
      let vid = res.data.data.shipin_url //"e8888b74d1bd0f19e821d6185279564a_e";
      // let vidObj = {
      //     vid: vid,
      //     callback: function(videoInfo){
      //       console.log('videoInfo',videoInfo)
      //         // that.setData({
      //         //   videoSrc: videoInfo.src[0]
      //         // });
      //     }
      // };
      // polyv.getVideo(vidObj);

      polyv.getVideo(vid, function(videoInfo){
      
        that.setData({
          video:{
            src:videoInfo.src[0]
          }
  
        });
      });
      that.setData({
        src:res.data.data.shipin_url,
        name:res.data.data.shipin_name
      })
    })
    // this.setData({
    //   src:options.id
    // })
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