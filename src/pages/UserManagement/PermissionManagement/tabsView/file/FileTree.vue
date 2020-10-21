<template>
    <div id="fileTree">
        <div ref="treeDiv"
             class="treeContainer"
             onselectstart="return false;">
            <el-tree :indent="0"
                     :expand-on-click-node="false"
                     :load="loadNode"
                     :props="defaultProps"
                     :render-content="renderContent"
                     :default-expanded-keys="defaultExpandedKeys"
                     lazy
                     highlight-current
                     ref="tree1"
                     class="tree"
                     node-key="FOLDER_NO"
                     @node-expand="nodeExpand">
            </el-tree>
        </div>
        <div class="main"
             v-loading="loading"
             :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(255,255,255,.4)">
            <div class="usersAccessible"
                 style="min-width: 400px;">{{ $t('fileTree.DISPLAY_ACCESS_AUTH_TOGGLE_BUTTON_USER_LIST') }}</div>
            <ListTable :file-tree-table-data="fileTreeTableData"
                       style="min-width: 400px;"></ListTable>
        </div>
        <FileAccessDialog ref="FileAccessDialog"
                          @fileAccess="fileAccess"></FileAccessDialog>
    </div>
</template>

<script>
import ListTable from '@p/UserManagement/PermissionManagement/tabsView/file/ListTable'
/* 弹窗 */
import FileAccessDialog from '@p/UserManagement/PermissionManagement/tabsView/dialog/FileAccessDialog'

