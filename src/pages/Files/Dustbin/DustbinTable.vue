<template>
    <div id="dustbinlisttable"
         v-loading="loading"
         :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(255,255,255,.4)">
        <v-contextmenu auto-placement
                       ref="deleteContextmenu"
                       class="deleteContextmenu"
                       :theme="theme">
            <v-contextmenu-item @click="handleClick">{{ $t('dustbinTable.DISPLAY_FILE_INFO_TRASH_TREE_RIGHT_CLICK_MENU_SELECT_RESTORE') }}</v-contextmenu-item>
            <v-contextmenu-item @click="handleClick">{{ $t('dustbinTable.DISPLAY_FILE_INFO_TRASH_TREE_RIGHT_CLICK_MENU_SELECT_DELETE') }}</v-contextmenu-item>
        </v-contextmenu>

        <ul>
            <li class="liHead border sort"
                @click="sort('FILE_NAME')">{{ $t('dustbinTable.DISPLAY_FILE_INFO_TRASH_NAME') }}</li>
            <li class="liHead time border sort"
                @click="sort('DUMP_DATE_TIME')">{{ $t('dustbinTable.DISPLAY_FILE_INFO_TRASH_DUMP_DATETIME') }}</li>
            <li class="liHead expurgator border">{{ $t('dustbinTable.DISPLAY_FILE_INFO_TRASH_DUMP_PERSON') }}</li>
            <li class="liHead restitution border">{{ $t('dustbinTable.DISPLAY_FILE_INFO_TRASH_RIGHT_CLICK_MENU_RESTORE') }}</li>
            <li class="liHead del border">{{ $t('dustbinTable.DISPLAY_FILE_INFO_TRASH_RIGHT_CLICK_MENU_DELETE') }}</li>
        </ul>
        <ul class="ulBody">
            <li v-for="(itme,index) in selectTableDataOriginal"
                :key="index"
                :style="{width: width}"
                :class="[`ulListtable${index}`, 'deleteContextmenu']"
                @click.exact="templateSelection(index, itme)"
                @click.ctrl="ctrlClickEvent(index, itme, $event)"
                @click.meta="ctrlClickEvent(index, itme, $event)"
                @click.shift="shiftClickEvent(index)"
                @contextmenu.prevent="contextmenu(index, itme, $event)">
                <ul>
                    <li class="liHead li">
                        <div class="icon">
                            <img v-if="itme.TYPE === 'PDF'"
                                 :src="require('@a/images/table/file-pdf-09.svg')" />
                            <img v-else-if="itme.TYPE === 'DIR'"
                                 :src="require('@a/images/file/file-tree-icon-12.svg')" />
                            <img v-else-if="itme.TYPE === 'XLSX'"
                                 :src="require('@a/images/file/file-xls.svg')" />
                            <img v-else-if="'SVG,JPG,PNG,GIF,JPEG'.indexOf(itme.TYPE) !== -1"
                                 :src="require('@a/images/file/file-img.svg')" />
                            <img v-else
                                 :src="require('@a/images/file/file-txt.svg')" />
                        </div>
                        <span :title="itme.FILE_NAME"
                              style="width: calc(100% - 50px)">{{ itme.FILE_NAME }}</span>
                    </li>
                    <div class="interval"></div>
                    <li class="liHead time li">
                        <span>{{ itme.DUMP_DATE_TIME }}</span>
                    </li>
                    <div class="interval"></div>
                    <li class="liHead expurgator li">
                        <span :title="itme.NAME">{{ itme.NAME }}</span>
                    </li>
                    <div class="interval"></div>
                    <li class="liHead restitution li">
                        <img :src="require('@a/images/table/table-resume.svg')"
                             @click.prevent.stop="resumeShow(itme.NO)" />
                    </li>
                    <div class="interval"></div>
                    <li class="liHead del li">
                        <img :src="require('@a/images/table/table-del.svg')"
                             @click.prevent.stop="deleteShow(itme.NO)" />
                    </li>
                </ul>
            </li>
        </ul>

        <el-dialog :visible.sync="deleteDialogVisible"
                   :title="$t('dustbinTable.DISPLAY_FILE_INFO_POPUP_TITLE_DELETE')"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   append-to-body>
            {{ $t('dustbinTable.MESSAGE_ASK_FILE_INFO_DELETE_FILE_ONE') }}<br /><br />
            {{ $t('dustbinTable.MESSAGE_ASK_FILE_INFO_DELETE_FILE_TWO') }}<br />
            {{ $t('dustbinTable.MESSAGE_ASK_FILE_INFO_DELETE_FILE_THREE') }}<br /><br />
            <p style="color: ##D61918;font-size: 12px;">{{ $t('dustbinTable.MESSAGE_ASK_FILE_INFO_DELETE_FILE_RED') }}</p>
            <span slot="footer"
                  class="dialog-footer">
                <button class="button"
                        @click="close">{{ $t('dustbinTable.DISPLAY_FILE_INFO_DELETE_FILE_BUTTON_CENCEL') }}</button>
                <button class="button buttonHighlight margin"
                        @click="del(no)">{{ $t('dustbinTable.DISPLAY_FILE_INFO_DELETE_FILE_BUTTON_CONFIRM') }}</button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="resumeDialogVisible"
                   :title="$t('dustbinTable.DISPLAY_FILE_INFO_POPUP_TITLE_RESTORE')"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   append-to-body>
            {{ $t('dustbinTable.MESSAGE_ASK_FILE_INFO_RESTORE_TRASH') }}<br /><br />
            <!-- <el-checkbox v-model="fileSaveFlg">同名のファイルを両方残す</el-checkbox><br />
            <el-checkbox v-model="folderMergeFlg">同名のフォルダ統合する</el-checkbox> -->

            <div class="dustbinlistTablebuttonSelect">
                <ul>
                    <li>
                        <label for="searchObjectFolder">
                            <input type="checkbox"
                                   id="searchObjectFolder"
                                   name="checkboxSearchObject"
                                   value="02">
                            <div class="checkContainer"></div>
                            <span>{{ $t('dustbinTable.DISPLAY_FILE_INFO_POPUP_CHECK_FILE_LEAVE_BOTH') }}</span>
                        </label>
                    </li>
                    <li>
                        <label for="searchObjectFile">
                            <input type="checkbox"
                                   id="searchObjectFile"
                                   name="checkboxSearchObject"
                                   value="03">
                            <div class="checkContainer"></div>
                            <span>{{ $t('dustbinTable.DISPLAY_FILE_INFO_POPUP_CHECK_FOLDER_MERGE') }}</span>
                        </label>
                    </li>
                </ul>
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <button class="button"
                        @click="close">{{ $t('dustbinTable.DISPLAY_FILE_INFO_DELETE_FILE_BUTTON_CENCEL') }}</button>
                <button class="button buttonHighlight margin"
                        @click="resume(no)">{{ $t('dustbinTable.DISPLAY_FILE_INFO_TRASH_RIGHT_CLICK_MENU_RESTORE') }}</button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import bus from '@c/bus.js'
