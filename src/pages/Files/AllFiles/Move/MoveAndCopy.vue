<template>
    <div id="MoveAndCopy">
        <el-dialog :title="$t('moveAndCopy.DISPLAY_FILE_INFO_MOVE_COPY_TITLE')"
                   :visible.sync="dialogVisible"
                   :close-on-click-modal="false"
                   :before-close="close"
                   ref="moveAndCopyDialog"
                   class="moveAndCopyDialog"
                   @open="open"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="title">
                <div class="headerTitle">{{ $t('moveAndCopy.DISPLAY_FILE_INFO_MOVE_COPY_SELECT_TITLE') }}（{{ filesSelected.length }}{{ $t('moveAndCopy.DISPLAY_FILE_INFO_MOVE_COPY_SELECT_FILE') }}）</div>
                <div class="input">
                    <el-input size="small"
                              v-model="input"
                              :placeholder="$t('moveAndCopy.DISPLAY_FILE_INFO_MOVE_COPY_BUTTON_SEARCH')"
                              @input="e => input = validForbid(e)"
                              @keyup.enter.native="getTreeData">
                        <img slot="prefix"
                             :src="inputicon">
                    </el-input>
                </div>
            </div>
            <div class="treeScroll">
                <div class="treeContainer">
                    <el-tree :indent="0"
                             :data="treeData"
                             :load="loadNode"
                             :props="defaultProps"
                             :highlight-current="true"
                             :default-expanded-keys="[1]"
                             @node-click="handleNodeClick"
                             lazy
                             node-key="NO"
                             :expand-on-click-node="false"
                             :render-content="renderContent"
                             :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                             element-loading-spinner="el-icon-loading"
                             element-loading-background="rgba(255,255,255,.4)"
                             class="tree">
                    </el-tree>
                </div>
            </div>
            <div slot="footer"
                 class="dialog-footer">
                <div class="footRadio">
                    <div class="footTitle">{{ $t('moveAndCopy.DISPLAY_FILE_INFO_MOVE_COPY_CONTAIN_NOTES_AND_PHOTOS') }}</div>
                    <el-form ref="form"
                             :model="ruleForm"
                             label-position="right"
                             label-width="120px"
                             class="form">
                        <div class="radio-group">
                            <el-radio-group v-model="ruleForm.radio">
                                <el-radio-button label="TRUE">{{ $t('moveAndCopy.DISPLAY_FILE_INFO_MOVE_COPY_CONTAIN_NOTES_AND_PHOTOS_YES') }}</el-radio-button>
                                <el-radio-button label="FALSE">{{ $t('moveAndCopy.DISPLAY_FILE_INFO_MOVE_COPY_CONTAIN_NOTES_AND_PHOTOS_NO') }}</el-radio-button>
                            </el-radio-group>
                        </div>
                    </el-form>
                </div>
                <div class="footBtn">
                    <button class="button"
                            @click="move('FALSE')">{{ $t('moveAndCopy.DISPLAY_FILE_INFO_MOVE_COPY_BUTTON_MOVE') }}</button>
                    <button class="button buttonHighlight  copy"
                            @click="move('TRUE')">{{ $t('moveAndCopy.DISPLAY_FILE_INFO_MOVE_COPY_BUTTON_COPY') }}</button>
                </div>

            </div>
        </el-dialog>

    </div>
</template>

<script>
import bus from '@c/bus'
import store from '@p/Files/store'
import Crypto from '@u/crypto'

