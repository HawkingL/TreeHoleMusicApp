// pages/songDetail/songDetail.js
import request from '../../utils/request'
//消息订阅与发布的插件
import PubSub from 'pubsub-js'
//处理时间的插件
import moment from 'moment'

//获取全局实例
const appInstance = getApp()


Page({
  data: {
    //控制动画是否播放
    isPlay: false,
    song: {},
    //音乐的链接
    musicUrl: '',
    //实时时长
    currentTime: '00:00',
    //总时长
    durationTime: '00:00',
    //实时进度条的宽度
    currentWidth: 0
  },
  //点击音乐播放按钮的回调
  handlerMusicPlay() {
    let isPlay = !this.data.isPlay;
    /* this.setData({
      isPlay
    }); */
    let musicId = this.data.song.id;
    let musicUrl = this.data.musicUrl;
    this.musicControl(isPlay, musicId, musicUrl);
  },
  //控制音乐暂停与播放的功能函数
  async musicControl(isPlay, musicId, musicUrl) {
    if (isPlay) {
      //根据是否有音乐链接判断是否需要重新发起获取链接请求
      if (!musicUrl) {
        //获取歌曲的播放url
        let musicUrlData = await request('/song/url', {id: musicId})
        let musicUrl = musicUrlData.data[0].url;
        //将音乐链接保存到数据中
        this.setData({
          musicUrl
        });
      }

      //播放音乐的地址
      this.backgroundAudioManager.src = this.data.musicUrl;
      this.backgroundAudioManager.title = this.data.song.name;
    } else {
      //暂停播放
      this.backgroundAudioManager.pause()
    }
  },
  //获取音乐详情的回调函数
  async getMusicInfo(musicId) {
    let songData = await request('/song/detail/', {ids: musicId});
    let durationTime = moment(songData.songs[0].dt).format('mm:ss');

    this.setData({
      song: songData.songs[0],
      durationTime
    })
    //动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },
  //修改播放状态的路由函数
  changePlayState(isPlay) {
    //修改音乐播放状态
    this.setData({
      isPlay
    });
    //修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  //点击切换歌曲
  handleSwitch(event) {
    let type = event.currentTarget.id;
    //首先关闭当前播放的背景音频
    this.backgroundAudioManager.stop();
    //订阅来自recommendSong页面发布的消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      //获取音乐详情信息
      this.getMusicInfo(musicId);
      //根据详情信息切换歌曲
      this.musicControl(true,musicId)
      //取消订阅
      PubSub.unsubscribe('musicId');
    })
    //发布数据给recommendSong页面
    PubSub.publish('switchType', type)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //options为路由跳转时传过来的参数
    let musicId = options.musicId;
    this.getMusicInfo(musicId);

    //判断当前页面是否有音乐在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId == musicId) {
      //修改当前播放音乐的状态
      this.setData({
        isPlay: true
      })
    };

    
    //创建播放音乐的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    //监听全局背景音乐的播放与暂停（无论在哪里点击播放或暂停都会监听到的）
    this.backgroundAudioManager.onPlay(() => {
      //修改音乐播放状态
      this.changePlayState(true);
      //修改全局音乐播放的状态
      appInstance.globalData.musicId = musicId;
    });
    this.backgroundAudioManager.onPause(() => {
      //修改音乐播放状态
      this.changePlayState(false);
    });
    //监听背景音乐的后台停止事件
    this.backgroundAudioManager.onStop(() => {
      //修改音乐播放状态
      this.changePlayState(false);
    });
    //监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(() => {
      //自动切换至下一首音乐并且自动播放
      PubSub.subscribe('musicId', (msg, musicId) => {
        //获取音乐详情信息
        this.getMusicInfo(musicId);
        //根据详情信息切换歌曲
        this.musicControl(true,musicId)
        //取消订阅
        PubSub.unsubscribe('musicId');
      })
      PubSub.publish('switchType', 'next');
      //初始化进度条播放时间
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      });
    });
    //监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      //实时播放时长的显示设置
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
      //实时播放进度条的显示设置
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
      this.setData({
        currentTime,
        currentWidth
      });
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