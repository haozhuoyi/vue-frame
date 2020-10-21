<template>
    <div id="emailTemplateManagement">
        <!-- メールテンプレート編集 -->
        <el-dialog :title="$t('emailTemplateManagement.DISPLAY_SELECTING_TEMPLATE_MAIL_VIEWER_EDIT_TITLE')"
                   :visible.sync="innerVisibleEdit"
                   :close-on-click-modal="false"
                   :before-close="close"
                   append-to-body
                   ref="emailTemplateManagementDialogEdit"
                   class="emailTemplateManagementDialog"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="borderBox">
                <el-form :model="formLabelEdit"
                         label-position="right"
                         label-width="100px"
                         ref="form"
                         class="formContent">
                    <el-form-item :label="$t('emailTemplateManagement.DISPLAY_SELECTING_TEMPLATE_MAIL_MAIL_TITLE')">
                        <input ref="emailTemplateManagementEditInput"
                               v-change
                               v-model="formLabelEdit.name" />
                    </el-form-item>
                    <el-form-item :label="$t('emailTemplateManagement.DISPLAY_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES_PUBLIC_TYPE')">
                        <el-radio-group v-model="formLabelEdit.PUBLIC_TYPE">
                            <el-radio-button label="2"
                                             :disabled="!userAuccessDisabled">
                                {{ $t('emailTemplateManagement.DISPLAY_SELECTING_TEMPLATE_MAIL_VIEWER_BUTTON_ALL_PROJECTS') }}
                            </el-radio-button>
                            <el-radio-button label="1"
                                             class="el-radio-button-margin-left">
                                {{ $t('emailTemplateManagement.DISPLAY_SELECTING_TEMPLATE_MAIL_VIEWER_BUTTON_THIS_PROJECT') }}
                            </el-radio-button>
                            <el-radio-button label="0"
                                             class="el-radio-button-margin-left">
                                {{ $t('emailTemplateManagement.DISPLAY_SELECTING_TEMPLATE_MAIL_VIEWER_BUTTON_ONLY_MYSELF') }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('emailTemplateManagement.DISPLAY_SELECTING_TEMPLATE_MAIL_MAIL_BODY')">
                        <el-input type="textarea"
                                  v-model="formLabelEdit.Contents">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <button class="button buttonHighlight"
                        @click="updateMailTemplates">
                    {{ $t('emailTemplateManagement.DISPLAY_SELECTING_TEMPLATE_MAIL_VIEWER_BUTTON_SAVE2') }}
                </button>
            </div>
        </el-dialog>
        <!-- 追加 -->
        <el-dialog :title="$t('emailTemplateManagement.DISPLAY_SELECTING_TEMPLATE_MAIL_VIEWER_ADD_TITLE')"
                   :visible.sync="innerVisibleAdd"
                   :close-on-click-modal="false"
                   :before-close="close"
                   append-to-body
                   ref="emailTemplateManagementDialogAdd"
                   class="emailTemplateManagementDialog"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="borderBox">
                <el-form :model="formLabelAlign1"
                         label-position="right"
                         label-width="100px"
                         ref="form"
                         class="formContent">
                    <el-form-item :label="$t('emailTemplateManagement.DISPLAY_SELECTING_TEMPLATE_MAIL_MAIL_TITLE')">
                        <el-input ref="emailTemplateManagementAddInput"
                                  @input="e => formLabelAdd.name = validForbid(e)"
                                  v-model="formLabelAdd.name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('emailTemplateManagement.DISPLAY_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES_PUBLIC_TYPE')">
                        <el-radio-group v-model="formLabelAdd.PUBLIC_TYPE">
                            <el-radio-button label="2"
                                             :disabled="!userAuccessDisabled">
                                {{ $t('emailTemplateManagement.DISPLAY_SELECTING_TEMPLATE_MAIL_VIEWER_BUTTON_ALL_PROJECTS') }}
                            </el-radio-button>
                            <el-radio-button label="1"
                                             class="el-radio-button-margin-left">
                                {{ $t('emailTemplateManagement.DISPLAY_SELECTING_TEMPLATE_MAIL_VIEWER_BUTTON_THIS_PROJECT') }}
                            </el-radio-button>
                            <el-radio-button label="0"
                                             class="el-radio-button-margin-left">
                                {{ $t('emailTemplateManagement.DISPLAY_SELECTING_TEMPLATE_MAIL_VIEWER_BUTTON_ONLY_MYSELF') }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('emailTemplateManagement.DISPLAY_SELECTING_TEMPLATE_MAIL_MAIL_BODY')">
                        <el-input type="textarea"
                                  v-model="formLabelAdd.Contents">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <button class="button buttonHighlight"
                        @click="addMailTemplates">
                    {{ $t('emailTemplateManagement.DISPLAY_SELECTING_TEMPLATE_MAIL_VIEWER_BUTTON_SAVE1') }}
                </button>
            </div>
        </el-dialog>
        <CloseDialog ref="CloseDialog"
                     :content="$t('emailTemplateManagement.MESSAGE_CLOSE_EDIT_WINDOW_CONFIRM')"
                     @cancelClose="$refs.CloseDialog.show(false)"
                     @close="confirmCloase"></CloseDialog>
    </div>
</template>
<script>

export default {
    name: 'EmailTemplateManagement',
    components: {
        CloseDialog: resolve => require(['@c/CloseDialog'], resolve)
    },
    props: {
        'formLabelAlign1': {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data () {
        return {
            innerVisibleAdd: false,
            innerVisibleEdit: false,
            loading: false,
            userAuccessDisabled: false,
            formLabelEdit: {
                no: '',
                name: '',
                PUBLIC_TYPE: '',
                Contents: ''
            },
            formLabelEditStringify: '',
            formLabelAdd: {
                name: '',
                PUBLIC_TYPE: '1',
                Contents: ''
            }
        }
    },
    beforeDestroy () {
        window.removeEventListener('beforeunload', e => this.beforeunloadHandlerEmailTemplateManagement(e))
    },
    methods: {
        /* 监听浏览器刷新事件 */
        beforeunloadHandlerEmailTemplateManagement (e) {
            let beforeunload = false
            if (this.innerVisibleAdd) {
                if (this.formLabelAdd.name || this.formLabelAdd.PUBLIC_TYPE !== '1' || this.formLabelAdd.Contents) {
                    beforeunload = true
                }
            } else if (this.innerVisibleEdit) {
                if (this.formLabelEditStringify !== JSON.stringify(this.formLabelEdit)) {
                    beforeunload = true
                }
            }
            console.log(this.formLabelEditStringify)
            console.log(JSON.stringify(this.formLabelEdit))
            console.log(`Email --> EmailTemplateManagement: ${this.innerVisibleAdd ? '追加' : '编辑'}`, beforeunload)
            if (beforeunload) {
                e = e || window.event
                if (e) {
                    e.returnValue = '关闭提示'
                }
                return beforeunload
            }
            return
        },
        emailTemplateManagement (type, userAuccessDisabled) {
            if (type === 'add') {
                // 重置data的数据
                Object.assign(this.$data, this.$options.data())
                this.innerVisibleAdd = true
                this.$refs.emailTemplateManagementDialogAdd.$el.children[0].classList.add('largeDialog')
                setTimeout(() => { this.$refs.emailTemplateManagementAddInput.focus() }, 200)
            } else if (type === 'edit') {
                this.formLabelEdit = {
                    no: this.formLabelAlign1.no,
                    name: this.formLabelAlign1.name,
                    PUBLIC_TYPE: this.formLabelAlign1.PUBLIC_TYPE,
                    Contents: this.formLabelAlign1.Contents
                }
                this.formLabelEditStringify = JSON.stringify(this.formLabelEdit)
                this.innerVisibleEdit = true
                this.$refs.emailTemplateManagementDialogEdit.$el.children[0].classList.add('largeDialog')
                setTimeout(() => {
                    const emailTemplateManagementEditInput = this.$refs.emailTemplateManagementEditInput
                    emailTemplateManagementEditInput.focus()
                    emailTemplateManagementEditInput.value = ''
                    emailTemplateManagementEditInput.value = this.formLabelEdit.name
                }, 200)
            }
            this.userAuccessDisabled = userAuccessDisabled
            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
        },
        // メールテンプレートの更新を指定します
        updateMailTemplates () {
            if (this.formLabelEdit.PUBLIC_TYPE === '') {
                this.$message.warning(this.$t('emailTemplateManagement.MESSAGE_PUBLIC_TYPE_NOT_EXIST'))
                return
            }
            this.loading = true
            const message = this.$request.replaceMethod(this.formLabelEdit.Contents)
            const body = ('{"title": "' + this.formLabelEdit.name + '", "message": "' + message + '", "publicType": "' + this.formLabelEdit.PUBLIC_TYPE + '"}')
            this.$request.folder.MailTemplatesUPDATE(this.formLabelEdit.no, body).then(response => {
                console.log('MailTemplatesUPDATE-patch请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'EmailTemplateSelectionManagement')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    console.log(data)
                    this.$message.success(this.$t('emailTemplateManagement.MESSAGE_TEMPLATE_MAIL_VIEWER_CHANGE_SUCCESS'))
                    this.formLabelEdit = {
                        no: '',
                        name: '',
                        PUBLIC_TYPE: '',
                        Contents: ''
                    }
                    this.confirmCloase()
                    this.$emit('MailTemplatesGET', 'get')
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.updateMailTemplates() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirmCloase()
                    }
                    this.$request.requestError('MailTemplatesUPDATE-patch请求成功', err, 'EmailTemplateSelectionManagement')
                }
            })
        },
        // メールテンプレートの新規作成
        addMailTemplates () {
            this.$message.closeAll()
            if (this.formLabelAdd.PUBLIC_TYPE === '') {
                this.$message.warning(this.$t('emailTemplateManagement.MESSAGE_PUBLIC_TYPE_NOT_EXIST'))
                return
            }
            this.loading = true
            const message = this.$request.replaceMethod(this.formLabelAdd.Contents)
            const body = ('{"title": "' + this.formLabelAdd.name + '", "message": "' + message + '", "publicType": "' + this.formLabelAdd.PUBLIC_TYPE + '"}')
            this.$request.folder.MailTemplatesADD(body).then(response => {
                console.log('MailTemplatesADD-post请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'EmailTemplateSelectionManagement')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.formLabelAdd = []
                    this.$message.success(this.$t('emailTemplateManagement.MESSAGE_TEMPLATE_MAIL_VIEWER_ADD_SUCCESS'))
                    this.confirmCloase()
                    this.$emit('MailTemplatesGET', 'get')
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.updateMailTemplates() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirmCloase()
                    }
                    this.$request.requestError('MailTemplatesADD-post请求成功', err, 'EmailTemplateSelectionManagement')
                }
            })
        },
        close () {
            if (this.innerVisibleAdd) {
                if (this.formLabelAdd.name || this.formLabelAdd.PUBLIC_TYPE !== '1' || this.formLabelAdd.Contents) {
                    this.$refs.CloseDialog.show(true)
                } else {
                    this.confirmCloase()
                }
            } else if (this.innerVisibleEdit) {
                if (this.formLabelEditStringify !== JSON.stringify(this.formLabelEdit)) {
                    this.$refs.CloseDialog.show(true)
                } else {
                    this.confirmCloase()
                }
            }
        },
        confirmCloase () {
            this.innerVisibleAdd = false
            this.innerVisibleEdit = false
            window.removeEventListener('beforeunload', e => this.beforeunloadHandlerEmailTemplateManagement(e))
        }
    }
}
</script>
/*dialog */
<style lang="less" scoped>
@import url("../../../../less/pages/Files/AllFiles/Email/EmailTemplateManagement.less");
</style>
