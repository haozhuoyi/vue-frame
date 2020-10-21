<template>
    <div id="projectlist"
         v-loading="loading"
         :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(255,255,255,.4)">
        <el-dialog :visible.sync="dialogVisible"
                   :title="$t('projectSelection.DISPLAY_PROJECT_ADD_DEL_TILTE')"
                   :close-on-click-modal="false"
                   :before-close="dialogClose"
                   class="elementuiDialog">
            <div class="appendProject">
                <button class="button buttonHighlight"
                        @click="clickButtonCommon">{{ $t('projectSelection.DISPLAY_PROJECT_ADD_DEL_ADD_BUTTON_ADD') }}</button>
            </div>
            <div class="projectList">
                <draggable v-model="projects"
                           v-bind="dragOptions"
                           @chang="change"
                           @start="start"
                           @end="end"
                           :move="move">
                    <div class="drag"
                         v-for="item in projects"
                         :key="item.NO"
                         @click="hoverClick($event)"
                         @dblclick="selectItem(item)">
                        <p :title="item.projectName"
                           style="font-size: 1rem;width: 300px;display: inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ item.projectName }}</p>
                        <div class="operationIcon">
                            <svg @click.prevent.stop="delProject(item)"
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="24"
                                 height="24"
                                 viewBox="0 0 20 20"
                                 style="margin: 5px 0;">
                                <g id="矩形_138"
                                   data-name="矩形 138"
                                   fill="#fff"
                                   stroke="#32465a"
                                   stroke-miterlimit="10"
                                   stroke-width="1">
                                    <rect width="20"
                                          height="20"
                                          rx="2"
                                          stroke="none" />
                                    <rect x="0.5"
                                          y="0.5"
                                          width="19"
                                          height="19"
                                          rx="1.5"
                                          fill="none" />
                                </g>
                                <g id="组_116"
                                   data-name="组 116"
                                   transform="translate(-3056 -136)">
                                    <g id="组_115"
                                       data-name="组 115">
                                        <path id="路径_40"
                                              data-name="路径 40"
                                              d="M3069.692,142.308v-1.693a.769.769,0,0,0-.769-.769h-5.846a.769.769,0,0,0-.769.769v1.693h-1.846a.615.615,0,0,0-.616.615h0a.615.615,0,0,0,.616.615h1.23v8a.616.616,0,0,0,.616.616h7.384a.616.616,0,0,0,.616-.616v-8h1.23a.615.615,0,0,0,.616-.615h0a.615.615,0,0,0-.616-.615Z"
                                              fill="#d61918"
                                              fill-rule="evenodd" />
                                        <rect id="矩形_139"
                                              data-name="矩形 139"
                                              width="4.923"
                                              height="1.231"
                                              transform="translate(3063.539 141.077)"
                                              fill="#d61918" />
                                        <rect id="矩形_140"
                                              data-name="矩形 140"
                                              width="1.231"
                                              height="5.692"
                                              transform="translate(3066.615 144.769)"
                                              fill="#d61918" />
                                        <rect id="矩形_141"
                                              data-name="矩形 141"
                                              width="1.231"
                                              height="5.692"
                                              transform="translate(3064.154 144.769)"
                                              fill="#d61918" />
                                    </g>
                                </g>
                                <path id="路径_41"
                                      data-name="路径 41"
                                      d="M3061.692,143.538v7.847a.77.77,0,0,0,.77.769h7.076a.77.77,0,0,0,.77-.769v-7.847Z"
                                      transform="translate(-3056 -136)"
                                      fill="#d61918"
                                      fill-rule="evenodd" />
                            </svg>
                            <svg class="dragIcon"
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="22"
                                 height="21"
                                 viewBox="0 0 18 17">
                                <g id="组_121"
                                   data-name="组 121"
                                   transform="translate(-3084 -137.5)">
                                    <rect id="矩形_144"
                                          data-name="矩形 144"
                                          width="18"
                                          height="3"
                                          transform="translate(3084 137.5)"
                                          fill="#32465a" />
                                    <rect id="矩形_145"
                                          data-name="矩形 145"
                                          width="18"
                                          height="3"
                                          transform="translate(3084 144.5)"
                                          fill="#32465a" />
                                    <rect id="矩形_146"
                                          data-name="矩形 146"
                                          width="18"
                                          height="3"
                                          transform="translate(3084 151.5)"
                                          fill="#32465a" />
                                </g>
                            </svg>
                        </div>
                    </div>
                </draggable>
            </div>
            <!-- 追加项目 -->
            <el-dialog :visible.sync="addDialogVisible"
                       :title="$t('projectSelection.DISPLAY_PROJECT_ADD_TITLE')"
                       :close-on-click-modal="false"
                       :before-close="addDialogClose"
                       append-to-body
                       class="append">
                <div class="appendProject">
                    <el-form ref="delp"
                             label-width="146px"
                             label-position="right"
                             :model="formLabelAlign"
                             class="appendProjectForm">
                        <el-form-item :label="$t('projectSelection.DISPLAY_PROJECT_ADD_PROJECT_KEY')">
                            <el-input ref="input"
                                      size="small"
                                      @input="e => input = validForbid(e)"
                                      v-model="formLabelAlign.projectKey"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('projectSelection.DISPLAY_PROJECT_ADD_LOGIN_ID')">
                            <el-input size="small"
                                      @input="e => formLabelAlign.username = validForbid(e)"
                                      v-model="formLabelAlign.username"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('projectSelection.DISPLAY_PROJECT_ADD_PASSWORD')">
                            <el-input size="small"
                                      show-password
                                      @input="e => formLabelAlign.password = validForbid(e)"
                                      v-model="formLabelAlign.password"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer"
                      class="dialog-footer">
                    <button class="button buttonHighlight"
                            @click="submitFormlog">
                        <i v-if="addLoading"
                           class="el-icon-loading"></i>{{ $t('projectSelection.DISPLAY_PROJECT_ADD_BUTTON_ADD') }}
                    </button>
                </span>
            </el-dialog>
        </el-dialog>

        <!-- 项目删除 -->
        <delProject ref="delProject"
                    @deleteproject="deleteProject"></delProject>
    </div>
