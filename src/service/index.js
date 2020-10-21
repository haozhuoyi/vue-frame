/* eslint-disable camelcase */
/**
 * api接口的统一出口
 */
import router from '@/router/index.js'
import {
    Message
} from 'element-ui' // 单独引用
import bus from '@c/bus'
import i18n from '@i/i18n'

// 登录
import login from './api/login'
// 文件模块接口
import folder from './api/folder'
// 项目列表
import projectlist from './api/projectlist'
// 利用者管理
import usermanagement from './api/usermanagement'
// 分组管理
import group from './api/group'
// 权限管理
import access from './api/access'
// 设定
import settings from './api/settings'
// 快照
import snapShot from './api/snapShot'
// 收藏夹
import favorites from './api/favorites'
// 回收站
import dustbin from './api/dustbin'

/*
 *@functionName: requestError
 *@params1: explain 说明:什么请求,哪种请求
 *@params2: err 报错信息
 *@description:请求错误公共方法
 *@author: zl
 *@date: 2019-11-06 14:30:38
 *@version: V1.0.0
 */
export function requestError (explain, err) {
    Message.closeAll()
    console.log(explain, err.status, err.statusText, err.message)
    if (err.toString().indexOf('timeout') !== -1) {
        Message(err.toString())
    }
}
/*
 *@functionName: CODE js
 *@params1: res 接口返回值
 *@description: 判断返回状态码code的各种情况
 *@author: zl
 *@date: 2019-11-26 10:55:08
 *@version: V1.0.0
 */
export function CODE (res, type) {
    if (['usermanagement', 'EmailTemplateSelection'].includes(type)) {
        Message.closeAll()
    }
    if (res.code === 0) { // 请求成功
        return res
    } else if (res.code > 200 && res.code <= 29999) {
        Message.error(res.message)
        return
    } else if (res.code === 30000 || res.code === 30001) { // 跳转主页面
        if (router.app._route.path === '/login') {
            bus.$emit('closeproject')
        } else {
            // 直接主页面
            router.push('login')
        }
        return
    } else if (res.code === 30002) { // 打开项目选择列表窗口
        return 'getProjects'
    } else if (res.code === 30003) { // 直接跳转主页面
        const path = router.app._route.path
        if (path !== '/Files/Allfiles' || path !== '/folder') {
            // 直接主页面
            router.push('/')
        } else {
            return res
        }
    } else if (res.code <= -20000 && res.code >= -30000) {
        Message.error(i18n.t(`Message.${res.code}`))
        if ([-20009, -20022, -20204, -20116].includes(res.code)) {
            document.getElementsByClassName('headerButton setting')[0].click()
        }
        return
    } else if (res) {
        return res
    }
}
export function replaceMethod (data) {
    if (/[{}\\"\n]/gm.test(data)) {
        return data.replace(/\\/g, '\\\\').replace(/'/g, '\'').replace(/"/g, '\\"').replace(/~/g, '\~').replace(/{/g, '\{').replace(/}/g, '\}').replace(/\n/g, '\\n')
    }
    return data
}
// 导出接口
export default {
    login,
    folder,
    projectlist,
    usermanagement,
    group,
    access,
    settings,
    snapShot,
    favorites,
    dustbin,
    CODE,
    requestError,
    replaceMethod
}
