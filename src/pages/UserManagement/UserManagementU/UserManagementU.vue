<template>
    <div id="userManagementU">
        <v-contextmenu ref="userContextmenu"
                       class="userContextmenu"
                       auto-placement
                       :theme="theme"
                       @hide="hide">
            <v-contextmenu-item :disabled="disabled"
                                @click="contextmenuEvent('編集')">{{ $t('common.EDIT') }}</v-contextmenu-item>
            <v-contextmenu-item :disabled="!userAuccessDisabled"
                                @click="contextmenuEvent('削除')">{{ $t('common.DELETE') }}</v-contextmenu-item>
            <v-contextmenu-item :disabled="disabled || disabledProcedureUpdateMailAddress"
                                @click="contextmenuEvent('パスワードの変更')">
                {{ $t('UserManagementU.DISPLAY_CHANGE_PASSWORD_TITLE') }}
            </v-contextmenu-item>
        </v-contextmenu>

        <el-container>
            <el-header height="72px">
                <div :class="['belongsButton', !userAuccessDisabled ? 'opacity' : '']">
                    <headButtonO :dat="imgDataO"
                                 @handleCommand="handleCommand"></headButtonO>
                    <p :class="userAuccessDisabled ? (delDisabled? 'showOpacity right' : 'hidden') : 'hidden'"
                       :style="$i18n.locale === 'en' ? 'width: 59px;': ''"></p>
                </div>
                <div class="usersButton">
                    <headButtonT :dat="imgDataT"
                                 @handleCommand="handleCommand"></headButtonT>
                    <p :class="disabled || tableData.length < 1? 'showOpacity center' : 'hidden'"></p>
                    <p :class="!userAuccessDisabled ? 'showOpacity left' : 'hidden'"></p>
                    <p :class="!userAuccessDisabled || tableData.length < 1? 'showOpacity right' : 'hidden'"></p>
                </div>
            </el-header>
            <el-main>
                <Split>
                    <SplitArea :size="24"
                               style="overflow: auto;">
                        <ul class="belongs">
                            <li class="belongsTitle">
                                <p>
                                    {{ $t('UserManagementU.DISPLAY_USER_INFO_DG_BELONGING_ROW_TITLE_BELONGING_NAME') }}
                                </p>
                            </li>
                            <div class="belongsList">
                                <List ref="list"
                                      :name="$t('UserManagementU.DialogName')"
                                      :show="false"
                                      :templatelist="belonging"
                                      @hideContextmenu="hideContextmenu"
                                      @selectedDataEvent="selectedDataEvent"
                                      @selection="userSelection"
                                      @edit="belongEdit"
                                      @handleCommand="handleCommand"
                                      @deleteEvent="deleteEvent"></List>
                            </div>
                        </ul>
                    </SplitArea>
                    <SplitArea :size="76"
                               style="overflow-x: auto;overflow-y: hidden;"
                               v-loading="loading"
                               :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                               element-loading-spinner="el-icon-loading"
                               element-loading-background="rgba(255,255,255,.4)">
                        <el-table ref="userTable"
                                  size="mini"
                                  height="100%"
                                  tooltip-effect="dark"
                                  :class="['box', theme, 'userTable']"
                                  :data="tableData"
                                  :cell-style="rowRed"
                                  :header-cell-class-name="headerCellClassName"
                                  :row-class-name="tableRowClassName"
                                  @header-click="headerClickEvent"
                                  @selection-change="handleSelectionChange"
                                  @row-click="rowClickEvent"
                                  @row-contextmenu="rowContextmenu"
                                  oncontextmenu="return false;"
                                  onselectstart="return false;">
                            <el-table-column prop="USER_ID"
                                             :label="$t('UserManagementU.DISPLAY_USER_INFO_DG_USER_ROW_TITLE_LOGIN_ID')"
                                             min-width="100">
                                <template slot-scope="scope">
                                    <span style="position: relative;">
                                        <div style="display: inline-block;">
                                            <img :src="require('@a/images/usermanagement/usermanagement-user-icon.svg')"
                                                 style="width: 14.11px;height: 17.4px;vertical-align: middle;margin-right: 12px;" />
                                        </div>
                                        {{ scope.row.USER_ID }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="NAME"
                                             :label="$t('UserManagementU.DISPLAY_USER_INFO_DG_USER_TITLE_USER_NAME')"
                                             min-width="100">
                                <template slot-scope="scope">
                                    <span :title="scope.row.NAME">{{ scope.row.NAME }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="MAILADDRESS"
                                             :label="$t('UserManagementU.DISPLAY_USER_INFO_DG_USER_TITLE_MAILADDRESS')">
                                <template slot-scope="scope">
                                    <span :title="scope.row.MAILADDRESS">{{ scope.row.MAILADDRESS }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="department.BELONGING_NAME === '全て'"
                                             prop="BELONGING_NAME"
                                             :label="$t('UserManagementU.DISPLAY_USER_INFO_DG_BELONGING_ROW_TITLE_BELONGING_NAME')"
                                             min-width="80">
                                <template slot-scope="scope">
                                    <span :title="scope.row.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : scope.row.BELONGING_NAME">
                                        {{ scope.row.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : scope.row.BELONGING_NAME }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="AUTHORITY_NAME"
                                             :label="$t('UserManagementU.DISPLAY_USER_INFO_DG_USER_TITLE_AUTH_NAME')"
                                             min-width="140">
                                <template slot-scope="scope">
                                    <span>{{ $t(scope.row.i18n) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="PROCEDURE"
                                             :label="$t('UserManagementU.DISPLAY_USER_INFO_DG_USER_TITLE_REMARKS')"
                                             min-width="150">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.PROCEDURE_INSERT_USER === 1"
                                          style="color: #D61918">
                                        {{ $t('UserManagementU.DISPLAY_USER_INFO_DG_USER_REMARKS_NOTE1') }}
                                    </span>
                                    <span v-if="scope.row.PROCEDURE_UPDATE_MAILADDRESS === 1"
                                          style="color: #D61918">
                                        {{ $t('UserManagementU.ChangeEmailAddress') }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </SplitArea>
                </Split>
            </el-main>
        </el-container>

        <!-- 所属编辑 -->
        <BelongingEdit ref="BelongingEdit"
                       @belonging="getBelonging"></BelongingEdit>
        <!-- パスワード変更 -->
        <ChangePassword ref="ChangePassword"></ChangePassword>
        <UserInformationEdit ref="UserInformationEdit"
                             @InformationAdd="informationAdd"
                             @InformationUpdate="informationUpdate"></UserInformationEdit>

        <el-dialog :visible.sync="toFoldersBelow"
                   :title="$t('UserManagementU.BelongingDeleteTitle')"
                   :close-on-click-modal="false"
                   :before-close="applyToFoldersBelowClose"
                   :destroy-on-close="true"
                   append-to-body
                   class="userdeleteingdialog">
            {{ $t('UserManagementU.BelongingDelete') }}<br /><br />

            <div v-html="!del ? selectedDataName : deleteEventData.BELONGING_NAME">
                {{ !del ? selectedDataName : deleteEventData.BELONGING_NAME }}
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <button class="button"
                        @click="applyToFoldersBelowClose">{{ $t('common.NO') }}</button>
                <button class="button buttonDelete margin"
                        @click="deleteInformation">
                    {{ $t('common.YES') }}
                </button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="toFoldersBelowDel"
                   :title="$t('UserManagementU.BelongingUserDeleteTitle')"
                   :close-on-click-modal="false"
                   :before-close="applyToFoldersBelowClose"
                   :destroy-on-close="true"
                   append-to-body
                   class="userdeleteingdialog">
            {{ $t('UserManagementU.BelongingUserDelete1') }}
            {{ multiSelectData.length === 0 ? (contextmenuData.NO ? 1 : 0) : multiSelectData.length }}
            {{ $t('UserManagementU.BelongingUserDelete2') }}
            <span slot="footer"
                  class="dialog-footer">
                <button class="button"
                        @click="applyToFoldersBelowClose">{{ $t('common.NO') }}</button>
                <button class="button buttonDelete margin"
                        @click="deleteUserInformation(multiSelectData || [contextmenuData])">
                    {{ $t('common.YES') }}
                </button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import bus from '@c/bus'
import {natsort} from '@u/natsort-1.2.4.js'

export default {
    name: 'UserManagementU',
    components: {
        List: resolve => require(['@p/UserManagement/components/List'], resolve),
        BelongingEdit: resolve => require(['./BelongingEdit'], resolve),
        ChangePassword: resolve => require(['./ChangePassword'], resolve),
        UserInformationEdit: resolve => require(['./UserInformationEdit'], resolve),
        headButtonO: resolve => require(['@c/HeadButton'], resolve),
        headButtonT: resolve => require(['@c/HeadButton'], resolve)
    },
    props: {
        theme: {
            type: String,
            default: 'default'
        }
    },
    data () {
        return {
            loading: false,
            toFoldersBelow: false,
            toFoldersBelowDel: false,
            imgDataO: [
                {
                    name: 'UserManagementU.BelongAdd',
                    image: require('@a/images/usermanagement/usermanagementu-belong-add.svg')
                },
                {
                    name: 'UserManagementU.BelongDelete',
                    image: require('@a/images/usermanagement/usermanagementu-belong-del.svg')
                }
            ],
            imgDataT: [
                {
                    name: 'UserManagementU.UserAdd',
                    image: require('@a/images/usermanagement/usermanagementu-usermanagement-add.svg')
                },
                {
                    name: 'UserManagementU.UserEdit',
                    image: require('@a/images/usermanagement/usermanagementu-usermanagement-edit.svg')
                },
                {
                    name: 'UserManagementU.UserDelete',
                    image: require('@a/images/usermanagement/usermanagementu-usermanagement-del.svg')
                }
            ],
            menuDatas: [],
            selectionBoxData: [], // プルダウンリスト作成---権限(下拉列表做成 --- 权限)
            belonging: [], // 所属データ(所属数据)
            tableData: [], // 利用者データ(利用者数据)
            department: {'NO': 0, 'BELONGING_NAME': '全て'}, // 選ばれた所属データ(选中的所属数据)
            selectedData: [],
            selectedDataName: '',
            del: false, // 是否右键
            disabled: false, // 选中的所属中的用户是否是大于1的
            delDisabled: false, // 选中的所属是否是 全て 或者 (所属なし)
            userAuccessDisabled: false, // 登录的用户是或否是管理员
            disabledProcedureUpdateMailAddress: false,
            deleteEventData: {}, // 右键数据
            contextmenuData: {}, // データを単選で選ぶ(单选选中数据)
            multiSelect: [], // マウスクリックの行インデックスを複数選択する(多选时鼠标单击的行索引)
            multiSelectData: [], // データを選ぶ(选中数据)
            isCtrl: false,
            isShift: false,
            changeFlag: true, // パスワード変更表示用(密码变更显示用)
            sortName: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            const that = this

            // 権限取得リスト
            that.selectionBox()
            bus.$on('storeUpdata', () => {
                that.userAuccessDisabled = that.$store.state.userInfo.isAdmin ||
                                            that.$store.state.userInfo.authorityName === 'プロジェクト管理者'
            })
            const isWin = (navigator.platform === 'Win32') || (navigator.platform === 'Windows')
            const isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') ||
                            (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
            document.addEventListener('keydown', e => {
                if ((e.keyCode === 17 && isWin) || (e.keyCode === 91 && isMac)) {
                    that.isCtrl = true
                } else if (e.keyCode === 16) {
                    that.isShift = true
                }
            })
            document.addEventListener('keyup', e => {
                if ((e.keyCode === 17 && isWin) || (e.keyCode === 91 && isMac)) {
                    that.isCtrl = false
                } else if (e.keyCode === 16) {
                    that.isShift = false
                    that.multiSelect = []
                }
            })
        })
    },
    // 离开页面时,重置data的数据
    destroyed () {
        Object.assign(this.$data, this.$options.data())
    },
    methods: {
        sort (name) {
            if (this.name && this.name === name) {
                this.tableData.reverse()
            } else {
                const tableData = natsort(this.tableData, convert)
                this.tableData = Object.assign([], this.tableData, tableData)
            }
            this.name = name
            this.cellClickEvent({row: this.tableData[0]})
            const DISPLAY_USER_INFO_DG_USER_REMARKS_NOTE1 = this.$t('UserManagementU.DISPLAY_USER_INFO_DG_USER_REMARKS_NOTE1')
            const ChangeEmailAddress = this.$t('UserManagementU.ChangeEmailAddress')
            function convert (value) { // 配列の要素を受け取る
                if (name === 'PROCEDURE') {
                    if (value.PROCEDURE_INSERT_USER === 1) {
                        return DISPLAY_USER_INFO_DG_USER_REMARKS_NOTE1
                    } else if (value.PROCEDURE_UPDATE_MAILADDRESS === 1) {
                        return ChangeEmailAddress
                    } else {
                        return ''
                    }
                } else {
                    return value[name]/* .toString() */ // 要素値となる配列オブジェクトの "1" プロパティを比較する
                }
            }
        },
        // close
        applyToFoldersBelowClose () {
            this.toFoldersBelow = false
            this.toFoldersBelowDel = false
        },
        informationAdd () {
            // 所属情报的利用者情报取得
            this.department.BELONGING_NAME === '全て' ? this.getUserManagement() : this.getSIOfUserInformation(this.department.NO)
        },
        informationUpdate (bool) {
            if (bool) this.selectionBox()
            this.department.BELONGING_NAME === '全て' ? this.getUserManagement() : this.informationAdd()
        },
        // 所属データ選択
        selectedDataEvent (data) {
            this.del = false
            this.delDisabled = false
            this.selectedData = data
            let name = ''
            for (let index = 0; index < data.length; index++) {
                name += '<p style="width: 368px;overflow:hidden;text-overflow:ellipsis; white-space:nowrap;" title="' +
                            data[index].BELONGING_NAME + '">' +
                            data[index].BELONGING_NAME +
                        '</p>'
                if (data[index].BELONGING_NAME === '(所属なし)' || data[index].BELONGING_NAME === '全て') {
                    this.delDisabled = true
                }
            }
            this.selectedDataName = name
        },
        // 所属情報選択
        userSelection (item) {
            this.department = item
            if (item.BELONGING_NAME === '全て') {
                // 所属情報取得
                this.getUserManagement()
            } else {
                // 所属情报的利用者情报取得
                this.getSIOfUserInformation(this.department.NO)
            }
        },
        // 所属名の修正
        belongEdit (NO, BELONGING_NAME) {
            this.$refs.BelongingEdit.show(true, NO, BELONGING_NAME)
        },
        deleteEvent (data) {
            this.del = true
            this.deleteEventData = data
            this.toFoldersBelow = true
        },
        headerClickEvent (column, event) {
            console.log(column, event)
            this.sort(column.property)
        },
        // show user Contextmenu
        rowContextmenu (row, column, event) {
            this.$refs.list.hideContextmenu()
            let x = event.pageX
            let y = event.pageY
            if (document.body.clientHeight - y <= 122) {
                y = document.body.clientHeight - 122
            }
            if (document.body.clientWidth - x <= 192) {
                x = document.body.clientWidth - 192
            }
            const postition = {
                top: y,
                left: x
            }
            // this.hide()
            if (!this.disabled) {
                this.disabledProcedureUpdateMailAddress = row.PROCEDURE_UPDATE_MAILADDRESS > 0 || row.PROCEDURE_INSERT_USER > 0
                this.cellClickEvent({row})
            }
            this.$refs.userContextmenu.show(postition)
        },
        hide () {
            this.disabled = this.multiSelectData.length > 1
        },
        hideContextmenu () {
            this.$refs.userContextmenu.hide()
        },
        // user Contextmenu Event
        contextmenuEvent (vm) {
            console.log(vm)
            if (vm === '編集') {
                this.handleCommand(this.$t('UserManagementU.UserEdit'))
            } else if (vm === '削除') {
                this.handleCommand(this.$t('UserManagementU.UserDelete'))
            } else if (vm === 'パスワードの変更') {
                this.handleCommand('パスワードの変更')
            }
        },
        // ボタンイベント(header - 按钮点击事件)
        handleCommand (command) {
            this.$refs.list.hideContextmenu()
            this.hideContextmenu()
            console.log(this.$t('UserManagementU.BelongDelete'))
            if (command === this.$t('UserManagementU.BelongAdd')) {
                this.$refs.BelongingEdit.show(false)
            } else if (command === this.$t('UserManagementU.BelongDelete')) {
                if (this.selectedData.length <= 0) {
                    this.$message.warning(this.$t('UserManagementU.WarningMessage1'))
                    return
                }
                this.toFoldersBelow = true
            } else if (command === this.$t('UserManagementU.UserAdd')) {
                console.log(this.department)
                this.$refs.UserInformationEdit.show(false, this.department)
            } else if (command === this.$t('UserManagementU.UserEdit')) {
                if (this.multiSelectData.length > 1 || this.multiSelectData.length === 0) {
                    this.$message.warning(this.$t('UserManagementU.WarningMessage2'))
                    return
                }
                console.log(this.multiSelectData[0])
                this.$refs.UserInformationEdit.show(true, this.multiSelectData[0])
            } else if (command === this.$t('UserManagementU.UserDelete')) {
                if (this.multiSelectData.length === 0) {
                    this.$message.warning(this.$t('UserManagementU.WarningMessage3'))
                    return
                }
                this.deleteUser()
            } else {
                if (this.multiSelectData.length > 1 || this.multiSelectData.length === 0) {
                    this.$message.warning(this.$t('UserManagementU.WarningMessage2'))
                    return
                }
                this.changeFlag = true
                if (this.multiSelectData[0].PROCEDURE_INSERT_USER !== 0 || this.multiSelectData[0].PROCEDURE_UPDATE_MAILADDRESS !== 0) {
                    this.changeFlag = false
                }
                this.$refs.ChangePassword.show(this.multiSelectData[0], this.changeFlag)
            }
        },
        // 多選事件(多选事件)
        rowClickEvent (row) {
            if (this.isCtrl && !this.isShift) { // 键盘事件: Ctrl
                this.contextmenuData = {}
                this.$refs.userTable.toggleRowSelection(row)
                for (let index = 0; index < this.multiSelectData.length; index++) {
                    if (this.multiSelectData[index].NO === row.NO) {
                        this.contextmenuData = row
                    }
                }
            } else if (!this.isCtrl && this.isShift) { // 键盘事件: Shift
                // this.multiSelect.push(row.index)
                if (row.index < this.contextmenuData.index) {
                    // 清空选中状态
                    this.$refs.userTable.clearSelection()
                    for (let i = row.index; i <= this.contextmenuData.index; i++) {
                        this.$refs.userTable.toggleRowSelection(this.tableData[i], true)
                    }
                } else if (row.index > this.contextmenuData.index) {
                    // 清空选中状态
                    this.$refs.userTable.clearSelection()
                    for (let i = this.contextmenuData.index; i <= row.index; i++) {
                        this.$refs.userTable.toggleRowSelection(this.tableData[i], true)
                    }
                } else if (row.index === this.contextmenuData.index) {
                    return
                }
            } else {
                this.cellClickEvent({row})
            }
        },
        // クリック選択 user
        cellClickEvent ({row}) {
            if (!row) return
            this.multiSelect = []
            this.multiSelectData = []
            this.contextmenuData = row
            this.$refs.userTable.clearSelection() // 清空选中
            this.$refs.userTable.toggleRowSelection(row, true) // 设置选中
        },
        // 行データを取得する(获取选中行数据)
        handleSelectionChange (selection) {
            this.multiSelectData = selection
            this.hide()
        },
        // 行データをレンダリングする(渲染行数据)
        rowRed ({rowIndex}) {
            for (let i = 0; i < this.multiSelectData.length; i++) {
                if (rowIndex === this.multiSelectData[i].index) {
                    return {backgroundColor: '#ccddee'}
                }
            }
        },
        // 行ごとのインデックスをrowに入れる(把每一行的索引放进row)
        tableRowClassName ({row, rowIndex}) {
            row.index = rowIndex
        },
        headerCellClassName ({columnIndex}) {
            if (columnIndex === 5) {
                return 'cellMarginRightNone thCell ' + columnIndex
            } else {
                return 'thCell ' + columnIndex
            }
        },
        // ドロップダウンリスト(下拉列表做成)
        selectionBox () {
            this.loading = true
            const body = ('{"access": "TRUE"}')
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
                        this.selectionBoxData.push(data.result.ACCESS[index])
                    }
                    this.userAuccessDisabled = this.$store.state.userInfo.isAdmin || this.$store.state.userInfo.authorityName === 'プロジェクト管理者'
                    console.log(this.userAuccessDisabled)
                    this.getBelonging()
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.selectionBox() : ''
                    })
                } else {
                    this.$request.requestError(`SelectionBox-get请求失败:`, err, 'UserInformation')
                }
            })
        },
        // 所属情報取得
        getBelonging () {
            const that = this
            that.loading = true
            that.belonging = []
            that.$request.usermanagement.getBelonging('').then(response => {
                console.log('getBelonging-get请求成功:', response.status, response.statusText)
                const data = that.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    that.belonging = [{'NO': 0, 'BELONGING_NAME': '全て'}]
                    data.result.forEach(element => {
                        that.belonging.push(element)
                        if (element.BELONGING_NAME === '(所属なし)') {
                            that.belonging[0].NO = element.NO
                            that.department = that.belonging[0]
                        }
                    })
                    for (let index = 0; index < that.belonging.length; index++) {
                        if (that.department.BELONGING_NAME === '全て') {
                            if (that.department.BELONGING_NAME === that.belonging[index].BELONGING_NAME) {
                                setTimeout(() => {
                                    try {
                                        that.$refs.list.selection(index, that.department)
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }, 50 * that.belonging.length)
                                break
                            }
                        } else {
                            if (that.department.NO === that.belonging[index].NO) {
                                setTimeout(() => {
                                    try {
                                        that.$refs.list.selection(index, that.department)
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }, 50 * that.belonging.length)
                                break
                            }
                        }
                    }
                }
                that.loading = false
            }).catch(err => {
                that.loading = false
                if (err.status === 401) {
                    that.$request.login.refreshToken().then(response => {
                        response ? that.getBelonging() : ''
                    })
                } else {
                    that.$request.requestError(`getBelonging-get请求失败:`, err, 'UserInformation')
                }
            })
        },
        // 所属情報user取得
        getUserManagement () {
            this.loading = true
            const body = ('{"access": "1", "iaAdmin": "FALSE"}')
            this.$request.usermanagement.getUserManagement(body).then(response => {
                console.log('getUserManagement-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    data.result.forEach((element/* , index */) => {
                        this.selectionBoxData.forEach(ele => {
                            if (element.AUTHORITY_NO === ele.NO) {
                                element.AUTHORITY_NAME = ele.AUTHORITY_NAME
                                element.i18n = ele.i18n
                            }
                        })
                    })
                    this.tableData = data.result
                    this.name = ''
                    this.sort('USER_ID')
                    setTimeout(() => {
                        if (this.tableData !== undefined && this.tableData.length > 0) {
                            document.getElementsByClassName('el-table__row')[0].click()
                        }
                    }, this.tableData.length * 10)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getUserManagement() : ''
                    })
                } else {
                    this.$request.requestError(`getUserManagement-get请求失败:`, err, 'UserInformation')
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
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    data.result.forEach(element => {
                        this.selectionBoxData.forEach(ele => {
                            if (element.AUTHORITY_NO === ele.NO) {
                                element.AUTHORITY_NAME = ele.AUTHORITY_NAME
                                element.i18n = ele.i18n
                            }
                        })
                    })
                    this.tableData = data.result || []
                    this.name = ''
                    this.sort('USER_ID')
                    setTimeout(() => {
                        if (this.tableData.length > 0) {
                            console.log(document.getElementsByClassName('el-table__row'))
                            document.getElementsByClassName('el-table__row')[0].click()
                        }
                    }, this.tableData.length * 10)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getSIOfUserInformation() : ''
                    })
                } else {
                    this.$request.requestError(`getSIOfUserInformation-get请求失败:`, err, 'UserInformation')
                }
            })
        },
        // 所属情報の削除
        deleteInformation () {
            this.applyToFoldersBelowClose()
            const no = []
            if (this.del) {
                no.push(this.deleteEventData.NO)
            } else {
                for (let index = 0; index < this.selectedData.length; index++) {
                    no.push(this.selectedData[index].NO)
                }
            }
            this.del = false
            this.loading = true
            this.$request.usermanagement.deleteInformation(no.toString(), {Body: ''}).then(response => {
                console.log('deleteInformation-delete请求:', response.status, response.statusText)
                // 判断状态码code
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success(this.$t('UserManagementU.DELETE'))
                    this.tableData = []
                    this.department = {}
                    this.getBelonging()
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.deleteInformation() : ''
                    })
                } else {
                    this.$request.requestError(`deleteInformation-get请求失败:`, err, 'UserInformation')
                }
            })
        },
        // ：利用者情報の削除
        deleteUser () {
            this.toFoldersBelowDel = true
        },
        deleteUserInformation (data) {
            this.applyToFoldersBelowClose()
            this.loading = true
            const no = []
            data.forEach(element => {
                no.push(element.NO)
            })
            this.$request.usermanagement.deleteUserInformationDel(no.toString(), {Body: ''}).then(response => {
                console.log('deleteUserInformationDel-delete请求:', response.status, response.statusText)
                // 判断状态码code
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success(this.$t('UserManagementU.DELETE'))
                    if (this.department.BELONGING_NAME === '全て') {
                        this.getUserManagement()
                    } else {
                        this.getSIOfUserInformation(this.department.NO)
                    }
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.deleteUserInformationDel() : ''
                    })
                } else {
                    this.$request.requestError(`deleteUserInformationDel-get请求失败:`, err, 'UserInformation')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../less/pages/UserManagement/UserManagementU/UserManagementU.less");
</style>
