<template>
    <div id="permissionManagement">
        <el-container>
            <el-header height="72px">
                <el-radio-group v-model="activeName"
                                size="small">
                    <el-radio-button label="tree"
                                     class="tree">
                        <img v-show="activeName === 'tree'"
                             :src="require('@a/images/usermanagement/usermanagemen-tree-no.svg')">
                        <img v-show="activeName !== 'tree'"
                             :src="require('@a/images/usermanagement/usermanagemen-tree-yes.svg')">
                    </el-radio-button>
                    <el-radio-button label="user"
                                     class="user">
                        <img v-show="activeName === 'user'"
                             :src="require('@a/images/usermanagement/usermanagemen-user-no.svg')">
                        <img v-show="activeName !== 'user'"
                             :src="require('@a/images/usermanagement/usermanagemen-user-yes.svg')">
                    </el-radio-button>
                    <el-radio-button label="group"
                                     class="group">
                        <img v-show="activeName === 'group'"
                             :src="require('@a/images/usermanagement/usermanagemen-group-no.svg')">
                        <img v-show="activeName !== 'group'"
                             :src="require('@a/images/usermanagement/usermanagemen-group-yes.svg')"
                             style="">
                    </el-radio-button>
                </el-radio-group>
                <headButtonO :dat="imgDataO"
                             @handleCommand="dialogShowEvent"></headButtonO>
            </el-header>
            <el-main>
                <el-tabs v-model="activeName"
                         style="vertical-align: top;">
                    <el-tab-pane label="tree"
                                 name="tree">
                        <FileTree ref="tree"
                                  v-if="activeName === 'tree'"
                                  @AccessClick="click = true"></filetree>
                    </el-tab-pane>
                    <el-tab-pane label="user"
                                 name="user">
                        <User ref="user"
                              v-if="activeName === 'user'"
                              @AccessClick="clicku = true"></User>
                    </el-tab-pane>
                    <el-tab-pane label="group"
                                 name="group">
                        <Group ref="group"
                               v-if="activeName === 'group'"
                               @AccessClick="clickg = true"></Group>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
        <UserConfirmationWithinTheGroup></UserConfirmationWithinTheGroup>
    </div>
</template>

<script>

export default {
    name: 'PermissionManagement',
    components: {
        FileTree: resolve => require(['@p/UserManagement/PermissionManagement/tabsView/file/FileTree'], resolve),
        Group: resolve => require(['@p/UserManagement/PermissionManagement/tabsView/group/Group'], resolve),
        User: resolve => require(['@p/UserManagement/PermissionManagement/tabsView/user/User'], resolve),
        UserConfirmationWithinTheGroup:
            resolve => require(['@p/UserManagement/PermissionManagement/UserConfirmationWithinTheGroup'], resolve),
        headButtonO: resolve => require(['@c/HeadButton'], resolve)
    },
    data () {
        return {
            click: false,
            clicku: false,
            clickg: false,
            imgDataO: [
                {
                    name: 'permissionManagement.DISPLAY_ACCESS_AUTH_TOOLTIP_CHANGE_MODE_EDIT_BUTTON',
                    image: require('@a/images/usermanagement/usermanagement-PermissionManagement.svg')
                }
            ],
            activeName: sessionStorage.getItem('activeName') || 'tree'
        }
    },
    watch: {
        activeName (data) {
            sessionStorage.setItem('activeName', data)
        }
    },
    methods: {
        // 弹窗显示事件
        dialogShowEvent () {
            if (this.activeName === 'tree') {
                this.$refs.tree.fileAccessDialogShowEvent()
            }
            if (this.activeName === 'user' && this.clicku) {
                this.$refs.user.userAccessDialogShowEvent()
            }
            if (this.activeName === 'group' && this.clickg) {
                this.$refs.group.userAccessDialogShowEvent()
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../less/pages/UserManagement/PermissionManagement/PermissionManagement.less");
</style>