</template>

<script>
/* eslint-disable camelcase */
// import bus from '@c/bus.js'
import $ from 'jquery'
import draggable from 'vuedraggable'

export default {
    name: 'Projectlist',
    components: {
        draggable,
        delProject: resolve => require(['./DelProject.vue'], resolve)
    },
    data () {
        return {
            dialogVisible: false,
            addDialogVisible: false,
            loading: false,
            addLoading: false,
            projects: [],
            formLabelAlign: {
                projectKey: 'n4alcjqpbr',
                username: '',
                password: ''
            },
            disabled: false,
            dragProject: {}, // 移动的项目
            deleteproject: {}
        }
    },
    computed: {
        dragOptions () {
            return {
                animation: 150,
                group: 'projectList',
                handle: '.dragIcon',
                ghostClass: 'ghost',
                disabled: this.disabled
            }
        }
    },
    methods: {
        project () {
            this.dialogVisible = true
            this.dragProject = {}
            this.projects = this.$store.getters.getProjectSettings || []
            console.log(this.projects, this.projects.length <= 1, this.disabled)
            this.disabled = this.projects ? this.projects.length <= 1 : this.disabled
        },
        clickButtonCommon () {
            this.addDialogVisible = true
            this.formLabelAlign = {projectKey: '', username: '', password: ''}
            setTimeout(() => { this.$refs.input.focus() }, 200)
        },
        async submitFormlog () {
            if (this.formLabelAlign.projectKey) {
                if (this.formLabelAlign.username) {
                    if (this.formLabelAlign.password) {
                        this.addLoading = true // 开启loading动画
                        const body = ('{' +
                            '"ProjectKey":"' + this.formLabelAlign.projectKey + '",' +
                            '"UserID":"' + this.formLabelAlign.username + '",' +
                            '"Password":"' + this.formLabelAlign.password +
                        '"}')
                        this.$request.projectlist.appendProjects({Body: body}).then(response => {
                            console.log('appendProject-post请求成功:', response.status, response.statusText)
                            const data = this.$request.CODE(response.data)
                            if (data && data.result) {
                                let unique = false
                                console.log(this.projects)
                                if (this.projects.length > 0) {
                                    for (let index = this.projects.length - 1; index >= 0; index--) {
                                        if (data.result.projectKey === this.projects[index].projectKey) {
                                            unique = true
                                        }
                                    }
                                }
                                if (!unique) {
                                    this.projects.push({
                                        contractKey: data.result.contractKey,
                                        projectKey: data.result.projectKey,
                                        projectName: data.result.projectName,
                                        specialProjectFlag: data.result.specialProjectFlag,
                                        check: false
                                    })
                                    this.$message.success(this.$t('projectSelection.MESSAGE_PROJECT_ADD_VALIDATOR_SUCCESS'))
                                }

                                this.$store.dispatch('setProjectSettings', this.projects)
                                this.disabled = this.projects ? this.projects.length <= 1 : this.disabled
                                this.addDialogVisible = false
                            }
                            this.addLoading = false
                        }).catch(err => {
                            this.addLoading = false
                            if (err.status === 401) {
                                this.$request.login.refreshToken().then(response => {
                                    response ? this.submitFormlog() : ''
                                })
                            } else {
                                if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                                    this.addDialogVisible = false
                                }
                                this.$request.requestError(`appendProjects-patch请求:`, err, 'ProjectsSelection')
                            }
                        })
                    } else {
                        this.$message.warning(this.$t('projectSelection.MESSAGE_VALIDATOR_UNINPUT_PASSWORD'))
                    }
                } else {
                    this.$message.warning(this.$t('projectSelection.MESSAGE_VALIDATOR_UNINPUT_LOGINID'))
                }
            } else {
                this.$message.warning(this.$t('projectSelection.MESSAGE_PROJECT_ADD_VALIDATOR_UNINPUT_PROJECT_KEY_ERROR'))
            }
        },
        delProject (item) {
            this.$refs.delProject.delProject(item)
        },
        deleteProject (item) {
            const projects = this.projects.filter(data => {
                return data.projectKey !== item.projectKey
            })
            this.$store.dispatch('setProjectSettings', projects)
            this.$emit('dragCallback', this.$store.getters.getProjectSettings || [])
            this.projects = this.$store.getters.getProjectSettings || []
        },
        dragCallback () {
            this.$store.dispatch('setProjectSettings', this.projects)
            this.$emit('dragCallback', this.$store.getters.getProjectSettings || [])
        },
        hoverClick (event) {
            $('.drag').removeClass('hoverClick')
            $(event.currentTarget).addClass('hoverClick')
        },
        selectItem (item) {
            this.dialogVisible = false
            item.check = true
            this.$emit('selectItem', item, this.projects)
        },
        change (event) {
            console.log('change', event)
        },
        /**
         *  start 和 end
            以上函数对象(event)的属性：
                to: 移动到的列表的容器
                from：来源列表容器
                item: 被移动的单元
                clone: 副本的单元
                oldIndex：移动前的序号
                newIndex：移动后的序号
        */
        /**
         * start 和 end
         * 以上の関数オブジェクト(event)の属性:
         *      to: 移動したリストのコンテナ
         *      from：ソースリスト用コンテナ
         *      item: 移動されるユニット
         *      clone: コピーの単位
         *      oldIndex：移動前の番号
         *      newIndex：移動後の番号
         *
        */
        start (event) {
            console.log('start', event)
            console.log('start', event.to, event.from, event.item, event.clone, event.oldIndex, event.newIndex)
        },
        end (event) {
            console.log('end', event.to, event.from, event.item, event.clone, event.oldIndex, event.newIndex, this.projects)
            // 呼び出しを終了するメソッドをドラッグする
            this.dragCallback()
        },
        /**
            move: function,默认值:null
            就是拖拽项时调用的函数
            用来确定拖拽是否生效
            返回null时可以生效
            可以通过函数判断
            有一个参数:evt
                evt为object
                    draggedContext: 被拖拽元素的上下文
                        index:拖拽元素的指针
                        element: 拖拽数据本身
                        futureIndex: 拖动后的index
                    relatedContext: 拖入区域的上下文
                        index: 目标元素的index
                        element:目标数据本身
                        list: 拖入的列表
                        component:目标组件
        */
        /**
         *
         * move: function,デフォルト値:null
         *    ドラッグしたときに呼び出す関数です。
         *    ドラッグが有効かどうかを確認するために使用します。
         *    nullに戻ると有効です。
         *    関数で判断できます。
         *
         *    パラメータがあります:evt
         *          evtはobjectである
         *              draggedContext: 要素のコンテキストをドラッグします
         *                  index:要素をドラッグするポインタ
         *                  element: データ自体をドラッグします
         *                  futureIndex: ドラッグ後のindex
         *              relatedContext: 範囲のコンテキストにドラッグします
         *                  index:ターゲット要素のindex
         *                  element: ターゲットデータ自体
         *                  list: ドラッグしたリスト
         *                  component:ターゲットコンポーネント
         *
         */
        move (event) {
            console.log(event.draggedContext.index)
            console.log(event.draggedContext.element)
            console.log(event.draggedContext.futureIndex)
            console.log(event.relatedContext.index)
            console.log(event.relatedContext.element)
            console.log(event.relatedContext.list)
            console.log(event.relatedContext.component)
            this.dragProject = event.draggedContext.element
        },
        dialogClose () {
            this.dialogVisible = false
            this.$emit('dragCallback', this.$store.getters.getProjectSettings || [])
        },
        addDialogClose () {
            if (this.loading) {
                this.$confirm('リクエストデータでは,クローズを確認する？')
                    .then(() => {
                        this.addDialogVisible = false
                    })
                    .catch(() => {})
            } else {
                this.addDialogVisible = false

            }
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/views/project/ProjectSelection.less");
</style>
