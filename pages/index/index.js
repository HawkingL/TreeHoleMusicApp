// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],  //轮播图数据
    recommendList: [],  //推荐歌单
    topList: []  //排行榜数据
  },
  //跳转到每日推荐页面的回调
  toRecommendSong() {
    wx.navigateTo({
      url: '/pages/recommentSong/recommentSong',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    //获取轮播图数据
    let result1 = await request('/banner', {type: 2})
    this.setData({
      bannerList: result1.banners
    });
    //获取推荐歌单的数据
    let result2 = await request('/personalized', {limit: 10});
    this.setData({
      recommendList: result2.result
    });
    //获取排行榜数据
    let index = 0;
    let resultArr = [];
    while (index < 5) {
      let topListData = await request('/top/list', {idx: index++});
      let topListItem = {
        name: topListData.playlist.name,
        id: topListData.playlist.id,
        tracks: topListData.playlist.tracks.slice(0,3)
      };
      resultArr.push(topListItem);
      this.setData({
        topList: resultArr
      })
    };
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})