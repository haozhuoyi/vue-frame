<template>
    <div id="groupEdit">
        <el-dialog :visible.sync="groupEditVisible"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :title="title"
                   class="eldialog"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="body">
                <div class="inputSuffix"
                     style="margin-bottom: 4px;">
                    <span class="label">{{ $t('groupEdit.DISPLAY_GROUP_EDIT_GROUP_NAME') }}</span>
                    <input ref="input"
                           v-change
                           v-model="groupName">
                </div>
                <div class="colorPicker">
                    <div class="label">{{ $t('groupEdit.DISPLAY_GROUP_EDIT_COLOR') }}</div>
                    <svg class="colorPickerSwitch"
                         @click.prevent.stop="colorPickerEvent"
                         width="30"
                         height="30"
                         xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <title>background</title>
                            <rect x="-1"
                                  y="-1"
                                  width="32"
                                  height="32"
                                  id="canvas_background"
                                  fill="none" />
                        </g>
                        <g>
                            <title>Layer 1</title>
                            <g id="组_82">
                                <g id="矩形_83"
                                   :fill="coloringColor"
                                   stroke="#666"
                                   stroke-miterlimit="10">
                                    <rect width="30"
                                          height="30"
                                          rx="2"
                                          y="0"
                                          x="0"
                                          id="svg_1" />
                                    <rect x="0.5"
                                          y="0.5"
                                          width="29"
                                          height="29"
                                          rx="1.5"
                                          fill="none"
                                          id="svg_2" />
                                </g>
                                <path id="矩形_84"
                                      d="m19,18l11,0a0,0 0 0 1 0,0l0,11a1,1 0 0 1 -1,1l-11,0a0,0 0 0 1 0,0l0,-11a1,1 0 0 1 1,-1z"
                                      fill="#666" />
                                <path id="路径_71"
                                      d="m24,27l-4,-6l8,0l-4,6z"
                                      fill="#fff" />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <button :class="['button', 'buttonHighlight', buttonDisabled ? 'disabled' : '']"
                        :disabled="buttonDisabled"
                        @click="groupEdit">
                    {{ title === $t('groupEdit.GroupTitle2') ? $t('index.DialogButton1') : $t('index.DialogButton2') }}
                </button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="toFoldersBelowClose"
                   :title="$t('common.DialogConfirmCancelTitle')"
                   :close-on-click-modal="false"
                   :before-close="applyToFoldersBelowClose"
                   :destroy-on-close="true"
                   append-to-body
                   class="groupingDialog">
            <p v-html="$t('common.DialogConfirmCancelContent')">{{ $t('common.DialogConfirmCancelContent') }}</p>
            <span slot="footer"
                  class="dialog-footer">
                <button class="button"
                        @click="applyToFoldersBelowClose">{{ $t('common.DialogConfirmCancelButton1') }}</button>
                <button class="button buttonDelete margin"
                        @click="confirm">{{ $t('common.DialogConfirmCancelButton2') }}</button>
            </span>
        </el-dialog>

        <section v-show="colorPicker"
                 id="colorDivp">
            <ul class="coloring">
                <div class="chooseColor">
                    <p>{{ $t('groupEdit.SelectedColor') }}</p>
                    <p>
                        <span :style="{'background-color':`${coloringColor}`, border: `${coloringColor? 'none':'1px solid black'}`}"></span>
                        <input class="displaysSelectedColor"
                               v-model="coloringColor">
                    </p>
                </div>
                <div class="selectedColor">
                    <p>{{ $t('groupEdit.ChooseColor') }}</p>
                </div>
                <li v-for="item in allColoringColors"
                    :key="item.no"
                    class="coloringColor"
                    @click="selectedColor(item)">
                    <p :style="{'background-color':`rgba(${item.rgbaColor})`}"></p>
                </li>
                <li class="coloringColor image">
                    <el-image :src="customColorIcon"
                              class="image-custom"
                              fit="fill"
                              @click="showColorPicker"></el-image>
                    <el-color-picker v-model="customColor"
                                     size="mini"
                                     class="picker-color"
                                     @change="colorPickerChange"
                                     ref="colorPicker"></el-color-picker>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    name: 'GroupEdit',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            groupEditVisible: false,
            toFoldersBelowClose: false,
            loading: false,
            buttonDisabled: true,
            colorPicker: false,
            department: {},
            groupName: '', // group名字
            inputColor: '',
            allColoringColors: [
                {
                    no: '1',
                    hexColor: '#ff0000',
                    rgbaColor: [255, 0, 0, 255]
                },
                {
                    no: '2',
                    hexColor: '#0000ff',
                    rgbaColor: [0, 0, 255, 255]
                },
                {
                    no: '3',
                    hexColor: '#ffff00',
                    rgbaColor: [255, 255, 0, 255]
                },
                {
                    no: '4',
                    hexColor: '#7f007f',
                    rgbaColor: [127, 0, 127, 255]
                },
                {
                    no: '5',
                    hexColor: '#00ffff',
                    rgbaColor: [0, 255, 255, 255]
                },
                {
                    no: '6',
                    hexColor: '#00ff00',
                    rgbaColor: [0, 255, 0, 255]
                },
                {
                    no: '7',
                    hexColor: '#000000',
                    rgbaColor: [0, 0, 0, 255]
                },
                {
                    no: '8',
                    hexColor: '#ffffff',
                    rgbaColor: [255, 255, 255, 255]
                }
            ],
            coloringColor: '',
            customColor: '',
            trashIcon: require('@a/images/usermanagement/coloringtrash.svg'),
            customColorIcon: require('@a/images/usermanagement/customizecolor.svg')
        }
    },
    watch: {
        groupName: {
            handler (newVlaue) {
                if (this.title === this.$t('groupEdit.GroupTitle2')) {
                    if (newVlaue !== this.department.GROUP_NAME) {
                        this.buttonDisabled = false
                    } else {
                        this.buttonDisabled = true
                    }
                } else if (this.title === this.$t('groupEdit.GroupTitle1')) {
                    if (newVlaue) {
                        this.buttonDisabled = false
                    } else {
                        this.buttonDisabled = true
                    }
                }
            },
            deep: true
        },
        inputColor: {
            handler (newVlaue) {
                if (this.title === this.$t('groupEdit.GroupTitle2')) {
                    if (newVlaue !== this.department.GROUP_COLOR) {
                        this.buttonDisabled = false
                    } else {
                        this.buttonDisabled = true
                    }
                } else if (this.title === this.$t('groupEdit.GroupTitle1')) {
                    if (newVlaue !== '#ffffff') {
                        this.buttonDisabled = false
                    } else {
                        this.buttonDisabled = true
                    }
                }
            },
            deep: true
        }
    },
    mounted () {
        this.$nextTick(() => {
            const that = this
            $('body').click(function (e) {
                const target = $(e.target)
                if (!target.is('#colorDivp  *')) {
                    that.colorPicker = false
                }
            })
        })
    },
    methods: {
        // dialogウィンドウを開く
        groupEditVisibl (department) {
            Object.assign(this.$data, this.$options.data())
            this.groupEditVisible = true
            if (department.GROUP_NO) {
                this.department = JSON.parse(JSON.stringify(department))
                this.inputColor = this.department.GROUP_COLOR
                this.coloringColor = this.department.GROUP_COLOR
            }
            setTimeout(() => {
                this.$refs.input.focus()
                this.groupName = ''
                this.groupName = this.department.GROUP_NAME
            }, 200)
            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', this.beforeunloadHandlerGroupEdit, false)
        },
        colorPickerEvent () {
            this.colorPicker = true
            $('#colorDivp').css('z-index', $('.el-dialog__wrapper.eldialog').css('z-index'))
            // console.log($('#colorDivp').css('z-index'), $('.el-dialog__wrapper.eldialog').css('z-index'))
        },
        // show ColorPicker
        showColorPicker () {
            setTimeout(console.log(this.$refs.colorPicker))
            this.$refs.colorPicker.handleTrigger()
        },
        // select ColorPicker
        colorPickerChange (data) {
            console.log(this.$refs.colorPicker, data, this.customColor)
            if (data) {
                this.inputColor = data
                this.coloringColor = data
            } else {
                this.coloringColor = this.inputColor
            }
            setTimeout(() => {
                this.customColor = ''
                this.colorPicker = false
            }, 150)
        },
        // select Color
        selectedColor (data) {
            this.customColor = ''
            this.inputColor = data.hexColor
            this.coloringColor = data.hexColor
            this.colorPicker = false
        },
        groupEdit () {
            if (this.groupName) {
                let groupName = this.groupName
                if (/[{}\\"]/gm.test(groupName)) {
                    groupName = this.$request.replaceMethod(this.groupName)
                    console.log(groupName)
                }
                this.title === this.$t('groupEdit.GroupTitle2') ? this.updateGroup(groupName) : this.addGroup(groupName)
            } else {
                this.$message.closeAll()
                this.$message.warning(this.$t('groupEdit.MESSAGE_GROUP_ADD_EDIT_VALIDATOR_UNINPUT_GROUP_NAME'))
            }
        },
        // GROUP追加
        addGroup (groupName) {
            this.loading = true
            const body = ('{"groupName": "' + groupName + '", "groupColor": "' + this.inputColor + '", "users": ""}')
            this.$request.group.addGroup(body).then(response => {
                console.log('addGroup-post请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success(this.$t('groupEdit.MESSAGE_GROUP_ADD_SUCCESS'))
                    this.groupEditVisible = false
                    Object.assign(this.$data, this.$options.data())
                    this.$emit('getGroups')
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.addGroup(groupName) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`addGroup-post请求失败:`, err, 'GroupEdit')
                }
            })
        },
        // GROUP情報更新
        updateGroup (groupName) {
            this.loading = true
            const body = ('{"groupName": "' + groupName + '", "groupColor": "' + this.inputColor + '", "users": ""}')
            this.$request.group.updateGroup(this.department.GROUP_NO, body).then(response => {
                console.log('updateGroup-put请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success(this.$t('groupEdit.MESSAGE_GROUP_EDIT_SUCCESS'))
                    this.groupEditVisible = false
                    Object.assign(this.$data, this.$options.data())
                    this.$emit('getGroups')
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.updateGroup(groupName) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`updateGroup-put请求失败:`, err, 'GroupEdit')
                }
            })
        },
        // 右上角关闭按钮的事件
        close () {
            if (this.buttonDisabled) {
                this.confirm()
            } else {
                this.toFoldersBelowClose = true
            }
        },
        applyToFoldersBelowClose () {
            this.toFoldersBelowClose = false
        },
        confirm () {
            this.toFoldersBelowClose = false
            this.groupEditVisible = false
            Object.assign(this.$data, this.$options.data())
            window.removeEventListener('beforeunload', this.beforeunloadHandlerGroupEdit, false)
        },
        // 浏览器刷新事件
        beforeunloadHandlerGroupEdit (e) {
            const beforeunload = !this.buttonDisabled
            if (beforeunload) {
                e = e || window.event
                if (e) e.returnValue = '关闭提示'
                return beforeunload
            }
            return
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../less/pages/UserManagement/GroupManagement/components/GroupEdit.less");
</style>
