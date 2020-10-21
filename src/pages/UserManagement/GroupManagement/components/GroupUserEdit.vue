<template>
    <div id="groupUserEdit">
        <el-dialog :visible.sync="groupUserEditDialogVisible"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :title="$t('groupUserEdit.DISPLAY_GROUP_EDIT_PARTICIPANTS_TITLE')"
                   class="groupUserEditDialog"
                   ref="groupUserEditDialog"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <p class="title"
               :title="localDepartment.GROUP_NAME">
                <span :style="{backgroundColor: localDepartment.GROUP_COLOR}"
                      class="backgroundColor"></span>
                {{ localDepartment.GROUP_NAME }}
            </p>
            <div class="flexRow stretchContent">
                <div class="layoutThree flexColumn">
                    <div class="tit">{{ $t('groupUserEdit.DISPLAY_GROUP_DG_OUT_MEMBER_TITLE') }}</div>
                    <NoJoinUser ref="noJoin"
                                :groups-user-data="groupsUser.noJoin"
                                :department="localDepartment"
                                class-name="nochecked"
                                @ClickEvent="notParticipateClickEvent"></NoJoinUser>
                </div>
                <div class="layoutThree centerContent">
                    <headButtonO class="headButtons"
                                 :dat="imgDataO"
                                 @handleCommand="handleCommand"></headButtonO>
                </div>
                <div class="layoutThree flexColumn">
                    <div class="tit">{{ $t('groupUserEdit.DISPLAY_GROUP_DG_MEMBER_TITLE') }}</div>
                    <JoinUser ref="join"
                              :groups-user-data="groupsUser.join"
                              :department="localDepartment"
                              class-name="checked"
                              @ClickEvent="participateClickEvent"></JoinUser>
                </div>
            </div>
            <div slot="footer">
                <button :class="['button', 'buttonHighlight', buttonDisabled ? 'disabled' : '']"
                        @click="groupUserEdit">
                    {{ $t('index.DialogButton1') }}
                </button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="toFoldersBelowClose"
                   :title="$t('common.DialogConfirmCancelTitle')"
                   :close-on-click-modal="false"
                   :before-close="applyToFoldersBelowClose"
                   :destroy-on-close="true"
                   append-to-body
                   class="groupingdialog">
            <p v-html="$t('common.DialogConfirmCancelContent')">{{ $t('common.DialogConfirmCancelContent') }}</p>
            <span slot="footer"
                  class="dialog-footer">
                <button class="button"
                        @click="applyToFoldersBelowClose">{{ $t('common.DialogConfirmCancelButton1') }}</button>
                <button class="button buttonDelete margin"
                        @click="confirm">{{ $t('common.DialogConfirmCancelButton2') }}</button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'GroupUserEdit',
    components: {
        JoinUser: resolve => require(['@p/UserManagement/GroupManagement/components/ListTable'], resolve),
        NoJoinUser: resolve => require(['@p/UserManagement/GroupManagement/components/ListTable'], resolve),
        headButtonO: resolve => require(['@c/HeadButton'], resolve)},
    props: {
        department: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            groupUserEditDialogVisible: false,
            loading: false,
            toFoldersBelowClose: false,
            buttonDisabled: true,
            localDepartment: {},
            groupsUser: {},
            groupsUserStringify: '',
            imgDataO: [
                {
                    name: 'groupUserEdit.DISPLAY_GROUP_DG_VIEWER_BUTTON_ADD',
                    image: require('@a/images/usermanagement/usermanagemen-tree-add.svg')
                },
                {
                    name: 'groupUserEdit.DISPLAY_GROUP_DG_VIEWER_BUTTON_DELETE',
                    image: require('@a/images/usermanagement/usermanagemen-tree-dele.svg')
                }
            ],
            pluralLoginData: [], // グループ参加者一覧 选中数据
            noPluralLoginData: [] // グループ不参加者一覧 选中数据
        }
    },
    watch: {
        department: {
            handler (newVlaue) {
                this.localDepartment = newVlaue
            },
            deep: true
        },
        groupsUser: {
            handler (newValue) {
                const groupsUserStringify = JSON.parse(this.groupsUserStringify)
                const groupsUser = JSON.parse(JSON.stringify(newValue))
                if (groupsUserStringify.join.length > 0) {
                    groupsUserStringify.join.sort(function compareFunction (item1, item2) {
                        return item1.USER_NO - item2.USER_NO
                    })
                }
                if (groupsUserStringify.noJoin.length > 0) {
                    groupsUserStringify.noJoin.sort(function compareFunction (item1, item2) {
                        return item1.USER_NO - item2.USER_NO
                    })
                }
                if (groupsUser.join.length > 0) {
                    groupsUser.join.sort(function compareFunction (item1, item2) {
                        return item1.USER_NO - item2.USER_NO
                    })
                }
                if (groupsUser.noJoin.length > 0) {
                    groupsUser.noJoin.sort(function compareFunction (item1, item2) {
                        return item1.USER_NO - item2.USER_NO
                    })
                }
                this.buttonDisabled = JSON.stringify(groupsUserStringify) === JSON.stringify(groupsUser)
            },
            deep: true
        }
    },
    destroyed () {
        window.removeEventListener('beforeunload', this.beforeunloadHandlerGroupUserEdit, false)
    },
    methods: {
        // 浏览器刷新事件
        beforeunloadHandlerGroupUserEdit (e) {
            const beforeunload = !this.buttonDisabled
            if (beforeunload) {
                e = e || window.event
                if (e) e.returnValue = '关闭提示'
                return beforeunload
            }
            return
        },
        applyToFoldersBelowClose () {
            this.toFoldersBelowClose = false
        },
        confirm () {
            this.$refs.noJoin.clearSelect()
            this.$refs.join.clearSelect()
            this.applyToFoldersBelowClose()
            this.groupUserEditDialogVisible = false
            window.removeEventListener('beforeunload', this.beforeunloadHandlerGroupUserEdit, false)
        },
        handleCommand (command) {
            if (command === this.$t('groupUserEdit.DISPLAY_GROUP_DG_VIEWER_BUTTON_ADD')) {
                this.add()
            } else {
                this.del()
            }
        },
        add () {
            if (this.noPluralLoginData.length === 0) {
                return
            }
            for (let j = 0; j < this.noPluralLoginData.length; j++) {
                for (let i = 0; i < this.groupsUser.noJoin.length; i++) {
                    if (this.groupsUser.noJoin[i].USER_NO === this.noPluralLoginData[j].USER_NO) {
                        this.groupsUser.noJoin.splice(i, 1)
                        this.groupsUser.join.push(this.noPluralLoginData[j])
                    }
                }
            }
            this.$refs.noJoin.clearSelect()
        },
        del () {
            if (this.pluralLoginData.length === 0) {
                return
            }
            for (let j = 0; j < this.pluralLoginData.length; j++) {
                for (let i = 0; i < this.groupsUser.join.length; i++) {
                    if (this.groupsUser.join[i].USER_NO === this.pluralLoginData[j].USER_NO) {
                        this.groupsUser.join.splice(i, 1)
                        this.groupsUser.noJoin.push(this.pluralLoginData[j])
                    }
                }
            }
            this.$refs.join.clearSelect()
        },
        groupUserEdit () {
            this.loading = true
            const body = (`{"join": ${JSON.stringify(this.groupsUser.join)}}`)
            this.$request.group.updateGroupInfo(this.localDepartment.GROUP_NO, body).then(response => {
                console.log('updateGroupInfo-post请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    if (JSON.parse(this.groupsUserStringify).join.length > 0) {
                        this.$message.success(this.$t('groupEdit.MESSAGE_GROUP_EDIT_SUCCESS'))
                    } else {
                        this.$message.success(this.$t('groupEdit.MESSAGE_GROUP_ADD_SUCCESS'))
                    }

                    this.confirm()
                    this.$emit('GroupEdit')
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.groupUserEdit() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`updateGroupInfo-post请求失败:`, err, 'GroupUserEdit')
                }
            })
        },
        notParticipateClickEvent (data) {
            this.noPluralLoginData = data
        },
        participateClickEvent (data) {
            this.pluralLoginData = data
        },
        show (groupsUser) {
            this.groupsUser = JSON.parse(JSON.stringify(groupsUser))
            this.groupsUserStringify = JSON.stringify(groupsUser)
            this.groupUserEditDialogVisible = true
            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', this.beforeunloadHandlerGroupUserEdit, false)
            setTimeout(() => {
                this.$refs.groupUserEditDialog.$el.children[0].children[1].classList.add('flexColumn')
                document.getElementById('groupUserEdit').style.display = 'block'
            }, 100)
        },
        close () {
            if (this.groupsUserStringify === '{}') {
                this.confirm()
                return
            }
            if (!this.buttonDisabled) {
                this.toFoldersBelowClose = true
            } else {
                this.confirm()
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../less/pages/UserManagement/GroupManagement/components/GroupUserEdit.less");
</style>
