<template>
    <div id="changePassword">
        <el-dialog :visible.sync="dialogVisible"
                   :close-on-click-modal="false"
                   :destroy-on-close="true"
                   :before-close="close"
                   :title="$t('UserManagementU.DialogChangePassword')">
            <div>
                <el-form :model="ruleForm"
                         status-icon
                         label-position="right"
                         label-width="194px">
                    <div class="title">
                        <label>
                            {{ userData.NAME }}({{ userData.MAILADDRESS }})
                        </label>
                    </div>
                    <el-form-item :label="$t('UserManagementU.DISPLAY_CHANGE_PASSWORD_NEW_PASS1')"
                                  prop="pass">
                        <input ref="input"
                               v-change
                               type="password"
                               maxlength="200"
                               :class="[onlyRead?'noinput':'input']"
                               :disabled="onlyRead"
                               :placeholder="onlyRead ? $t('UserManagementU.DISPLAY_CHANGE_PASSWORD_NEW_PASS1_INPUT_PLACEHOLDER') : ''"
                               v-model="ruleForm.pass">
                    </el-form-item>
                    <el-form-item :label="$t('UserManagementU.DISPLAY_CHANGE_PASSWORD_NEW_PASS2')"
                                  prop="checkPass"
                                  style="margin-bottom: 10px;">
                        <input v-change
                               type="password"
                               maxlength="200"
                               :class="[onlyRead?'noinput':'input']"
                               :disabled="onlyRead"
                               :placeholder="onlyRead ? $t('UserManagementU.DISPLAY_CHANGE_PASSWORD_NEW_PASS1_INPUT_PLACEHOLDER') : ''"
                               v-model="ruleForm.checkPass">
                    </el-form-item>
                </el-form>
            </div>

            <el-dialog :visible.sync="dialogVisibleNext"
                       :close-on-click-modal="false"
                       :before-close="closeNext"
                       append-to-body
                       :title="$t('UserManagementU.DialogChangePassword')"
                       v-loading="loading"
                       :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(255,255,255,.4)">
                <div>
                    <el-form :model="ruleForm"
                             status-icon
                             label-position="right"
                             label-width="100px">
                        <div class="title">
                            <label>
                                {{
                                    userInfo.userId !== userData.USER_ID ? $t('UserManagementU.DialogUserPrompt1') :
                                    $t('UserManagementU.DialogUserPrompt2')
                                }}
                            </label>
                        </div>
                        <el-form-item :label="$t('UserManagementU.DISPLAY_CHANGE_PASSWORD_OLD_PASS')">
                            <input v-change
                                   type="password"
                                   class="input"
                                   maxlength="200"
                                   v-model="ruleForm.currentPassword">
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer"
                      class="dialog-footer">
                    <span v-if="passwordNotTheSame">{{ $t('UserManagementU.DialogPrompt') }}</span>
                    <button :class="['button','buttonHighlight',onlyRead||!ruleForm.currentPassword?'disabled':'']"
                            @click="submitForm">OK</button>
                </span>
            </el-dialog>

            <span slot="footer"
                  class="dialog-footer">
                <button :class="['button buttonHighlight',onlyRead||!(ruleForm.pass&&ruleForm.checkPass)?'disabled':'']"
                        @click="next">
                    {{ $t('UserManagementU.DISPLAY_MEASURE_INFO_NEXT') }}
                </button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'ChangePassword',
    data () {
        return {
            dialogVisible: false,
            dialogVisibleNext: false,
            loading: false,
            buttonDisabled: true,
            userData: {},
            userInfo: {},
            ruleForm: {
                pass: '', // 新密码
                checkPass: '', // 确认密码
                currentPassword: '' // 旧密码
            },
            onlyRead: false,
            passwordNotTheSame: false // 密码不一样
        }
    },
    destroyed () {
        window.removeEventListener('beforeunload', this.beforeunloadHandlerChangePassword, false)
    },
    methods: {
        // 浏览器刷新事件
        beforeunloadHandlerChangePassword (e) {
            console.log('利用者管理-->利用者管理--> 密码修改')
            const beforeunload =
                this.ruleForm.pass !== '' || this.ruleForm.checkPass !== '' || this.ruleForm.currentPassword !== ''
            if (beforeunload) {
                e = e || window.event
                if (e) {
                    e.returnValue = '关闭提示'
                }
                return true
            }
            return
        },
        show (data, changeFlag) {
            this.dialogVisible = true
            this.buttonDisabled = true
            this.userData = data
            this.userInfo = this.$store.state.userInfo
            console.log(this.userData, this.userInfo)
            if (!changeFlag) {
                this.onlyRead = !changeFlag
            }
            setTimeout(() => { this.$refs.input.focus() }, 200)
            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', this.beforeunloadHandlerChangePassword, false)
        },
        next () {
            if (this.ruleForm.pass) {
                if (
                    this.ruleForm.pass.length > 200 && this.ruleForm.pass.length < 6 // &&
                    // !(/^\S*(?=\S{6,200})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])\S*$/.test(this.ruleForm.pass))
                ) {
                    this.$message.warning(this.$t('UserManagementU.DialogWarningMessage4'))
                    // this.$message.warning(this.$t('UserManagementU.DialogWarningMessage1'))
                } else {
                    if (this.ruleForm.pass !== this.ruleForm.checkPass) {
                        this.$message.warning(this.$t('UserManagementU.DialogWarningMessage3'))
                    } else {
                        this.dialogVisibleNext = true
                    }
                }
            } else {
                this.$message.warning(this.$t('UserManagementU.DialogWarningMessage'))
            }
        },
        submitForm () {
            if (this.ruleForm.currentPassword.length <= 0) {
                this.$message.warning(this.$t('UserManagementU.DialogWarningMessage2'))
            } else {
                this.loading = true
                let editorPassword = this.ruleForm.currentPassword
                let newPassword = this.ruleForm.pass
                let confirmNewPassword = this.ruleForm.checkPass
                if (/[{}\\"]/gm.test(editorPassword)) {
                    editorPassword = this.ruleForm.currentPassword.replace(/\\/g, '\\\\').replace(/'/g, '\'')
                        .replace(/"/g, '\\"').replace(/{/g, '\{').replace(/}/g, '\}')
                    console.log(editorPassword)
                }
                if (/[{}\\"]/gm.test(newPassword)) {
                    newPassword = this.ruleForm.pass.replace(/\\/g, '\\\\').replace(/'/g, '\'')
                        .replace(/"/g, '\\"').replace(/{/g, '\{').replace(/}/g, '\}')
                    console.log(newPassword)
                }
                if (/[{}\\"]/gm.test(confirmNewPassword)) {
                    confirmNewPassword = this.ruleForm.checkPass.replace(/\\/g, '\\\\').replace(/'/g, '\'')
                        .replace(/"/g, '\\"').replace(/{/g, '\{').replace(/}/g, '\}')
                    console.log(confirmNewPassword)
                }
                const body = (
                    '{"editorPassword":"' + editorPassword + '", "newPassword":"' + newPassword + '", "confirmNewPassword":"' + confirmNewPassword + '"}'
                )
                this.$request.usermanagement.ChangePassword(this.userData.NO, body).then(response => {
                    console.log('ChangePassword-patch请求:', response.status, response.statusText)
                    // 判断状态码code
                    const data = this.$request.CODE(response.data)
                    if (Object.prototype.toString.call(data) === '[object Object]') {
                        this.$message.success(this.$t('UserManagementU.DialogSuccessMessage'))
                        this.closeNext()
                        this.close()
                    }
                    this.loading = false
                }).catch(err => {
                    this.loading = false
                    if (err.status === 401) {
                        this.$request.login.refreshToken().then(response => {
                            response ? this.submitForm() : ''
                        })
                    } else {
                        if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                            this.closeNext()
                            this.close()
                        }
                        this.$request.requestError(`ChangePassword-patch请求:`, err, 'ChangePassword')
                    }
                })
            }
        },
        close () {
            this.dialogVisible = false
            this.ruleForm = {
                pass: '', // 新密码
                checkPass: '', // 确认密码
                currentPassword: '' // 旧密码
            }
            window.removeEventListener('beforeunload', this.beforeunloadHandlerChangePassword, false)
        },
        closeNext () {
            this.dialogVisibleNext = false
        }
    }
}
</script>
<style lang="less" scoped>
@import url("../../../less/pages/UserManagement/UserManagementU/ChangePassword.less");
</style>
