/* eslint-disable no-array-constructor */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/**
 * folder模块接口列表
 */
import base from '@s/base' // 导入接口域名列表
import axios from '@s/http' // 导入http中创建的axios实例

const folder = {
    display () {
        if (document.getElementsByClassName('contextmenu').length > 0) {
            document.getElementsByClassName('contextmenu')[0].style.display = 'none'
        }
        if (document.getElementsByClassName('treeContextMenu').length > 0) {
            document.getElementsByClassName('treeContextMenu')[0].style.display = 'none'
        }
    },
    /*
   *@functionName:   js
   *@params1: Body Body数据
   *@params2: NO 文件目录层级
   *@params3: params 公共参数
   *@description:获取文件及文件夹
   *@author: zl
   *@date: 2019-11-05 09:38:13
   *@version: V1.0.0
   */
    getFolders (NO, Body) {
        if (parseInt(NO) > 1) {
            this.display()
        }
        return axios.instance.get(`${base.s3}/${NO}?Body=${Body}`)
    },
    /*
   *@description: 文件夹 / 文件检索
   *@functionName:  FolderConditionQuery js
   *@params1: Body Body数据
   *@params2: NO 文件目录层级
   *@params3: params 公共参数
   *@author: zl
   *@date: 2020-01-06 15:55:23
   *@version: V1.0.0
   */
    FolderConditionQuery (NO, Body) {
        this.display()
        return axios.instance.get(`${base.s3}/${NO}/ConditionQuery?Body=${Body}`)
    },
    // 文件模糊查询
    FolderFuzzyQuery (NO, Body) {
        this.display()
        return axios.instance.get(`${base.s3}/${NO}/FuzzyQuery?Body=${Body}`)
    },
    // 移动复制时文件夹模糊查询
    MoveAndCopyFuzzyQuery (Body) {
        this.display()
        return axios.instance.get(`${base.s3}/FolderFuzzyQuery?Body=${Body}`)
    },
    // 收藏文件和删除文件模糊查询
    AmbiguousQuery (Body) {
        this.display()
        return axios.instance.get(`${base.s3}/AmbiguousQuery?Body=${Body}`)
    },
    /*
   *@functionName: Favorites js
   *@params1: Body Body数据
   *@params2: params 公共参数
   *@params3: NO 唯一标识
   *@description: 添加收藏
   *@author: zl
   *@date: 2020-01-19 16:46:33
   *@version: V1.0.0
  */
    Favorites (NO, Body) {
        this.display()
        return axios.instance.post(`${base.f}/${NO}`, Body)
    },
    /*
   *@functionName:  FavoritesDelete js
   *@params1: Body Body数据
   *@params2: params 公共参数
   *@params3: NO 收藏夹NO
   *@description: 删除收藏
   *@author: zl
   *@date: 2020-01-19 16:47:54
   *@version: V1.0.0
  */
    FavoritesDelete (favoriteNo, Body) {
        this.display()
        return axios.instance.delete(`${base.f}/${favoriteNo}`, Body)
    },
    // 文件下载
    FolderDownload (Body) {
        this.display()
        return axios.instance.get(`${base.s3}/File?Body=${Body}`, {
            responseType: 'blob'
        })
    },
    // 文件下载通知
    FailFile (Body) {
        this.display()
        return axios.instance.get(`${base.s3}/FailFile?Body=${Body}`)
    },
    // 文件名和文件夹名更新
    FileRname (NO, Body) {
        this.display()
        return axios.instance.patch(`${base.s3}/${NO}/File`, {Body})
    },
    // 文件移动或复制检查
    Move (NO, Body) {
        this.display()
        return axios.instance.get(`${base.s3}/${NO}/Move?Body=${Body}`)
    },
    // 文件检测
    Detect (NO, Body, Detect) {
        this.display()
        return axios.instance.get(`${base.s3}/${NO}/${Detect}?Body=${Body}`)
    },
    // // 文件上传
    // FileUpload (NO, Body, FormData, data) {
    //     const config = {
    //         headers: {
    //             'content-type': 'multipart/form-data'
    //         }
    //     }
    //     return axios.instance.post(`${base.s3}/${NO}/File`, FormData, config)
    // },
    // 创建文件夹
    Createfolder (NO, Body) {
        this.display()
        return axios.instance.post(`${base.s3}/${NO}/Folder`, {Body})
    },

    // Photopin
    /*
   *@functionName:  DirectContentsGET js
   *@params1: NO 文件ID
   *@params2: params 公共参数
   *@params3: Body 传递的参数
   *@description: 获取直贴写真
   *@author: zl
   *@date: 2020-01-14 15:40:03
   *@version: V1.0.0
  */
    DirectContentsGET (NO, Body) {
        this.display()
        return axios.instance.get(`${base.dc}/${NO}?Body=${Body}`, {
            'responseType': 'arraybuffer'
        })
    },
    /*
   *@functionName:  ContentsGET js
   *@params1: NO 文件ID
   *@params2: params 公共参数
   *@params3: Body 传递的参数
   *@description: 获取pin写真
   *@author: zl
   *@date: 2020-01-14 15:40:03
   *@version: V1.0.0
  */
    ContentsGET (NO, Body) {
        this.display()
        return axios.instance.get(`${base.c}/${NO}?Body=${Body}`, {
            'responseType': 'arraybuffer'
        })
    },
    /*
   *@functionName:  DirectContentsDownload js
   *@params1: NO 文件ID
   *@params2: params 公共参数
   *@params3: Body 传递的参数
   * @description: 指定文件下的直贴写真下载
   *@author: zl
   *@date: 2020-01-14 11:47:34
   *@version: V1.0.0
   */
    DirectContentsDownload (NO, Body) {
        this.display()
        return axios.instance.get(`${base.s3}/${NO}${base.dc}/Download?Body=${Body}`, {
            responseType: 'blob'
        })
    },
    /*
   *@functionName: ContentsDownload  js
   *@params1: NO 文件ID
   *@params2: params 公共参数
   *@params3: Body 传递的参数
   *@description: 指定pin下的pin写真下载
   *@author: zl
   *@date: 2020-01-14 16:43:01
   *@version: V1.0.0
  */
    ContentsDownload (NO, Body) {
        this.display()
        return axios.instance.get(`${base.p}/${NO}${base.c}/Download?Body=${Body}`, {
            responseType: 'blob'
        })
    },
    /*
   *@functionName:  PhotoDownload js
   *@params1: NO 文件ID
   *@params2: params 公共参数
   *@params3: Body 传递的参数
   *@description: 指定文件或文件夹下的pin写真和直贴写真下载
   *@author: zl
   *@date: 2020-01-15 13:28:29
   *@version: V1.0.0
  */
    PhotoDownload (NO, Body) {
        this.display()
        return axios.instance.get(`${base.s3}/${NO}${base.c}/Download?Body=${Body}`, {
            responseType: 'blob'
        })
    },
    /*
   *@functionName:  CSVGET js
   *@params1: NO 文件ID
   *@params2: params 公共参数
   *@params3: Body 传递的参数
   *@description: 指定pin下的CSV内容
   *@author: zl
   *@date: 2020-01-16 16:18:30
   *@version: V1.0.0
  */
    CSVGET (NO, Body) {
        this.display()
        return axios.instance.get(`${base.p}/${NO}/CSVContent?Body=${Body}`, {
            'responseType': 'arraybuffer'
        })
    },
    /*
   *@functionName:  CSVDownload js
   *@params1: NO 文件ID
   *@params2: params 公共参数
   *@params3: Body 传递的参数
   *@description: 指定pin下的CSV下载
   *@author: zl
   *@date: 2020-01-16 16:20:30
   *@version: V1.0.0
  */
    CSVDownload (NO, Body) {
        this.display()
        return axios.instance.get(`${base.p}/${NO}/CSV?Body=${Body}`, {
            responseType: 'blob'
        })
    },

    // 快照做成
    SnapShot (Body) {
        this.display()
        return axios.instance.post(`${base.ss}`, {Body})
    },

    // ExcelsFrom
    /*
   *@description: 指定作成日的Excel帳票一览取得
   *@functionName: Excels  js
   *@params2: params  公共参数
   *@params3: Body  传递参数
   *@author: zl
   *@date: 2020-01-09 15:27:00
   *@version: V1.0.0
   */
    Excels (Body) {
        this.display()
        return axios.instance.get(`${base.ecl}?Body=${Body}`)
    },
    /*
   *@description: 指定Excel帳票下载
   *@functionName: ExcelsDownload  js
   *@params1: params  公共参数
   *@params2: Body  传递参数
   *@author: zl
   *@date: 2020-01-09 16:52:51
   *@version: V1.0.0
   */
    ExcelsDownload (Body) {
        this.display()
        return axios.instance.get(`${base.ecl}/Download?Body=${Body}`, {
            responseType: 'blob'
        })
    },
    /*
   *@description: 指定Excel帳票删除
   *@functionName:   js
   *@params1: NO  需要删除的NO
   *@params2: COMMON_PARAMETERS_POST  公共参数
   *@params3: Body 请求参数
   *@author: zl
   *@date: 2020-01-10 10:24:36
   *@version: V1.0.0
   */
    ExcelsDelete (NO, Body) {
        this.display()
        return axios.instance.delete(`${base.ecl}/${NO}`, Body)
    },
    // 邮件
    /*
   *@functionName: MailTemplatesGET  js
   *@params1: Body 传递的参数
   *@params2: params 公共参数
   *@description: 邮件模板一览取得和检索
   *@author: zl
   *@date: 2020-01-17 10:15:16
   *@version: V1.0.0
  */
    MailTemplatesGET (Body) {
        this.display()
        return axios.instance.get(`${base.mt}?Body=${Body}`)
    },
    /*
   *@functionName: MailTemplatesUPDATE  JS
   *@params1: NO  需要更新的邮件模版的NO
   *@params2: COMMON_PARAMETERS_POST  公共参数
   *@params3: Body 请求参数
   *@description: 指定邮件模板更新
   *@author: zl
   *@date: 2020-01-17 10:17:22
   *@version: V1.0.0
  */
    MailTemplatesUPDATE (NO, Body) {
        this.display()
        return axios.instance.patch(`${base.mt}/${NO}`, {Body})
    },
    /*
   *@description: 指定邮件模板削除
   *@functionName:   js
   *@params1: NO  需要删除的邮件模版的NO
   *@params2: COMMON_PARAMETERS_POST  公共参数
   *@params3: Body 请求参数
   *@author: zl
   *@date: 2020-01-10 10:24:36
   *@version: V1.0.0
   */
    MailTemplatesDelete (NO, Body) {
        this.display()
        return axios.instance.delete(`${base.mt}/${NO}`, {data: {Body}})
    },
    /*
   *@functionName:  MailTemplatesADD JS
   *@params1: Body 请求参数
   *@params2: COMMON_PARAMETERS_POST  公共参数
   *@description: 邮件模板新建
   *@author: zl
   *@date: 2020-01-17 10:21:42
   *@version: V1.0.0
  */
    MailTemplatesADD (Body) {
        this.display()
        return axios.instance.post(`${base.mt}`, {Body})
    },
    /*
   *@functionName: MailAddressBelongings  js
   *@params1: Body 请求参数
   *@params2: params  公共参数
   *@description: 宛先的所属一览取得
   *@author: zl
   *@date: 2020-01-17 16:40:49
   *@version: V1.0.0
  */
    // MailAddressBelongings (Body) {
    //     this.display()
    //     return axios.instance.get(`${base.md}${base.bel}?Body=${Body}`)
    // },
    /*
    *@functionName: MailAddressBelongings  js
    *@params1: NO  宛先的指定所属的NO
    *@params2: params  公共参数
    *@params3: Body 请求参数
    *@description: 宛先的指定所属的情报取得
    *@author: zl
    *@date: 2020-01-17 16:41:49
    *@version: V1.0.0
    */
    MailAddresBelonging (NO, Body) {
        this.display()
        return axios.instance.get(`${base.md}/MailingList/${NO}?Body=${Body}`)
    },
    /*
    *@functionName:  MailingListsGET js
    *@params1: params 公共参数
    *@params2: Body 请求参数
    *@description: 邮件列表一览取得 所有
    *@author: zl
    *@date: 2020-01-19 14:10:30
    *@version: V1.0.0
    */
    MailingListsGET (Body) {
        this.display()
        return axios.instance.get(`${base.ml}?Body=${Body}`)
    },
    /*
        *@functionName:   js
        *@params1: NO 指定邮件列表的邮件id
        *@params2: params 公共参数
        *@params3: Body 请求参数
        *@description: 指定邮件列表情报取得
        *@author: zl
        *@date: 2020-01-19 14:12:12
        *@version: V1.0.0
    */
    MailingListGET (NO, Body) {
        this.display()
        return axios.instance.get(`${base.ml}/${NO}?Body=${Body}`)
    },
    /*
   *@functionName:   js
   *@params1: NO 指定邮件列表的邮件id
   *@params2: params 公共参数
   *@params3: Body 请求参数
   *@description: 指定邮件列表更新
   *@author: zl
   *@date: 2020-01-19 14:13:59
   *@version: V1.0.0
  */
    MailingListUPDATE (NO, Body) {
        this.display()
        return axios.instance.patch(`${base.ml}/${NO}`, {Body})
    },
    /*
   *@functionName:   js
   *@params1: NO 指定邮件列表的邮件id
   *@params2: params 公共参数
   *@params3: Body 请求参数
   *@description: 指定邮件列表删除
   *@author: zl
   *@date: 2020-01-19 14:16:59
   *@version: V1.0.0
  */
    MailingListDELETE (NO, Body) {
        this.display()
        return axios.instance.delete(`${base.ml}/${NO}`, {data: {Body}})
    },
    /*
   *@functionName:  MailingListADDdd js
   *@params1: params 公共参数
   *@params2: Body 请求参数
   *@description: 邮件列表创建
   *@author: zl
   *@date: 2020-01-19 14:17:23
   *@version: V1.0.0
  */
    MailingListADD (Body) {
        this.display()
        return axios.instance.post(`${base.ml}`, {Body})
    },
    // 通知邮件附件上传
    MailAttachmentUpload (FormData) {
        this.display()
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return axios.instance.post(`Notice/File`, FormData, config)
    },
    // 发送邮件
    Sendmail (Body) {
        this.display()
        return axios.instance.post(`Notice/SendMail`, {Body})
    },

    /* 二维码接口说明 */
    // 二维码作成的默认设定查询
    QrDefault (Body) {
        this.display()
        return axios.instance.get(`${base.qr}?Body=${Body}`)
    },
    // 二维码作成的默认设定更新
    QrDefaultUpdate (Body) {
        this.display()
        return axios.instance.post(`${base.qr}`, {Body})
    },
    // 二维码作成
    QrCode (NO, Body) {
        this.display()
        return axios.instance.post(`${base.qr}/${NO}`, {Body})
    },
    // 带二维码的pdf下载
    QrCodeUpload (NO, Body) {
        this.display()
        return axios.instance.get(`${base.qr}/${NO}?Body=${Body}`, {responseType: 'blob'})
    },
    // qr无效化
    QrCodeInvalid (NO, Body) {
        this.display()
        return axios.instance.delete(`${base.qr}/${NO}`, {Body})
    },
    // 文件转换状态
    FileTransitionState (Body) {
        this.display()
        return axios.instance.get(`/File/FileConvert?Body=${Body}`)
    }
}

export default folder
