
<template>
    <div id="ctbFileSettings">
        <el-dialog title="CTBファイル設定"
                   :visible.sync="ctbFileSettingsVisible"
                   :show-close="true"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :destroy-on-close="true"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)"
                   class="ctbFileSettings">
            <div class="div">
                <div class="common">共通設定（全プロジェクトに適用）
                    <div class="uploadCommon"
                         @click.stop="common('common')"></div>
                </div>
                <input type="file"
                       ref="fileInput"
                       multiple="multiple"
                       accept="ctb/*"
                       @change="getFile"
                       style="display: none">
                <div class="individual">個別設定(ログイン中のプロジェクトに適用)
                    <div class="uploadIndividual"
                         @click.stop="common('individual')"></div>
                </div>
                <div class="commonFile">
                    <el-table border
                              :data="xtable"
                              ref="ctbTable"
                              class="ctbTable"
                              stripe
                              highlight-current-row
                              :row-class-name="tableRowClassName"
                              @row-click="rowClick"
                              @select="handleSelectionChange"
                              @selection-change="handleSelectionChange">
                        <el-table-column prop="FILE_NAME"
                                         label="ファイル名"
                                         width="120">
                        </el-table-column>
                        <el-table-column prop="REG_TIME"
                                         label="更新日時"
                                         width="120">
                        </el-table-column>
                        <el-table-column prop="FILE_TYPE"
                                         label="個別優先"
                                         width="72">
                            <template slot-scope="scope">
                                <span v-if="scope.row.FILE_TYPE === '2'"
                                      style="color: #CE1616;">
                                    <div class="card"></div>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="individualFile">
                    <el-table :data="ytable"
                              border
                              ref="ctbTable"
                              class="ctbTable"
                              stripe
                              highlight-current-row
                              :row-class-name="tableRowClassName"
                              @row-click="rowClick"
                              @select="handleSelectionChange"
                              @selection-change="handleSelectionChange">
                        <el-table-column prop="FILE_NAME"
                                         label="ファイル名"
                                         width="132.5">
                        </el-table-column>
                        <el-table-column prop="REG_TIME"
                                         label="更新日時"
                                         width="132.5">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div slot="footer"
                 class="dialog-footer">
                <el-button type="primary"
                           :disabled="disabled"
                           class="download-button"
                           style="margin-right: 486px;"
                           @click="operation('down')">ダウンロード</el-button>
                <el-button type="danger"
                           plain
                           class="deleteButton"
                           :disabled="disabled"
                           @click="operation('dle')">削除</el-button>
            </div>
        </el-dialog>

        <div id="menu">
            <div class="menu"
                 @click="operation('dle')">削除</div>
            <div class="menu"
                 @click="operation('down')">ダウンロード</div>
        </div>
    </div>
</template>

