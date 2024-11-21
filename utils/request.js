import config from '../config'

const request = (options) => {
    return new Promise((resolve, reject) => {
        wx.request({
            ...options,
            url: `${config.baseURL}${options.url}`,
            header: {
                'content-type': 'application/json',
                'apiauth': config.apiauth,
                ...options.header
            },
            success: (res) => {
                if (res.data.code === 1000) {
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.message || '请求失败',
                        icon: 'none'
                    })
                    reject(res.data)
                }
            },
            fail: reject
        })
    })
}

export default request 