export default {
    name: 'MoveAndCopy',
    data () {
        return {
            filesSelected: [], // 选中文件列表
            filesParentNo: '', // 选中文件的父文件夹
            dialogVisible: false,
            disabled: false,
            loading: false,
            treeData: [],
            resolve: '',
            defaultProps: {label: 'FILE_NAME', id: 'NO', /* children: 'children', */ isLeaf: 'leaf'}, // tree树的默认值
            inputicon: require('@a/images/file/file-input-select1.svg'),
            input: '', // 检索字段
            treeChildrenData: [], // tree树的子级数据
            ruleForm: {
                radio: 'TRUE'
            },
            no: 0
        }
    },
    destroyed () {
        window.removeEventListener('beforeunload', e => this.beforeunloadHandlerMoveAndCopy(e))
    },
    methods: {
        /* 监听浏览器刷新事件 */
        beforeunloadHandlerMoveAndCopy (e) {
            const beforeunload = Boolean(this.input) || parseInt(this.no) !== 0
            console.log(`Move`, beforeunload, this.input, parseInt(this.no))
            if (beforeunload) {
                e = e || window.event
                if (e) {
                    e.returnValue = '关闭提示'
                }
                return beforeunload
            }
            return
        },
        open () {
            this.$refs.moveAndCopyDialog.$el.children[0].classList.add('largeDialog')
        },
        moveAndCopy (dialogFlg, NO, parentNo) {
            this.dialogVisible = dialogFlg
            this.defaultExpandedKeys = []
            this.filesSelected = NO instanceof Array ? NO : [NO]
            this.filesParentNo = parentNo === '-1' ? 1 : parentNo
            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', e => this.beforeunloadHandlerMoveAndCopy(e))
        },
        // 懒加载
        async loadNode (node, resolve) {
            this.resolve = resolve
            if (node.level === 0) {
                this.getFolder('-1').then(res => {
                    this.treeChildrenData = []
                    if (!res) {
                        return
                    }
                    for (let i = 0; i < res.length; i++) {
                        res[i].LENGTH = i
                        if (res[i].TYPE === 'DIR' || res[i].TYPE === 'ROOT') {
                            this.treeChildrenData.push(res[i])
                        }
                    }
                    resolve(this.treeChildrenData)
                })
            } else {
                this.getFolder(node.data.NO).then(res => {
                    this.treeChildrenData = []
                    if (!res) {
                        return
                    }
                    for (let i = 0; i < res.length; i++) {
                        res[i].LENGTH = i
                        if (res[i].TYPE === 'DIR' || res[i].TYPE === 'ROOT') {
                            this.treeChildrenData.push(res[i])
                        }
                    }
                    resolve(this.treeChildrenData)
                })
            }
        },
        // 选中事件
        handleNodeClick (data) {
            this.no = data.NO
        },
        getTreeData () {
            this.treeChildrenData = []
            if (this.input === '') {
                this.getFolder('-1').then(res => {
                    this.treeChildrenData = []
                    if (!res) {
                        return
                    }
                    for (let i = 0; i < res.length; i++) {
                        res[i].LENGTH = i
                        if (res[i].TYPE === 'DIR' || res[i].TYPE === 'ROOT') {
                            this.treeChildrenData.push(res[i])
                        }
                    }
                    this.treeData = this.treeChildrenData
                })
            } else {
                this.getFile(this.input).then(res => {
                    if (!res) {
                        return
                    }
                    this.treeChildrenData = []
                    for (let i = 0; i < res.length; i++) {
                        res[i].LENGTH = i
                        if (res[i].TYPE === 'DIR' || res[i].TYPE === 'ROOT') {
                            this.treeChildrenData.push(res[i])
                        }
                    }
                    this.treeData = this.treeChildrenData
                })
            }
        },
        // 文件检索
        getFile (inp) {
            this.loading = true
            const body = (`{"Query": "${inp}"}`)
            return this.$request.folder.MoveAndCopyFuzzyQuery(body).then(response => {
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    if (data.result.length > 0) {
                        this.loading = false
                        return response.data.result
                    } else {
                        this.$message.success(this.$t('moveAndCopy.MESSAGE_FILE_INFO_MOVE_COPY_FILE_NO_DATA'))
                    }
                }
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getFile(inp) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.close()
                    }
                    this.$request.requestError('MoveAndCopyFuzzyQuery-get请求失败', err, 'MoveAndCopy')
                }
            })
        },
        // 获取文件&&文件夹
        getFolder (NO) {
            this.loading = true
            const body = ('{"NeedPointCNT": "true", "NeedDirectContentCNT": "true", "NeedQRInfo": "true"}')
            return this.$request.folder.getFolders(NO, body).then(response => {
                console.log('getFolders-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    // 关闭加载动画
                    this.loading = false
                    return response.data.result
                }
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getFolder(NO) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.close()
                    }
                    this.$request.requestError('getFolders-get请求失败', err, 'MoveAndCopy')
                }
            })
        },
        // 移动
        move (event) {
            this.loading = true
            const body = '{' +
                        '"Parent": "' + this.filesParentNo + '",' +
                         '"From": "' + this.filesSelected.toString() + '",' +
                         '"NeedMemo": "' + this.ruleForm.radio + '",' +
                         '"IsCopy": "' + event + '",' +
                         '"MakeDwgPdfFlag": "TRUE",' +
                         '"RebColor": "color"}'
            this.$request.folder.Move(this.no, body).then(response => {
                console.log('FileMove-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.close()
                    this.$message.success(this.$t('moveAndCopy.MESSAGE_FILE_INFO_MOVE_COPY_FILE_MOVE_SUCCESS'))
                    if (Crypto.decrypt(store.state.viewtype) === 'thumbnail') {
                        bus.$emit('allfiles', '-1')
                    } else {
                        bus.$emit('treetablemove', '-1')
                    }
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.move(event) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.close()
                    }
                    this.$request.requestError('FileMove-get请求失败', err, 'MoveAndCopy')
                }
            })
        },
        // eslint-disable-next-line no-unused-vars
        renderContent (h, {node, data, store}) {
            return (
                <span class='renderContent'>
                    <i class='childIcon'></i>
                    <span class='childLabel'>{node.label}</span>
                </span>
            )
        },
        close () {
            this.dialogVisible = false
            window.removeEventListener('beforeunload', e => this.beforeunloadHandlerMoveAndCopy(e))
        }
    }
}
</script>
<style lang="less" scoped>
@import url("../../../../less/pages/Files/AllFiles/Move/MoveAndCopy.less");
</style>
