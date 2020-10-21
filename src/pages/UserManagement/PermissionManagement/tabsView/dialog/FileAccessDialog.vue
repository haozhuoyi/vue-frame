<template>
    <div id="fileAccessDialog">
        <el-dialog :visible.sync="fileAccessDialogVisible"
                   :title="$t('fileAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FOLDER')"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   custom-class="fileAccessDialog"
                   class="fileAccessDialog">
            <div class="body"
                 v-loading="loading"
                 :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(255,255,255,.4)">
                <div class="title"
                     :title="fileAccessDialogData.FOLDER_NAME">
                    <img :src="require('@a/images/file/file-folder-05.svg')"
                         :alt="$t('fileAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_FOLDER_ICON')">
                    {{ fileAccessDialogData.FOLDER_NAME }} {{ $t('fileAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_LABLE_FOLDER') }}
                </div>
                <div class="layoutThree left">
                    <div class="tit">
                        {{ $t('fileAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_ACCESS_IMPOSSIBLE') }}
                    </div>
                    <Tabs ref="tabs"
                          :groups-data="groupsData"
                          :user-data="userData"
                          @removeChecked="removeChecked"
                          @LiClickEvent="liClickEvent"
                          @LgClickEvent="lgClickEvent"></Tabs>
                </div>
                <div class="layoutThree center">
                    <div>
                        <headButtonO :dat="imgDataO"
                                     @handleCommand="handleCommand"></headButtonO>
                    </div>
                </div>
                <div class="layoutThree right">
                    <div class="tit">{{ $t('fileAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_ACCESS_POSSIBLE') }}</div>
                    <FileAccessDialogList ref="FileAccessDialogList"
                                          :file-table-data="fileTreeTableData"
                                          :listtable="true"
                                          @LClickEvent="lClickEvent"
                                          @addEvent="addEvent"
                                          @removeEvent="removeEvent"></FileAccessDialogList>
                </div>
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <button class="button buttonHighlight all"
                        @click="applyToFoldersBelowEvent">{{ $t('fileAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_SAME_SETTINGS') }}</button>
                <button class="button buttonHighlight"
                        @click="ok">{{ $t('fileAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_REGISTER') }}</button>
            </span>

            <el-dialog :visible.sync="applyToFoldersBelow"
                       :title="$t('fileAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_SAME_SETTINGS_DIALOG_TITLE')"
                       :close-on-click-modal="false"
                       :before-close="applyToFoldersBelowClose"
                       :destroy-on-close="true"
                       append-to-body
                       class="editdialog">
                <!-- フォルダAの権限設定を配下のフォルダにも適用しますか？ -->
                {{ $t('fileAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_SAME_SETTINGS_DIALOG_BODY') }}
                <span slot="footer"
                      class="dialog-footer">
                    <button class="button buttonHighlight"
                            @click="all">{{ $t('fileAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_SAME_SETTINGS_DIALOG_BUTTON') }}</button>
                </span>
            </el-dialog>

            <el-dialog :visible.sync="toFoldersBelowClose"
                       :title="$t('common.DialogConfirmCancelTitle')"
                       :close-on-click-modal="false"
                       :before-close="toFoldersBelowCloseEvent"
                       :destroy-on-close="true"
                       append-to-body
                       class="groupingdialog">
                <p v-html="$t('common.DialogConfirmCancelContent')">{{ $t('common.DialogConfirmCancelContent') }}</p>
                <span slot="footer"
                      class="dialog-footer">
                    <button class="button"
                            @click="toFoldersBelowCloseEvent">{{ $t('common.DialogConfirmCancelButton1') }}</button>
                    <button class="button buttonDelete margin"
                            @click="confirm">{{ $t('common.DialogConfirmCancelButton2') }}</button>
                </span>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
import bus from '@c/bus'
import Tabs from '@p/UserManagement/PermissionManagement/tabsView/components/Tabs'
import FileAccessDialogList from '@p/UserManagement/PermissionManagement/tabsView/dialog/FileAccessDialogList'

