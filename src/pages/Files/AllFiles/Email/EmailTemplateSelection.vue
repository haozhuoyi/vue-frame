<template>
    <div id="emailTemplateSelection">
        <el-dialog :title="$t('emailTemplateSelection.DISPLAY_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES')"
                   :visible.sync="innerVisible"
                   :close-on-click-modal="false"
                   :before-close="emailTemplateSelectionClose"
                   :destroy-on-close="true"
                   append-to-body
                   class="emailTemplateSelectionDialog"
                   ref="emailTemplateSelectionDialog"
                   @open="open"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="borderBox">
                <div class="templateList">
                    <el-table :data="mailTemplate"
                              class="tableTemplateList"
                              ref="table"
                              highlight-current-row
                              :show-header="false"
                              @row-click="templateSelection">
                        <el-table-column prop="TITLE">
                            <template slot-scope="scope">
                                <span :title="scope.row.TITLE">{{ scope.row.TITLE }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <span class="header">{{ $t('emailTemplateSelection.DISPLAY_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES_TEMPLATES') }}（{{ mailTemplateCount }}/30）</span>
                </div>
                <div class="content">
                    <el-form :model="formLabelAlign"
                             label-position="right"
                             label-width="88px"
                             ref="form"
                             class="formContent">
                        <el-form-item :label="$t('emailTemplateSelection.DISPLAY_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES_PUBLIC_TYPE')">
                            <p v-if="String(formLabelAlign.PUBLIC_TYPE) === '2'">
                                {{ $t('emailTemplateSelection.DISPLAY_SELECTING_TEMPLATE_MAIL_VIEWER_BUTTON_ALL_PROJECTS') }}
                            </p>
                            <p v-if="String(formLabelAlign.PUBLIC_TYPE) === '1'">
                                {{ $t('emailTemplateSelection.DISPLAY_SELECTING_TEMPLATE_MAIL_VIEWER_BUTTON_THIS_PROJECT') }}
                            </p>
                            <p v-if="String(formLabelAlign.PUBLIC_TYPE) === '0'">
                                {{ $t('emailTemplateSelection.DISPLAY_SELECTING_TEMPLATE_MAIL_VIEWER_BUTTON_ONLY_MYSELF') }}
                            </p>
                        </el-form-item>
                        <el-form-item :label="$t('emailTemplateSelection.DISPLAY_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES_BODY')">
                            <el-input type="textarea"
                                      v-model="formLabelAlign.Contents"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer"
                 class="footerButtonPosition">
                <button class="button"
                        @click="$refs.EmailTemplateManagement.emailTemplateManagement('add', userAuccessDisabled)">
                    {{ $t('emailTemplateSelection.DISPLAY_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES_ADD') }}
                </button>
                <button class="button"
                        @click="copy"
                        :disabled="btnDisable">{{ $t('emailTemplateSelection.DISPLAY_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES_COPY') }}</button>
                <button :class="['button',btnDisable || userDisabled? 'disabled' : '']"
                        @click="$refs.EmailTemplateManagement.emailTemplateManagement('edit', userAuccessDisabled)"
                        :disabled="btnDisable || userDisabled">
                    {{ $t('emailTemplateSelection.DISPLAY_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES_EDIT') }}
                </button>
                <button :class="['button','buttonDelete',btnDisable || userDisabled? 'disabled' : '']"
                        @click="deleteConfirmation = true"
                        :disabled="btnDisable || userDisabled">
                    {{ $t('emailTemplateSelection.DISPLAY_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES_DELETE') }}
                </button>
                <button v-if="!mailSettingFlg"
                        class="button buttonHighlight float"
                        @click="select"
                        :disabled="btnDisable">
                    {{ $t('emailTemplateSelection.DISPLAY_MAILLING_LIST_VIEWER_MENU_SELECT') }}
                </button>
            </div>

            <el-dialog :visible.sync="deleteConfirmation"
                       :title="$t('emailTemplateSelection.MESSAGE_MAIL_TEMPLATE_WARNING')"
                       :close-on-click-modal="false"
                       :before-close="close"
                       append-to-body
                       class="userdeleteingdialog"
                       v-loading="deleteConfirmationLoading"
                       :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(255,255,255,.4)">
                {{ $t('emailTemplateSelection.MESSAGE_MAIL_TEMPLATE_DELETE_PROCEED') }}<br /><br />

                {{ formLabelAlign.name }}
                <div slot="footer">
                    <button class="button"
                            @click="close">{{ $t('emailTemplateSelection.DISPLAY_NO') }}</button>
                    <button class="button buttonHighlight margin"
                            @click="deleteInformation">{{ $t('emailTemplateSelection.DISPLAY_YES') }}</button>
                </div>
            </el-dialog>
        </el-dialog>
        <EmailTemplateManagement ref="EmailTemplateManagement"
                                 :form-label-align1="formLabelAlign"
                                 @MailTemplatesGET="getMailTemplates"></EmailTemplateManagement>
    </div>
</template>
<script>
import bus from '@c/bus'
import $ from 'jquery'
// import store from '@p/Files/store'
// import Crypto from '@u/crypto'

export default {
    name: 'EmailTemplateSelection',
    filters: {
        length (mailTemplate) {
            return mailTemplate.length
        }
    },
    components: {
        EmailTemplateManagement: resolve => require(['@p/Files/AllFiles/Email/EmailTemplateManagement'], resolve)
    },
    data () {
        return {
            innerVisible: false,
            deleteConfirmation: false,
            loading: false,
            deleteConfirmationLoading: false,
            inputSearch: '', // 検索ボックスmodel値
            mailTemplate: [],
            mailTemplateCount: 0,
            formLabelAlign: { // 模版の内容
                no: '',
                PUBLIC_TYPE: '',
                name: '', // 模版名
                OpenRange: '全プロジェクト', // 公開範囲
                Contents: '', // 本文
                REG_USER_NO: null
            },
            inputicon: require('@a/images/file/file-input-select1.svg'),
            mailSettingFlg: false,
            userAuccessDisabled: true
        }
    },
    computed: {
        btnDisable () {
            return !this.formLabelAlign.no
        },
        userDisabled () {
            return !this.userAuccessDisabled && (this.$store.state.userInfo.userNo !== this.formLabelAlign.REG_USER_NO)
        }
    },
    mounted () {
        this.$nextTick(() => {
            bus.$on('emailTemplateSelection', (bool, lean) => {
                this.emailTemplateSelection(bool, lean)
                window.addEventListener('keydown', this.emailTemplateSelectionKeydown, true)
            })
        })
    },
    methods: {
        emailTemplateSelection (bool, mailSettingFlg) {
            this.innerVisible = bool
            this.mailSettingFlg = mailSettingFlg
            this.userAuccessDisabled = this.$store.state.userInfo.isAdmin || this.$store.state.userInfo.authorityName === 'プロジェクト管理者'
            this.getMailTemplates()
        },
        open () {
            this.$refs.emailTemplateSelectionDialog.$el.children[0].classList.add('largeDialog')
        },
        // メールテンプレート一覧取得・検索
        getMailTemplates () {
            this.loading = true
            this.formLabelAlign = {}
            this.mailTemplate = []
            this.$request.folder.MailTemplatesGET('{"title": "' + this.inputSearch + '"}').then(response => {
                console.log('MailTemplatesGET-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'EmailTemplateSelection')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.mailTemplate = response.data.result
                    const mtLength = this.mailTemplate.length
                    if (mtLength > 0) {
                        // setTimeout(() => {
                        this.templateSelection(this.mailTemplate[0])
                        // }, 200)
                    } else {
                        this.formLabelAlign = {
                            no: '',
                            PUBLIC_TYPE: '',
                            name: '',
                            OpenRange: '',
                            Contents: ''
                        }
                    }
                    this.mailTemplateCount = mtLength
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getMailTemplates() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.emailTemplateSelectionClose()
                    }
                    this.$request.requestError('MailTemplatesGET-get请求失败', err, 'EmailTemplateSelection')
                }
            })
        },
        // テンプレートを選択  -  使用
        templateSelection (row) {
            $('.el-table__row').removeClass('current-row')
            this.formLabelAlign = {
                no: row.NO,
                PUBLIC_TYPE: row.PUBLIC_TYPE,
                name: row.TITLE,
                OpenRange: row.PUBLIC_TYPE_NAME,
                Contents: row.MESSAGE,
                REG_USER_NO: row.REG_USER_NO
            }
            this.$refs.table.setCurrentRow(row)
        },
        deleteInformation () {
            this.deleteConfirmationLoading = true
            this.$request.folder.MailTemplatesDelete(this.formLabelAlign.no, '').then(response => {
                console.log('MailTemplatesDelete-delete请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'EmailTemplateSelection')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success(this.$t('emailTemplateSelection.MESSAGE_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES_DELETE_SUCCESS'))
                    this.deleteConfirmation = false
                    this.getMailTemplates()
                }
                this.deleteConfirmationLoading = false
            }).catch(err => {
                this.deleteConfirmationLoading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.deleteInformation() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.emailTemplateSelectionClose()
                    }
                    this.$request.requestError('MailTemplatesDelete-delete请求失败', err, 'EmailTemplateSelection')
                }
            })
        },
        // 選択ボタンを押す
        select () {
            this.emailTemplateSelectionClose()
            // this.$emit('SetFromMailTemplate', this.formLabelAlign)
            bus.$emit('SetFromMailTemplate', this.formLabelAlign)
        },
        // 複製
        copy () {
            this.loading = true
            const body = ('{"title": "' + this.formLabelAlign.name + '", "message": "' + this.formLabelAlign.Contents + '", "publicType": "' + this.formLabelAlign.PUBLIC_TYPE + '"}')
            this.$request.folder.MailTemplatesADD(body).then(response => {
                console.log('MailTemplatesADD-post请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'EmailTemplateSelection')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    console.log(data)
                    this.$message.success(this.$t('emailTemplateSelection.MESSAGE_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES_COPY_SUCCESS'))
                    this.getMailTemplates(true)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.copy() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.emailTemplateSelectionClose()
                    }
                    this.$request.requestError('MailTemplatesADD-post请求失败', err, 'EmailTemplateSelection')
                }
            })
        },
        // close
        close () {
            this.deleteConfirmation = false
        },
        emailTemplateSelectionClose () {
            // 重置data的数据
            Object.assign(this.$data, this.$options.data())
            this.mailSettingFlg = false
            this.innerVisible = false
            window.removeEventListener('keydown', this.emailTemplateSelectionKeydown, false)
        },
        emailTemplateSelectionKeydown (event) {
            if ($('.el-table.tableEmailList>.el-table__body-wrapper .el-table__row').length > 0) {
                return
            }
            if (event.keyCode === 38) {
                const prevCurrent = $('.el-table__row.current-row').prev()
                if (prevCurrent.length > 0) {
                    // prevCurrent.click()
                    $('.el-table__row').removeClass('current-row')
                    prevCurrent.addClass('current-row')
                    $('.el-table.tableTemplateList>.el-table__body-wrapper.is-scrolling-none').animate({
                        scrollTop: prevCurrent.position().top
                    }, 0)
                }
            } else if (event.keyCode === 40) {
                const nextCurrent = $('.el-table__row.current-row').next()
                if (nextCurrent.length > 0) {
                    // nextCurrent.click()
                    $('.el-table__row').removeClass('current-row')
                    nextCurrent.addClass('current-row')
                    $('.el-table.tableTemplateList>.el-table__body-wrapper.is-scrolling-none').animate({
                        scrollTop: nextCurrent.position().top
                    }, 0)
                }
            }
        }
    }
}

</script>
<style lang="less" scoped>
@import url("../../../../less/pages/Files/AllFiles/Email/EmailTemplateSelection.less");
</style>


