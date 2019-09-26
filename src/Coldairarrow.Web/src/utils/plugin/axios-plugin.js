import axios from 'axios'

const rootUrl = 'http://localhost:40000'
const timeout = 5000

export const Axios = axios.create({
    baseURL: rootUrl,
    timeout: timeout
})

// 在发送请求之前做某件事
Axios.interceptors.request.use(config => {
    // 设置以 form 表单的形式提交参数，如果以 JSON 的形式提交表单，可忽略
    // if (config.method === 'post') {
    //     // JSON 转换为 FormData
    //     const formData = new FormData()
    //     Object.keys(config.data).forEach(key => formData.append(key, config.data[key]))
    //     config.data = formData
    // }

    //携带token
    if (localStorage.token) {
        config.headers.Authorization = 'Bearer ' + localStorage.token
    }
    return config
}, error => {
    return Promise.reject(error)
})

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(res => {
    //授权失败
    if (!res.data.Success && res.data.ErrorCode == 401) {
        localStorage.removeItem('token')
        location.href = '/'
    }

    return res.data
}, error => {
    let errorMsg = ''
    if (error.message.includes('timeout')) {
        errorMsg = '请求超时!'
    } else {
        errorMsg = '请求异常!'
    }
    return Promise.resolve({ Success: false, Msg: errorMsg })
})

export default {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$http', { value: Axios })
    }
}