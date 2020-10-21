import base from '@s/base' // 导入接口域名列表
import axios from '@s/http' // 导入http中创建的axios实例

const usermanagement = {
    /*
   *@description: 下拉选项: 所属 && 权限 数据获取
   *@functionName: SelectionBox  js
   *@params1: params 公共参数
   *@params2: Body Body数据
   *@author: zl
   *@date: 2019-12-27 16:00:45
   *@version: V1.0.0
   */
    SelectionBox (Body) {
        return axios.instance.get(`${base.sb}?Body=${Body}`)
    },
    /*
   *@description: 所属情报取得
   *@functionName: getUserManagement
   *@params1: Body Body数据
   *@params2: params 公共参数
   *@author: zl
   *@date: 2019-12-24 15:30:00
   *@version: V1.0.0
   */
    getBelonging (Body) {
        return axios.instance.get(`${base.bing}?Body=${Body}`)
    },
    /*
   *@description: 利用者情报取得
   *@functionName: getUserManagement
   *@params1: Body Body数据
   *@params2: params 公共参数
   *@author: zl
   *@date: 2019-12-24 10:00:00
   *@version: V1.0.0
   */
    getUserManagement (Body) {
        return axios.instance.get(`${base.user}?Body=${Body}`)
    },
    /*
   *@description: 所属情报的利用者情报取得
   *@functionName: getSubordinateIntelligenceOfUserInformation
   *@params1: Body Body数据
   *@params2: params 公共参数
   *@params3: NO 所属情报唯一标识
   *@author: zl
   *@date: 2019-12-24 14:30:00
   *@version: V1.0.0
   */
    getSubordinateIntelligenceOfUserInformation (NO, Body) {
        return axios.instance.get(`${base.bing}/${NO}/${base.user}?Body=${Body}`)
    },
    /*
   *@description: 所属情報追加
   *@functionName: additionalInformation  js
   *@params1:  COMMON_PARAMETERS_POST 公共参数
   *@params2: Body Body数据
   *@author: zl
   *@date: 2019-12-24 15:04:43
   *@version: V1.0.0
   */
    additionalInformation (Body) {
        return axios.instance.post(`${base.bing}`, {Body})
    },
    /*
   *@description: 所属情報修改
   *@functionName: editingInformation  js
   *@params1:  COMMON_PARAMETERS_POST 公共参数
   *@params2: Body Body数据
   *@params3: NO 所属情报唯一标识
   *@author: zl
   *@date: 2019-12-24 15:04:43
   *@version: V1.0.0
   */
    editingInformation (NO, Body) {
        return axios.instance.patch(`/Belonging/${NO}`, {Body})
    },
    /*
   *@description: 所属情報删除
   *@functionName: deleteInformation  js
   *@params1:  COMMON_PARAMETERS_POST 公共参数
   *@params2: Body Body数据
   *@params3: NO 所属情报唯一标识
   *@author: zl
   *@date: 2019-12-24 15:04:43
   *@version: V1.0.0
   */
    deleteInformation (NO, Body) {
        return axios.instance.delete(`${base.bing}/${NO}`, {data: Body})
    },
    /*
   *@description: 利用者情報追加
   *@functionName: additionalInformation  js
   *@params1:  COMMON_PARAMETERS_POST 公共参数
   *@params2: Body Body数据
   *@author: zl
   *@date: 2019-12-25 11:30:00
   *@version: V1.0.0
   */
    additionalInformationAdd (Body) {
        return axios.instance.post(`${base.user}`, {Body})
    },
    /*
   *@description: 所属情報修改
   *@functionName: editingInformation  js
   *@params1:  COMMON_PARAMETERS_POST 公共参数
   *@params2: Body Body数据
   *@params3: NO 所属情报唯一标识
   *@author: zl
   *@date: 2019-12-24 15:04:43
   *@version: V1.0.0
   */
    editingUserInformation (NO, Body) {
        return axios.instance.patch(`${base.user}/${NO}`, {Body})
    },
    /*
   *@description: 利用者情報删除
   *@functionName: deleteUserInformationDel  js
   *@params1:  COMMON_PARAMETERS_POST 公共参数
   *@params2: Body Body数据
   *@params3: NO 所属情报唯一标识
   *@author: zl
   *@date: 2019-12-24 14:40:43
   *@version: V1.0.0
   */
    deleteUserInformationDel (NO, Body) {
        return axios.instance.delete(`${base.user}/${NO}`, {data: Body})
    },
    /*
   *@description: 修改密码
   *@functionName: ChangePassword  js
   *@params1:  COMMON_PARAMETERS_POST 公共参数
   *@params2: Body Body数据
   *@params3: NO 所属情报唯一标识
   *@author: zl
   *@date: 2019-12-27 15:25:47
   *@version: V1.0.0
   */
    ChangePassword (NO, Body) {
        return axios.instance.patch(`${base.user}/${NO}/Password`, {Body})
    },
    /*
   *@description: 邮箱变更
   *@functionName: ChangeEmail  js
   *@params1:  COMMON_PARAMETERS_POST 公共参数
   *@params2: Body Body数据
   *@params3: NO 所属情报唯一标识
   *@author: zl
   *@date: 2019-01-06 11:40:00
   *@version: V1.0.0
   */
    ChangeEmail (NO, Body) {
        return axios.instance.post(`${base.user}/${NO}/ResendMail`, {Body})
    },
    // 忘记密码
    PasswordReset (Body) {
        return axios.instance.patch(`${base.user}/SendResetPasswordMail`, {Body})
    },
    // 忘记密码时重置密码
    ResetPassword (Body) {
        return axios.instance.patch(`${base.user}/ResetPassword`, {Body})
    },
    // 设置密码
    PasswordSetting (Body) {
        return axios.instance.patch(`${base.user}/RegistratePassword`, {Body})
    },
    // メールアドレス確認(邮箱地址确认)
    UsersChangeEmail (Body) {
        return axios.instance.patch(`${base.user}/ConfirmMailAddressChange`, {Body})
    }
}

export default usermanagement
