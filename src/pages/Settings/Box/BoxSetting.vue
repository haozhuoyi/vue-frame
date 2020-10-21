<template>
    <div id="BoxSetting">
        <el-dialog title="Box連携設定"
                   :visible.sync="show"
                   v-loading="loadingInfo"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :destroy-on-close="true"
                   class="dialog_boxSetting"
                   box-sizing="border-box">
            <div class="div_body">
                <el-form :model="form"
                         label-position="right"
                         label-width="434px"
                         ref="form"
                         :inline="true"
                         class="form_boxSetting_connect">
                    <el-form-item label="Box連携："
                                  label-width="58px">
                        <el-radio-group v-model="form.ConnectSetting"
                                        :change="connectStatus">
                            <el-radio-button label="ON">ON</el-radio-button>
                            <el-radio-button label="OFF">OFF</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="アカウント名："
                                  label-width="105px">
                        <el-select v-model="CONNECT_ID"
                                   :disabled="selectDisabled">
                            <el-option v-for="item in BOX_CONNECT_INFO_LIST"
                                       :key="item.CONNECT_ID"
                                       :label="item.LOGIN_ID"
                                       :value="item.CONNECT_ID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-form :model="form"
                         label-position="right"
                         label-width="434px"
                         ref="form"
                         :inline="true"
                         class="form_boxSetting_folder">
                    <div class="tree-scroll"
                         v-if="showFolder">
                        <div class="treeContainer">
                            <el-tree :indent="0"
                                     :load="loadNode"
                                     :props="treeProps"
                                     lazy
                                     show-checkbox
                                     node-key="id"
                                     highlight-current
                                     :expand-on-click-node="false"
                                     :render-content="renderContent"
                                     class="tree">
                            </el-tree>
                        </div>
                    </div>
                    <div class="otherOrNoConnectMessage"
                         v-if="showOtherConnectMessage">
                        <p>CheX ID:{{ UserData.userName }}様にて</p>
                        <p>連携アカウント{{ AccountName }}で連携設定中です。</p>
                    </div>
                    <div class="otherOrNoConnectMessage"
                         v-if="showNoConnectMessage">
                        <p>未連携</p>
                    </div>
                </el-form>
            </div>
            <div slot="footer"
                 class="dialog-footer">
                <el-button type="primary"
                           class="btn_accountManage"
                           @click="AccountManagementClick">連携アカウント管理</el-button>
                <el-button type="primary"
                           :loading="loadingSetting"
                           class="btn_setting"
                           :disabled="settingDisabled"
                           @click="setting()">設定</el-button>
            </div>
        </el-dialog>

        <AccountManagement ref="AccountManagement"
                           :box-connect-info-list="BOX_CONNECT_INFO_LIST"
                           @update:boxConnectInfoList="BOXSettingAcquisition"
                           @close="closeall"></AccountManagement>
    </div>
</template>

<script>
import bus from '@/components/bus.js'

