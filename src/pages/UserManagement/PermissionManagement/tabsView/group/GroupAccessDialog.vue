<template>
    <div id="groupAccessDialog">
        <el-dialog :visible.sync="userAccessDialogVisible"
                   :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_USER')"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   class="groupAccessDialog"
                   ref="groupAccessDialog"
                   @open="open"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="title"
                 :title="checkedUserData.GROUP_USER_NAME ? checkedUserData.GROUP_USER_NAME :checkedUserData.GROUP_NAME">
                <img :src="require('@a/images/usermanagement/usermanagement-user-icon.svg')"
                     :alt="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ALT_USER')">
                {{ checkedUserData.GROUP_USER_NAME || checkedUserData.GROUP_NAME }} {{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_LABLE_FOLDER') }}
            </div>
            <div class="body">
                <vxe-table highlight-hover-row
                           highlight-current-row
                           show-overflow="title"
                           auto-resize
                           row-key
                           ref="xTableUser"
                           border="none"
                           row-id="FOLDER_NO"
                           size="small"
                           :header-cell-style="{
                               'padding': '0',
                               'font-weight': 'unset'
                           }"
                           :cell-class-name="cellClassName"
                           :tree-config="{
                               lazy: true,
                               line: true,
                               children: 'children',
                               hasChild: 'hasChild',
                               loadMethod: loadChildrenMethod,
                               iconClose:'iconfont chexplus-square-o',
                               iconOpen: 'iconfont chexminus-square-o'
                           }"
                           :data="data"
                           class="vxetable"
                           height="95%">
                    <vxe-table-column :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FOLDER')"
                                      align="left"
                                      show-overflow
                                      tree-node>
                        <template v-slot="{ row }">
                            <img class="img folder"
                                 :src="require('@a/images/file/file-tree-icon-12.svg')" />
                            <span class="filenameSpan"
                                  :title="row.FOLDER_NAME">{{ row.FOLDER_NAME }} </span>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TOOLTIP_READ_ICON')"
                                      align="center"
                                      width="60">
                        <template v-slot="{ row }">
                            <div class="imgdiv">
                                <img v-if="row.READ_AUTH_FLG === 'FALSE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                     @click="modify(row, row.READ_AUTH_FLG, readAuthFlg)" />
                                <img v-else-if="row.READ_AUTH_FLG === 'TRUE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                     @click="modify(row, row.READ_AUTH_FLG, readAuthFlg)" />
                                <img v-else
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                            </div>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FILE')"
                                      align="center"
                                      width="90">
                        <template v-slot="{row}">
                            <div v-if="row.READ_AUTH_FLG === 'FALSE'"
                                 class="imgdiv">
                                <img class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                            </div>
                            <div v-else
                                 class="imgdiv">
                                <img v-if="row.FILE_AUTH_FLG === 'TRUE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                     @click="modify(row, row.FILE_AUTH_FLG, fileAuthFlg)" />
                                <img v-else-if="row.FILE_AUTH_FLG === 'FALSE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                     @click="modify(row, row.FILE_AUTH_FLG, fileAuthFlg)" />
                                <img v-else
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                            </div>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FOLDER')"
                                      align="center"
                                      width="90">
                        <template v-slot="{ row }">
                            <div v-if="row.READ_AUTH_FLG === 'FALSE'"
                                 class="imgdiv">
                                <img class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                            </div>
                            <div v-else
                                 class="imgdiv">
                                <img v-if="row.DIR_AUTH_FLG === 'TRUE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                     @click="modify(row, row.DIR_AUTH_FLG, dirAuthFlg)" />
                                <img v-else-if="row.DIR_AUTH_FLG === 'FALSE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                     @click="modify(row, row.DIR_AUTH_FLG, dirAuthFlg)" />
                                <img v-else
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                            </div>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_NOTE')"
                                      align="center"
                                      width="60">
                        <template v-slot="{ row }">
                            <div v-if="row.READ_AUTH_FLG === 'FALSE'"
                                 class="imgdiv">
                                <img class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                            </div>
                            <div v-else
                                 class="imgdiv">
                                <img v-if="row.MEMO_AUTH_FLG === 'TRUE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                     @click="modify(row, row.MEMO_AUTH_FLG, memoAuthFlg)" />
                                <img v-else-if="row.MEMO_AUTH_FLG === 'FALSE'"
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                     @click="modify(row, row.MEMO_AUTH_FLG, memoAuthFlg)" />
                                <img v-else
                                     class="img"
                                     :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                            </div>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_REMARKS')"
                                      align="center"
                                      width="180">
                        <template v-slot="{ row }">
                            <div class="groupFlg">
                                <div v-if="row.EX_FLG === 'TRUE' && row.PROHIBIT_PRIORITY_FLG === 'FALSE'"
                                     style="padding: 10.5px 0px;">
                                    <p style="color: #4146CD;">{{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING') }}</p>
                                </div>
                                <div v-if="row.EX_FLG === 'FALSE' && row.PROHIBIT_PRIORITY_FLG === 'TRUE'"
                                     style="padding: 10.5px 0px;">
                                    <p style="color: #D61918;">{{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_PROHIBITION_PRIORITY') }}</p>
                                </div>
                                <div v-if="row.EX_FLG === 'TRUE' && row.PROHIBIT_PRIORITY_FLG === 'TRUE'">
                                    <p style="color: #4146CD;">{{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING') }}</p>
                                    <p style="color: #D61918;">{{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_PROHIBITION_PRIORITY') }}</p>
                                </div>
                            </div>
                            <img v-if="row.DERIVATION !== 'USER'"
                                 class="groupSetting"
                                 :src="require('@a/images/usermanagement/usermanagement-setting.svg')"
                                 @click="individualSettings(row)" />
                        </template>
                    </vxe-table-column>
                    <!--
                    <template v-slot:empty>
                        <span>
                            <p>データがありません</p>
                        </span>
                    </template> -->
                </vxe-table>
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <!-- <button class="button buttonHighlight allSave"
                        @click="show">
                    {{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_SAME_SETTINGS') }}
                </button> -->
                <button class="button buttonHighlight"
                        @click="save(false)">
                    {{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_REGISTER') }}
                </button>
            </span>

            <div id="groupAccess">
                <el-dialog :visible.sync="groupAccessDialogVisible"
                           :title="$t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING')"
                           :close-on-click-modal="false"
                           :before-close="childClose"
                           :destroy-on-close="true"
                           append-to-body
                           class="groupAccess">
                    <div class="title">
                        {{ $t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_SELECT_GROUP_AND_AUTH_SETTING') }}
                    </div>
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
                                         @click="childModify(scope.row, scope.row.FILE_AUTH_FLG, fileAuthFlg)" />
                                    <img v-else-if="scope.row.FILE_AUTH_FLG === 'FALSE'"
                                         :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                         @click="childModify(scope.row, scope.row.FILE_AUTH_FLG, fileAuthFlg)" />
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
                                         @click="childModify(scope.row, scope.row.DIR_AUTH_FLG, dirAuthFlg)" />
                                    <img v-else-if="scope.row.DIR_AUTH_FLG === 'FALSE'"
                                         :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                         @click="childModify(scope.row, scope.row.DIR_AUTH_FLG, dirAuthFlg)" />
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
                                         @click="childModify(scope.row, scope.row.MEMO_AUTH_FLG, memoAuthFlg)" />
                                    <img v-else-if="scope.row.MEMO_AUTH_FLG === 'FALSE'"
                                         :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                         @click="childModify(scope.row, scope.row.MEMO_AUTH_FLG, memoAuthFlg)" />
                                    <img v-else
                                         :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="title">
                        {{ $t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_TITLE_INDIVIDUAL_SETTING') }}
                    </div>
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
                                     @click="childModifyIndividualSet(scope.row, scope.row.READ_AUTH_FLG, readAuthFlg)" />
                                <img v-else-if="scope.row.READ_AUTH_FLG === 'TRUE'"
                                     :src="require('@a/images/usermanagement/usermanagement-yes.svg')"
                                     @click="childModifyIndividualSet(scope.row, scope.row.READ_AUTH_FLG, readAuthFlg)" />
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
                                         @click="childModifyIndividualSet(scope.row, scope.row.FILE_AUTH_FLG, fileAuthFlg)" />
                                    <img v-else-if="scope.row.FILE_AUTH_FLG === 'FALSE'"
                                         :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                         @click="childModifyIndividualSet(scope.row, scope.row.FILE_AUTH_FLG, fileAuthFlg)" />
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
                                         @click="childModifyIndividualSet(scope.row, scope.row.DIR_AUTH_FLG, dirAuthFlg)" />
                                    <img v-else-if="scope.row.DIR_AUTH_FLG === 'FALSE'"
                                         :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                         @click="childModifyIndividualSet(scope.row, scope.row.DIR_AUTH_FLG, dirAuthFlg)" />
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
                                         @click="childModifyIndividualSet(scope.row, scope.row.MEMO_AUTH_FLG, memoAuthFlg)" />
                                    <img v-else-if="scope.row.MEMO_AUTH_FLG === 'FALSE'"
                                         :src="require('@a/images/usermanagement/usermanagement-no.svg')"
                                         @click="childModifyIndividualSet(scope.row, scope.row.MEMO_AUTH_FLG, memoAuthFlg)" />
                                    <img v-else
                                         :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <span slot="footer"
                          class="dialog-footer">
                        <button class="button buttonHighlight"
                                @click="childThePermission">
                            {{ $t('fileAccessGroupListDialog.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING_BUTTON_SAVE') }}
                        </button>
                    </span>
                </el-dialog>
            </div>
            <!-- <GroupUserAccessDialog ref="GroupUserAccessDialog"
                                   @thePermission="thePermission"></GroupUserAccessDialog> -->
            <el-dialog :visible.sync="applyToFoldersBelow"
                       :title="$t('userAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_SAME_SETTINGS_DIALOG_TITLE')"
                       :close-on-click-modal="false"
                       :before-close="applyToFoldersBelowClose"
                       :destroy-on-close="true"
                       append-to-body
                       class="editdialog">
                {{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_SAME_SETTINGS_DIALOG_BODY') }}
                <span slot="footer"
                      class="dialog-footer">
                    <button class="button buttonHighlight margin"
                            @click="allSave">{{ $t('userAccessDialog.DISPLAY_ACCESS_AUTH_SAVE_ANOTHER_USER_BUTTON_SAME_SETTINGS_DIALOG_BUTTON') }}</button>
                </span>
            </el-dialog>
            <el-dialog :visible.sync="toFoldersBelowClose"
                       :title="$t('common.DialogConfirmCancelTitle')"
                       :close-on-click-modal="false"
                       :before-close="cancel"
                       :destroy-on-close="true"
                       append-to-body
                       class="groupingdialog">
                <p v-html="$t('common.DialogConfirmCancelContent')">{{ $t('common.DialogConfirmCancelContent') }}</p>
                <span slot="footer"
                      class="dialog-footer">
                    <button class="button"
                            @click="cancel">{{ $t('common.DialogConfirmCancelButton1') }}</button>
                    <button class="button buttonDelete margin"
                            @click="confirm">{{ $t('common.DialogConfirmCancelButton2') }}</button>
                </span>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
// import GroupUserAccessDialog from '@p/UserManagement/PermissionManagement/tabsView/group/GroupUserAccessDialog.vue'

export default {
    name: 'UserAccessDialog',
    // components: {GroupUserAccessDialog},
    data () {
        return {
            loading: false,
            userAccessDialogVisible: false,
            applyToFoldersBelow: false,
            toFoldersBelowClose: false,
            type: '', // 谁调用的: user : group
            checkedUserData: {}, // 选中组数据
            data: [], // 文件树数据
            dataStringify: '[]', // 文件树初始数据
            dataStringifys: [], // 文件树转字符串数据
            readAuthFlg: 'READ_AUTH_FLG',
            fileAuthFlg: 'FILE_AUTH_FLG',
            dirAuthFlg: 'DIR_AUTH_FLG',
            memoAuthFlg: 'MEMO_AUTH_FLG',
            rowData: {},
            requestIndex: 0,

            groupAccessDialogVisible: false,
            groupAccessData: [{
                TeamMembers: []
            }], // 子深拷贝的数据
            groupAccessDataChildrenStringify: [],
            groupAccessDataStringify: {}
        }
    },
    methods: {
        groupAccessDialogShowEvent (checkedUserData, data) {
            this.userAccessDialogVisible = true
            this.checkedUserData = checkedUserData // 选中的组数据
            this.loading = false
            // this.accessAuth(1).then(data => {
            //     if (data) {
            //         this.data = data
            for (let index = 0; index < data.length; index++) { // 文件树初始数据-字符串数组
                data[index].STATUS = 'initial'
                this.dataStringifys.push({
                    NO: data[index].FOLDER_NO,
                    data: JSON.parse(JSON.stringify(data[index]))
                })
            }
            this.dataStringify = JSON.stringify(data) // 文件树数据
            this.data = JSON.parse(JSON.stringify(data)) // 文件树初始数据-字符串
            //     }
            //     this.loading = false
            // })

            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', this.beforeunloadHandlerGroupAccessDialog, false)
        },
        open () {
            this.$refs.groupAccessDialog.$el.children[0].classList.add('largeDialog')
        },
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
            for (let index = 0; index < this.dataStringifys.length; index++) {
                if (this.dataStringifys[index].NO === row.FOLDER_NO) {
                    if (this.dataStringifys[index].data[flgname] === row[flgname]) {
                        row.STATUS = 'initial'
                    } else {
                        row.STATUS = 'update'
                    }
                    return
                }
            }
        },
        replace (data, FolderData) {
            for (let index = 0; index < FolderData.length; index++) {
                if (FolderData[index].FOLDER_NO === data.FOLDER_NO) {
                    FolderData.splice(index, 1, data)
                    return
                } else {
                    if (FolderData[index].children) {
                        this.replace(data, FolderData[index].children)
                    }
                }
            }
        },
        // 懒加载表格数据 || ローディングテーブルデータ
        loadChildrenMethod ({row}) {
            // 异步加载子节点
            return this.accessAuth(row.FOLDER_NO)
        },
        // 获取文件夹
        accessAuth (NO) {
            const body = (`{"GROUPNO": "${this.checkedUserData.GROUP_NO}", "USERNO": ""}`)
            return this.$request.access.AccessAuth(NO, body).then(response => {
                console.log('AccessAuth-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    for (let index = 0; index < data.result.length; index++) {
                        data.result[index].STATUS = 'initial'
                    }
                    for (let index = 0; index < data.result.length; index++) {
                        this.dataStringifys.push({
                            NO: data.result[index].FOLDER_NO,
                            data: JSON.parse(JSON.stringify(data.result[index]))
                        })
                    }
                    if (NO !== 1) this.requestIndex += 1
                    return data.result
                }
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.accessAuth(NO) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`AccessAuth-get请求失败:`, err, 'GroupAccessDialog')
                }
            })
        },
        // show
        show () {
            if (this.dataStringify === JSON.stringify(this.data)) return
            this.applyToFoldersBelow = true
        },
        allSave () {
            this.applyToFoldersBelowClose()
            this.save(true)
        },
        save (bool = false) {
            if (this.dataStringify === JSON.stringify(this.data)) {
                return
            }
            this.loading = true
            const body = (
                `{"AUTH_LIST":${JSON.stringify(this.data)},"ADAPTATION": "${bool}","ISUSER":"FALSE"}`
            )
            this.$request.access.AccessAuthUserGroup(
                this.checkedUserData.GROUP_USER_NO || this.checkedUserData.GROUP_NO, body
            ).then(response => {
                console.log('AccessAuthUserGroup-pacth请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]' && data !== '') {
                    this.$message.success(this.$t('userAccessDialog.MESSAGE_UPDATA_SUCCESS'))
                    this.confirm()
                    this.$emit('accessAuth')
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.save(bool) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`AccessAuthUserGroup-pacth请求失败:`, err, 'GroupAccessDialog')
                }
            })
        },
        // 关闭
        close () {
            if (this.dataStringify !== JSON.stringify(this.data)) {
                this.toFoldersBelowClose = true
            } else {
                this.confirm()
            }
        },
        // close
        applyToFoldersBelowClose () {
            this.applyToFoldersBelow = false
        },
        // 取消退出
        cancel () {
            this.toFoldersBelowClose = false
        },
        // 确认退出
        confirm () {
            this.toFoldersBelowClose = false
            this.userAccessDialogVisible = false
            // 离开页面时,重置data的数据
            Object.assign(this.$data, this.$options.data())
            window.removeEventListener('beforeunload', this.beforeunloadHandlerGroupAccessDialog, false)
        },
        cellClassName ({row}) {
            if (row.STATUS === 'update') {
                return 'td__update'
            }
        },
        // 浏览器刷新事件
        beforeunloadHandlerGroupAccessDialog (e) {
            const beforeunload = this.dataStringify !== JSON.stringify(this.data)
            console.log('利用者管理-->权限-->group')
            if (beforeunload || this.requestIndex > 0) {
                e = e || window.event
                if (e) e.returnValue = '关闭提示'
                return beforeunload
            }
            return
        },

        /* child */
        // 组内人员个别设定
        individualSettings (row) {
            this.rowData = row
            window.removeEventListener('beforeunload', this.beforeunloadHandlerGroupAccessDialog, false)
            this.childGroupAccessDialogShowEvent(row, this.checkedUserData)
        },
        // 显示
        childGroupAccessDialogShowEvent (GroupAccessData, checkedUserData) {
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
            window.addEventListener('beforeunload', this.childBeforeunloadHandlerGroupUserAccessDialog, false)
        },
        // 修改アクセス権限設定的数据
        childModify (row, flg, flgname) {
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
        childModifyIndividualSet (row, flg, flgname) {
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
        // close
        childThePermission () {
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
            this.childClose()
            this.thePermission(this.groupAccessData[0])
        },
        // 组内人员个别设定回调
        thePermission (data) {
            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', this.beforeunloadHandlerGroupAccessDialog, false)
            this.replace(data, this.data)
        },
        // 关闭
        childClose () {
            this.groupAccessDialogVisible = false
            // 离开页面时,重置data的数据
            Object.assign(this.$data, this.$options.data())
            window.removeEventListener('beforeunload', this.childBeforeunloadHandlerGroupUserAccessDialog, false)
        },
        // 浏览器刷新事件
        childBeforeunloadHandlerGroupUserAccessDialog (e) {
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
@import url("../../../../../less/pages/UserManagement/PermissionManagement/tabsView/dialog/AccessDialog.less");
@import url(
    "../../../../../less/pages/UserManagement/PermissionManagement/tabsView/dialog/GroupUserAccessDialog.less");
</style>
