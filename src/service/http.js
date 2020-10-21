/* eslint-disable camelcase */
/* eslint-disable no-self-assign */
/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import qs from 'qs'
import $ from 'jquery'
import md5 from 'js-md5'
import axios from 'axios'
import {Message} from 'element-ui'
import store from '@/store/index.js'
import router from '@/router/index.js'
import bus from '@c/bus'
import i18n from '@i/i18n'
// import login from './api/login'

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
let Timeout = null
const tip = data => {
    if (Timeout) {
        clearTimeout(Timeout)
    }
    Timeout = setTimeout(() => {
        Message({
            message: data.msg,
            showClose: true,
            type: data.type
        })
    }, 1000)
}
/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
    if (status === 302) {
        tip({
            msg: 'リダイレクト(302)',
            type: 'warning'
        })
    } else if (status >= 400 && status < 500) {
        switch (status) {
            case 401: // 登录失效
                break
            case 404: // 資源が見つからない
                if (router.app._route.path !== '/404') {
                    router.replace({
                        path: '/404',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    })
                }
                break
            default:
                if (router.app._route.path !== '/4xx') {
                    router.replace({
                        path: '/4xx',
                        query: {
                            redirect: router.currentRoute.fullPath,
                            status
                        }
                    })
                }

        }
    } else if (status >= 500 && status < 600) {
        switch (status) {
            case 500:
                bus.$emit('errorDialog', `
                    <p style="min-width: 488px;font-size: 0.875rem;font-family: 'Yu Gothic';">
                        予期せぬエラーが発生しております。(500)<br />
                        大変申し訳ございませんが、CheXサポートセンター<br />
                        (Mail:<span style="color: #0000FF;">chex@ysl.co.jp</span>)までご連絡ください。
                    </p>
                `)
                break
            case 502:
                bus.$emit('errorDialog', `
                    <p style="min-width: 488px;font-size: 0.875rem;font-family: 'Yu Gothic';">
                        予期せぬエラーが発生しております。(502)<br />
                        大変申し訳ございませんが、CheXサポートセンター<br />
                        (Mail:<span style="color: #0000FF;">chex@ysl.co.jp</span>)までご連絡ください。
                    </p>
                `)
                break
            case 503: // 内部错误
                bus.$emit('errorDialog', `
                    <p style="min-width: 488px;font-size: 0.875rem;font-family: 'Yu Gothic';">
                        サーバ混雑のため処理を行うことができません。(503)<br />
                        大変申し訳ございませんが、しばらく時間をおいた後、再度お試しください<br />
                        解消しない場合は、CheXサポートセンター(Mail:<span style="color: #0000FF;">chex@ysl.co.jp</span>)までお問い合わせ下さい。
                    </p>
                `)
                break
            case 504:
                bus.$emit('errorDialog', `
                    <p style="min-width: 488px;font-size: 0.875rem;font-family: 'Yu Gothic';">
                        サーバ混雑のため処理を行うことができません。(504)<br />
                        大変申し訳ございませんが、しばらく時間をおいた後、再度お試しください<br />
                        解消しない場合は、CheXサポートセンター(Mail:<span style="color: #0000FF;">chex@ysl.co.jp</span>)までお問い合わせ下さい。
                    </p>
                `)
                break
            case 505:
                bus.$emit('errorDialog', `
                    <p style="min-width: 488px;font-size: 0.875rem;font-family: 'Yu Gothic';">
                        お使いのHTTPバージョンはサポートしておりません。(505 )<br />
                        WEBブラウザを最新バージョンにアップデートした後、再度お試しください<br />
                        解消しない場合は、CheXサポートセンター(Mail:<span style="color: #0000FF;">chex@ysl.co.jp</span>)までお問い合わせ下さい。
                    </p>
                `)
                break
            default:
                bus.$emit('errorDialog', `
                    <p style="min-width: 488px;font-size: 0.875rem;font-family: 'Yu Gothic';">
                        予期せぬエラーが発生しております。(${status})<br />
                        大変申し訳ございませんが、CheXサポートセンター<br />
                        (Mail:<span style="color: #0000FF;">chex@ysl.co.jp</span>)までご連絡ください。
                    </p>
                `)
        }
    } else { // 其他错误，直接抛出错误提示
        tip({
            msg: `接続エラー(${other}, ${status})`,
            type: 'error'
        })
    }
}

/*
 *@description: 添加 COMMONPARAMETERS 中的 Signature 参数,并返回GET请求所需的公共参数
 *@functionName: COMMON_PARAMETERS js
 *@params1: Body 加密字符串
 *@author: zl
 *@date: 2019-11-18 09:27:58
 *@version: V1.0.0
 */
