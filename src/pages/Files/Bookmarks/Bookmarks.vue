<template>
    <div id="Bookmarks">
        <el-container v-loading="loading"
                      :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(255,255,255,.4)"
                      onselectstart="return false;">
            <el-collapse-transition>
                <div v-show="addVisible"
                     style="padding: 21px 20px 17px 20px;border: 1px solid;">
                    <DetailedSearch :add-visible="addVisible"
                                    @DetailedSearch="DetailedSearch"
                                    @ConditionQuery="ConditionQuery"></DetailedSearch>
                </div>
            </el-collapse-transition>
            <el-header height="auto">
                <Header :add-visible="addVisible"
                        :add-visible-two="true"
                        @handleCommand="handleCommand"
                        @DetailedSearch="DetailedSearch"
                        @getFile="getFile"></Header>
            </el-header>
            <!--面包屑 -->
            <div class="div-breadcrumb">
                <div style="width: 300px;height: 24px;margin-left: 19px;line-height: 24px;">
                    <img :src="require('@a/images/file/file-collection-03.svg')">
                    <span style="font-size: 12px;vertical-align: top;margin-left: 9px;">お気に入り</span>
                </div>
                <button class="bottonAdd"
                        @click="show = !show">
                    <i class="el-icon-arrow-left el-icon--left"></i>
                    <span>関連データ</span>
                </button>
            </div>
            <el-main>
                <!-- <TableELEMENTUI ref="TableELEMENTUI"
                                :select-table-data="selectTableData"
                                :relevant-data="relevantData"
                                @tableSelection="tableSelection"
                                :style="{width: offsetWidth, 'vertical-align': 'middle'}"></TableELEMENTUI> -->
                <div class="relevantData"></div>
            </el-main>
            <transition name="el-fade-in-linear">
                <div>
                    <div v-show="show"
                         class="transition"
                         :style="{height: offsetHeight}">
                        <button class="bottonAdd"
                                @click="show = !show"
                                style="top: 0;bottom: auto;right: auto;left: 0;">
                            <i class="el-icon-arrow-left el-icon--left"></i>
                            <span>関連データ</span>
                        </button>
                        <div style="width: 78.3px;height: 100%;display: inline-block;vertical-align: middle;"></div>
                        <div style="width: 323px;height: 100%;display: inline-block;vertical-align: middle;background-color: #32465A;padding: 8px 9px;">
                            <DetailedExamination></DetailedExamination>
                        </div>
                    </div>
                </div>
            </transition>
        </el-container>
        <!-- 重命名 or 添加文件夹 -->
        <edit ref="edit"
              @inputValueEvent="inputValueEvent"></edit>
        <!-- QR付きPDF作成 -->
        <PDFCreating ref="PDFCreating"></PDFCreating>
        <!-- 移動/コピー -->
        <MoveAndCopy ref="MoveAndCopy"></MoveAndCopy>
    </div>
</template>

<script>
import bus from '@c/bus'
import store from '@p/Files/store'
import Crypto from '@u/crypto'
// 详细检查
import DetailedSearch from '@c/DetailedSearch.vue'
import PDFCreating from '@c/HeadComponents/PDFCreating.vue'
// 右侧抽屉
import DetailedExamination from '@c/ChildComponents/FileDrawer.vue'
import Header from '@p/Files/Bookmarks/BookmarksHeader.vue'
import edit from '@p/Files/AllFiles/TreeTable/Edit.vue'
import MoveAndCopy from '@p/Files/AllFiles/Move/MoveAndCopy.vue'

