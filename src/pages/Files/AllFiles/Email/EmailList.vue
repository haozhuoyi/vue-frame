<template>
    <div id="emailListEdit">
        <el-dialog top="5vh"
                   :title="$t('emailListEdit.DISPLAY_MAILLING_LIST_VIEWER_TITLE')"
                   :visible.sync="innerVisible"
                   :before-close="close"
                   :close-on-click-modal="false"
                   :destroy-on-close="true"
                   append-to-body
                   @open="open"
                   class="emailListEditDialog"
                   ref="emailListEditDialog"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="borderBox">
                <div class="templateList">
                    <el-table :data="mailingLists"
                              class="tableEmailList"
                              ref="table"
                              highlight-current-row
                              :show-header="false"
                              @row-click="emailListRowClickEvent">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span :title="scope.row.MAILING_LIST_NAME">{{ scope.row.MAILING_LIST_NAME }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <span class="header">
                        {{ $t('emailListEdit.DISPLAY_MAILLING_LIST_VIEWER_SEARCH_TITLE') }}（{{ mailingLists.length }}/30）
                    </span>
                </div>
                <div class="content">
                    <el-form :model="selectMailingList"
                             label-position="right"
                             label-width="88px"
                             ref="form"
                             class="formContent">
                        <el-form-item :label="$t('emailListEdit.DISPLAY_MAILLING_LIST__PUBLIC_TYPE')">
                            <!-- <p v-if="String(selectMailingList.PUBLIC_TYPE) === '2'">
                                {{ $t('emailListEdit.DISPLAY_MAILLING_LIST_VIEWER_BUTTON_ALL_PROJECTS') }}
                            </p> -->
                            <p v-if="String(selectMailingList.PUBLIC_TYPE) === '1'">
                                {{ $t('emailListEdit.DISPLAY_MAILLING_LIST_VIEWER_BUTTON_THIS_PROJECT') }}
                            </p>
                            <p v-if="String(selectMailingList.PUBLIC_TYPE) === '0'">
                                {{ $t('emailListEdit.DISPLAY_MAILLING_LIST_VIEWER_BUTTON_ONLY_MYSELF') }}
                            </p>
                        </el-form-item>
                    </el-form>
                    <ul class="ul ulHeader">
                        <li>
                            <div class="belongName"
                                 @click="sort('BELONGING_NAME')">{{ $t('emailListEdit.DISPLAY_MAILLING_LIST_BELONG_TITLE') }}</div>
                            <div class="space"></div>
                            <div class="userName"
                                 @click="sort('NAME')">{{ $t('emailListEdit.DISPLAY_MAILLING_LIST_USER_TITLE') }}
                            </div>
                        </li>
                    </ul>
                    <ul class="ul ulBody">
                        <li v-for="(item,index) in mailingListUser"
                            :key="item.NO"
                            style="border-bottom: 1px solid #F0F0F0;"
                            :class="index == 0 ? 'topSpacing' : ''">
                            <div class="belongName">
                                <img :src="require('@a/images/usermanagement/usermanagement-user-icon.svg')">
                                <span :title="item.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : item.BELONGING_NAME">
                                    {{ item.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : item.BELONGING_NAME }}
                                </span>
                            </div>
                            <div class="space"></div>
                            <div class="userName">
                                <span :title="item.NAME">{{ item.NAME }}</span>
                                <span :title="item.MAILADDRESS">{{ item.MAILADDRESS }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div slot="footer"
                 class="footerButtonPosition">
                <button class="button"
                        @click="$refs.EmailListEdit.addOrEditEmailList('追加',selectMailingList,mailingListUser)">
                    {{ $t('emailListEdit.DISPLAY_MAILLING_LIST_VIEWER_BUTTON_ADD') }}
                </button>
                <button :class="['button',btnDisable ? 'disabled' : '']"
                        @click="copy"
                        :disabled="btnDisable">
                    {{ $t('emailListEdit.DISPLAY_MAILLING_LIST_VIEWER_BUTTON_COPY') }}
                </button>
                <button :class="['button',btnDisable || userDisabled? 'disabled' : '']"
                        :disabled="btnDisable || userDisabled"
                        @click="$refs.EmailListEdit.addOrEditEmailList('編集',selectMailingList,mailingListUser)">
                    {{ $t('emailListEdit.DISPLAY_MAILLING_LIST_VIEWER_BUTTON_EDIT') }}
                </button>
                <button :class="['button','buttonDelete',btnDisable || userDisabled? 'disabled' : '']"
                        @click="toFoldersBelow = true"
                        :disabled="btnDisable || userDisabled">
                    {{ $t('emailListEdit.DISPLAY_MAILLING_LIST_VIEWER_BUTTON_DELETE') }}
                </button>
            </div>

            <el-dialog :visible.sync="toFoldersBelow"
                       :title="$t('emailListEdit.MESSAGE_MAILLING_LIST_WARNING')"
                       :close-on-click-modal="false"
                       :before-close="close"
                       append-to-body
                       class="userdeleteingdialog"
                       v-loading="deleteConfirmationLoading"
                       :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(255,255,255,.4)">
                {{ $t('emailListEdit.MESSAGE_MAILLING_LIST_DELETE_PROCEED') }}<br /><br />

                {{ selectMailingList.MAILING_LIST_NAME }}
                <div slot="footer">
                    <button class="button"
                            @click="applyToFoldersBelowClose">{{ $t('emailListEdit.DISPLAY_NO') }}</button>
                    <button class="button buttonHighlight margin"
                            @click="deleteInformation">{{ $t('emailListEdit.DISPLAY_YES') }}</button>
                </div>
            </el-dialog>
        </el-dialog>
        <EmailListEdit ref="EmailListEdit"
                       @close="close"
                       @MailingListsGET="getMailingLists"
                       @MailingListUPDATE="updateMailingList"></EmailListEdit>
    </div>
</template>
<script>
import $ from 'jquery'
import {natsort} from '@u/natsort-1.2.4.js'
import {Debounce} from '@u/debounce.js'

export default {
    name: 'EmailList',
    components: {
        EmailListEdit: resolve => require(['@p/Files/AllFiles/Email/EmailListEdit'], resolve)
    },
    data () {
        return {
            innerVisible: false,
            toFoldersBelow: false,
            loading: false,
            deleteConfirmationLoading: false,
            userAuccessDisabled: false,
            inputicon: require('@a/images/file/file-input-select1.svg'), // 搜索框
            mailingLists: [], // 邮件列表
            mailingListUser: [], // 选中邮件的人员
            selectMailingList: {}, // 选中邮件列表
            name: ''
        }
    },
    computed: {
        btnDisable () {
            return !this.selectMailingList.NO
        },
        userDisabled () {
            return !this.userAuccessDisabled && (this.$store.state.userInfo.userNo !== this.selectMailingList.REG_USER_NO)
        }
    },
    beforeDestroy () {
        // alert('关闭')
    },
    methods: {
        // 排序
        sort (name) {
            if (this.name && this.name === name) {
                this.mailingListUser.reverse()
            } else {
                // this.mailingListUser.sort(function compareFunction (item1, item2) {
                //     return item1[name].charCodeAt() - item2[name].charCodeAt()
                // })
                const mailingListUser = natsort(this.mailingListUser, convert)
                this.mailingListUser = Object.assign([], this.mailingListUser, mailingListUser)
            }
            this.name = name

            function convert (value) { // 配列の要素を受け取る
                return value[name] // 要素値となる配列オブジェクトの "1" プロパティを比較する
            }
        },
        emailList (bool) {
            this.selectMailingList = {}
            this.innerVisible = bool
            this.userAuccessDisabled = this.$store.state.userInfo.isAdmin || this.$store.state.userInfo.authorityName === 'プロジェクト管理者'
            this.getMailingLists()
            window.addEventListener('keydown', this.emailListEditKeydown, true)
        },
        open () {
            this.$refs.emailListEditDialog.$el.children[0].classList.add('largeDialog')
        },
        // 邮件列表一览取得和检索
        getMailingLists () {
            this.loading = true
            this.mailingLists = []
            this.mailingListUser = []
            this.selectMailingList = {}
            this.$request.folder.MailingListsGET('{"mailingListName": ""}').then(response => {
                console.log('MailingListsGET - get请求成功:', response.status, response.statusText)
                this.loading = false
                const data = this.$request.CODE(response.data, 'EmailListEdit')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.mailingLists = data.result
                    const mtLength = this.mailingLists.length
                    if (mtLength > 0) {
                        setTimeout(() => {
                            this.emailListRowClickEvent(this.mailingLists[0])
                        }, 200)
                    }
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getMailingLists() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.close()
                    }
                    this.$request.requestError('aaaa MailingListsGET-get请求失败:', err, 'EmailListEdit')
                }
            })
        },
        // テンプレートを選択  -  使用
        emailListRowClickEvent (row) {
            $('.el-table__row').removeClass('current-row')
            this.selectMailingList = row
            this.$refs.table.setCurrentRow(row)
            this.getMailingList(row.NO)
        },
        // 指定邮件列表情报取得
        getMailingList (NO) {
            this.loading = true
            this.mailingListUser = []
            this.$request.folder.MailingListGET(NO, '').then(response => {
                console.log('MailingListGET - get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'EmailListEdit')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    for (let index = 0; index < data.result.length; index++) {
                        data.result[index].NO = data.result[index].USER_NO
                        data.result[index].NAME = data.result[index].USER_NAME
                        this.mailingListUser.push(data.result[index])
                    }
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getMailingList(NO) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.close()
                    }
                    this.$request.requestError('MailingListGET-get请求失败:', err, 'EmailListEdit')
                }
            })
        },
        // 邮件列表修改
        updateMailingList (NO, title, PUBLIC_TYPE, sendUserListData) {
            for (let index = 0; index < this.mailingLists.length; index++) {
                if (this.mailingLists[index].NO === NO) {
                    this.mailingLists[index].MAILING_LIST_NAME = title
                    this.mailingLists[index].PUBLIC_TYPE = parseInt(PUBLIC_TYPE)
                    this.mailingListUser = sendUserListData
                }
            }
        },
        deleteInformation () {
            this.deleteConfirmationLoading = true
            this.$request.folder.MailingListDELETE(this.selectMailingList.NO, '').then(response => {
                console.log('MailingListDELETE - delete请求成功:', response.status, response.statusText)
                this.deleteConfirmationLoading = false
                const data = this.$request.CODE(response.data, 'EmailListEdit')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.toFoldersBelow = false
                    this.$message.success(this.$t('emailTemplateSelection.MESSAGE_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES_DELETE_SUCCESS'))
                    setTimeout(() => {
                        this.getMailingLists()
                    }, 250)
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
                        this.close()
                    }
                    this.$request.requestError('MailingListDELETE-delete请求失败:', err, 'EmailListEdit')
                }
            })
        },
        // 複製
        copy: Debounce(function () {
            this.loading43 = true
            if (!this.selectMailingList.MAILING_LIST_NAME) {
                this.loading43 = false
                return
            }
            this.appendMailingList()
        }, 300),
        // 邮件列表创建
        appendMailingList () {
            const body = ('{"mailingListName":"' + this.selectMailingList.MAILING_LIST_NAME + '","publicType":' + this.selectMailingList.PUBLIC_TYPE + ',"users":"' + this.selectMailingList.USER_NO_LIST + '"}')
            this.$request.folder.MailingListADD(body).then(response => {
                console.log('MailingListADD - post请求成功:', response.status, response.statusText)
                this.loading43 = false
                this.innerVisibleDestinationChoiceMailingListAdd = false
                const data = this.$request.CODE(response.data, 'EmailListEdit')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    console.log(response)
                    this.$message.success(this.$t('emailTemplateSelection.MESSAGE_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES_COPY_SUCCESS'))
                    this.getMailingLists(true)
                }
            }).catch(err => {
                this.loading43 = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.appendMailingList() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.close()
                    }
                    this.$request.requestError('MailingListADD-post请求失败:', err, 'EmailListEdit')
                }
            })
        },
        // close
        applyToFoldersBelowClose () {
            this.toFoldersBelow = false
        },
        close () {
            // 重置data的数据
            Object.assign(this.$data, this.$options.data())
            this.applyToFoldersBelowClose()
            this.innerVisible = false
            window.removeEventListener('keydown', this.emailListEditKeydown, false)
        },
        emailListEditKeydown (event) {
            if (this.loading) return
            if ($('.el-table.tableTemplateList>.el-table__body-wrapper .el-table__row').length > 0) {
                return
            }
            if (event.keyCode === 38) {
                const prevCurrent = $('.el-table__row.current-row').prev()
                if (prevCurrent.length > 0) {
                    // prevCurrent.click()
                    $('.el-table__row').removeClass('current-row')
                    prevCurrent.addClass('current-row')
                    $('.el-table.tableEmailList>.el-table__body-wrapper.is-scrolling-none').animate({
                        scrollTop: prevCurrent.position().top
                    }, 100)
                }
            } else if (event.keyCode === 40) {
                const nextCurrent = $('.el-table__row.current-row').next()
                if (nextCurrent.length > 0) {
                    // nextCurrent.click()
                    $('.el-table__row').removeClass('current-row')
                    nextCurrent.addClass('current-row')
                    $('.el-table.tableEmailList>.el-table__body-wrapper.is-scrolling-none').animate({
                        scrollTop: nextCurrent.position().top
                    }, 100)
                }
            }
        }
    }
}

</script>
<style lang="less" scoped>
@import url("../../../../less/pages/Files/AllFiles/Email/EmailList.less");
</style>
