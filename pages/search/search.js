// pages/search/search.js
import request from '../../utils/request'
let flage = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //placeholder的默认内容
    placeholderContent: '',
    //热搜榜数据
    hotList: [],
    //用户输入的表单项数据 
    searchContent: '',
    //s搜索返回是数据
    searchList: [],
    //历史记录
    historyList: []
  },

  //获取初始化数据的方法
  async getInitData() {
    let placeholderData = await request('/search/default')
    let hotListData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data
    })
  },
  //表单项内容发生改变的回调
  handleInputChange(event) {
    this.setData({
      searchContent: event.detail.value.trim()
    });
    //函数节流
    if (flage) {
      return
    };
    flage = true;
    this.getSearchList();
    setTimeout(() => {
      flage = false;
    }, 300);
  },
  //获取本地的历史记录
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory')
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },
  //获取搜索数据的功能函数
  async getSearchList() {
    if (!this.data.searchContent) {
      this.setData({
        searchList: []
      });
      return;
    }
    //发请求获取给剑宗模糊匹配
    let searchListData = await request('/search', {keywords: this.data.searchContent, limil: 10})
    this.setData({
      searchList: searchListData.result.songs
    });

    //将搜索的历史关键词添加到历史记录中
    let {historyList, searchContent} = this.data;
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent);
    this.setData({
      historyList
    });
    wx.setStorageSync('searchHistory', historyList)
  },
  //清空搜索内容
  clearSearchContent() {
    this.setData({
      searchContent: '',
      searchList: []
    })
  },
  //删除历史记录
  deleteHistory() {
    wx.showModal({
      content: '是否删除',
      success: (res) => {
        if (res.confirm) {
          this.setData({
          historyList: []
        });
          wx.removeStorageSync('searchHistory')
        }
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取初始化数据
    this.getInitData()
    //获取历史记录
    this.getSearchHistory()
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