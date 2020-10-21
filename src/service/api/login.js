/**
 * @author: zl
 * @email: 1280251121@qq.com
 * @date: 2019-11-04 13-37-17
 * @version: 1.0
 */
/**
 * login模块接口列表
 */
import bus from '@c/bus.js'
import base from '@s/base' // 导入接口域名列表
import axios from '@s/http' // 导入http中创建的axios实例
import store from '@/store/index.js'
import router from '@/router/index.js'

const login = {
    /*
   *@description: 记录用户行为
   *@functionName: OauthUsersBehavior
   *@params1: params 请求参数
   *@author: zl
   *@date: 2019-11-08 15:30:28
   *@version: V1.0.0
   */
    userBehavior (params) {
        params = sortASCII(params)
        return axios.instance.post(`${base.oub}/Project`, params)
    },
    /*
   *@description:登录
   *@functionName: loginUser
   *@params1: params 登录的请求参数
   *@author: zl
   *@date: 2019-11-07 14:24:23
   *@version: V1.0.0
   */
    loginUser (params) {
        params = sortASCII(params)
        return axios.instance.post(`${base.ua}/login`, params)
    },
    // 获取认证信息
    getAuthInfo (accessToken) {
        return axios.instance.post(`${base.ua}/getAuthInfo?access_token=${accessToken}`)
    },
    // 特殊项目选择
    specialProject (Body) {
        return axios.instance.post(`${base.sp}`, {Body})
    },
    // 刷新token
    refreshToken () {
        if (router.history.current.fullPath === '401') {
            return {}
        } else {
            const token = store.getters.getToken
            bus.$emit('localLoading', true)
            return new Promise((reslove/* , reject */) => {
                axios.instance.post(`${base.ua}/refreshToken`, {
                    'client_id': '10000',
                    'client_secret': 'CLIENTSECRET2019',
                    'grant_type': 'refresh_token',
                    'refresh_token': token.refresh_token,
                    'user_id': store.getters.getUserId,
                    'access_token': token.access_token
                }).then(response => {
                    bus.$emit('localLoading', false)
                    if (response.data.result.access_token) {
                        store.dispatch('setToken', {
                            'access_token': response.data.result.access_token,
                            'refresh_token': response.data.result.refresh_token
                        })
                        reslove(true)
                    } else {
                        store.dispatch('setToken', {})
                        store.dispatch('setUserInfo', {})
                        router.replace({path: '/401'})
                    }
                }).catch(() => {
                    bus.$emit('localLoading', false)
                    store.dispatch('setToken', {})
                    store.dispatch('setUserInfo', {})
                    router.replace({path: '/401'})
                })
            })
        }
    }
}

// 升序排序
function sortASCII (obj) {
    const arr = []
    let num = 0
    for (const i in obj) {
        arr[num] = i
        num++
    }
    const sortArr = arr.sort()
    const sortObj = {}
    for (const i in sortArr) {
        sortObj[sortArr[i]] = obj[sortArr[i]]
    }
    return sortObj
}

export default login
