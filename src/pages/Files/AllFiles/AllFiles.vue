<template>
    <div id="allfiles">
        <el-container v-loading="loading"
                      :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(255,255,255,.4)"
                      onselectstart="return false;">
            <el-collapse-transition>
                <div v-if="addVisible"
                     style="padding:0 16px;border-bottom: 1px solid #999999;">
                    <DetailedSearch :add-visible="addVisible"
                                    :select-data="selectData"
                                    @DetailedSearch="detailedSearch"
                                    @ConditionQuery="conditionQuery"></DetailedSearch>
                </div>
            </el-collapse-transition>
            <el-header height="auto">
                <Header :add-visible="addVisible"
                        :length="length"
                        :active-tabpanel-name="activeTabpanelName"
                        @handleCommand="handleCommand"
                        @DetailedSearch="detailedSearch"
                        @getFile="getFile"
                        @viewtypeEvent="viewtypeEvent"></Header>
            </el-header>
            <!--面包屑 -->
            <div class="breadcrumbContainer">
                <ul v-if="breadcrumb.length<5"
                    class="breadcrumb">
                    <li v-for="(item, index) in breadcrumb"
                        :key="item.id"
                        :title="item.FILE_NAME">
                        <i v-if="index !== 0"
                           class="el-icon-arrow-right" />
                        <a href="javascript:;"
                           @click="changeId(item.FILE_NAME, item.NO, item.DISPLAY_PARENT_PATH)">
                            {{ item.FILE_NAME }}
                        </a>
                    </li>
                </ul>
                <ul v-else
                    class="breadcrumb length">
                    <li :title="breadcrumb[0].FILE_NAME">
                        <a href="javascript:;"
                           @click="changeId(breadcrumb[0].FILE_NAME, breadcrumb[0].NO)">{{ breadcrumb[0].FILE_NAME }}</a>
                    </li>
                    <li :title="breadcrumb[1].FILE_NAME">
                        <i class="el-icon-arrow-right" />
                        <a href="javascript:;"
                           @click="changeId(breadcrumb[1].FILE_NAME, breadcrumb[1].NO)">{{ breadcrumb[1].FILE_NAME }}</a>
                    </li>
                    <li>
                        <i class="el-icon-arrow-right" />.......
                        <!-- <el-dropdown @command="changeIdCommand">
                            <span class="el-dropdown-link">
                                <i class="el-icon-arrow-right" />
                                .......
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(item, index) in breadcrumb.splice(2, breadcrumb.length-2)"
                                                  :key="item.NO"
                                                  :command="`FILE_NAME=${item.FILE_NAME}&NO=${item.NO}`"
                                                  :style="index <= 0 || index === breadcrumb[breadcrumb.length-1] ||
                                                        index === breadcrumb[breadcrumb.length-2]?'display: none' : ''">
                                    {{ item.FILE_NAME }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown> -->
                    </li>
                    <li :title="breadcrumb[breadcrumb.length-2].FILE_NAME">
                        <i class="el-icon-arrow-right" />
                        <a href="javascript:;"
                           @click="changeId(breadcrumb[breadcrumb.length-2].FILE_NAME, breadcrumb[breadcrumb.length-2].NO)">{{ breadcrumb[breadcrumb.length-2].FILE_NAME }}</a>
                    </li>
                    <li :title="breadcrumb[breadcrumb.length-1].FILE_NAME">
                        <i class="el-icon-arrow-right" />
                        <a href="javascript:;"
                           @click="changeId(breadcrumb[breadcrumb.length-1].FILE_NAME, breadcrumb[breadcrumb.length-1].NO)">{{ breadcrumb[breadcrumb.length-1].FILE_NAME }}</a>
                    </li>
                </ul>
                <el-slider v-if="activeTabpanelName === 'thumbnail'"
                           v-model="slider"
                           :show-tooltip="false"
                           :step="2"
                           :min="min"
                           :max="max"
                           @input="sliderInput"></el-slider>
                <div class="viewtype">
                    <button class="pointerEvents"
                            :class="activeTabpanelName === 'thumbnail' ? (addVisible ? 'dis Selected' : 'Selected') :(addVisible ? 'dis' : '')"
                            @click="viewtype('thumbnail')">
                        <i class="el-icon-menu"
                           :class="activeTabpanelName === 'thumbnail' ? 'eliconmenu' : ''"></i>
                    </button>
                    <button class="pointerEvents"
                            :class="activeTabpanelName === 'treetable' ? (addVisible ? 'dis Selected' : 'Selected') : (addVisible ? 'dis' : '')"
                            @click="viewtype('treetable')">
                        <img v-if="activeTabpanelName !== 'treetable' || addVisible"
                             :src="require('@a/images/usermanagement/usermanagemen-tree-yes.svg')">
                        <img v-else
                             :src="require('@a/images/usermanagement/usermanagemen-tree-no.svg')">
                    </button>
                </div>
                <button class="bottonAdd"
                        @click="show = !show">
                    <i class="el-icon-arrow-left el-icon--left"></i>
                    <span>{{ $t('allFiles.DISPLAY_RELATED_DATA') }}</span>
                </button>
            </div>
            <el-main>
                <el-tabs v-model="activeTabpanelName"
                         :style="{width: offsetWidth + 'px'}"
                         style="vertical-align: top;">
                    <!-- 缩略图 -->
                    <el-tab-pane label="Thumbnail"
                                 name="thumbnail">
                        <Thumbnail v-if="activeTabpanelName === 'thumbnail'"
                                   ref="thumbnail"></Thumbnail>
                    </el-tab-pane>
                    <!-- 树文件 -->
                    <el-tab-pane label="TreeTable"
                                 name="treetable">
                        <TreeTable v-if="activeTabpanelName === 'treetable'"
                                   @tableSelection="tableSelection"
                                   ref="TreeTable"></TreeTable>
                    </el-tab-pane>
                    <!-- 搜索 -->
                    <el-tab-pane label="sousuo"
                                 name="sousuo">
                        <div :style="{height: offsetHeight - 34 + 'px'}">
                            <ListTable ref="TableELEMENTUI"
                                       v-if="activeTabpanelName === 'sousuo'"
                                       contextmenu-name="pane"
                                       :dblclick-event-bool="false"
                                       :select-table-data="selectTableData"
                                       @tableSelection="tableSelection"
                                       @defaultExpanded="detailedSearch"
                                       @inputValueEvent="inputValueEvent"></ListTable>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <div class="relevantData"></div>
            </el-main>
            <transition name="el-fade-in-linear">
                <div>
                    <div v-show="show"
                         class="transition"
                         :style="{height: offsetHeight + 'px'}">
                        <button class="bottonAdd relevantData"
                                @click="show = !show">
                            <i class="el-icon-arrow-left el-icon--left"></i>
                            <span>{{ $t('allFiles.DISPLAY_RELATED_DATA') }}</span>
                        </button>
                        <!-- <div style="width: 78.3px;height: 100%;display: inline-block;vertical-align: middle;"></div> -->
                        <div class="fileDrawer">
                            <FileDrawer></FileDrawer>
                        </div>
                    </div>
                </div>
            </transition>
        </el-container>
        <!-- 重命名 or 添加文件夹 -->
        <!-- QR付きPDF作成 -->
        <PDFCreating ref="PDFCreating"></PDFCreating>
        <!-- メール通知 -->
        <Mail ref="Mail"></Mail>
    </div>
</template>

<script>
import bus from '@c/bus'
import store from '@p/Files/store'
import Crypto from '@u/crypto'
import DetailedSearch from '@c/DetailedSearch.vue' // 详细检查
import PDFCreating from '@c/HeadComponents/PDFCreating.vue'
import FileDrawer from '@c/ChildComponents/FileDrawer.vue' // 右侧抽屉
import Header from '@p/Files/AllFiles/AllFilesHeader.vue'
import Thumbnail from '@p/Files/AllFiles/Thumbnail/Thumbnail.vue'
import TreeTable from '@p/Files/AllFiles/TreeTable/TreeTable.vue'
import ListTable from '@p/Files/AllFiles/TreeTable/ListTable.vue'
import Mail from '@p/Files/AllFiles/Email/Email.vue'

const elementResizeDetectorMaker = require('element-resize-detector')

export default {
    name: 'Allfiles',
    components: {
        Header, Thumbnail, TreeTable, DetailedSearch, ListTable, FileDrawer, PDFCreating, Mail
    },
    data () {
        return {
            loading: false,
            addVisible: false, // 是否展开详情检索
            show: false, // 右侧抽屉是否显示
            offsetWidth: '100%',
            offsetHeight: 0,
            min: 110,
            max: 130,
            slider: 110,
            selectTableData: [], // 子组件Table的参数
            activeTabpanelName: Crypto.decrypt(store.state.viewtype),
            pulldown: require('@a/images/file/file-pull-down.svg'), // 下拉
            selectData: [],
            length: 0/* ,
            CreatefolderType: true */
        }
    },
    computed: {
        // パン屑
        breadcrumb () {
            return JSON.parse(Crypto.decrypt(store.state.breadcrumb))
        }
    },
    mounted () {
        const that = this
        // インスタンスの作成(创建实例)
        const erd = elementResizeDetectorMaker()
        erd.listenTo(document.getElementById('allfiles'), function (element) {
            that.offsetWidth = element.offsetWidth - 8
        })
        erd.listenTo(document.getElementsByClassName('relevantData')[0], function (element) {
            that.offsetHeight = element.offsetHeight + 34
        })
        that.$nextTick(() => {
            // ファイルのアップロードに成功しました
            bus.$on('fileSuccess', data => {
                if (localStorage.getItem('sendMailFlg') === 'true') {
                    bus.$emit('showMail', data.S3NO)
                }
                if (Crypto.decrypt(store.state.viewtype) === 'thumbnail') {
                    bus.$emit('allfiles', data.NO)
                } else if (Crypto.decrypt(store.state.viewtype) === 'treetable') {
                    bus.$emit('treetable', data)
                }
            })
        })
    },
    methods: {
        // パンくずクリック
        changeIdCommand (command) {
            console.log(command)
            const change = command.split('&')
            const fileName = change[0].split('=')[1]
            const no = change[1].split('=')[1]

            this.changeId(fileName, no)
        },
        changeId (FILE_NAME, NO) {
            if (Crypto.decrypt(store.state.viewtype) === 'thumbnail') {
                this.$refs.thumbnail.getFolder({FILE_NAME, NO: '-1'})
            } else {
                console.log(FILE_NAME, NO)
                bus.$emit('treetable', {NO, webkitdirectory: false})
            }
        },
        // データを選ぶ(选中数据)
        tableSelection (data) {
            this.selectData = data
            this.length = this.selectData.length
        },
        // ビューを切り替え(切换视图)
        viewtype (item) {
            this.length = 0
            this.activeTabpanelName = item
            store.dispatch('setViewType', item)
            if (Crypto.decrypt(store.state.viewtype) === 'thumbnail') {
                // bus.$emit('allfiles')
                // setTimeout(() => {
                //     this.$refs.thumbnail.thumbnailSliderInput(this.slider)
                // }, 500)
            } else {
                // console.log(this.breadcrumb, JSON.parse(Crypto.decrypt(store.state.breadcrumb)))
                bus.$emit('treetable', {NO: this.breadcrumb[this.breadcrumb.length - 1].NO, webkitdirectory: false})
            }
        },
        // ビューを切り替え(切换视图)
        viewtypeEvent (item, bool) {
            this.addVisible = !this.addVisible
            this.addVisible = bool
            this.viewtype(item)
        },
        // サムネイルモード-サイズの制御(缩略图模式-控制大小)
        sliderInput () {
            this.$refs.thumbnail.thumbnailSliderInput(this.slider)
        },
        // ボタンクリック
        handleCommand (command) {
            const commandReplace = command.replace(/^\s+|\s+$/g, '')
            if (
                commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_MAKE_SNAP_SHOT') ||
                commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_MAKE_QR_PDF') ||
                commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DOWNLOAD_QR_PDF') ||
                commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DISABLEQR') ||
                commandReplace === this.$t(
                    'allFilesHeader.DISPLAY_FILE_INFO_FILE_VIEWER_PICTURE_EDIT_BLACKBOARD_EDIT_REGIST_FAVORITE')
            ) {
                return
            }

            if (commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_NEW_FOLDER')) {
                const parentNo = this.breadcrumb[this.breadcrumb.length - 1].NO === '-1'
                    ? '1' : this.breadcrumb[this.breadcrumb.length - 1].NO
                this.$refs.TreeTable.handleClick({$slots: {default: [{
                    text: this.$t('allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_NEW_FOLDER'), parentNo}]}})
            } else if (
                commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_UPLOAD_FILE')
            ) {
                // upload file
                if (parseInt(this.breadcrumb[this.breadcrumb.length - 1].NO) === -1 || parseInt(this.breadcrumb[this.breadcrumb.length - 1].NO) === 1) {
                    return
                }
                bus.$emit('close')
                bus.$emit('openUpload', {
                    type: 'file', NO: this.breadcrumb[this.breadcrumb.length - 1].NO, webkitdirectory: false
                })
            } else if (
                commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_UPLOAD_FOLDER')
            ) {
                // upload folder
                if (parseInt(this.breadcrumb[this.breadcrumb.length - 1].NO) === -1 || parseInt(this.breadcrumb[this.breadcrumb.length - 1].NO) === 1) {
                    return
                }
                bus.$emit('close')
                bus.$emit('openUpload', {
                    type: 'file', NO: this.breadcrumb[this.breadcrumb.length - 1].NO, webkitdirectory: true
                })
            } else if (commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DOWNLOAD')) {
                // download
                this.$refs.TreeTable.downloadNow(this.selectData)
            } else if (commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_SEND_MAIL')) {
                // 邮件通知
                setTimeout(() => {
                    const no = []
                    this.selectData.forEach(element => {
                        no.push(element.NO)
                    })
                    bus.$emit('showMail', [no])
                })
            } else if (commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_FILE_VIEWER_PICTURE_EDIT_BLACKBOARD_EDIT_REGIST_FAVORITE')
            ) { // お気に入り
                this.$refs.TreeTable.favorites()
            } else if (commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_MOVE_COPY')) {
                // 移動/コピー
                const no = []
                this.selectData.forEach(element => {
                    no.push(element.NO)
                })
                this.$refs.TreeTable.handleClick({$slots: {default: [{
                    text: this.$t('allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_MOVE_COPY'),
                    SelectFileNo: no,
                    SelectFileParentNo: this.breadcrumb[this.breadcrumb.length - 1].NO
                }]}})
            } else if (commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_DELETE')) {
                // ゴミ箱へ
                this.$refs.TreeTable.trash()
            } else if (
                commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_MAKE_SNAP_SHOT')
            ) {
                // 快照
                const no = []
                this.selectData.forEach(element => {
                    no.push(element.NO)
                })
                bus.$emit('CreateSnapShot', {show: true, no})
            } else if (
                commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_MAKE_QR_PDF')
            ) { // qr QR付きPDFの作成
                if (this.selectData.length === 0) {
                    this.$message.warning(this.$t('allFiles.MESSAGE_FILE_INFO_FILE_NOT_SELECT'))
                } else {
                    let menuDatas = ''
                    for (let i = this.selectData.length - 1; i >= 0; i--) {
                        menuDatas += this.selectData[i].NO
                        if (i > 0) {
                            menuDatas += ','
                        }
                    }
                    console.log(menuDatas)
                    this.$refs.PDFCreating.pdfCreating(menuDatas)
                }
            } else if (
                commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DOWNLOAD_QR_PDF')
            ) {
                // qr QR付きPDFのダウンロード
                if (this.selectData.length === 0) {
                    this.$message.warning(this.$t('allFiles.MESSAGE_FILE_INFO_FILE_NOT_SELECT'))
                } else {
                    let menuDatas = ''
                    for (let i = this.selectData.length - 1; i >= 0; i--) {
                        menuDatas += this.selectData[i].NO
                        if (i > 0) {
                            menuDatas += ','
                        }
                    }
                    console.log(menuDatas)
                    this.uploadQrPdf(menuDatas)
                }
            } else if (
                commandReplace === this.$t('allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DISABLEQR')
            ) {
                // qr QR付きPDFの無効化
                if (this.selectData.length === 0) {
                    this.$message.warning(this.$t('allFiles.MESSAGE_FILE_INFO_FILE_NOT_SELECT'))
                } else {
                    let menuDatas = ''
                    for (let i = this.selectData.length - 1; i >= 0; i--) {
                        menuDatas += this.selectData[i].NO
                        if (i > 0) {
                            menuDatas += ','
                        }
                    }
                    console.log(menuDatas)
                    this.qrInvalidation(menuDatas)
                }
            }
        },
        // 詳細探索スイッチ
        detailedSearch () {
            this.show = false
            this.length = 0
            this.addVisible = !this.addVisible
            this.activeTabpanelName = this.addVisible ? 'sousuo' : Crypto.decrypt(store.state.viewtype)
            this.offsetHeight = document.getElementsByClassName('relevantData')[0].offsetHeight + 25 + 'px'
        },
        // ドキュメント検索
        getFile (inp) {
            this.loading = true
            this.length = 0
            this.tableData = []
            this.activeTabpanelName = 'sousuo'
            this.selectTableData = []
            const searchCondition = inp.split(' ')
            const body = (`{"Query": "${searchCondition.toString()}", "QueryType": "${searchCondition.length > 1 ? 'FALSE' : 'TRUE'}"}`)
            this.$request.folder.FolderFuzzyQuery(this.breadcrumb[this.breadcrumb.length - 1].NO, body).then(response => {
                console.log('FolderFuzzyQuery-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'FolderFuzzYQuery')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    if (data.result.length > 0) {
                        this.selectTableData = data.result
                    } else {
                        this.$message.success(this.$t('allFiles.MESSAGE_FILE_INFO_NO_DATA'))
                    }
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getFile(inp) : ''
                    })
                } else {
                    this.$request.requestError('FolderFuzzyQuery-get请求失败', err, 'FolderFuzzYQuery')
                }
            })
        },
        // 詳細検索
        conditionQuery ({QUERY, SCOPE, TARGET, ACCESS, EXT, QR}) {
            this.loading = true
            this.selectTableData = []
            const body = ('{"SCOPE":"' + SCOPE + '","TARGET":"' + TARGET + '","ACCESS":"' + ACCESS + '","EXT":"' + EXT + '","QR":"' + QR + '","QUERY":"' + QUERY + '"}')
            this.$request.folder.FolderConditionQuery(this.breadcrumb[this.breadcrumb.length - 1].NO, body).then(response => {
                console.log('FolderConditionQuery-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'FolderConditionQuery')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.selectTableData = data.result
                    console.log(this.selectTableData)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.conditionQuery({QUERY, SCOPE, TARGET, ACCESS, EXT, QR}) : ''
                    })
                } else {
                    this.$request.requestError('FolderConditionQuery-get请求失败', err, 'FolderConditionQuery')
                }
            })
        },
        inputValueEvent (fileName) {
            this.selectTableData.forEach(d => {
                if (d.NO === fileName.no) {
                    d.FILE_NAME = fileName.value + '.' + fileName.type.toLowerCase()
                }
            })
        },
        // 二次元コードのpdfをダウンロードします。
        uploadQrPdf (data) {
            this.loading = true
            this.$request.folder.QrCodeUpload(data, '').then(response => {
                console.log('QrCodeUpload-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'QrCodeUpload')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    if (data.size) {
                        this.$message.warning(this.$t('allFiles.MESSAGE_FILE_INFO_NO_FILE'))
                        this.loading = false
                        return
                    }
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
                        response ? this.uploadQrPdf(data) : ''
                    })
                } else {
                    this.$request.requestError('QrCodeUpload-get请求失败', err, 'QrCodeUpload')
                }
            })
        },
        // qr無効化
        qrInvalidation (data) {
            this.loading = true
            this.$request.folder.QrCodeInvalid(data, '').then(response => {
                console.log('QrCodeInvalid-delete请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'QrCodeInvalid')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success(this.$t('allFiles.MESSAGE_FILE_INFO_SUCCESS'))
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.qrInvalidation(data) : ''
                    })
                } else {
                    this.$request.requestError('QrCodeInvalid-delete请求成功', err, 'QrCodeInvalid')
                }
            })
        }
    }
}
</script>

/* 右侧抽屉 */
<style lang="less" scoped>
@import url("../../../less/pages/Files/AllFiles/AllFiles.less");
</style>
