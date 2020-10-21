<template>
    <div id="userAccessDialog">
        <el-dialog :visible.sync="userAccessDialogVisible"
                   :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_USER')"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   class="userAccessDialog"
                   ref="userAccessDialog"
                   @open="open"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="title"
                 :title="checkedUserData.GROUP_USER_NAME ? checkedUserData.GROUP_USER_NAME :checkedUserData.GROUP_NAME">
                <img :src="require('@a/images/usermanagement/usermanagement-user-icon.svg')"
                     :alt="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ALT_USER')">
                {{ checkedUserData.GROUP_USER_NAME || checkedUserData.GROUP_NAME }} {{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_LABLE_FOLDER') }}
            </div>
            <div class="body">
                <vxe-table highlight-hover-row
                           highlight-current-row
                           show-overflow="title"
                           auto-resize
                           row-key
                           ref="xTableUser"
                           border="none"
                           row-id="FOLDER_NO"
                           size="small"
                           :header-cell-style="{
                               'padding': '0',
                               'font-weight': 'unset'
                           }"
                           :cell-class-name="cellClassName"
                           :tree-config="{
                               lazy: true,
                               line: true,
                               children: 'children',
                               hasChild: 'hasChild',
                               loadMethod: loadChildrenMethod,
                               iconClose:'iconfont chexplus-square-o',
                               iconOpen: 'iconfont chexminus-square-o'
                           }"
                           :data="data"
                           class="vxetable"
                           height="95%">
                    <vxe-table-column :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FOLDER')"
                                      align="left"
                                      show-overflow
                                      tree-node>
                        <template v-slot="{ row }">
                            <img class="img folder"
                                 :src="require('@a/images/file/file-tree-icon-12.svg')" />
                            <span class="filenameSpan"
                                  :title="row.FOLDER_NAME">{{ row.FOLDER_NAME }} </span>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TOOLTIP_READ_ICON')"
                                      align="center"
                                      width="60">
                        <template v-slot="{ row }">
                            <div class="imgdiv">
                                <img v-if="row.READ_AUTH_FLG === 'FALSE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                     @click="modify(row, row.READ_AUTH_FLG, readAuthFlg)" />
                                <img v-else-if="row.READ_AUTH_FLG === 'TRUE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                     @click="modify(row, row.READ_AUTH_FLG, readAuthFlg)" />
                                <img v-else
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                            </div>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FILE')"
                                      align="center"
                                      width="90">
                        <template v-slot="{row}">
                            <div v-if="row.READ_AUTH_FLG === 'FALSE'"
                                 class="imgdiv">
                                <img class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                            </div>
                            <div v-else
                                 class="imgdiv">
                                <img v-if="row.FILE_AUTH_FLG === 'TRUE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                     @click="modify(row, row.FILE_AUTH_FLG, fileAuthFlg)" />
                                <img v-else-if="row.FILE_AUTH_FLG === 'FALSE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                     @click="modify(row, row.FILE_AUTH_FLG, fileAuthFlg)" />
                                <img v-else
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                            </div>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FOLDER')"
                                      align="center"
                                      width="90">
                        <template v-slot="{ row }">
                            <div v-if="row.READ_AUTH_FLG === 'FALSE'"
                                 class="imgdiv">
                                <img class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                            </div>
                            <div v-else
                                 class="imgdiv">
                                <img v-if="row.DIR_AUTH_FLG === 'TRUE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                     @click="modify(row, row.DIR_AUTH_FLG, dirAuthFlg)" />
                                <img v-else-if="row.DIR_AUTH_FLG === 'FALSE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                     @click="modify(row, row.DIR_AUTH_FLG, dirAuthFlg)" />
                                <img v-else
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                            </div>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_NOTE')"
                                      align="center"
                                      width="60">
                        <template v-slot="{ row }">
                            <div v-if="row.READ_AUTH_FLG === 'FALSE'"
                                 class="imgdiv">
                                <img class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                            </div>
                            <div v-else
                                 class="imgdiv">
                                <img v-if="row.MEMO_AUTH_FLG === 'TRUE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                     @click="modify(row, row.MEMO_AUTH_FLG, memoAuthFlg)" />
                                <img v-else-if="row.MEMO_AUTH_FLG === 'FALSE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                     @click="modify(row, row.MEMO_AUTH_FLG, memoAuthFlg)" />
                                <img v-else
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                            </div>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_REMARKS')"
                                      align="center"
                                      width="180">
                        <template v-slot="{ row }">
                            <div class="groupFlg">
                                <div v-if="row.EX_FLG === 'TRUE' && row.PROHIBIT_PRIORITY_FLG === 'FALSE'"
                                     style="padding: 10.5px 0px;">
                                    <p style="color: #4146CD;">{{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING') }}</p>
                                </div>
                                <div v-if="row.EX_FLG === 'FALSE' && row.PROHIBIT_PRIORITY_FLG === 'TRUE'"
                                     style="padding: 10.5px 0px;">
                                    <p style="color: #D61918;">{{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_PROHIBITION_PRIORITY') }}</p>
                                </div>
                                <div v-if="row.EX_FLG === 'TRUE' && row.PROHIBIT_PRIORITY_FLG === 'TRUE'">
                                    <p style="color: #4146CD;">{{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING') }}</p>
                                    <p style="color: #D61918;">{{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_PROHIBITION_PRIORITY') }}</p>
                                </div>
                            </div>
                            <img v-if="row.DERIVATION !== 'USER'"
                                 class="groupSetting"
                                 :src="require('@a/images/usermanagement/usermanagement-setting.svg')"
                                 @click="individualSettings(row)" />
                        </template>
                    </vxe-table-column>
                    <!--
                    <template v-slot:empty>
                        <span>
                            <p>データがありません</p>
                        </span>
                    </template> -->
                </vxe-table>
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <!-- <buttouserAccessDialogShowEventn class="button buttonHighlight allSave"
                        @click="show">
                    {{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_SAME_SETTINGS') }}
                </buttouserAccessDialogShowEventn> -->
                <button class="button buttonHighlight"
                        @click="save(false)">
                    {{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_REGISTER') }}
                </button>
            </span>

            <el-dialog :visible.sync="applyToFoldersBelow"
                       :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_SAME_SETTINGS_DIALOG_TITLE')"
                       :close-on-click-modal="false"
                       :before-close="applyToFoldersBelowClose"
                       :destroy-on-close="true"
                       append-to-body
                       class="editdialog">
                {{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_SAME_SETTINGS_DIALOG_BODY') }}
                <span slot="footer"
                      class="dialog-footer">
                    <button class="button buttonHighlight margin"
                            @click="allSave">{{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_SAME_SETTINGS_DIALOG_BUTTON') }}</button>
                </span>
            </el-dialog>
            <el-dialog :visible.sync="toFoldersBelowClose"
                       :title="$t('common.DialogConfirmCancelTitle')"
                       :close-on-click-modal="false"
                       :before-close="cancel"
                       :destroy-on-close="true"
                       append-to-body
                       class="groupingdialog">
                <p v-html="$t('common.DialogConfirmCancelContent')">{{ $t('common.DialogConfirmCancelContent') }}</p>
                <span slot="footer"
                      class="dialog-footer">
                    <button class="button"
                            @click="cancel">{{ $t('common.DialogConfirmCancelButton1') }}</button>
                    <button class="button buttonDelete margin"
                            @click="confirm">{{ $t('common.DialogConfirmCancelButton2') }}</button>
                </span>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'UserAccessDialog',
    data () {
        return {
            loading: false,
            userAccessDialogVisible: false,
            applyToFoldersBelow: false,
            toFoldersBelowClose: false,
            checkedUserData: {}, // 选中组数据
            data: [], // 文件树数据
            dataStringify: '[]', // 文件树初始数据
            dataStringifys: [], // 文件树转字符串数据
            readAuthFlg: 'READ_AUTH_FLG',
            fileAuthFlg: 'FILE_AUTH_FLG',
            dirAuthFlg: 'DIR_AUTH_FLG',
            memoAuthFlg: 'MEMO_AUTH_FLG',
            rowData: {}
        }
    },
    // 离开页面时,重置data的数据
    destroyed () {
        Object.assign(this.$data, this.$options.data())
        window.removeEventListener('beforeunload', this.beforeunloadHandlerUserAccessDialog, false)
    },
    methods: {
        // 浏览器刷新事件
        beforeunloadHandlerUserAccessDialog (e) {
            const beforeunload = this.dataStringify !== JSON.stringify(this.data)
            console.log('利用者管理-->权限-->user')
            if (beforeunload) {
                e = e || window.event
                if (e) e.returnValue = '关闭提示'
                return beforeunload
            }
            return
        },
        // 取消退出
        cancel () {
            this.toFoldersBelowClose = false
        },
        // 确认退出
        confirm () {
            this.toFoldersBelowClose = false
            this.userAccessDialogVisible = false
            window.removeEventListener('beforeunload', this.beforeunloadHandlerUserAccessDialog, false)
        },
        // 修改アクセス権限設定的数据
        modify (row, flg, flgname) {
            if (row.READ_AUTH_FLG === 'FALSE' && flgname !== 'READ_AUTH_FLG') {
                return
            }
            if (flg === 'TRUE') {
                row[flgname] = 'FALSE'
            } else if (flg === 'FALSE') {
                row[flgname] = 'TRUE'
            }
            for (let index = 0; index < this.dataStringifys.length; index++) {
                if (this.dataStringifys[index].NO === row.FOLDER_NO) {
                    if (this.dataStringifys[index].data[flgname] === row[flgname]) {
                        row.STATUS = 'initial'
                    } else {
                        row.STATUS = 'update'
                    }
                }
            }
        },
        // 懒加载表格数据 || ローディングテーブルデータ
        loadChildrenMethod ({row}) {
            // 非同期的に子ノードをロードする（异步加载子节点）
            return this.accessAuth(row.FOLDER_NO)
        },
        // 権限を得る（获取权限）
        accessAuth (NO) {
            const body = (`{"GROUPNO": "", "USERNO": "${this.checkedUserData.GROUP_USER_NO}"}`)
            return this.$request.access.AccessAuth(NO, body).then(response => {
                console.log('AccessAuth-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    for (let index = 0; index < data.result.length; index++) {
                        data.result[index].STATUS = 'initial'
                    }
                    for (let index = 0; index < data.result.length; index++) {
                        this.dataStringifys.push({
                            NO: data.result[index].FOLDER_NO,
                            data: JSON.parse(JSON.stringify(data.result[index]))
                        })
                    }
                    return data.result
                }
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.accessAuth(NO) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`AccessAuth-get请求失败:`, err, 'UserAccessDialog')
                }
            })
        },
        open () {
            this.$refs.userAccessDialog.$el.children[0].classList.add('largeDialog')
        },
        userAccessDialogShowEvent (checkedUserData, data) {
            this.userAccessDialogVisible = true
            this.checkedUserData = checkedUserData // 选中的组数据
            for (let index = 0; index < data.length; index++) { // 文件树初始数据-字符串数组
                data[index].STATUS = 'initial'
                this.dataStringifys.push({
                    NO: data[index].FOLDER_NO,
                    data: JSON.parse(JSON.stringify(data[index]))
                })
            }
            this.dataStringify = JSON.stringify(data) // 文件树数据
            this.data = JSON.parse(JSON.stringify(data)) // 文件树初始数据-字符串
            window.addEventListener('beforeunload', this.beforeunloadHandlerUserAccessDialog, false)
        },
        // show
        show () {
            if (this.dataStringify === JSON.stringify(this.data)) {
                return
            }
            this.applyToFoldersBelow = true
        },
        allSave () {
            this.applyToFoldersBelowClose()
            this.save(true)
        },
        save (bool = false) {
            if (this.dataStringify === JSON.stringify(this.data)) {
                return
            }
            this.loading = true
            const body = (
                `{"AUTH_LIST":${JSON.stringify(this.data)},"ADAPTATION": "${bool}","ISUSER":"TRUE"}`
            )
            this.$request.access.AccessAuthUserGroup(
                this.checkedUserData.GROUP_USER_NO || this.checkedUserData.GROUP_NO, body
            ).then(response => {
                console.log('AccessAuthUserGroup-pacth请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]' && data !== '') {
                    this.$message.success(this.$t('userAccessDialog.MESSAGE_UPDATA_SUCCESS'))
                    this.confirm()
                    this.$emit('accessAuth')
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.save(bool) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`AccessAuthUserGroup-pacth请求失败:`, err, 'UserAccessDialog')
                }
            })
        },
        // 关闭
        close () {
            if (this.dataStringify !== JSON.stringify(this.data)) {
                this.toFoldersBelowClose = true
            } else {
                this.confirm()
            }
        },
        // close
        applyToFoldersBelowClose () {
            this.applyToFoldersBelow = false
        },
        cellClassName ({row}) {
            if (row.STATUS === 'update') {
                return 'td__update'
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../../less/pages/UserManagement/PermissionManagement/tabsView/dialog/AccessDialog.less");
</style>
