import base from '@s/base' // 导入接口域名列表
import axios from '@s/http' // 导入http中创建的axios实例

const dustbin = {
    /*
   * @description: 回收站内容一览取得
   * @functionName: Trash js
   *@params1: NO  文件ID
   *@params2: params  公共参数
   *@params3: Body  传递参数
   */
    Trash (Body) {
        return axios.instance.get(`${base.d}?Body=${Body}`)
    },
    /*
  *@functionName: TrashAdd js
  *@params1: Body Body数据
  *@params2: params 公共参数
  *@params3: NO 唯一标识
  *@description: 放入回收站
  *@author: zl
 */
    TrashAdd (Body) {
        return axios.instance.post(`${base.d}`, {Body})
    },
    /*
   *@functionName:  TrashDel js
   *@params1: Body Body数据
   *@params2: params 公共参数
   *@params3: NO 文件夹NO
   *@description: 回收站情报删除
   *@author: zl
   *@date: 2020-01-19 16:47:54
   *@version: V1.0.0
  */
    TrashDel (NO, Body) {
        return axios.instance.delete(`${base.d}/${NO}`, {data: {Body}})
    },
    // 清空回收站
    TrashDelAll (Body) {
        return axios.instance.delete(`${base.d}`, {data: {Body}})
    },
    // 回收站情报还原
    TrashReduction (NO, Body) {
        return axios.instance.patch(`${base.d}/${NO}`, {Body})
    },
    // 回收站全部情报还原
    TrashReductionAll (Body) {
        return axios.instance.patch(`${base.d}`, {Body})
    }
}

export default dustbin
