<template>
    <div id="userInformationEdit">
        <el-dialog :visible.sync="dialogVisible"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   :title="title">
            <div v-loading="loading"
                 :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(255,255,255,.4)">
                <div class="transitionBox">
                    <!-- ログインID -->
                    <div class="head">
                        <label>{{ $t('UserManagementU.DISPLAY_USER_INFO_USER_ADD_LOGIN_ID') }}</label>
                        <input ref="loginIdInput"
                               v-change
                               type="text"
                               class="input"
                               :disabled="flag || message === $t('UserManagementU.ChangeEmailAddress')"
                               v-model="formLabelAlign.loginId">
                    </div>
                    <!-- 利用者名 -->
                    <div class="head">
                        <label>{{ $t('UserManagementU.DISPLAY_USER_INFO_USER_ADD_USER_NAME') }}</label>
                        <input v-change
                               type="text"
                               class="input"
                               :disabled="message === $t('UserManagementU.ChangeEmailAddress')"
                               v-model="formLabelAlign.username">
                    </div>
                    <!-- よみがな -->
                    <div class="head">
                        <label>{{ $t('UserManagementU.DISPLAY_USER_INFO_USER_ADD_PHONETIC') }}</label>
                        <input v-change
                               type="text"
                               class="input"
                               :disabled="message === $t('UserManagementU.ChangeEmailAddress')"
                               v-model="formLabelAlign.phonetic">
                    </div>
                    <!-- メールアドレス(email) -->
                    <div class="head">
                        <label>{{ $t('UserManagementU.DISPLAY_USER_INFO_USER_ADD_MAILADDRESS') }}</label>
                        <input ref="ChangeEmailAddressInput"
                               v-change
                               type="text"
                               class="input"
                               v-model="formLabelAlign.email">
                    </div>
                    <!-- 所属 -->
                    <div class="head">
                        <label>{{ $t('UserManagementU.DISPLAY_USER_INFO_USER_ADD_BELONGING') }}</label>
                        <el-select v-model="formLabelAlign.belongingName"
                                   :disabled="!admin || message === $t('UserManagementU.ChangeEmailAddress')">
                            <el-option v-for="item in selectionBoxData.BELONG"
                                       :key="item.NO"
                                       :label="item.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : item.BELONGING_NAME"
                                       :value="item.NO"
                                       :title="item.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : item.BELONGING_NAME"
                                       style="width: 340px;">
                            </el-option>
                        </el-select>
                        <img class="selectIcon"
                             :src="require('@a/images/select-icon.svg')"
                             @click="selectOption($event)">
                    </div>
                    <!-- 権限 -->
                    <div class="head">
                        <label>{{ $t('UserManagementU.DISPLAY_USER_INFO_USER_ADD_AUTHORITY') }}</label>
                        <el-select v-model="formLabelAlign.access"
                                   :placeholder="$t('UserManagementU.DialogInputPLACEHOLDE')"
                                   :disabled="(!admin || message === $t('UserManagementU.ChangeEmailAddress') || editYourself) && flag">
                            <el-option v-for="item in selectionBoxData.ACCESS"
                                       :key="item.NO"
                                       :label="$t(item.i18n)"
                                       :value="item.NO">
                            </el-option>
                        </el-select>
                        <img class="selectIcon"
                             :src="require('@a/images/select-icon.svg')"
                             @click="selectOption($event)">
                    </div>
                    <!-- 状態 -->
                    <div class="head"
                         v-show="message.length>0">
                        <label>{{ $t('UserManagementU.DialogUserInformationEditInputTitle') }}</label>
                        <span class="text"
                              style="height:auto;">{{ message }}</span>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="footer">
                    <button v-if="flag"
                            :class="['button', 'emailResend', menuDatas.PROCEDURE_UPDATE_MAILADDRESS===0 && menuDatas.PROCEDURE_INSERT_USER===0 ? 'disabled' : '']"
                            @click="changeEmail">{{ $t('UserManagementU.DialogUserInformationEditButton1') }}</button>
                    <span v-show="flag"
                          class="text"
                          :style="$i18n.locale === 'cn' ? 'line-height: 32px;' : ''">
                        {{
                            menuDatas.PROCEDURE_UPDATE_MAILADDRESS === 1 ?
                                $t('UserManagementU.DISPLAY_USER_INFO_USER_EDIT_RESEND_MAIL_NOTE1') :
                                menuDatas.PROCEDURE_INSERT_USER === 1 ?
                                    $t('UserManagementU.DISPLAY_USER_INFO_USER_EDIT_RESEND_MAIL_NOTE2'): ''
                        }}
                    </span>
                    <button :class="['button', 'buttonHighlight', buttonDisabled ? 'disabled' : '']"
                            @click="userInformationEdit">
                        <!--    {{ flag ? $t('UserManagementU.DISPLAY_USER_INFO_USER_EDIT_BUTTON_EDIT') : $t('UserManagementU.DISPLAY_USER_INFO_USER_ADD_BUTTON_ADD') }} -->
                        {{ flag ? $t('index.DialogButton1') : $t('index.DialogButton2') }}
                    </button>
                </div>
            </div>
            <el-dialog :visible.sync="applyToFoldersBelow"
                       :title="$t('common.DialogConfirmCancelTitle')"
                       :close-on-click-modal="false"
                       :before-close="applyToFoldersBelowClose"
                       :destroy-on-close="true"
                       append-to-body
                       class="userdialog">
                <p v-html="$t('common.DialogConfirmCancelContent')">{{ $t('common.DialogConfirmCancelContent') }}</p>
                <span slot="footer"
                      class="dialog-footer">
                    <button class="button"
                            @click="applyToFoldersBelowClose">{{ $t('common.DialogConfirmCancelButton1') }}</button>
                    <button class="button buttonDelete margin"
                            @click="confirm">{{ $t('common.DialogConfirmCancelButton2') }}</button>
                </span>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
