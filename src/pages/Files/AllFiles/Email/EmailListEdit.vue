<template>
    <div id="emailListEdit">
        <el-dialog :title="type === '追加' ? $t('emailListEditAdd.DISPLAY_CHANGE_MAILING_LIST_TITLE_ADD') :$t('emailListEditAdd.DISPLAY_CHANGE_MAILING_LIST_TITLE_EDIT') "
                   :visible.sync="innerVisibleEmailListEditAdd"
                   :close-on-click-modal="false"
                   :before-close="applyToFoldersBelowClose"
                   :destroy-on-close="true"
                   append-to-body
                   @open="open"
                   class="dialog"
                   ref="emailListEditAdd"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="borderBox">
                <!--  メーリングリスト  name and 公開範囲 -->
                <div class="addMailTitle">
                    {{ $t('emailListEditAdd.DISPLAY_CHANGE_MAILING_LIST_LABEL_NAME') }}
                    <input ref="input"
                           v-change
                           v-model="title">
                    <div style="width: 20px;display: inline-block;vertical-align: middle;"></div>
                    {{ $t('emailListEditAdd.DISPLAY_CHANGE_MAILING_LIST_PUBLIC_TYPE') }}
                    <div id="item"
                         class="filterItem">
                        <div class="listRow">
                            <nav class="customNav">
                                <a class="custom"
                                   href="#">
                                    <span class="customName"
                                          style="border-radius:0;"
                                          @click="toggleClass($event,'1')">{{ $t('emailListEditAdd.DISPLAY_CHANGE_MAILING_LIST_VIEWER_BUTTON_THIS_PROJECT') }}</span>
                                </a>
                                <a class="custom"
                                   href="#">
                                    <span class="customName"
                                          style="border-radius: 0 4px 4px 0;"
                                          @click="toggleClass($event,'0')">{{ $t('emailListEditAdd.DISPLAY_CHANGE_MAILING_LIST_VIEWER_BUTTON_ONLY_MYSELF') }}</span>
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
                <!-- 所属 all user -->
                <div class="allOrMailingList">
                    <div class="select">
                        <el-select v-model="uuid"
                                   @change="changeSelect">
                            <el-option v-for="item in mailingLists"
                                       :key="item.NO"
                                       :label="item.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : item.BELONGING_NAME"
                                       :value="item.NO"
                                       style="cursor: default;">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="tableUserAddress">
                        <ul>
                            <li class="liHead border"
                                style="border-bottom: 1px solid #999999;">
                                {{ $t('emailListEditAdd.DISPLAY_CHANGE_MAILING_LIST_BELONG_TITLE') }}
                            </li>
                            <li class="liHead wo border">
                                {{ $t('emailListEditAdd.DISPLAY_CHANGE_MAILING_LIST_USER_TITLE') }}
                            </li>
                        </ul>
                        <ul class="ulBody"
                            onselectstart="return false;">
                            <li v-for="(itme,index) in mailingListUser"
                                :key="index"
                                :class="`sendUser${index}`"
                                @click.exact="notLoggedInClickEvent(index, itme)"
                                @click.ctrl="notLoggedInCtrlClickEvent(index, itme, $event)"
                                @click.meta="notLoggedInCtrlClickEvent(index, itme, $event)"
                                @click.shift="notLoggedInShiftClickEvent(index)">
                                <ul style="display: flex;">
                                    <li class="liHead li">
                                        <img :src="require('@a/images/usermanagement/usermanagement-user-icon.svg')" />
                                        <span style="margin-left: 25px; width: 114px;margin-top: 10px;"
                                              :title="itme.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : itme.BELONGING_NAME">
                                            {{ itme.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : itme.BELONGING_NAME }}
                                        </span>
                                    </li>
                                    <li class="liHead wo li">
                                        <span style="position: absolute;left: 10px;top: 1px;"
                                              :title="itme.NAME">
                                            {{ itme.NAME }}
                                        </span>
                                        <span style="position: absolute;left: 10px;top: 17px;;"
                                              :title="itme.MAILADDRESS">{{ itme.MAILADDRESS }}</span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- button -->
                <div class="operationImage">
                    <headButtonO :dat="imgDataO"
                                 @handleCommand="handleCommand"></headButtonO>
                </div>
                <!-- 登录者 -->
                <div class="divSendAddress">
                    <!-- <span class="spanSendAddress">{{ $t('emailListEditAdd.DISPLAY_CHANGE_MAILING_LIST_LOGIN_MEMBER') }}</span> -->
                    <div class="tableSendAddress">
                        <ul>
                            <li class="liHead wo border"
                                style="width: 36%;border-bottom: 1px solid #999999;">{{ $t('emailListEditAdd.DISPLAY_CHANGE_MAILING_LIST_BELONG_TITLE') }}</li>
                            <li class="liHead wo border"
                                style="margin-left: 8px;">{{ $t('emailListEditAdd.DISPLAY_CHANGE_MAILING_LIST_USER_TITLE') }}</li>
                        </ul>
                        <ul class="ulBody"
                            onselectstart="return false;">
                            <li v-for="(itme,index) in sendUserListData"
                                :key="index"
                                :class="`sendUserRegistered${index}`"
                                @click.exact="registerClickEvent(index, itme)"
                                @click.ctrl="registerCtrlClickEvent(index, itme, $event)"
                                @click.meta="registerCtrlClickEvent(index, itme, $event)"
                                @click.shift="registerShiftClickEvent(index)">
                                <ul style="display: flex; cursor: default;">
                                    <li class="liHead li">
                                        <img style="right: auto;"
                                             :src="require('@a/images/usermanagement/usermanagement-user-icon.svg')" />
                                        <span style="margin-left: 25px; width: 114px;margin-top: 10px;"
                                              :title="itme.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : itme.BELONGING_NAME">
                                            {{ itme.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : itme.BELONGING_NAME }}
                                        </span>
                                    </li>
                                    <li class="liHead wo li">
                                        <span style="position: absolute;left: 0px;top: 1px;"
                                              :title="itme.NAME">{{ itme.NAME }}</span>
                                        <span style="position: absolute;left: 0px;top: 17px;"
                                              :title="itme.MAILADDRESS">{{ itme.MAILADDRESS }}</span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div slot="footer"
                 class="dialog-footer">
                <button class="button buttonHighlight"
                        @click="register">
                    {{
                        type === '追加' ? $t('emailListEditAdd.DISPLAY_MAILLING_LIST_EDIT_VIEWER_BUTTON_ADD') :
                        $t('emailListEditAdd.DISPLAY_CHANGE_MAILING_LIST_BUTTON_LOGIN')
                    }}
                </button>
            </div>

            <CloseDialog ref="CloseDialog"
                         :content="$t('emailListEditAdd.MESSAGE_CLOSE_EDIT_WINDOW_CONFIRM')"
                         @cancelClose="$refs.CloseDialog.show(false)"
                         @close="close"></CloseDialog>
        </el-dialog>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
    name: 'EmailListEdit',
    components: {
        headButtonO: resolve => require(['@c/HeadButton'], resolve),
        CloseDialog: resolve => require(['@c/CloseDialog'], resolve)
    },
    data () {
        return {
            innerVisibleEmailListEditAdd: false,
            loading: false,
            imgDataO: [
                {
                    name: 'emailListEditAdd.DISPLAY_MAILLING_LIST_EDIT_VIEWER_BUTTON_ADD',
                    image: require('@a/images/usermanagement/usermanagemen-tree-add.svg')
                },
                {
                    name: 'emailListEditAdd.DISPLAY_MAILLING_LIST_EDIT_VIEWER_BUTTON_DELETE',
                    image: require('@a/images/usermanagement/usermanagemen-tree-dele.svg')
                }
            ],
            type: '',
            selectMailingList: {},
            title: '',
            publicType: '',
            mailingLists: [], // 邮件列表
            mailingListUser: [], // 选中邮件的人员
            uuid: '', // 选中邮件列表的UUID
            liClickEventData: [], // 选中的人员
            sendUserListData: [], // 新添加的邮件列表的人员
            sendUserListDataStringify: '',
            titleStringify: '',
            publicTypeStringify: '',

            // 宛先
            userData: [], // 多选数据
            userRow: {index: 0},
            // 登録メンバー
            registeredMembersData: [], // 多选数据
            registeredRow: {index: 0}
        }
    },
    methods: {
        /* 监听浏览器刷新事件 */
        beforeunloadHandlerEmailListEditAdd (e) {
            let beforeunload = false
            if (this.type === '追加') {
                if (this.title || this.publicType !== '1' || this.sendUserListData.length > 0) {
                    beforeunload = true
                }
            } else if (this.type === '編集') {
                if (
                    JSON.stringify(this.sendUserListData) !== this.sendUserListDataStringify ||
                    this.title !== this.titleStringify ||
                    this.publicType !== String(this.publicTypeStringify)
                ) {
                    beforeunload = true
                }
            }
            console.log(`Email --> EmailListEdit: ${this.type}`, beforeunload)
            if (beforeunload) {
                e = e || window.event
                if (e) {
                    e.returnValue = '关闭提示'
                }
                return beforeunload
            }
            return
        },
        /* close */
        applyToFoldersBelowClose () {
            if (this.type === '追加') {
                if (this.title || this.publicType !== '1' || this.sendUserListData.length > 0) {
                    this.$refs.CloseDialog.show(true)
                    return
                }
            } else {
                console.log(JSON.stringify(this.sendUserListData), this.sendUserListDataStringify)
                console.log(this.title, this.titleStringify)
                console.log(this.publicType, this.publicTypeStringify)
                if (
                    JSON.stringify(this.sendUserListData) !== this.sendUserListDataStringify ||
                    this.title !== this.titleStringify ||
                    this.publicType !== String(this.publicTypeStringify)
                ) {
                    this.$refs.CloseDialog.show(true)
                    return
                }
            }
            this.close()
        },
        open () {
            this.$refs.emailListEditAdd.$el.children[0].classList.add('largeDialog')
        },
        addOrEditEmailList (type, selectMailingList, mailingListUser) {
            $('#item .customName').removeClass('active')
            this.innerVisibleEmailListEditAdd = true
            this.type = type
            if (this.type === '編集') {
                this.selectMailingList = JSON.parse(JSON.stringify(selectMailingList))
                this.title = this.selectMailingList.MAILING_LIST_NAME
                this.titleStringify = this.selectMailingList.MAILING_LIST_NAME
                this.publicType = String(this.selectMailingList.PUBLIC_TYPE)
                this.publicTypeStringify = this.selectMailingList.PUBLIC_TYPE
                this.sendUserListData = JSON.parse(JSON.stringify(mailingListUser))
                this.sendUserListDataStringify = JSON.stringify(mailingListUser)
            } else {
                this.title = ''
                this.selectMailingList = {}
                this.publicType = '1'
                this.publicTypeStringify = '1'
                this.sendUserListData = []
            }
            this.getBelonging()

            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', e => this.beforeunloadHandlerEmailListEditAdd(e))
        },
        toggleClass (event, publicType) {
            if (String(publicType) === '2') {
                return
            }
            $('#item .customName').removeClass('active')
            $(event.target).addClass('active')
            this.publicType = publicType
        },
        handleCommand (command) {
            if (command === '追加' || command === '添加' || command === 'Add') {
                this.add()
            } else {
                this.del()
            }
        },
        add () {
            console.log('add', this.userData)
            const lengthb = this.sendUserListData.length > 0
            const USERNOS = []
            const alreadyExist = []
            if (lengthb) {
                for (let i = this.sendUserListData.length - 1; i >= 0; i--) {
                    USERNOS.push(this.sendUserListData[i].NO)
                }
            }
            for (let index = this.userData.length - 1; index >= 0; index--) {
                if (lengthb) {
                    if (USERNOS.indexOf(this.userData[index].NO) === -1) {
                        this.sendUserListData.push(this.userData[index])
                    } else {
                        alreadyExist.push(this.userData[index].NAME)
                    }
                } else {
                    this.sendUserListData.push(this.userData[index])
                }
            }
            if (alreadyExist.length > 0) {
                this.$message.warning(`${this.$t('emailListEditAdd.DISPLAY_USER')}【${alreadyExist.toString()}】${this.$t('emailListEditAdd.DISPLAY_USER_EXIST')}`)
            }
            this.clearSelect()
        },
        del () {
            console.log('del', this.registeredMembersData)
            const lengthb = this.sendUserListData.length > 0
            const USERNOS = []
            if (lengthb) {
                for (let i = this.sendUserListData.length - 1; i >= 0; i--) {
                    for (let index = this.registeredMembersData.length - 1; index >= 0; index--) {
                        const sendUserListDataNO = this.sendUserListData[i].NO
                        const registeredMembersDataNO = this.registeredMembersData[index].NO
                        if (sendUserListDataNO === registeredMembersDataNO) {
                            USERNOS.push(this.sendUserListData[i].NO)
                            continue
                        }
                    }
                }
                const sendUserListData = this.sendUserListData.filter(data => {
                    return USERNOS.indexOf(data.NO) === -1
                })
                this.sendUserListData = sendUserListData
            }
            console.log(this.sendUserListData)
            this.clearSelect()
        },
        // click
        notLoggedInClickEvent (index, item) {
            this.clearSelect()
            this.userRow = JSON.parse(JSON.stringify(item))
            this.userRow.index = index
            this.userData.push(item)
            $(`.sendUser${index}`).addClass('sendUser')
        },
        // ctrl + click
        notLoggedInCtrlClickEvent (index, item, event) {
            if (
                event.currentTarget.classList.length >= 2 &&
                event.currentTarget.className.indexOf('sendUser') !== -1
            ) {
                $(`.sendUser${index}`).removeClass('sendUser')
                const userData = this.userData.filter(d => { return item !== d })
                this.userData = userData
            } else {
                this.userRow = JSON.parse(JSON.stringify(item))
                this.userRow.index = index
                this.userData.push(item)
                $(`.sendUser${index}`).addClass('sendUser')
            }
        },
        // shift + click
        notLoggedInShiftClickEvent (index) {
            console.log(this.userRow)
            this.clearSelect()
            const mailingListUser = this.mailingListUser
            if (index < this.userRow.index) {
                for (let i = index; i <= this.userRow.index; i++) {
                    $(`.sendUser${i}`).addClass('sendUser')
                    this.userData.push(mailingListUser[i])
                }
            } else if (index > this.userRow.index) {
                for (let i = index; i >= this.userRow.index; i--) {
                    $(`.sendUser${i}`).addClass('sendUser')
                    this.userData.push(mailingListUser[i])
                }
            } else {
                $(`.sendUser${index}`).addClass('sendUser')
                this.userData.push(mailingListUser[index])
                return
            }
            console.log(this.userData)
        },
        // click
        registerClickEvent (index, item) {
            this.clearSelect()
            this.registeredRow = JSON.parse(JSON.stringify(item))
            this.registeredRow.index = index
            this.registeredMembersData.push(item)
            $(`.sendUserRegistered${index}`).addClass('sendUserRegistered')
        },
        // ctrl + click
        registerCtrlClickEvent (index, item, event) {
            if (
                event.currentTarget.classList.length >= 2 &&
                event.currentTarget.className.indexOf('sendUserRegistered') !== -1
            ) {
                $(`.sendUserRegistered${index}`).removeClass('sendUserRegistered')
                const registeredMembersData = this.registeredMembersData.filter(d => { return item !== d })
                this.registeredMembersData = registeredMembersData
            } else {
                this.registeredRow = JSON.parse(JSON.stringify(item))
                this.registeredRow.index = index
                this.registeredMembersData.push(item)
                $(`.sendUserRegistered${index}`).addClass('sendUserRegistered')
            }
        },
        // shift + click
        registerShiftClickEvent (index) {
            this.clearSelect()
            const sendUserListData = this.sendUserListData
            if (index < this.registeredRow.index) {
                for (let i = index; i <= this.registeredRow.index; i++) {
                    $(`.sendUserRegistered${i}`).addClass('sendUserRegistered')
                    this.registeredMembersData.push(sendUserListData[i])
                }
            } else if (index > this.registeredRow.index) {
                for (let i = index; i >= this.registeredRow.index; i--) {
                    $(`.sendUserRegistered${i}`).addClass('sendUserRegistered')
                    this.registeredMembersData.push(sendUserListData[i])
                }
            } else {
                $(`.sendUserRegistered${index}`).addClass('sendUserRegistered')
                this.registeredMembersData.push(sendUserListData[index])
            }
        },
        // clear
        clearSelect () {
            this.userData = []
            this.registeredMembersData = []
            $('.sendUser').removeClass('sendUser')
            $('.sendUserRegistered').removeClass('sendUserRegistered')
        },
        // メーリングリストの選択
        changeSelect (data) {
            data === -1 ? this.getUserManagement() : this.getSIOfUserInformation(this.uuid)
        },
        // 所属情報取得
        getBelonging () {
            this.loading = true
            this.mailingLists = [{
                BELONGING_NAME: this.$t('emailListEditAdd.DISPLAY_CHANGE_MAILING_LIST_DEFAULT_BELONGING_NAME'),
                NO: -1
            }]
            this.mailingListUser = []
            this.liClickEventData = []
            this.uuid = this.mailingLists[0].NO
            this.$request.usermanagement.getBelonging('').then(response => {
                console.log('getBelonging-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'EmailListEdit')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    if (data.result.length > 0) {
                        for (let index = 0; index < data.result.length; index++) {
                            this.mailingLists.push(data.result[index])
                        }
                    }
                    this.getUserManagement()
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getBelonging() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.close()
                    }
                    this.$request.requestError('getBelonging-get请求失败', err, 'EmailListEdit')
                }
            })
        },
        // 所属情報user取得
        getUserManagement () {
            this.loading = true
            const body = ('{"access": "1", "iaAdmin": "FALSE"}')
            this.$request.usermanagement.getUserManagement(body).then(response => {
                console.log('getUserManagement-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'EmailListEdit')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.mailingListUser = data.result
                }
                this.loading = false
                const customs = document.getElementsByClassName('customName')
                if (this.publicType === '1') {
                    customs[0].classList.add('active')
                } else if (this.publicType === '0') {
                    customs[1].classList.add('active')
                }
                this.$refs.input.focus()
                this.$refs.input.value = ''
                this.$refs.input.value = this.title
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getUserManagement() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.close()
                    }
                    this.$request.requestError('getUserManagement-get请求失败', err, 'EmailListEdit')
                }
            })
        },
        // 所属情報の利用者情報取得
        getSIOfUserInformation (NO) {
            this.loading = true
            this.tableData = []
            const body = ('{"access": "1", "iaAdmin": "FALSE"}')
            this.$request.usermanagement.getSubordinateIntelligenceOfUserInformation(NO, body).then(response => {
                console.log('getSIOfUserInformation-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'EmailListEdit')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.mailingListUser = data.result
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getSIOfUserInformation(NO) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.close()
                    }
                    this.$request.requestError('getSIOfUserInformation-get请求失败', err, 'EmailListEdit')
                }
            })
        },
        register () {
            const lengthb = this.sendUserListData.length > 0
            let USERNOS = ''
            if (lengthb) {
                for (let i = this.sendUserListData.length - 1; i >= 0; i--) {
                    USERNOS += this.sendUserListData[i].NO
                    if (i !== 0) {
                        USERNOS += ','
                    }
                }
            }
            if (!this.title) {
                // this.$message.warning(this.$t('emailListEditAdd.MESSAGE_TITLE_NOT_EXIST'))
                return
            }
            if (!this.publicType) {
                // this.$message.warning(this.$t('emailListEditAdd.MESSAGE_PUBLIC_TYPE_NOT_EXIST'))
                return
            }
            let title = this.title
            if (/[{}\\"]/gm.test(title)) {
                title = this.$request.replaceMethod(this.title)
                console.log(title)
            }
            if (this.type === '追加') {
                this.appendMailingList(USERNOS, title)
            } else {
                this.updateMailingList(this.selectMailingList.NO, USERNOS, title)
            }
        },
        // メーリングリスト作成
        appendMailingList (USERNOS, title) {
            this.loading = true
            const body = ('{"mailingListName":"' + title + '","publicType":' + this.publicType + ',"users":"' + USERNOS + '"}')
            this.$request.folder.MailingListADD(body).then(response => {
                console.log('MailingListADD - post请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'EmailListEdit')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$emit('MailingListsGET')
                    this.close()
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.appendMailingList(USERNOS, title) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.close()
                    }
                    this.$request.requestError('MailingListADD-post请求失败', err, 'EmailListEdit')
                }
            })
        },
        // メーリングリスト更新を指定する
        updateMailingList (uuid, USERNOS, title) {
            this.loading = true
            const body = ('{"mailingListName":"' + title + '","publicType":' + this.publicType + ',"users":"' + USERNOS + '"}')
            this.$request.folder.MailingListUPDATE(uuid, body).then(response => {
                console.log('MailingListUPDATE - patch请求成功:', response.status, response.statusText)
                this.loading = false
                this.innerVisibleDestinationChoiceMailingListEdit = false
                const data = this.$request.CODE(response.data, 'EmailListEdit')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$emit('MailingListUPDATE', uuid, title, this.publicType, this.sendUserListData)
                    this.close()
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.updateMailingList() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.close()
                    }
                    this.$request.requestError('MailingListUPDATE-patch请求失败', err, 'EmailListEdit')
                }
            })
        },
        close () {
            this.type = ''
            this.innerVisibleEmailListEditAdd = false
            window.removeEventListener('beforeunload', e => this.beforeunloadHandlerEmailListEditAdd(e))
        }
    }
}

</script>
/*dialog */
<style lang="less" scoped>
@import url("../../../../less/pages/Files/AllFiles/Email/EmailListEdit.less");
</style>
