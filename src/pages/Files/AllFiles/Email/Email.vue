<template>
    <div id="email">
        <!-- 电子邮件通知----メール -->
        <el-dialog :title="$t('email.DISPLAY_SELECTING_TEMPLATE_MAIL_VIEWER')"
                   :visible.sync="dialogVisible"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   ref="emailDialog"
                   class="dialog"
                   @open="open"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="mailBody">
                <div class="users">
                    <span class="userTitle">{{ $t('email.DISPLAY_FILE_INFO_SEND_MAIL_TITLE_TO') }}</span>
                    <span class="userContent">{{ toUsers }}</span>
                    <img class="adding"
                         :src="require('@a/images/usermanagement/usermanagement-add.svg')"
                         @click="innerVisibleSHOW('To')">
                </div>
                <div class="users">
                    <span class="userTitle">{{ $t('email.DISPLAY_FILE_INFO_SEND_MAIL_TITLE_CC') }}</span>
                    <span class="userContent">{{ ccUsers }}</span>
                    <img class="adding"
                         :src="require('@a/images/usermanagement/usermanagement-add.svg')"
                         @click="innerVisibleSHOW('Cc')">
                </div>
                <div class="users">
                    <span class="userTitle">{{ $t('email.DISPLAY_FILE_INFO_SEND_MAIL_TITLE_BCC') }}</span>
                    <span class="userContent">{{ bccUsers }}</span>
                    <img class="adding"
                         :src="require('@a/images/usermanagement/usermanagement-add.svg')"
                         @click="innerVisibleSHOW('Bcc')">
                </div>
                <el-form :model="form"
                         :disabled="disabled"
                         label-position="right"
                         ref="ruleForm"
                         class="editMailForm">
                    <!-- 件名 -->
                    <el-form-item :label="$t('email.DISPLAY_FILE_INFO_SEND_MAIL_INPUT_TITLE_NAME')">
                        <el-input v-model="form.inputTitle"
                                  @input="e => form.inputTitle = validForbid(e)"
                                  maxlength="100"></el-input>
                    </el-form-item>
                    <!-- 本文 -->
                    <el-form-item :label="$t('email.DISPLAY_FILE_INFO_SEND_MAIL_INPUT_BODY')">
                        <!-- <vue-scroll :ops="ops"
                                    style="width: calc(100% - 118px);padding: 8px 0 8px 8px;"> -->
                        <div class="testBox"
                             contenteditable="true"
                             @keyup="editnameSet($event)">
                        </div>
                        <!-- </vue-scroll> -->
                        <!-- 模版调用 -->
                        <el-button class="buttonMailTemplates"
                                   @click.native="getMailTemplates"></el-button>
                    </el-form-item>
                </el-form>
                <!-- 附件列表  -->
                <div class="listFileContent">
                    <p>
                        {{ $t('email.DISPLAY_UPLOAD_MAIL_PIC_ROW_TITLE_PICLIST') }}
                        ({{ fileSize | bytesToSize(fileSize) }}/5.0MB)
                        <span class="listFileContentPrompt">※「jpg, jpeg, png,gif,tif,tiff」のみ添付可能</span>
                    </p>
                    <div class="listFile">
                        <ul>
                            <li v-for="item in fileList"
                                :key="item.name+item.lastModified"
                                :title="`${item.name}`">
                                {{ item.name }}
                                <span>({{ item.size | bytesToSize(item.size) }})</span>
                                <div class="deleteFile"
                                     @click="deleteFile(item.lastModified)"></div>
                            </li>
                            <div v-if="fileList.length<9">
                                <li v-for="item in (8-fileList.length)"
                                    :key="item"></li>
                            </div>
                        </ul>
                    </div>
                    <!-- 添加附件 -->
                    <input type="file"
                           id="fileupload"
                           ref="uploadId"
                           accept="image/jpg, image/jpeg, image/png, image/gif, image/tif, image/tiff"
                           @change="fileupload"
                           multiple
                           style="display: none" />
                    <el-button class="addingFile"
                               icon="el-icon-adding-file"
                               @click.native="addingfile"></el-button>
                </div>
            </div>
            <div slot="footer"
                 class="dialog-footer">
                <button @click="confirmSend"
                        class="button buttonHighlight">{{ $t('email.DISPLAY_FILE_INFO_SEND_MAIL_BUTTON_SEND') }}
                </button>
            </div>

            <el-dialog :visible.sync="emailSendingConfirmation"
                       :title="$t('email.DISPLAY_FILE_INFO_SEND_MAIL_POPUP_TITLE_CONFIRM_SEND_MAIL')"
                       :close-on-click-modal="false"
                       :before-close="cancellation"
                       :destroy-on-close="true"
                       append-to-body
                       class="emildialog">
                {{ $t('email.MESSAGE_FILE_INFO_SEND_MAIL_POPUP_CONFIRM_SEND_MAIL') }}
                <span slot="footer"
                      class="dialog-footer">
                    <button class="button"
                            @click="cancellation">{{ $t('common.NO') }}</button>
                    <button class="button buttonHighlight margin"
                            @click="beforeSendMail">{{ $t('common.YES') }}</button>
                </span>
            </el-dialog>

            <CloseDialog ref="confirmCancellationDialog"
                         :content="$t('email.MESSAGE_CLOSE_EDIT_WINDOW_CONFIRM')"
                         @cancelClose="$refs.confirmCancellationDialog.show(false)"
                         @close="confirm"></CloseDialog>
        </el-dialog>

        <EmailAddress ref="EmailAddress"
                      :s3nos="selectRecordsNo"
                      :to-user-list="form.toUserList"
                      :cc-user-list="form.ccUserList"
                      :bcc-user-list="form.bccUserList"
                      @SetFromEmailAddress="setFromEmailAddress"></EmailAddress>
    </div>
