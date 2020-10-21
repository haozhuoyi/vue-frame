<template>
    <div id="emailAddress">
        <el-dialog top="5vh"
                   :title="$t('emailAddress.DISPLAY_MAIL_WINDOW_SELECT_USER')"
                   :visible.sync="innerVisibleEmailAddress"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   append-to-body
                   ref="emailAddressDialog"
                   class="dialog"
                   @open="open"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="borderBox">
                <div class="allOrMailingList">
                    <div class="addresseeSelect">
                        <el-select v-model="allOrMailingList"
                                   @change="changeSelect(allOrMailingList)">
                            <el-option v-for="item in allOrMailingListData"
                                       :key="item.NO"
                                       :label="item.MAILING_LIST_NAME"
                                       :value="item.NO"
                                       style="cursor: default;">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="sendAddress left">
                    <UserList ref="UserList"
                              :user-list-data="userListData"
                              @LiClickEvent="LiClickEvent"></UserList>
                </div>
                <div class="image">
                    <div class="select">
                        <el-select v-model="name">
                            <el-option v-for="item in typeOptions"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <headButtonO :dat="imgDataO"
                                 @handleCommand="handleCommand"></headButtonO>
                </div>
                <div class="sendAddress">
                    <SendUserList ref="SendUserList"
                                  :send-user-list-data="sendUserListData"
                                  :type="type"
                                  @SendLiClickEvent="sendLiClickEvent"></SendUserList>
                </div>
            </div>
            <div slot="footer"
                 class="dialog-footer">
                <button class="button buttonHighlight"
                        @click="register">{{ $t('emailAddress.DISPLAY_MAILLING_LIST_VIEWER_MENU_SELECT') }}</button>
            </div>

            <CloseDialog ref="CloseDialog"
                         :content="$t('emailAddress.MESSAGE_CLOSE_EDIT_WINDOW_CONFIRM')"
                         @cancelClose="$refs.CloseDialog.show(false)"
                         @close="dialogClose"></CloseDialog>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'EmailAddress',
    components: {
        UserList: resolve => require(['@c/EmailComponents/UserList'], resolve),
        SendUserList: resolve => require(['@c/EmailComponents/SendUserList'], resolve),
        headButtonO: resolve => require(['@c/HeadButton'], resolve),
        CloseDialog: resolve => require(['@c/CloseDialog'], resolve)
    },
    props: {
        's3nos': { // 选中文件夹/文件的S3NO
            type: Array,
            default: () => {
                return []
            }
        },
        'toUserList': {
            type: Array,
            default: () => {
                return []
            }
        },
        'ccUserList': {
            type: Array,
            default: () => {
                return []
            }
        },
        'bccUserList': {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
            innerVisibleEmailAddress: false,
            loading: false,
            imgDataO: [
                {
                    name: 'emailAddress.DISPLAY_MAILLING_LIST_VIEWER_BUTTON_ADD',
                    image: require('@a/images/usermanagement/usermanagemen-tree-add.svg')
                },
                {
                    name: 'emailAddress.DISPLAY_MAILLING_LIST_VIEWER_BUTTON_DELETE',
                    image: require('@a/images/usermanagement/usermanagemen-tree-dele.svg')
                }
            ],
            allOrMailingList: '', // 選択した選択肢
            allOrMailingListData: [], // 下拉框选项数据
            userListData: [], // 所用利用者
            sendUserListData: [], // 送付先(选中的利用者)
            sendUserListDataStringify: '',
            selectEventData: [], // 選択された利用者
            sendSelectClickEventData: [], // 選択された送付先
            type: 'To',
            name: 'To',
            typeOptions: [
                {
                    value: 'To',
                    label: 'To'
                },
                {
                    value: 'Cc',
                    label: 'Cc'
                },
                {
                    value: 'Bcc',
                    label: 'Bcc'
                }
            ],
            unwatchName: Object,
            unwatchUserListData: Object,
            unwatchSendUserListData: Object,
            unwatchSelectEventData: Object,
            unwatchSendSelectClickEventData: Object
        }
    },
    methods: {
        close () {
            if (this.sendUserListDataStringify !== JSON.stringify(this.sendUserListData)) {
                this.closeDialog = true
                this.$refs.CloseDialog.show(true)
            } else {
                this.dialogClose()
            }
        },
        emailAddress (type) {
            // 重置data的数据
            Object.assign(this.$data, this.$options.data())
            this.innerVisibleEmailAddress = true
            this.type = type // 宛先タイプ
            this.name = type
            this.allOrMailingList = 'all' // 下拉框默认值
            this.userListData = []
            this.sendUserListData = []
            if (JSON.parse(JSON.stringify(this.toUserList)).length > 0) {
                this.sendUserListData = this.sendUserListData.concat(JSON.parse(JSON.stringify(this.toUserList)))
            }
            if (JSON.parse(JSON.stringify(this.ccUserList)).length > 0) {
                this.sendUserListData = this.sendUserListData.concat(JSON.parse(JSON.stringify(this.ccUserList)))
            }
            if (JSON.parse(JSON.stringify(this.bccUserList)).length > 0) {
                this.sendUserListData = this.sendUserListData.concat(JSON.parse(JSON.stringify(this.bccUserList)))
            }
            this.sendUserListDataStringify = JSON.stringify(this.sendUserListData)
        },
        open () {
            this.$refs.emailAddressDialog.$el.children[0].classList.add('largeDialog')
            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
            /* pulldownのデータ 取得 */
            this.getMailingLists()
        },
        getMailingLists () {
            // pulldownのデータ設定
            this.allOrMailingListData = [{NO: 'all', MAILING_LIST_NAME: this.$t('emailAddress.MAILING_LIST_NAME')}]
            this.loading = true
            this.$request.folder.MailingListsGET('').then(response => {
                console.log('MailingListsGET - get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    for (let i = 0; i < data.result.length; i++) {
                        this.allOrMailingListData.push(data.result[i])
                    }
                }
                this.changeSelect('all')
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getMailingLists() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) this.dialogClose()
                    this.$request.requestError('MailingListsGET-get请求失败:', err)
                }
            })
        },
        // pulldownの選択値チェンジ処理
        changeSelect (NO) {
            this.getAddressData(NO === 'all' ? '-1' : NO)
        },
        // 指定邮件列表情报取得
        getAddressData (NO) {
            this.loading = true
            const body = (`{"noticeS3No": "${this.s3nos.toString()}"}`)
            this.$request.folder.MailAddresBelonging(NO, body).then(response => {
                console.log('MailAddresBelonging - get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.userListData = data.result
                    for (let i = 0; i < this.sendUserListData.length; i++) {
                        for (let j = 0; j < this.userListData.length; j++) {
                            if (this.sendUserListData[i]['NO'] === this.userListData[j]['NO']) {
                                this.userListData.splice(j, 1)
                            }
                        }
                    }
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getAddressData(NO) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) this.dialogClose()
                    this.$request.requestError('MailAddresBelonging-get请求失败:', err)
                }
            })
        },
        // 利用者チェックコールバック(选中邮件列表人员的数据回调 --- left)
        LiClickEvent (itme) {
            console.log('LiClickEvent:', itme)
            this.selectEventData = itme
        },
        // 送付先チェックコールバック(选中邮件列表人员的数据回调 --- right)
        sendLiClickEvent (itme) {
            console.log('sendLiClickEvent:', itme)
            this.sendSelectClickEventData = itme
        },
        // メール通知を追加する人
        handleCommand (command) {
            if (command === '追加' || command === '添加' || command === 'Add') {
                this.add()
            } else {
                this.del()
            }
        },
        // 追加
        add () {
            console.log(this.selectEventData, this.sendUserListData.length)
            this.$message.closeAll()
            if (this.selectEventData.length === 0) return
            if ((this.selectEventData.length + this.sendUserListData.length) > 50) {
                this.$message.warning(this.$t('emailAddress.DISPLAY_MAILLING_LIST_VIEWER_BUTTON_SAND'))
            } else {
                for (let i = 0; i < this.selectEventData.length; i++) {
                    for (let j = 0; j < this.userListData.length; j++) {
                        if (this.selectEventData[i]['NO'] === this.userListData[j]['NO']) {
                            this.userListData.splice(j, 1)
                        }
                    }
                    const user = {
                        'TYPE': this.name,
                        'BELONGING_NAME': this.selectEventData[i]['BELONGING_NAME'],
                        'NO': this.selectEventData[i]['NO'],
                        'NAME': this.selectEventData[i]['NAME'],
                        'MAILADDRESS': this.selectEventData[i]['MAILADDRESS']
                    }
                    this.sendUserListData.push(user)
                }
                this.remove()
            }
        },
        // 削除
        del () {
            if (this.sendSelectClickEventData.length === 0) {
                return
            }
            for (let i = 0; i < this.sendSelectClickEventData.length; i++) {
                for (let j = 0; j < this.sendUserListData.length; j++) {
                    if (this.sendSelectClickEventData[i]['NO'] === this.sendUserListData[j]['NO']) {
                        this.sendUserListData.splice(j, 1)
                    }
                }
                const user = {
                    'BELONGING_NAME': this.sendSelectClickEventData[i]['BELONGING_NAME'],
                    'NO': this.sendSelectClickEventData[i]['NO'],
                    'NAME': this.sendSelectClickEventData[i]['NAME'],
                    'MAILADDRESS': this.sendSelectClickEventData[i]['MAILADDRESS']
                }
                this.userListData.push(user)
            }
            console.log(this.sendUserListData)
            this.remove()
        },
        remove () {
            this.selectEventData = []
            this.sendSelectClickEventData = []
            this.$refs.UserList.user()
            this.$refs.SendUserList.sendUser()
        },
        // 登録ボタン処理
        register () {
            this.remove()
            if (this.sendUserListData.length > 50) {
                this.$message.warning(this.$t('emailAddress.DISPLAY_MAILLING_LIST_VIEWER_BUTTON_SAND'))
            } else {
                // 送付先データをパラメータとして
                this.dialogClose()
                this.$emit('SetFromEmailAddress', this.sendUserListData, this.type)
            }
        },
        // ブラウザの更新イベントを待ち受けています。
        beforeunloadHandler (e) {
            if (this.innerVisibleEmailAddress) {
                if (this.sendUserListDataStringify !== JSON.stringify(this.sendUserListData)) {
                    console.log('选择邮件联系人')
                    e = e || window.event
                    if (e) {
                        e.returnValue = ''
                    }
                    return ''
                }
            } else {
                this.dialogClose()
            }
        },
        // 内容を破棄し、メール通知画面へ戻る 確認
        dialogClose () {
            this.$refs.CloseDialog.show(false)
            this.innerVisibleEmailAddress = false
        }
    }
}

</script>
/*dialog */
<style lang="less" scoped>
@import url("../../../../less/pages/Files/AllFiles/Email/EmailAddress.less");
</style>
