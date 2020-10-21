<template>
    <div id="listtable"
         :class="`listtable${contextmenuName}`"
         v-loading="loading"
         :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(255,255,255,.4)">
        <v-contextmenu auto-placement
                       :ref="`contextmenu${contextmenuName}`"
                       :class="`contextmenu${contextmenuName}`"
                       :theme="theme"
                       @show="showEvent">
            <v-contextmenu-item @click="handleClick"
                                :disabled="activeFlag ? false : true">
                {{ $t('listTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_OPEN') }}
            </v-contextmenu-item>
            <v-contextmenu-item @click="handleClick"
                                :disabled="activeFlag ? false : true">
                {{ $t('listTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_CHANGE_NAME') }}
            </v-contextmenu-item>
            <v-contextmenu-item @click="handleClick">
                {{ $t('listTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_COPY') }}</v-contextmenu-item>
            <v-contextmenu-item @click="handleClick">
                {{ $t('listTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_SEND_MAIL') }}
            </v-contextmenu-item>
            <v-contextmenu-item :disabled="true">
                {{ $t('listTable.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_CONTEXT_MENU_QR_GROUP') }}
            </v-contextmenu-item>
            <v-contextmenu-submenu title="QR"
                                   style="display: none;">
                <v-contextmenu-item :disabled="true"
                                    @click="handleClick">
                    {{ $t('listTable.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_MAKE_QR_PDF') }}
                </v-contextmenu-item>
                <v-contextmenu-item :disabled="true"
                                    @click="handleClick">
                    {{ $t('listTable.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DOWNLOAD_QR_PDF') }}
                </v-contextmenu-item>
                <v-contextmenu-item :disabled="true"
                                    @click="handleClick">
                    {{ $t('listTable.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DISABLEQR') }}
                </v-contextmenu-item>
            </v-contextmenu-submenu>
            <v-contextmenu-item @click="handleClick"
                                :disabled="true">
                {{ $t('listTable.DISPLAY_FILE_INFO_FILE_VIEWER_PICTURE_EDIT_BLACKBOARD_EDIT_REGIST_FAVORITE') }}
            </v-contextmenu-item>
            <v-contextmenu-item @click="handleClick">
                {{ $t('listTable.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DOWNLOAD') }}
            </v-contextmenu-item>
            <v-contextmenu-item @click="handleClick"
                                :disabled="true">
                {{ $t('listTable.DISPLAY_FILE_INFO_DG_PICTURE_FILE_RIGHT_CLICK_MENU_MAKE_SNAP_SHOT') }}
            </v-contextmenu-item>
            <v-contextmenu-item @click="handleClick">
                {{ $t('listTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_DELETE') }}
            </v-contextmenu-item>
        </v-contextmenu>

        <chx-table ref="listTable"
                   :class="[theme, 'ulBody']"
                   :data="selectTableDataOriginal"
                   :header-click="headerClickEvent"
                   :selection-change="handleSelectionChange"
                   :row-contextmenu="listTableContextmenu"
                   :row-dblclick="dblclickEvent"
                   chx-highlight-current-row
                   oncontextmenu="return false;"
                   onselectstart="return false;">
            <el-table-column
                prop="FILE_NAME"
                :label="$t('listTable.DISPLAY_FILE_INFO_DG_FILE_ROW_TITLE_FILE_NAME')">
                <template slot-scope="scope">
                    <img class="imghover"
                         :src="require('@a/images/table/file-notice-08.svg')"
                         style="float: left;"
                         @click="emailClickEvent(scope.row.index, scope.row)" />
                    <img class="imghover"
                         :src="require('@a/images/table/file-rename-02.svg')"
                         style="float: right;"
                         @click="editClickEvent(scope.row)" />
                    <div class="icon">
                        <img v-if="['PDF', 'pdf'].includes(scope.row.TYPE)"
                             :src="require('@a/images/table/file-pdf-09.svg')" />
                        <img v-else-if="['DIR', 'ROOT', 'dir', 'root'].includes(scope.row.TYPE)"
                             :src="require('@a/images/file/file-tree-icon-12.svg')" />
                        <img v-else-if="['XLSX', 'xlsx'].includes(scope.row.TYPE)"
                             :src="require('@a/images/file/file-xls.svg')" />
                        <img v-else-if="['SVG','JPG','PNG','GIF','JPEG','svg','jpg','png','gif','jpeg'].includes(scope.row.TYPE)"
                             :src="require('@a/images/file/file-img.svg')" />
                        <img v-else
                             :src="require('@a/images/file/file-txt.svg')" />
                        <img v-if="scope.row.favoriteNo !== null || scope.row.favoriteNo"
                             :src="require('@a/images/file/file-collection-03.svg')"
                             style="width: 14px;height: 14px;position: absolute;bottom: 0;right: 0;" />
                    </div>
                    <span :title="scope.row.FILE_NAME"
                          style="width: calc(100% - 96px);">{{ scope.row.FILE_NAME }}</span>
                </template>
            </el-table-column>
            <el-table-column
                class-name="center"
                prop="FILE_DATE_TIME"
                :label="$t('listTable.DISPLAY_FILE_INFO_DG_FILE_ROW_TITLE_FILE_UPDATE_DATE_TIME')"
                width="168">
            </el-table-column>
            <el-table-column
                class-name="center"
                prop="FILE_SIZE"
                width="82"
                :label="$t('listTable.DISPLAY_FILE_INFO_DG_FILE_ROW_TITLE_FILE_SIZE')"
                :formatter="bytesToSize">
            </el-table-column>
            <el-table-column
                class-name="center"
                width="112">
                <template slot-scope="scope">
                    <div v-if="scope.row.XlsFlg"
                         class="xlsFlg">
                        <img :src="require('@a/images/table/file-execl-001.svg')"
                            />
                    </div>
                    <div v-if="scope.row.ContentsFlg"
                         class="contentsFlg">
                        <img :src="require('@a/images/file/file-img.svg')"
                            />
                    </div>
                    <div v-if="scope.row.MemoFlg"
                         class="memoFlg">
                        <img :src="require('@a/images/file/file-txt.svg')"
                            />
                    </div>
                    <div v-if="scope.row.QR_INFO !== null"
                         class="qrInfo">
                        <img :src="require('@a/images/table/table-qr.svg')"
                            />
                    </div>
                </template>
            </el-table-column>
        </chx-table>

        <!-- 弹窗 -->
        <!-- QR付きPDF作成 -->
        <PDFCreating ref="PDFCreating"></PDFCreating>
        <!-- 重命名 or 添加文件夹 -->
        <edit ref="edit"
              @inputValueEvent="inputValueEvent"></edit>
        <!-- 移動/コピー -->
        <MoveAndCopy ref="MoveAndCopy"></MoveAndCopy>

        <el-dialog :visible.sync="trashDialogVisible"
                   :title="$t('listTable.DISPLAY_FILE_INFO_POPUP_TITLE_DUMP')"
                   :close-on-click-modal="false"
                   :before-close="trash"
                   :destroy-on-close="true"
                   append-to-body>
            <!-- ファイル／フォルダをゴミ箱にいれます。よろしいですか？<br /><br />
            ※フォルダの場合はフォルダ内のファイル、フォルダを全てゴミ箱に入れます。<br />
            ※ゴミ箱に入れたファイルも容量に含まれます。 -->
            {{ $t('listTable.MESSAGE_ASK_FILE_INFO_DUMP_FILE_ONE') }}<br /><br />
            {{ $t('listTable.MESSAGE_ASK_FILE_INFO_DUMP_FILE_TWO') }}<br />
            {{ $t('listTable.MESSAGE_ASK_FILE_INFO_DUMP_FILE_THREE') }}
            <span slot="footer"
                  class="dialog-footer">
                <button class="button"
                        @click="trash">{{ $t('listTable.DISPLAY_NO') }}</button>
                <button class="button buttonDelete margin"
                        @click="addTrash(multiSelectData)">{{ $t('listTable.DISPLAY_YES') }}</button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import $ from 'jquery'