<script>
import bus from '@/components/bus.js'
export default {
    name: 'CtbFileSettings',
    data () {
        return {
            ctbFileSettingsVisible: false,
            loading: false,
            ctbType: '',
            fileList: [],
            xtable: [],
            ytable: [],
            multiSelect: [],
            contextmenuData: {}, // 单选选中数据
            multiSelectData: [], // 多选选中数据
            disabled: true,
            isCtrl: false, // 监听ctrl键是否按下
            isShift: false // 监听Shift键是否按下
        }
    },
    mounted () {
        const that = this
        const isWin = (navigator.platform === 'Win32') || (navigator.platform === 'Windows')
        const isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
        function keyup (ev) {
            let currKey = 0
            const e = ev || event
            currKey = e.keyCode || e.which || e.charCode// 支持IE、FF
            if ((currKey === 17 && isWin) || (currKey === 91 && isMac)) {
                that.isCtrl = false
                that.$emit('tableSelection', [that.contextmenuData])
            } else if (currKey === 16) {
                that.isShift = false
                this.multiSelect = []
                that.$emit('tableSelection', that.multiSelectData)
            }
        }
        function keydown (ev) {
            let currKey = 0
            const e = ev || event
            currKey = e.keyCode || e.which || e.charCode// 支持IE、FF
            if ((currKey === 17 && isWin) || (currKey === 91 && isMac)) {
                that.isCtrl = true
            } else if (currKey === 16) {
                that.isShift = true
            }
        }
        document.onkeydown = keydown// onkeydown事件调用方式
        document.onkeyup = keyup
        bus.$on('getCtbSetting', () => {
            this.ctbFileSettingsVisible = true
            this.ctbFileSetQuery()
        })
    },
    methods: {
        rowClick (row) {
            if (this.isCtrl && !this.isShift) { // 键盘事件: Ctrl
                this.$refs.ctbTable.toggleRowSelection(row, true)
            } else if (!this.isCtrl && this.isShift) { // 键盘事件: Shift
                this.multiSelect.push(row.index)
                if (this.multiSelect.length > 1) {
                    if (this.multiSelect[0] < this.multiSelect[this.multiSelect.length - 1]) {
                        // 清空选中状态
                        this.$refs.ctbTable.clearSelection()
                        for (let i = this.multiSelect[0]; i <= this.multiSelect[this.multiSelect.length - 1]; i++) {
                            this.$refs.ctbTable.toggleRowSelection(this.selectTableData[i], true)
                        }
                    } else if (this.multiSelect[0] > this.multiSelect[this.multiSelect.length - 1]) {
                        // 清空选中状态
                        this.$refs.ctbTable.clearSelection()
                        for (let i = this.multiSelect[this.multiSelect.length - 1]; i <= this.multiSelect[0]; i++) {
                            this.$refs.ctbTable.toggleRowSelection(this.selectTableData[i], true)
                        }
                    } else if (this.multiSelect[0] === this.multiSelect[this.multiSelect.length - 1]) {
                        return
                    }
                } else {
                    this.$refs.ctbTable.clearSelection() // 清空选中
                    this.$refs.ctbTable.toggleRowSelection(row, true) // 设置选中
                }
            } else if (!this.isCtrl && !this.isShift) {
                this.cellClickEvent({row})
            }
        },
        // クリック選択
        cellClickEvent ({row}) {

            this.disabled = false
            this.multiSelectData = []
            this.contextmenuData = row
            this.$refs.ctbTable.clearSelection() // 清空选中
            this.$refs.ctbTable.toggleRowSelection(row, true) // 设置选中
        },
        // 行データを取得する
        handleSelectionChange (selection) {
            this.multiSelectData = selection
        },
        // 行ごとのインデックスをrowに入れる(把每一行的索引放进row)
        tableRowClassName ({row, rowIndex}) {
            row.index = rowIndex
        },
        // 選択したすべてのファイルをダウンロードまたは削除します。(下载或者删除所有选中文件)
        operation (ot) {
            const no = []
            if (this.contextmenuData.NO !== null) {
                no.push(this.contextmenuData.NO)
            }
            if (this.multiSelectData.length > 0) {
                this.multiSelectData.forEach(data => {
                    no.push(data.NO)
                })
            }
            if (ot === 'down') {
                this.ctbFileDownload(no)
            } else if (ot === 'dle') {
                this.ctbFileDelete(no)
            }
        },
        // ctbファイル検索
        ctbFileSetQuery () {
            this.loading = true
            this.$request.settings.CTBFileSetQuery('').then(response => {
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    data.result.forEach(element => {
                        if (element.FILE_TYPE === '3') {
                            this.ytable.push(element)
                        } else {
                            this.xtable.push(element)
                        }
                    })
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.ctbFileSetQuery() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.ctbFileSettingsVisible = false
                    }
                    this.$request.requestError(`CTBFileSetQuery-get请求失败:`, err, 'CTBFileSetings')
                }
            })
        },
        // ctbファイルのダウンロード
        ctbFileDownload (NO) {
            this.loading = true
            const body = ('{"ctbFileNo": "' + NO.toString() + '"}')
            this.$request.settings.CTBFileDownload(body).then(response => {
                console.log('CTBFileDownload-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    const content = response
                    const blob = new Blob([content.data], {type: 'application/vnd.ms-excel;charset=utf-8'})
                    const fileNameSplit = response.headers['content-disposition'].split('=')
                    const fileName = decodeURI(fileNameSplit[fileNameSplit.length - 1]) // 跟后端约定好最后一个值为fileName字段
                    if ('download' in document.createElement('a')) { // 非IE下载
                        const elink = document.createElement('a')
                        elink.download = fileName
                        elink.style.display = 'none'
                        elink.href = URL.createObjectURL(blob)
                        document.body.appendChild(elink)
                        elink.click()
                        URL.revokeObjectURL(elink.href) // 释放 URL对象
                        document.body.removeChild(elink)
                    } else { // IE10+下载
                        navigator.msSaveBlob(blob, fileName)
                    }
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.ctbFileDownload(NO) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.ctbFileSettingsVisible = false
                    }
                    this.$request.requestError(`CTBFileDownload-get请求失败:`, err, 'CTBFileSetings')
                }
            })
        },
        // ctbファイルの削除
        ctbFileDelete (NO) {
            this.loading = true
            const body = ('{"ctbFileNo": "' + NO.toString() + '"}')
            this.$request.settings.CTBFileDelete(body).then(response => {
                // 判断状态码code
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success('削除に成功')
                }
                this.loading = false
                this.xtable = []
                this.ytable = []
                this.ctbFileSetQuery()
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.ctbFileDelete(NO) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.ctbFileSettingsVisible = false
                    }
                    this.$request.requestError(`CTBFileDelete-delete请求:`, err, 'CTBFileSetings')
                }
            })
        },
        // ctbファイルアップロード
        getFile (event) {
            for (let i = 0; i < event.target.files.length; i++) {
                this.fileList.push(event.target.files[i])
            }
            // 创建FormData对象
            if (this.fileList.length > 0) {
                this.fileList.forEach(data => {
                    // 将得到的文件流添加到FormData对象
                    const formData = new FormData()
                    formData.append('file', data)
                    console.log(data, formData, formData.get(data.name))
                    this.$request.settings.CTBAttachmentUpload('', formData).then(response => {
                        console.log('ctbFileUpload-post请求成功:', response.status, response.statusText)
                        const data = this.$request.CODE(response.data)
                        if (Object.prototype.toString.call(data) === '[object Object]') {
                            console.log(data)
                            // 删除FormData对象
                            formData.delete(data.name)
                        }
                        this.ctbType = ''
                    }).catch(err => {
                        this.ctbType = ''
                        if (err.status === 401) {
                            this.$request.login.refreshToken().then(response => {
                                response ? this.getFile(event) : ''
                            })
                        } else {
                            if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                                this.ctbFileSettingsVisible = false
                            }
                            this.$request.requestError(`ctbFileUpload-post请求成功:`, err, 'CTBFileSetings')
                        }
                    })
                })
            }
            console.log(this.ctbType)
            const body = ('{"ctbFileType": "' + this.ctbType + '"}')
            this.$request.settings.CTBFileUpload(body).then(response => {
                console.log('ctbFileUpload请求:', response.status, response.statusText)
                // 判断状态码code
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success('文件上传成功')
                    this.xtable = []
                    this.ytable = []
                    this.ctbFileSetQuery()
                }
                this.ctbType = ''
            }).catch(err => {
                this.ctbType = ''
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getFile(event) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.ctbFileSettingsVisible = false
                    }
                    this.$request.requestError(`ctbFileUpload-get请求:`, err, 'CTBFileSetings')
                }
            })
        },
        common (ctbType) {
            this.ctbType = ctbType
            this.$refs.fileInput.click()
        }
    }
}
window.onload = function () {
    const table = document.getElementById('ctbFileSettings')
    table.oncontextmenu = function (e) {
        // 取消默认的浏览器自带右键 很重要！！
        e.preventDefault()
        // 获取我们自定义的右键菜单
        const menu = document.querySelector('#menu')
        // 根据事件对象中鼠标点击的位置，进行定位
        menu.style.left = e.clientX + 'px'
        menu.style.top = e.clientY + 'px'
        // 改变自定义菜单的宽，让它显示出来
        menu.style.width = '103px'
        menu.style.height = '65px'
    }
}
// 关闭右键菜单
window.onclick = function () {
    // 用户触发click事件就可以关闭了，因为绑定在window上，按事件冒泡处理，不会影响菜单的功能
    document.querySelector('#menu').style.width = 0
    document.querySelector('#menu').style.height = 0
}
</script>

<style lang="less" scoped>
@import url("../../less/pages/Settings/CtbFileSettings.less");
</style>
