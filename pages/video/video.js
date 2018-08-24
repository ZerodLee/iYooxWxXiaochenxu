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
    src:'http://vod.sunvke.com/13b5d2c9516244579dc12bacc4d69102/1816ec18b1294436a25e7a138116ca66-b52e5d6d40da2eda1f1a8efafffffe79-ld.mp4',
    name:'',
    vid:'',
    videoInfo:[],
    videoList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this

    let videoInfo = JSON.parse(options.videoInfo)
    let videoList = JSON.parse(options.videoList)
    console.log('videoInfo',videoInfo)
    let video = videoInfo.filter(item => item.Format == 'mp4')
    if(video[0]){
      that.setData({
        videoInfo:videoInfo,
        videoList:videoList,
        src:video[0]['PlayURL']
      })
    }else{
      util.openAlert('视频不存在！')
    }
    
    // http.postRequest(url.getVideoUrl,{shipin_id:options.shipin_id,zhishidian_id:options.zhishidian_id}).then(res =>{
    //   console.log(res)

    //   if(!res.data.data.shipin_url){
    //     util.toast('视频获取失败！','none')
    //     //return
    //   }
      //let vid = "e8888b74d1bd0f19e821d6185279564a_e" //;
      // let vid = res.data.data.shipin_url?res.data.data.shipin_url:"e8888b74d1bd0f19e821d6185279564a_e"
      // // let vidObj = {
      // //     vid: vid,
      // //     callback: function(videoInfo){
      // //       console.log('videoInfo',videoInfo)
      // //         // that.setData({
      // //         //   videoSrc: videoInfo.src[0]
      // //         // });
      // //     }
      // // };
      // // polyv.getVideo(vidObj);

      // polyv.getPreviewVideo(vid, function(videoInfo){
      //   console.log('videoInfo',videoInfo)
      //   that.setData({
      //     src:videoInfo.src[0]
      //     //src:videoInfo.teaser_url
      //   });
      // });
      // that.setData({
      //   src:res.data.data.shipin_url,
      //   name:res.data.data.shipin_name
      // })
    //})
    // this.setData({
    //   src:options.id
    // })
  },
  watchVideo(e){
    let that = this
    let item = e.currentTarget.dataset.item
    console.log(item)
    util.showLoading()
    //console.log('option',e.currentTarget.dataset.pointidx,this.data.chapterData)
    http.postRequest(url.getTimu,{shipin_id:item.shipin_id,zhishidian_id:item.zhishidian_id}).then(res =>{
      console.log(res)
      if(res.data.code == 1 && res.data.data.xiaochengxu_url){
        let videoInfo = res.data.data.xiaochengxu_url
        let video = videoInfo.filter(item => item.Format == 'mp4')
        if(video[0]){
          that.setData({
            videoInfo:videoInfo,
            src:video[0]['PlayURL']
          })
        }else{
          util.openAlert('视频不存在！')
        }
      }else{
        util.toast('暂无视频！','none')
      }
    }).finally(res =>{
      util.hideLoading()
    }).catch(res =>{
      util.hideLoading()
      util.openAlert('网络异常！')
    })
    // if(item.sort == 1){
    //   if(this.data.vid != item.shipin_id){
    //     //切换视频
    //   }
    // }else{
    //   util.toast('想了解更多，请下载尚课啦app~','none')
    //   return
    // }
  },
  doWork(e){
    console.log(e)
    let item = e.currentTarget.dataset.item
    util.showLoading()
    http.postRequest(url.getTimu,{shipin_id:item.shipin_id,zhishidian_id:item.zhishidian_id}).then(res =>{
      console.log(res)
      if(res.data.code == 1){
        wx.navigateTo({
          url:'../questions/questions?shipin_id=' + item.shipin_id + '&zhishidian_id=' + item.zhishidian_id
        })
      }else{
        util.openAlert(res.data.msg,function(){
          console.log('好的')
        })
      }
    }).finally(res =>{
      util.hideLoading()
    }).catch(res =>{
      util.hideLoading()
      util.openAlert('网络异常！')
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