// pages/recommentSong/recommentSong.js
import request from '../../utils/request'
//消息订阅与发布的插件
import PubSub from 'pubsub-js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [],
    //标识点击音乐的下标
    index: 0
  },

  //获取用户每日推荐数据的方法
  async getRecommendList(){
    let recommendListData = await request('/recommend/songs');
    this.setData({
      recommendList : recommendListData.recommend
    })
  },

  //跳转至歌曲页面
  toSongDetail(event) {
    let {musicId, index} = event.currentTarget.dataset;
    this.setData({
       index
    });
    wx.navigateTo({
      url: `/pages/songDetail/songDetail?musicId=${JSON.stringify(musicId)}`,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    //更新日期状态
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })

    //获取用户数据
    this.getRecommendList();

    //订阅来自songDetail页面发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      let {recommendList, index} = this.data;
      if (type == 'pre') {
        //切换上一首歌曲
        (index == 0) && (index = recommendList.length);
        index -= 1;
      } else {
        //切换下一首歌曲
        (index == recommendList.length - 1) && (index = -1);
        index += 1;
      };
      //更新下标
      this.setData({
        index
      });
      let musicId = recommendList[index].id;
      //将音乐Id回传给songDateil页面
      PubSub.publish('musicId', musicId)
    })
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