export default {
    name: 'BoxSetting',
    components: {
        AccountManagement: resolve => require(['@p/Settings/Box/AccountManagement'], resolve)
    },
    data () {
        return {
            show: false, // dialog表示か
            loadingInfo: false, // dialog読み込み
            loadingSetting: false, // 設定ボタン処理の読み込み
            selectDisabled: false, // アカウントのプルダウンリスト利用か
            settingDisabled: false, // 設定ボタン利用か
            UserData: this.$store.state.userInfo,
            form: {
                // 連携状況
                ConnectSetting: ''
            },
            AccountName: '', // 連携アカウント名
            CONNECT_ID: '', // 連携ID
            BOX_CONNECT_INFO_LIST: [], // アカウントのプルダウンリスト
            treeProps: {label: 'name', id: 'id', children: 'children'}, // treeのデフォルト値
            showFolder: false, // 連携フォルダ表示か
            showOtherConnectMessage: false, // 他人連携のメッセージ表示か
            showNoConnectMessage: false, // 連携しないのメッセージ表示か
            connectStatusChangeFlg: false // 連携状況変更か
        }
    },
    watch: {
        '$store.state.userInfo': {
            handler (newValue) {
                this.UserData = newValue
            },
            deep: true
        }
    },
    mounted () {
        this.$nextTick(() => {
            bus.$on('BoxSetting', msg => {
                this.BOXSettingAcquisition(msg)
            })
        })
    },
    methods: {
        // BOX连携設定情報取得
        BOXSettingAcquisition (bool) {
            this.show = bool
            this.loadingInfo = true
            this.$request.settings.BOXSettingAcquisition('').then(response => {
                console.log('BOXSettingAcquisition-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    console.log(data.result.BOX_CONNECT_INFO_LIST)
                    this.BOX_CONNECT_INFO_LIST = data.result.BOX_CONNECT_INFO_LIST
                    this.BOX_CONNECT_INFO_LIST.forEach(element => {
                        if (element.CHECKED) {
                            // アカウント名を設定
                            this.AccountName = element.LOGIN_ID
                            this.CONNECT_ID = element.CONNECT_ID
                        }
                    })
                    this.BOX_CONNECT_STYLE = data.result.BOX_CONNECT_STYLE
                    if (this.BOX_CONNECT_STYLE === 1) {
                        // 連携しない
                        this.form.ConnectSetting = 'OFF'
                        this.showNoConnectMessage = true
                        this.selectDisabled = true
                        this.settingDisabled = true
                        // document.getElementsByClassName('BoxSetUp')[0].getElementsByClassName('el-dialog')[0].style.width = '940px'
                    } else if (this.BOX_CONNECT_STYLE === 2) {
                        // 他人連携
                        this.form.ConnectSetting = 'ON'
                        this.showOtherConnectMessage = true
                        this.selectDisabled = true
                        this.settingDisabled = true
                    } else {
                        // document.getElementsByClassName('BoxSetUp')[0].getElementsByClassName('el-dialog')[0].style.marginTop = '2vh'
                        // 連携フォルダを取得
                        this.form.ConnectSetting = 'ON'
                        this.showFolder = true
                    }
                }
                this.loadingInfo = false
            }).catch(err => {
                this.loadingInfo = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.BOXSettingAcquisition(bool) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.show = false
                        this.$emit('close')
                    }
                    this.$request.requestError(`BOXSettingAcquisition-get请求失败:`, err, 'BOXSetting')
                }
            })
        },
        // BOX連携文件夹一覧取得
        getBoxFolders (NO, paramData) {
            const body = (`{
                "marker": "${paramData.marker}",
                "boxConnectId": "${this.CONNECT_ID}",
                "displayParentPath": "${paramData.displayParentPath}",
                "webHookFlag": "${paramData.webHookFlag}"
            }`)
            this.$request.settings.BoxFolders(NO, body).then(response => {
                console.log('BoxFolders-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    console.log(data)
                    return data
                }
            }).catch(err => {
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getBoxFolders(NO, paramData) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.show = false
                        this.$emit('close')
                    }
                    this.$request.requestError(`BoxFolders-get请求失败:`, err, 'BOXSetting')
                }
            })
        },
        // BOX連携解除
        relieve () {
            this.loading = true
            const body = (`{"CONNECT_ID": "${this.CONNECT_ID}", "TARGET_FOLDER_IDS": ""}`)
            this.$request.settings.BOXDel(body).then(response => {
                console.log('BOXDel-delete请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    console.log(data)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.relieve() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.show = false
                        this.$emit('close')
                    }
                    this.$request.requestError(`BOXDel-delete请求失败:`, err, 'BOXSetting')
                }
            })
        },
        // 下拉框选中值变化事件
        SelectChange (data) {
            this.BOX_CONNECT_INFO_LIST.forEach(element => {
                if (data === element.CONNECT_ID) {
                    this.AccountName = element.LOGIN_ID
                    this.CONNECT_ID = element.CONNECT_ID
                }
            })
        },
        // アカウント管理(账户管理)
        AccountManagementClick () {
            this.$refs.AccountManagement.AccountManagement(true, this.BOX_CONNECT_INFO_LIST)
        },
        // 树控件渲染
        // eslint-disable-next-line no-unused-vars
        renderContent (h, {node, data, store}) {
            return (
                <span class='renderContent'>
                    <hr class='childIcon-hr'></hr>
                    <i class='childIcon'></i>
                    <span class='childLabel'>{node.label}</span>
                </span>
            )
        },
        close () {
            this.BOX_CONNECT_STYLE = 1
            this.show = false
        },
        closeall () {
            this.close()
            this.$emit('close')
        },
        // 連携状況変更
        connectStatus (val) {
            if (val === 'OFF') {
                // 連携リリース
                this.show = false
            }
            this.connectStatusChangeFlg = true
        },
        // 設定処理
        setting () {
            if (this.connectStatusChangeFlg) {
                // 連携設定
                this.show = false
            } else {
                // 連携フォルダ変更
                this.show = false
            }
        },

        loadNode (node, resolve) {
            let res = []
            if (node.level === 0) {
                // const paramDataFirst = {
                //   'marker': '',
                //   'boxConnectId': this.CONNECT_ID,
                //   'displayParentPath': '',
                //   'webhookFlag': false
                // }
                // DOTO(连携文件取得还未做成)
                // res = this.getBoxFolders('-1', paramDataFirst)
                res = [
                    {'name': 'yuhl1', 'id': 1},
                    {'name': 'yuhl2', 'id': 2},
                    {'name': 'yuhl3', 'id': 3}
                ]

                if (res) {
                    resolve(res)
                }
            }
            if (node.level > 0) {
                // const paramData = {
                //   'marker': node.data.marker,
                //   'boxConnectId': this.CONNECT_ID,
                //   'displayParentPath': node.data.displayParentPath,
                //   'webhookFlag': node.data.webhookFlag
                // }
                // res = this.getBoxFolders(node.data.NO, paramData)
                res = [
                    {'name': 'yuhl4', 'id': 4},
                    {'name': 'yuhl5', 'id': 5},
                    {'name': 'yuhl6', 'id': 6}
                ]
                if (res) {
                    resolve(res)
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../less/pages/Settings/Box/BoxSetting.less");
</style>