function COMMON_PARAMETERS (Body) {
    const time = new Date().getTime()
    const COMMONPARAMETERS = {
        ApplicationID: '10000',
        Format: 'JSON',
        SignatureVersion: '1.0',
        Timestamp: time,
        Signature: md5(`Body=${Body}&Timestamp=${time}3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d`),
        access_token: store.getters.getToken.access_token
    }
    console.log(store.getters.getToken, COMMONPARAMETERS, `Body=${encodeURIComponent(Body)}&Timestamp=${time}3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d`, Body)
    return COMMONPARAMETERS
}
/*
 *@description: 动态添加非GET请求的公共参数, 并返回
 *@functionName: COMMON_PARAMETERS_POST js
 *@params1: Body 加密字符串
 *@author: zl
 *@date: 2019-11-18 09:27:58
 *@version: V1.0.0
 */
function COMMON_PARAMETERS_POST (Body) {
    const time = new Date().getTime()
    const Signature = md5(
        (`Body=${Body}&Timestamp=${time}3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d`))
    const COMMON_PARAMETERS_POST =
        `ApplicationID=10000&Format=JSON&Signature=${Signature}&SignatureVersion=1.0&Timestamp=${time}&access_token=${store.getters.getToken.access_token}`
    return COMMON_PARAMETERS_POST
}

/* 重复点击问题 */
const pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const CancelToken = axios.CancelToken
const removePending = (ever) => {
    for (const p in pending) {
        if (pending[p].u === ever.url + '&' + ever.method) { // 当当前请求在数组中存在时执行函数体
            pending[p].f() // 执行取消操作
            pending.splice(p, 1) // 把这条记录从数组中移除
        }
    }
}
// 创建axios实例
const instance = axios.create({
    timeout: 1000 * 30
})
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
if (process.env.NODE_ENV === 'development') {
    instance.defaults.baseURL = '/api'
} else if (process.env.NODE_ENV === 'production') {
    instance.defaults.baseURL = '/api'
    // instance.defaults.baseURL = process.env.VUE_APP_PRO
}
axios.defaults.crossDomain = true
// 设置cross跨域 并设置访问权限 允许跨域携带cookie信息
instance.defaults.withCredentials = true
const source = CancelToken.source()
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(config => {
    $('#userDropdown').css('display', 'none')
    $('#submenu').css('display', 'none')
    // 在发送请求之前做某件事
    config.cancelToken = source.token // 取消请求
    if (config.cancelToken && config.cancelObj && config.cancelObj.cancel) {
        config.cancelObj.cancel('中断请求')
        delete config.cancelObj
    }
    if (!navigator.onLine) source.cancel('网络故障，请检查!') // 断网提示
    if (config.method !== 'get') {
        if (
            config.url.indexOf('/UserAuthority/getAuthInfo') === -1 &&
                config.url.indexOf('/UserAuthority/refreshToken') === -1
        ) {
            if (config.data.Body ? config.data.Body : '') {
                const Body = JSON.parse(config.data.Body ? config.data.Body : '')
                for (const key in Body) {
                    if (Object.prototype.hasOwnProperty.call(Body, key) && typeof Body[key] === 'number') {
                        Body[key] = String(Body[key])
                    }
                }
                config.data.Body = JSON.stringify(Body)
            }
            config.url = `${config.url}?${COMMON_PARAMETERS_POST(config.data.Body ? config.data.Body : '')}`
        }
        // 这里使用qs对数据进行处理，防止后台$_POST接收不到
        config.data = config.headers['content-type'] === 'multipart/form-data' ? config.data : qs.stringify(config.data)
    } else {
        config.data = true
        config.params = COMMON_PARAMETERS(config.url.split('?')[1].split('=')[1])
        config.headers = {'content-type': 'application/json;charset=UTF-8'}
    }
    config.headers['Accept-Language'] = i18n.locale === 'cn' ? 'zh-cn' : i18n.locale
    // ------------------------------------------------------------------------------------
    removePending(config) // 在一个ajax发送前执行一下取消操作
    config.cancelToken = new CancelToken((c) => {
        // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
        pending.push({u: config.url + '&' + config.method, f: c})
    })
    return config
    // }
}, error => {
    return Promise.error(error)
})

// 响应拦截器
instance.interceptors.response.use(res => { // 请求成功
    // ------------------------------------------------------------------------------------------
    removePending(res.config) // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    // -------------------------------------------------------------------------------------------
    res.data.code = parseInt(res.data.code)
    return [200, 401].includes(res.status) ? Promise.resolve(res) : Promise.reject(res)
}, error => { // 请求失败、、
    const { response } = error
    if (response) {
        // 请求已发出，但是不在2xx的范围
        errorHandle(response.status, response.statusText)
        return Promise.reject(response)
    }/*  else {
        // 处理断网的情况
        // eg:请求超时或断网时，更新state的network状态
        // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
        // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
        if (!window.navigator.onLine) {
            // store.commit('changeNetwork', false)
            tip('请求超时,请查看网络状态.')
        } else {
            return Promise.reject(error)
        }
    } */
})

export default {
    instance,
    errorHandle,
    tip
}
