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
                      :cell-class-name="({row}) => {
                          if (row.STATUS === 'update') {
                              return 'cellCellClassName td__update'
                          } else {
                              return 'cellCellClassName'
                          }
                      }"
                      class="table"
                      height="66px"
                      style="width: 100%;margin-bottom: 7.6px;">
                <el-table-column :label="$t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_NAME')">
                    <template slot-scope="scope">
                        <img v-if="scope.row.DERIVATION === 'USER'"
                             style="right: auto;left: 8px; cursor: default"
                             :src="require('@a/images/usermanagement/usermanagement-user-icon.svg')" />
                        <span v-else
                              class="backgroundColor"
                              :style="{backgroundColor: scope.row.COLOR}"></span>
                        <span style="position: absolute;margin: auto;top: 0;bottom: 0;left: 38px;"
                              :title="scope.row.GROUP_USER_NAME">{{ scope.row.GROUP_USER_NAME }}</span>
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
            <el-table :data="groupAccessData[0].children"
                      :header-cell-class-name="() => {
                          return 'headerCellClassName'
                      }"
                      :cell-class-name="({row}) => {
                          if (row.PROHIBIT_PRIORITY_FLG === 'TRUE') {
                              if (row.STATUS === 'update') {
                                  return 'cellCellClassName td__update' //prohibit (当状态为禁止优先时, 鼠标点击无效 暂时注释掉)
                              }
                              return 'cellCellClassName' //prohibit
                          }
                          if (row.STATUS === 'update') {
                              if (row.PROHIBIT_PRIORITY_FLG === 'TRUE') {
                                  return 'cellCellClassName td__update' //prohibit
                              }
                              return 'cellCellClassName td__update'
                          }
                          return 'cellCellClassName'
                      }"
                      class="table"
                      height="178"
                      style="width: 100%;
                      @header-click="
                      header-click->
                <el-table-column :label="$t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_NAME')">
                    <template slot-scope="scope">
                        <img style="width:24px;height:24px;right: auto;left: 8px; cursor: default"
                             :src="require('@a/images/usermanagement/usermanagement-user-icon.svg')" />
                        <span class="groupUserStatus"
                              style="left: 38px;right: auto;"
                              :title="scope.row.USER_NAME || scope.row.GROUP_USER_NAME">{{ scope.row.USER_NAME || scope.row.GROUP_USER_NAME }}</span>
                        <span v-if="scope.row.EX_FLG === 'TRUE' && scope.row.PROHIBIT_PRIORITY_FLG === 'FALSE'"
                              class="groupUserStatus ex">{{ $t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_GROUP_ROW_MEMBER_AUTH_INDIVIDUAL_SETTING') }}</span>
                        <span v-if="scope.row.PROHIBIT_PRIORITY_FLG === 'TRUE' && scope.row.EX_FLG === 'FALSE'"
                              class="groupUserStatus prohibit">{{ $t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_PROHIBITION_PRIORITY') }}</span>
                        <span v-if="scope.row.PROHIBIT_PRIORITY_FLG === 'TRUE' && scope.row.EX_FLG === 'TRUE'"
                              class="groupUserStatus prohibitAndEx">
                            <div>{{ $t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_GROUP_ROW_MEMBER_AUTH_INDIVIDUAL_SETTING') }} </div>
                            <div> {{ $t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_PROHIBITION_PRIORITY') }}</div>
                        </span>
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
                        @click="thePermission($event)">{{ $t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING_BUTTON_SAVE') }}</button>
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
                children: []
            }], // 子深拷贝的数据
            groupAccessDataStringify: '',
            groupAccessDataChildrenStringify: [],
            readAuthFlg: 'READ_AUTH_FLG',
            fileAuthFlg: 'FILE_AUTH_FLG',
            dirAuthFlg: 'DIR_AUTH_FLG',
            memoAuthFlg: 'MEMO_AUTH_FLG',
            labelName: '',
            ChildrenUpDataFLG: false
        }
    },
    methods: {
        beforeunloadHandlerFileAccessGroupAccess (e) {
            console.log('quan-->权限-->tree-->组内人员')
            let beforeunload = false
            if (JSON.stringify(this.groupAccessData) !== `[${this.groupAccessDataStringify}]`) {
                beforeunload = true
            }
            if (beforeunload) {
                e = e || window.event
                if (e) e.returnValue = '关闭提示'
                return beforeunload
            }
            return
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
            for (let index = 0; index < this.groupAccessDataChildrenStringify.length; index++) {
                if (this.groupAccessDataChildrenStringify[index].USER_NO === row.USER_NO) {
                    // const pares = JSON.parse(this.groupAccessDataChildrenStringify[index].Stringify)
                    const pares = JSON.parse(this.groupAccessDataStringify)
                    if (
                        row.READ_AUTH_FLG === pares.READ_AUTH_FLG &&
                        row.FILE_AUTH_FLG === pares.FILE_AUTH_FLG &&
                        row.DIR_AUTH_FLG === pares.DIR_AUTH_FLG &&
                        row.MEMO_AUTH_FLG === pares.MEMO_AUTH_FLG
                    ) {
                        row.STATUS = ''
                        row.EX_FLG = 'FALSE'
                        this.groupAccessData[0].EX_FLG = 'FALSE'
                    } else {
                        row['STATUS'] = 'update'
                        row.EX_FLG = 'TRUE'
                        this.groupAccessData[0].EX_FLG = 'TRUE'
                    }
                }
            }
            this.labelName = ''
        },
        // 修改アクセス権限設定的数据
        modify (row, flg, flgname) {
            if (row.READ_AUTH_FLG === 'FALSE' && flgname !== 'READ_AUTH_FLG') {
                return
            }
            if (flg === 'TRUE') {
                row[flgname] = 'FALSE'
                const parse = JSON.parse(this.groupAccessDataStringify)
                parse[flgname] = 'FALSE'
                this.groupAccessDataStringify = JSON.stringify(parse)
            } else if (flg === 'FALSE') {
                row[flgname] = 'TRUE'
                const parse = JSON.parse(this.groupAccessDataStringify)
                parse[flgname] = 'TRUE'
                this.groupAccessDataStringify = JSON.stringify(parse)
            }
            if (row.children) {
                this.groupAccessDataChildrenStringify = []
                row.children.forEach((element) => {
                    if (
                        element.EX_FLG === 'FALSE' &&
                        (element.PROHIBIT_PRIORITY_FLG && element.PROHIBIT_PRIORITY_FLG === 'FALSE')
                    ) {
                        element.READ_AUTH_FLG = row.READ_AUTH_FLG
                        element.FILE_AUTH_FLG = row.FILE_AUTH_FLG
                        element.DIR_AUTH_FLG = row.DIR_AUTH_FLG
                        element.MEMO_AUTH_FLG = row.MEMO_AUTH_FLG
                    } else {
                        if (element.READ_AUTH_FLG === row.READ_AUTH_FLG &&
                        element.FILE_AUTH_FLG === row.FILE_AUTH_FLG &&
                        element.DIR_AUTH_FLG === row.DIR_AUTH_FLG &&
                        element.MEMO_AUTH_FLG === row.MEMO_AUTH_FLG) {
                            element.STATUS = ''
                            element.EX_FLG = 'FALSE'
                            this.groupAccessData[0].EX_FLG = 'FALSE'
                        }
                    }
                    this.groupAccessDataChildrenStringify.push({
                        USER_NO: element.USER_NO,
                        Stringify: JSON.stringify(element)
                    })
                })
            }
            const pares = JSON.parse(this.groupAccessDataStringify)
            if (
                pares.READ_AUTH_FLG === row.READ_AUTH_FLG &&
                pares.FILE_AUTH_FLG === row.FILE_AUTH_FLG &&
                pares.DIR_AUTH_FLG === row.DIR_AUTH_FLG &&
                pares.MEMO_AUTH_FLG === row.MEMO_AUTH_FLG
            ) {
                row.STATUS = pares.STATUS
            } else {
                row.STATUS = 'update'
            }
        },
        thePermission (event) {
            event.target.classList.add('buttonCommonClick')
            const groupAccessData = this.groupAccessData[0]
            // console.log(groupAccessData.ChildrenUpDataFLG)
            if (!groupAccessData.ChildrenUpDataFLG) {
                if (this.groupAccessDataStringify === JSON.stringify(groupAccessData)) {
                    groupAccessData.ChildrenUpDataFLG = false
                } else {
                    groupAccessData.ChildrenUpDataFLG = true
                }
            }
            if (this.groupAccessDataStringify !== JSON.stringify(this.groupAccessData[0])) {
                this.groupAccessData[0].STATUS = 'update'
            }

            const children = this.groupAccessData[0].children
            for (let i = 0; i < children.length; i++) {
                for (let j = 0; j < this.groupAccessDataChildrenStringify.length; j++) {
                    if (children[i].USER_NO === this.groupAccessDataChildrenStringify[j].USER_NO) {
                        if (!children[i].ChildrenUpDataFLG) {
                            if (this.groupAccessDataChildrenStringify[j].Stringify === JSON.stringify(children[i])) {
                                children[i].ChildrenUpDataFLG = false
                            } else {
                                children[i].ChildrenUpDataFLG = true
                            }
                        }
                    }
                }
            }
            console.log(this.groupAccessData[0])
            this.close()
            this.$emit('thePermission', this.groupAccessData[0])
        },
        // 显示
        groupAccessDialogShowEvent (itme) {
            this.groupAccessDialogVisible = true
            this.groupAccessDataChildrenStringify = []
            this.groupAccessDataStringify = JSON.stringify(itme)
            this.groupAccessData = [JSON.parse(this.groupAccessDataStringify)]

            if (this.groupAccessData[0].children) {
                for (let i = 0; i < this.groupAccessData[0].children.length; i++) {
                    this.groupAccessDataChildrenStringify.push({
                        USER_NO: this.groupAccessData[0].children[i].USER_NO,
                        Stringify: JSON.stringify(this.groupAccessData[0].children[i])
                    })
                }
            }
            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', this.beforeunloadHandlerFileAccessGroupAccess, false)
        },
        // 关闭
        close () {
            this.groupAccessDialogVisible = false
            window.removeEventListener('beforeunload', this.beforeunloadHandlerFileAccessGroupAccess, false)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../../less/pages/UserManagement/PermissionManagement/tabsView/dialog/FileAccessGroupListDialog.less");
</style>
