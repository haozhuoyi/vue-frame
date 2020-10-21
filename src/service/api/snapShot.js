/* eslint-disable object-curly-spacing */
import base from '@s/base' // 导入接口域名列表
import axios from '@s/http' // 导入http中创建的axios实例

const snapShot = {
    /*
     *@functionName: snapShot js
     *@params1: Body 请求参数
     *@params2: params 公共参数
     *@description: 快照做成
     *@author: yuhl
     *@date: 2020-04-01
     */
    CreateSnapShot (Body) {
        return axios.instance.post(`${base.ss}`, {Body})
    }

}


export default snapShot
