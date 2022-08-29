import request from '../../utils/request'
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },
  handl() {
  },

  //登录事件的回调
  async login() {
    let {phone, password} = this.data;
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'error'
      });
      return;
    };
    let phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式不对',
        icon: 'error'
      });
      return;
    };
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'error'
      })
    };

    //后端验证
    let result = await request('/login/cellphone', {phone, password, isLogin: true});
    if (result.code == 200) {
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
      
      //将用户信息存储到本地
      wx.setStorageSync('userInfo', JSON.stringify(result.profile));

      //登陆成功后跳转至个人中心页面
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    }else {
      wx.showToast({
        title: '登录失败',
        icon: 'error'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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