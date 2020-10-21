import base from '@s/base' // 导入接口域名列表
import axios from '@s/http' // 导入http中创建的axios实例

const projectlist = {
    /*
   *@description: 获取项目列表
   *@functionName: getProjects
   *@params: params 公共参数
   *@author: zl
   *@date: 2019-11-05 13:33:26
   *@version: V1.0.0
   */
    getProjects (Body) {
        return axios.instance.get(`${base.pi}?Body=${Body}`)
    },
    /*
   *@description: 添加项目
   *@functionName:  appendProjects
   *@params1: COMMON_PARAMETERS_POST 公共参数
   *@params2: Body Body数据(From Data)
   *@author: zl
   *@date: 2019-12-16 10:02:56
   *@version: V1.0.0
  */
    appendProjects (Body) {
        return axios.instance.post(`${base.pi}`, Body)
    }
}

export default projectlist
