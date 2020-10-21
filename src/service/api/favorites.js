import base from '@s/base' // 导入接口域名列表
import axios from '@s/http' // 导入http中创建的axios实例

const favorites = {
    /*
   * @description: 收藏夹内容一览取得
   * @functionName: Favorites js
   *@params1: NO  文件ID
   *@params2: params  公共参数
   *@params3: Body  传递参数
   */
    Favorites (Body) {
        return axios.instance.get(`${base.f}?Body=${Body}`)
    }
}

export default favorites
