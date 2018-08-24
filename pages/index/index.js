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
    isLoading:false,

    specialList:[],
    specialIndex:0,

    classes:[],
    classesIndex:0,
    selectedClass:{},
    subjects:[],
    subjectIndex:0,
    selectedSubject:{},
    textbooks:[],
    textbookIndex:0,
    selectedTextbook:{},
    chapters:[],
    chapterIndex:0,
    selectedChapter:{},
    points:[],
    pointIndex:0,
    selectedPoint:'',

    chapterData:[],
    openIndex:''
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
    that.showLoading()

    // wx.request({
    //   url: "https://www.sunvke.com/api/zhishidian/index_load",
    //   method: "POST",
    //   data: null,
    //   header: {
    //     "content-type": "application/json"
    //   },
    //   success: function (res) {
    //     // console.log(res)
    //     wx.hideLoading()
    //     // console.log("wx ajax:", res)

    //   if(res.data.code > 0){
    //     let classes = res.data.data
    //     console.log('年级和科目',classes)
    //     that.setData({
    //       classes:classes,
    //       // selectedClass:classes[that.data.classesIndex],
    //       // subjects:classes[that.data.classesIndex].kemuArr,
    //       // selectedSubject:classes[that.data.classesIndex].kemuArr[that.data.subjectIndex]
    //     })
    //     let target = {
    //       classesIndex:0
    //     }
    //     that.bindClassChange({},target)
    //   }else{
    //     util.openAlert('网路请求异常！')
    //   }

    //   },
    //   complete: function () {
    //     //wx.hideLoading()
    //   }
    // })

    http.postRequest(url.getClasses,{}).then(res =>{
      if(res.data.code > 0){
        let classes = res.data.data
        console.log('年级和科目',classes)
        that.setData({
          classes:classes,
          // selectedClass:classes[that.data.classesIndex],
          // subjects:classes[that.data.classesIndex].kemuArr,
          // selectedSubject:classes[that.data.classesIndex].kemuArr[that.data.subjectIndex]
        })
        let target = {
          classesIndex:0
        }
        that.bindClassChange({},target)
      }else{
        util.openAlert('网路请求异常！')
      }

    }).catch(res =>{
      console.log('error',res)
      that.hideLoading()
    }).finally(() =>{
      that.hideLoading()
    })


    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  bindClassChange: function(e,target) {
    let that = this
    that.showLoading()
    
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    let classesIndex
    if(target){
      classesIndex = target.classesIndex
    }else{
      classesIndex = e.detail.value
    }
    console.log('年级改变', classesIndex)
    //修改年级选择 刷新科目数据
    this.setData({
      selectedClass:this.data.classes[classesIndex],
      classesIndex: classesIndex,
      subjects:this.data.classes[classesIndex].kemuArr,
    })
    //给科目的联动值
    let theTarget = {
      subject:this.data.classes[classesIndex].kemuArr[0],
      class:this.data.classes[classesIndex]
    }
    this.changeSubject({},theTarget)
  },
  changeSubject(e,target){
    console.log(e,target)

    let that = this
    that.showLoading()
    
    let kemu_id,subjectIndex
    let grade_id = that.data.selectedClass.grade_id
    let detail_id = that.data.selectedClass.grade_detail_id
    //分别给直接选择科目 或者 重置科目赋值
    if(target){
      console.log(target)
      kemu_id = target.subject.kemu_id
      subjectIndex = 0
    }else{
      kemu_id = e.currentTarget.dataset.id
      subjectIndex = e.currentTarget.dataset.index
    }
    console.log('科目改变', subjectIndex)
    this.setData({
      subjectIndex:subjectIndex,
      selectedSubject:that.data.subjects[subjectIndex]
    })
    //去请求科目下的教材，章节，知识点 的数据
    http.postRequest(that.getPointsUrl(kemu_id),{grade_id:grade_id,grade_detail_id:detail_id,kemu_id:kemu_id}).then(res =>{
      console.log('科目选择',res)
      if(res.data.code > 0){
        if(kemu_id == 6 || kemu_id == 7){
          // let specialList = res.data.data
          // specialList.map((item,idx) =>{
          //   if(idx == 0){
          //     item.active = 'active'
          //   }else{
          //     item.active = ''
          //   }
          //   return item
          // })
          // that.setData({
          //   specialList:specialList,
          //   specialIndex:0
          // })
          let theTarget = {
            specialList:res.data.data,
            specialIndex:0
          }
          that.specialChange({},theTarget)
          return
        }else{
          that.setData({
            specialList:[]
          })
        }
        let textbooks = res.data.data
        //刷新教材的数据
        that.setData({
          textbooks:textbooks,
          textbookIndex:0,
          selectedTextbook:textbooks[0]
        })
        let theTarget = {
          textbookIndex:0
        }
        that.bindTextbookChange({},theTarget)
      }else{
        util.openAlert('网路请求异常！')
      }
    }).catch(res =>{
      console.log('error',res)
      that.hideLoading()
    })
  },
  bindTextbookChange(e,target){
    console.log(e,target)
    let that = this
    that.showLoading()
    
    let textbookIndex
    if(target){
      textbookIndex = target.textbookIndex
    }else{
      textbookIndex = e.detail.value
    }
    this.setData({
      textbookIndex:textbookIndex,
      selectedTextbook:that.data.textbooks[textbookIndex],
      chapters:that.data.textbooks[textbookIndex].zhangjielist
    })
    let theTarget = {
      chapterIndex:0
    }
    that.bindChapterChange({},theTarget)
  },
  bindChapterChange(e,target){
    //console.log(e,target)
    let that = this
    that.showLoading()

    let chapterIndex
    if(target){
      chapterIndex = target.chapterIndex
    }else{
      chapterIndex = e.detail.value
    }
    this.setData({
      chapterIndex:chapterIndex,
      selectedChapter:that.data.chapters[chapterIndex],
      points:that.data.chapters[chapterIndex].zhishidianArr
    })
    let theTarget = {
      pointIndex:0
    }
    that.bindPointChange({},theTarget)
  },
  bindPointChange(e,target){
    
    //console.log(e,target)
    let that = this
    that.showLoading()
    let pointIndex
    if(target){
      pointIndex = target.pointIndex
    }else{
      pointIndex = e.detail.value
    }
    console.log('zhishidian',that.data.points)
    this.setData({
      pointIndex:pointIndex,
      selectedPoint:that.data.points[pointIndex]
    })
    let params = {
      grade_id:that.data.selectedClass.grade_id,
      kemu_id:that.data.selectedSubject.kemu_id,
      jiaocai_id:that.data.selectedTextbook.jiaocai_id,
      grade_detail_id:that.data.selectedClass.grade_detail_id,
      zhangjie_id:that.data.selectedChapter.zhangjie_id,
      //zhishidian:that.data.selectedPoint,
      zhishidian:'',
      page_index:1
    }
    console.log('参数',params)
    //return
    http.postRequest(url.getvideo,params).then(res =>{
      console.log('数据',res)
      if(res.data.code>0){
        let chapterData = res.data.data
        for(let item of chapterData[0]['zhishidian']){
          console.log('1',item)
          for(let thePoint of item.shipinlist){
            if(thePoint.sort<4){
              thePoint.showVideo = true
            }else{
              break
            }
          }
        }
        that.setData({
          chapterData:chapterData
        })
      }
      
    }).catch(res =>{
      console.log('error',res)
      that.hideLoading()
    }).finally(() =>{
      that.hideLoading()
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
  },
  specialChange(e,target){
    console.log(e)
    let specialIndex,specialList
    if(target){
      specialIndex = target.specialIndex
      specialList = target.specialList
    }else{
      specialIndex = e.currentTarget.dataset.index
      specialList = this.data.specialList
    }
    specialList.map((item,idx) =>{
      if(idx == specialIndex){
        item.active = 'active'
      }else{
        item.active = ''
      }
      return item
    })
    let theChapterData = specialList[specialIndex].zhangjie
    // console.log(theChapterData)
    // return
    this.setData({
      specialList:specialList,
      specialIndex:specialIndex,
      chapterData:theChapterData
    })
    console.log(this.data.chapterData)
    this.hideLoading()
  },
  // specialUpdateData(chapterData){
  //   for(let chapter of chapterData){
  //     for(let point of chapter.zhishidian){

  //     }
  //   }
  // },

  goToVideo(e){
    let that = this
    let item = e.currentTarget.dataset.item
    //console.log(item)
    console.log('option',e.currentTarget.dataset.pointidx,this.data.chapterData)

    util.showLoading()
    http.postRequest(url.getTimu,{shipin_id:item.shipin_id,zhishidian_id:item.zhishidian_id}).then(res =>{
      console.log(res)
      util.hideLoading()
      if(res.data.code == 1 && res.data.data.xiaochengxu_url){
        let videoInfo = res.data.data.xiaochengxu_url
        let josndata = JSON.stringify(that.data.chapterData[e.currentTarget.dataset.chapterindex]['zhishidian'][e.currentTarget.dataset.pointindex])
      
        wx.navigateTo({
          url:'../video/video?shipin_id=' + item.shipin_id + '&zhishidian_id=' + item.zhishidian_id + '&videoInfo=' + JSON.stringify(videoInfo) + '&videoList=' +josndata
        })
      }else if(res.data.code == -4){
        util.toast(res.data.msg,'none')
      }else{
        util.toast('暂无视频！','none')
      }
    }).catch(res =>{
      util.hideLoading()
      util.openAlert('网络异常！')
    })

    // if(item.sort == 1){
    //   let josndata = JSON.stringify(this.data.chapterData[e.currentTarget.dataset.chapterindex]['zhishidian'][e.currentTarget.dataset.pointindex])
    //   wx.navigateTo({
    //     url:'../video/video?videoId=' + item.shipin_id + '&pointId=' + item.zhishidian_id + '&videoInfo=' + josndata
    //   })
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
      util.hideLoading()
      if(res.data.code == 1){
        wx.navigateTo({
          url:'../questions/questions?shipin_id=' + item.shipin_id + '&zhishidian_id=' + item.zhishidian_id
        })
      }else{
        util.openAlert(res.data.msg,function(){
          console.log('好的')
        })
      }
    }).catch(res =>{
      util.hideLoading()
      util.openAlert('网络异常！')
    })
  },
  switchShow(e){
    //console.log(e)
    let chapterIndex = e.currentTarget.dataset.chapterindex
    let pointIndex = e.currentTarget.dataset.pointindex
    let showItem = this.data.chapterData[chapterIndex].zhishidian[pointIndex]
    let showIndex = 'chapterData[' + chapterIndex + '].zhishidian[' + pointIndex + '].show'
    console.log(showIndex)
    if(this.data.openIndex){
      this.setData({
        openIndex:showIndex,
        [this.data.openIndex]:showItem.show?true:false,
        [showIndex]:showItem.show?false:true,
      })
    }else{
      this.setData({
        openIndex:showIndex,
        //[this.data.openIndex]:showItem.show?false:true,
        [showIndex]:showItem.show?false:true,
      })
    }
  },

  getPointsUrl(id){
    let theurl
    switch(id){
      case 6:
        theurl =  url.getGuoxue
        break
      case 7:
        theurl =  url.getYishu
        break
      default:
        theurl = url.getPoints
    }
    return theurl
  },
  showLoading(msg = '加载中..'){
    if(!this.data.isLoading){
      wx.showLoading({
        title:msg
      })
      this.setData({
        isLoading:true
      })
    }
  },
  hideLoading(){
    if(this.data.isLoading){
      wx.hideLoading()
      this.setData({
        isLoading:false
      })
    }
  },
})