export default {
    name: 'FileTree',
    components: {ListTable, FileAccessDialog},
    data () {
        return {
            loading: false,
            offset: 0.226,
            panelWidth: 1024,
            treeHeight: '',
            defaultProps: {
                label: 'FOLDER_NAME',
                id: 'FOLDER_NO',
                // children: 'children',
                isLeaf: 'leaf'
            }, // treeのデフォルト値
            defaultExpandedKeys: [1], // デフォルトの展開
            data: [],
            treeChildrenData: [],
            fileTreeTableData: {
                'errorCode': '',
                'S3_NO': '',
                'AUTH_LIST': [],
                'USER_LIST': []
            }, // フォルダのグループと人員データを指定します
            fileAccessDialogData: null, // 選択したのファイルデータ
            clickTimeId: Object
        }
    },
    mounted () {
        const elementResizeDetectorMaker = require('element-resize-detector') // 导入
        const that = this
        that.loading = true
        // 创建实例
        const erd = elementResizeDetectorMaker()
        that.$nextTick(() => {
            erd.listenTo(document.getElementById('fileTree'), function (element) {
                that.treeHeight = element.clientHeight - 20 + 'px'
            })
            erd.listenTo(
                document.getElementsByClassName('el-tabs__content')[0],
                function (element) {
                    that.panelWidth = element.clientWidth - 278 + 'px'
                }
            )
        })
    },
    methods: {
        fileAccess (data) {
            console.log(data.FOLDER_NO)
            this.accessAuthserAndGroup(data.FOLDER_NO)
        },
        // ポップアップボックス:権限修正(弹出框: 权限修改)
        fileAccessDialogShowEvent () {
            this.$refs.FileAccessDialog.fileAccessDialogShowEvent(
                this.fileAccessDialogData,
                this.fileTreeTableData
            )
        },
        // lazy load
        async loadNode (node, resolve) {
            this.loading = true
            if (node.level === 0) {
                await this.accessAuth('-1').then(res => {
                    if (!res) {
                        return
                    }
                    this.treeChildrenData = []
                    for (let i = 0; i < res.length; i++) {
                        res[i].LENGTH = i
                        this.treeChildrenData.push(res[i])
                    }
                    this.fileAccessDialogData = this.treeChildrenData[0]
                    this.loading = false
                })
                resolve(this.treeChildrenData)
            } else if (node.level !== 0) {
                await this.accessAuth(node.data.FOLDER_NO).then(res => {
                    this.treeChildrenData = []
                    if (res) {
                        for (let i = 0; i < res.length; i++) {
                            res[i].LENGTH = i
                            this.treeChildrenData.push(res[i])
                        }
                    }
                    this.fileAccessDialogData = node.data
                    this.accessAuthserAndGroup(node.data.FOLDER_NO)
                    this.loading = false
                })
                resolve(this.treeChildrenData)
            }
        },
        // 鼠标单击
        handleNodeClick (data) {
            // 取消上次延时未执行的方法
            clearTimeout(this.clickTimeId)
            // 执行延时
            this.clickTimeId = setTimeout(() => {
                this.fileAccessDialogData = data
                this.accessAuthserAndGroup(data.FOLDER_NO)
            }, 250)
        },
        // 鼠标双击
        handleNodeDbclick (event = {currentTarget: ''}) {
            if (event.currentTarget) {
                event.currentTarget.previousElementSibling.click()
            }
            // 取消上次延时未执行的方法
            clearTimeout(this.clickTimeId)
        },
        // 手动重新加载node数据
        // eslint-disable-next-line no-unused-vars
        nodeExpand (data, Object, Node, event) {
            // console.log(data, Object, Node, event)
            if (Object.loaded === true) {
                const node = this.$refs.tree1.getNode(data.FOLDER_NO) // 通过节点id找到对应树节点对象
                node.loaded = false
                node.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点
            }
        },
        // 获取文件夹
        accessAuth (NO) {
            this.loading = true
            return this.$request.access.AccessAuth(NO, '').then(response => {
                console.log('AccessAuth-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data, 'AccessAuthserAndGroup')
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    return response.data.result
                }
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.accessAuth(NO) : ''
                    })
                } else {
                    this.$request.requestError(`AccessAuth-get请求失败:`, err, 'AccessAuthserAndGroup')
                }
            })
        },
        // 获取指定文件夹在利用者和组里的权限信息一览
        accessAuthserAndGroup (NO) {
            if (NO >= 1) {
                this.loading = true
                this.fileTreeTableData = {
                    'errorCode': '',
                    'S3_NO': '',
                    'AUTH_LIST': [],
                    'USER_LIST': []
                }
                this.$request.access.AccessAuthserAndGroup(NO, '').then(response => {
                    console.log('AccessAuthserAndGroup-get请求成功:', response.status, response.statusText)
                    const data = this.$request.CODE(response.data, 'AccessAuthserAndGroup')
                    if (Object.prototype.toString.call(data) === '[object Object]') {
                        this.fileTreeTableData = data.result
                        for (let index = 0; index < this.fileTreeTableData.AUTH_LIST.length; index++) {
                            if (
                                this.fileTreeTableData.AUTH_LIST[index].children &&
                            this.fileTreeTableData.AUTH_LIST[index].children.length > 0
                            ) {
                                this.fileTreeTableData.AUTH_LIST[index].USERLIST = '['
                                for (let j = 0; j < this.fileTreeTableData.AUTH_LIST[index].children.length; j++) {
                                    this.fileTreeTableData.AUTH_LIST[index].USERLIST +=
                                        this.fileTreeTableData.AUTH_LIST[index].children[j].USER_NO
                                }
                                this.fileTreeTableData.AUTH_LIST[index].USERLIST += ']'
                            } else {
                                this.fileTreeTableData.AUTH_LIST[index].USERLIST = '[]'
                            }
                        }
                    }
                    this.loading = false
                    this.$emit('AccessClick')
                }).catch(err => {
                    this.loading = false
                    if (err.status === 401) {
                        this.$request.login.refreshToken().then(response => {
                            response ? this.accessAuthserAndGroup(NO) : ''
                        })
                    } else {
                        this.$request.requestError(`AccessAuthserAndGroup-get请求失败:`, err, 'AccessAuthserAndGroup')
                    }
                })
            }
        },
        // 自定义tree
        renderContent (h, {node, data}) {
            return (
                <span class='renderContent'
                    ondblclick={(event) => this.handleNodeDbclick(event)}
                    onclick={() => this.handleNodeClick(data)}>
                    <i class='childIcon'></i>
                    <span class='childLabel' >
                        {node.label}
                    </span>
                </span>
            )
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../../less/pages/UserManagement/PermissionManagement/tabsView/file/FileTree.less");
</style>