import bus from '@c/bus'

export default {
    name: 'UserInformationEdit',
    data () {
        return {
            dialogVisible: false,
            applyToFoldersBelow: false,
            loading: false,
            flag: false,
            admin: true,
            editYourself: true,
            title: '',
            menuDatas: {},
            selectionBoxData: {},
            formLabelAlign: {
                no: '',
                loginId: '',
                username: '',
                phonetic: '',
                email: '',
                belongingName: '',
                access: ''
            },
            buttonDisabled: true,
            message: ''
        }
    },
    watch: {
        'formLabelAlign': {
            handler (newValue) {
                if (this.flag) {
                    if (this.formLabelAlign.no) {
                        if (
                            newValue.username !== this.menuDatas.NAME ||
                        newValue.phonetic !== this.menuDatas.PHONETIC ||
                        newValue.loginId !== this.menuDatas.USER_ID ||
                        newValue.email !== this.menuDatas.MAILADDRESS ||
                        newValue.belongingName !== this.menuDatas.BELONGING_NO ||
                        newValue.access !== this.menuDatas.AUTHORITY_NO
                        ) {
                            this.buttonDisabled = false
                        } else {
                            this.buttonDisabled = true
                        }
                    }
                } else {
                    if (
                        newValue.username !== '' ||
                        newValue.phonetic !== '' ||
                        newValue.loginId !== '' ||
                        newValue.email !== '' ||
                        newValue.belongingName !== this.menuDatas.BELONGINGNAME || newValue.access !== ''
                    ) {
                        this.buttonDisabled = false
                    } else {
                        this.buttonDisabled = true
                    }
                }
            },
            deep: true
        }
    },
    methods: {
        // 浏览器刷新事件
        beforeunloadHandlerUserInformationEdit (e) {
            console.log('利用者管理-->利用者管理-->利用者', this.buttonDisabled)
            if (!this.buttonDisabled) {
                e = e || window.event
                if (e) {
                    e.returnValue = '关闭提示'
                }
                return !this.buttonDisabled
            }
            return
        },
        // select show event
        selectOption (event) {
            const e = event.target.previousElementSibling || event.target.previousSibling
            e.click()
        },
        // close
        applyToFoldersBelowClose () {
            this.applyToFoldersBelow = false
        },
        confirm () {
            this.applyToFoldersBelowClose()
            this.dialogVisible = false
            this.formLabelAlign.no = ''
            this.formLabelAlign.loginId = ''
            this.formLabelAlign.username = ''
            this.formLabelAlign.phonetic = ''
            this.formLabelAlign.email = ''
            this.formLabelAlign.access = ''
            window.removeEventListener('beforeunload', this.beforeunloadHandlerUserInformationEdit, false)
        },
        show (flag, menuDatas) {
            Object.assign(this.$data, this.$options.data())
            this.dialogVisible = true
            this.flag = flag
            const menuData = JSON.parse(JSON.stringify(menuDatas))
            if (flag) {
                this.title = this.$t('UserManagementU.DialogUserInformationEditTitle1')
                this.formLabelAlign.no = menuData.NO
                this.formLabelAlign.loginId = menuData.USER_ID
                this.formLabelAlign.username = menuData.NAME
                this.formLabelAlign.phonetic = menuData.PHONETIC
                this.formLabelAlign.email = menuData.MAILADDRESS
                this.formLabelAlign.belongingName = menuData.BELONGING_NO
                this.menuDatas = menuData
                if (menuData.PROCEDURE_INSERT_USER !== 0) {
                    this.message = this.$t('UserManagementU.DISPLAY_USER_INFO_DG_USER_REMARKS_NOTE1')
                } else if (menuData.PROCEDURE_UPDATE_MAILADDRESS !== 0) {
                    this.message = this.$t('UserManagementU.ChangeEmailAddress')
                } else {
                    this.message = ''
                }
                this.editYourself = menuData.USER_ID === this.$store.state.userInfo.userId
                this.admin = this.$store.state.userInfo.isAdmin || this.$store.state.userInfo.authorityName === 'プロジェクト管理者'
                this.selectionBox(menuData.AUTHORITY_NO)
            } else {
                this.title = this.$t('UserManagementU.DialogUserInformationEditTitle2')
                this.selectionBox('', '')
                this.formLabelAlign.belongingName = menuData.NO
                this.menuDatas.BELONGINGNAME = menuData.NO
            }
            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', this.beforeunloadHandlerUserInformationEdit, false)
        },
        // プルダウンリストを作成します
        selectionBox (access) {
            this.loading = true
            const body = ('{"access": "TRUE", "beLong": "TRUE"}')
            this.$request.usermanagement.SelectionBox(body).then(response => {
                console.log('SelectionBox-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    for (let index = 0; index < data.result.ACCESS.length; index++) {
                        if (data.result.ACCESS[index].NO === 1) {
                            data.result.ACCESS[index].i18n = 'UserManagementU.AUTHORITY_NAME1'
                        } else if (data.result.ACCESS[index].NO === 2) {
                            data.result.ACCESS[index].i18n = 'UserManagementU.AUTHORITY_NAME2'
                        }
                    }
                    this.selectionBoxData = data.result
                    if (access !== '') {
                        const accessName = this.selectionBoxData.ACCESS.filter(d => { return d.NO === access })
                        this.formLabelAlign.access = accessName[0].NO
                    }
                    if (!this.flag) {
                        this.$refs.loginIdInput.focus()
                    } else {
                        if (this.message === this.$t('UserManagementU.ChangeEmailAddress')) {
                            this.$refs.ChangeEmailAddressInput.focus()
                        }
                    }
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.selectionBox(access) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`SelectionBox-get请求失败:`, err, 'UserInformationEdit')
                }
            })
        },
        userInformationEdit () {
            this.$message.closeAll()
            if (this.formLabelAlign.loginId) {
                // eslint-disable-next-line no-control-regex
                if (/[^\x00-\xff]/g.test(this.formLabelAlign.loginId)) { // 非半角英数字
                    this.$message.warning(this.$t('UserManagementU.DialogUserInformationEditInputWarningMessage1'))
                    return
                }
                if (!(/^[0-9a-zA-Z\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]{1,50}$/.test(this.formLabelAlign.loginId))) {
                    // 长度1-50
                    this.$message.warning(this.$t('UserManagementU.DialogUserInformationEditInputWarningMessage2'))
                    return
                }
            } else { // 空
                this.$message.warning(this.$t('UserManagementU.DialogUserInformationEditInputWarningMessage3'))
                return
            }
            if (!this.formLabelAlign.username) {
                this.$message.warning(this.$t('UserManagementU.MESSAGE_USER_INFO_USER_ADD_EDIT_VALIDATOR_UNINPUT_USER_NAME'))
                return
            }
            if (!this.formLabelAlign.phonetic) {
                this.$message.warning(this.$t('UserManagementU.MESSAGE_USER_INFO_USER_ADD_EDIT_VALIDATOR_UNINPUT_USER_PHONETIC'))
                return
            }
            if (!this.formLabelAlign.access) {
                this.$message.warning(this.$t('UserManagementU.MESSAGE_USER_INFO_USER_ADD_EDIT_VALIDATOR_UNSET_AUTHORITY'))
                return
            }
            if (this.formLabelAlign.email) {
                if (
                    !this.formLabelAlign.email || !(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.formLabelAlign.email))
                ) {
                    this.$message.warning(this.$t('UserManagementU.MESSAGE_USER_INFO_USER_ADD_EDIT_VALIDATOR_INJUSTICE_MAILADDRESS'))
                    return
                } else {
                    if (this.formLabelAlign.email.length > 200 || this.formLabelAlign.email.length < 1) {
                        this.$message.warning(this.$t('UserManagementU.LengthOfEmail'))
                        return
                    }
                }
            } else {
                this.$message.warning(this.$t('UserManagementU.MESSAGE_USER_INFO_USER_ADD_EDIT_VALIDATOR_UNINPUT_MAILADDRESS'))
                return
            }
            this.flag ? this.userInformationUpdate() : this.userInformationAdd()
        },
        userInformationAdd () {
            this.applyToFoldersBelowClose()
            this.loading = true
            const body = ('{' +
                '"userId": "' + this.formLabelAlign.loginId + '",' +
                '"userName": "' + this.formLabelAlign.username + '",' +
                '"phonetic": "' + this.formLabelAlign.phonetic + '",' +
                '"email": "' + this.formLabelAlign.email + '",' +
                '"belongingNo": "' + this.formLabelAlign.belongingName + '",' +
                '"authorityNo": "' + this.formLabelAlign.access + '"}')
            this.$request.usermanagement.additionalInformationAdd(body).then(response => {
                console.log('additionalInformationAdd-post请求:', response.status, response.statusText)
                // 判断状态码code
                const data = this.$request.CODE(response.data, 'usermanagement')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success({
                        dangerouslyUseHTMLString: true,
                        message: data.result.sendMailFlag
                            ? this.$t('UserManagementU.DialogUserInformationEditInputSuccessMessage1')
                            : this.$t('UserManagementU.DialogUserInformationEditInputSuccessMessage2')
                    })
                    this.confirm()
                    // 刷新利用者情報
                    this.$emit('InformationAdd')
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.userInformationAdd() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`additionalInformationAdd-post请求失败:`, err, 'UserInformationEdit')
                }
            })
        },
        userInformationUpdate () {
            let loginId = this.formLabelAlign.loginId
            let username = this.formLabelAlign.username
            let phonetic = this.formLabelAlign.phonetic
            let email = this.formLabelAlign.email
            if (/[{}\\"]/gm.test(loginId)) {
                loginId = this.formLabelAlign.loginId.replace(/\\/g, '\\\\').replace(/'/g, '\'')
                    .replace(/"/g, '\\"').replace(/{/g, '\{').replace(/}/g, '\}')
                console.log(loginId)
            }
            if (/[{}\\"]/gm.test(username)) {
                username = this.formLabelAlign.username.replace(/\\/g, '\\\\').replace(/'/g, '\'')
                    .replace(/"/g, '\\"').replace(/{/g, '\{').replace(/}/g, '\}')
                console.log(username)
            }
            if (/[{}\\"]/gm.test(phonetic)) {
                phonetic = this.formLabelAlign.phonetic.replace(/\\/g, '\\\\').replace(/'/g, '\'')
                    .replace(/"/g, '\\"').replace(/{/g, '\{').replace(/}/g, '\}')
                console.log(phonetic)
            }
            if (/[{}\\"]/gm.test(email)) {
                email = this.formLabelAlign.email.replace(/\\/g, '\\\\').replace(/'/g, '\'')
                    .replace(/"/g, '\\"').replace(/{/g, '\{').replace(/}/g, '\}')
                console.log(email)
            }
            this.loading = true
            const body = ('{' +
                '"userId": "' + loginId + '",' +
                '"userName": "' + username + '",' +
                '"phonetic": "' + phonetic + '",' +
                '"email": "' + email + '",' +
                '"lastUpdate": "' + this.menuDatas.LAST_UPDATE + '",' +
                '"belongingNo": "' + this.formLabelAlign.belongingName + '",' +
                '"authorityNo": "' + this.formLabelAlign.access + '"}')
            this.$request.usermanagement.editingUserInformation(this.formLabelAlign.no, body).then(response => {
                console.log('editingUserInformation-patch请求:', response.status, response.statusText)
                // 判断状态码code
                const data = this.$request.CODE(response.data, 'usermanagement')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success({
                        dangerouslyUseHTMLString: true,
                        message: data.result.sendMailFlag
                            ? this.$t('UserManagementU.DialogUserInformationEditInputSuccessMessage3')
                            : this.$t('UserManagementU.DialogUserInformationEditInputSuccessMessage4')
                    })
                    console.log(this.editYourself, loginId, this.$store.state)
                    if (this.editYourself) bus.$emit('getAuthInfo')
                    // 利用者情報の更新
                    this.$emit('InformationUpdate', this.editYourself)
                    this.confirm()
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.userInformationUpdate() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`editingUserInformation-patch请求失败:`, err, 'UserInformationEdit')
                }
            })
        },
        // メール再送信
        changeEmail () {
            this.loading = true
            console.log(this.formLabelAlign)
            this.$request.usermanagement.ChangeEmail(this.formLabelAlign.no, '').then(response => {
                console.log('ChangeEmail-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success(this.$t('UserManagementU.DialogUserInformationEditInputSuccessMessage5'))
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.changeEmail() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`ChangeEmail-get请求失败:`, err, 'UserInformationEdit')
                }
            })
        },
        close () {
            console.log(this.menuDatas, this.formLabelAlign)
            if (this.flag) {
                if (
                    this.formLabelAlign.username !== this.menuDatas.NAME ||
                    this.formLabelAlign.phonetic !== this.menuDatas.PHONETIC ||
                    this.formLabelAlign.loginId !== this.menuDatas.USER_ID ||
                    this.formLabelAlign.email !== this.menuDatas.MAILADDRESS ||
                    this.formLabelAlign.belongingName !== this.menuDatas.BELONGING_NO ||
                    this.formLabelAlign.access !== this.menuDatas.AUTHORITY_NO
                ) {
                    this.applyToFoldersBelow = true
                    return
                }
            } else {
                if (
                    this.formLabelAlign.username !== '' ||
                    this.formLabelAlign.phonetic !== '' ||
                    this.formLabelAlign.loginId !== '' ||
                    this.formLabelAlign.email !== '' ||
                    this.formLabelAlign.belongingName !== this.menuDatas.BELONGINGNAME ||
                    this.formLabelAlign.access !== ''
                ) {
                    this.applyToFoldersBelow = true
                    return
                }
            }
            this.confirm()
        }
    }
}
</script>
<style lang="less" scoped>
@import url("../../../less/pages/UserManagement/UserManagementU/UserInformationEdit.less");
</style>
