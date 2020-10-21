<template>
    <div id="tabs">
        <el-tabs v-model="activeTabName"
                 class="tabs"
                 @tab-click="handleClick">
            <el-tab-pane :label="$t('tabs.DISPLAY_ACCESS_AUTH_TOGGLE_BUTTON_GROUP')"
                         name="group">
                <Group ref="Group"
                       :groups-data="groupsData"
                       @LgClickEvent="lgClickEvent"></Group>
            </el-tab-pane>
            <el-tab-pane :label="$t('tabs.DISPLAY_ACCESS_AUTH_TOGGLE_BUTTON_USER')"
                         name="user">
                <User ref="User"
                      :user-data="userData"
                      @LiClickEvent="liClickEvent"></User>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Group from '@p/UserManagement/PermissionManagement/tabsView/components/TabGroup'
import User from '@p/UserManagement/PermissionManagement/tabsView/components/TabUser'

export default {
    name: 'Tabs',
    components: {
        Group, User
    },
    props: {
        groupsData: {
            type: Array,
            default: () => {
                return []
            }
        },
        userData: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
            activeTabName: 'group'
        }
    },
    methods: {
        liClickEvent (itme) {
            console.log(itme)
            this.$emit('LiClickEvent', itme)
        },
        lgClickEvent (itme) {
            console.log(itme)
            this.$emit('LgClickEvent', itme)
        },
        handleClick () {
            this.$refs.Group.group()
            this.$refs.User.user()
            this.$emit('removeChecked')
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../../less/pages/UserManagement/PermissionManagement/tabsView/components/Tabs.less");
</style>
