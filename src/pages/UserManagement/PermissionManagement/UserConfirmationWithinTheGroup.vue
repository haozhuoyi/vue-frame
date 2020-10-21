<template>
    <div id="userConfirmationWithinTheGroup">
        <el-dialog :visible.sync="userConfirmationWithinTheGroupVisible"
                   :title="$t('userConfirmationWithinTheGroup.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_TITLE')"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   append-to-body
                   class="userConfirmationWithinTheGroup"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <p class="title"
               :title="groupName">
                <span class="backgroundColor"
                      :style="{backgroundColor: color}"></span>
                {{ groupName }}
            </p>
            <p class="IndividualSet">{{ $t('userConfirmationWithinTheGroup.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_DG_MEMBER_ROW_BUTTON_INDIVIDUAL_SETTING1') }}</p>
            <div class="content">
                <el-row class="row">
                    <el-col :span="12">{{ $t('userConfirmationWithinTheGroup.DISPLAY_GROUP_DG_MEMBER_ROW_TITLE_BELONGING_NAME') }}</el-col>
                    <el-col :span="11">{{ $t('userConfirmationWithinTheGroup.DISPLAY_GROUP_DG_MEMBER_ROW_TITLE_USER_NAME') }}</el-col>
                </el-row>
                <div class="groupUser">
                    <el-row v-for="(itme,index) in join"
                            :key="itme.USER_NO"
                            :class="index == 0 ? 'topSpacing' : ''">
                        <el-col :span="12"
                                style="padding-left: 38px;">
                            <img :src="require('@a/images/usermanagement/usermanagement-user-icon.svg')" />
                            {{ itme.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : itme.BELONGING_NAME }}
                        </el-col>
                        <el-col :span="12"
                                style="padding-left: 16px">{{ itme.USER_NAME }}</el-col>
                    </el-row>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import bus from '@c/bus.js'

export default {
    name: 'UserConfirmationWithinTheGroup',
    data () {
        return {
            userConfirmationWithinTheGroupVisible: false,
            loading: false,
            groupsUser: {},
            join: [],
            groupName: '',
            color: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            bus.$on('UserConfirmationWithinTheGroup', data => {
                this.userConfirmationWithinTheGroupVisible = true
                this.groupName = data.GroupName
                this.color = data.Color
                this.GroupsUserListGet(data.NO)
            })
        })
    },
    methods: {
        close () {
            this.userConfirmationWithinTheGroupVisible = false
        },
        // Group的利用者情报取得
        GroupsUserListGet (NO) {
            this.loading = true
            this.$request.group.UserListGet(NO, '').then(response => {
                console.log('UserListGet-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.groupsUser = data.result
                    if (data.result.length === 0) {
                        this.groupsUser = {join: [], noJoin: []}
                    }
                    this.join = this.groupsUser.join
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.GroupsUserListGet() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.close()
                    }
                    this.$request.requestError(`UserListGet-get请求失败:`, err, 'UserConfirmationWithinTheGroup')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../../less/pages/UserManagement/PermissionManagement/UserConfirmationWithinTheGroup.less";
</style>
