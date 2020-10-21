<template>
    <div id="dustbin">
        <el-container v-loading="loading"
                      :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(255,255,255,.4)"
                      onselectstart="return false;">
            <el-header height="auto">
                <Header @handleCommand="handleCommand"></Header>
            </el-header>
            <!--面包屑 -->
            <div class="breadcrumb">
                <div>
                    <img :src="require('@a/images/file/file-dustbin-02.svg')">
                    <span>{{ $t('dustbin.DISPLAY_FILE_INFO_TRASH') }}</span>
                </div>
            </div>
            <el-main>
                <Table ref="destbinTable"
                       :select-table-data="selectTableData"
                       @refresh="trash"></Table>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="applyToFoldersBelow"
                   :title="$t('dustbin.DISPLAY_FILE_INFO_POPUP_TITLE_DELETE')"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   append-to-body>
            <!-- ファイル／フォルダを完全に削除します。よろしいですか？<br /><br />
            ※フォルダの場合はフォルダ内のファイル、フォルダを全て削除します。<br />
            ※ファイルに添付されている情報（手書きメモ・テキスト・ピン・写真・スタンプ）も削除されます。<br /><br /> -->
            {{ $t('dustbin.MESSAGE_ASK_FILE_INFO_DELETE_FILE_ONE') }}<br /><br />
            {{ $t('dustbin.MESSAGE_ASK_FILE_INFO_DELETE_FILE_TWO') }}<br />
            {{ $t('dustbin.MESSAGE_ASK_FILE_INFO_DELETE_FILE_THREE') }}<br /><br />
            <p style="color: ##D61918;font-size: 12px;">{{ $t('dustbin.MESSAGE_ASK_FILE_INFO_DELETE_FILE_RED') }}</p>
            <span slot="footer"
                  class="dialog-footer">
                <button class="button"
                        @click="close">{{ $t('dustbin.DISPLAY_FILE_INFO_DELETE_FILE_BUTTON_CENCEL') }}</button>
                <button class="button buttonHighlight margin"
                        @click="deleteAll">{{ $t('dustbin.DISPLAY_FILE_INFO_DELETE_FILE_BUTTON_CONFIRM') }}</button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="toFoldersBelow"
                   :title="$t('dustbin.DISPLAY_FILE_INFO_POPUP_TITLE_RESTORE')"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   append-to-body>
            {{ $t('dustbin.MESSAGE_ASK_FILE_INFO_RESTORE_TRASH') }}<br /><br />
            <div class="dustbinlistbuttonSelect">
                <ul>
                    <li>
                        <label for="searchObjectFolder">
                            <input type="checkbox"
                                   id="searchObjectFolder"
                                   name="checkboxSearchObject"
                                   value="02">
                            <div class="checkContainer"></div>
                            <span>{{ $t('dustbin.DISPLAY_FILE_INFO_POPUP_CHECK_FILE_LEAVE_BOTH') }}</span>
                        </label>
                    </li>
                    <li>
                        <label for="searchObjectFile">
                            <input type="checkbox"
                                   id="searchObjectFile"
                                   name="checkboxSearchObject"
                                   value="03">
                            <div class="checkContainer"></div>
                            <span>{{ $t('dustbin.DISPLAY_FILE_INFO_POPUP_CHECK_FOLDER_MERGE') }}</span>
                        </label>
                    </li>
                </ul>
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <button class="button"
                        @click="close">{{ $t('dustbin.DISPLAY_FILE_INFO_DELETE_FILE_BUTTON_CENCEL') }}</button>
                <button class="button buttonHighlight margin"
                        @click="resumeAll">{{ $t('dustbin.DISPLAY_FILE_INFO_TRASH_RIGHT_CLICK_MENU_RESTORE') }}</button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import bus from '@c/bus.js'
import Header from '@p/Files/Dustbin/DustbinHeader.vue'
import Table from '@p/Files/Dustbin/DustbinTable.vue'

export default {
    name: 'Dustbin',
    components: {
        Header, Table
    },
    data () {
        return {
            loading: false,
            applyToFoldersBelow: false,
            toFoldersBelow: false,
            selectTableData: [], // 子组件Table的参数
            oldUrl: ''
        }
    },
    mounted () {
        bus.$on('trash', () => {
            this.trash()
        })
    },
    methods: {
        // データを取得します
        trash () {
            this.loading = true
            this.$request.dustbin.Trash('').then(response => {
                console.log('Trash-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    data.result.forEach(da => {
                        da.fileName = decodeURIComponent(da.fileName)
                        da.deleteUser = decodeURIComponent(da.deleteUser)
                        da.oldDisplayParentPath = decodeURIComponent(da.oldDisplayParentPath)
                    })
                    this.selectTableData = data.result
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.trash() : ''
                    })
                } else {
                    this.$request.requestError('Trash-get请求失败', err, 'Dustbin')
                }
            })
        },
        // headerボタン
        handleCommand (command) {
            if (command === this.$t('dustbinHeader.DISPLAY_FILE_INFO_TRASH_ALL_DATA_DELETE')) {
                this.applyToFoldersBelow = true
            } else if (command === this.$t('dustbinHeader.DISPLAY_FILE_INFO_TRASH_ALL_DATA_RESTORE')) {
                this.toFoldersBelow = true
            }
        },
        // close
        close () {
            this.toFoldersBelow = false
            this.applyToFoldersBelow = false
        },
        deleteAll () {
            this.loading = true
            this.close()
            this.$request.dustbin.TrashDelAll('').then(response => {
                console.log('TrashDelAll-delete请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.selectTableData = []
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.deleteAll() : ''
                    })
                } else {
                    this.$request.requestError('TrashDelAll-delete请求失败', err, 'Dustbin')
                }
            })
        },
        resumeAll () {
            const searchObject = document.getElementsByName('checkboxSearchObject')
            const checked = []
            for (let i = 0; i < searchObject.length; i++) {
                checked.push(searchObject[i].checked)
            }
            this.close()
            this.loading = true
            const body = (`{"fileSaveFlg": "${checked[0] ? 'TRUE' : 'FALSE'}","folderMergeFlg": "${checked[1] ? 'TRUE' : 'FALSE'}"}`)
            this.$request.dustbin.TrashReductionAll(body).then(response => {
                console.log('TrashReductionAll-patch请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.selectTableData = []
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.resumeAll() : ''
                    })
                } else {
                    this.$request.requestError('TrashReductionAll-patch请求成功', err, 'Dustbin')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../less/pages/Files/Dustbin/Dustbin.less");
</style>