import $ from 'jquery'
// eslint-disable-next-line no-unused-vars
import {natsort} from '@u/natsort-1.2.4.js'

export default {
    name: 'Dustbinlisttable',
    props: {
        selectTableData: { // 表格数据
            type: Array,
            default: () => {
                return []
            }
        },
        relevantData: { // 表头-関連データ 是否显示
            type: Boolean,
            default: false
        },
        theme: {
            type: String,
            default: 'default'
        }
    },
    data () {
        return {
            loading: false,
            deleteDialogVisible: false,
            resumeDialogVisible: false,
            width: '',
            name: '', // ソートの方式
            selectTableDataOriginal: [], // 元のデータ
            row: {index: 0},
            fileSaveFlg: true, // 同名のファイルを両方残す
            folderMergeFlg: true, // 同名のフォルダ統合する
            multiSelectData: []
        }
    },
    watch: {
        selectTableData: {
            handler (val/* , oldval */) {
                this.selectTableDataOriginal = JSON.parse(JSON.stringify(val))
                this.name = ''
                this.sort('FILE_NAME')
            },
            immediate: true
        }
    },
    mounted () {
        const that = this
        const elementResizeDetectorMaker = require('element-resize-detector')// 导入
        // 创建实例
        const erd = elementResizeDetectorMaker()
        that.$nextTick(() => {
            erd.listenTo(document.getElementById('dustbinlisttable'), function (element) {
                that.width = element.offsetWidth - 4 + 'px'
            })
        })
        bus.$on('boundingClientRect', () => {
            this.clearSelect()
        })
    },
    methods: {
        contextmenu (index, item, event) {
            if (this.multiSelectData.length <= 1) {
                this.templateSelection(index, item)
            }
            let X = event.pageX
            let Y = event.pageY
            if (document.body.clientHeight - Y <= 164) {
                Y = document.body.clientHeight - 164
            }
            if (document.body.clientWidth - X <= 82) {
                X = document.body.clientWidth - 82
            }
            const postition = {
                top: Y,
                left: X
            }

            this.$refs.deleteContextmenu.show(postition)
        },
        // contextmenu click
        handleClick (vm) {
            const no = []
            const name = vm.$slots.default[0].text
            this.multiSelectData.forEach(element => {
                no.push(element.NO)
            })
            if (name === '選択項目を削除' || name === '删除选中项' || name === 'Delete selection') {
                this.deleteShow(no)
            } else {
                this.resumeShow(no)
            }
        },
        // click
        templateSelection (index, item) {
            this.clearSelect()
            this.row = JSON.parse(JSON.stringify(item))
            this.row.index = index
            this.multiSelectData.push(item)
            $(`.ulListtable${index}`).addClass('checked')
        },
        // ctrl + click
        ctrlClickEvent (index, item, event) {
            if (
                event.currentTarget.classList.length >= 2 &&
                event.currentTarget.className.indexOf('checked') !== -1
            ) {
                $(`.ulListtable${index}`).removeClass('checked')
                const multiSelectData = this.multiSelectData.filter(d => {
                    return item !== d
                })
                this.multiSelectData = multiSelectData
            } else {
                this.row = JSON.parse(JSON.stringify(item))
                this.row.index = index
                this.multiSelectData.push(item)
                $(`.ulListtable${index}`).addClass('checked')
            }
        },
        // shift + click
        shiftClickEvent (index) {
            console.log(this.row)
            this.clearSelect()
            const authList = this.selectTableDataOriginal
            if (index < this.row.index) {
                for (let i = index; i <= this.row.index; i++) {
                    $(`.ulListtable${i}`).addClass('checked')
                    this.multiSelectData.push(authList[i])
                }
            } else if (index > this.row.index) {
                for (let i = index; i >= this.row.index; i--) {
                    $(`.ulListtable${i}`).addClass('checked')
                    this.multiSelectData.push(authList[i])
                }
            } else {
                $(`.ulListtable${index}`).addClass('checked')
                this.multiSelectData.push(authList[index])
                return
            }
            console.log(this.multiSelectData)
        },
        // clearSelect
        clearSelect () {
            this.multiSelectData = []
            $(`.checked`).removeClass('checked')
        },
        // sort (name) {
        //     if (this.name && this.name === name) {
        //         this.selectTableDataOriginal.reverse()
        //     } else {
        //         if (name === 'DUMP_DATE_TIME') {
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
            if (this.name && this.name === name) {
                this.selectTableDataOriginal.reverse()
            } else {
                const selectTableDataOriginal = natsort(this.selectTableDataOriginal, convert)
                this.selectTableDataOriginal = Object.assign([], this.selectTableDataOriginal, selectTableDataOriginal)
            }
            this.name = name
            function convert (value) { // 配列の要素を受け取る
                return value[name] // 要素値となる配列オブジェクトの "1" プロパティを比較する
            }
        },
        // 显示 deleteShow
        deleteShow (no) {
            this.clearSelect()
            this.no = no
            this.deleteDialogVisible = true
        },
        // 显示 resumeShow
        resumeShow (no) {
            this.clearSelect()
            this.no = no
            this.resumeDialogVisible = true
        },
        // close
        close () {
            this.resumeDialogVisible = false
            this.deleteDialogVisible = false
        },
        // resume
        resume (no) {
            const searchObject = document.getElementsByName('checkboxSearchObject')
            const checked = []
            for (let i = 0; i < searchObject.length; i++) {
                checked.push(searchObject[i].checked)
            }
            this.close()
            this.loading = true
            const body = (`{"fileSaveFlg": "${checked[0] ? 'TRUE' : 'FALSE'}","folderMergeFlg": "${checked[1] ? 'TRUE' : 'FALSE'}"}`)
            this.$request.dustbin.TrashReduction(no, body).then(response => {
                console.log('TrashReduction-patch请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$emit('refresh')
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.resume(no) : ''
                    })
                } else {
                    this.$request.requestError(`TrashReduction-patch请求成功:`, err, 'DustbinTable')
                }
            })
        },
        // delete
        del (no) {
            console.log(no)
            this.close()
            this.loading = true
            this.$request.dustbin.TrashDel(no, '').then(response => {
                console.log('TrashDel-delete请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    // this.$message.success('操作に成功する')
                    this.$emit('refresh')
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.del(no) : ''
                    })
                } else {
                    this.$request.requestError(`TrashDel-delete请求成功:`, err, 'DustbinTable')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../less/pages/Files/Dustbin/DustbinTable.less");
</style>
