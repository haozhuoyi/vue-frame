<template>
    <div id="TreeTable">
        <el-container>
            <Split>
                <v-contextmenu ref="treeContextMenu"
                               auto-placement
                               class="treeContextMenu"
                               :theme="theme"
                               @show="showEvent">
                    <v-contextmenu-item @click="handleClick">
                        {{ $t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_NEW_FOLDER') }}
                    </v-contextmenu-item>
                    <v-contextmenu-item @click="handleClick">
                        {{ $t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_CHANGE_NAME') }}
                    </v-contextmenu-item>
                    <v-contextmenu-item @click="handleClick">
                        {{ $t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_MOVE_COPY') }}
                    </v-contextmenu-item>
                    <v-contextmenu-item @click="handleClick">
                        {{ $t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_SEND_MAIL') }}
                    </v-contextmenu-item>
                    <v-contextmenu-submenu :title="$t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_UPLOAD')">
                        <v-contextmenu-item @click="handleClick">
                            {{ $t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_UPLOAD_FILE') }}
                        </v-contextmenu-item>
                        <v-contextmenu-item @click="handleClick">
                            {{ $t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_UPLOAD_FOLDER') }}
                        </v-contextmenu-item>
                    </v-contextmenu-submenu>
                    <v-contextmenu-item @click="handleClick">
                        {{ $t('treeTable.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DOWNLOAD') }}
                    </v-contextmenu-item>
                    <v-contextmenu-item :disabled="true"
                                        @click="handleClick">
                        {{ $t('treeTable.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_MAKE_SNAP_SHOT') }}
                    </v-contextmenu-item>
                    <v-contextmenu-item @click="handleClick">
                        {{ $t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_DELETE') }}
                    </v-contextmenu-item>
                </v-contextmenu>
                <SplitArea :size="25">
                    <el-aside width="auto">
                        <div ref="treeDiv"
                             :class="['treeContainer', data.length <= 0 ? 'after' : '']">
                            <chx-tree
                                ref="tree"
                                node-key="NO"
                                :indent="0"
                                :chx-load="loadNode"
                                :props="defaultProps"
                                :default-expanded-keys="JSON.parse(JSON.stringify(defaultExpandedKeys))"
                                @node-contextmenu="rightClick"
                                @node-expand="nodeExpand"
                                @node-collapse="nodeCollapse"
                                @node-click="nodeClick"
                                @chx-current-change="currentChange">
                            </chx-tree>
                        </div>
                    </el-aside>
                </SplitArea>
                <SplitArea :size="75"
                           v-loading="loading"
                           :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                           element-loading-spinner="el-icon-loading"
                           element-loading-background="rgba(255,255,255,.4)">
                    <el-main class="dropMain"
                             @dragenter.native.stop="onDrag"
                             @dragleave.native.stop="onDragleave"
                             @dragover.native.stop="onDrag"
                             @drop.native.stop="onDrop">
                        <ListTable ref="TableELEMENTUI"
                                   :select-table-data="selectTableData"
                                   @tableSelection="tableSelection"
                                   @toggleRowExpansion="toggleRowExpansion"
                                   @putTrashCallback="putTrashCallback"
                                   @inputValueEvent="inputValueEvent"></ListTable>
                        <!-- 拖动上传显示的罩层 -->
                        <div class="dropCoverLayer"
                             v-show="dropCoverlayer"
                             @mouseout="mouseout">
                            <div>
                                <p>{{ $t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_DROP_COVER_LAYER') }}</p>
                            </div>
                        </div>
                    </el-main>
                </SplitArea>
            </Split>
        </el-container>

        <el-dialog :visible.sync="trashDialogVisible"
                   :title="$t('treeTable.DISPLAY_FILE_INFO_POPUP_TITLE_DUMP')"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   append-to-body>
            <!-- ファイル／フォルダをゴミ箱にいれます。よろしいですか？<br /><br />
            ※フォルダの場合はフォルダ内のファイル、フォルダを全てゴミ箱に入れます。<br />
            ※ゴミ箱に入れたファイルも容量に含まれます。 -->
            {{ $t('treeTable.MESSAGE_ASK_FILE_INFO_DUMP_FILE_ONE') }}<br /><br />
            {{ $t('treeTable.MESSAGE_ASK_FILE_INFO_DUMP_FILE_TWO') }}<br />
            {{ $t('treeTable.MESSAGE_ASK_FILE_INFO_DUMP_FILE_THREE') }}
            <span slot="footer"
                  class="dialog-footer">
                <button class="button "
                        @click="close">{{ $t('treeTable.DISPLAY_NO') }}</button>
                <button class="button buttonDelete margin"
                        @click="addTrash">{{ $t('treeTable.DISPLAY_YES') }}</button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import bus from '@c/bus'
import store from '@p/Files/store'
import Crypto from '@u/crypto'
import $ from 'jquery'
import {natsort} from '@u/natsort-1.2.4.js'
// import axios from 'axios'
import ListTable from '@p/Files/AllFiles/TreeTable/ListTable.vue'

export default {
    name: 'TreeTable',
    components: {ListTable},
    props: {
        theme: {
            type: String,
            default: 'default'
        }
    },
    data () {
        return {
            loading: false,
            trashDialogVisible: false,
            breadcrumbUpdata: [],
            data: [],
            defaultProps: {label: 'FILE_NAME', id: 'NO', isLeaf: 'leaf'}, // treeツリーの標準値
            defaultExpandedKeys: [], // デフォルトの展開
            treeChildrenData: [], // treeツリーのサブデータ
            selectTableData: [],
            clickTimeId: Object,
            contextmenuData: {}, // 右クリックでデータを選択(右键选中数据)
            contextmenuParentData: {}, // データの親データを右クリックで選択する(右键选中数据的父数据)
            node: Object,
            contextmenu: [
                {name: 'フォルダ作成'},
                {name: '名前を変更'},
                {name: '移動_コピー'},
                {name: '通知'},
                {
                    name: 'アップロード',
                    children: [
                        {
                            name: 'ファイルをアップロード' // 上传文件
                        },
                        {
                            name: 'フォルダをアップロード' // 上传文件夹
                        }
                    ]
                },
                {name: 'ダウンロード'},
                {name: 'スナップショット'},
                {name: 'ゴミ箱へ'}
            ],
            dat: [],
            dropCoverlayer: false, // 表示されたマスク層をドラッグする(拖动上传显示的罩层)
            isFile: false, // ファイルがドラッグされているかどうか(拖动的是否有文件)
            isDirectory: false, // // フォルダがドラッグされているかどうか(拖动的是否有文件夹)
            scanFiles: [], // ファイルをドラッグしてアップロードする(拖动上传文件)
            scanFolders: [], // フォルダをドラッグする(拖动上传文件夹)
            misc: [],
            childrenNodes: [], // 当前选中节点的子列表，单击节点选中时设置
            currentNode: null // 当前选中的节点
        }
    },
    mounted () {
        const that = this
        console.log(store.state, Crypto.decrypt(store.state.defaultExpandedKeys), JSON.parse(Crypto.decrypt(store.state.defaultExpandedKeys)))
        that.defaultExpandedKeys = JSON.parse(Crypto.decrypt(store.state.defaultExpandedKeys))
        that.$nextTick(() => {
            bus.$on('DownloadNow', data => { // download
                that.downloadNow(data)
            })
            bus.$on('treetablemove', no => { // move or copy
                that.busFolder(no, true)
            })
            bus.$on('treetable', data => { // upload after OR breadcrumb
                that.busFolder(data.NO, false, data.webkitdirectory)
            })

            /* 监听键盘按键 */
            document.addEventListener('keyup', (e) => {
                // alert(e.keyCode)
                if (e.keyCode === 27) {
                    that.isFile = false
                    that.isDirectory = false
                    that.scanFiles = []
                    that.scanFolders = []
                    that.dropCoverlayer = false
                }
            })
        })
    },
    methods: {
        /* ドラッグアップ */
        // ファイル移入
        onDrag (event) {
            event.preventDefault()
            event.stopPropagation()
            const that = this
            that.mouseout(false, false, true)
        },
        onDragleave (event) {
            event.preventDefault()
            const that = this
            that.mouseout(false, false, false)
        },
        // マウスでファイルを開きます
        onDrop (event) {
            event.preventDefault()
            const that = this
            // 拖拽（转移）的对象列表
            const items = event.dataTransfer.items
            let isDirectory = 0
            for (let index = 0; index < items.length; index++) {
                if (items[index].webkitGetAsEntry().isDirectory) {
                    isDirectory += 1
                }
            }
            if (items.length > 1 && isDirectory > 1) {
                that.dropCoverlayer = false
                return
            }
            let i = 0
            for (; i < items.length; i++) {
                // file 对象（按实例拖拽的内容）转换成 FileSystemFileEntry 对象 或 FileSystemDirectoryEntry 对象
                const item = items[i].webkitGetAsEntry()
                if (item) {
                    if (item.isDirectory) {
                        that.isDirectory = item.isDirectory
                        // 读取文件夹的文件
                        that.scanFolder(item)
                    }
                    if (item.isFile) {
                        that.isFile = item.isFile
                        // 读取文件
                        that.scanFile(item)
                    }
                }
            }
            if (parseInt(this.contextmenuData.NO) === -1 || parseInt(this.contextmenuData.NO) === 1) {
                return
            }
            if (items.length === i) {
                that.dropCoverlayer = false
                if (that.isDirectory && that.isFile) {
                    this.$message.warning(this.$t('treeTable.MESSAGE_FILE_INFO_CANNOT_RESTORE_FILE'))
                    return
                }
                setTimeout(() => {
                    const breadcrumb = JSON.parse(Crypto.decrypt(store.state.breadcrumb))
                    if (Math.abs(parseInt(breadcrumb[breadcrumb.length - 1].NO)) !== 1) {
                        // if (
                        //     that.isDirectory && that.isFile// &&
                        //     // that.scanFolders.length === 0 && that.scanFiles.length === 0
                        // ) {
                        //     this.$message.warning(this.$t('treeTable.MESSAGE_FILE_INFO_UPLOAD_EMPTY_FILE'))
                        //     return
                        // }
                        bus.$emit('uploadFile', {
                            scanFiles: that.scanFiles,
                            scanFolders: that.scanFolders,
                            misc: that.misc,
                            isDirectory: that.isDirectory,
                            isFile: that.isFile,
                            NO: breadcrumb[breadcrumb.length - 1].NO
                        })
                    } else {
                        this.$message.warning(this.$t('treeTable.MESSAGE_FILE_INFO_UPLOAD_FILE_TO_LEVEL2'))
                    }
                }, 300)
            }
        },
        /**
         * ファイルを読み込む
         * @param  item         FileSystemDirectoryEntry  オブジェクトインスタンス(ディレクトリ実体)[对象实例（目录实体）]
         * @param  container     表示容器
         * @return void
         */
        scanFolder (item) {
            const that = this
            // 如果是目录，则递归读取
            if (item.isDirectory) {
                // 使用目录实体来创建 ileSystemDirectoryReader 实例
                const directoryReader = item.createReader()
                // 上面只是创建了 reader 实例，现在使用 reader 实例来读取 目录实体（读取目录内容）
                directoryReader.readEntries(function (entries) {
                    if (entries.length === 0) {
                        that.misc.push(item.fullPath)
                        console.log(item.fullPath)
                    } else {
                        // 循环目录内容
                        entries.forEach(function (entry) {
                        // 处理内容（递归）
                            that.scanFolder(entry)
                        })
                    }
                })
            } else if (item.isFile) {
                if (item.name.charCodeAt() === 46) {
                    return
                }
                item.file(function (file) {
                    if (file.size / 1024 / 1024 / 1024 > 2) {
                        that.$message.warning(that.$t('treeTable.MESSAGE_FILE_INFO_FILE_SIZE_LIMIT'))
                        return
                    }
                    that.scanFolders.push({
                        id: new Date().getTime() + '.' + that.generateMixed(),
                        fullPath: item.fullPath.replace(/^./, ''),
                        name: file.name,
                        size: file.size,
                        file
                    })
                })
            }
        },
        scanFile (item) {
            const that = this
            if (item.name.charCodeAt() === 46) {
                return
            }
            item.file(function (file) {
                if (file.size / 1024 / 1024 / 1024 > 2) {
                    that.$message.warning(that.$t('treeTable.MESSAGE_FILE_INFO_FILE_SIZE_LIMIT'))
                    return
                }
                that.scanFiles.push({
                    id: new Date().getTime() + '.' + file.size,
                    fullPath: item.fullPath.replace(/^./, ''),
                    name: file.name,
                    size: file.size,
                    file
                })
            })
        },
        // ランダムデータ
        generateMixed (n = 5) {
            const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
            let res = ''
            for (let i = 0; i < n; i++) {
                const id = Math.ceil(Math.random() * 35)
                res += chars[id]
            }
            return res
        },
        mouseout (isFile = false, isDirectory = false, dropCoverlayer = false) {
            this.misc = []
            this.scanFiles = []
            this.scanFolders = []
            this.isFile = isFile
            this.isDirectory = isDirectory
            this.dropCoverlayer = dropCoverlayer
        },

        // 面包屑 点击触发
        busFolder (no, bool, webkitdirectory) {
            console.log('busFolder')
            this.loading = true
            this.breadcrumbUpdata = []
            this.selectTableData = []
            const that = this
            this.getFolder(no).then(res => {
                if (!res) return
                const data = []
                console.log(that.$refs.tree)
                that.$refs.tree.getNode(no).data.children = []
                for (let i = 0; i < res.length; i++) {
                    res[i].LENGTH = i
                    that.selectTableData.push(res[i])
                    if (res[i].TYPE === 'DIR' || res[i].TYPE === 'ROOT') {
                        data.push(res[i])
                        if (webkitdirectory) {
                            try {
                                that.$refs.tree.remove(res[i].NO)
                            } catch (error) {
                                console.log(error)
                            } finally {
                                that.$refs.tree.append(res[i], no)
                            }
                        }
                    }
                }
                that.data = bool ? data : that.data
                that.loading = false
                that.breadcrumbUpdataEvent(that.$refs.tree.getNode(parseInt(no)))
                store.commit('setBreadcrumb', that.breadcrumbUpdata)
            })
        },
        async loadNode (node, resolve) {
            console.log('TreeTable loadNode', node, node.label)
            if (node.expanded) return
            // node.loading = true
            this.loading = true
            // this.selectTableData = []
            // this.tableSelection([])
            this.breadcrumbUpdata = []

            const treeChildrenNodes = (this.currentNode !== null && this.currentNode.key === node.key) ? this.childrenNodes : await this.getChildrenByNode(node)

            if (!treeChildrenNodes) {
                this.loading = false
                return
            }

            const treeData = []
            for (let i = 0; i < treeChildrenNodes.length; i++) {
                treeChildrenNodes[i].LENGTH = i
                if (treeChildrenNodes[i].TYPE === 'DIR' || treeChildrenNodes[i].TYPE === 'ROOT') {
                    treeData.push(treeChildrenNodes[i])
                }
            }

            await resolve(treeData)
            // 如果是根目录，则展开节点，并选中该节点
            // if (node.level === 0) {
            //     // node.expand()
            // }
            this.loading = false
            // await this.getFolder(nodeNo).then(res => {
            //     if (!res) {
            //         that.loading = false
            //         return
            //     }
            //     that.data = []
            //     for (let i = 0; i < res.length; i++) {
            //         res[i].LENGTH = i
            //         if (res[i].TYPE === 'DIR' || res[i].TYPE === 'ROOT') {
            //             that.data.push(res[i])
            //         }
            //         that.selectTableData.push(res[i])
            //     }
            //     // console.log(res[0])
            //     // store.dispatch('setADDBreadcrumb', [{
            //     //     FILE_NAME: res[0].FILE_NAME || that.$store.state.userInfo.projectName,
            //     //     NO: res[0].NO || 1
            //     // }])
            //     resolve(this.data)
            //     // 如果是根目录，则展开节点，并选中该节点
            //     if (node.level === 0) {
            //         node.expand()
            //     }
            //     that.loading = false
            // })

            // } else if (node.level !== 0) {
            //     await this.getFolder(node.data.NO).then(res => {
            //         this.treeChildrenData = []
            //         this.selectTableData = []
            //         if (res) {
            //             for (let i = 0; i < res.length; i++) {
            //                 res[i].LENGTH = i
            //                 res[i].NO = res[i].NO.toString()
            //                 if (res[i].TYPE === 'DIR' || res[i].TYPE === 'ROOT') {
            //                     this.treeChildrenData.push(res[i])
            //                 }
            //                 this.selectTableData.push(res[i])
            //             }
            //         }
            //         try {
            //             // this.breadcrumbUpdataEvent(this.$refs.tree.getNode(parseInt(node.data.NO)))
            //             // store.commit('setBreadcrumb', this.breadcrumbUpdata)

            //             this.loading = false
            //             resolve(this.treeChildrenData)
            //             // $('.is-current ').removeClass('is-current')
            //             // node.isCurrent = true
            //         } catch (error) {
            //             console.log(error)
            //         }
            //     })

            // }
            // node.loading = false
        },
        // 展開行
        toggleRowExpansion (data) {
            console.log('tree:toggleRowExpansion')
            this.breadcrumbUpdata = []
            // const node = this.$refs.tree.getNode(data.NO) // 通过节点id找到对应树节点对象
            // $('.is-current ').removeClass('is-current')
            // node.loaded = false
            // node.isCurrent = true
            // node.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点
            this.$refs.tree.expandNodeByNode(this.currentNode)
            // this.$refs.tree.expandNodeByKey(data.NO)
            this.$refs.tree.setCurrentNodeByKey(data.NO)

        },
        // eslint-disable-next-line no-unused-vars
        nodeExpand (data, Object, Node, event) {
            console.log('tree:nodeExpand')

            // // console.log(data, Object, Node, event)
            // this.defaultExpandedKeys = []
            // if (Object.loaded === true) {
            //     this.toggleRowExpansion(data)
            // }
        },
        // 收起节点
        nodeCollapse (data, Object, Node, event) {
            console.log('nodeCollapse')
            console.log('nodeCollapse-data', data)
            console.log('nodeCollapse-node', Object)
            console.log('nodeCollapse-treenode', Node)
        },
        // データを選ぶ(选中数据)
        tableSelection (dta) {
            this.dat = dta
            this.$emit('tableSelection', dta)
        },
        // マウスクリック(鼠标点击)
        handleNodeClick (data, event) {
            // 单击改为选中，取消显示子列表

            // this.handleNodeDbclick(data, event)
        },
        // マウスダブルクリック(鼠标双击)
        handleNodeDbclick (data, event = {target: ''}) {
            if ('child'.indexOf(event.target.className) !== -1) {
                event.target.parentElement.previousElementSibling.click()
            } else {
                event.target.parentElement.click()
            }
            this.toggleRowExpansion(data)
        },
        // tree - 右クリックイベント
        rightClick (event, Object, Node) {
            if (Node.id === 1) return
            console.log(event, Object, Node)
            if (!Node.expanded) this.handleNodeClick(Object, event)
            this.contextmenuParentData = Node.parent.data.NO
            this.contextmenuData = Object
            this.node = Node
            let x = event.pageX
            let y = event.pageY
            if (document.body.clientHeight - y <= 318) {
                y = document.body.clientHeight - 318
            }
            if (document.body.clientWidth - x <= 192) {
                x = document.body.clientWidth - 192
            }
            const postition = {
                top: y,
                left: x
            }

            document.getElementsByClassName('contextmenu')[0].style.display = 'none'
            this.$refs.treeContextMenu.show(postition)
            document.getElementsByClassName('treeContextMenu')[0].style.display = 'block'
        },
        showEvent () {
            const sunmenUicon = document.getElementsByClassName('treeContextMenu')[0]
                .getElementsByClassName('v-contextmenu-submenu__title')[0].children[0]
            sunmenUicon.style.float = 'right'
            sunmenUicon.className = 'el-icon-arrow-right iconaeeowright'
        },
        // 右クリックイベント
        handleClick (vm) {
            const num = vm.$slots.default[0].text.replace(/\n/g, '').replace(/^\s+|\s+$/g, '')
            console.log(num)
            console.log(this.$t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_UPLOAD_FOLDER'))
            console.log(this.$t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_UPLOAD_FOLDER') === num)

            if (num === this.$t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_NEW_FOLDER')) {
                this.$refs.TableELEMENTUI.editClickEvent({
                    editDialog: true,
                    title: 'フォルダ作成',
                    width: '394.95px',
                    inputName: '名前',
                    FILE_NAME: '',
                    no: vm.$slots.default[0].parentNo || this.contextmenuData.NO
                })
            } else if (num === this.$t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_CHANGE_NAME')) {
                this.$refs.TableELEMENTUI.editClickEvent({
                    editDialog: true,
                    title: '名前を変更する',
                    width: '394.95px',
                    inputName: '名前',
                    FILE_NAME: vm.$slots.default[0].FILE_NAME || this.contextmenuData.FILE_NAME,
                    TYPE: vm.$slots.default[0].TYPE || this.contextmenuData.TYPE,
                    no: vm.$slots.default[0].no || this.contextmenuData.NO
                })
            } else if (num === this.$t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_MOVE_COPY')) {
                // move/copy
                this.$refs.TableELEMENTUI.moveAndCopy(true,
                    vm.$slots.default[0].SelectFileNo || this.contextmenuData.NO,
                    vm.$slots.default[0].SelectFileParentNo || this.contextmenuParentData
                )
            } else if (num === this.$t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_SEND_MAIL')) {
                bus.$emit('showMail', true, [this.contextmenuData.NO])
            } else if (num === this.$t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_UPLOAD_FILE')) {
                if (parseInt(this.contextmenuData.NO) === -1 || parseInt(this.contextmenuData.NO) === 1) {
                    return
                }
                bus.$emit('close')
                bus.$emit('openUpload', {type: 'file', NO: this.contextmenuData.NO, webkitdirectory: false})
            } else if (num === this.$t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_UPLOAD_FOLDER')) {
                if (parseInt(this.contextmenuData.NO) === -1 || parseInt(this.contextmenuData.NO) === 1) {
                    return
                }
                bus.$emit('close')
                bus.$emit('openUpload', {type: 'file', NO: this.contextmenuData.NO, webkitdirectory: true})
            } else if (num === this.$t('treeTable.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DOWNLOAD')) {
                this.downloadNow([this.contextmenuData])
            } else if (num === this.$t('treeTable.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_MAKE_SNAP_SHOT')) {
                bus.$emit('CreateSnapShot', {show: true, NO: this.contextmenuData.NO})
            } else if (num === this.$t('treeTable.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_DELETE')) {
                this.trashDialogVisible = true
            }
        },
        close () {
            this.trashDialogVisible = false
        },
        trash () {
            this.$refs.TableELEMENTUI.trash()
        },
        // ゴミ箱に入れる
        addTrash () {
            this.close()
            this.loading = true
            this.$request.dustbin.TrashAdd(this.contextmenuData.NO, '').then(response => {
                console.log('TrashAdd-post请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (data && data !== 'getProjects') {
                    if (data.result.length > 0) {
                        let filname = 'ごみ箱に入れないファイルがあります:'
                        for (let index = data.result.length - 1; index >= 0; index--) {
                            filname += `<i style="color: red">${data.result[index].fileName}</i><br />`
                        }
                        this.$message({type: 'warning', message: `${filname}`, dangerouslyUseHTMLString: true})
                    } else {
                        this.$message.success(this.$t('treeTable.MESSAGE_FILE_INFO_SUCCESS'))
                        // 删除数据
                        this.putTrashCallback([this.contextmenuData.NO])
                    }
                } else if (data && data === 'getProjects') {
                    bus.$emit('getProjects')
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                this.$request.requestError('TrashAdd-post请求成功', err)
            })
        },
        putTrashCallback (no) {
            for (let i = 0; i < no.length; i++) {
                const data = this.$refs.tree.getNode(no[i])
                if (data) {
                    this.$refs.tree.remove(data)
                }
                for (let j = this.selectTableData.length - 1; j >= 0; j--) {
                    if (no[i] === this.selectTableData[j].NO.toString()) {
                        this.selectTableData.splice(j, 1)
                    }
                }
            }
        },
        // フォルダ作成 or 名前を変更
        inputValueEvent (fileName, result) {
            console.log(fileName, result)
            if (this.$t(fileName.title) !== this.$t('edit.DISPLAY_FILE_INFO_NAME_TITLE')) {
                if (fileName.type === 'DIR') {
                    const breadcrumb = JSON.parse(Crypto.decrypt(store.state.breadcrumb))
                    const treeData = this.$refs.tree.getNode(fileName.no)
                    treeData.data.FILE_NAME = fileName.value
                    console.log(breadcrumb)
                    for (let index = 0; index < breadcrumb.length; index++) {
                        if (breadcrumb[index].NO === fileName.no) {
                            breadcrumb[index].FILE_NAME = fileName.value
                            store.commit('setBreadcrumb', breadcrumb)
                        }
                    }
                    // this.busFolder(treeData.parent.data.NO)
                } else {
                    this.selectTableData.forEach(d => {
                        if (d.NO === fileName.no) {
                            d.FILE_NAME = fileName.value + '.' + fileName.type.toLowerCase()
                        }
                    })
                }
            } else {
                bus.$emit('refresh')
            }
        },
        // ファイルダウンロード
        downloadNow (data) {
            this.$refs.TableELEMENTUI.downloadNow(data)
        },
        // フォルダリストの取得
        getFolder (NO) {
            this.loading = true
            const body = ('{"NeedPointCNT": "false", "NeedDirectContentCNT": "false", "NeedQRInfo": "false"}')
            return this.$request['folder']['getFolders'](NO, body).then(response => {
                console.log('getFolders-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (data && data !== 'getProjects') {
                    this.loading = false
                    return this.sort(response.data.result) || []
                }
            }).catch(err => {
                this.loading = false
                this.$request.requestError('getFolders-get请求失败', err, true)
            })
        },
        sort (data) {
            if (data.length > 1) {
                return natsort(data, convertFILENAME)
                // return data.sort(function compareFunction (item1, item2) {
                //     return item1.FILE_NAME.charCodeAt() - item2.FILE_NAME.charCodeAt()
                // })
            } else {
                return data
            }

            function convertFILENAME (value) { // 配列の要素を受け取る
                return value.FILE_NAME // 要素値となる配列オブジェクトの "1" プロパティを比較する
            }
        },
        breadcrumbUpdataEvent (node) {
            this.breadcrumbUpdata.unshift({
                FILE_NAME: node.data.FILE_NAME,
                NO: node.data.NO
            })
            if (parseInt(node.id) === 1) return
            if (node.parent !== null) {
                this.breadcrumbUpdataEvent(node.parent)
            }
        },
        // カスタム tree
        renderContent (h, {node, data}) {
            return (
                <span class='renderContent'
                    ondblclick={(event) => this.handleNodeDbclick(data, event)}
                    onclick={(event) => this.handleNodeClick(data, event)}
                >
                    <i class='childIcon'></i>
                    <span class='childLabel'>{node.label}</span>
                </span>
            )
        },
        nodeClick (data, node, treeNode) {
            console.log('nodeClick.params[data]:', data)
            console.log('nodeClick.params[node]:', node)
            console.log('nodeClick.params[treeNode]:', treeNode)


        },

        async currentChange (data, node) {
            console.log('TreeTable currentChange')

            this.loading = true
            this.selectTableData = []

            this.childrenNodes = await this.getChildrenByNode(node)

            if (!this.childrenNodes) {
                this.loading = false
                return
            }

            const treeData = []
            for (let i = 0; i < this.childrenNodes.length; i++) {
                this.childrenNodes[i].LENGTH = i
                this.selectTableData.push(this.childrenNodes[i])

                if (this.childrenNodes[i].TYPE === 'DIR' || this.childrenNodes[i].TYPE === 'ROOT') {
                    treeData.push(this.childrenNodes[i])
                }
            }

            if (!node.loaded) {
                this.$refs.tree.appendChildren(node, treeData)
            }
            node.loaded = true
            this.loading = false

            this.currentNode = node

        },
        // 异步变成同步
        getChildrenByNode (parentNode) {
            return new Promise(resolve => {
                const nodeNo = parentNode.level === 0 ? '-1' : parentNode.data.NO
                this.getFolder(nodeNo).then(res => {
                    resolve(res)
                })
            })

        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../less/pages/Files/AllFiles/TreeTable/TreeTable.less");
</style>
