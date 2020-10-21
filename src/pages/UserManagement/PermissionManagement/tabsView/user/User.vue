<template>
    <div id="user">
        <UserManagement ref="UserManagement"
                        class="userManagementmain"
                        :user-data="userData"
                        :checked="false"
                        @LiClickEvent="liClickEvent"></UserManagement>
        <Table v-loading="loading"
               :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(255,255,255,.4)"
               ref="usertable"
               class="usertablemain"
               :checked-user-data="checkedUserData"
               @AccessClick="accessClick"></Table>
        <UserAccessDialog ref="UserAccessDialog"
                          @accessAuth="accessAuth"></UserAccessDialog>
    </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import bus from '@c/bus'

export default {
    name: 'User',
    components: {
        UserManagement: resolve =>
            require(['@p/UserManagement/PermissionManagement/tabsView/components/TabUser'], resolve),
        Table: resolve => require(['@p/UserManagement/PermissionManagement/tabsView/components/Table'], resolve),
        UserAccessDialog: resolve =>
            require(['@p/UserManagement/PermissionManagement/tabsView/user/UserAccessDialog.vue'], resolve)
    },
    data () {
        return {
            loading: false,
            userData: [],
            checkedUserData: {}
        }
    },
    mounted () {
        this.getUserManagement()
    },
    methods: {
        accessAuth () {
            this.$refs.usertable.refl(this.checkedUserData)
        },
        // 利用者のアクセス権限設定
        userAccessDialogShowEvent () {
            try {
                this.$refs.UserAccessDialog.userAccessDialogShowEvent(
                    this.checkedUserData,
                    this.$refs.usertable.getData()
                )
            } catch (error) {
                console.log(error)
            }
        },
        // 选中数据
        liClickEvent (data) {
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
        // 利用者情报取得
        getUserManagement () {
            this.loading = true
            const body = `{"NAME": "", "S3NO": ""}`
            this.$request.access.AccessAuthUsers(body).then(response => {
                console.log('AccessAuthUsers-get请求成功')
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.userData = data.result
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getUserManagement() : ''
                    })
                } else {
                    this.$request.requestError(`AccessAuthUsers-get请求失败:`, err, 'User')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../../less/pages/UserManagement/PermissionManagement/tabsView/user/User.less");
</style>
