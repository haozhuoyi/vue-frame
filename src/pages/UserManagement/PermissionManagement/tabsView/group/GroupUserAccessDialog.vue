<template>
    <div id="groupAccess">
        <el-dialog :visible.sync="groupAccessDialogVisible"
                   :title="$t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING')"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   append-to-body
                   class="groupAccess"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="title">{{ $t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_SELECT_GROUP_AND_AUTH_SETTING') }}</div>
            <el-table :data="groupAccessData"
                      :header-cell-class-name="() => {
                          return 'headerCellClassName'
                      }"
                      :cell-class-name="() => {
                          return 'cellCellClassName'
                      }"
                      size="medium"
                      class="table"
                      height="66px"
                      style="margin-bottom: 7.6px;">
                <el-table-column :label="$t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_NAME')">
                    <template slot-scope>
                        <span class="backgroundColor"></span>
                        <span style="position: absolute;margin: auto;top: 0;bottom: 0;left: 38px;"
                              :title="checkedUserData.GROUP_NAME">{{ checkedUserData.GROUP_NAME }}</span>
                        <img v-if="false"
                             :src="require('@a/images/usermanagement/usermanagement-group-information.svg')"
                             style="left: auto;">
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FILE')"
                                 width="69"
                                 align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.READ_AUTH_FLG === 'FALSE'">
                            <img :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                        <div v-else>
                            <img v-if="scope.row.FILE_AUTH_FLG === 'TRUE'"
                                 :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                 @click="modify(scope.row, scope.row.FILE_AUTH_FLG, fileAuthFlg)" />
                            <img v-else-if="scope.row.FILE_AUTH_FLG === 'FALSE'"
                                 :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                 @click="modify(scope.row, scope.row.FILE_AUTH_FLG, fileAuthFlg)" />
                            <img v-else
                                 :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FOLDER')"
                                 width="69"
                                 align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.READ_AUTH_FLG === 'FALSE'">
                            <img :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                        <div v-else>
                            <img v-if="scope.row.DIR_AUTH_FLG === 'TRUE'"
                                 :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                 @click="modify(scope.row, scope.row.DIR_AUTH_FLG, dirAuthFlg)" />
                            <img v-else-if="scope.row.DIR_AUTH_FLG === 'FALSE'"
                                 :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                 @click="modify(scope.row, scope.row.DIR_AUTH_FLG, dirAuthFlg)" />
                            <img v-else
                                 :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_NOTE')"
                                 width="45"
                                 align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.READ_AUTH_FLG === 'FALSE'">
                            <img :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                        <div v-else>
                            <img v-if="scope.row.MEMO_AUTH_FLG === 'TRUE'"
                                 :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                 @click="modify(scope.row, scope.row.MEMO_AUTH_FLG, memoAuthFlg)" />
                            <img v-else-if="scope.row.MEMO_AUTH_FLG === 'FALSE'"
                                 :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                 @click="modify(scope.row, scope.row.MEMO_AUTH_FLG, memoAuthFlg)" />
                            <img v-else
                                 :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="title">{{ $t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_TITLE_INDIVIDUAL_SETTING') }}</div>
            <el-table :data="groupAccessData[0].TeamMembers"
                      :header-cell-class-name="() => {
                          return 'headerCellClassName'
                      }"
                      :cell-class-name="({row}) => {
                          if (row.PROHIBIT_PRIORITY_FLG === 'TRUE') {
                              return 'cellCellClassName prohibit'
                          }
                          return 'cellCellClassName'
                      }"
                      size="medium"
                      class="table"
                      height="178">
                <el-table-column :label="$t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_NAME')">
                    <template slot-scope="scope">
                        <img style="width:24px;height:24px;right: auto;left: 8px; cursor: default;"
                             :src="require('@a/images/usermanagement/usermanagement-user-icon.svg')" />
                        <span class="groupUserStatus"
                              style="left: 38px;right: auto;"
                              :title="scope.row.USER_NAME">{{ scope.row.USER_NAME }}</span>
                        <span v-if="scope.row.EX_FLG === 'TRUE'"
                              class="groupUserStatus ex">{{ $t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_GROUP_ROW_MEMBER_AUTH_INDIVIDUAL_SETTING') }}</span>
                        <span v-if="scope.row.PROHIBIT_PRIORITY_FLG === 'TRUE'"
                              class="groupUserStatus prohibit">{{ $t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_PROHIBITION_PRIORITY') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TOOLTIP_READ_ICON')"
                                 width="45"
                                 align="center">
                    <template slot-scope="scope">
                        <img v-if="scope.row.READ_AUTH_FLG === 'FALSE'"
                             :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                             @click="modifyIndividualSet(scope.row, scope.row.READ_AUTH_FLG, readAuthFlg)" />
                        <img v-else-if="scope.row.READ_AUTH_FLG === 'TRUE'"
                             :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                             @click="modifyIndividualSet(scope.row, scope.row.READ_AUTH_FLG, readAuthFlg)" />
                        <img v-else
                             :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FILE')"
                                 width="69"
                                 align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.READ_AUTH_FLG === 'FALSE'">
                            <img :src="require('@a/images/usermanagement/usermanagement-no.svg')" />
                        </div>
                        <div v-else>
                            <img v-if="scope.row.FILE_AUTH_FLG === 'TRUE'"
                                 :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                 @click="modifyIndividualSet(scope.row, scope.row.FILE_AUTH_FLG, fileAuthFlg)" />
                            <img v-else-if="scope.row.FILE_AUTH_FLG === 'FALSE'"
                                 :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                 @click="modifyIndividualSet(scope.row, scope.row.FILE_AUTH_FLG, fileAuthFlg)" />
                            <img v-else
                                 :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FOLDER')"
                                 width="69"
                                 align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.READ_AUTH_FLG === 'FALSE'">
                            <img :src="require('@a/images/usermanagement/usermanagement-no.svg')" />
                        </div>
                        <div v-else>
                            <img v-if="scope.row.DIR_AUTH_FLG === 'TRUE'"
                                 :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                 @click="modifyIndividualSet(scope.row, scope.row.DIR_AUTH_FLG, dirAuthFlg)" />
                            <img v-else-if="scope.row.DIR_AUTH_FLG === 'FALSE'"
                                 :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                 @click="modifyIndividualSet(scope.row, scope.row.DIR_AUTH_FLG, dirAuthFlg)" />
                            <img v-else
                                 :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_NOTE')"
                                 width="45"
                                 align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.READ_AUTH_FLG === 'FALSE'">
                            <img :src="require('@a/images/usermanagement/usermanagement-no.svg')" />
                        </div>
                        <div v-else>
                            <img v-if="scope.row.MEMO_AUTH_FLG === 'TRUE'"
                                 :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                 @click="modifyIndividualSet(scope.row, scope.row.MEMO_AUTH_FLG, memoAuthFlg)" />
                            <img v-else-if="scope.row.MEMO_AUTH_FLG === 'FALSE'"
                                 :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                 @click="modifyIndividualSet(scope.row, scope.row.MEMO_AUTH_FLG, memoAuthFlg)" />
                            <img v-else
                                 :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer"
                  class="dialog-footer">
                <button class="button buttonHighlight"
                        @click="thePermission">{{ $t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING_BUTTON_SAVE') }}</button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import bus from '@c/bus'

export default {
    name: 'GroupAccess',
    data () {
        return {
            loading: false,
            groupAccessDialogVisible: false,
            groupAccessData: [{
                TeamMembers: []
            }], // 子深拷贝的数据
            checkedUserData: {}, // 选中组的数据
            groupAccessDataChildrenStringify: [],
            groupAccessDataStringify: {},
            readAuthFlg: 'READ_AUTH_FLG',
            fileAuthFlg: 'FILE_AUTH_FLG',
            dirAuthFlg: 'DIR_AUTH_FLG',
            memoAuthFlg: 'MEMO_AUTH_FLG'
        }
    },
    methods: {
        // 修改アクセス権限設定的数据
        modify (row, flg, flgname) {
            if (row.READ_AUTH_FLG === 'FALSE' && flgname !== 'READ_AUTH_FLG') {
                return
            }
            if (flg === 'TRUE') {
                row[flgname] = 'FALSE'
            } else if (flg === 'FALSE') {
                row[flgname] = 'TRUE'
            }
            if (row.TeamMembers) {
                row.TeamMembers.forEach(element => {
                    if (element.EX_FLG === 'FALSE' && element.PROHIBIT_PRIORITY_FLG === 'FALSE') {
                        element.READ_AUTH_FLG = row.READ_AUTH_FLG
                        element.FILE_AUTH_FLG = row.FILE_AUTH_FLG
                        element.DIR_AUTH_FLG = row.DIR_AUTH_FLG
                        element.MEMO_AUTH_FLG = row.MEMO_AUTH_FLG
                    }
                })
            }
            row['STATUS'] = 'update'
        },
        modifyIndividualSet (row, flg, flgname) {
            if (row.READ_AUTH_FLG === 'FALSE' && flgname !== 'READ_AUTH_FLG') {
                return
            }
            if (flg === 'TRUE') {
                row[flgname] = 'FALSE'
            } else if (flg === 'FALSE') {
                row[flgname] = 'TRUE'
            }
            row.EX_FLG = 'TRUE'
            this.groupAccessData[0].EX_FLG = 'TRUE'
            if (
                row.READ_AUTH_FLG === this.groupAccessData[0].READ_AUTH_FLG &&
                row.FILE_AUTH_FLG === this.groupAccessData[0].FILE_AUTH_FLG &&
                row.DIR_AUTH_FLG === this.groupAccessData[0].DIR_AUTH_FLG &&
                row.MEMO_AUTH_FLG === this.groupAccessData[0].MEMO_AUTH_FLG
            ) {
                row.EX_FLG = 'FALSE'
                this.groupAccessData[0].EX_FLG = 'FALSE'
            }
            row['STATUS'] = 'update'
        },
        thePermission () {
            const teamMembers = this.groupAccessData[0].TeamMembers
            for (let i = 0; i < teamMembers.length; i++) {
                for (let j = 0; j < this.groupAccessDataChildrenStringify.length; j++) {
                    if (teamMembers[i].USER_NO === this.groupAccessDataChildrenStringify[j].USER_NO) {
                        if (!teamMembers[i].ChildrenUpDataFLG) {
                            console.log(this.groupAccessDataChildrenStringify[j].Stringify, JSON.stringify(teamMembers[i]))
                            if (this.groupAccessDataChildrenStringify[j].Stringify === JSON.stringify(teamMembers[i])) {
                                teamMembers[i].ChildrenUpDataFLG = false
                            } else {
                                teamMembers[i].ChildrenUpDataFLG = true
                            }
                        }
                    }
                }
            }
            console.log(this.groupAccessDataStringify === JSON.stringify([this.groupAccessData[0]]),
                this.groupAccessDataStringify, JSON.stringify([this.groupAccessData[0]]))
            if (this.groupAccessDataStringify !== JSON.stringify([this.groupAccessData[0]])) {
                this.groupAccessData[0].STATUS = 'update'
            }
            this.close()
            this.$emit('thePermission', this.groupAccessData[0])
        },
        // 显示
        groupAccessDialogShowEvent (GroupAccessData, checkedUserData) {
            this.groupAccessDialogVisible = true
            this.checkedUserData = checkedUserData // 选中组数据
            // 选中组对应的文件夹(选中)的权限数据
            this.groupAccessData = [JSON.parse(JSON.stringify(GroupAccessData))]
            // 原始数据 -- 选中组对应的文件夹(选中)对应的组内人员的权限数据
            this.groupAccessDataChildrenStringify = []
            if (this.groupAccessData[0].TeamMembers) {
                for (let i = 0; i < this.groupAccessData[0].TeamMembers.length; i++) {
                    this.groupAccessData[0].TeamMembers[i].ChildrenUpDataFLG = false
                    this.groupAccessDataChildrenStringify.push({
                        USER_NO: this.groupAccessData[0].TeamMembers[i].USER_NO,
                        Stringify: JSON.stringify(this.groupAccessData[0].TeamMembers[i])
                    })
                }
            }
            // 原始数据 -- 选中组对应的文件夹(选中)的权限数据
            this.groupAccessDataStringify = JSON.stringify(this.groupAccessData)
            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', this.beforeunloadHandlerGroupUserAccessDialog, false)
        },
        // 关闭
        close () {
            this.groupAccessDialogVisible = false
            window.removeEventListener('beforeunload', this.beforeunloadHandlerGroupUserAccessDialog, false)
        },
        // 浏览器刷新事件
        beforeunloadHandlerGroupUserAccessDialog (e) {
            const beforeunload = this.groupAccessDataStringify !== JSON.stringify([this.groupAccessData[0]])
            console.log(e, beforeunload, this.dataStringify, JSON.stringify(this.data))
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
@import url(
    "../../../../../less/pages/UserManagement/PermissionManagement/tabsView/dialog/GroupUserAccessDialog.less");
</style>
