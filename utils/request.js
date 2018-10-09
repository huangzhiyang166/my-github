const Axios = require("../lib/axios.js");
const axios = Axios.create({
    // baseURL : "https://api.github.com",
    baseURL : "https://github.konsonx.com",
    timeout : 10 * 1000
});
axios.defaults.adapter = function (config) {
    return new Promise((resolve, reject) => {
        const params = config.params || {};
        wx.request({
            url : config.url,
            method : config.method,
            data : params,
            success : function(res){
                resolve(res);
            },
            fail : function(err){
                reject(err);
            }
        })
    })
}
const getAuth = () => {
    let headers = {}
    let auth = wx.getStorageSync('auth')
    if (auth === '') {
      headers = {
        'x-id': 0,
        'Authorization': ''
      }
    } else {
      let authObj = JSON.parse(auth)
      headers['x-id'] = authObj['oauth_id']
      headers['Authorization'] = authObj['hash_token']
    }
    return headers
}
axios.interceptors.request.use((request) => {
    request["headers"] = getAuth()
    wx.showNavigationBarLoading();
    return request
})
axios.interceptors.response.use((response) => {
    wx.hideNavigationBarLoading();
    return response.data
},(error) => {
    return error;
})


module.exports = axios;

// const REQ_OK = 1000
// const REQ_ERR = 1001
// const OAUTH_ERR = 1101
// const errorImg = '../static/images/error.png'
// const Fly = require("../lib/fly.js");
// const request = new Fly()
// request.config = {
//   baseURL: 'https://api.github.com'
// }

// function getAuth () {
//   let headers = {}
//   let auth = wx.getStorageSync('auth')
//   if (auth === '') {
//     headers = {
//       'x-id': 0,
//       'Authorization': ''
//     }
//   } else {
//     let authObj = JSON.parse(auth)
//     headers['x-id'] = authObj['oauth_id']
//     headers['Authorization'] = authObj['hash_token']
//   }
//   return headers
// }

// request.interceptors.request.use((request) => {
//   request.headers = getAuth()
//   wx.showNavigationBarLoading()
//   return request
// })

// request.interceptors.response.use(
//   (response, promise) => {
//     wx.hideNavigationBarLoading()
//     const code = response.data.code
//     if (code === REQ_ERR) {
//       wx.showToast({
//         title: '服务出错!',
//         icon: 'loading',
//         image: errorImg,
//         duration: 1200
//       })
//     } else if (code === REQ_OK) {
//       return promise.resolve(response.data.data)
//     } else if (code === OAUTH_ERR) {
//       wx.showToast({
//         title: '输入有误！',
//         icon: 'loading',
//         image: errorImg,
//         duration: 1200
//       })
//       return promise.resolve(response.data.data)
//     }
//   },
//   (err, promise) => {
//     wx.hideNavigationBarLoading()
//     wx.showToast({
//       title: err.message,
//       icon: 'none'
//     })
//     return promise.resolve()
//   }
// )

// module.exports = request
