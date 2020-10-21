/* eslint-disable object-curly-spacing */
import base from '@s/base' // 导入接口域名列表
import axios from '@s/http' // 导入http中创建的axios实例

const settings = {
    SettingAskSupport (Body) {
        return axios.instance.post(`${base.set}/AskSupport`, {Body})
    },
    // 用户手册
    SettingManual (Catalog, Body) {
        return axios.instance.get(`${base.set}/Manual/${Catalog}?Body=${Body}`, {responseType: 'blob'})
    },

    /* 个人设定 */
    // 个人设定查询
    SettingPersonal (Body) {
        return axios.instance.get(`${base.set}/Personal?Body=${Body}`)
    },
    // 个人设定更新
    SettingUpdata (Body) {
        return axios.instance.post(`${base.set}/Personal`, {Body})
    },

    /* プロジェクト設定 */
    // ctb文件设定查询
    CTBFileSetQuery (Body) {
        return axios.instance.get(`${base.set}/CtbFile?Body=${Body}`)
    },
    // ctb文件下载
    CTBFileDownload (Body) {
        return axios.instance.get(`${base.set}/CtbFile/Download?Body=${Body}`, {responseType: 'blob'})
    },
    // ctb文件删除
    CTBFileDelete (Body) {
        // eslint-disable-next-line object-curly-spacing
        return axios.instance.delete(`${base.set}/CtbFile`, {data: {Body}})
    },
    //  ctb文件上传
    CTBFileUpload (Body) {
        // eslint-disable-next-line object-curly-spacing
        return axios.instance.post(`${base.set}/CtbFile`, {Body})
    },
    // ctb文件上传缓存
    // eslint-disable-next-line no-unused-vars
    CTBAttachmentUpload (Body, FormData, data) {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return axios.instance.post(`${base.set}/CtbFile/Temporary`, FormData, config)
    },
    // BOX连携設定情報取得
    BOXSettingAcquisition (Body) {
        return axios.instance.get(`${base.box}?Body=${Body}`)
    },
    // BOX連携文件夹一覧取得
    BoxFolders (NO, Body) {
        return axios.instance.get(`${base.box}/Folders/${NO}?Body=${Body}`)
    },
    // BOX連携用户追加
    BOXAccount (Body) {
        return axios.instance.post(`${base.box}/Account`, {Body})
    },
    // BOX連携用户消除
    BOXAccountDle (Body) {
        return axios.instance.delete(`${base.box}/Account`, {data: {Body}})
    },
    // BOX連携设定再认证
    BOXAccountReAuth (Body) {
        return axios.instance.patch(`${base.box}/Account/ReAuth`, {Body})
    },
    // BOX連携解除
    BOXDel (Body) {
        return axios.instance.delete(`${base.box}`, {data: {Body}})
    },

    /* 黒板・スタンプ */
    // stamp设定查询
    StampSelect (Body) {
        return axios.instance.get(`${base.set}/${base.stp}?Body=${Body}`)
    },
    // stamp添加收藏
    StampFavoritesAdd (STAMP_NO, Body) {
        return axios.instance.post(`${base.set}/${base.stp}/Favorites/${STAMP_NO}`, {Body})
    },
    // stamp删除收藏
    StampFavoritesDle (FavoriteNo, Body) {
        return axios.instance.delete(`${base.set}/${base.stp}/Favorites/${FavoriteNo}`, {data: {Body}})
    },
    // (黑板)BlackBoard设定查询
    SettingBlackBoard (Body) {
        return axios.instance.get(`${base.set}/BlackBoard?Body=${Body}`)
    },
    // (黑板)BlackBoard添加收藏
    BlackBoardFavoritesAdd (BlackBoardNO, Body) {
        return axios.instance.post(`${base.set}/BlackBoard/Favorites/${BlackBoardNO}`, {Body})
    },
    // (黑板)BlackBoard删除收藏
    BlackBoardFavoritesDle (FavoriteNo, Body) {
        return axios.instance.delete(`${base.set}/BlackBoard/Favorites/${FavoriteNo}`, {data: {Body}})
    },

    /* 使用状況確認 */
    SettingUseCapacity (Body) {
        return axios.instance.get(`${base.set}/UseCapacity?Body=${Body}`)
    },
    // /* 通知获取 */
    // SettingNotice (Body) {
    //     return axios.instance.get(`${base.set}/Notice?Body=${Body}`)
    // },
    /* 变换相关获取 */
    SettingTransformation (Body) {
        return axios.instance.get(`${base.set}/Transformation?Body=${Body}`)
    }
}

export default settings
