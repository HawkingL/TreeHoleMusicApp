// pages/personal/personal.js
import request from '../../utils/request'

let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransfrom: 0,
    coverTransition: '',
    userInfo: {},  //用户信息
    recentPlayList: []   //用户播放记录
  },

  //下拉更新特效
  handleTouchStart (event) {
    this.setData({
      coverTransition: ''
    })
    startY = event.touches[0].clientY;
  },
  handleTouchMove (event) {
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance >= 80) {
      moveDistance = 80;
    }
    this.setData({
      coverTransfrom: moveDistance
    })
  },
  handleTouchEnd () {
    this.setData({
      coverTransfrom: 0,
      coverTransition: 'transform .5s linear'
    })
  },

  //跳转至登录页面
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  //获取用户播放记录
  async getUserRecentPlayList(userId) {
    let recentPlayListData = await request('/user/record', {uid: userId, type: 1})
    let index = 0;
    this.setData({
      recentPlayList: recentPlayListData.weekData.splice(0, 10).map(item => {
        item.id = index;
        return item;
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取用户基本信息
    let userInfo = wx.getStorageSync('userInfo');
    //判断用户是否登录
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      this.setData({
        userInfo
      });

      //获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId);
    }
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