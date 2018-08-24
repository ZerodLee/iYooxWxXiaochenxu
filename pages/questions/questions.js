// pages/questions/questions.js
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
    autoplay: false,
    interval: 5000,
    duration: 300,
    questions:[{},{}],
    shipin_id:0,
    zhishidian_id:0,
    currentIndex:0,
    pointName:'',
    percentage:0,
    answers:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    util.showLoading()
    http.postRequest(url.getTimu,{shipin_id:options.shipin_id,zhishidian_id:options.zhishidian_id}).then(res => {
      console.log(res)
      if(res.data.code != 1){
        util.openAlert(res.data.msg,function(){
          wx.navigateBack()
          return false
        })
      }
      let questionInfo = res.data.data
      let _questions = questionInfo.timu_list
      let answers = that.data.answers
      _questions.forEach((timu,idx) =>{
        //console.log(idx)
        // timu.fenxi = timu.fenxi?that.delHtmlTag(timu.fenxi):''
        // timu.jiexi = timu.jiexi?that.delHtmlTag(timu.jiexi):''
        timu.options = []
        for (const key in timu.option_One) {
          let option = timu.option_One[key]
          if(option){
            //timu.option_One[key] = option=  that.delHtmlTag(option)
            timu.options.push({key:key.toLocaleUpperCase(),option:option})
          }else{
            delete timu.option_One[key]
          }
        }
        answers.push({id:timu.timu_id,answer:timu.daan})
      })
      console.log(_questions)
      // for(let timu of _questions){
      //   timu.fenxi = that.delHtmlTag(timu.fenxi)
      // }
      that.setData({
        pointName:questionInfo.shipin_name,
        percentage:parseInt(1/questionInfo.timu_list.length*100),
        questions:_questions,
        answers:answers
      })
      util.hideLoading()
    }).catch(res =>{
      util.hideLoading()
      util.toast(res,'none')
    })
    // setInterval(function(){
    //   that.setData({
    //     width:(that.data.width>90?that.data.width:that.data.width+10)
    //   })
    // },1000)
  },
  swiperChange(e,target){
    console.log(e)
    let that = this
    let index;
    if(target){
      index = target.index
    }else{
      index = e.detail.current
    }
    let percentage = parseInt((index+1)/that.data.questions.length*100)
    that.setData({
      currentIndex:index,
      percentage:percentage
    })
  },
  selectOption(e){
    let that = this
    let timu = this.data.questions[this.data.currentIndex]
    if(timu.selected){
      return false
    }
    let answer = timu['daan']
    let selected = e.currentTarget.dataset.key
    // let result = ''
    // result = (answer == selected)?'right':'wrong'
    let theSelected = 'questions['+ (this.data.currentIndex) +'].selected'
    let theOption = 'questions['+ (this.data.currentIndex) +'].options['+ e.currentTarget.dataset.index +'].result'
    let theId = timu.timu_id
    let theAnswer = that.data.answers
    for (var item of theAnswer) {
      if (item.id == theId){
        item.selected = selected
        break;
      }
    }
    this.setData({
      [theSelected]:selected,
      [theOption]:'right',
      answers:theAnswer
    })
    console.log(that.data.answers)
    if(this.data.currentIndex+1 == this.data.questions.length){
      return false
    }
    setTimeout(() => {
      that.swiperChange({},{index:that.data.currentIndex+1})
    }, 500);
    
  },
  submit(e){
    let that = this
    let answerLength = 0
    for(let item of this.data.answers){
      if(!item.selected){
        util.openConfirm('提示','您还有未完成的题目，确认提交吗？',function(){
          that.goReport()
        })
        break;
      }else{
        answerLength++
      }
    }
    if(answerLength == this.data.questions.length){
      that.goReport()
    }
    
  },

  goReport(e){
    wx.navigateTo({
      url: '../report/report?data=' + JSON.stringify(this.data.answers)
    })
  },
  delHtmlTag(str){
    return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
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