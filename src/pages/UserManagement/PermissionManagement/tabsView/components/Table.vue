<template>
    <div id="userTable"
         v-loading="loading"
         :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(255,255,255,.9)">
        <vxe-table highlight-hover-row
                   auto-resize
                   row-key
                   show-overflow="title"
                   ref="xTable"
                   border="none"
                   row-id="FOLDER_NO"
                   size="small"
                   :header-cell-style="{
                       'padding': '0',
                       'font-weight': 'unset'
                   }"
                   :tree-config="{
                       lazy: true,
                       line: true,
                       indent: 20,
                       children: 'children',
                       hasChild: 'hasChild',
                       loadMethod: loadChildrenMethod,
                       iconClose:'iconfont chexplus-square-o',
                       iconOpen: 'iconfont chexminus-square-o'}"
                   :data="data"
                   class="vxetable"
                   height="100%">
            <vxe-table-column :title="$t('table.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FOLDER')"
                              align="left"
                              tree-node>
                <template v-slot="{ row }">
                    <img class="img folder"
                         :src="require('@a/images/file/file-tree-icon-12.svg')" />
                    <span class="filenameSpan">{{ row.FOLDER_NAME }} </span>
                </template>
            </vxe-table-column>
            <vxe-table-column :title="$t('table.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TOOLTIP_READ_ICON')"
                              align="center"
                              width="60">
                <template v-slot="{ row }">
                    <img v-if="row.READ_AUTH_FLG === 'FALSE'"
                         class="img"
                         :src="require('@a/images/usermanagement/usermanagement-no.svg')" />
                    <img v-else-if="row.READ_AUTH_FLG === 'TRUE'"
                         class="img"
                         :src="require('@a/images/usermanagement/usermanagement-yes.svg')" />
                    <img v-else
                         class="img"
                         :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                </template>
            </vxe-table-column>
            <vxe-table-column :title="$t('table.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FILE')"
                              align="center"
                              width="90">
                <template v-slot="{ row }">
                    <div v-if="row.READ_AUTH_FLG === 'FALSE'">
                        <img class="img"
                             :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                    </div>
                    <div v-else>
                        <img v-if="row.FILE_AUTH_FLG === 'TRUE'"
                             class="img"
                             :src="require('@a/images/usermanagement/usermanagement-yes.svg')" />
                        <img v-else-if="row.FILE_AUTH_FLG === 'FALSE'"
                             class="img"
                             :src="require('@a/images/usermanagement/usermanagement-no.svg')" />
                        <img v-else
                             class="img"
                             :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                    </div>
                </template>
            </vxe-table-column>
            <vxe-table-column :title="$t('table.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FOLDER')"
                              align="center"
                              width="90">
                <template v-slot="{ row }">
                    <div v-if="row.READ_AUTH_FLG === 'FALSE'">
                        <img class="img"
                             :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                    </div>
                    <div v-else>
                        <img v-if="row.DIR_AUTH_FLG === 'TRUE'"
                             class="img"
                             :src="require('@a/images/usermanagement/usermanagement-yes.svg')" />
                        <img v-else-if="row.DIR_AUTH_FLG === 'FALSE'"
                             class="img"
                             :src="require('@a/images/usermanagement/usermanagement-no.svg')" />
                        <img v-else
                             class="img"
                             :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                    </div>
                </template>
            </vxe-table-column>
            <vxe-table-column :title="$t('table.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_NOTE')"
                              align="center"
                              width="60">
                <template v-slot="{ row }">
                    <div v-if="row.READ_AUTH_FLG === 'FALSE'">
                        <img class="img"
                             :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                    </div>
                    <div v-else>
                        <img v-if="row.MEMO_AUTH_FLG === 'TRUE'"
                             class="img"
                             :src="require('@a/images/usermanagement/usermanagement-yes.svg')" />
                        <img v-else-if="row.MEMO_AUTH_FLG === 'FALSE'"
                             class="img"
                             :src="require('@a/images/usermanagement/usermanagement-no.svg')" />
                        <img v-else
                             class="img"
                             :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                    </div>
                </template>
            </vxe-table-column>
            <vxe-table-column :visible="remarks"
                              :title="$t('table.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_REMARKS')"
                              align="center"
                              width="60">
                <template v-slot="{ row }">
                    <div v-if="row.DERIVATION !== 'USER'"
                         class="groupFlg">
                        <div v-if="row.EX_FLG === 'TRUE' && row.PROHIBIT_PRIORITY_FLG === 'FALSE'"
                             style="padding: 6.5px 0px;">
                            <p style="color: #4146CD;">{{ $t('table.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING') }}</p>
                        </div>
                        <div v-if="row.EX_FLG === 'FALSE' && row.PROHIBIT_PRIORITY_FLG === 'TRUE'"
                             style="padding: 6.5px 0px;">
                            <p style="color: #D61918;">{{ $t('table.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_PROHIBITION_PRIORITY') }}</p>
                        </div>
                        <div v-if="row.EX_FLG === 'TRUE' && row.PROHIBIT_PRIORITY_FLG === 'TRUE'">
                            <p style="color: #4146CD;">{{ $t('table.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING') }}</p>
                            <p style="color: #D61918;">{{ $t('table.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_PROHIBITION_PRIORITY') }}</p>
                        </div>
                    </div>
                </template>
            </vxe-table-column>

            <template v-slot:empty>
                <span>
                    <p>{{ $t('table.MESSAGE_ACCESS_AUTH_DG_AUTH_ROW_TOOLTIP_NO_DATA') }}</p>
                </span>
            </template>
        </vxe-table>
    </div>
</template>

<script>
// import bus from '@c/bus.js'

export default {
    name: 'UserTable',
    props: {
        remarks: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'user'
        }
    },
    data () {
        return {
            loading: false,
            checkedUserData: {},
            data: []
        }
    },
    methods: {
        refl (checkedUserData) {
            this.checkedUserData = checkedUserData
            this.loading = true
            this.accessAuth(1).then(data => {
                if (data) {
                    this.data = data
                    this.$emit('AccessClick')
                } else {
                    this.$emit('AccessClick', false)
                }
                this.loading = false
            })
        },
        // 获取数据
        getData () {
            return this.$refs.xTable.getData()
        },
        // 懒加载表格数据 || ローディングテーブルデータ
        loadChildrenMethod ({row}) {
            // 异步加载子节点
            return this.accessAuth(row.FOLDER_NO)
        },
        // 获取文件夹
        accessAuth (NO) {
            let Body = (`{"GROUPNO": "", "USERNO": "${this.checkedUserData.GROUP_USER_NO}"}`)
            if (this.type === 'group') {
                Body = (`{"GROUPNO": "${this.checkedUserData.GROUP_NO}", "USERNO": ""}`)
            }
            return this.$request.access.AccessAuth(NO, Body).then(response => {
                console.log('AccessAuth-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    return data.result
                }
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.accessAuth(NO) : ''
                    })
                } else {
                    this.$request.requestError(`AccessAuth-get请求失败:`, err, 'Table')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../../less/pages/UserManagement/PermissionManagement/tabsView/components/Table.less");
</style>