export default {
    name: 'Bookmarks',
    components: {
        Header, DetailedSearch, DetailedExamination, /* TableELEMENTUI, */ PDFCreating, edit, MoveAndCopy
    },
    data () {
        return {
            loading: false,
            addVisible: false, // 开启详情检索
            show: false,
            offsetWidth: '100%',
            offsetHeight: '',
            min: 110,
            max: 130,
            slider: 110,
            relevantData: true, // 子组件Table的参数
            selectTableData: [], // 子组件Table的参数
            pulldown: require('@a/images/file/file-pull-down.svg'), // 下拉
            selectData: []
        }
    },
    computed: {
        // 面包屑
        breadcrumb () {
            return JSON.parse(Crypto.decrypt(store.state.breadcrumb))
        }
    },
    mounted () {
        const that = this
        that.$nextTick(() => {
            const elementResizeDetectorMaker = require('element-resize-detector')// 导入
            // 创建实例
            const erd = elementResizeDetectorMaker()
            that.$nextTick(() => {
                erd.listenTo(document.getElementById('Bookmarks'), function (element) {
                    that.offsetWidth = element.offsetWidth - 10 + 'px'
                })
                erd.listenTo(document.getElementsByClassName('relevantData')[0], function (element) {
                    that.offsetHeight = element.offsetHeight + 34 + 'px'
                })
            })
            this()
        })
    },
    methods: {
        // header按钮点击事件
        handleCommand (command) {
            if (command === 'その他の\n操作' || command === 'スナップ\nショット' || command === '通知' || command === 'QR付きPDFの作成' || command === 'QR付きPDFのダウンロード' || command === 'QR付きPDFの無効化') {
                return
            }
            if (this.selectData.length === 0 && command !== 'アップ\nロード' && command !== 'フォルダ\n作成') {
                this.$message('データを選んでください')
                return
            }
            if (command === 'フォルダ\n作成') {
                this.$refs.edit.editDialog({
                    editDialog: true,
                    title: 'フォルダ作成',
                    width: '394.95px',
                    inputName: '名前',
                    FILE_NAME: ''
                })
            } else if (command === 'アップ\nロード') { // 上传
                bus.$emit('close')
                // bus.$emit('openUploader', {type: 'file', NO: this.breadcrumb[this.breadcrumb.length - 1].NO})
                bus.$emit('openUpload', {type: 'file', NO: this.breadcrumb[this.breadcrumb.length - 1].NO})
            } else if (command === 'ダウン\nロード') { // 下载
                bus.$emit('DownloadNow', this.selectData)
            } else if (command === '通知') { // 邮件通知
            } else if (command === 'お気に入り') { // お気に入り
                this.$refs.TableELEMENTUI(this.dat)
            } else if (command === '移動/コピー') { // 移動/コピー
                this.$refs.MoveAndCopy.moveAndCopy(true, this.selectData.NO, this.breadcrumb[this.breadcrumb.length - 1].NO)
            } else if (command === 'ゴミ箱へ') { // ゴミ箱へ
                this.$refs.TableELEMENTUI.addTrash(this.dat)
            } else if (command === 'スナップ\nショット') { // 快照
                const NO = []
                this.selectData.forEach(element => {
                    NO.push(element.NO)
                })
                bus.$emit('CreateSnapShot', {show: true, NO})
            } else if (command === 'QR付きPDFの作成') { // qr
                if (this.selectData.length === 0) {
                    this.$message.warning('ファイルを選択してください')
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
            } else if (command === 'その他の\n操作') { // 其他
            }
        },
        // フォルダ作成
        inputValueEvent (d) {
            if (d.title === 'フォルダ作成') {
                this.loading = true
                const body = `{"FolderName": "${d.value}"}`
                this.$request.folder.Createfolder(this.breadcrumb[this.breadcrumb.length - 1].NO === '-1' ? '1' : this.breadcrumb[this.breadcrumb.length - 1].NO, body).then(response => {
                    console.log('Createfolder-post请求成功:', response.status, response.statusText)
                    const data = this.$request.CODE(response.data)
                    if (Object.prototype.toString.call(data) === '[object Object]') {
                        this.$message.success('操作に成功する')
                        this.$refs.TreeTable.refresh()
                    }
                    this.loading = false
                }).catch(err => {
                    this.loading = false
                    if (err.status === 401) {
                        this.$request.login.refreshToken().then(response => {
                            response ? this.inputValueEvent(d) : ''
                        })
                    } else {
                        this.$request.requestError(`Createfolder-post请求成功:`, err, 'Bookmarks')
                    }
                })
            }
        },
        // 选中数据
        tableSelection (dta) {
            console.log(dta)
            this.selectData = dta
        },
        // 详细搜索开关
        DetailedSearch () {
            this.show = false
            this.offsetHeight = document.getElementsByClassName('relevantData')[0].offsetHeight + 25 + 'px'
            this.addVisible = !this.addVisible
            if (!this.addVisible) {
                this()
            }
        },
        // 文件检索
        getFile (inp) {
            this.loading = true
            this.activeTabName = 'sousuo'
            this.tableData = []
            const body = (`{"Query": "${inp}", "FAVIORT": "TRUE", "Trash": "FALSE"}`)
            this.$request.folder.AmbiguousQuery(body).then(response => {
                console.log('AmbiguousQuery-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    if (data.result.length > 0) {
                        this.selectTableData = data.result
                    } else {
                        this.$message.success('検索データはありません')
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
                    this.$request.requestError(`AmbiguousQuery-get请求失败:`, err, 'Bookmarks')
                }
            })
        },
        // 详细搜索`
        ConditionQuery ({QUERY, SCOPE, TARGET, ACCESS, EXT, QR}) {
            this.loading = true
            this.selectTableData = []
            const body = ('{"SCOPE":"' + SCOPE + '","TARGET":"' + TARGET + '","ACCESS":"' + ACCESS + '","EXT":"' + EXT + '","QR":"' + QR + '","QUERY":"' + QUERY + '","FAVIORT":"TRUE"}')
            this.$request.folder.FolderConditionQuery(2, body).then(response => {
                console.log('FolderConditionQuery-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.selectTableData = data.result
                    console.log(this.selectTableData)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.ConditionQuery({QUERY, SCOPE, TARGET, ACCESS, EXT, QR}) : ''
                    })
                } else {
                    this.$request.requestError(`FolderConditionQuery-get请求失败:`, err, 'Bookmarks')
                }
            })
        },
        // 获取`收藏夹数据
        favorites () {
            this.loading = true
            this.$request.favorites.Favorites('').then(response => {
                console.log('Favorites-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    data.result.forEach(da => {
                        da.FILE_NAME = decodeURIComponent(da.FILE_NAME)
                    })
                    this.selectTableData = data.result
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.favorites() : ''
                    })
                } else {
                    this.$request.requestError(`Favorites-get请求失败:`, err, 'Bookmarks')
                }
            })
        }
    }
}
</script>

/* 右侧抽屉 */
<style lang="less" scoped>
@import url("../../../less/pages/Files/Bookmarks/Bookmarks.less");
</style>