import md5 from 'js-md5'
import bus from '@c/bus'
import store from '@p/Files/store'
import Crypto from '@u/crypto'
import {bytesToSize} from '@u/filters'
import PDFCreating from '@c/HeadComponents/PDFCreating.vue'
import edit from '@p/Files/AllFiles/TreeTable/Edit.vue'
import MoveAndCopy from '@p/Files/AllFiles/Move/MoveAndCopy.vue'

// eslint-disable-next-line no-unused-vars
import {natsort} from '@u/natsort-1.2.4.js'

export default {
    name: 'Listtable',
    components: { PDFCreating, edit, MoveAndCopy},
    props: {
        selectTableData: { // 表格数据
            type: Array,
            default: () => {
                return []
            }
        },
        dblclickEventBool: { // 表头-関連データ 是否显示
            type: Boolean,
            default: true
        },
        theme: {
            type: String,
            default: 'default'
        },
        contextmenuName: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            loading: false,
            trashDialogVisible: false,
            offsetWidth: '',
            name: '', // 排序的方式
            selectTableDataOriginal: [], // 原始数据
            ctrlIndex: [],
            shiftIndex: [],
            contextmenuData: {index: 0}, // 鼠标点击选中数据
            multiSelectData: [], // 选中数据(所有, 包含{ contextmenuData: 鼠标点击选中数据 })
            activeFlag: true // 多选时二级菜单选项活性设置
        }
    },
    computed: {
        breadcrumb () {
            return JSON.parse(Crypto.decrypt(store.state.breadcrumb))
        }
    },
    watch: {
        selectTableData: {
            handler (val) {
                this.name = ''
                this.selectTableDataOriginal = JSON.parse(JSON.stringify(val))
                let fileItem = Crypto.decrypt(store.state.fileItem)
                if (fileItem.length > 0) {
                    fileItem = JSON.parse(fileItem)
                    for (let index = 0; index < this.selectTableDataOriginal.length; index++) {
                        if (parseInt(this.selectTableDataOriginal[index].NO) === parseInt(fileItem.NO)) {
                            setTimeout(() => {
                                this.clearSelect()
                                this.contextmenuData = fileItem
                                this.contextmenuData.index = index
                                this.multiSelectData.push(fileItem)
                                // $(`.ulListtable${index}`).addClass('checked')
                                // $(`.ulBody`).scrollTop(
                                //     document.getElementsByClassName(`ulListtable${index}`)[0].scrollTop + 32)
                                // this.$emit('tableSelection', this.multiSelectData)
                                store.dispatch('setFileItem', {})
                            }, 50 * index)
                            break
                        }
                    }
                }
                this.clearSelect()
                this.sort('FILE_NAME')
            },
            deep: true
        }
    },
    mounted () {
        const that = this
        that.$nextTick(() => {
            that.name = ''
            const elementResizeDetectorMaker = require('element-resize-detector')// 导入
            // 创建实例
            const erd = elementResizeDetectorMaker()
            erd.listenTo(document.getElementsByClassName(`listtable${this.contextmenuName}`), function (element) {
                that.offsetWidth = element.offsetWidth + 'px'
            })

            bus.$on('boundingClientRect', () => {
                this.clearSelect()
            })
        })
    },
    methods: {
        // sort (name) {
        //     if (this.name && this.name === name) {
        //         this.selectTableDataOriginal.reverse()
        //     } else {
        //         if (name === 'FILE_SIZE') {
        //             this.selectTableDataOriginal.sort(function compareFunction (item1, item2) {
        //                 return parseFloat(item1[name]) - parseFloat(item2[name])
        //             })
        //         } else if (name === 'FILE_DATE_TIME') {
        //             this.selectTableDataOriginal.sort(function compareFunction (item1, item2) {
        //                 const date1 = new Date(item1[name].substring(0, 19).replace(/-/g, '/')).getTime()
        //                 const date2 = new Date(item2[name].substring(0, 19).replace(/-/g, '/')).getTime()
        //                 return date1 - date2
        //             })
        //         } else {
        //             this.selectTableDataOriginal.sort(function compareFunction (item1, item2) {
        //                 return item1[name].charCodeAt() - item2[name].charCodeAt()
        //             })
        //         }
        //     }
        //     this.name = name
        // },
        sort (name) {
            if (name === undefined) {
                return
            }
            if (this.name && this.name === name) {
                this.selectTableDataOriginal.reverse()
            } else {
                const selectTableDataOriginal = natsort(this.selectTableDataOriginal, convert)
                this.selectTableDataOriginal = Object.assign([], this.selectTableDataOriginal, selectTableDataOriginal)
            }
            this.name = name

            function convert (value) { // 配列の要素を受け取る
                return value[name].toString() // 要素値となる配列オブジェクトの "1" プロパティを比較する
            }
        },
        // 选择所属
        templateSelection (index, item, bool = false) {
            this.clearSelect()
            this.contextmenuData = item
            this.contextmenuData.index = index
            this.multiSelectData.push(item)
            // $(`.ulListtable${index}`).addClass('checked')
            this.$emit('tableSelection', this.multiSelectData)
            if (bool) {
                return bool
            }
        },
        clearSelect () {
            this.multiSelectData = []
            // $(`.checked`).removeClass('checked')
            this.$emit('tableSelection', this.multiSelectData)
        },
        // 双击事件
        dblclickEvent (row) {
            const item = row
            this.clearSelect()
            // this.templateSelection(index, item)
            console.log(item)
            if (!this.dblclickEventBool) {
                if (!item.defaultExpandedKeys) {
                    return
                }
                store.dispatch('setDefaultExpandedKeys', item.defaultExpandedKeys)
                if (item.TYPE !== 'DIR') {
                    store.dispatch('setFileItem', item)
                }
                this.$emit('defaultExpanded')
            } else {
                if (item.TYPE === 'DIR') {
                    this.$emit('toggleRowExpansion', item)
                }
            }
        },
        // 鼠标右键时判断是选中，还是直接弹出菜单
        selectIndex (index) {
            const indexArray = this.multiSelectData.map(item => { return {'index': item.index} })
            for (let i = 0; i < indexArray.length; i++) {
                if (index === indexArray[i].index) {
                    return true
                }
            }
            return false
        },
        // 鼠标右键
        listTableContextmenu (row, item, event) {
            const index = row.index
            this.activeFlag = true
            if (this.multiSelectData.length < 2) {
                // this.templateSelection(index, item)
                this.$refs.listTable.cellClickEvent({row})
            } else {
                this.activeFlag = false
            }
            let x = event.pageX
            let y = event.pageY
            if (document.body.clientHeight - y <= 282) {
                y = document.body.clientHeight - 282
            }
            if (document.body.clientWidth - x <= 192) {
                x = document.body.clientWidth - 192
            }
            const postition = {
                top: y,
                left: x
            }
            if (document.getElementsByClassName('treeContextMenu').length > 0) {
                document.getElementsByClassName('treeContextMenu')[0].style.display = 'none'
            }
            this.$refs[`contextmenu${this.contextmenuName}`].show(postition)
            document.getElementsByClassName(`contextmenu${this.contextmenuName}`)[0].style.display = 'block'
            this.showEvent()

        },
        showEvent () {
            const sunmenUicon = document.getElementsByClassName(`contextmenu${this.contextmenuName}`)[0].getElementsByClassName('v-contextmenu-submenu__title')[0].children[0]
            sunmenUicon.style.float = 'right'
            sunmenUicon.className = 'el-icon-arrow-right iconaeeowright'
        },
        // 菜单点击事件
        handleClick (vm) {
            const name = vm.$slots.default[0].text.replace(/\n/g, '').replace(/^\s+|\s+$/g, '')
            console.log(name === this.$t('listTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_CHANGE_NAME'))
            console.log(name)
            console.log(this.$t('listTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_CHANGE_NAME'))

            if (name === this.$t('listTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_OPEN')) { // 開く
                if (this.contextmenuData[0].TYPE === 'DIR') {
                    this.$emit('toggleRowExpansion', this.contextmenuData[0])
                }
            } else if (name === this.$t('listTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_CHANGE_NAME')) {
                // 名前を変更する
                this.editClickEvent({
                    editDialog: true,
                    title: name,
                    width: '394.95px',
                    inputName: name === '名前を変更する' ? '名前' : (name === '重命名' ? '名称' : 'Name'),
                    FILE_NAME: this.contextmenuData[0].FILE_NAME,
                    TYPE: this.contextmenuData[0].TYPE,
                    no: this.contextmenuData[0].NO
                })
            } else if (
                name === this.$t('listTable.DISPLAY_FILE_INFO_FILE_VIEWER_PICTURE_EDIT_BLACKBOARD_EDIT_REGIST_FAVORITE')
            ) {
                this.favorites(this.multiSelectData)
            } else if (name === this.$t('listTable.RemoveFavorites')) {
                this.cancelCollection(this.contextmenuData)
            } else if (name === this.$t('listTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_SEND_MAIL')) {
                // 通知メール送信
                this.emailClickEvent()
            } else if (name === this.$t('listTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_COPY')) { // 移動_コピー
                this.moveAndCopy(true, this.contextmenuData[0].NO, this.breadcrumb[this.breadcrumb.length - 1].NO)
            } else if (
                name === this.$t('listTable.DISPLAY_FILE_INFO_DG_PICTURE_FILE_RIGHT_CLICK_MENU_MAKE_SNAP_SHOT')
            ) {
                // スナップショット作成
                const no = []
                this.multiSelectData.forEach(element => {
                    no.push(element.NO)
                })
                bus.$emit('CreateSnapShot', {show: true, no})
            } else if (name === this.$t('listTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_DELETE')) {
                // ゴミ箱に入れる
                this.trashDialogVisible = true
            } else if (name === this.$t('listTable.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_MAKE_QR_PDF')) {
                // QR付きPDFの作成
                if (this.multiSelectData.length === 0) {
                    this.$message.warning(this.$t('listTable.MESSAGE_FILE_INFO_FILE_NOT_SELECT'))
                } else {
                    let menuDatas = ''
                    for (let i = this.multiSelectData.length - 1; i >= 0; i--) {
                        menuDatas += this.multiSelectData[i].NO
                        if (i > 0) {
                            menuDatas += ','
                        }
                    }
                    console.log(menuDatas)
                    this.$refs.PDFCreating.pdfCreating(menuDatas)
                }
            } else if (name === this.$t('listTable.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DOWNLOAD_QR_PDF')) {
                // qr QR付きPDFのダウンロード
                if (this.multiSelectData.length === 0) {
                    this.$message.warning(this.$t('listTable.MESSAGE_FILE_INFO_FILE_NOT_SELECT'))
                } else {
                    let menuDatas = ''
                    for (let i = this.multiSelectData.length - 1; i >= 0; i--) {
                        menuDatas += this.multiSelectData[i].NO
                        if (i > 0) {
                            menuDatas += ','
                        }
                    }
                    console.log(menuDatas)
                    this.uploadQrPdf(menuDatas)
                }
            } else if (name === this.$t('listTable.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DISABLEQR')) {
                // qr QRコードを無効化する
                if (this.multiSelectData.length === 0) {
                    this.$message.warning(this.$t('listTable.MESSAGE_FILE_INFO_FILE_NOT_SELECT'))
                } else {
                    let menuDatas = ''
                    for (let i = this.multiSelectData.length - 1; i >= 0; i--) {
                        menuDatas += this.multiSelectData[i].NO
                        if (i > 0) {
                            menuDatas += ','
                        }
                    }
                    console.log(menuDatas)
                    this.qrInvalidation(menuDatas)
                }
            } else {
                this.downloadNow(this.multiSelectData)
            }
        },
        moveAndCopy (bool, SelectFileNo, SelectFileParentNo) {
            this.$refs.MoveAndCopy.moveAndCopy(bool, SelectFileNo, SelectFileParentNo)
        },
        // 添加收藏
        favorites (data) {
            this.loading = true
            const no = []
            data.forEach(element => {
                no.push(element.NO)
            })
            for (let index = no.length - 1; index >= 0; index--) {
                this.$request.folder.Favorites(no[index].toString(), '').then(response => {
                    console.log('Favorites-post请求成功:', response.status, response.statusText)
                    const data = this.$request.CODE(response.data)
                    if (Object.prototype.toString.call(data) === '[object Object]' && data !== '') {
                        for (let i = 0; i < this.selectTableDataOriginal.length; i++) {
                            if (this.selectTableDataOriginal[i].NO === no[index]) {
                                this.selectTableDataOriginal[i].favoriteNo = data.result[0]
                                this.selectTableDataOriginal[i].favoriteFlg = true
                            }
                        }
                    }
                    if (index === 0 && data) {
                        this.$message.success(this.$t('listTable.MESSAGE_FILE_INFO_SUCCESS'))
                    }
                    this.loading = false
                }).catch(err => {
                    this.loading = false
                    this.$request.requestError('Favorites-post请求失败', err)
                    return
                })
            }
        },
        // 所蔵を取り消す
        cancelCollection (data) {
            this.loading = true
            this.$request.folder.FavoritesDelete(data.favoriteNo, '').then(response => {
                console.log('FavoritesDelete-delete请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]' && data !== '') {
                    console.log(response)
                    this.$message.success(this.$t('listTable.MESSAGE_FILE_INFO_SUCCESS'))
                    for (let i = 0; i < this.selectTableDataOriginal.length; i++) {
                        if (this.selectTableDataOriginal[i].NO === data.NO) {
                            this.selectTableDataOriginal[i].favoriteNo = null
                            this.selectTableDataOriginal[i].favoriteFlg = false
                            return
                        }
                    }
                }
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.cancelCollection(data) : ''
                    })
                } else {
                    this.$request.requestError('FavoritesDelete-delete请求成功', err, 'ListTable')
                }
            })
        },
        trash () {
            this.trashDialogVisible = !this.trashDialogVisible
        },
        // ゴミ箱に入れる
        addTrash (data) {
            this.trash()
            const no = []
            const parseData = JSON.parse(JSON.stringify(data))
            parseData.forEach(element => {
                no.push(element.NO.toString())
            })
            this.loading = true
            this.$request.dustbin.TrashAdd('{"NO": "' + no.toString() + '"}').then(response => {
                console.log('TrashAdd-post请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]' && data !== '') {
                    if (data.result.length === 0) {
                        this.$emit('putTrashCallback', no)
                        this.$message.success(this.$t('listTable.MESSAGE_FILE_INFO_SUCCESS'))
                    } else {
                        let filname = 'ごみ箱に入れないファイルがあります:'
                        const deletedSuccessfully = []
                        for (let index = data.result.length - 1; index >= 0; index--) {
                            if (data.result[index].fileName === undefined) {
                                deletedSuccessfully.push(data.result[index].toString())
                            } else {
                                filname += `<i style="color: red">${data.result[index].fileName}</i><br />`
                            }
                        }
                        console.log(deletedSuccessfully)
                        this.$emit('putTrashCallback', deletedSuccessfully)
                        this.$message({type: 'warning', message: `${filname}`, dangerouslyUseHTMLString: true})
                    }
                    this.clearSelect()
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.addTrash(data) : ''
                    })
                } else {
                    this.$request.requestError('TrashAdd-post请求成功', err, 'ListTable')
                }
            })
        },
        // メール
        emailClickEvent (index, item) {
            console.log(index !== undefined && item)
            if (index !== undefined && item) {
                const bool = this.templateSelection(index, item, true)
                if (bool) {
                    bus.$emit('showMail', [this.contextmenuData.NO])
                }
            } else {
                const no = []
                for (let index = 0; index < this.multiSelectData.length; index++) {
                    no.push(this.multiSelectData[index].NO)
                }
                bus.$emit('showMail', [no])
            }
        },
        // フォルダ作成 or 名前を変更
        editClickEvent (itme) {
            this.$refs.edit.editDialog({
                editDialog: itme.editDialog || true,
                title: itme.title || 'listTable.DISPLAY_FILE_INFO_DG_FILE_ROW_TITLE_EDITDIALOG',
                width: itme.width || '394.95px',
                inputName: itme.inputName || '名前',
                FILE_NAME: itme.FILE_NAME,
                TYPE: itme.TYPE,
                no: itme.no || itme.NO
            })
        },
        // フォルダ作成 or 名前を変更
        inputValueEvent (fileName) {
            bus.$emit('localLoading', true)
            console.log(this.$t(fileName.title), this.$t('edit.DISPLAY_FILE_INFO_NAME_TITLE'))
            const body = `{"${this.$t(fileName.title) === this.$t('edit.DISPLAY_FILE_INFO_NAME_TITLE') ? 'FolderName' : 'NewName'}": "${fileName.value}"}`
            const dataKey = this.$t(fileName.title) === this.$t('edit.DISPLAY_FILE_INFO_NAME_TITLE') ? 'Createfolder' : 'FileRname'
            this.$request.folder[dataKey](fileName.no, body).then(response => {
                console.log(`${dataKey}-patch请求成功:`, response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success(this.$t('listTable.MESSAGE_FILE_INFO_SUCCESS'))
                    this.$refs.edit.close()
                    this.$emit('inputValueEvent', fileName, data.result)
                }
                bus.$emit('localLoading', false)
            }).catch(err => {
                bus.$emit('localLoading', false)
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.inputValueEvent(fileName) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.$refs.edit.close()
                    }
                    this.$request.requestError(`${dataKey}-patch请求失败:`, err, 'ListTable')
                }
            })
        },
        // 二次元コードのpdfをダウンロードします。
        uploadQrPdf (data) {
            this.loading = true
            this.$request.folder.QrCodeUpload(data, '').then(response => {
                console.log('QrCodeUpload-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]' && data !== '') {
                    if (data.size) {
                        this.$message.warning(this.$t('listTable.MESSAGE_FILE_INFO_NO_FILE'))
                        this.loading = false
                        return
                    }
                    const content = response
                    const blob = new Blob([content.data], {type: 'application/vnd.ms-excel;charset=utf-8'})
                    const fileNameSplit = response.headers['content-disposition'].split('=')
                    // 跟后端约定好最后一个值为fileName字段
                    const fileName = decodeURI(fileNameSplit[fileNameSplit.length - 1])
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
                    this.$request.requestError(`QrCodeUpload-get请求失败`, err, 'ListTable')
                }
            })
        },
        // qr无效化
        qrInvalidation (data) {
            this.loading = true
            this.$request.folder.QrCodeInvalid(data, '').then(response => {
                console.log('QrCodeInvalid-delete请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]' && data !== '') {
                    this.$message.success(this.$t('listTable.MESSAGE_FILE_INFO_SUCCESS'))
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.qrInvalidation(data) : ''
                    })
                } else {
                    this.$request.requestError(`QrCodeInvalid-delete请求成功:`, err, 'ListTable')
                }
            })
        },
        // ファイルダウンロード
        downloadNow (data) {
            const no = []
            data.forEach(element => {
                no.push(element.NO)
            })
            const time = new Date().getTime()
            const signature = md5((`Body=&Timestamp=${time}3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d`))
            const commonParametersPost = `ApplicationID=10000&Format=JSON&Signature=${signature}&SignatureVersion=1.0&Timestamp=${time}&access_token=${this.$store.getters.getToken.access_token}`
            // const hrefDownload = document.getElementById('href')
            // hrefDownload.href = `/api/S3MetaDatas/File/${no}?Body=&${commonParametersPost}`
            // hrefDownload.click()

            const that = this
            const xhr = new XMLHttpRequest()
            that.loading = true
            xhr.open('GET', `/api/S3MetaDatas/${no}/File?Body&${commonParametersPost}`, true)
            xhr.responseType = 'blob'
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
            xhr.onprogress = function (progressEvent) {
                if (progressEvent.lengthComputable) {
                    const complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
                    console.log(progressEvent, complete)
                }
            }
            xhr.onload = function (oEvent) {
                if (xhr.status === 200 && xhr.response.size > 0) {
                    console.log(
                        'oEvent', oEvent,
                        '\nstatus:', xhr.status,
                        '\nresponse', xhr.response,
                        '\nheader:', xhr.getResponseHeader('content-disposition')
                    )
                    const blob = new Blob([xhr.response], {type: 'application/vnd.ms-excel;charset=utf-8'})
                    // 跟后端约定好最后一个值为fileName字段
                    const fileNameSplit = xhr.getResponseHeader('content-disposition').split('=')
                    const fileName = decodeURI(fileNameSplit[fileNameSplit.length - 1])
                    const elink = document.createElement('a')
                    if ('download' in elink) { // 非IE下载
                        elink.href = window.URL.createObjectURL(blob)
                        elink.download = fileName
                        elink.style.display = 'none'
                        document.body.appendChild(elink)
                        elink.click()
                        URL.revokeObjectURL(elink.href) // 释放 URL对象
                        document.body.removeChild(elink)
                    } else { // IE10+下载
                        navigator.msSaveBlob(blob, fileName)
                    }
                    // that.failFile(`${+new Date()}${this.$store.state.userInfo}`)
                } else {
                    that.$message.error(that.$t('listTable.MESSAGE_FILE_INFO_DOWNLOAD_FAILED'))
                }
                that.loading = false
            }
            xhr.send()
        },
        // ファイルダウンロード通知
        failFile (NoticeFileName) {
            this.loading = true
            const body = (`{"NoticeFileName": "${NoticeFileName}"}`)
            this.$request.folder.FailFile(body).then(response => {
                console.log('FailFile-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]' && data !== '') {
                    let element = ''
                    if (data.result.failNum > 0) {
                        for (let index = 0; index < data.result.failNum; index++) {
                            element += `<i style="
                                            width:260px;
                                            color:#D61918;
                                            padding-left:16px;
                                            overflow:hidden;
                                            white-space:nowrap;
                                            text-overflow:ellipsis;
                                            display: inline-block;">
                                            ${data.result.fileName[index]}
                                        </i><br />`
                        }
                    }
                    if (data.result.failNum > 0) {
                        this.$notify({
                            title: '警告',
                            warning: 'warning',
                            dangerouslyUseHTMLString: true,
                            message: `<strong>
                                    でファイルをダウンロードします<i>${data.result.fileCount}</i> 個,<br />
                                    ダウンロード失敗 <i>${data.result.failNum}</i> 個,それぞれ:<br />${element}
                                 </strong>`,
                            duration: 0
                        })
                    }
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.failFile(NoticeFileName) : ''
                    })
                } else {
                    this.$request.requestError(`FailFile-get请求成功:`, err, 'ListTable')
                }
            })
        },
        headerClickEvent (column, event) {
            console.log(column, event)
            this.sort(column.property)
        },
        // 行データを取得する(获取选中行数据)
        handleSelectionChange (selection) {
            this.contextmenuData = selection
            this.multiSelectData = selection
        },
        bytesToSize (row) {
            const bytes = row.FILE_SIZE
            return bytesToSize(bytes)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../less/pages/Files/AllFiles/TreeTable/ListTable.less");
</style>
