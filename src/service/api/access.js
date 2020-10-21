import base from '@s/base' // 导入接口域名列表
import axios from '@s/http' // 导入http中创建的axios实例

const access = {
    /* file */
    /*
     *@description: 获取文件权限信息
     *@functionName: AccessAuth  js
     *@params1: NO  文件ID
     *@params2: params  公共参数
     *@params3: Body  传递参数
     *@author: zl
     *@date: 2019-12-31 14:47:42
     *@version: V1.0.0
    */
    AccessAuth (NO, Body) {
        return axios.instance.get(`${base.aa}/${NO}?Body=${Body}`)
        // return axios.instance.get(`${base.aa}/Folder/${NO}/Folders?Body=${Body}`)
    },
    // 获取指定文件夹在利用者和组里的权限信息一览
    AccessAuthserAndGroup (NO, Body) {
        return axios.instance.get(`${base.aa}/${NO}/UserAndGroup?Body=${Body}`)
    },
    // 指定文件夹权限更新
    AccessAuthModify (NO, Body) {
        return axios.instance.post(`${base.aa}/${NO}`, {Body})
    },

    /* group, user */
    // 利用者一览及模糊查询[利用者一览查询权限查询（无权限）]
    AccessAuthUsers (Body) {
        return axios.instance.get(`${base.aa}${base.user}?Body=${Body}`)
    },
    // 组查询[ 分组一览查询权限查询（无权限） ]
    AccessAuthGroups (Body) {
        return axios.instance.get(`${base.aa}${base.g}?Body=${Body}`)
    },
    // 利用者グループ指定文件夹权限更新
    AccessAuthUserGroup (NO, Body) {
        return axios.instance.post(`${base.aa}/UserGroup/${NO}`, {Body})
    }
}

export default access
