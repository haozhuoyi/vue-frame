<template>
    <div id="groupManagement">
        <el-container>
            <el-header height="72px">
                <headButtonO :dat="imgDataO"
                             @handleCommand="handleCommand"></headButtonO>
                <div class="showOpacityOuterLayer">
                    <headButtonT :dat="imgDataT"
                                 @handleCommand="handleCommand"></headButtonT>
                    <p :class="selectedData.length>1? 'showOpacity center' : 'hidden'"></p>
                </div>
            </el-header>
            <el-main>
                <Split>
                    <SplitArea :size="28"
                               style="overflow: auto;">
                        <div class="belongsTitle">
                            <p>{{ $t('groupManagement.DISPLAY_GROUP_LEFT_GROUP_LIST_TITLE') }}</p>
                        </div>
                        <div class="belongs">
                            <List ref="list"
                                  :name="$t('groupManagement.DISPLAY_GROUP_EDIT_GROUP_NAME')"
                                  :show="true"
                                  :templatelist="templatelist"
                                  @selectedDataEvent="selectedDataEvent"
                                  @selection="groupSelection"
                                  @edit="groupEdit"
                                  @handleCommand="handleCommand"
                                  @deleteEvent="deleteEvent"></List>
                        </div>
                    </SplitArea>
                    <SplitArea :size="72"
                               style="overflow: auto;"
                               v-loading="loading"
                               :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                               element-loading-spinner="el-icon-loading"
                               element-loading-background="rgba(255,255,255,.4)">
                        <!-- <p class="title"
                           :title="department.GROUP_NAME">
                            <span :style="{backgroundColor: department.GROUP_COLOR}"
                                  class="backgroundColor"></span>
                            {{ department.GROUP_NAME }}
                        </p>
                        <span class="titleAssistant">
                            {{ $t('groupManagement.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_LIST') }}
                        </span> -->
                        <GroupUser :user-data="join"
                                   :department="department"></GroupUser>
                    </SplitArea>
                </Split>
            </el-main>
        </el-container>
        <GroupEdit ref="GroupEdit"
                   :department="department"
                   :title="title"
                   @getGroups="getGroups"></GroupEdit>
        <GroupUserEdit ref="GroupUserEdit"
                       :department="department"
                       @GroupEdit="groupsUserListGet(department.GROUP_NO)"></GroupUserEdit>


        <el-dialog :visible.sync="toFoldersBelowDel"
                   :title="$t('groupManagement.DISPLAY_GROUP_POPUP_TITLE_GROUP_DELETE_CONFIRM')"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   append-to-body
                   class="groupdeleteingdialog">
            {{ $t('groupManagement.MESSAGE_ASK_GROUP_GROUP_DELETE1') }}
            {{ selectedData.length }}
            {{ $t('groupManagement.MESSAGE_ASK_GROUP_GROUP_DELETE2') }}<br />
            {{ $t('groupManagement.MESSAGE_ASK_GROUP_GROUP_DELETE3') }}
            <span slot="footer"
                  class="dialog-footer">
                <button class="button"
                        @click="close">{{ $t('common.NO') }}</button>
                <button class="button buttonDelete margin"
                        @click="deleteGroup">{{ $t('common.YES') }}</button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'GroupManagement',
    components: {
        List: resolve => require(['@p/UserManagement/components/List'], resolve),
        GroupEdit: resolve => require(['@p/UserManagement/GroupManagement/components/GroupEdit'], resolve),
        GroupUser: resolve => require(['@p/UserManagement/GroupManagement/components/GroupUser'], resolve),
        GroupUserEdit: resolve => require(['@p/UserManagement/GroupManagement/components/GroupUserEdit'], resolve),
        headButtonO: resolve => require(['@c/HeadButton'], resolve),
        headButtonT: resolve => require(['@c/HeadButton'], resolve)
    },
    data () {
        return {
            loading: false,
            toFoldersBelowDel: false,
            title: '',
            imgDataO: [
                {
                    name: 'groupManagement.DISPLAY_GROUP_ADD_BUTTON',
                    image: require('@a/images/usermanagement/usermanagement-group-add.svg')
                },
                {
                    name: 'groupManagement.DISPLAY_GROUP_DELETE_BUTTON',
                    image: require('@a/images/usermanagement/usermanagement-group-del.svg')
                }
            ],
            imgDataT: [
                {
                    name: 'groupManagement.DISPLAY_GROUP_MEMBER_EDIT_BUTTON',
                    image: require('@a/images/usermanagement/usermanagement-group-user-edit.svg')
                }
            ],
            templatelist: [], // group取得数据列表
            selectedData: [],
            groupsUser: {}, // グループ参加者一覧 + グループ不参加者一覧
            join: [], // グループ参加者一覧
            department: {}, // 选中的所属数据
            del: false, // 是否右键
            deleteEventData: {} // 右键数据
        }
    },
    mounted () {
        this.getGroups()
    },
    // 离开页面时,重置data的数据
    destroyed () {
        Object.assign(this.$data, this.$options.data())
    },
    methods: {
        // 所属する
        groupSelection (item) {
            this.groupsUser = {}
            this.department = item
            const colorBool = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(this.department.GROUP_COLOR)
            this.department.GROUP_COLOR = colorBool ? this.department.GROUP_COLOR : 'transparent'
            // 所属情報の利用者情報取得
            this.groupsUserListGet(this.department.GROUP_NO)
        },
        // 所属名の修正
        groupEdit (GROUP_NO, GROUP_NAME, GROUP_COLOR) {
            this.title = this.$t('groupEdit.GroupTitle2')
            this.$refs.GroupEdit.groupEditVisibl({ GROUP_NO, GROUP_NAME, GROUP_COLOR })
        },
        deleteEvent (data) {
            this.del = true
            this.deleteEventData = data
            this.toFoldersBelowDel = true
        },
        selectedDataEvent (data) {
            this.selectedData = data
        },
        handleCommand (name) {
            this.$refs.list.hideContextmenu()
            switch (name) {
                case this.$t('groupManagement.DISPLAY_GROUP_ADD_BUTTON'): // グループ 追加
                    this.title = this.$t('groupEdit.GroupTitle1').replace(/\n/g, '')
                    this.$refs.GroupEdit.groupEditVisibl({})
                    break
                case this.$t('groupManagement.DISPLAY_GROUP_DELETE_BUTTON'):
                    if (this.selectedData.length <= 0) return
                    this.toFoldersBelowDel = true
                    break
                case this.$t('groupManagement.DISPLAY_GROUP_MEMBER_EDIT_BUTTON'):
                    this.$refs.GroupUserEdit.show(this.groupsUser)
                    this.$refs.GroupUserEdit.$el.style.display = 'none'
                    break
                case '変更保存':
                    this.edit = false
                    break
                case '複数参加登録':
                    console.log(name)
                    this.join()
                    break
                case '複数不参加登録':
                    console.log(name)
                    this.noJoin()
                    break
            }
        },
        // グループ取得
        getGroups () {
            const that = this
            that.loading = true
            const body = ('{"GroupName": ""}')
            that.$request.group.getGroups(body).then(response => {
                console.log('getGroups-get请求成功:', response.status, response.statusText)
                const data = that.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    if (data.result.length > 0) {
                        that.templatelist = data.result
                        if (that.department.GROUP_NO === undefined) {
                            setTimeout(() => {
                                try {
                                    that.$refs.list.selection(0, that.templatelist[0])
                                } catch (error) {
                                    console.log(error)
                                }
                            }, 50 * that.templatelist.length)
                        } else {
                            for (let index = 0; index < that.templatelist.length; index++) {
                                if (that.templatelist[index].GROUP_NO === that.department.GROUP_NO) {
                                    that.department.GROUP_NAME = that.templatelist[index].GROUP_NAME
                                    setTimeout(() => {
                                        try {
                                            that.$refs.list.selection(index, that.department)
                                        } catch (error) {
                                            console.log(error)
                                        }
                                    }, 50 * that.templatelist.length)
                                }
                            }
                        }
                    }
                }
                that.loading = false
            }).catch(err => {
                that.loading = false
                if (err.status === 401) {
                    that.$request.login.refreshToken().then(response => {
                        response ? that.getGroups() : ''
                    })
                } else {
                    that.$request.requestError(`getGroups-get请求失败:`, err, 'GroupManagement')
                }
            })
        },
        // Groupの利用者情報取得
        groupsUserListGet (NO) {
            const that = this
            that.loading = true
            that.$request.group.UserListGet(NO, '').then(response => {
                console.log('UserListGet-get请求成功:', response.status, response.statusText)
                const data = that.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    that.groupsUser = data.result
                    if (data.result.length === 0) {
                        that.groupsUser = {join: [], noJoin: []}
                    }
                    that.join = that.groupsUser.join
                }
                that.loading = false
            }).catch(err => {
                that.loading = false
                if (err.status === 401) {
                    that.$request.login.refreshToken().then(response => {
                        response ? that.groupsUserListGet(NO) : ''
                    })
                } else {
                    that.$request.requestError(`UserListGet-get请求失败:`, err, 'GroupManagement')
                }
            })
        },
        // 指定グループの削除
        deleteGroup () {
            this.close()
            const no = []
            if (this.del) {
                no.push(this.deleteEventData.GROUP_NO)
            } else {
                for (let index = 0; index < this.selectedData.length; index++) {
                    no.push(this.selectedData[index].GROUP_NO)
                }
            }
            this.del = false
            this.loading = true
            this.$request.group.deleteGroup(no.toString(), '').then(response => {
                console.log('deleteGroup-delete请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success(this.$t('groupManagement.MESSAGE_DELETE_SUCCESS'))
                    this.department = {}
                    this.getGroups()
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.deleteGroup() : ''
                    })
                } else {
                    this.$request.requestError(`deleteGroup-delete请求失败:`, err, 'GroupManagement')
                }
            })
        },
        close () {
            this.toFoldersBelowDel = false
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../less/pages/UserManagement/GroupManagement/GroupManagement.less");
</style>