</template>

<script>
import bus from '@c/bus'
import {bytesToSize} from '@u/filters'

export default {
    name: 'Email',
    components: {
        EmailAddress: resolve => require(['@p/Files/AllFiles/Email/EmailAddress'], resolve),
        CloseDialog: resolve => require(['@c/CloseDialog'], resolve)
    },
    filters: {bytesToSize},
    data () {
        return {
            loading: false,
            dialogVisible: false,
            emailSendingConfirmation: false,
            disabled: false,
            form: { // フォームデータ
                To: '',
                Cc: '',
                Bcc: '',
                toUserList: [],
                ccUserList: [],
                bccUserList: [],
                inputTitle: '',
                textarea: ''
            },
            selectRecordsNo: [], // 選択したファイルS3NOs
            fileSize: 0.0, // ファイルサイズ
            fileList: [], // ファイルリストをアップロード
            fileLists: [],
            fileListIndex: 0, // 文件下标
            fileListsIndex: 0, // 文件Blob下标
            fileCheck: true, // 添付ファイルのアップロードチェック
            filesName: [],
            uploadId: '',
            attachmentGroupId: '',
            ops: {
                vuescroll: {
                    mode: 'native',
                    sizeStrategy: 'percent',
                    detectResize: true
                },
                scrollPanel: {
                    scrollingX: false,
                    scrollingY: true
                },
                rail: {},
                bar: {
                    background: '#999',
                    keepShow: true
                }
            }
        }
    },
    computed: {
        toUsers () {
            let toUserStr = ''
            if (this.form.toUserList && this.form.toUserList.length > 0) {
                for (let i = 0; i < this.form.toUserList.length; i++) {
                    toUserStr += this.form.toUserList[i].NAME
                    toUserStr += ','
                }
                toUserStr.substring(0, toUserStr.length - 2)
            }
            toUserStr = toUserStr.substring(0, toUserStr.length - 1)
            return toUserStr
        },
        ccUsers () {
            let ccUserStr = ''
            if (this.form.toUserList && this.form.ccUserList.length > 0) {
                for (let i = 0; i < this.form.ccUserList.length; i++) {
                    ccUserStr += this.form.ccUserList[i].NAME
                    ccUserStr += ','
                }
                ccUserStr.substring(0, ccUserStr.length - 2)
            }
            ccUserStr = ccUserStr.substring(0, ccUserStr.length - 1)
            return ccUserStr
        },
        bccUsers () {
            let bccUserStr = ''
            if (this.form.toUserList && this.form.bccUserList.length > 0) {
                for (let i = 0; i < this.form.bccUserList.length; i++) {
                    bccUserStr += this.form.bccUserList[i].NAME
                    bccUserStr += ','
                }
                bccUserStr.substring(0, bccUserStr.length - 2)
            }
            bccUserStr = bccUserStr.substring(0, bccUserStr.length - 1)
            return bccUserStr
        }
    },
    mounted () {
        // this.$refs.emailDialog.open
        this.$nextTick(() => {
            bus.$on('showMail', (bool, nos) => {
                this.showMail(bool, nos)
            })
            bus.$on('SetFromMailTemplate', (data) => {
                this.setFromMailTemplate(data)
            })
        })
    },
    methods: {
        /* 监听浏览器刷新事件 */
        beforeunloadHandler (e) {
            if (
                this.form.inputTitle || this.form.To || this.form.Cc ||
                this.form.Bcc || this.form.textarea || this.fileSize > 0
            ) {
                e = e || window.event
                if (e) {
                    e.returnValue = '关闭提示'
                }
                return '关闭提示'
            }
            return
        },
        open () {
            this.$refs.emailDialog.$el.children[0].classList.add('largeDialog')
        },
        showMail (NO) {
            this.dialogVisible = true
            this.selectRecordsNo = []
            this.fileList = []
            this.type = ''
            this.fileSize = 0
            NO.forEach(item => {
                this.selectRecordsNo.push(item)
            })
            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
        },
        // メールテンプレート一覧取得・検索
        getMailTemplates () {
            bus.$emit('emailTemplateSelection', true, false)
        },
        // メールテンプレート画面のコールバック
        setFromMailTemplate (template) {
            this.form.inputTitle = template.name
            this.form.textarea = template.Contents
        },
        // 宛先選択画面へ
        innerVisibleSHOW (type) {
            this.$refs.EmailAddress.emailAddress(type)
        },
        // 宛先選択画面のコールバック
        setFromEmailAddress (sendUserListData, type) {
            console.log(sendUserListData)
            if (type === 'To') {
                this.form.toUserList = []
                this.form.To = ''
            } else if (type === 'Cc') {
                this.form.ccUserList = []
                this.form.Cc = ''
            } else {
                this.form.bccUserList = []
                this.form.Bcc = ''
            }
            for (let i = 0; i < sendUserListData.length; i++) {
                if (sendUserListData[i].TYPE === 'To') {
                    this.form.toUserList.push(sendUserListData[i])
                    this.form.To += ',' + sendUserListData[i].NO + ','
                } else if (sendUserListData[i].TYPE === 'Cc') {
                    this.form.ccUserList.push(sendUserListData[i])
                    this.form.Cc += ',' + sendUserListData[i].NO + ','
                } else {
                    this.form.bccUserList.push(sendUserListData[i])
                    this.form.Bcc += ',' + sendUserListData[i].NO + ','
                }
            }
            this.form.To = unique(
                this.form.To.split(',').filter(function (s) {
                    return s && s.trim()
                })
            ).toString()
            this.form.Cc = unique(
                this.form.Cc.split(',').filter(function (s) {
                    return s && s.trim()
                })
            ).toString()
            this.form.Bcc = unique(
                this.form.Bcc.split(',').filter(function (s) {
                    return s && s.trim()
                })
            ).toString()

            this.form.toUserList = objunique(this.form.toUserList)
            this.form.ccUserList = objunique(this.form.ccUserList)
            this.form.bccUserList = objunique(this.form.bccUserList)
            console.log(this.form.To, this.form.Cc, this.form.Bcc)
            console.log(this.form.toUserList, this.form.ccUserList, this.form.bccUserList)

            // 配列が重い
            function unique (arr) {
                return arr.filter(function (item, index, arr) {
                    // 現在の要素は、元の配列の最初のインデックス=現在のインデックス値であり、そうでなければ現在の要素に戻る
                    // 当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
                    return arr.indexOf(item, 0) === index
                })
            }
            // オブジェクト配列は重い(对象数组去重)
            function objunique (songs) {
                const result = {}
                let item = []
                const finalResult = []
                for (let i = 0; i < songs.length; i++) {
                    // song gs[i].USER_のためですNO重複することはできません。効果を達成するためには、ここで「name」または他のキーを知っておく必要があります。
                    // 因为songs[i].USER_NO不能重复,达到去重效果,且这里必须知晓"name"或是其他键名
                    result[songs[i].NO] = songs[i]
                    item.push(songs[i].NO)
                }
                item = unique(item)
                for (let index = 0; index < item.length; index++) {
                    finalResult.push(result[item[index]])
                }
                // 現在result内部は重複しないオブジェクトであり,そのキー値を取り出して配列に変換するだけでよい
                // 现在result内部都是不重复的对象了，只需要将其键值取出来转为数组即可
                return finalResult
            }
        },
        // 内容监听
        editnameSet (event) {
            this.form.textarea = event.target.innerText
        },
        // 閉じる
        close () {
            if (
                this.form.inputTitle || this.form.To || this.form.Cc ||
                this.form.Bcc || this.form.textarea || this.fileSize > 0
            ) {
                this.$refs.confirmCancellationDialog.show(true)
                return
            }
            this.confirm()
        },
        // 閉じるdialog
        confirm () {
            this.dialogVisible = false

            // 离开页面时,重置data的数据
            Object.assign(this.$data, this.$options.data())
            window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
        },
        // ブラウザ更新時にイベントを呼び出す
        refresh () {
            this.form = {
                To: '',
                Cc: '',
                Bcc: '',
                toUserList: [],
                ccUserList: [],
                bccUserList: [],
                inputTitle: '',
                textarea: ''
            }
            this.fileList = []
            this.selectRecordsNo = []
        },
        // 添付ファイル
        addingfile () {
            document.getElementById('fileupload').click()
        },
        fileupload (event) {
            const fileName = []
            for (let i = 0; i < event.target.files.length; i++) {
                const fileType = event.target.files[i].name.substr(event.target.files[i].name.lastIndexOf('.') + 1)
                if (['jpg', 'jpeg', 'png', 'gif', 'tif', 'tiff'].includes(fileType)) {
                    this.fileCheck = true
                    const size = this.fileSize + event.target.files[i].size
                    if (event.target.files[i].size <= 5242880 && size <= 5242880) {
                        if (this.fileCheck === true && !this.filesName.includes(event.target.files[i].name)) {
                            this.fileList.push(event.target.files[i])
                            this.fileSize += event.target.files[i].size
                            this.filesName.push(event.target.files[i].name)
                        }
                    } else {
                        fileName.push(`\n[${event.target.files[i].name}]\n`)
                    }
                }
            }
            this.$refs.uploadId.value = null
            if (fileName.length > 0) {
                this.$message.warning(`${fileName.toString()}${this.$t('email.MESSAGE_UPLOAD_MAIL_PIC_FAILED')}`)
            }
        },
        // 添付ファイルを削除する
        deleteFile (file) {
            for (let j = 0; j < this.fileList.length; j++) {
                if (this.fileList[j]['lastModified'] === file) {
                    this.fileSize -= this.fileList[j].size
                    this.fileList.splice(j, 1)
                    this.uploadId = ''
                    this.attachmentGroupId = ''
                }
            }
        },
        // 显示
        confirmSend () {
            this.emailSendingConfirmation = true
        },
        // close
        cancellation () {
            // this.fileListIndex = 0
            this.fileListsIndex = 0
            this.emailSendingConfirmation = false
        },
        // 書類を分割する
        splitBlob (file, chunkSize = 0.99 * 1024 * 1024) {
            if (!chunkSize || file.size <= chunkSize) return [file]
            const chunkList = []
            const filesize = file.size
            let start = 0
            let end = 0
            while (start < filesize) {
                end = start + chunkSize
                if (end > filesize) end = filesize
                const chunk = file.slice(start, end)
                chunkList.push(chunk)
                start = end
            }
            return chunkList
        },
        // メールを送る
        beforeSendMail () {
            this.cancellation()
            this.$message.closeAll()
            if (!this.form.To && !this.form.Cc && !this.form.Bcc) {
                this.$message.warning(this.$t('email.MESSAGE_FILE_INFO_SEND_MAIL_NO_CHOICE'))
            } else {
                this.loading = true
                if (this.fileList.length > 0) {
                    this.fileLists = this.splitBlob(this.fileList[this.fileListIndex])
                    this.mailAttachmentUpload(this.fileLists[this.fileListsIndex], this.fileList[this.fileListIndex])
                } else {
                    this.sendMail()
                }
            }
        },
        mailAttachmentUpload (blob, file) {
            const formData = new FormData() // FormDataオブジェクトを作成
            formData.append('file', blob) // 文件数据
            formData.append('fileName', encodeURIComponent(file.name)) // 文件名
            formData.append('totalSize', file.size) // 文件总大小
            formData.append('totalChunks', this.fileLists.length) // 总分片数
            formData.append('chunkNumber', this.fileListsIndex + 1) // 当前分片数
            formData.append('uploadId', this.uploadId)
            formData.append('attachmentGroupId', this.attachmentGroupId)

            this.loading = true

            this.$request.folder.MailAttachmentUpload(formData).then(response => {
                console.log('MailAttachmentUpload-post请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    if (this.fileListsIndex === 0) {
                        this.uploadId = data.result.uploadId
                    }
                    this.attachmentGroupId = data.result.attachmentGroupId
                    this.fileListsIndex += 1
                    console.log('分片', this.fileListsIndex)
                    console.log('上传文件', this.fileListIndex)
                    console.log('总上传文件', this.fileList.length)
                    if (this.fileLists.length === this.fileListsIndex) {
                        if (this.fileListIndex + 1 === this.fileList.length) {
                            this.sendMail()
                        } else {
                            this.uploadId = ''
                            this.fileListsIndex = 0
                            this.fileListIndex += 1
                            this.beforeSendMail()
                        }
                    } else {
                        this.mailAttachmentUpload(this.fileLists[this.fileListsIndex], this.fileList[this.fileListIndex])
                    }
                } else {
                    this.loading = false
                }
            }).catch(err => {
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.mailAttachmentUpload(blob, file) : ''
                    })
                } else {
                    this.error(err, 'MailAttachmentUpload-post请求失败')
                }
            })
        },
        sendMail () {
            this.cancellation()
            this.fileListIndex = 0
            this.loading = true
            const subject = this.$request.replaceMethod(this.form.inputTitle)
            const mailText = this.$request.replaceMethod(this.form.textarea)
            const body = ('{"subject": "' + subject + '","toNoArray": "' + this.form.To + '","ccNoArray": "' + this.form.Cc + '","bccNoArray": "' + this.form.Bcc + '","mailText": "' + mailText + '","s3Nos": "' + this.selectRecordsNo.toString() + '","attachmentGroupId": "' + this.attachmentGroupId + '"}')
            this.$request.folder.Sendmail(body).then(response => {
                console.log('Sendmail-post请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.disabled = false
                    document.getElementById('fileupload').value = ''
                    this.$message.success(this.$t('email.MESSAGE_SUPPORT_UPLOAD_MAIL_COMPLETE_SYNCHRO'))
                    this.confirm()
                }
                this.loading = false
            }).catch(err => {
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.sendMail() : ''
                    })
                } else {
                    this.error(err, 'Sendmail-post失败')
                }
            })
        },
        error (err, title) {
            this.loading = false
            this.disabled = false
            this.fileListsIndex = 0
            this.fileListIndex = 0
            this.uploadId = ''
            this.attachmentGroupId = ''
            // this.fileList = []
            // this.selectRecordsNo = []
            if (err.status >= 400 && err.status < 500) {
                this.confirm()
            }
            this.$request.requestError(title, err)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../less/pages/Files/AllFiles/Email/Email.less");
</style>
