<template>
    <div id="group">
        <GroupManagement ref="GroupManagement"
                         class="groupManagementmain"
                         :groups-data="groupData"
                         :checked="false"
                         @LgClickEvent="lgClickEvent"></GroupManagement>
        <Table v-loading="loading"
               :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(255,255,255,.4)"
               ref="usertable"
               class="userTableMain"
               :checked-user-data="checkedUserData"
               :remarks="remarks"
               type="group"
               @AccessClick="accessClick"></Table>

        <GroupAccessDialog ref="GroupAccessDialog"
                           @accessAuth="accessAuth"></GroupAccessDialog>
    </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import bus from '@c/bus'
// 左侧组列表
import GroupManagement from '@p/UserManagement/PermissionManagement/tabsView/components/TabGroup'
// 右侧文件夹树表格
import Table from '@p/UserManagement/PermissionManagement/tabsView/components/Table'
import GroupAccessDialog from '@p/UserManagement/PermissionManagement/tabsView/group/GroupAccessDialog.vue'


export default {
    name: 'Group',
    components: {GroupManagement, Table, GroupAccessDialog},
    data () {
        return {
            loading: false,
            remarks: true,
            groupData: [],
            checkedUserData: {} // 选中组数据
        }
    },
    mounted () {
        this.getGroups()
    },
    methods: {
        accessAuth () {
            this.$refs.usertable.refl(this.checkedUserData)
        },
        // ,利用者のアクセス権限設定
        userAccessDialogShowEvent () {
            try {
                this.$refs.GroupAccessDialog.groupAccessDialogShowEvent(
                    this.checkedUserData,
                    this.$refs.usertable.getData()
                )
            } catch (error) {
                console.log(error)
            }
        },
        // 选中数据
        lgClickEvent (data) {
            this.checkedUserData = data[0]
            this.accessAuth()
        },
        accessClick (bool) {
            if (this.checkedUserData) {
                if (bool === false) {
                    this.$emit('AccessClick', false)
                } else {
                    this.$emit('AccessClick')
                }
            }
        },
        // group取得
        getGroups () {
            this.loading = true
            const body = ('{"GroupName": ""}')
            this.$request.group.getGroups(body).then(response => {
                console.log('getGroups-get请求成功')
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.groupData = data.result
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getGroups() : ''
                    })
                } else {
                    this.$request.requestError(`getGroups-get请求失败:`, err, 'Group')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../../less/pages/UserManagement/PermissionManagement/tabsView/group/Group.less");
</style>
