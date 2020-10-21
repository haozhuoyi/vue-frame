import base from '@s/base' // 导入接口域名列表
import axios from '@s/http' // 导入http中创建的axios实例

const group = {
    /*
    *@description: group取得
    *@functionName: getGroups
    *@params1: Body Body数据
    *@params2: params 公共参数
    *@author: zl
    *@date: 2019-12-24 15:30:00
    *@version: V1.0.0
    */
    getGroups (Body) {
        return axios.instance.get(`${base.g}?Body=${Body}`)
    },
    /*
    *@description: 指定group取得
    *@functionName: getGroup
    *@params1: Body Body数据
    *@params2: params 公共参数
    *@params3: NO 唯一标识
    *@author: zl
    *@date: 2019-12-24 15:30:00
    *@version: V1.0.0
    */
    getGroup (NO, Body) {
        return axios.instance.get(`${base.g}/${NO}?Body=${Body}`)
    },
    /*
    *@description: Group的利用者情报取得
    *@functionName: UserListGet
    *@params1: Body Body数据
    *@params2: params 公共参数
    *@params3: NO 所属情报唯一标识
    *@author: zl
    *@date: 2019-12-24 14:30:00
    *@version: V1.0.0
    */
    UserListGet (NO, Body) {
        return axios.instance.get(`${base.g}/${NO}${base.user}?Body=${Body}`)
    },
    /*
     *@description: Group追加
     *@functionName: addGroup  js
     *@params1:  COMMON_PARAMETERS_POST 公共参数
     *@params2: Body Body数据
     *@author: zl
     *@date: 2019-12-30 17:15:00
     *@version: V1.0.0
    */
    addGroup (Body) {
        return axios.instance.post(`${base.g}`, {Body})
    },
    /*
    *@description: 指定group更新
    *@functionName: updateGroup
    *@params1: Body Body数据
    *@params2: COMMON_PARAMETERS_POST 公共参数
    *@params3: NO 唯一标识
    *@author: zl
    *@date: 2019-12-30 15:30:00
    *@version: V1.0.0
    */
    updateGroup (NO, Body) {
        return axios.instance.put(`${base.g}/${NO}`, {Body})
    },
    /*
    *@description: 参加者编辑
    *@functionName: updateGroup
    *@params1: Body Body数据
    *@params2: COMMON_PARAMETERS_POST 公共参数
    *@params3: NO 唯一标识
    *@author: zl
    *@date: 2019-12-30 15:30:00
    *@version: V1.0.0
    */
    updateGroupInfo (NO, Body) {
        return axios.instance.post(`${base.g}/${NO}`, {Body})
    },
    /*
    *@description: 指定group删除
    *@functionName: deleteGroup
    *@params1: Body Body数据
    *@params2: COMMON_PARAMETERS_POST 公共参数
    *@params3: NO 唯一标识
    *@author: zl
    *@date: 2019-12-24 15:30:00
    *@version: V1.0.0
    */
    deleteGroup (NO, Body) {
        return axios.instance.delete(`${base.g}/${NO}`, {data: Body})
    },
    // 利用者曖昧検索
    AmbiguousUsers (NO, Body) {
        return axios.instance.get(`/AmbiguousUsers/${NO}?Body=${Body}`)
    }
}

export default group