export default {
    name: 'FileAccessDialog',
    components: {
        Tabs, FileAccessDialogList, headButtonO: resolve => require(['@c/HeadButton'], resolve)
    },
    data () {
        return {
            loading: false,
            fileAccessDialogVisible: false,
            applyToFoldersBelow: false,
            toFoldersBelowClose: false,
            imgDataO: [
                {
                    name: 'fileAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_BUTTON_ADD',
                    image: require('@a/images/usermanagement/usermanagemen-tree-add.svg')
                },
                {
                    name: 'fileAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_BUTTON_DELETE',
                    image: require('@a/images/usermanagement/usermanagemen-tree-dele.svg')
                }
            ],
            fileAccessDialogData: {}, // 选中的文件夹数据
            fileTreeTableData: {}, // 指定文件夹的组与人员数据
            groupsData: [], // 组列表数据
            userData: [], // 人员列表数据
            lClickEventData: [], // 选中的 `アクセス可能` 的数据
            liClickEventData: [], // 选中的 `利用者` 数据
            lgClickEventData: [] //  选中的 `グループ` 的数据
        }
    },
    mounted () {
        this.$nextTick(() => {
            bus.$on('UserConfirmationWithinTheGroupClose', () => {
                this.fileAccessDialogVisible = false
            })
        })
    },
    methods: {
        fileAccessDialogShowEvent (fileAccessDialogData, fileTreeTableData) {
            if (fileTreeTableData.S3_NO > 1) {
                this.fileAccessDialogVisible = true
                // JSON.parse(JSON.stringify(data数据)): 深拷贝, 不会改变被拷贝的对象
                this.fileAccessDialogData = JSON.parse(JSON.stringify(fileAccessDialogData))
                this.fileTreeTableData = fileTreeTableData ? JSON.parse(JSON.stringify(fileTreeTableData)) : {AUTH_LIST: []}
                this.FileTreeTableDataStringify = JSON.stringify(this.fileTreeTableData)
                this.groupsData = []
                this.userData = []
                this.addEvent()
                this.getGroups()
            }
        },
        // 浏览器刷新事件
        beforeunloadHandlerFileAccessDialog (e) {
            console.log(this.FileTreeTableDataStringify, JSON.stringify(this.fileTreeTableData))
            const beforeunload = this.FileTreeTableDataStringify !== JSON.stringify(this.fileTreeTableData)
            console.log('利用者管理-->权限-->tree')
            if (beforeunload) {
                e = e || window.event
                if (e) e.returnValue = '关闭提示'
                return beforeunload
            }
            return
        },
        addEvent () {
            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', this.beforeunloadHandlerFileAccessDialog, false)
        },
        removeEvent () {
            window.removeEventListener('beforeunload', this.beforeunloadHandlerFileAccessDialog, false)
        },
        // 取消退出
        toFoldersBelowCloseEvent () {
            this.toFoldersBelowClose = false
        },
        // 确认退出
        confirm () {
            this.fileAccessDialogVisible = false
            this.toFoldersBelowClose = false
            this.removeEvent()
        },
        handleCommand (command) {
            if (command === '追加' || command === '添加' || command === 'Add') {
                this.add()
            } else {
                this.del()
            }
        },
        add () {
            if (this.liClickEventData.length === 0 && this.lgClickEventData.length === 0) {
                return
            }
            const type =
                this.liClickEventData.length > 0 ? 'liClickEventData'
                    : this.lgClickEventData.length > 0 ? 'lgClickEventData' : ''
            if (type === '') {
                return
            }
            let repetition = ''
            for (let i = this.fileTreeTableData.AUTH_LIST.length - 1; i >= 0; i--) { // 可访问的人或组
                if (type === 'liClickEventData') { // 不可访问的人
                    if (this.fileTreeTableData.AUTH_LIST[i].DERIVATION === 'USER') {
                        continue
                    }
                    for (let j = this[type].length - 1; j >= 0; j--) {
                        if (this.fileTreeTableData.AUTH_LIST[i].USERLIST.indexOf(this[type][j].GROUP_USER_NO) !== -1) {
                            repetition += this[type][j].GROUP_USER_NAME + ','
                            this[type].splice(j, 1)
                        }
                    }
                } else if (type === 'lgClickEventData') { // 不可访问的组
                    if (this.fileTreeTableData.AUTH_LIST[i].DERIVATION === 'GROUP') {
                        continue
                    }
                    for (let j = this[type].length - 1; j >= 0; j--) {
                        if (this[type][j].USERLIST.indexOf(this.fileTreeTableData.AUTH_LIST[i].GROUP_USER_NO) !== -1) {
                            repetition += this[type][j].GROUP_USER_NAME + ','
                            this[type].splice(j, 1)
                        }
                    }
                }
            }
            // console.log(this[type], repetition)
            if (repetition) {
                this.$message({
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                    message: `<strong>${this.$t('fileAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_ACCESS_IMPOSSIBLE')}: [${repetition}] ${this.$t('fileAccessDialog.MESSAGE_GROUP_ADD_AILED')}</strong>`
                })
            }

            const objectKey = type === 'liClickEventData' ? 'userData' : type === 'lgClickEventData' ? 'groupsData' : ''
            for (let i = 0; i < this[type].length; i++) {
                for (let j = 0; j < this[objectKey].length; j++) {
                    if (this[type][i].ID === this[objectKey][j].ID) {
                        this[objectKey].splice(j, 1)
                    }
                }
                this[type][i].READ_AUTH_FLG = 'TRUE'
                this[type][i].FILE_AUTH_FLG = 'FALSE'
                this[type][i].DIR_AUTH_FLG = 'FALSE'
                this[type][i].MEMO_AUTH_FLG = 'FALSE'
                this[type][i].EX_FLG = 'FALSE'
                this[type][i].PROHIBIT_PRIORITY_FLG = 'FALSE'
                this[type][i].STATUS = 'insert'
                // for (let i1 = this.fileTreeTableData.AUTH_LIST.length - 1; i1 >= 0; i1--) { // 可访问的人或组
                //     if (this.fileTreeTableData.AUTH_LIST[i1].DERIVATION === 'GROUP' && this[type][i].DERIVATION === 'GROUP' && this.fileTreeTableData.AUTH_LIST[i1].children) {
                //         for (let j = this.fileTreeTableData.AUTH_LIST[i1].children.length - 1; j >= 0; j--) {
                //             if (
                //                 this[type][i].USERLIST.indexOf(
                //                     this.fileTreeTableData.AUTH_LIST[i1].children[j].USER_NO) !== -1
                //             ) {
                //                 this[type][i].PROHIBIT_PRIORITY_FLG = 'TRUE'
                //             }
                //         }
                //     }
                // }

                // 新增(标记)
                const USER_NO_COMPARED = []
                for (let i1 = this.fileTreeTableData.AUTH_LIST.length - 1; i1 >= 0; i1--) { // 可访问的人或组
                    if (this.fileTreeTableData.AUTH_LIST[i1].DERIVATION === 'GROUP' && this[type][i].DERIVATION === 'GROUP' && this.fileTreeTableData.AUTH_LIST[i1].children) {
                        for (let j = this.fileTreeTableData.AUTH_LIST[i1].children.length - 1; j >= 0; j--) {
                            if (
                                this[type][i].USERLIST.indexOf(
                                    this.fileTreeTableData.AUTH_LIST[i1].children[j].USER_NO) !== -1 && USER_NO_COMPARED.indexOf(this.fileTreeTableData.AUTH_LIST[i1].children[j].USER_NO) === -1
                            ) {
                                this.fileTreeTableData.AUTH_LIST[i1].PROHIBIT_PRIORITY_FLG = 'TRUE'
                                this.fileTreeTableData.AUTH_LIST[i1].children[j].PROHIBIT_PRIORITY_FLG = 'TRUE'
                                if (this.fileTreeTableData.AUTH_LIST[i1].FILE_AUTH_FLG === 'FALSE' && this.fileTreeTableData.AUTH_LIST[i1].DIR_AUTH_FLG === 'FALSE' && this.fileTreeTableData.AUTH_LIST[i1].MEMO_AUTH_FLG === 'FALSE') {
                                    this.fileTreeTableData.AUTH_LIST[i1].PROHIBIT_PRIORITY_FLG = 'FALSE'
                                }
                                USER_NO_COMPARED.push(this.fileTreeTableData.AUTH_LIST[i1].children[j].USER_NO)
                            }
                        }
                    }
                }
                // 新增(标记)

                this.fileTreeTableData.AUTH_LIST.push(this[type][i])
            }
            this.$refs.tabs.handleClick()
            this.$refs.FileAccessDialogList.fileAccessDialogList()
        },
        del () {
            if (this.lClickEvent.length === 0) {
                return
            }
            const subscript = []
            for (let i = 0; i < this.lClickEventData.length; i++) {
                if (this.lClickEventData[i].DERIVATION === 'USER') {
                    this.userData.push(this.lClickEventData[i])
                } else if (this.lClickEventData[i].DERIVATION === 'GROUP') {
                    this.groupsData.push(this.lClickEventData[i])

                    // 新增(标记)
                    const dataAfterDelete = this.fileTreeTableData.AUTH_LIST.filter((item) => (item.ID !== this.lClickEventData[i].ID && item.DERIVATION === 'GROUP'))
                    for (let i1 = dataAfterDelete.length - 1; i1 >= 0; i1--) { // 可访问的人或组
                        if (this.lClickEventData[i].DERIVATION === 'GROUP' && dataAfterDelete[i1].children) {
                            const userList = []
                            this.lClickEventData[i].children.forEach((item) => {
                                userList.push(item.USER_NO)
                            })
                            userList.forEach((item) => {
                                const repeatUserGroup = []
                                dataAfterDelete.forEach((item1) => {
                                    if (item1.USERLIST.indexOf(item) !== -1) {
                                        repeatUserGroup.push(item1)
                                    }
                                })
                                if (repeatUserGroup.length === 1) {
                                    dataAfterDelete[i1].PROHIBIT_PRIORITY_FLG = 'FALSE'
                                }
                                // else if (repeatUserGroup.length >= 2) {
                                //     console.log(repeatUserGroup)
                                // }
                            })
                        }
                    }
                    // 新增(标记)

                }
                for (let j = 0; j < this.fileTreeTableData.AUTH_LIST.length; j++) {
                    if (this.lClickEventData[i].ID === this.fileTreeTableData.AUTH_LIST[j].ID) {
                        subscript.push(this.fileTreeTableData.AUTH_LIST[j].ID)
                    }
                }
            }
            const AUTH_LIST = this.fileTreeTableData.AUTH_LIST.filter(d => {
                return subscript.toString().indexOf(d.ID) === -1
            })
            this.fileTreeTableData.AUTH_LIST = AUTH_LIST
            this.lClickEventData = []
            // 清空选中状态
            this.$refs.tabs.handleClick()
            this.$refs.FileAccessDialogList.fileAccessDialogList()
        },
        lClickEvent (itme) {
            this.lClickEventData = itme
        },
        liClickEvent (itme) {
            this.liClickEventData = itme
        },
        lgClickEvent (itme) {
            this.lgClickEventData = itme
        },
        removeChecked () {
            this.lClickEventData = []
            this.liClickEventData = []
            this.lgClickEventData = []
        },
        // グループ取得
        getGroups () {
            this.loading = true
            const body = (`{"GroupName": "","S3NO": "${this.fileTreeTableData.S3_NO}"}`)
            this.$request.access.AccessAuthGroups(body).then(response => {
                console.log('AccessAuthGroups-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.groupsData = data.result
                    this.getUserManagement()
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getGroups() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`AccessAuthGroups-get请求失败:`, err, 'FileAccessDialog')
                }
            })
        },
        // 利用者情報取得
        getUserManagement () {
            this.loading = true
            const body = (`{"NAME": "","S3NO": "${this.fileTreeTableData.S3_NO}"}`)
            this.$request.access.AccessAuthUsers(body).then(response => {
                console.log('AccessAuthUsers-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.userData = data.result
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getUserManagement() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`AccessAuthUsers-get请求失败:`, err, 'FileAccessDialog')
                }
            })
        },
        applyToFoldersBelowEvent () {
            if (this.FileTreeTableDataStringify === JSON.stringify(this.fileTreeTableData)) {
                return
            }
            this.applyToFoldersBelow = true
        },
        all () {
            this.loading = true
            const body =
                    (`{"AUTH_LIST":${JSON.stringify(this.fileTreeTableData.AUTH_LIST)},"ADAPTATION": "true"}`)
            this.$request.access.AccessAuthModify(this.fileTreeTableData.S3_NO, body).then(response => {
                console.log('AccessAuthModify-pacth请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]' && data !== '') {
                    this.$message.success(this.$t('fileAccessDialog.MESSAGE_UPDATA_SUCCESS'))
                    this.applyToFoldersBelowClose()
                    this.confirm()
                    this.$emit('fileAccess', this.fileAccessDialogData)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.all() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`AccessAuthModify-pacth请求失败:`, err, 'FileAccessDialog')
                }
            })
        },
        ok () {
            if (this.FileTreeTableDataStringify === JSON.stringify(this.fileTreeTableData)) {
                return
            }
            this.loading = true
            const body =
                    (`{"AUTH_LIST":${JSON.stringify(this.fileTreeTableData.AUTH_LIST)},"ADAPTATION": "false"}`)

            this.$request.access.AccessAuthModify(this.fileTreeTableData.S3_NO, body).then(response => {
                console.log('AccessAuthModify-pacth请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]' && data !== '') {
                    this.$message.success(this.$t('fileAccessDialog.MESSAGE_UPDATA_SUCCESS'))
                    this.confirm()
                    this.$emit('fileAccess', this.fileAccessDialogData)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.ok() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`AccessAuthModify-pacth请求失败:`, err, 'FileAccessDialog')
                }
            })
        },
        close () {
            if (this.FileTreeTableDataStringify !== JSON.stringify(this.fileTreeTableData)) {
                this.toFoldersBelowClose = true
            } else {
                this.confirm()
            }
        },
        applyToFoldersBelowClose () {
            this.applyToFoldersBelow = false
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../../less/pages/UserManagement/PermissionManagement/tabsView/dialog/FileAccessDialog.less");
</style>
